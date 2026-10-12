"""
Seed extra demo accounts that already have activity on them: stores with
catalogs, customers with addresses, orders in every status, payment proofs,
reviews, complaints, chats, discount codes, visit stats and paid plans.

Idempotent: accounts that already exist are left alone.

Run from the backend directory (after scripts.seed):
    python -m scripts.seed_rich
"""

from __future__ import annotations

import random
from datetime import date, datetime, timedelta, timezone
from decimal import Decimal

from sqlalchemy import select

from app.core.config import settings
from app.core.security import hash_password
from app.models.analytics import StoreVisitDaily
from app.models.conversation import Conversation
from app.models.customer_account import CustomerAccount
from app.models.customer_portal import (
    CustomerAddress,
    CustomerOrderReceipt,
    CustomerReview,
    OrderComplaint,
)
from app.models.discount import DISCOUNT_TYPE_FIXED, DISCOUNT_TYPE_PERCENT, DiscountCode
from app.models.enums import (
    BillingPeriod,
    ComplaintStatus,
    CustomerReceiptStatus,
    OrderStatus,
    ReviewStatus,
    SellerSubscriptionStatus,
    SenderType,
    StoreBadgeType,
    StoreOnboardingStatus,
    StoreOnboardingStep,
)
from app.models.message import Message
from app.models.order import Order, OrderItem, OrderStatusHistory, PaymentProof
from app.models.payment_method import PaymentMethod
from app.models.product import Product, ProductImage
from app.models.store import StoreTrustBadge
from app.models.subscription import SellerSubscription, SubscriptionPlan
from app.models.user import User
from app.schemas.onboarding import StoreOnboardingStateResponse
from app.services.private_media_service import save_private_bytes
from app.utils.invoice import generate_invoice_code
from scripts.seed import (
    _get_or_create_category,
    ensure_seed_image,
    get_or_create_seller_and_store,
    seed_payment_methods,
)
from app.db.session import SessionLocal

DEMO_PASSWORD = "demo123456"
NOW = datetime.now(timezone.utc)
rng = random.Random(42)

SELLERS = [
    {
        "email": "sara@nisha.demo",
        "full_name": "سارا محمدی",
        "store_name": "پوشاک ماه",
        "slug": "mah-style",
        "description": "پوشاک زنانه روزمره با پارچه‌های طبیعی و دوخت ایرانی.",
        "phone": "+989121000001",
        "plan": "pro",
        "color": "#8B3A62",
        "category_slug": "fashion",
        "category_name": "مد و پوشاک",
        "location": "تهران، شهرک غرب، بلوار فرحزادی",
        "instagram": "https://instagram.com/mah.style",
        "telegram": "https://t.me/mah_style",
        "shipping": Decimal("95000"),
        "free_ship": Decimal("3000000"),
        "categories": [("مانتو", "manteau"), ("شال و روسری", "scarf"), ("کیف", "bag")],
        "products": [
            ("مانتو کتان بهاره", "manteau", "1850000", 14, "مانتو کتان سبک، آستین سه‌ربع، سایز ۳۸ تا ۴۶."),
            ("مانتو جین کوتاه", "manteau", "2150000", 6, "جین نرم با دکمه فلزی، مناسب استایل روزانه."),
            ("کیمونو لینن", "manteau", "1690000", 3, "لینن طبیعی، آزاد و خنک برای تابستان."),
            ("شال نخی ساده", "scarf", "390000", 40, "نخ پنبه، ابعاد ۷۰×۱۹۰، ۱۲ رنگ."),
            ("روسری ابریشم طرح‌دار", "scarf", "980000", 18, "ابریشم مصنوعی با چاپ دیجیتال، ۱۴۰×۱۴۰."),
            ("کیف دوشی چرم", "bag", "2650000", 9, "چرم طبیعی گاوی، دوخت دست، بند قابل تنظیم."),
            ("کیف پارچه‌ای خرید", "bag", "320000", 55, "کرباس ضخیم، مناسب خرید روزانه."),
        ],
        "discounts": [
            ("WELCOME10", DISCOUNT_TYPE_PERCENT, Decimal("10"), None, "۱۰٪ تخفیف اولین خرید"),
            ("YALDA200", DISCOUNT_TYPE_FIXED, None, Decimal("200000"), "۲۰۰ هزار تومان تخفیف یلدا"),
        ],
    },
    {
        "email": "ali@nisha.demo",
        "full_name": "علی رضایی",
        "store_name": "قهوه دانه",
        "slug": "daneh-coffee",
        "description": "دانه قهوه تازه‌برشته، آسیاب سفارشی و لوازم دم‌آوری.",
        "phone": "+989121000002",
        "plan": "basic",
        "color": "#6F4E37",
        "category_slug": "food",
        "category_name": "خوراکی و نوشیدنی",
        "location": "اصفهان، خیابان چهارباغ بالا",
        "instagram": "https://instagram.com/daneh.coffee",
        "telegram": "https://t.me/daneh_coffee",
        "shipping": Decimal("70000"),
        "free_ship": Decimal("1500000"),
        "categories": [("دانه قهوه", "beans"), ("لوازم دم‌آوری", "gear")],
        "products": [
            ("قهوه عربیکا اتیوپی ۲۵۰ گرم", "beans", "690000", 35, "برشت متوسط، نت‌های گل و توت."),
            ("قهوه بلند اسپرسو ۵۰۰ گرم", "beans", "890000", 50, "۷۰٪ عربیکا، ۳۰٪ روبوستا، کرما غلیظ."),
            ("قهوه کلمبیا ۲۵۰ گرم", "beans", "720000", 2, "برشت روشن، کارامل و سیب."),
            ("موکاپات ۶ کاپ", "gear", "1450000", 12, "آلومینیوم ایتالیایی، مناسب گاز و برقی."),
            ("فرنچ‌پرس ۶۰۰ میلی", "gear", "980000", 8, "شیشه بوروسیلیکات و فیلتر استیل."),
        ],
        "discounts": [
            ("COFFEE15", DISCOUNT_TYPE_PERCENT, Decimal("15"), None, "۱۵٪ تخفیف دانه قهوه"),
        ],
    },
]

