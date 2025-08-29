from django.urls import path
from .views import (
    # Auth
    RegisterView,
    LoginView,
    GoogleLoginView,
    LogoutView,
    UserDashboardView,
    UpdateUserView,
    # Password Reset
    PasswordResetRequestView,
    PasswordResetConfirmView,

    # Property CRUD
    CreatePropertyView,
    ListAllPropertiesView,
    ListUserPropertiesView,
    PropertyDetailView,
    UpdatePropertyView,
    DeletePropertyView,
    UpdatePropertyStatusView,

    # Property Features
    SimilarPropertiesView,
    FeaturedPropertiesView,
    SearchPropertiesView,

    # Save/Unsave
    ToggleSavePropertyView,
    ListSavedPropertiesView,

    # Meeting
    CreateMeetingRequestView,
    ListPropertyOwnerMeetingRequestsView,
    ListUserCreatedMeetingRequestsView,
    UpdateMeetingStatusView,

    # Notifications and Announcements
    NotificationListView,
    MarkNotificationReadView,
    AnnouncementCreateView,
    # Notification Deletion
    NotificationDeleteView,
    DeleteAllReadNotificationsView,
    DeleteAllNotificationsView,

    # Event Places
    CreateEventPlaceView,
    ListEventPlacesView,
    EventPlaceDetailView,
    UpdateEventPlaceView,
    DeleteEventPlaceView,

    # Event Bookings
    CreateEventBookingView,
    ListUserEventBookingsView,
    UpdateEventBookingView,
    CancelEventBookingView,

    # Combined Listings
    ListUserListingsView, 
    
    #gloablsearch
    GlobalSearchView,
    ProjectInfoView
)

urlpatterns = [
    # Auth
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("google-login/", GoogleLoginView.as_view(), name="google-login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("user/", UserDashboardView.as_view(), name="user-info"),
    path("update/user/", UpdateUserView.as_view(), name="update-user"),

    # Password Reset URLs
    path("password-reset/", PasswordResetRequestView.as_view(), name="password_reset_request"),
    path("password-reset-confirm/<str:uidb64>/<str:token>/", PasswordResetConfirmView.as_view(), name="password_reset_confirm"),

    # Saved Properties
    path('property/<int:pk>/toggle-save/', ToggleSavePropertyView.as_view(), name='toggle-save'),
    path("user/saved-properties/", ListSavedPropertiesView.as_view(), name="saved-properties"),

    # Property CRUD
    path("property/create/", CreatePropertyView.as_view(), name="create-property"),
    path("property/all/", ListAllPropertiesView.as_view(), name="list-all-properties"),
    path("property/mine/", ListUserPropertiesView.as_view(), name="user-properties"),
    path("property/<int:pk>/", PropertyDetailView.as_view(), name="property-detail"),
    path("property/<int:pk>/update/", UpdatePropertyView.as_view(), name="edit-property"),
    path("property/<int:pk>/delete/", DeletePropertyView.as_view(), name="delete-property"),
    path("property/<int:pk>/status/", UpdatePropertyStatusView.as_view(), name="property-status"),

    # Features / Search
    path("property/<int:pk>/similar/", SimilarPropertiesView.as_view(), name="similar-properties"),
    path("property/featured/", FeaturedPropertiesView.as_view(), name="featured-properties"),
    path("property/search/", SearchPropertiesView.as_view(), name="search-properties"),

    # Meeting Requests
    path("property/<int:pk>/meeting-request/", CreateMeetingRequestView.as_view(), name="create-meeting"),
    path("owner/meeting-requests/", ListPropertyOwnerMeetingRequestsView.as_view(), name="owner-meetings"),
    path("user/my-meeting-requests/", ListUserCreatedMeetingRequestsView.as_view(), name="my-created-meetings"),
    path("meeting-request/<int:pk>/update/", UpdateMeetingStatusView.as_view(), name="update-meeting-status"),

    # Notifications and Announcements
    path("notifications/", NotificationListView.as_view(), name="notification-list"),
    path("notifications/<int:pk>/mark-read/", MarkNotificationReadView.as_view(), name="notification-mark-read"),
    path("announcements/create/", AnnouncementCreateView.as_view(), name="announcement-create"),

    # Notification Deletion URLs
    path("notifications/<int:pk>/delete/", NotificationDeleteView.as_view(), name="notification-delete"),
    path("notifications/delete-read/", DeleteAllReadNotificationsView.as_view(), name="delete-all-read-notifications"),
    path("notifications/delete-all/", DeleteAllNotificationsView.as_view(), name="delete-all-notifications"),

    # Event Place URLs
    path("event-place/create/", CreateEventPlaceView.as_view(), name="create-event-place"),
    path("event-place/all/", ListEventPlacesView.as_view(), name="list-event-places"),
    path("event-place/<int:pk>/", EventPlaceDetailView.as_view(), name="event-place-detail"),
    path("event-place/<int:pk>/update/", UpdateEventPlaceView.as_view(), name="update-event-place"),
    path("event-place/<int:pk>/delete/", DeleteEventPlaceView.as_view(), name="delete-event-place"),

    # Event Booking URLs
    path("event-booking/create/", CreateEventBookingView.as_view(), name="create-event-booking"),
    path("user/my-event-bookings/", ListUserEventBookingsView.as_view(), name="my-event-bookings"),
    path("event-booking/<int:pk>/update/", UpdateEventBookingView.as_view(), name="update-event-booking-status"),
    path("event-booking/<int:pk>/cancel/", CancelEventBookingView.as_view(), name="cancel-event-booking"),

    # Combined Listings URL
    path("user/my-listings/", ListUserListingsView.as_view(), name="user-all-listings"),

    #globalsearch
    path('search-all/', GlobalSearchView.as_view(), name='global-search'),
    path('owner/', ProjectInfoView.as_view(), name='project-info')
]