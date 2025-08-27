# users/views.py
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, generics, permissions
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework.throttling import SimpleRateThrottle
from django.db.models import Q, Prefetch, OuterRef, Subquery
from django.utils import timezone
from django.http import JsonResponse
from django.conf import settings

from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags

from django.core.cache import cache
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from core.cache import cache_response, cache_view, invalidate_cache_patterns
from core.cache import cache_key_from_request as versioned_cache_key
from core.cache import bump_cache_group_version
import requests
from cloudinary.models import CloudinaryResource
from .models import (
    Property, SavedProperty, MeetingRequest, Notification, CustomUser,
    EventPlace, EventBooking , PropertyImage ,EventPlaceImage
)
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserSerializer,
    UpdateProfileSerializer,
    PropertySerializer,
    PropertyCreateSerializer,
    SavedPropertySerializer,
    MeetingRequestSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
    NotificationSerializer,
    NotificationMarkReadSerializer,
    AnnouncementSerializer,
    EventPlaceSerializer,
    EventPlaceCreateUpdateSerializer,
    EventBookingSerializer,
)
from .tasks import (
    create_notification,
    send_announcement_to_all_users,
    send_password_reset_email,
)

# ---------------------
# Throttling classes
# ---------------------
from .throttling import AnonBurstThrottle, UserBurstThrottle, AnonSustainedThrottle, UserSustainedThrottle


# ---------------------
# Caching helpers
# ---------------------
CACHE_TTL_SHORT  = getattr(settings, "API_CACHE_TTL_SHORT", 60)     # search-like
CACHE_TTL_MEDIUM = getattr(settings, "API_CACHE_TTL_MEDIUM", 120)   # lists
CACHE_TTL_LONG   = getattr(settings, "API_CACHE_TTL_LONG", 300)     # details

def cache_key_from_request(prefix: str, request) -> str:
    
    return versioned_cache_key(prefix, request)


# ---------------------
# small helpers
# ---------------------
def home(request):
    return JsonResponse({"status": "ok", "message": "API is running"})

def get_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {"refresh": str(refresh), "access": str(refresh.access_token)}


# ======================================================
#                        AUTH
# ======================================================
class RegisterView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AnonBurstThrottle, AnonSustainedThrottle]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        tokens = get_tokens(user)
        return Response({
            "user": UserSerializer(user, context={"request": request}).data,
            "tokens": tokens
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AnonBurstThrottle, AnonSustainedThrottle]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        tokens = get_tokens(user)
        return Response({
            "user": UserSerializer(user, context={"request": request}).data,
            "tokens": tokens
        }, status=status.HTTP_200_OK)

class GoogleLoginView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AnonBurstThrottle, AnonSustainedThrottle]

    def post(self, request):
        access_token = request.data.get("access_token")
        if not access_token:
            return Response({"error": "access_token is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Verify token with Google and fetch userinfo
        try:
            resp = requests.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                headers={"Authorization": f"Bearer {access_token}"}, timeout=6
            )
            if resp.status_code != 200:
                return Response({"error": "Invalid Google token"}, status=status.HTTP_400_BAD_REQUEST)
            data = resp.json()
            email = data.get("email")
            name = data.get("name") or data.get("given_name") or "Google User"
            if not email:
                return Response({"error": "Google profile missing email"}, status=status.HTTP_400_BAD_REQUEST)
        except requests.RequestException:
            return Response({"error": "Failed to verify Google token"}, status=status.HTTP_400_BAD_REQUEST)

        # Find or create user
        User = get_user_model()
        user, created = User.objects.get_or_create(email=email, defaults={"name": name, "is_active": True})
        if created and not user.name:
            user.name = name
        user.last_login = timezone.now()
        user.save()

        tokens = get_tokens(user)
        return Response({
            "user": UserSerializer(user, context={"request": request}).data,
            "tokens": tokens
        }, status=status.HTTP_200_OK)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserBurstThrottle, UserSustainedThrottle]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT)
        except KeyError:
            return Response({"error": "Refresh token required"}, status=status.HTTP_400_BAD_REQUEST)
        except TokenError:
            return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

class UserDashboardView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserBurstThrottle, UserSustainedThrottle]

    def get(self, request):
        # brief per-user cache
        key = f"user:dashboard:{request.user.id}"
        data = cache.get(key)
        if not data:
            # prefetch saved properties to speed serializer
            saved_qs = (
                SavedProperty.objects
                .filter(user=request.user)
                .select_related("property__user")
                .prefetch_related("property__images")
                .order_by("-saved_at")
            )
            request.user._prefetched_saved = saved_qs
            data = {"user": UserSerializer(request.user, context={"request": request}).data}
            cache.set(key, data, 45)
        return Response(data, status=status.HTTP_200_OK)

