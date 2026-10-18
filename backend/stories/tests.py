from django.contrib.auth.models import User
from rest_framework.test import APITestCase

from .models import Rating, Story
import io
import tempfile
from unittest.mock import patch

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from PIL import Image


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