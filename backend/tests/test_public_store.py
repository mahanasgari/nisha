def test_get_public_store(client, public_store):
    response = client.get(f"/api/v1/public/stores/{public_store['slug']}")

    assert response.status_code == 200
    data = response.json()
    assert data["store"]["slug"] == public_store["slug"]
    assert len(data["products"]) == 1
    assert data["products"][0]["title"] == "Public Hoodie"
    assert len(data["payment_methods"]) == 1


def test_list_public_products(client, public_store):
    response = client.get(f"/api/v1/public/stores/{public_store['slug']}/products")

    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["page"] == 1
    assert data["has_more"] is False
    assert len(data["items"]) == 1
    assert data["items"][0]["stock_quantity"] == 10


def test_inactive_store_not_found(client, public_store):
    deactivate = client.put(
        "/api/v1/seller/store",
        headers=public_store["seller_headers"],
        json={"is_active": False},
    )
    assert deactivate.status_code == 200

    response = client.get(f"/api/v1/public/stores/{public_store['slug']}")
    assert response.status_code == 404


def test_product_page_with_approved_review(client, public_store, db):
    """Regression: an approved store review used to 500 every product page."""
    from decimal import Decimal

    from app.core.security import hash_password
    from app.models.customer_account import CustomerAccount
    from app.models.customer_portal import CustomerReview
    from app.models.enums import OrderStatus, ReviewStatus
    from app.models.order import Order
    from app.models.store import Store

    store = db.query(Store).filter(Store.slug == public_store["slug"]).one()
    customer = CustomerAccount(email="buyer@example.com", password_hash=hash_password("x" * 12), full_name="Buyer")
    db.add(customer)
    db.flush()
    order = Order(
        store_id=store.id,
        customer_id=customer.id,
        invoice_code="NV-REVIEW01",
        invoice_password_hash=hash_password("x" * 12),
        buyer_name="Buyer",
        buyer_phone="09120000000",
        buyer_address="Tehran",
        payment_method_id=public_store["payment_method_id"],
        status=OrderStatus.DELIVERED,
        subtotal_amount=Decimal("49.99"),
        total_amount=Decimal("49.99"),
    )
    db.add(order)
    db.flush()
    db.add(CustomerReview(order_id=order.id, customer_id=customer.id, store_id=store.id,
                          rating=5, title="Great", comment="Loved it", status=ReviewStatus.APPROVED))
    db.commit()

    response = client.get(f"/api/v1/public/stores/{public_store['slug']}/products/{public_store['product_id']}")

    assert response.status_code == 200
    data = response.json()
    assert data["public_reviews"][0]["rating"] == 5
    assert data["review_summary"]["review_count"] == 1