class UpdateUserView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserBurstThrottle, UserSustainedThrottle]

    def put(self, request):
        serializer = UpdateProfileSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        try:
            if hasattr(cache, "delete_pattern"):
                cache.delete_pattern(f"*user:{request.user.id}*")
        except Exception:
            pass
        return Response({
            "message": "Profile updated successfully",
            "user": UserSerializer(user, context={"request": request}).data
        }, status=status.HTTP_200_OK)


# ======================================================
#                   PASSWORD RESET
# ======================================================
class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AnonBurstThrottle, AnonSustainedThrottle]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        try:
            user = get_user_model().objects.get(email=email)
        except get_user_model().DoesNotExist:
            return Response({"detail": "If an account with that email exists, a password reset link has been sent."}, status=status.HTTP_200_OK)

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        reset_url = f"{settings.FRONTEND_URL}/reset-password-confirm/{uid}/{token}/"

        context = {'user': user, 'reset_url': reset_url, 'site_name': settings.SITE_NAME, 'year': timezone.now().year}
        html_message = render_to_string('email/password_reset_email.html', context)
        plain_message = strip_tags(html_message)

        try:
            send_password_reset_email.delay(
                f"Password Reset Request for {settings.SITE_NAME}",
                html_message,
                plain_message,
                [email]
            )
        except Exception:
            try:
                email_message = EmailMultiAlternatives(
                    f"Password Reset Request for {settings.SITE_NAME}",
                    plain_message, settings.DEFAULT_FROM_EMAIL, [email]
                )
                email_message.attach_alternative(html_message, "text/html")
                email_message.send(fail_silently=True)
            except Exception:
                pass

        return Response({"detail": "If an account with that email exists, a password reset link has been sent."}, status=status.HTTP_200_OK)

class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AnonBurstThrottle, AnonSustainedThrottle]

    def post(self, request, uidb64, token):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        new_password = serializer.validated_data['new_password']

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = get_user_model().objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, get_user_model().DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            user.set_password(new_password)
            user.save()
            return Response({"detail": "Password has been reset successfully."}, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "The reset link is invalid or has expired."}, status=status.HTTP_400_BAD_REQUEST)


# ======================================================
#               PROPERTIES (CRUD + SEARCH)
# ======================================================
class CreatePropertyView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserBurstThrottle, UserSustainedThrottle]

    def post(self, request):
        serializer = PropertyCreateSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        property_obj = serializer.save()
        # invalidate property/search caches
        try:
            if hasattr(cache, "delete_pattern"):
                cache.delete_pattern("prop:*")
                cache.delete_pattern("global:*")
        except Exception:
            pass

        return Response({
            "message": "Property listed successfully",
            "property": PropertySerializer(property_obj, context={"request": request}).data
        }, status=status.HTTP_201_CREATED)

class PropertyPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class ListAllPropertiesView(generics.ListAPIView):
    serializer_class = PropertySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = PropertyPagination
    throttle_classes = [AnonBurstThrottle, AnonSustainedThrottle]

    @cache_response(timeout=CACHE_TTL_MEDIUM, key_prefix="prop:list")
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        return (
            Property.objects
            .select_related("user")
            .prefetch_related("images")
            .defer("description")  
            .filter(status="Active")
            .order_by('-created_at')
        )

    def get_serializer_context(self):
        request = self.request
        if request.user.is_authenticated:
            saved_ids = set(
                SavedProperty.objects.filter(user=request.user).values_list("property_id", flat=True)
            )
            request._saved_map = {pid: True for pid in saved_ids}
        return {"request": request}

class ListUserPropertiesView(generics.ListAPIView):
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserBurstThrottle, UserSustainedThrottle]

    @cache_response(timeout=CACHE_TTL_SHORT, key_prefix="user:props")
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        return (
            Property.objects
            .filter(user=self.request.user)
            .select_related("user")
            .prefetch_related("images")
            .defer("description")
            .order_by('-created_at')
        )

    def get_serializer_context(self):
        return {"request": self.request}

class PropertyDetailView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [AnonBurstThrottle, AnonSustainedThrottle]

    @cache_response(timeout=CACHE_TTL_LONG, key_prefix="prop:detail")
    def get(self, request, pk):
        try:
            # Optimize with select_related and prefetch_related
            property_obj = (
                Property.objects
                .select_related("user")
                .prefetch_related("images")
                .get(id=pk)
            )
            
            # Optimize SavedProperty lookup
            is_saved = False
            if request.user.is_authenticated:
                is_saved = SavedProperty.objects.filter(
                    user=request.user, 
                    property=property_obj
                ).exists()
                
            serializer = PropertySerializer(property_obj, context={"request": request, "is_saved": is_saved})
            resp = Response(serializer.data)
            # ensure response has bytes before caching
            try:
                resp.render()
            except Exception:
                pass
            return resp
        except Property.DoesNotExist:
            return Response({"detail": "Property not found"}, status=status.HTTP_404_NOT_FOUND)

