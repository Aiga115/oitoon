from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsNormalUser(BasePermission):
    """Logged in and NOT staff. Admins cannot use reader/author features."""
    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and not user.is_staff)


class IsAuthorOrReadOnly(BasePermission):
    """Anyone can read. Writing needs a normal user; edit/delete only for the owner."""
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return IsNormalUser().has_permission(request, view)

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.author == request.user