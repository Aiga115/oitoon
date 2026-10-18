from django.contrib.auth.models import User
from rest_framework.test import APITestCase

from .models import Genre, Rating, Story
import io
import tempfile
from unittest.mock import patch

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from PIL import Image

import pandas as pd
from django.core.cache import cache
from django.core.management import call_command
from django.test import SimpleTestCase, TestCase, override_settings   # (keep override_settings)

from .recommender import CACHE_KEY, score_candidates, similarity_from_ratings

class BaseTest(APITestCase):
    """Builds the same small world before every test (the test database is empty each time)."""

    def setUp(self):
        self.anna = User.objects.create_user("anna", password="secret1234")
        self.ben = User.objects.create_user("ben", password="secret1234")
        self.admin = User.objects.create_user("mod1", password="secret1234", is_staff=True)
        self.root = User.objects.create_superuser("root", password="secret1234")
        self.story = Story.objects.create(author=self.anna, title="Anna story", content="<p>Hello</p>")

    def login_as(self, user):
        self.client.force_authenticate(user=user)   # pretends this user sent a valid token


class AuthTests(BaseTest):
    def test_register_hashes_password(self):
        r = self.client.post("/api/auth/register/", {"username": "carl", "password": "secret1234"})
        self.assertEqual(r.status_code, 201)
        carl = User.objects.get(username="carl")
        self.assertNotEqual(carl.password, "secret1234")
        self.assertTrue(carl.check_password("secret1234"))

    def test_user_login_returns_tokens(self):
        r = self.client.post("/api/auth/token/", {"username": "anna", "password": "secret1234"})
        self.assertEqual(r.status_code, 200)
        self.assertIn("access", r.data)
        self.assertIn("refresh", r.data)

    def test_admin_cannot_use_user_login(self):
        r = self.client.post("/api/auth/token/", {"username": "mod1", "password": "secret1234"})
        self.assertEqual(r.status_code, 401)

    def test_user_cannot_use_admin_login(self):
        r = self.client.post("/api/admin/auth/token/", {"username": "anna", "password": "secret1234"})
        self.assertEqual(r.status_code, 401)

    def test_admin_login_works_for_staff(self):
        r = self.client.post("/api/admin/auth/token/", {"username": "mod1", "password": "secret1234"})
        self.assertEqual(r.status_code, 200)
        self.assertIn("access", r.data)


class StoryTests(BaseTest):
    def test_create_story_needs_login(self):
        r = self.client.post("/api/stories/", {"title": "T", "content": "<p>x</p>"})
        self.assertEqual(r.status_code, 401)

    def test_create_story_strips_script(self):
        self.login_as(self.anna)
        r = self.client.post("/api/stories/", {
            "title": "T",
            "content": "<p>Hi<script>alert(1)</script><strong>bold</strong></p>",
        })
        self.assertEqual(r.status_code, 201)
        self.assertNotIn("<script", r.data["content"])
        self.assertIn("<strong>bold</strong>", r.data["content"])

    def test_admin_cannot_create_story(self):
        self.login_as(self.admin)
        r = self.client.post("/api/stories/", {"title": "T", "content": "<p>x</p>"})
        self.assertEqual(r.status_code, 403)

    def test_only_owner_can_edit_or_delete(self):
        url = f"/api/stories/{self.story.id}/"
        data = {"title": "Changed", "content": "<p>New</p>"}
        self.login_as(self.ben)
        self.assertEqual(self.client.put(url, data).status_code, 403)
        self.assertEqual(self.client.delete(url).status_code, 403)
        self.login_as(self.anna)
        self.assertEqual(self.client.put(url, data).status_code, 200)
        self.story.refresh_from_db()
        self.assertEqual(self.story.title, "Changed")

    def test_unpublished_story_hidden_from_public_list(self):
        Story.objects.create(author=self.anna, title="Secret", content="<p>x</p>", is_published=False)
        titles = [s["title"] for s in self.client.get("/api/stories/").data]
        self.assertIn("Anna story", titles)
        self.assertNotIn("Secret", titles)


