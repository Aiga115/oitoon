#Item-based collaborative filtering
import numpy as np
import pandas as pd
from django.core.cache import cache
from django.db.models import Avg, Count
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from .models import Rating, Story

CACHE_KEY = "similarity_matrix"
CACHE_SECONDS = 3600
MIN_SHARED_RATERS = 2
MIN_RATINGS = 3
TOP_N = 10


def similarity_from_ratings(ratings, min_shared=MIN_SHARED_RATERS):
    """ratings: DataFrame with columns user_id, story_id, value.
    Returns a story x story DataFrame of similarities between -1 and 1."""
    if ratings.empty:
        return pd.DataFrame()
    ratings = ratings.astype({"value": float})

    table = ratings.pivot_table(index="user_id", columns="story_id", values="value")   # NaN = not rated
    mask = table.notna().astype(float)                                # 1 where the reader rated the story
    centred = table.sub(table.mean(axis=1), axis=0).fillna(0.0)       # rating minus the reader's own average

    numerator = centred.T @ centred          # sum over readers of (a * b); zero unless the reader rated both
    squares = (centred ** 2).T @ mask        # [i, j] = squared centred ratings of i, over readers who rated j
    shared = mask.T @ mask                   # [i, j] = number of readers who rated both i and j
    denominator = np.sqrt(squares) * np.sqrt(squares.T)

    sim = numerator / denominator.where(denominator > 0)     # divide only where the denominator is not 0
    sim = sim.where(shared >= min_shared, 0.0).fillna(0.0)   # too few shared raters: similarity 0

    values = sim.to_numpy(copy=True)
    np.fill_diagonal(values, 0.0)                            # a story is not "similar" to itself
    return pd.DataFrame(values, index=sim.index, columns=sim.columns)


def get_similarity():
    """The similarity matrix, from the cache when possible."""
    sim = cache.get(CACHE_KEY)
    if sim is None:
        rows = Rating.objects.values("user_id", "story_id", "value")
        ratings = pd.DataFrame(list(rows), columns=["user_id", "story_id", "value"])
        sim = similarity_from_ratings(ratings)
        cache.set(CACHE_KEY, sim, CACHE_SECONDS)
    return sim


def clear_cache():
    cache.delete(CACHE_KEY)


def score_candidates(sim, my_ratings):
    """my_ratings: {story_id: value} of one reader. Returns a Series story_id -> score."""
    mean = sum(my_ratings.values()) / len(my_ratings)
    scores = pd.Series(0.0, index=sim.columns)
    for story_id, value in my_ratings.items():
        if story_id in sim.index:
            scores += sim.loc[story_id] * (value - mean)     # similarity x (rating - average)
    return scores


def top_rated_ids(user, my_ratings):
    """Fallback: best-rated public stories with at least 2 ratings (not the reader's own, not already rated)."""
    stories = (
        Story.objects.public()
        .exclude(author=user)
        .exclude(id__in=list(my_ratings))
        .annotate(num=Count("ratings"), avg=Avg("ratings__value"))
        .filter(num__gte=2)
        .order_by("-avg", "-num", "-created_at")
    )
    return list(stories.values_list("id", flat=True)[:TOP_N])


def recommend_for(user):
    """Returns (mode, story ids in order, number of ratings the reader has given)."""
    my_ratings = dict(Rating.objects.filter(user=user).values_list("story_id", "value"))

    if len(my_ratings) >= MIN_RATINGS:
        scores = score_candidates(get_similarity(), my_ratings)
        allowed = set(
            Story.objects.public().exclude(author=user)
            .exclude(id__in=list(my_ratings)).values_list("id", flat=True)
        )
        scores = scores[scores.index.isin(allowed)]
        scores = scores[scores > 0].sort_values(ascending=False, kind="stable")
        if len(scores) > 0:
            return "personalised", [int(i) for i in scores.index[:TOP_N]], len(my_ratings)

    return "top_rated", top_rated_ids(user, my_ratings), len(my_ratings)


@receiver([post_save, post_delete], sender=Rating)
def clear_cache_when_ratings_change(sender, **kwargs):
    """Any rating saved or deleted (also by deleting a story or a user) makes the matrix out of date."""
    clear_cache()