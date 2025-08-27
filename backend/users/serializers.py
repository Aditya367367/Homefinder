from rest_framework import serializers
from django.contrib.auth import authenticate
from django.utils import timezone
from decimal import Decimal
from django.conf import settings

from .models import (
    CustomUser, Property, PropertyImage,
    SavedProperty, MeetingRequest, Notification,
    PROPERTY_TYPE_CHOICES,
    EventPlace, EventPlaceImage, EVENT_PLACE_CATEGORY_CHOICES,
    EVENT_PLACE_STATUS_CHOICES, EventBooking
)


class LandlordProfileSerializer(serializers.ModelSerializer):
    profile_pic = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'name', 'phone', 'profile_pic']

    def get_profile_pic(self, obj):
        if obj.profile_pic:
            # Return a plain URL string (not a CloudinaryResource)
            return obj.profile_pic.url
        return None


class UserSerializer(serializers.ModelSerializer):
    saved_properties = serializers.SerializerMethodField()
    notifications_count = serializers.SerializerMethodField()
    unread_notifications_count = serializers.SerializerMethodField()
    profile_pic = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = [
            'id', 'email', 'name', 'bio', 'gender',
            'birth_date', 'profile_pic', 'user_type', 'is_active', 'is_staff',
            'saved_properties', 'phone', 'notifications_count', 'unread_notifications_count'
        ]

    def get_profile_pic(self, obj):
        if obj.profile_pic:
            return obj.profile_pic.url
        return None

    def get_saved_properties(self, user):
        """
        Efficiently return saved properties. Views may set `user._prefetched_saved`
        to avoid an extra query.
        """
        saved = getattr(user, "_prefetched_saved", None)
        if saved is None:
            saved = (SavedProperty.objects
                     .filter(user=user)
                     .select_related("property__user")
                     .prefetch_related("property__images"))
        return {
            "count": saved.count(),
            "properties": PropertySerializer(
                [s.property for s in saved],
                many=True,
                context=self.context
            ).data
        }

    def get_notifications_count(self, user):
        return Notification.objects.filter(user=user).count()

    def get_unread_notifications_count(self, user):
        return Notification.objects.filter(user=user, is_read=False).count()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    profile_pic = serializers.ImageField(required=False)

    class Meta:
        model = CustomUser
        fields = [
            'email', 'name', 'password', 'bio',
            'gender', 'birth_date', 'profile_pic', 'user_type', 'phone'
        ]

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser.objects.create_user(password=password, **validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            user = authenticate(request=self.context.get('request'), email=email, password=password)
            if not user:
                raise serializers.ValidationError("Invalid credentials.")
            if not user.is_active:
                raise serializers.ValidationError("User account is disabled.")
        else:
            raise serializers.ValidationError('Must include "email" and "password".')
        return {"user": user}


class UpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['name', 'bio', 'gender', 'birth_date', 'profile_pic', 'user_type', 'phone']


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    class Meta:
        fields = ['email']


class PasswordResetConfirmSerializer(serializers.Serializer):
    new_password = serializers.CharField(min_length=8, write_only=True, required=True)
    confirm_password = serializers.CharField(min_length=8, write_only=True, required=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "New passwords must match."})
        return data


class PropertyImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = PropertyImage
        fields = ['id', 'image']

    def get_image(self, obj):
        if obj.image:
            # Return string URL
            return obj.image.url
        return None


class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    user = LandlordProfileSerializer(read_only=True)
    is_saved = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            'id', 'user',
            'title', 'location', 'price', 'type', 'furnished',
            'property_type', 'bedrooms', 'bathrooms', 'area',
            'description', 'contact_name', 'contact_phone', 'contact_email',
            'images', 'created_at', 'status', 'is_saved'
        ]
        read_only_fields = ['user', 'created_at']

    def get_is_saved(self, obj):
        """
        If the view attached `request._saved_map`, prefer that (avoids DB hit per object).
        """
        request = self.context.get("request")
        user = getattr(request, "user", None)
        if user and user.is_authenticated:
            saved_map = getattr(request, "_saved_map", None)
            if saved_map is not None:
                return saved_map.get(obj.id, False)
            return SavedProperty.objects.filter(user=user, property=obj).exists()
        return False


class PropertyCreateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False,
    )
    property_type = serializers.ChoiceField(choices=PROPERTY_TYPE_CHOICES)

    class Meta:
        model = Property
        fields = [
            'title', 'location', 'price', 'type', 'furnished',
            'property_type', 'bedrooms', 'bathrooms', 'area',
            'description', 'contact_name', 'contact_phone', 'contact_email',
            'images', 'status'
        ]

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        user = self.context['request'].user
        property_obj = Property.objects.create(user=user, **validated_data)
        for image in images_data:
            PropertyImage.objects.create(property=property_obj, image=image)
        return property_obj

    def update(self, instance, validated_data):
        images_data = validated_data.pop('images', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if images_data is not None:
            instance.images.all().delete()
            for image in images_data:
                PropertyImage.objects.create(property=instance, image=image)
        return instance


class SavedPropertySerializer(serializers.ModelSerializer):
    # Keep as-is functionally; property is read-only nested serializer
    property = PropertySerializer(read_only=True, context={'request': serializers.CurrentUserDefault()})

    class Meta:
        model = SavedProperty
        fields = ['id', 'property', 'saved_at']


class MeetingRequestSerializer(serializers.ModelSerializer):
    property = PropertySerializer(read_only=True)
    property_id = serializers.PrimaryKeyRelatedField(
        queryset=Property.objects.all(),
        write_only=True,
        source='property',
    )
    proposed_time_slot = serializers.DateTimeField(required=True)
    meeting_purpose = serializers.CharField(required=True, allow_blank=False)
    requester_email = serializers.SerializerMethodField()
    requester_name = serializers.SerializerMethodField()
    requester_profile_pic = serializers.SerializerMethodField()

    class Meta:
        model = MeetingRequest
        fields = [
            'id',
            'property',
            'property_id',
            'status',
            'requested_at',
            'proposed_time_slot',
            'meeting_purpose',
            'requester_email',
            'requester_name',
            'requester_profile_pic',
        ]
        read_only_fields = [
            'id', 'status', 'requested_at', 'property',
            'requester_email', 'requester_name', 'requester_profile_pic'
        ]

    def get_requester_email(self, obj):
        return obj.user.email if obj.user else None

    def get_requester_name(self, obj):
        return obj.user.name if obj.user else None

    def get_requester_profile_pic(self, obj):
        if obj.user and obj.user.profile_pic:
            # Return plain URL; do not use cloudinary_url() nor .name
            return obj.user.profile_pic.url
        return None

    def validate(self, data):
        user = self.context['request'].user
        property_obj = data['property']

        if property_obj.user == user:
            raise serializers.ValidationError({"detail": "You cannot request a meeting for your own property."})

        if MeetingRequest.objects.filter(
            user=user,
            property=property_obj,
            status__in=["pending", "accepted"]
        ).exists():
            raise serializers.ValidationError({"detail": "You already have a pending or accepted meeting request for this property."})

        return data

    def create(self, validated_data):
        user = self.context['request'].user
        return MeetingRequest.objects.create(user=user, **validated_data)


class NotificationSerializer(serializers.ModelSerializer):
    related_meeting_summary = serializers.SerializerMethodField()
    related_property_title = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            'id',
            'user',
            'message',
            'is_read',
            'created_at',
            'notification_type',
            'related_object_id',
            'related_meeting_summary',
            'related_property_title',
        ]
        read_only_fields = ['id', 'user', 'created_at', 'related_meeting_summary', 'related_property_title']

    def get_related_meeting_summary(self, obj):
        if obj.notification_type in ['meeting_request', 'meeting_response'] and obj.related_object_id:
            try:
                meeting = (MeetingRequest.objects
                           .select_related("property")
                           .only("id", "proposed_time_slot", "status", "property__title")
                           .get(id=obj.related_object_id))
                return {
                    'id': meeting.id,
                    'proposed_time_slot': meeting.proposed_time_slot,
                    'status': meeting.status,
                    'property_title': meeting.property.title,
                }
            except MeetingRequest.DoesNotExist:
                return None
        return None

    def get_related_property_title(self, obj):
        if obj.notification_type in ['meeting_request', 'meeting_response'] and obj.related_object_id:
            try:
                meeting = (MeetingRequest.objects
                           .select_related("property")
                           .only("property__title")
                           .get(id=obj.related_object_id))
                return meeting.property.title
            except MeetingRequest.DoesNotExist:
                return None
        return None


class NotificationMarkReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['is_read']
        read_only_fields = ['id', 'user', 'message', 'created_at', 'notification_type', 'related_object_id']

    def validate_is_read(self, value):
        if value is not True:
            raise serializers.ValidationError("Only 'true' is allowed for 'is_read' to mark notification as read.")
        return value


class AnnouncementSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=500)


class EventPlaceImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = EventPlaceImage
        fields = ['id', 'image']

    def get_image(self, obj):
        if obj.image:
            # Return string URL, not CloudinaryResource
            return obj.image.url
        return None


class SimpleEventBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventBooking
        fields = ['booking_date', 'start_time', 'end_time', 'status']


class EventPlaceDetailSerializer(serializers.ModelSerializer):
    images = EventPlaceImageSerializer(many=True, read_only=True)
    bookings = serializers.SerializerMethodField()

    class Meta:
        model = EventPlace
        fields = [
            'id', 'name', 'location', 'description', 'capacity',
            'price_per_hour', 'is_available_now', 'category', 'images', 'bookings'
        ]

    def get_bookings(self, obj):
        current_date = timezone.now().date()
        bookings = (obj.bookings
                    .filter(booking_date__gte=current_date,
                            status__in=['pending', 'confirmed'])
                    .only("booking_date", "start_time", "end_time", "status")
                    .order_by('booking_date', 'start_time'))
        return SimpleEventBookingSerializer(bookings, many=True).data


