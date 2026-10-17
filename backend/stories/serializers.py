import html
import nh3
from django.contrib.auth.models import User
from django.db.models import Avg
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Story

# Only these tags/attributes survive. They match what the Quill toolbar can produce
# (bold, italic, size). Quill sizes are span classes like "ql-size-large".
ALLOWED_TAGS = {"p", "br", "strong", "em", "u", "span"}
ALLOWED_ATTRIBUTES = {"span": {"class"}, "p": {"class"}}


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["username", "password"]

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)   # hashes the password


class UserTokenSerializer(TokenObtainPairSerializer):
    """Normal login. Refuses staff accounts."""
    def validate(self, attrs):
        data = super().validate(attrs)
        if self.user.is_staff:
            raise AuthenticationFailed("Admin accounts must use the admin login.")
        data["username"] = self.user.username
        return data


class AdminTokenSerializer(TokenObtainPairSerializer):
    """Admin login. Refuses non-staff accounts."""
    def validate(self, attrs):
        data = super().validate(attrs)
        if not self.user.is_staff:
            raise AuthenticationFailed("This account is not an admin.")
        data["username"] = self.user.username
        return data


class StorySerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source="author.username", read_only=True)
    excerpt = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    rating_count = serializers.SerializerMethodField()
    my_rating = serializers.SerializerMethodField()

    class Meta:
        model = Story
        fields = ["id", "title", "content", "author_username", "is_published",
                  "created_at", "updated_at", "excerpt",
                  "average_rating", "rating_count", "my_rating"]
        read_only_fields = ["is_published", "created_at", "updated_at"]

    def validate_content(self, value):
        clean = nh3.clean(value, tags=ALLOWED_TAGS, attributes=ALLOWED_ATTRIBUTES)
        text_only = html.unescape(nh3.clean(clean, tags=set())).strip()
        if not text_only:
            raise serializers.ValidationError("The story cannot be empty.")
        return clean

    def get_excerpt(self, obj):
        return html.unescape(nh3.clean(obj.content, tags=set()))[:150]

    def get_average_rating(self, obj):
        avg = obj.ratings.aggregate(avg=Avg("value"))["avg"]
        return round(avg, 1) if avg else None

    def get_rating_count(self, obj):
        return obj.ratings.count()

    def get_my_rating(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            rating = obj.ratings.filter(user=request.user).first()
            return rating.value if rating else None
        return None


class RatingSerializer(serializers.Serializer):
    value = serializers.IntegerField(min_value=1, max_value=5)
    
class AdminUserSerializer(serializers.ModelSerializer):
    story_count = serializers.SerializerMethodField()
    rating_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "is_staff", "is_superuser",
                  "date_joined", "last_login", "story_count", "rating_count"]

    def get_story_count(self, obj):
        return obj.stories.count()

    def get_rating_count(self, obj):
        return obj.ratings.count()


class AdminStorySerializer(StorySerializer):
    """Same as StorySerializer, but an admin may change is_published."""
    class Meta(StorySerializer.Meta):
        read_only_fields = ["created_at", "updated_at"]