class RatingTests(BaseTest):
    def setUp(self):
        super().setUp()
        self.url = f"/api/stories/{self.story.id}/rating/"

    def test_rate_and_change_rating(self):
        self.login_as(self.ben)
        self.assertEqual(self.client.put(self.url, {"value": 4}).status_code, 200)
        self.assertEqual(self.client.put(self.url, {"value": 5}).status_code, 200)
        self.assertEqual(Rating.objects.count(), 1)       # changed, not duplicated
        self.assertEqual(Rating.objects.get().value, 5)

    def test_cannot_rate_own_story(self):
        self.login_as(self.anna)
        self.assertEqual(self.client.put(self.url, {"value": 5}).status_code, 403)
        self.assertEqual(Rating.objects.count(), 0)

    def test_rating_out_of_range_rejected(self):
        self.login_as(self.ben)
        self.assertEqual(self.client.put(self.url, {"value": 6}).status_code, 400)

    def test_remove_rating(self):
        self.login_as(self.ben)
        self.client.put(self.url, {"value": 3})
        self.assertEqual(self.client.delete(self.url).status_code, 204)
        self.assertEqual(self.client.delete(self.url).status_code, 404)


class AdminApiTests(BaseTest):
    def test_normal_user_blocked_from_admin_api(self):
        self.login_as(self.ben)
        self.assertEqual(self.client.get("/api/admin/users/").status_code, 403)
        self.assertEqual(self.client.get("/api/admin/stories/").status_code, 403)

    def test_user_list_never_contains_password(self):
        self.login_as(self.admin)
        r = self.client.get("/api/admin/users/")
        self.assertEqual(r.status_code, 200)
        self.assertEqual(len(r.data), 4)
        for item in r.data:
            self.assertNotIn("password", item)

    def test_admin_cannot_delete_self_or_superuser(self):
        self.login_as(self.admin)
        self.assertEqual(self.client.delete(f"/api/admin/users/{self.admin.id}/").status_code, 403)
        self.assertEqual(self.client.delete(f"/api/admin/users/{self.root.id}/").status_code, 403)
        self.assertEqual(self.client.delete(f"/api/admin/users/{self.ben.id}/").status_code, 204)
        self.assertFalse(User.objects.filter(username="ben").exists())

    def test_admin_can_unpublish_story(self):
        self.login_as(self.admin)
        r = self.client.patch(f"/api/admin/stories/{self.story.id}/", {"is_published": False})
        self.assertEqual(r.status_code, 200)
        # the public no longer sees it...
        self.client.force_authenticate(user=None)
        titles = [s["title"] for s in self.client.get("/api/stories/").data]
        self.assertNotIn("Anna story", titles)
        # ...but the admin list still does
        self.login_as(self.admin)
        ids = [s["id"] for s in self.client.get("/api/admin/stories/").data]
        self.assertIn(self.story.id, ids)
        
def make_image(name="cover.png"):
    """A tiny real PNG made in memory."""
    buf = io.BytesIO()
    Image.new("RGB", (40, 40), "navy").save(buf, "PNG")
    return SimpleUploadedFile(name, buf.getvalue(), content_type="image/png")


@override_settings(MEDIA_ROOT=tempfile.mkdtemp())     # test uploads go to a temp folder, not your media/
class CoverTests(BaseTest):
    def post_story(self, cover):
        return self.client.post("/api/stories/", {"title": "T", "content": "<p>x</p>", "cover": cover},
                                format="multipart")

    def test_upload_cover(self):
        self.login_as(self.anna)
        r = self.post_story(make_image())
        self.assertEqual(r.status_code, 201)
        self.assertTrue(r.data["cover"].endswith(".png"))

    def test_fake_image_rejected(self):
        self.login_as(self.anna)
        fake = SimpleUploadedFile("fake.png", b"this is not an image", content_type="image/png")
        self.assertEqual(self.post_story(fake).status_code, 400)

    def test_too_large_cover_rejected(self):
        self.login_as(self.anna)
        with patch("stories.serializers.MAX_COVER_BYTES", 10):      # pretend the limit is 10 bytes
            self.assertEqual(self.post_story(make_image()).status_code, 400)

    def test_remove_cover(self):
        self.login_as(self.anna)
        story_id = self.post_story(make_image()).data["id"]
        r = self.client.put(f"/api/stories/{story_id}/", {"title": "T", "content": "<p>x</p>", "cover": ""},
                            format="multipart")
        self.assertEqual(r.status_code, 200)
        self.assertIsNone(r.data["cover"])
        
