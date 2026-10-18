import html
import json
import re
import random
from pathlib import Path

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from django.db import transaction

from stories.models import Genre, Rating, Story
from stories.recommender import clear_cache

DATA_FILE = Path(__file__).resolve().parents[2] / "data" / "tinystories_sample.json"
PREFIX = "demo_"      # every demo user starts with this, so --reset only touches demo data


KEYWORDS = [
    ("superhero", {"superhero", "cape", "superpower", "hero"}),
    ("sci-fi", {"robot", "space", "alien", "planet", "rocket", "spaceship"}),
    ("fantasy", {"dragon", "magic", "wizard", "fairy", "castle", "princess", "witch", "unicorn"}),
    ("horror", {"ghost", "monster", "haunted", "spooky", "scary"}),
    ("action", {"race", "chase", "fight", "battle", "rescue", "escape"}),
    ("romcom", {"wedding", "kiss", "crush", "married"}),
    ("drama", {"cried", "lonely", "sad", "sorry", "angry"}),
]


def make_title(text):
    """The first sentence, cut at about 60 characters."""
    first = re.split(r"(?<=[.!?])\s", text.strip(), maxsplit=1)[0]
    if len(first) > 60:
        first = first[:60].rsplit(" ", 1)[0]
    return first.strip(" .,!?\"'") or "Untitled"


def make_content(text):
    """Plain text -> safe HTML: escape special characters and wrap each line in <p>."""
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    return "".join(f"<p>{html.escape(line)}</p>" for line in lines)


def pick_genres(text):
    """Up to 2 genres whose keywords appear in the text."""
    words = {w.strip(".,!?\"';:()") for w in text.lower().split()}
    words |= {w[:-1] for w in words if w.endswith("s")}      # dragons -> dragon
    found = [slug for slug, keys in KEYWORDS if keys & words][:2]
    return found or ["slice-of-life"]


class Command(BaseCommand):
    help = "Create demo users and stories from the TinyStories sample."

    def add_arguments(self, parser):
        parser.add_argument("--users", type=int, default=25)
        parser.add_argument("--stories", type=int, default=60)
        parser.add_argument("--password", default="demo-pass-1234", help="password of the demo users")
        parser.add_argument("--reset", action="store_true", help="delete earlier demo users and their stories first")
        parser.add_argument("--ratings", type=int, default=400)

    @transaction.atomic
    def handle(self, *args, **options):
        if options["reset"]:
            User.objects.filter(username__startswith=PREFIX).delete()
        elif User.objects.filter(username__startswith=PREFIX).exists():
            self.stderr.write("Demo data already exists. Run again with --reset to recreate it.")
            return

        texts = json.loads(DATA_FILE.read_text(encoding="utf-8"))[: options["stories"]]
        users = [User.objects.create_user(f"{PREFIX}{n:02d}", password=options["password"])
                 for n in range(1, options["users"] + 1)]
        genres = {g.slug: g for g in Genre.objects.all()}
        genre_counts = {}
        created = []

        for i, text in enumerate(texts):
            story = Story.objects.create(
                author=users[i % len(users)],                          # authors take turns
                title=make_title(text),
                content=make_content(text),
                status="coming_out" if i % 5 == 0 else "done",         # every 5th story is still "coming out"
            )
            slugs = pick_genres(text)
            story.genres.set([genres[s] for s in slugs])
            for slug in slugs:
                genre_counts[slug] = genre_counts.get(slug, 0) + 1
            created.append(story)

        n_ratings = self.make_ratings(users, created, options["ratings"])

        self.stdout.write(self.style.SUCCESS(
            f"Created {len(users)} users, {len(created)} stories and {n_ratings} ratings."))
        self.stdout.write(f"Genres: {genre_counts}")
        self.stdout.write(f"Demo logins: {PREFIX}01 ... {PREFIX}{len(users):02d}, password: {options['password']}")

    def make_ratings(self, users, stories, wanted):
        """Three taste groups: readers like the stories of their own group and dislike the others."""
        rng = random.Random(42)                        # fixed seed: the same demo data every time
        taste = {u.id: n % 3 for n, u in enumerate(users)}
        kind = {s.id: n % 3 for n, s in enumerate(stories)}
        per_user = wanted // len(users)
        batch = []
        for user in users:
            candidates = [s for s in stories if s.author_id != user.id]       # nobody rates their own story
            for story in rng.sample(candidates, min(per_user, len(candidates))):
                if kind[story.id] == taste[user.id]:
                    value = rng.choice([4, 5, 5])
                else:
                    value = rng.choice([1, 2, 2, 3])
                batch.append(Rating(user=user, story=story, value=value))
        Rating.objects.bulk_create(batch)
        clear_cache()                                  # bulk_create sends no signals, so clear by hand
        return len(batch)