CUSTOMERS = [
    {
        "email": "maryam@nisha.demo",
        "phone": "+989351000001",
        "full_name": "مریم احمدی",
        "addresses": [
            ("خانه", "تهران", "تهران", "خیابان شریعتی، کوچه یاس، پلاک ۱۲، واحد ۴", "1913674511", True),
            ("محل کار", "تهران", "تهران", "میدان ونک، برج نگار، طبقه ۷", "1994834111", False),
        ],
    },
    {
        "email": "reza@nisha.demo",
        "phone": "+989351000002",
        "full_name": "رضا کریمی",
        "addresses": [
            ("خانه", "شیراز", "فارس", "بلوار چمران، کوچه ۱۸، پلاک ۵", "7193711111", True),
        ],
    },
    {
        "email": "neda@nisha.demo",
        "phone": "+989351000003",
        "full_name": "ندا حسینی",
        "addresses": [
            ("خانه", "مشهد", "خراسان رضوی", "بلوار وکیل‌آباد، وکیل‌آباد ۲۴، پلاک ۳۳", "9187654321", True),
        ],
    },
]

# (customer index, store slug, status, days ago, [(product index, qty)], extras)
ORDERS = [
    (0, "mah-style", OrderStatus.DELIVERED, 40, [(0, 1), (3, 2)], {"review": (5, "عالی بود", "دوخت تمیز و ارسال سریع. ممنون از پوشاک ماه!"), "receipt": True}),
    (0, "mah-style", OrderStatus.SHIPPED, 6, [(5, 1)], {"chat": True}),
    (0, "daneh-coffee", OrderStatus.DELIVERED, 25, [(0, 2)], {"review": (4, "قهوه خوش‌عطر", "طعمش خیلی خوب بود، فقط بسته‌بندی می‌تونست بهتر باشه."), "receipt": True}),
    (0, "daneh-coffee", OrderStatus.PAYMENT_UPLOADED, 1, [(1, 1), (3, 1)], {"proof": True}),
    (1, "mah-style", OrderStatus.PAYMENT_CONFIRMED, 2, [(1, 1)], {"proof": True, "discount": "WELCOME10"}),
    (1, "mah-style", OrderStatus.DELIVERED, 55, [(4, 1)], {"complaint": True, "receipt": False}),
    (1, "daneh-coffee", OrderStatus.PREPARING, 3, [(2, 1), (4, 1)], {"proof": True, "chat": True}),
    (1, "daneh-coffee", OrderStatus.CANCELLED, 15, [(0, 1)], {}),
    (2, "mah-style", OrderStatus.PENDING_PAYMENT, 0, [(6, 3)], {}),
    (2, "mah-style", OrderStatus.PAYMENT_REJECTED, 9, [(2, 1)], {"proof": True}),
    (2, "mah-style", OrderStatus.DELIVERED, 30, [(3, 1), (6, 1)], {"review": (5, "خرید دوباره حتماً", "شال کیفیت خیلی خوبی داشت."), "receipt": True}),
    (2, "daneh-coffee", OrderStatus.DELIVERED, 20, [(1, 2)], {"review": (3, None, "ارسال یک روز دیر شد ولی قهوه خوب بود."), "receipt": True}),
]

