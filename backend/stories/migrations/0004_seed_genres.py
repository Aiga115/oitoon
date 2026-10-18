from django.db import migrations

GENRES = [
    ("Fantasy", "fantasy"), ("Horror", "horror"), ("Romcom", "romcom"), ("Action", "action"),
    ("Slice of life", "slice-of-life"), ("Superhero", "superhero"), ("Sci-fi", "sci-fi"), ("Drama", "drama"),
]


def add_genres(apps, schema_editor):
    Genre = apps.get_model("stories", "Genre")
    for name, slug in GENRES:
        Genre.objects.get_or_create(slug=slug, defaults={"name": name})

class Migration(migrations.Migration):

    dependencies = [
        ("stories", "0003_genre_story_status_story_genres"),
    ]

    operations = [migrations.RunPython(add_genres, migrations.RunPython.noop)]
