from rest_framework import permissions

class IsCandidate(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            not getattr(request.user, 'is_suspended', False) and
            (request.user.is_candidate or request.user.is_platform_admin)
        )

class IsRecruiter(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            not getattr(request.user, 'is_suspended', False) and
            (request.user.is_recruiter or request.user.is_platform_admin)
        )

class IsApprovedRecruiter(permissions.BasePermission):
    """
    Requires the recruiter account to be reviewed and APPROVED by platform admin.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated or getattr(request.user, 'is_suspended', False):
            return False
        if request.user.is_platform_admin:
            return True
        return bool(request.user.is_recruiter and getattr(request.user, 'is_approved_recruiter', False))

class IsVerifiedRecruiter(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            not getattr(request.user, 'is_suspended', False) and
            (request.user.is_verified_recruiter or request.user.is_platform_admin)
        )

class IsPlatformAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            not getattr(request.user, 'is_suspended', False) and
            request.user.is_platform_admin
        )
