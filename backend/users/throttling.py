from rest_framework.throttling import SimpleRateThrottle
import time

class SafeSimpleRateThrottle(SimpleRateThrottle):
    """A rate throttle that safely handles deserialization issues"""
    
    def allow_request(self, request, view):
        """Override to safely handle history from cache"""
        if self.rate is None:
            return True

        self.key = self.get_cache_key(request, view)
        if self.key is None:
            return True

        # Get history from cache and ensure it's a list. This is the fix.
        history = self.cache.get(self.key, [])
        if not isinstance(history, list):
            history = []
        self.history = history
        self.now = self.timer()

        # Drop any requests from the history which have now passed the
        # throttle duration
        while self.history and self.history[-1] <= self.now - self.duration:
            self.history.pop()

        if len(self.history) >= self.num_requests:
            return self.throttle_failure()

        return self.throttle_success()


class AnonBurstThrottle(SafeSimpleRateThrottle):
    scope = 'anon_burst'
    def get_cache_key(self, request, view):
        if request.user and request.user.is_authenticated:
            return None
        return self.get_ident(request)


class UserBurstThrottle(SafeSimpleRateThrottle):
    scope = 'user_burst'
    def get_cache_key(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return None
        return f"user-burst:{request.user.id}"


class AnonSustainedThrottle(SafeSimpleRateThrottle):
    scope = 'anon_sustained'
    def get_cache_key(self, request, view):
        if request.user and request.user.is_authenticated:
            return None
        return self.get_ident(request)


class UserSustainedThrottle(SafeSimpleRateThrottle):
    scope = 'user_sustained'
    def get_cache_key(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return None
        return f"user-sustained:{request.user.id}"


# Safe replacements for DRF default Anon/User throttles used by 3rd-party views
class AnonDefaultThrottle(SafeSimpleRateThrottle):
    scope = 'anon'
    def get_cache_key(self, request, view):
        if request.user and request.user.is_authenticated:
            return None
        return self.get_ident(request)


class UserDefaultThrottle(SafeSimpleRateThrottle):
    scope = 'user'
    def get_cache_key(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return None
        return f"user:{request.user.id}"