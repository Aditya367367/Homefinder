from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    CustomUser, Property, PropertyImage, SavedProperty,
    MeetingRequest, Notification, EventPlace, EventPlaceImage, EventBooking
)


class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ("email", "name", "is_staff", "is_active", "user_type")
    list_filter = ("is_staff", "is_active", "user_type", "gender")
    search_fields = ("email", "name", "phone")
    ordering = ("email",)
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal Info", {"fields": ("name", "phone", "user_type", "bio", "gender", "birth_date", "profile_pic")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "name", "password1", "password2", "is_staff", "is_active"),
        }),
    )


class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ("title", "location", "price", "type", "furnished", "status", "user")
    search_fields = ("title", "location", "contact_email")
    list_filter = ("type", "furnished", "property_type", "status")
    raw_id_fields = ("user",)
    inlines = [PropertyImageInline]
    list_select_related = ("user",)


class MeetingRequestAdmin(admin.ModelAdmin):
    list_display = ("user", "property", "proposed_time_slot", "status")
    list_filter = ("status",)
    search_fields = ("user__email", "property__title")
    list_select_related = ("user", "property")


class NotificationAdmin(admin.ModelAdmin):
    list_display = ("user", "notification_type", "is_read", "created_at")
    list_filter = ("notification_type", "is_read")
    search_fields = ("user__email", "message")
    list_select_related = ("user",)


class EventPlaceImageInline(admin.TabularInline):
    model = EventPlaceImage
    extra = 1


@admin.register(EventPlace)
class EventPlaceAdmin(admin.ModelAdmin):
    list_display = ("name", "location", "price_per_hour", "capacity", "category", "status", "is_available_now", "owner")
    list_filter = ("category", "status", "is_available_now")
    search_fields = ("name", "location", "contact_email")
    raw_id_fields = ("owner",)
    inlines = [EventPlaceImageInline]
    list_select_related = ("owner",)


@admin.register(EventBooking)
class EventBookingAdmin(admin.ModelAdmin):
    list_display = ("event_place", "user", "booking_date", "start_time", "end_time", "number_of_guests", "status")
    list_filter = ("status", "booking_date")
    search_fields = ("event_place__name", "user__email")
    list_select_related = ("event_place", "user")


@admin.register(SavedProperty)
class SavedPropertyAdmin(admin.ModelAdmin):
    list_display = ("user", "property", "saved_at")
    search_fields = ("user__email", "property__title")
    list_select_related = ("user", "property")


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(MeetingRequest, MeetingRequestAdmin)
admin.site.register(Notification, NotificationAdmin)