class UpdatePropertyView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserBurstThrottle, UserSustainedThrottle]

    def patch(self, request, pk):
        try:
            property_obj = Property.objects.get(id=pk, user=request.user)
        except Property.DoesNotExist:
            return Response({"detail": "Property not found or unauthorized"}, status=status.HTTP_404_NOT_FOUND)

        serializer = PropertyCreateSerializer(property_obj, data=request.data, partial=True, context={"request": request})
        serializer.is_valid(raise_exception=True)
        updated_property = serializer.save()
        try:
            cache.delete(f"prop:detail:{pk}")
            if hasattr(cache, "delete_pattern"):
                cache.delete_pattern("prop:*")
        except Exception:
            pass
        # Bump property cache version so all prop:* keys are invalidated logically
        bump_cache_group_version("prop")
        bump_cache_group_version("global")

        return Response({
            "message": "Property updated successfully",
            "property": PropertySerializer(updated_property, context={"request": request}).data
        }, status=status.HTTP_200_OK)

class UpdatePropertyStatusView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserBurstThrottle, UserSustainedThrottle]

    def patch(self, request, pk):
        status_choice = request.data.get("status")
        valid_statuses = ["Active", "Pending", "Inactive"]
        if status_choice not in valid_statuses:
            return Response({"error": "Invalid status value"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            property_obj = Property.objects.get(id=pk, user=request.user)
            property_obj.status = status_choice
            property_obj.save()
            try:
                cache.delete(f"prop:detail:{pk}")
                # Invalidate property-related lists and user caches
                if hasattr(cache, "delete_pattern"):
                    cache.delete_pattern("prop:*")
                    cache.delete_pattern(f"user:listings:{request.user.id}*")
                    cache.delete_pattern("global:*")
            except Exception:
                pass
            bump_cache_group_version("prop")
            bump_cache_group_version("global")
            return Response({"message": f"Status updated to {status_choice}"}, status=status.HTTP_200_OK)
        except Property.DoesNotExist:
            return Response({"detail": "Property not found or unauthorized"}, status=status.HTTP_404_NOT_FOUND)

class DeletePropertyView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserBurstThrottle, UserSustainedThrottle]

    def delete(self, request, pk):
        try:
            property_obj = Property.objects.get(id=pk, user=request.user)
            property_obj.delete()
            try:
                cache.delete(f"prop:detail:{pk}")
                if hasattr(cache, "delete_pattern"):
                    cache.delete_pattern("prop:*")
            except Exception:
                pass
            bump_cache_group_version("prop")
            bump_cache_group_version("global")
            return Response({"message": "Property deleted successfully"}, status=status.HTTP_200_OK)
        except Property.DoesNotExist:
            return Response({"detail": "Property not found or unauthorized"}, status=status.HTTP_404_NOT_FOUND)

class SimilarPropertiesView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AnonBurstThrottle, AnonSustainedThrottle]

    def get(self, request, pk):
        try:
            current_property = Property.objects.select_related("user").get(pk=pk)
        except Property.DoesNotExist:
            return Response({"detail": "Property not found."}, status=status.HTTP_404_NOT_FOUND)

        base_qs = Property.objects.select_related("user").prefetch_related("images").exclude(pk=pk).filter(status="Active")
        similar = base_qs.filter(
            property_type__iexact=current_property.property_type,
            location__iexact=current_property.location
        )
        if not similar.exists():
            similar = base_qs.filter(
                Q(property_type__iexact=current_property.property_type) |
                Q(location__iexact=current_property.location)
            )
        if not similar.exists():
            similar = base_qs.filter(property_type__iexact=current_property.property_type)

        serializer = PropertySerializer(similar[:6], many=True, context={"request": request})
        return Response(serializer.data)

class FeaturedPropertyPagination(PageNumberPagination):
    page_size = 10

class FeaturedPropertiesView(ListAPIView):
    queryset = Property.objects.select_related("user").prefetch_related("images").filter(status="Active").order_by('-created_at')
    serializer_class = PropertySerializer
    pagination_class = FeaturedPropertyPagination
    permission_classes = [AllowAny]
    throttle_classes = [AnonBurstThrottle, AnonSustainedThrottle]

    @cache_response(timeout=CACHE_TTL_MEDIUM, key_prefix="prop:featured")
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_serializer_context(self):
        return {"request": self.request}

