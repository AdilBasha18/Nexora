from rest_framework import status, views, permissions
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .models import User
from .serializers import (
    UserSerializer, 
    CandidateRegisterSerializer, 
    RecruiterRegisterSerializer, 
    LoginSerializer,
    ChangePasswordSerializer
)
import os

class CandidateRegisterView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = CandidateRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            # Create CandidateProfile automatically
            from candidates.models import CandidateProfile
            CandidateProfile.objects.get_or_create(user=user)

            # Send Candidate Welcome Email
            try:
                from notifications.services import notify_candidate_welcome
                notify_candidate_welcome(user)
            except Exception as e:
                import logging
                logging.getLogger(__name__).error(f"Failed to send candidate welcome email: {e}")

            return Response({
                "message": "Candidate account created successfully.",
                "token": token.key,
                "user": UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RecruiterRegisterView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RecruiterRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)

            # Send Recruiter Welcome Email & Admin Registration Alert
            try:
                from notifications.services import notify_recruiter_welcome, notify_admin_recruiter_registered
                company_name = ""
                try:
                    from companies.models import RecruiterProfile
                    profile = RecruiterProfile.objects.filter(user=user).select_related('company').first()
                    if profile and profile.company:
                        company_name = profile.company.name
                except Exception:
                    pass
                notify_recruiter_welcome(user, company_name)
                notify_admin_recruiter_registered(user, company_name)
            except Exception as e:
                import logging
                logging.getLogger(__name__).error(f"Failed to send recruiter registration emails: {e}")

            return Response({
                "message": "Recruiter account registered. Pending admin verification.",
                "token": token.key,
                "user": UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, _ = Token.objects.get_or_create(user=user)
            user_data = UserSerializer(user).data
            
            # Additional role context
            extra_data = {}
            if user.is_recruiter:
                try:
                    from companies.models import RecruiterProfile
                    recruiter_profile = RecruiterProfile.objects.get(user=user)
                    extra_data['company_name'] = recruiter_profile.company.name
                    extra_data['company_id'] = recruiter_profile.company.id
                    extra_data['is_company_verified'] = recruiter_profile.company.is_verified
                except Exception:
                    pass

            return Response({
                "token": token.key,
                "user": user_data,
                **extra_data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            request.user.auth_token.delete()
        except Exception:
            pass
        return Response({"message": "Logged out successfully."}, status=status.HTTP_200_OK)

class UserProfileView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        data = UserSerializer(user).data
        if user.is_recruiter:
            try:
                from companies.models import RecruiterProfile
                profile = RecruiterProfile.objects.get(user=user)
                data['company'] = {
                    'id': profile.company.id,
                    'name': profile.company.name,
                    'website': profile.company.website,
                    'is_verified': profile.company.is_verified
                }
                data['job_title'] = profile.job_title
            except Exception:
                pass
        return Response(data)

    def patch(self, request):
        user = request.user
        full_name = request.data.get('full_name')
        if full_name:
            user.full_name = full_name.strip()
            user.save()
        return Response(UserSerializer(user).data)

class ChangePasswordView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            request.user.set_password(serializer.validated_data['new_password'])
            request.user.save()
            return Response({"message": "Password updated successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GoogleOAuthView(views.APIView):
    """Accept a Google access_token from the frontend, verify it, and return a Nexora token."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        credential = request.data.get('credential')
        if not credential:
            return Response({"error": "Google credential is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Use Google's tokeninfo endpoint to validate the access_token
            import urllib.request
            import json as json_module

            tokeninfo_url = f"https://www.googleapis.com/oauth2/v3/userinfo"
            req = urllib.request.Request(
                tokeninfo_url,
                headers={"Authorization": f"Bearer {credential}"}
            )
            with urllib.request.urlopen(req) as response:
                id_info = json_module.loads(response.read().decode())

            email = id_info.get('email')
            full_name = id_info.get('name', '')
            if not email:
                return Response({"error": "Could not retrieve email from Google."}, status=status.HTTP_400_BAD_REQUEST)

            # Get or create user
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': email.split('@')[0],
                    'full_name': full_name,
                    'role': User.Role.CANDIDATE,
                    'is_active': True,
                }
            )

            # If user exists but has no full_name, update it
            if not created and not user.full_name and full_name:
                user.full_name = full_name
                user.save(update_fields=['full_name'])

            # If new candidate, create CandidateProfile and send welcome email
            if created and user.role == User.Role.CANDIDATE:
                try:
                    from candidates.models import CandidateProfile
                    CandidateProfile.objects.get_or_create(user=user)
                except Exception:
                    pass

                try:
                    from notifications.services import notify_candidate_welcome
                    notify_candidate_welcome(user, auth_source='google')
                except Exception as e:
                    import logging
                    logging.getLogger(__name__).error(f"Failed to send candidate welcome email on Google OAuth: {e}")

            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                "token": token.key,
                "user": UserSerializer(user).data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": f"Google authentication failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GitHubOAuthView(views.APIView):
    """Accept a GitHub authorization code from the frontend, exchange it for access token,
    fetch user profile, and return a Nexora token."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        code = request.data.get('code')
        if not code:
            return Response({"error": "GitHub authorization code is required."}, status=status.HTTP_400_BAD_REQUEST)

        client_id = os.environ.get('GITHUB_CLIENT_ID', '').strip()
        client_secret = os.environ.get('GITHUB_CLIENT_SECRET', '').strip()

        if not client_id or not client_secret:
            return Response({
                "error": "GitHub OAuth is not configured on the server. Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in backend/.env."
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        try:
            import urllib.request
            import urllib.parse
            import json as json_module

            # Step 1: Exchange code for access_token with GitHub
            token_url = "https://github.com/login/oauth/access_token"
            token_payload = urllib.parse.urlencode({
                'client_id': client_id,
                'client_secret': client_secret,
                'code': code,
            }).encode('utf-8')

            token_req = urllib.request.Request(
                token_url,
                data=token_payload,
                headers={
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': 'Nexora-App'
                }
            )

            with urllib.request.urlopen(token_req) as response:
                token_data = json_module.loads(response.read().decode())

            access_token = token_data.get('access_token')
            if not access_token:
                error_msg = token_data.get('error_description') or token_data.get('error') or "Failed to obtain GitHub access token."
                return Response({"error": error_msg}, status=status.HTTP_400_BAD_REQUEST)

            # Step 2: Fetch user profile from GitHub
            user_req = urllib.request.Request(
                "https://api.github.com/user",
                headers={
                    'Authorization': f'Bearer {access_token}',
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'Nexora-App'
                }
            )
            with urllib.request.urlopen(user_req) as response:
                gh_user = json_module.loads(response.read().decode())

            email = gh_user.get('email')
            name = gh_user.get('name') or gh_user.get('login') or ''
            username = gh_user.get('login')

            # Step 3: If primary email is null/private, fetch emails list
            if not email:
                try:
                    emails_req = urllib.request.Request(
                        "https://api.github.com/user/emails",
                        headers={
                            'Authorization': f'Bearer {access_token}',
                            'Accept': 'application/vnd.github.v3+json',
                            'User-Agent': 'Nexora-App'
                        }
                    )
                    with urllib.request.urlopen(emails_req) as response:
                        emails_data = json_module.loads(response.read().decode())
                        for em in emails_data:
                            if em.get('primary') and em.get('verified'):
                                email = em.get('email')
                                break
                            elif em.get('verified') and not email:
                                email = em.get('email')
                except Exception:
                    pass

            if not email:
                email = f"{username}@users.noreply.github.com"

            # Step 4: Get or create user
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': f"gh_{username}" if User.objects.filter(username=username).exists() else username,
                    'full_name': name,
                    'role': User.Role.CANDIDATE,
                    'is_active': True,
                }
            )

            if not created and not user.full_name and name:
                user.full_name = name
                user.save(update_fields=['full_name'])

            if created and user.role == User.Role.CANDIDATE:
                try:
                    from candidates.models import CandidateProfile
                    CandidateProfile.objects.get_or_create(user=user)
                except Exception:
                    pass

                if user.email and not user.email.endswith('@users.noreply.github.com'):
                    try:
                        from notifications.services import notify_candidate_welcome
                        notify_candidate_welcome(user, auth_source='github')
                    except Exception as e:
                        import logging
                        logging.getLogger(__name__).error(f"Failed to send candidate welcome email on GitHub OAuth: {e}")

            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                "token": token.key,
                "user": UserSerializer(user).data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": f"GitHub authentication failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PasswordResetRequestView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        if not email:
            return Response({"error": "Email address is required."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(email__iexact=email, is_active=True).first()
        if user:
            from django.contrib.auth.tokens import default_token_generator
            from django.utils.http import urlsafe_base64_encode
            from django.utils.encoding import force_bytes
            from notifications.services import get_frontend_url, notify_password_reset_requested

            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            reset_url = f"{get_frontend_url()}/login?reset_uid={uid}&reset_token={token}"

            try:
                notify_password_reset_requested(user, reset_url)
            except Exception as e:
                import logging
                logging.getLogger('accounts').error(f"Error sending password reset email: {e}")

        return Response({
            "message": "If an account with that email exists, password reset instructions have been sent."
        }, status=status.HTTP_200_OK)


class PasswordResetConfirmView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        uidb64 = request.data.get('uid', '').strip()
        token = request.data.get('token', '').strip()
        new_password = request.data.get('new_password', '')
        confirm_password = request.data.get('confirm_password', '')

        if not uidb64 or not token or not new_password:
            return Response({"error": "UID, token, and new password are required."}, status=status.HTTP_400_BAD_REQUEST)

        if new_password != confirm_password:
            return Response({"error": "Passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)

        if len(new_password) < 8:
            return Response({"error": "Password must be at least 8 characters long."}, status=status.HTTP_400_BAD_REQUEST)

        from django.contrib.auth.tokens import default_token_generator
        from django.utils.http import urlsafe_base64_decode
        from django.utils.encoding import force_str

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid, is_active=True)
        except Exception:
            return Response({"error": "Invalid or expired password reset link."}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({"error": "Invalid or expired password reset link."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({
            "message": "Password has been successfully updated. You may now log in with your new password."
        }, status=status.HTTP_200_OK)


class VerifyEmailRequestView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        try:
            from notifications.services import notify_email_verified
            user.is_email_verified = True
            user.save()
            notify_email_verified(user)
        except Exception as e:
            import logging
            logging.getLogger('accounts').error(f"Error sending verification email: {e}")

        return Response({
            "message": f"Verification email processed for {user.email}."
        }, status=status.HTTP_200_OK)


class VerifyEmailConfirmView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        uidb64 = request.data.get('uid', '').strip()
        token = request.data.get('token', '').strip()

        if not uidb64 or not token:
            return Response({"error": "Verification token and UID are required."}, status=status.HTTP_400_BAD_REQUEST)

        from django.contrib.auth.tokens import default_token_generator
        from django.utils.http import urlsafe_base64_decode
        from django.utils.encoding import force_str

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid, is_active=True)
        except Exception:
            return Response({"error": "Invalid verification link."}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({"error": "Invalid or expired verification link."}, status=status.HTTP_400_BAD_REQUEST)

        user.is_email_verified = True
        user.save()

        try:
            from notifications.services import notify_email_verified
            notify_email_verified(user)
        except Exception as e:
            import logging
            logging.getLogger('accounts').error(f"Error sending email verified confirmation: {e}")

        return Response({
            "message": f"Email address {user.email} has been successfully verified."
        }, status=status.HTTP_200_OK)

