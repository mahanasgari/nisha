# Flutter API Coverage

Status legend:

| Status | Meaning |
|--------|---------|
| `missing` | Not implemented in Flutter |
| `partial` | UI or client stub only |
| `auth-only` | Works for login/register paths without full product UI |
| `implemented` | End-to-end client + screen |
| `implemented, staging verification pending` | Code complete; staging not exercised |
| `out-of-scope` | Mobile deliberately skips (admin high-risk / web-only) |

Last updated: 2026-07-31 (Phases 2–6 slices).

## Auth

| Capability | Endpoint | Flutter service | Screen | Status | Tests | Limits |
|------------|----------|-----------------|--------|--------|-------|--------|
| Seller register | `POST /auth/register` | `AuthRepository` | Seller register | implemented, staging verification pending | widget | Email verification gate |
| Seller login | `POST /auth/login` | `AuthRepository` | Seller login | implemented, staging verification pending | — | Bearer + refresh stored |
| Seller refresh | `POST /auth/refresh` | `ApiClient` interceptor | — | implemented, staging verification pending | — | Single-flight |
| Seller me | `GET /auth/me` | — | — | missing | — | |
| Seller recovery | `POST /auth/password-recovery/*` | `AuthRepository` | Seller recovery | implemented, staging verification pending | — | |
| Customer auth | `/customer/login|register|recovery` | `AuthRepository` | Customer auth pages | implemented, staging verification pending | — | No refresh |
| Verify email | `/public/verify-email*` | `AuthRepository` | Verify / pending | implemented, staging verification pending | — | |

## Public commerce

| Capability | Endpoint | Flutter service | Screen | Status | Tests | Limits |
|------------|----------|-----------------|--------|--------|-------|--------|
| Home discovery | `GET /public/home` | `PublicRepository` | Public home | implemented, staging verification pending | widget | |
| Store page | `GET /public/stores/{slug}` | `PublicRepository` | Store page | implemented, staging verification pending | — | |
| Product list | nested on store + list endpoint | `PublicRepository` | Store page | implemented, staging verification pending | — | Client filter + API list |
| Product detail | `GET …/products/{id}` | `PublicRepository` | Product detail | implemented, staging verification pending | — | |
| Guest checkout | `POST …/orders` | `PublicRepository` | Checkout | implemented, staging verification pending | — | Entitlement gated |
| Track order | `POST /public/orders/track` | `PublicRepository` | Track page | implemented, staging verification pending | — | |
| Upload payment proof | `POST …/upload-payment-proof` | `PublicRepository` | Track page | implemented, staging verification pending | — | Multipart |
| Discount preview | `POST …/discount-preview` | — | — | missing | — | |
| Guest chat / reviews | public order chat/review | — | — | missing | — | |
| Guest/auth uploads helpers | `/public/uploads*` | partial via proof | — | partial | — | |

## Seller

| Capability | Endpoint | Flutter service | Screen | Status | Tests | Limits |
|------------|----------|-----------------|--------|--------|-------|--------|
| Dashboard | `GET /seller/dashboard` | `SellerRepository` | Dashboard | implemented, staging verification pending | — | |
| Orders list/detail | `/seller/orders*` | `SellerRepository` | Orders | implemented, staging verification pending | — | |
| Confirm/reject payment | confirm/reject | `SellerRepository` | Order detail | implemented, staging verification pending | — | |
| Order status patch | `PATCH …/status` | `SellerRepository` | — | implemented, staging verification pending | — | Wired in repo |
| Products CRUD | `/seller/products*` | `SellerRepository` | List + form | implemented, staging verification pending | — | Images/variants next |
| Onboarding | `GET/PATCH /seller/onboarding` | `SellerRepository` | Onboarding | implemented, staging verification pending | — | payment_details aware |
| Plans / subscription | `/seller/plans`, `/seller/subscription` | `SellerRepository` | Subscription | implemented, staging verification pending | — | Checkout proof next |
| Conversations list | `GET /seller/conversations` | `MessagingRepository` | Conversations | implemented, staging verification pending | — | Live WS next |
| Store settings / categories / discounts / analytics / exports | various | — | More hub partial | partial | — | |
| Payment methods | `/seller/payment-methods*` | — | — | missing | — | |

## Customer

| Capability | Endpoint | Flutter service | Screen | Status | Tests | Limits |
|------------|----------|-----------------|--------|--------|-------|--------|
| Dashboard | `GET /customer/dashboard` | `CustomerRepository` | Dashboard | implemented, staging verification pending | — | |
| Orders list/detail | `/customer/orders*` | `CustomerRepository` | Orders | implemented, staging verification pending | — | |
| Profile | `/customer/profile` | `CustomerRepository` | Profile | implemented, staging verification pending | — | |
| Conversations | `/customer/conversations` | `MessagingRepository` | Conversations | implemented, staging verification pending | — | |
| Addresses / reviews / complaints / claim | various | — | — | missing | — | |
| Auth checkout | `POST /customer/stores/{slug}/orders` | — | — | missing | — | |

## Media / WebSocket

| Capability | Endpoint | Flutter service | Screen | Status | Tests | Limits |
|------------|----------|-----------------|--------|--------|-------|--------|
| WS tickets | `POST /ws/tickets/*` | `MessagingRepository` / `WsTicketClient` | — | implemented, staging verification pending | — | Client ready |
| WS channels | `WS /ws/*` | `WsTicketClient` | — | partial | — | Reconnect backoff; chat UI TODO |
| Private media | `GET /media/private/{key}` | — | — | missing | — | Never log URL |

## Admin (mobile)

| Capability | Endpoint | Flutter service | Screen | Status | Tests | Limits |
|------------|----------|-----------------|--------|--------|-------|--------|
| High-risk admin | `/admin/*` | — | Use-web empty state | out-of-scope | — | |

## Health

| Capability | Endpoint | Flutter service | Screen | Status | Tests | Limits |
|------------|----------|-----------------|--------|--------|-------|--------|
| Health | `GET /health` | — | — | missing | — | Optional |