STATUS_PATH = {
    OrderStatus.PENDING_PAYMENT: [OrderStatus.PENDING_PAYMENT],
    OrderStatus.PAYMENT_UPLOADED: [OrderStatus.PENDING_PAYMENT, OrderStatus.PAYMENT_UPLOADED],
    OrderStatus.PAYMENT_REJECTED: [OrderStatus.PENDING_PAYMENT, OrderStatus.PAYMENT_UPLOADED, OrderStatus.PAYMENT_REJECTED],
    OrderStatus.PAYMENT_CONFIRMED: [OrderStatus.PENDING_PAYMENT, OrderStatus.PAYMENT_UPLOADED, OrderStatus.PAYMENT_CONFIRMED],
    OrderStatus.PREPARING: [OrderStatus.PENDING_PAYMENT, OrderStatus.PAYMENT_UPLOADED, OrderStatus.PAYMENT_CONFIRMED, OrderStatus.PREPARING],
    OrderStatus.SHIPPED: [OrderStatus.PENDING_PAYMENT, OrderStatus.PAYMENT_UPLOADED, OrderStatus.PAYMENT_CONFIRMED, OrderStatus.PREPARING, OrderStatus.SHIPPED],
    OrderStatus.DELIVERED: [OrderStatus.PENDING_PAYMENT, OrderStatus.PAYMENT_UPLOADED, OrderStatus.PAYMENT_CONFIRMED, OrderStatus.PREPARING, OrderStatus.SHIPPED, OrderStatus.DELIVERED],
    OrderStatus.CANCELLED: [OrderStatus.PENDING_PAYMENT, OrderStatus.CANCELLED],
}


def complete_onboarding(store) -> None:
    state = StoreOnboardingStateResponse(
        status=StoreOnboardingStatus.COMPLETED,
        current_step=StoreOnboardingStep.ACTIVATION,
        completed_steps=list(StoreOnboardingStep),
        started_at=NOW - timedelta(days=90),
        updated_at=NOW - timedelta(days=89),
        completed_at=NOW - timedelta(days=89),
    )
    store.set_onboarding_state(state.model_dump(mode="json"))


def set_plan(db, user: User, plan_code: str) -> None:
    plan = db.scalar(select(SubscriptionPlan).where(SubscriptionPlan.code == plan_code))
    if plan is None:
        print(f"Plan {plan_code} not found; skipping subscription")
        return
    sub = db.scalar(select(SellerSubscription).where(SellerSubscription.seller_user_id == user.id))
    if sub is None:
        sub = SellerSubscription(seller_user_id=user.id, plan_id=plan.id, started_at=NOW - timedelta(days=60))
        db.add(sub)
    sub.plan_id = plan.id
    sub.status = SellerSubscriptionStatus.ACTIVE
    sub.billing_period = BillingPeriod.MONTHLY
    sub.current_period_start = NOW - timedelta(days=10)
    sub.current_period_end = NOW + timedelta(days=20)


