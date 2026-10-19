from django.contrib.auth.models import User
from django.db.models import Avg, Count, F, Q
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny, IsAdminUser
from . import recommender

from .permissions import IsAuthorOrReadOnly, IsNormalUser
from .models import Genre, Rating, Story
from .serializers import (AdminStorySerializer, AdminTokenSerializer, AdminUserSerializer,
                          GenreSerializer, RatingSerializer, RegisterSerializer,
                          StorySerializer, UserTokenSerializer)

class GenreListView(generics.ListAPIView):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    permission_classes = [AllowAny]

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
        params = self.request.query_params
        user = self.request.user

        # ?mine=1 -> the logged-in author's own stories, drafts included
        if params.get("mine") == "1":
            stories = Story.objects.filter(author=user) if user.is_authenticated else Story.objects.none()
        else:
            stories = Story.objects.public()
        stories = stories.select_related("author").prefetch_related("genres")

        search = params.get("search", "").strip()
        if search:
            stories = stories.filter(Q(title__icontains=search) | Q(author__username__icontains=search))
        if params.get("genre"):
            stories = stories.filter(genres__slug=params["genre"])
        if params.get("status") in ("draft", "coming_out", "done"):
            stories = stories.filter(status=params["status"])

        # popularity = number of ratings, then average rating, then newest
        stories = stories.annotate(num_ratings=Count("ratings", distinct=True),
                                   avg_rating=Avg("ratings__value"))
        if params.get("sort") == "popular":
            return stories.order_by("-num_ratings", F("avg_rating").desc(nulls_last=True), "-created_at")
        return stories.order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class StoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = StorySerializer
    permission_classes = [IsAuthorOrReadOnly]
    http_method_names = ["get", "put", "delete", "head", "options"]   # matches the API contract
    
    def get_queryset(self):
        stories = Story.objects.select_related("author").prefetch_related("genres")
        public = Q(is_published=True) & ~Q(status="draft")
        user = self.request.user
        if user.is_authenticated:
            return stories.filter(public | Q(author=user))   # authors also see their own drafts
        return stories.filter(public)


class AuthorProfileView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, username):
        author = get_object_or_404(User, username=username, is_staff=False)
        stories = Story.objects.public().filter(author=author).prefetch_related("genres")
        return Response({
            "username": author.username,
            "date_joined": author.date_joined,
            "stories": StorySerializer(stories, many=True, context={"request": request}).data,
        })


class RatingView(APIView):
    permission_classes = [IsNormalUser]

    def put(self, request, pk):
        story = get_object_or_404(Story.objects.public(), pk=pk)
        if story.author == request.user:
            return Response({"detail": "You cannot rate your own story."},
                            status=status.HTTP_403_FORBIDDEN)
        serializer = RatingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        Rating.objects.update_or_create(
            user=request.user, story=story,
            defaults={"value": serializer.validated_data["value"]},
        )
        return Response(StorySerializer(story, context={"request": request}).data)

    def delete(self, request, pk):
        deleted, _ = Rating.objects.filter(user=request.user, story_id=pk).delete()
        if not deleted:
            return Response({"detail": "No rating to delete."}, status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class AdminUserListView(generics.ListAPIView):
    queryset = User.objects.order_by("id")
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminUser]


class AdminUserDetailView(generics.RetrieveDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminUser]

    def destroy(self, request, *args, **kwargs):
        target = self.get_object()
        if target == request.user:
            return Response({"detail": "You cannot delete yourself."},
                            status=status.HTTP_403_FORBIDDEN)
        if target.is_superuser:
            return Response({"detail": "You cannot delete a superuser."},
                            status=status.HTTP_403_FORBIDDEN)
        # Sprint 6: clear the recommender cache here (their ratings disappear)
        return super().destroy(request, *args, **kwargs)


class AdminStoryListView(generics.ListAPIView):
    queryset = Story.objects.select_related("author").order_by("-created_at")
    serializer_class = AdminStorySerializer
    permission_classes = [IsAdminUser]


class AdminStoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Story.objects.select_related("author")
    serializer_class = AdminStorySerializer
    permission_classes = [IsAdminUser]
    
class RecommendationView(APIView):
    permission_classes = [IsNormalUser]

    def get(self, request):
        mode, ids, ratings_given = recommender.recommend_for(request.user)
        found = Story.objects.filter(id__in=ids).select_related("author").prefetch_related("genres")
        by_id = {s.id: s for s in found}
        ordered = [by_id[i] for i in ids if i in by_id]
        data = StorySerializer(ordered, many=True, context={"request": request}).data
        return Response({"mode": mode, "ratings_given": ratings_given, "results": data})