class EventPlaceSerializer(serializers.ModelSerializer):
    images = EventPlaceImageSerializer(many=True, read_only=True)
    owner = LandlordProfileSerializer(read_only=True)

    class Meta:
        model = EventPlace
        fields = [
            'id', 'owner', 'name', 'location', 'description',
            'price_per_hour', 'category', 'is_available_now', 'capacity', 'status',
            'contact_name', 'contact_phone', 'contact_email',
            'images', 'created_at', 'updated_at'
        ]
        read_only_fields = ['owner', 'created_at', 'updated_at']


class EventPlaceCreateUpdateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )
    category = serializers.ChoiceField(choices=EVENT_PLACE_CATEGORY_CHOICES)
    status = serializers.ChoiceField(choices=EVENT_PLACE_STATUS_CHOICES, required=False, default='pending')

    class Meta:
        model = EventPlace
        fields = [
            'name', 'location', 'description',
            'price_per_hour', 'category', 'is_available_now', 'capacity', 'status',
            'contact_name', 'contact_phone', 'contact_email',
            'images'
        ]

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        owner = self.context['request'].user
        event_place = EventPlace.objects.create(owner=owner, **validated_data)
        for image in images_data:
            EventPlaceImage.objects.create(event_place=event_place, image=image)
        return event_place

    def update(self, instance, validated_data):
        images_data = validated_data.pop('images', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if images_data is not None:
            instance.images.all().delete()
            for image in images_data:
                EventPlaceImage.objects.create(event_place=instance, image=image)
        return instance


class EventBookingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    event_place = EventPlaceSerializer(read_only=True)
    event_place_id = serializers.PrimaryKeyRelatedField(
        queryset=EventPlace.objects.all(),
        write_only=True,
        source='event_place',
    )

    class Meta:
        model = EventBooking
        fields = [
            'id', 'user', 'event_place', 'event_place_id',
            'booking_date', 'start_time', 'end_time',
            'number_of_guests', 'event_type', 'total_cost', 'status',
            'booked_at'
        ]
        read_only_fields = ['id', 'user', 'event_place', 'total_cost', 'status', 'booked_at']

    def validate(self, data):
        event_place = data.get('event_place', self.instance.event_place if self.instance else None)
        number_of_guests = data.get('number_of_guests', self.instance.number_of_guests if self.instance else None)
        booking_date = data.get('booking_date', self.instance.booking_date if self.instance else None)
        start_time = data.get('start_time', self.instance.start_time if self.instance else None)
        end_time = data.get('end_time', self.instance.end_time if self.instance else None)

        if not all([event_place, booking_date, start_time, end_time]):
            raise serializers.ValidationError({"non_field_errors": ["Booking date, start time, and end time are required."]})

        if number_of_guests is not None and event_place and number_of_guests > event_place.capacity:
            raise serializers.ValidationError(
                f"Number of guests ({number_of_guests}) exceeds the event place capacity ({event_place.capacity})."
            )

        if start_time and end_time and start_time >= end_time:
            raise serializers.ValidationError({"end_time": "End time must be after start time."})

        current_booking_date = booking_date
        current_start_time = start_time
        current_end_time = end_time

        overlapping_bookings_query = EventBooking.objects.filter(
            event_place=event_place,
            booking_date=current_booking_date,
            status__in=['pending', 'confirmed']
        )

        if self.instance:
            overlapping_bookings_query = overlapping_bookings_query.exclude(id=self.instance.id)

        overlapping_bookings = overlapping_bookings_query.filter(
            start_time__lt=current_end_time,
            end_time__gt=current_start_time
        )

        if overlapping_bookings.exists():
            raise serializers.ValidationError(
                {"detail": "This event place is already booked for the specified date and time slot. Please choose another slot."}
            )

        return data

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data.pop('user', None)

        event_place = validated_data.get('event_place')
        price_per_hour = event_place.price_per_hour

        start_time = validated_data.get('start_time')
        end_time = validated_data.get('end_time')

        start_dt = timezone.datetime.combine(validated_data.get('booking_date'), start_time)
        end_dt = timezone.datetime.combine(validated_data.get('booking_date'), end_time)

        duration_hours = (end_dt - start_dt).total_seconds() / 3600
        total_cost = price_per_hour * Decimal(duration_hours)

        booking = EventBooking.objects.create(user=user, total_cost=total_cost, **validated_data)
        return booking

    def update(self, instance, validated_data):
        validated_data.pop('user', None)
        validated_data.pop('event_place', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if 'start_time' in validated_data or 'end_time' in validated_data or 'booking_date' in validated_data:
            current_event_place = instance.event_place
            current_start_time = instance.start_time
            current_end_time = instance.end_time
            current_booking_date = instance.booking_date

            start_dt = timezone.datetime.combine(current_booking_date, current_start_time)
            end_dt = timezone.datetime.combine(current_booking_date, current_end_time)

            duration_hours = (end_dt - start_dt).total_seconds() / 3600
            if current_event_place and current_event_place.price_per_hour:
                instance.total_cost = current_event_place.price_per_hour * Decimal(duration_hours)
            else:
                instance.total_cost = Decimal('0.00')

        instance.save()
        return instance