class SearchPropertiesView(ListAPIView):
    serializer_class = PropertySerializer
    permission_classes = [AllowAny]
    throttle_classes = [AnonBurstThrottle, AnonSustainedThrottle]

    def list(self, request, *args, **kwargs):
        key = cache_key_from_request("prop:search", request)
        cached = cache.get(key)
        if cached:
            return Response(cached)
        response = super().list(request, *args, **kwargs)
        cache.set(key, response.data, CACHE_TTL_SHORT)
        return response

    def get_queryset(self):
        query = self.request.query_params.get("query", "").strip()
        location = self.request.query_params.get("location")
        type_ = self.request.query_params.get("type")
        furnished = self.request.query_params.get("furnished")
        property_types = self.request.query_params.getlist("property_type")
        min_price = self.request.query_params.get("min_price")
        max_price = self.request.query_params.get("max_price")
        ordering = self.request.query_params.get("ordering", "newest")

        filters = Q()
        if query:
            try:
                query_price = int(query)
            except ValueError:
                query_price = None

            filters |= (
                Q(title__icontains=query) |
                Q(location__icontains=query) |
                Q(description__icontains=query) |
                Q(contact_name__icontains=query) |
                Q(property_type__icontains=query) |
                Q(furnished__icontains=query) |
                Q(type__icontains=query)
            )
            if query_price is not None:
                filters |= Q(price__gte=query_price - 10000, price__lte=query_price + 10000)

        if location:
            filters &= Q(location__icontains=location)
        if type_:
            filters &= Q(type__iexact=type_)
        if furnished:
            filters &= Q(furnished__iexact=furnished)
        if property_types:
            filters &= Q(property_type__in=property_types)
        if bedrooms := self.request.query_params.get("bedrooms"):
            filters &= Q(bedrooms=bedrooms)
        if bathrooms := self.request.query_params.get("bathrooms"):
            filters &= Q(bathrooms=bathrooms)
        if min_price and max_price:
            filters &= Q(price__gte=min_price, price__lte=max_price)
        elif min_price:
            filters &= Q(price__gte=min_price)
        elif max_price:
            filters &= Q(price__lte=max_price)

        qs = Property.objects.select_related("user").prefetch_related("images").filter(filters, status="Active")

        if ordering == "price_low":
            qs = qs.order_by("price")
        elif ordering == "price_high":
            qs = qs.order_by("-price")
        else:
            qs = qs.order_by("-created_at")
        return qs

    def get_serializer_context(self):
        return {"request": self.request}


# ======================================================
#                 SAVED PROPERTIES
# ======================================================
class ToggleSavePropertyView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserBurstThrottle, UserSustainedThrottle]

    def post(self, request, pk):
        property_obj = Property.objects.filter(id=pk).first()
        if not property_obj:
            return Response({"detail": "Property not found"}, status=status.HTTP_404_NOT_FOUND)

        saved_instance = SavedProperty.objects.filter(user=request.user, property=property_obj).first()
        if saved_instance:
            saved_instance.delete()
            action = "unsaved"
        else:
            SavedProperty.objects.create(user=request.user, property=property_obj)
            action = "saved"

        try:
            if hasattr(cache, "delete_pattern"):
                cache.delete_pattern(f"*user:{request.user.id}*")
        except Exception:
            pass

        return Response({"message": f"Property {action}"}, status=status.HTTP_200_OK)

class ListSavedPropertiesView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SavedPropertySerializer
    throttle_classes = [UserBurstThrottle, UserSustainedThrottle]

    @cache_response(timeout=CACHE_TTL_SHORT, key_prefix="user:saved")
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        return (
            SavedProperty.objects
            .filter(user=self.request.user)
            .select_related("property__user")
            .prefetch_related("property__images")
            .defer("property__description")
            .order_by('-saved_at')
        )

    def get_serializer_context(self):
        return {"request": self.request}


