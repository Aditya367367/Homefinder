from celery import shared_task
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.core.cache import cache
from django.utils import timezone
from datetime import timedelta

@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_password_reset_email(self, subject, html_content, plain_content, to_emails):
    try:
        email = EmailMultiAlternatives(
            subject=subject,
            body=plain_content,
            to=to_emails
        )
        email.attach_alternative(html_content, "text/html")
        email.send(fail_silently=False)
    except Exception as exc:
        raise self.retry(exc=exc)

@shared_task(bind=True, max_retries=3, default_retry_delay=30)
def create_notification(self, user_id, message, notification_type, related_object_id):
    try:
        from .models import Notification, CustomUser
        user = CustomUser.objects.only("id").get(id=user_id)
        Notification.objects.create(
            user=user,
            message=message,
            notification_type=notification_type,
            related_object_id=related_object_id
        )
        
        # Invalidate user notification cache
        cache.delete(f"user:notifications:{user_id}")
        
    except Exception as exc:
        raise self.retry(exc=exc)

@shared_task(bind=True, max_retries=2, default_retry_delay=60)
def send_announcement_to_all_users(self, message):
    try:
        from .models import Notification, CustomUser
        users = CustomUser.objects.filter(is_active=True).only("id")
        
        # Use batch processing for better performance
        batch_size = 500
        total_users = users.count()
        
        for i in range(0, total_users, batch_size):
            batch = users[i:i+batch_size]
            notifications = [
                Notification(
                    user_id=user.id,
                    message=message,
                    notification_type='announcement',
                    related_object_id=None
                ) for user in batch
            ]
            if notifications:
                Notification.objects.bulk_create(notifications, ignore_conflicts=True)
        
        # Invalidate notification caches
        if hasattr(cache, "delete_pattern"):
            cache.delete_pattern("user:notifications:*")
            
    except Exception as exc:
        raise self.retry(exc=exc)

@shared_task
def cleanup_old_notifications():
    """Remove old notifications to keep the database lean"""
    from .models import Notification
    # Delete read notifications older than 30 days
    thirty_days_ago = timezone.now() - timedelta(days=30)
    Notification.objects.filter(
        is_read=True, 
        created_at__lt=thirty_days_ago
    ).delete()
    
    # Delete all notifications older than 90 days
    ninety_days_ago = timezone.now() - timedelta(days=90)
    Notification.objects.filter(created_at__lt=ninety_days_ago).delete()