def seed_seller(db, spec: dict):
    user, store = get_or_create_seller_and_store(
        db,
        email=spec["email"],
        password=DEMO_PASSWORD,
        full_name=spec["full_name"],
        store_name=spec["store_name"],
        store_slug=spec["slug"],
        description=spec["description"],
        phone=spec["phone"],
    )
    store.name = spec["store_name"]
    store.description = spec["description"]
    store.primary_color = spec["color"]
    store.category_slug = spec["category_slug"]
    store.category_name = spec["category_name"]
    store.location = spec["location"]
    store.instagram = spec["instagram"]
    store.telegram = spec["telegram"]
    store.default_shipping_cost = spec["shipping"]
    store.free_shipping_min_subtotal = spec["free_ship"]
    store.guest_checkout_enabled = True
    store.logo_url = ensure_seed_image(f"{spec['slug']}-logo", f"https://picsum.photos/seed/{spec['slug']}-logo/600/600")
    store.cover_image_url = ensure_seed_image(f"{spec['slug']}-cover", f"https://picsum.photos/seed/{spec['slug']}-cover/1600/900")
    complete_onboarding(store)
    set_plan(db, user, spec["plan"])

    if db.scalar(select(StoreTrustBadge.id).where(StoreTrustBadge.store_id == store.id)) is None:
        db.add(StoreTrustBadge(store_id=store.id, badge_type=StoreBadgeType.VERIFIED, is_active=True, assigned_at=NOW))

    seed_payment_methods(db, store)

    categories = {
        slug: _get_or_create_category(db, store, name, slug, i)
        for i, (name, slug) in enumerate(spec["categories"])
    }
    products: list[Product] = []
    for i, (title, cat, price, stock, desc) in enumerate(spec["products"]):
        product = db.scalar(select(Product).where(Product.store_id == store.id, Product.title == title))
        if product is None:
            product = Product(
                store_id=store.id,
                title=title,
                description=desc,
                price=Decimal(price),
                stock_quantity=stock,
                category_id=categories[cat].id,
                is_active=True,
            )
            db.add(product)
            db.flush()
            key = f"{spec['slug']}-p{i}"
            url = ensure_seed_image(key, f"https://picsum.photos/seed/{key}/900/900")
            db.add(ProductImage(product_id=product.id, image_url=url, thumbnail_url=url, alt_text=title, sort_order=0, mime_type="image/jpeg"))
        products.append(product)

    for code, kind, pct, amount, desc in spec["discounts"]:
        exists = db.scalar(select(DiscountCode.id).where(DiscountCode.store_id == store.id, DiscountCode.code == code))
        if exists is None:
            db.add(DiscountCode(
                store_id=store.id, code=code, description=desc, discount_type=kind,
                percent_off=pct, amount_off=amount, max_uses=100, used_count=rng.randint(3, 20),
                expires_at=NOW + timedelta(days=30), is_active=True,
            ))

    for days_ago in range(30):
        day = date.today() - timedelta(days=days_ago)
        exists = db.scalar(select(StoreVisitDaily.id).where(StoreVisitDaily.store_id == store.id, StoreVisitDaily.visit_date == day))
        if exists is None:
            db.add(StoreVisitDaily(store_id=store.id, visit_date=day, visit_count=rng.randint(15, 140)))

    print(f"Seller ready: {spec['email']}  store=/{spec['slug']}")
    return user, store, products


def seed_customer(db, spec: dict) -> CustomerAccount:
    customer = db.scalar(select(CustomerAccount).where(CustomerAccount.email == spec["email"]))
    if customer is None:
        customer = CustomerAccount(
            email=spec["email"],
            phone=spec["phone"],
            password_hash=hash_password(DEMO_PASSWORD),
            full_name=spec["full_name"],
            email_verified_at=NOW,
        )
        db.add(customer)
        db.flush()
        for label, city, province, line1, postal, default in spec["addresses"]:
            db.add(CustomerAddress(
                customer_id=customer.id, label=label, recipient_name=spec["full_name"],
                recipient_phone=spec["phone"], postal_code=postal, address_line1=line1,
                city=city, province=province, country="ایران", is_default=default,
            ))
        print(f"Created customer: {spec['email']}")
    return customer


def proof_bytes() -> bytes:
    path = ensure_seed_image("receipt-sample", "https://picsum.photos/seed/nisha-receipt/600/900")
    from pathlib import Path
    return (Path(settings.UPLOAD_DIR) / path.removeprefix("/uploads/")).read_bytes()