# ======================================================
#                      MEETINGS
# ======================================================
class CreateMeetingRequestView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserBurstThrottle, UserSustainedThrottle]

    def post(self, request, pk):
        data = request.data.copy()
        data["property_id"] = pk
        serializer = MeetingRequestSerializer(data=data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        meeting = serializer.save()

        # async notify owner
        try:
            create_notification.delay(
                meeting.property.user.id,
                f"New meeting request for your property '{meeting.property.title}' from {request.user.name}.",
                'meeting_request',
                meeting.id
            )
        except Exception:
            Notification.objects.create(
                user=meeting.property.user,
                message=f"New meeting request for your property '{meeting.property.title}' from {request.user.name}.",
                notification_type='meeting_request',
                related_object_id=meeting.id
            )

        return Response({
            "message": "Meeting request created successfully",
            "meeting": MeetingRequestSerializer(meeting, context={"request": request}).data
        }, status=status.HTTP_201_CREATED)

class ListPropertyOwnerMeetingRequestsView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MeetingRequestSerializer
    throttle_classes = [UserBurstThrottle, UserSustainedThrottle]

    @cache_response(timeout=CACHE_TTL_SHORT, key_prefix="user:owner_meetings")
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        return (
            MeetingRequest.objects
            .filter(property__user=self.request.user)
            .select_related("user", "property__user")
            .order_by('-requested_at')
        )

    def get_serializer_context(self):
        return {"request": self.request}

class ListUserCreatedMeetingRequestsView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MeetingRequestSerializer
    throttle_classes = [UserBurstThrottle, UserSustainedThrottle]

    @cache_response(timeout=CACHE_TTL_SHORT, key_prefix="user:my_meetings")
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        return (
            MeetingRequest.objects
            .filter(user=self.request.user)
            .select_related("user", "property__user")
            .order_by('-requested_at')
        )

    def get_serializer_context(self):
        return {"request": self.request}

class UpdateMeetingStatusView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserBurstThrottle, UserSustainedThrottle]

    def patch(self, request, pk):
        try:
            meeting = MeetingRequest.objects.select_related("property__user", "user").get(pk=pk)
        except MeetingRequest.DoesNotExist:
            return Response({"detail": "Meeting request not found."}, status=status.HTTP_404_NOT_FOUND)

        if meeting.property.user != request.user:
            raise PermissionDenied("You do not own this property or are not authorized to update this meeting.")

        status_choice = request.data.get("status")
        valid_statuses = ["pending", "accepted", "rejected", "completed"]
        if status_choice not in valid_statuses:
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

        if meeting.status in ["completed", "rejected"] and status_choice not in ["completed", "rejected"]:
            return Response({"detail": f"This meeting request is already {meeting.status} and cannot be changed."}, status=status.HTTP_400_BAD_REQUEST)

        meeting.status = status_choice
        meeting.save()

        # notify requester
        try:
            create_notification.delay(
                meeting.user.id,
                f"Your meeting request for '{meeting.property.title}' was {status_choice}.",
                'meeting_response',
                meeting.id
            )
        except Exception:
            Notification.objects.create(
                user=meeting.user,
                message=f"Your meeting request for '{meeting.property.title}' was {status_choice}.",
                notification_type='meeting_response',
                related_object_id=meeting.id
            )

        return Response({"message": f"Meeting status updated to {status_choice}"}, status=status.HTTP_200_OK)


# ======================================================
#             ANNOUNCEMENTS & NOTIFICATIONS
# ======================================================
class AnnouncementCreateView(generics.CreateAPIView):
    serializer_class = AnnouncementSerializer
    permission_classes = [permissions.IsAdminUser]
    throttle_classes = [UserBurstThrottle, UserSustainedThrottle]

    def perform_create(self, serializer):
        announcement_message = serializer.validated_data['message']
        try:
            send_announcement_to_all_users.delay(announcement_message)
        except Exception:
            users = CustomUser.objects.filter(is_active=True).only("id")
            Notification.objects.bulk_create([
                Notification(user=user, message=announcement_message, notification_type='announcement')
                for user in users
            ], ignore_conflicts=True)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({"message": "Announcement sent to all users successfully."}, status=status.HTTP_201_CREATED, headers=headers)

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserBurstThrottle, UserSustainedThrottle]

    @cache_response(timeout=CACHE_TTL_SHORT, key_prefix="user:notifications")
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        return (
            Notification.objects
            .filter(user=self.request.user)
            .only("id", "user", "message", "is_read", "created_at", "notification_type", "related_object_id")
            .order_by('-created_at')
        )

class MarkNotificationReadView(generics.UpdateAPIView):
    queryset = Notification.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationMarkReadSerializer
    lookup_field = 'pk'
    throttle_classes = [UserBurstThrottle, UserSustainedThrottle]

    def get_object(self):
        notification = super().get_object()
        if notification.user != self.request.user:
            raise PermissionDenied("You do not have permission to mark this notification as read.")
        return notification

class NotificationDeleteView(generics.DestroyAPIView):
    queryset = Notification.objects.all()
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'
    throttle_classes = [UserBurstThrottle, UserSustainedThrottle]

    def get_object(self):
        notification = super().get_object()
        if notification.user != self.request.user:
            raise PermissionDenied("You do not have permission to delete this notification.")
        return notification

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"message": "Notification deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