class DiscoveryTests(BaseTest):
    def setUp(self):
        super().setUp()
        self.fantasy = Genre.objects.get(slug="fantasy")
        self.horror = Genre.objects.get(slug="horror")
        self.story.genres.add(self.fantasy)                         # "Anna story", status done
        self.dark = Story.objects.create(author=self.ben, title="Dark Night",
                                         content="<p>x</p>", status="coming_out")
        self.dark.genres.add(self.horror, self.fantasy)
        self.draft = Story.objects.create(author=self.ben, title="Hidden Draft",
                                          content="<p>x</p>", status="draft")

    def titles(self, query=""):
        return [s["title"] for s in self.client.get("/api/stories/" + query).data]

    # --- genres ---
    def test_only_listed_genres_exist(self):
        slugs = [g["slug"] for g in self.client.get("/api/genres/").data]
        self.assertEqual(slugs, ["fantasy", "horror", "romcom", "action",
                                 "slice-of-life", "superhero", "sci-fi", "drama"])

    def test_unknown_genre_rejected(self):
        self.login_as(self.anna)
        r = self.client.post("/api/stories/", {"title": "T", "content": "<p>x</p>", "genres": ["western"]})
        self.assertEqual(r.status_code, 400)

    def test_story_with_several_genres(self):
        self.login_as(self.anna)
        r = self.client.post("/api/stories/", {"title": "T", "content": "<p>x</p>",
                                               "genres": ["sci-fi", "drama"], "status": "coming_out"})
        self.assertEqual(r.status_code, 201)
        self.assertEqual(sorted(r.data["genres"]), ["drama", "sci-fi"])
        self.assertEqual(r.data["status"], "coming_out")

    # --- drafts ---
    def test_drafts_are_not_public(self):
        self.assertNotIn("Hidden Draft", self.titles())

    def test_mine_shows_drafts_only_to_their_author(self):
        self.login_as(self.ben)
        self.assertIn("Hidden Draft", self.titles("?mine=1"))
        self.login_as(self.anna)
        self.assertNotIn("Hidden Draft", self.titles("?mine=1"))

    def test_draft_page_only_for_author(self):
        url = f"/api/stories/{self.draft.id}/"
        self.assertEqual(self.client.get(url).status_code, 404)
        self.login_as(self.anna)
        self.assertEqual(self.client.get(url).status_code, 404)
        self.login_as(self.ben)
        self.assertEqual(self.client.get(url).status_code, 200)

    def test_publish_a_draft(self):
        self.login_as(self.ben)
        r = self.client.put(f"/api/stories/{self.draft.id}/",
                            {"title": "Hidden Draft", "content": "<p>x</p>", "status": "done"})
        self.assertEqual(r.status_code, 200)
        self.client.force_authenticate(user=None)
        self.assertIn("Hidden Draft", self.titles())

    def test_cannot_rate_a_draft(self):
        self.login_as(self.anna)
        r = self.client.put(f"/api/stories/{self.draft.id}/rating/", {"value": 4})
        self.assertEqual(r.status_code, 404)

    # --- search, filters, popularity ---
    def test_search_by_title_and_author(self):
        self.assertEqual(self.titles("?search=dark"), ["Dark Night"])
        self.assertEqual(self.titles("?search=anna"), ["Anna story"])

    def test_filter_by_genre(self):
        self.assertEqual(self.titles("?genre=horror"), ["Dark Night"])
        self.assertCountEqual(self.titles("?genre=fantasy"), ["Anna story", "Dark Night"])

    def test_filter_by_status(self):
        self.assertEqual(self.titles("?status=done"), ["Anna story"])
        self.assertEqual(self.titles("?status=coming_out"), ["Dark Night"])

    def test_sort_by_popularity(self):
        Rating.objects.create(user=self.ben, story=self.story, value=4)
        Rating.objects.create(user=self.root, story=self.story, value=5)
        self.assertEqual(self.titles(), ["Dark Night", "Anna story"])
        self.assertEqual(self.titles("?sort=popular"), ["Anna story", "Dark Night"])
        
