"""Google Sign-In: link / create via verified ID token (customer + seller)."""

from datetime import UTC, datetime
from unittest.mock import patch

from app.core.security import hash_password
from app.models.customer_account import CustomerAccount
from app.models.enums import UserRole
from app.models.user import User
from app.services.auth_service import AuthError
from app.services.google_auth_service import (
    authenticate_or_create_customer_with_google,
    authenticate_or_create_seller_with_google,
)


def _google_info(**overrides):
    base = {
        "iss": "https://accounts.google.com",
        "sub": "google-sub-1",
        "email": "buyer@gmail.com",
        "email_verified": True,
        "name": "Buyer Google",
    }
    base.update(overrides)
    return base


def test_google_creates_customer(db):
    with patch(
        "app.services.google_auth_service.verify_google_id_token",
        return_value=_google_info(),
    ):
        customer = authenticate_or_create_customer_with_google(db, id_token_str="fake.token")
    assert customer.email == "buyer@gmail.com"
    assert customer.google_sub == "google-sub-1"
    assert customer.password_hash is None
    assert customer.email_verified_at is not None


def test_google_links_existing_email(db):
    existing = CustomerAccount(
        email="buyer@gmail.com",
        password_hash=hash_password("securepass"),
        full_name="Old Name",
        email_verified_at=datetime.now(UTC),
    )
    db.add(existing)
    db.commit()

    with patch(
        "app.services.google_auth_service.verify_google_id_token",
        return_value=_google_info(),
    ):
        customer = authenticate_or_create_customer_with_google(db, id_token_str="fake.token")
    assert customer.id == existing.id
    assert customer.google_sub == "google-sub-1"
    assert customer.password_hash is not None


def test_google_rejects_unverified_email(db):
    with patch(
        "app.services.google_auth_service.id_token.verify_oauth2_token",
        return_value=_google_info(email_verified=False),
    ):
        with patch("app.services.google_auth_service.settings") as mock_settings:
            mock_settings.GOOGLE_CLIENT_ID = "test-client.apps.googleusercontent.com"
            try:
                authenticate_or_create_customer_with_google(db, id_token_str="fake")
                raised = False
            except AuthError:
                raised = True
    assert raised


def test_google_creates_seller_with_store(db):
    with patch(
        "app.services.google_auth_service.verify_google_id_token",
        return_value=_google_info(email="seller@gmail.com", sub="seller-sub-1", name="Seller G"),
    ):
        user = authenticate_or_create_seller_with_google(db, id_token_str="fake.token")
    assert user.email == "seller@gmail.com"
    assert user.google_sub == "seller-sub-1"
    assert user.role == UserRole.SELLER
    assert user.password_hash is None
    assert user.email_verified_at is not None
    assert user.store is not None


def test_google_rejects_admin_email_for_seller(db):
    admin = User(
        email="admin@gmail.com",
        password_hash=hash_password("securepass"),
        full_name="Admin",
        role=UserRole.ADMIN,
        is_active=True,
        email_verified_at=datetime.now(UTC),
    )
    db.add(admin)
    db.commit()

    with patch(
        "app.services.google_auth_service.verify_google_id_token",
        return_value=_google_info(email="admin@gmail.com", sub="admin-sub"),
    ):
        try:
            authenticate_or_create_seller_with_google(db, id_token_str="fake")
            raised = False
        except AuthError as exc:
            raised = True
            assert exc.status_code == 403
    assert raised


def test_google_only_seller_cannot_use_password_form(client, db):
    with patch(
        "app.services.google_auth_service.verify_google_id_token",
        return_value=_google_info(email="gonly@gmail.com", sub="gonly-sub"),
    ):
        authenticate_or_create_seller_with_google(db, id_token_str="fake.token")

    response = client.post(
        "/api/v1/auth/login",
        json={"email": "gonly@gmail.com", "password": "anything123"},
    )
    assert response.status_code == 401


def test_google_endpoints_report_unconfigured(client):
    with patch("app.services.google_auth_service.settings") as mock_settings:
        mock_settings.GOOGLE_CLIENT_ID = ""
        seller = client.post("/api/v1/auth/google", json={"id_token": "x" * 40})
        customer = client.post("/api/v1/customer/auth/google", json={"id_token": "x" * 40})
    assert seller.status_code == 503
    assert customer.status_code == 503


def test_google_seller_login_returns_tokens(client):
    with patch(
        "app.services.google_auth_service.verify_google_id_token",
        return_value=_google_info(email="api-seller@gmail.com", sub="api-seller-sub"),
    ):
        response = client.post("/api/v1/auth/google", json={"id_token": "x" * 40})
    assert response.status_code == 200
    body = response.json()
    assert body["access_token"]
    assert body["user"]["role"] == "SELLER"