class DeleteAllReadNotificationsView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserBurstThrottle, UserSustainedThrottle]

    def delete(self, request, *args, **kwargs):
        deleted_count, _ = Notification.objects.filter(user=request.user, is_read=True).delete()
        return Response({"message": f"Successfully deleted {deleted_count} read notifications."}, status=status.HTTP_204_NO_CONTENT)

class DeleteAllNotificationsView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserBurstThrottle, UserSustainedThrottle]

    def delete(self, request, *args, **kwargs):
        deleted_count, _ = Notification.objects.filter(user=request.user).delete()
        return Response({"message": f"Successfully deleted {deleted_count} notifications."}, status=status.HTTP_204_NO_CONTENT)


# ======================================================
#                EVENT PLACES & BOOKINGS
# ======================================================
class EventPlacePagination(PageNumberPagination):
    page_size = 9

class CreateEventPlaceView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserBurstThrottle, UserSustainedThrottle]

    def post(self, request):
        serializer = EventPlaceCreateUpdateSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        event_place = serializer.save()
        try:
            if hasattr(cache, "delete_pattern"):
                cache.delete_pattern("event:*")
                cache.delete_pattern("global:*")
        except Exception:
            pass
        bump_cache_group_version("event")
        bump_cache_group_version("global")
        return Response(
            EventPlaceSerializer(event_place, context={"request": request}).data,
            status=status.HTTP_201_CREATED
        )

class ListEventPlacesView(generics.ListAPIView):
    serializer_class = EventPlaceSerializer
    permission_classes = [AllowAny]
    pagination_class = EventPlacePagination
    throttle_classes = [AnonBurstThrottle, AnonSustainedThrottle]

    def list(self, request, *args, **kwargs):
        key = cache_key_from_request("event:list", request)
        cached = cache.get(key)
        if cached:
            return Response(cached)
        response = super().list(request, *args, **kwargs)
        cache.set(key, response.data, CACHE_TTL_MEDIUM)
        return response

    def get_queryset(self):
        queryset = (
            EventPlace.objects
            .select_related("owner")
            .prefetch_related("images")
            .only("id","name","location","price_per_hour","capacity","category","is_available_now","status","created_at","owner_id")
            .order_by('-created_at')
        )

        category = self.request.query_params.get('category')
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        available_now = self.request.query_params.get('available_now')
        search_query = self.request.query_params.get('search', '').strip()

        filters = Q()
        if category:
            filters &= Q(category__iexact=category)
        if min_price:
            filters &= Q(price_per_hour__gte=min_price)
        if max_price:
            filters &= Q(price_per_hour__lte=max_price)
        if available_now and str(available_now).lower() == 'true':
            filters &= Q(is_available_now=True)
        if search_query:
            filters &= (
                Q(name__icontains=search_query) |
                Q(location__icontains=search_query) |
                Q(description__icontains=search_query) |
                Q(contact_name__icontains=search_query)
            )

        return queryset.filter(filters)

    def get_serializer_context(self):
        return {"request": self.request}

class EventPlaceDetailView(generics.RetrieveAPIView):
    queryset = EventPlace.objects.select_related("owner").prefetch_related("images")
    serializer_class = EventPlaceSerializer
    permission_classes = [AllowAny]
    lookup_field = 'pk'
    throttle_classes = [AnonBurstThrottle, AnonSustainedThrottle]

    @cache_response(timeout=CACHE_TTL_LONG, key_prefix="event:detail")
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_serializer_context(self):
        return {"request": self.request}

class UpdateEventPlaceView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserBurstThrottle, UserSustainedThrottle]

    def patch(self, request, pk):
        try:
            event_place = EventPlace.objects.get(pk=pk, owner=request.user)
        except EventPlace.DoesNotExist:
            return Response({"detail": "Event place not found or unauthorized"}, status=status.HTTP_404_NOT_FOUND)

        # Remove empty string values to support partial updates from forms
        cleaned = {k: v for k, v in request.data.items() if v not in ("", None)}
        serializer = EventPlaceCreateUpdateSerializer(event_place, data=cleaned, partial=True, context={"request": request})
        serializer.is_valid(raise_exception=True)
        updated_event_place = serializer.save()
        try:
            cache.delete(f"event:detail:{pk}")
            if hasattr(cache, "delete_pattern"):
                cache.delete_pattern("event:*")
                cache.delete_pattern(f"user:listings:{request.user.id}*")
                cache.delete_pattern("global:*")
        except Exception:
            pass
        bump_cache_group_version("event")
        bump_cache_group_version("global")
        return Response(
            EventPlaceSerializer(updated_event_place, context={"request": request}).data,
            status=status.HTTP_200_OK
        )