def ratings_frame(rows):
    """(reader, story, value) tuples -> DataFrame, like the one built from the database."""
    return pd.DataFrame(rows, columns=["user_id", "story_id", "value"])


# The tiny matrix. Both readers have average 3, so after centring:
#   r1: +2 -2 +2 -2      r2: +1 -1 +1 -1
# Stories 1 and 3 move together, stories 1 and 2 move in opposite directions.
TINY = [
    ("r1", 1, 5), ("r1", 2, 1), ("r1", 3, 5), ("r1", 4, 1),
    ("r2", 1, 4), ("r2", 2, 2), ("r2", 3, 4), ("r2", 4, 2),
]


class SimilarityTests(SimpleTestCase):          # no database needed
    def test_same_direction_is_plus_one_and_opposite_is_minus_one(self):
        sim = similarity_from_ratings(ratings_frame(TINY))
        self.assertAlmostEqual(sim.loc[1, 3], 1.0)      # (2*2 + 1*1) / (sqrt5 * sqrt5)
        self.assertAlmostEqual(sim.loc[1, 2], -1.0)     # (2*-2 + 1*-1) / (sqrt5 * sqrt5)
        self.assertAlmostEqual(sim.loc[2, 4], 1.0)

    def test_a_story_is_not_similar_to_itself(self):
        sim = similarity_from_ratings(ratings_frame(TINY))
        self.assertEqual(sim.loc[1, 1], 0.0)

    def test_pair_with_one_shared_rater_is_ignored(self):
        rows = TINY + [("r3", 1, 5), ("r3", 5, 1)]       # only r3 rated story 5, together with story 1
        sim = similarity_from_ratings(ratings_frame(rows))
        self.assertEqual(sim.loc[1, 5], 0.0)             # would be -1 if one shared rater were enough

    def test_reader_who_rates_everything_the_same_has_no_influence(self):
        rows = TINY + [("r4", 1, 5), ("r4", 2, 5), ("r4", 3, 5), ("r4", 4, 5)]
        sim = similarity_from_ratings(ratings_frame(rows))
        self.assertAlmostEqual(sim.loc[1, 3], 1.0)
        self.assertAlmostEqual(sim.loc[1, 2], -1.0)

    def test_scores_for_a_reader(self):
        sim = similarity_from_ratings(ratings_frame(TINY))
        # reader rated story 1 = 5 and story 2 = 1: average 3, so +2 and -2
        scores = score_candidates(sim, {1: 5, 2: 1})
        self.assertAlmostEqual(scores[3], 1 * 2 + (-1) * (-2))     # = 4
        self.assertAlmostEqual(scores[4], (-1) * 2 + 1 * (-2))     # = -4

    def test_no_ratings_give_an_empty_matrix(self):
        self.assertTrue(similarity_from_ratings(ratings_frame([])).empty)


