import functools
import hashlib
import re
from typing import Any, Callable, Dict, List, Optional, Set, Tuple, Union

from django.conf import settings
from django.core.cache import cache
from django.http import HttpRequest, HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework.response import Response

# Cache TTLs from settings
CACHE_TTL_SHORT = getattr(settings, "API_CACHE_TTL_SHORT", 60)    # search-like
CACHE_TTL_MEDIUM = getattr(settings, "API_CACHE_TTL_MEDIUM", 120)  # lists
CACHE_TTL_LONG = getattr(settings, "API_CACHE_TTL_LONG", 300)    # details

# Cache key helpers
def make_cache_key(prefix: str, *args: Any, **kwargs: Any) -> str:
    """
    Create a deterministic cache key from prefix and arguments.
    
    Args:
        prefix: A string prefix for the cache key
        *args: Positional arguments to include in the key
        **kwargs: Keyword arguments to include in the key
        
    Returns:
        A string cache key
    """
    key_parts = [prefix]
    
    # Add positional args
    for arg in args:
        if arg is not None:
            key_parts.append(str(arg))
    
    # Add keyword args, sorted for deterministic keys
    if kwargs:
        sorted_items = sorted(kwargs.items())
        for k, v in sorted_items:
            if v is not None:
                key_parts.append(f"{k}:{v}")
    
    # Create a single string and hash it if it's too long
    key = ":".join(key_parts)
    if len(key) > 250:  # Redis keys should be kept reasonably short
        hash_obj = hashlib.md5(key.encode())
        return f"{prefix}:hash:{hash_obj.hexdigest()}"
    
    return key

def _get_group_from_prefix(prefix: str) -> Optional[str]:
    if prefix.startswith("prop"):
        return "prop"
    if prefix.startswith("event"):
        return "event"
    if prefix.startswith("global"):
        return "global"
    return None

def get_cache_group_version(group: str) -> int:
    try:
        ver = cache.get(f"v:{group}")
        return int(ver) if ver is not None else 1
    except Exception:
        return 1

def bump_cache_group_version(group: str) -> None:
    try:
        key = f"v:{group}"
        with cache.lock(f"lock:{key}", timeout=2):  # type: ignore[attr-defined]
            current = cache.get(key)
            cache.set(key, (int(current) if current is not None else 1) + 1)
    except Exception:
        # Fallback simple set
        try:
            key = f"v:{group}"
            current = cache.get(key)
            cache.set(key, (int(current) if current is not None else 1) + 1)
        except Exception:
            pass

def cache_key_from_request(prefix: str, request: HttpRequest) -> str:
    """
    Create a cache key from a request object, including user ID and query params.
    
    Args:
        prefix: A string prefix for the cache key
        request: The HttpRequest object
        
    Returns:
        A string cache key
    """
    user_part = f"user:{request.user.id}" if getattr(request, "user", None) and request.user.is_authenticated else "anon"
    qs = request.META.get('QUERY_STRING', '')
    path = request.path
    
    # Create key with all components
    group = _get_group_from_prefix(prefix)
    version = get_cache_group_version(group) if group else 1
    key = f"{prefix}:v{version}:{user_part}:{path}?{qs}"
    
    # Hash if too long
    if len(key) > 250:
        hash_obj = hashlib.md5(key.encode())
        return f"{prefix}:{user_part}:hash:{hash_obj.hexdigest()}"
    
    return key

# Cache decorators
def cache_response(timeout: int = CACHE_TTL_MEDIUM, key_prefix: str = ""):
    """
    Cache a DRF API view response.
    
    Args:
        timeout: Cache timeout in seconds
        key_prefix: Prefix for the cache key
        
    Returns:
        Decorated function
    """
    def decorator(view_func):
        @functools.wraps(view_func)
        def wrapper(self, request, *args, **kwargs):
            # Skip caching for non-GET requests
            if request.method != 'GET':
                return view_func(self, request, *args, **kwargs)
            
            # Generate a cache key
            prefix = key_prefix or f"{self.__class__.__name__.lower()}"
            key = cache_key_from_request(prefix, request)
            
            # Try to get from cache
            cached_payload = cache.get(key)
            if cached_payload is not None:
                try:
                    status_code = cached_payload.get("status", 200)
                    content = cached_payload.get("content", b"")
                    headers = cached_payload.get("headers", {})
                    resp = HttpResponse(content=content, status=status_code)
                    for hn, hv in headers.items():
                        resp[hn] = hv
                    return resp
                except Exception:
                    pass
            
            # Get the response and cache it
            response = view_func(self, request, *args, **kwargs)
            try:
                # Ensure content is rendered to bytes
                if hasattr(response, 'render'):
                    response.render()
                payload = {
                    "status": getattr(response, 'status_code', 200),
                    "content": getattr(response, 'content', b""),
                    "headers": {k: v for k, v in getattr(response, 'items', lambda: [])()},
                }
                cache.set(key, payload, timeout)
            except Exception:
                # On any serialization issue, skip caching
                pass
            
            return response
        return wrapper
    return decorator