class DeleteEventPlaceView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserBurstThrottle, UserSustainedThrottle]

    def delete(self, request, pk):
        try:
            event_place = EventPlace.objects.get(pk=pk, owner=request.user)
            event_place.delete()
            try:
                cache.delete(f"event:detail:{pk}")
                if hasattr(cache, "delete_pattern"):
                    cache.delete_pattern("event:*")
            except Exception:
                pass
            bump_cache_group_version("event")
            bump_cache_group_version("global")
            return Response({"message": "Event place deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except EventPlace.DoesNotExist:
            return Response({"detail": "Event place not found or unauthorized"}, status=status.HTTP_404_NOT_FOUND)

class EventBookingPagination(PageNumberPagination):
    page_size = 6

class CreateEventBookingView(generics.CreateAPIView):
    serializer_class = EventBookingSerializer
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserBurstThrottle, UserSustainedThrottle]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ListUserEventBookingsView(generics.ListAPIView):
    serializer_class = EventBookingSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = EventBookingPagination
    throttle_classes = [UserBurstThrottle, UserSustainedThrottle]

    @cache_response(timeout=CACHE_TTL_SHORT, key_prefix="user:event_bookings")
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        return (
            EventBooking.objects
            .filter(user=self.request.user)
            .select_related("event_place__owner", "user")
            .only("id","booking_date","start_time","end_time","number_of_guests","status","booked_at","user_id","event_place_id")
            .order_by('-booked_at')
        )

    def get_serializer_context(self):
        return {"request": self.request}

class UpdateEventBookingView(generics.UpdateAPIView):
    queryset = EventBooking.objects.select_related("event_place__owner", "user").all()
    serializer_class = EventBookingSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'
    throttle_classes = [UserBurstThrottle, UserSustainedThrottle]

    def get_object(self):
        booking = super().get_object()
        if booking.event_place.owner == self.request.user or booking.user == self.request.user:
            return booking
        raise PermissionDenied("You do not have permission to update this booking.")

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        is_owner = instance.event_place.owner == request.user
        data = request.data.copy()
        if not is_owner and 'status' in data:
            del data['status']

        if instance.status in ['completed', 'cancelled'] and not is_owner:
            raise ValidationError("This booking cannot be updated as it is already completed or cancelled.")
        elif instance.status in ['completed', 'cancelled'] and is_owner and 'status' not in data:
            valid_status_change = False
            if 'status' in request.data and request.data['status'] in ['completed', 'cancelled']:
                if request.data['status'] != instance.status:
                    valid_status_change = True
            if not valid_status_change:
                raise ValidationError(
                    f"This booking cannot be updated as it is already {instance.status}. "
                    "Only status can be changed to 'completed' or 'cancelled' by owner."
                )

        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        # async notify
        try:
            create_notification.delay(
                instance.user.id if is_owner else instance.event_place.owner.id,
                f"{'Your booking' if is_owner else 'A booking for your event place'} '{instance.event_place.name}' has been updated.",
                'booking_update',
                instance.id
            )
        except Exception:
            Notification.objects.create(
                user=instance.user if is_owner else instance.event_place.owner,
                message=f"{'Your booking' if is_owner else 'A booking for your event place'} '{instance.event_place.name}' has been updated.",
                notification_type='booking_update',
                related_object_id=instance.id
            )

        return Response(serializer.data)

class CancelEventBookingView(generics.DestroyAPIView):
    queryset = EventBooking.objects.select_related("event_place__owner", "user").all()
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'
    throttle_classes = [UserBurstThrottle, UserSustainedThrottle]

    def get_object(self):
        booking = super().get_object()
        if booking.user != self.request.user and booking.event_place.owner != self.request.user:
            raise PermissionDenied("You do not have permission to cancel this booking.")
        if booking.status in ['completed', 'cancelled']:
            raise ValidationError("This booking cannot be cancelled as it is already completed or cancelled.")
        return booking

    def perform_destroy(self, instance):
        instance.status = 'cancelled'
        instance.save()
        try:
            create_notification.delay(
                instance.event_place.owner.id if instance.user == self.request.user else instance.user.id,
                f"Booking for '{instance.event_place.name}' cancelled.",
                'booking_cancellation',
                instance.id
            )
        except Exception:
            if instance.user == self.request.user:
                Notification.objects.create(
                    user=instance.event_place.owner,
                    message=f"A booking for your event place '{instance.event_place.name}' has been cancelled by the booker.",
                    notification_type='booking_cancellation', related_object_id=instance.id
                )
            else:
                Notification.objects.create(
                    user=instance.user,
                    message=f"Your booking for '{instance.event_place.name}' has been cancelled by the owner.",
                    notification_type='booking_cancellation', related_object_id=instance.id
                )


# ======================================================
#         COMBINED LISTS & GLOBAL SEARCH
# ======================================================
class ListUserListingsView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserBurstThrottle, UserSustainedThrottle]

    def get(self, request, *args, **kwargs):
        key = f"user:listings:{request.user.id}"
        cached = cache.get(key)
        if cached:
            return Response(cached, status=status.HTTP_200_OK)

        user = request.user

        # Annotate first image via subquery
        first_prop_image = Subquery(
            PropertyImage.objects.filter(property=OuterRef('pk')).values('image')[:1]
        )
        first_event_image = Subquery(
            EventPlaceImage.objects.filter(event_place=OuterRef('pk')).values('image')[:1]
        )

        properties_data = list(
            Property.objects
            .filter(user=user)
            .annotate(first_image=first_prop_image)
            .values(
                'id', 'title', 'location', 'price', 'property_type', 'bedrooms', 'bathrooms',
                'area', 'type', 'furnished',
                'description', 'contact_name', 'contact_phone', 'contact_email',
                'status', 'created_at', 'first_image'
            ).order_by('-created_at')
        )
        for p in properties_data:
            p['listing_type'] = 'property'

        event_places_data = list(
            EventPlace.objects
            .filter(owner=user)
            .annotate(first_image=first_event_image)
            .values(
                'id', 'name', 'location', 'price_per_hour', 'capacity', 'category',
                'is_available_now', 'status', 'created_at', 'first_image',
                'description', 'contact_name', 'contact_phone', 'contact_email'
            ).order_by('-created_at')
        )
        for e in event_places_data:
            e['listing_type'] = 'event_place'
            nm = e.get('name')
            if nm is not None:
                e['title'] = nm
            e['status'] = 'Active' if e.get('is_available_now') else 'Inactive'

        all_listings = properties_data + event_places_data
        
        # Normalize for serialization
        for item in all_listings:
            first_image = item.get('first_image')
            # Check if it's a CloudinaryResource object and get its URL
            if isinstance(first_image, CloudinaryResource):
                item['first_image'] = first_image.url  # Use .url to get the full URL
            else:
                
                item['first_image'] = first_image
            
            if 'price' in item and item['price'] is not None:
                try:
                    item['price'] = float(item['price'])
                except (ValueError, TypeError):
                    item['price'] = None
            if 'price_per_hour' in item and item['price_per_hour'] is not None:
                try:
                    item['price_per_hour'] = float(item['price_per_hour'])
                except (ValueError, TypeError):
                    item['price_per_hour'] = None
            if 'created_at' in item and item['created_at'] is not None:
                try:
                    item['created_at'] = item['created_at'].isoformat()
                except Exception:
                    pass

        all_listings.sort(key=lambda x: x.get('created_at', timezone.now().isoformat()), reverse=True)

        cache.set(key, all_listings, CACHE_TTL_SHORT)
        return Response(all_listings, status=status.HTTP_200_OK)

