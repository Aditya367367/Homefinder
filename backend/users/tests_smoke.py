from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model


class APISmokeTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.email = "smoke@example.com"
        self.password = "StrongPass123!"
        self.name = "Smoke Tester"

    def auth_headers(self, access_token: str):
        return {"HTTP_AUTHORIZATION": f"Bearer {access_token}"}

    def test_smoke_end_to_end(self):
        # Health
        resp = self.client.get("/")
        self.assertEqual(resp.status_code, 200)

        # Register
        resp = self.client.post(reverse("register"), {
            "email": self.email,
            "password": self.password,
            "name": self.name
        }, content_type="application/json")
        self.assertIn(resp.status_code, (201, 400))  # 400 if already exists

        # Login
        resp = self.client.post(reverse("login"), {
            "email": self.email,
            "password": self.password
        }, content_type="application/json")
        self.assertEqual(resp.status_code, 200)
        tokens = resp.json().get("tokens", {})
        access = tokens.get("access")
        refresh = tokens.get("refresh")
        self.assertTrue(access and refresh)

        # Token refresh
        resp = self.client.post(reverse("token_refresh"), {"refresh": refresh}, content_type="application/json")
        self.assertEqual(resp.status_code, 200)
        new_access = resp.json().get("access")
        self.assertTrue(new_access)

        # Create property
        property_payload = {
            "title": "Test Prop",
            "description": "Nice place",
            "price": "123456.78",
            "location": "Test City",
            "property_type": "Apartment",
            "bedrooms": 2,
            "bathrooms": 1,
            "type": "Rent",
            "furnished": "Furnished",
            "area": 1000,
            "contact_name": "Owner",
            "contact_phone": "1234567890",
            "contact_email": self.email
        }
        resp = self.client.post(reverse("create-property"), property_payload, content_type="application/json", **self.auth_headers(access))
        self.assertEqual(resp.status_code, 201)

        # List all properties (cached)
        resp = self.client.get(reverse("list-all-properties"))
        self.assertEqual(resp.status_code, 200)

        # Featured properties
        resp = self.client.get(reverse("featured-properties"))
        self.assertEqual(resp.status_code, 200)

        # Search
        resp = self.client.get(reverse("search-properties"), {"query": "Test"})
        self.assertEqual(resp.status_code, 200)

        # Event places list
        resp = self.client.get(reverse("list-event-places"))
        self.assertEqual(resp.status_code, 200)