# Class-based view decorator
def cache_view(timeout: int = CACHE_TTL_MEDIUM, key_prefix: str = ""):
    """
    Class-based view decorator for caching.
    
    Args:
        timeout: Cache timeout in seconds
        key_prefix: Prefix for the cache key
        
    Returns:
        Decorated class method
    """
    def decorator(view_method):
        return method_decorator(cache_response(timeout, key_prefix))(view_method)
    return decorator

# Cache invalidation
def invalidate_cache_patterns(patterns: List[str]) -> None:
    """
    Invalidate cache keys matching the given patterns.
    
    Args:
        patterns: List of patterns to match against cache keys
    """
    try:
        # Use delete_pattern if available (Redis backend)
        if hasattr(cache, "delete_pattern"):
            for pattern in patterns:
                cache.delete_pattern(pattern)
        else:
            # Fallback: get all keys and delete matching ones
            # Note: This is less efficient but works with non-Redis backends
            if hasattr(cache, "keys"):
                all_keys = cache.keys("*")
                for pattern in patterns:
                    regex = re.compile(pattern.replace("*", ".*"))
                    matching_keys = [k for k in all_keys if regex.match(k)]
                    for key in matching_keys:
                        cache.delete(key)
    except Exception as e:
        # Log the error but don't crash
        print(f"Error invalidating cache: {e}")

# Selective cache middleware
class SelectiveCacheMiddleware:
    """
    Middleware that selectively caches responses based on URL patterns.
    """
    def __init__(self, get_response):
        self.get_response = get_response
        # Compile regex patterns for URLs to cache
        self.cache_patterns = [
            # Property endpoints in this project
            re.compile(r'^/api/auth/property/all/$'),
            re.compile(r'^/api/auth/property/featured/$'),
            re.compile(r'^/api/auth/property/\d+/similar/$'),
            re.compile(r'^/api/auth/property/search/$'),
            re.compile(r'^/api/auth/property/\d+/$'),
            # Event places
            re.compile(r'^/api/auth/event-place/all/$'),
            re.compile(r'^/api/auth/event-place/\d+/$'),
        ]
        # Patterns to exclude (never cache)
        self.exclude_patterns = [
            # User-specific and auth endpoints
            re.compile(r'^/api/auth/login/'),
            re.compile(r'^/api/auth/register/'),
            re.compile(r'^/api/auth/logout/'),
            re.compile(r'^/api/auth/token/'),
            re.compile(r'^/api/auth/password-reset'),
            re.compile(r'^/api/auth/user/'),
            re.compile(r'^/api/auth/update/user/'),
            re.compile(r'^/api/auth/owner/'),
            re.compile(r'^/api/auth/meeting'),
            re.compile(r'^/api/auth/notifications'),
        ]
        # Default cache timeout
        self.default_timeout = CACHE_TTL_MEDIUM
    
    def __call__(self, request):
        # Only cache GET requests
        if request.method != 'GET':
            return self.get_response(request)
        
        # Skip caching for authenticated requests (user may not be attached yet)
        user = getattr(request, "user", None)
        if user is not None and getattr(user, "is_authenticated", False):
            return self.get_response(request)
        
        # Check if URL should be excluded
        path = request.path
        for pattern in self.exclude_patterns:
            if pattern.match(path):
                return self.get_response(request)
        
        # Check if URL should be cached
        should_cache = False
        for pattern in self.cache_patterns:
            if pattern.match(path):
                should_cache = True
                break
        
        if not should_cache:
            return self.get_response(request)
        
        # Generate cache key
        key = cache_key_from_request("mw", request)
        
        # Try to get from cache (we store primitives)
        cached_payload = cache.get(key)
        if cached_payload is not None:
            try:
                status_code = cached_payload.get("status", 200)
                content = cached_payload.get("content", b"")
                headers = cached_payload.get("headers", {})
                resp = HttpResponse(content=content, status=status_code)
                for hn, hv in headers.items():
                    resp[hn] = hv
                return resp
            except Exception:
                # fall through to recompute on any error
                pass
        
        # Get the response
        response = self.get_response(request)
        
        # Only cache successful responses (store primitives)
        if 200 <= response.status_code < 300:
            payload = {
                "status": response.status_code,
                "content": getattr(response, "content", b""),
                "headers": {k: v for k, v in response.items()},
            }
            cache.set(key, payload, self.default_timeout)
        
        return response