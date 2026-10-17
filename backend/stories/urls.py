from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from . import views

urlpatterns = [
    path("auth/register/", views.RegisterView.as_view()),
    path("auth/token/", views.UserTokenView.as_view()),
    path("auth/token/refresh/", TokenRefreshView.as_view()),
    path("admin/auth/token/", views.AdminTokenView.as_view()),
    path("stories/", views.StoryListCreateView.as_view()),
    path("stories/<int:pk>/", views.StoryDetailView.as_view()),
    path("stories/<int:pk>/rating/", views.RatingView.as_view()),
    path("authors/<str:username>/", views.AuthorProfileView.as_view()),
]