def seed_orders(db, customers, stores) -> None:
    for cust_idx, slug, status, days_ago, lines, extra in ORDERS:
        customer = customers[cust_idx]
        user, store, products = stores[slug]
        title0 = products[lines[0][0]].title
        already = db.scalar(
            select(Order.id).join(OrderItem).where(
                Order.customer_id == customer.id,
                Order.store_id == store.id,
                Order.status == status,
                OrderItem.product_title_snapshot == title0,
            )
        )
        if already is not None:
            continue

        created = NOW - timedelta(days=days_ago, hours=rng.randint(1, 10))
        address = customer.addresses[0] if customer.addresses else None
        pm = db.scalar(select(PaymentMethod).where(PaymentMethod.store_id == store.id).order_by(PaymentMethod.id))

        subtotal = sum(products[i].price * q for i, q in lines)
        discount_amount = Decimal("0")
        if extra.get("discount"):
            dc = db.scalar(select(DiscountCode).where(DiscountCode.store_id == store.id, DiscountCode.code == extra["discount"]))
            if dc and dc.percent_off:
                discount_amount = (subtotal * dc.percent_off / 100).quantize(Decimal("1"))
        shipping = Decimal("0") if subtotal >= (store.free_shipping_min_subtotal or 0) else store.default_shipping_cost

        order = Order(
            store_id=store.id,
            customer_id=customer.id,
            invoice_code=generate_invoice_code(db),
            invoice_password_hash=hash_password(DEMO_PASSWORD),
            buyer_name=customer.full_name,
            buyer_phone=customer.phone,
            buyer_address=f"{address.province}، {address.city}، {address.address_line1}" if address else "—",
            buyer_note="لطفاً قبل از ارسال تماس بگیرید." if rng.random() < 0.3 else None,
            payment_method_id=pm.id,
            status=status,
            subtotal_amount=subtotal,
            discount_code=extra.get("discount"),
            discount_amount=discount_amount,
            shipping_amount=shipping,
            total_amount=subtotal - discount_amount + shipping,
            stock_restored=status == OrderStatus.CANCELLED,
            reservation_expires_at=created + timedelta(hours=24) if status == OrderStatus.PENDING_PAYMENT else None,
            created_at=created,
            updated_at=created,
        )
        db.add(order)
        db.flush()
        for i, q in lines:
            p = products[i]
            db.add(OrderItem(order_id=order.id, product_id=p.id, product_title_snapshot=p.title,
                             unit_price_snapshot=p.price, quantity=q, total_price=p.price * q))

        prev = None
        for step, s in enumerate(STATUS_PATH[status]):
            db.add(OrderStatusHistory(
                order_id=order.id, old_status=prev, new_status=s,
                changed_by_user_id=user.id if step > 1 else None,
                note="رسید پرداخت نامعتبر بود" if s == OrderStatus.PAYMENT_REJECTED else None,
                created_at=created + timedelta(hours=step * 8),
            ))
            prev = s

        if extra.get("proof"):
            url = save_private_bytes(f"{settings.PAYMENT_PROOF_SUBDIR}/seed-{order.invoice_code}.jpg", proof_bytes())
            db.add(PaymentProof(order_id=order.id, image_url=url, uploaded_at=created + timedelta(hours=2)))

        if "receipt" in extra:
            db.add(CustomerOrderReceipt(
                order_id=order.id, customer_id=customer.id,
                status=CustomerReceiptStatus.RECEIVED if extra["receipt"] else CustomerReceiptStatus.NOT_RECEIVED,
            ))

        if extra.get("review"):
            rating, title, comment = extra["review"]
            db.add(CustomerReview(
                order_id=order.id, customer_id=customer.id, store_id=store.id,
                rating=rating, title=title, comment=comment, status=ReviewStatus.APPROVED,
                moderated_at=created + timedelta(days=3),
            ))

        if extra.get("complaint"):
            db.add(OrderComplaint(
                order_id=order.id, customer_id=customer.id, reason="NON_DELIVERY",
                message="وضعیت سفارش «تحویل‌شده» است ولی بسته به دستم نرسیده.",
                status=ComplaintStatus.IN_REVIEW, seller_notified_at=NOW - timedelta(days=2),
            ))

        if extra.get("chat"):
            conv = Conversation(store_id=store.id, customer_id=customer.id, order_id=order.id)
            db.add(conv)
            db.flush()
            thread = [
                (SenderType.CUSTOMER, "سلام، سفارشم کی ارسال میشه؟"),
                (SenderType.SELLER, f"سلام {customer.full_name} عزیز، سفارش شما در حال آماده‌سازی است و تا فردا ارسال می‌شود."),
                (SenderType.CUSTOMER, "ممنون، کد رهگیری هم برام می‌فرستید؟"),
            ]
            for n, (sender, body) in enumerate(thread):
                db.add(Message(
                    conversation_id=conv.id, sender_type=sender,
                    sender_user_id=user.id if sender == SenderType.SELLER else None,
                    body=body, is_read=n < len(thread) - 1,
                    created_at=created + timedelta(hours=5 + n),
                ))

        print(f"Order {order.invoice_code}: {customer.email} @ {slug} [{status.value}]")


def main() -> None:
    if settings.ENVIRONMENT == "production" and not settings.ALLOW_DEMO_SEED:
        raise SystemExit("Refusing to seed in production.")

    db = SessionLocal()
    try:
        stores = {}
        for spec in SELLERS:
            stores[spec["slug"]] = seed_seller(db, spec)
        customers = [seed_customer(db, spec) for spec in CUSTOMERS]
        db.flush()
        for c in customers:
            db.refresh(c)
        seed_orders(db, customers, stores)
        db.commit()

        print("\nRich demo seed completed. All passwords:", DEMO_PASSWORD)
        for spec in SELLERS:
            print(f"  seller    {spec['email']:<22} store=/store/{spec['slug']}  plan={spec['plan']}")
        for spec in CUSTOMERS:
            print(f"  customer  {spec['email']}")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
