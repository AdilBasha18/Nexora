from rest_framework import permissions

class IsCandidate(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            (request.user.is_candidate or request.user.is_platform_admin or request.user.is_superuser)
        )

class IsRecruiter(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_recruiter)

class IsVerifiedRecruiter(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.is_recruiter and 
            (request.user.is_verified_recruiter or request.user.is_superuser)
        )

class IsPlatformAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_platform_admin)
