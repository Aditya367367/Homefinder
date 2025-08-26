from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from users import views as user_views

urlpatterns = [
    path('', user_views.home, name='home'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/auth/', include('drf_social_oauth2.urls', namespace='drf')),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),


    re_path(
        r'^media/(?P<path>.*)$',
        serve,
        {'document_root': settings.MEDIA_ROOT}
    ),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
