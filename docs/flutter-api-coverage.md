# Flutter API Coverage

Status legend:

| Status | Meaning |
|--------|---------|
| `missing` | Not implemented in Flutter |
| `partial` | UI or client stub only |
| `auth-only` | Works for login/register paths without Bearer attachment |
| `implemented` | End-to-end client + screen |
| `implemented, staging verification pending` | Code complete; staging not exercised |
| `out-of-scope` | Mobile deliberately skips (admin high-risk / web-only) |

Last updated: 2026-07-31 (Phase 1 baseline). Update continuously each slice.

## Auth

| Capability | Endpoint | Flutter service | Screen | Status | Tests | Limits |
|------------|----------|-----------------|--------|--------|-------|--------|
| Seller register | `POST /auth/register` | `AuthRepository` | Seller register | auth-only | none | Email verification gate |
| Seller login | `POST /auth/login` | `AuthRepository` | Seller login | auth-only | none | Tokens not attached later |
| Seller refresh | `POST /auth/refresh` | — | — | missing | — | Must single-flight |
| Seller me | `GET /auth/me` | — | — | missing | — | |
| Seller recovery request | `POST /auth/password-recovery/request` | `AuthRepository` | Seller recovery | auth-only | none | |
| Seller recovery verify | `POST /auth/password-recovery/verify` | `AuthRepository` | Seller recovery | auth-only | none | |
| Customer register | `POST /customer/register` | `AuthRepository` | Customer register | auth-only | none | |
| Customer login | `POST /customer/login` | `AuthRepository` | Customer login | auth-only | none | No refresh |
| Customer me | `GET /customer/me` | — | — | missing | — | |
| Customer recovery | `POST /customer/password-recovery/*` | `AuthRepository` | Customer recovery | auth-only | none | Access-only token |
| Verify email | `POST /public/verify-email` | `AuthRepository` | Verify email | auth-only | none | |
| Resend verification | `POST /public/verify-email/resend` | `AuthRepository` | Pending page | auth-only | none | |

## Public commerce

| Capability | Endpoint | Flutter service | Screen | Status | Tests | Limits |
|------------|----------|-----------------|--------|--------|-------|--------|
| Home discovery | `GET /public/home` | — | Public home (static) | missing | widget home | Wire search |
| Store page | `GET /public/stores/{slug}` | — | Placeholder | missing | — | |
| Product list | `GET /public/stores/{slug}/products` | — | Placeholder | missing | — | Filter/sort/page |
| Product detail | `GET /public/stores/{slug}/products/{id}` | — | Placeholder | missing | — | Variants/fields |
| Discount preview | `POST /public/stores/{slug}/discount-preview` | — | — | missing | — | |
| Guest checkout | `POST /public/stores/{slug}/orders` | — | Placeholder | missing | — | Entitlement gated |
| Visit | `POST /public/stores/{slug}/visit` | — | — | missing | — | |
| Track order | `POST /public/orders/track` | — | Placeholder | missing | — | Invoice pwd |
| Upload payment proof | `POST /public/orders/{code}/upload-payment-proof` | — | — | missing | — | Multipart |
| Edit guest order | `PATCH /public/orders/{code}/edit` | — | — | missing | — | |
| Guest chat | `POST /public/orders/{code}/chat*` | — | — | missing | — | |
| Guest review | `POST /public/orders/{code}/reviews` | — | — | missing | — | |
| Guest uploads | `POST /public/uploads/guest/*` | — | — | missing | — | Rate limited |
| Auth uploads | `POST /public/uploads/{files,images,videos}` | — | — | missing | — | any-user |
| Sitemap | `GET /public/sitemap` | — | — | out-of-scope | — | Web SEO |

## Seller

| Capability | Endpoint | Flutter service | Screen | Status | Tests | Limits |
|------------|----------|-----------------|--------|--------|-------|--------|
| Store get/update | `GET/PUT /seller/store` | — | Placeholder | missing | — | Entitlements |
| Social links | `/seller/store/social-links*` | — | — | missing | — | |
| Categories CRUD | `/seller/categories*` | — | — | missing | — | On Products |
| Products CRUD + images + fields | `/seller/products*` | — | Placeholder | missing | — | |
| Payment methods | `/seller/payment-methods*` | — | — | missing | — | |
| Orders list/detail | `/seller/orders*` | — | Placeholder | missing | — | |
| Confirm/reject payment | `POST …/confirm-payment|reject-payment` | — | — | missing | — | |
| Order status | `PATCH …/status` | — | — | missing | — | |
| Invoice file | `GET …/invoice` | — | — | missing | — | |
| Dashboard | `GET /seller/dashboard` | — | Placeholder | missing | — | |
| Onboarding (+ payment_details) | `GET/PATCH /seller/onboarding` | — | — | missing | — | |
| Conversations | `/seller/conversations*` | — | Placeholder | missing | — | + WS |
| Discounts | `/seller/discounts*` | — | — | missing | — | |
| Analytics | `GET /seller/analytics` | — | — | missing | — | Plan days |
| Plans / subscription | `/seller/plans`, `/seller/subscription*` | — | — | missing | — | |
| CSV exports | `/seller/exports/*.csv` | — | — | missing | — | Entitled |

## Customer

| Capability | Endpoint | Flutter service | Screen | Status | Tests | Limits |
|------------|----------|-----------------|--------|--------|-------|--------|
| Auth checkout | `POST /customer/stores/{slug}/orders` | — | — | missing | — | |
| Profile / addresses | `/customer/profile`, `/customer/addresses*` | — | Placeholder | missing | — | |
| Orders | `/customer/orders*` | — | Placeholder | missing | — | |
| Claim / receipt / complaints | order sub-routes | — | Placeholder | missing | — | |
| Reviews | `/customer/reviews*` | — | Placeholder | missing | — | |
| Conversations | `/customer/conversations*` | — | Placeholder | missing | — | + WS |
| Dashboard | `GET /customer/dashboard` | — | Placeholder | missing | — | |

## Media / WebSocket

| Capability | Endpoint | Flutter service | Screen | Status | Tests | Limits |
|------------|----------|-----------------|--------|--------|-------|--------|
| Private media | `GET /media/private/{key}` | — | — | missing | — | Never log URL |
| WS tickets | `POST /ws/tickets/{seller,customer,order}` | — | — | missing | — | 60s ticket |
| WS channels | `WS /ws/seller|customer|orders/{code}` | — | — | missing | — | Reconnect + new ticket |

## Admin (mobile)

| Capability | Endpoint | Flutter service | Screen | Status | Tests | Limits |
|------------|----------|-----------------|--------|--------|-------|--------|
| High-risk admin | `/admin/*` | — | Placeholders | out-of-scope | — | Use web; no impersonation / plan edit / password reset |

## Health

| Capability | Endpoint | Flutter service | Screen | Status | Tests | Limits |
|------------|----------|-----------------|--------|--------|-------|--------|
| Health | `GET /health` | — | — | missing | — | Optional startup probe |
