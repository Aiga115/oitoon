from django.contrib.auth.models import User
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Rating, Story
from .permissions import IsAuthorOrReadOnly, IsNormalUser
from .serializers import (AdminTokenSerializer, RatingSerializer,
                          RegisterSerializer, StorySerializer, UserTokenSerializer)


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class UserTokenView(TokenObtainPairView):
    serializer_class = UserTokenSerializer


class AdminTokenView(TokenObtainPairView):
    serializer_class = AdminTokenSerializer


class StoryListCreateView(generics.ListCreateAPIView):
    serializer_class = StorySerializer
    permission_classes = [IsAuthorOrReadOnly]

    def get_queryset(self):
        return Story.objects.filter(is_published=True).select_related("author")

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class StoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = StorySerializer
    permission_classes = [IsAuthorOrReadOnly]
    http_method_names = ["get", "put", "delete", "head", "options"]   # matches the API contract

    def get_queryset(self):
        stories = Story.objects.select_related("author")
        user = self.request.user
        if user.is_authenticated:
            return stories.filter(Q(is_published=True) | Q(author=user))
        return stories.filter(is_published=True)


class AuthorProfileView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, username):
        author = get_object_or_404(User, username=username, is_staff=False)
        stories = Story.objects.filter(author=author, is_published=True)
        return Response({
            "username": author.username,
            "date_joined": author.date_joined,
            "stories": StorySerializer(stories, many=True, context={"request": request}).data,
        })


class RatingView(APIView):
    permission_classes = [IsNormalUser]

    def put(self, request, pk):
        story = get_object_or_404(Story, pk=pk, is_published=True)
        if story.author == request.user:
            return Response({"detail": "You cannot rate your own story."},
                            status=status.HTTP_403_FORBIDDEN)
        serializer = RatingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        Rating.objects.update_or_create(
            user=request.user, story=story,
            defaults={"value": serializer.validated_data["value"]},
        )
        # Sprint 7: clear the recommender cache here
        return Response(StorySerializer(story, context={"request": request}).data)

    def delete(self, request, pk):
        deleted, _ = Rating.objects.filter(user=request.user, story_id=pk).delete()
        if not deleted:
            return Response({"detail": "No rating to delete."}, status=status.HTTP_404_NOT_FOUND)
        # Sprint 7: clear the recommender cache here
        return Response(status=status.HTTP_204_NO_CONTENT)