class RecommendationApiTests(BaseTest):
    """The same matrix, but stored in the database and asked for through the API."""

    def setUp(self):
        super().setUp()
        cache.clear()
        self.r1 = User.objects.create_user("r1", password="secret1234")
        self.r2 = User.objects.create_user("r2", password="secret1234")
        self.viewer = User.objects.create_user("viewer", password="secret1234")
        self.newbie = User.objects.create_user("newbie", password="secret1234")

        def make(title, author, status="done"):
            return Story.objects.create(author=author, title=title, content="<p>x</p>", status=status)

        self.s = {n: make(f"S{n}", self.anna) for n in range(1, 6)}
        self.hidden = make("Draft", self.anna, status="draft")    # rated like story 3, but not public
        self.mine = make("Mine", self.viewer)                       # rated like story 3, but the viewer's own

        # r1 / r2 ratings: the TINY matrix, plus the two extra stories rated like story 3
        for story, a, b in [(self.s[1], 5, 4), (self.s[2], 1, 2), (self.s[3], 5, 4),
                            (self.s[4], 1, 2), (self.hidden, 5, 4), (self.mine, 5, 4)]:
            Rating.objects.create(user=self.r1, story=story, value=a)
            Rating.objects.create(user=self.r2, story=story, value=b)

        # the viewer: average 3, likes story 1 (+2), dislikes story 2 (-2), story 5 is neutral
        for n, value in [(1, 5), (2, 1), (5, 3)]:
            Rating.objects.create(user=self.viewer, story=self.s[n], value=value)

    def ids(self, response):
        return [s["id"] for s in response.data["results"]]

    def test_personalised_list_follows_the_formula_and_the_exclusions(self):
        self.login_as(self.viewer)
        r = self.client.get("/api/recommendations/")
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.data["mode"], "personalised")
        # story 3 scores +4. Story 4 scores -4. Stories 1, 2, 5 are already rated,
        # "Mine" is the reader's own and "Draft" is not public, although both score +4.
        self.assertEqual(self.ids(r), [self.s[3].id])

    def test_cold_start_shows_top_rated_stories(self):
        self.login_as(self.newbie)
        r = self.client.get("/api/recommendations/")
        self.assertEqual(r.data["mode"], "top_rated")
        ids = self.ids(r)
        self.assertEqual(ids[0], self.s[1].id)           # best average: 5, 4, 5
        self.assertNotIn(self.s[5].id, ids)               # only one rating
        self.assertNotIn(self.hidden.id, ids)             # not public

    def test_two_ratings_is_still_cold_start(self):
        Rating.objects.create(user=self.newbie, story=self.s[1], value=5)
        Rating.objects.create(user=self.newbie, story=self.s[2], value=1)
        self.login_as(self.newbie)
        r = self.client.get("/api/recommendations/")
        self.assertEqual(r.data["mode"], "top_rated")
        self.assertEqual(r.data["ratings_given"], 2)

    def test_no_dummy_ratings_are_created(self):
        before = Rating.objects.count()
        self.login_as(self.newbie)
        self.client.get("/api/recommendations/")
        self.assertEqual(Rating.objects.count(), before)

    def test_cache_is_filled_and_cleared_when_a_rating_changes(self):
        self.login_as(self.viewer)
        self.client.get("/api/recommendations/")
        self.assertIsNotNone(cache.get(CACHE_KEY))                               # filled by the request
        self.client.put(f"/api/stories/{self.s[3].id}/rating/", {"value": 4})    # the viewer saves a rating
        self.assertIsNone(cache.get(CACHE_KEY))                                  # cleared by the signal

    def test_only_normal_users_can_ask(self):
        self.assertEqual(self.client.get("/api/recommendations/").status_code, 401)
        self.login_as(self.admin)
        self.assertEqual(self.client.get("/api/recommendations/").status_code, 403)


class SeedCommandTests(TestCase):
    def test_seed_creates_users_stories_and_ratings_once(self):
        args = dict(users=5, stories=10, ratings=30, stdout=io.StringIO(), stderr=io.StringIO())
        call_command("seed_demo", **args)
        self.assertEqual(User.objects.filter(username__startswith="demo_").count(), 5)
        self.assertEqual(Story.objects.filter(author__username__startswith="demo_").count(), 10)
        self.assertGreater(Rating.objects.count(), 0)
        call_command("seed_demo", **args)
        self.assertEqual(Story.objects.filter(author__username__startswith="demo_").count(), 10)