import time
import statistics
from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from .models import Property, CustomUser

class APIPerformanceTests(TestCase):
    """Test suite for measuring API performance"""
    
    def setUp(self):
        # Create test user
        self.user = CustomUser.objects.create_user(
            email="test@example.com",
            password="testpassword123",
            name="Test User"
        )
        
        # Create test properties
        for i in range(20):
            Property.objects.create(
                user=self.user,
                title=f"Test Property {i}",
                description=f"Description for property {i}",
                price=100000 + (i * 10000),
                location="Test Location",
                property_type="Apartment",
                bedrooms=2,
                bathrooms=1,
                type="Rent",
                furnished="Furnished",
                status="Active",
                area=1000  # Added the required area field
            )
        
        self.client = Client()
    
    def test_list_properties_performance(self):
        """Test the performance of listing properties"""
        url = reverse('list-all-properties')  # Changed from 'list-properties' to 'list-all-properties'
        
        # Warm up the cache
        for _ in range(3):
            self.client.get(url)
        
        # Measure response times
        response_times = []
        for _ in range(10):
            start_time = time.time()
            response = self.client.get(url)
            end_time = time.time()
            
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            response_times.append((end_time - start_time) * 1000)  # Convert to ms
        
        # Calculate statistics
        avg_time = statistics.mean(response_times)
        median_time = statistics.median(response_times)
        percentile_95 = statistics.quantiles(response_times, n=20)[18]  # 95th percentile
        
        print(f"\nList Properties Performance:")
        print(f"Average response time: {avg_time:.2f}ms")
        print(f"Median response time: {median_time:.2f}ms")
        print(f"95th percentile: {percentile_95:.2f}ms")
        print(f"Min: {min(response_times):.2f}ms, Max: {max(response_times):.2f}ms")
        
        # Assert performance requirements
        self.assertLess(avg_time, 100, "Average response time exceeds 100ms")
        self.assertLess(median_time, 100, "Median response time exceeds 100ms")
        self.assertLess(percentile_95, 150, "95th percentile exceeds 150ms")