class GlobalSearchView(generics.ListAPIView):
    permission_classes = [AllowAny]
    throttle_classes = [AnonBurstThrottle, AnonSustainedThrottle]

    def get(self, request, *args, **kwargs):
        key = cache_key_from_request("global:search", request)
        cached = cache.get(key)
        if cached:
            return Response(cached)

        query = self.request.query_params.get("q", "").strip()

        properties_queryset = Property.objects.none()
        event_places_queryset = EventPlace.objects.none()

        if query:
            properties_queryset = (
                Property.objects
                .select_related("user")
                .prefetch_related("images")
                .filter(
                    Q(title__icontains=query) |
                    Q(location__icontains=query) |
                    Q(description__icontains=query) |
                    Q(property_type__icontains=query)
                )
                .filter(status="Active")  
            )

            event_places_queryset = (
                EventPlace.objects
                .select_related("owner")
                .prefetch_related("images")
                .filter(
                    Q(name__icontains=query) |
                    Q(location__icontains=query) |
                    Q(description__icontains=query) |
                    Q(category__icontains=query)
                )
                .filter(status="Active")
            )

        properties_data = PropertySerializer(properties_queryset, many=True, context={"request": request}).data
        event_places_data = EventPlaceSerializer(event_places_queryset, many=True, context={"request": request}).data

        for item in properties_data:
            item['listing_type'] = 'property'
        for item in event_places_data:
            item['listing_type'] = 'event_place'

        combined_results = sorted(
            properties_data + event_places_data,
            key=lambda x: x.get('created_at', '1970-01-01T00:00:00Z'),
            reverse=True
        )

        cache.set(key, combined_results, CACHE_TTL_SHORT)
        return Response(combined_results, status=status.HTTP_200_OK)
