import msgpack
from django_redis.serializers.msgpack import MSGPackSerializer

class CustomMSGPackSerializer(MSGPackSerializer):
    """Custom MSGPackSerializer that handles ExtraData exceptions"""

    def loads(self, value: bytes) -> any:
        """Load value from msgpack binary format, handling ExtraData exceptions"""
        try:
            return msgpack.loads(value, raw=False)
        except msgpack.exceptions.ExtraData as e:
            # Return just the unpacked data and ignore the extra data
            return e.unpacked