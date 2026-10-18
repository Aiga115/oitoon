from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
import os
import uuid

from django.db.models.signals import post_delete
from django.dispatch import receiver


def cover_path(instance, filename):
    """Random file name: uploads never collide and the original name is never trusted."""
    ext = os.path.splitext(filename)[1].lower()
    return f"covers/{uuid.uuid4().hex}{ext}"


class Story(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="stories")
    title = models.CharField(max_length=200)
    content = models.TextField()
    cover = models.ImageField(upload_to=cover_path, blank=True)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]


class Rating(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="ratings")
    story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name="ratings")
    value = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "story"], name="one_rating_per_user_story")
        ]

@receiver(post_delete, sender=Story)
def delete_cover_file(sender, instance, **kwargs):
    """When a story is deleted (also by cascade from a user), remove its image file too."""
    if instance.cover:
        instance.cover.delete(save=False)