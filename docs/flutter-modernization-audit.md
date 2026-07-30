# Flutter Modernization Audit

**Branch:** `feat/flutter-production-modernization`  
**Audit date:** 2026-07-31  
**App path:** `nisha_flutter/`  
**Backend source of truth:** `backend/app/api/v1`

## Baseline toolchain

| Item | Value |
|------|--------|
| Flutter | 3.44.2 (stable), framework `c9a6c48423` |
| Dart | 3.12.2 |
| DevTools | 2.57.0 |
| `pubspec` SDK | `^3.12.2` |
| Android | `minSdk` / `targetSdk` / `compileSdk` via Flutter defaults; Java 17 |
| iOS | Runner defaults (see `ios/Flutter/AppFrameworkInfo.plist`) |
| Package manager | pub (no FVM lock yet — add `.fvmrc` targeting 3.44.2) |

### Baseline quality gates (pre-modernization)

| Command | Result |
|---------|--------|
| `flutter analyze` | 1 warning: unused import in `email_verification_pending_page.dart` |
| `flutter test` | Pass — 1 widget test (`shows the Persian-first landing page`) |

## Currently working flows (preserve)

These flows work against a live API when `API_BASE_URL` is set; do **not** remove without replacement in the same slice:

1. **App bootstrap** — Riverpod + MaterialApp.router, FA default locale, RTL, theme light/dark.
2. **Public home** — `PublicHomePage` with branding and entry points.
3. **Seller auth** — register, login, email verification pending/verify, password recovery; secure storage of access token + user JSON.
4. **Customer auth** — register, login, recovery, email verification; separate secure storage keys.
5. **Session restore** — prefers seller session over customer on cold start.
6. **Route guards** — `/seller/*`, `/customer/*`, `/admin/*` redirects with login `?redirect=`.
7. **Appearance** — locale + theme controls in workspace appearance routes.
8. **Shells** — `PublicShell`, `WorkspaceShell`, `AuthShell` scaffolding.

## Architecture today

```
nisha_flutter/lib/
  core/          api (http), config, localization, router, session, theme
  features/
    auth/        models, data/auth_repository, presentation (login/register/…)
    public/      presentation/home only
  shared/        widgets (placeholders, shells), extensions
  l10n/          generated localizations
```

- State: `flutter_riverpod` 2.6.1 (no codegen).
- Routing: `go_router` 14.8.1.
- HTTP: `package:http` via `ApiClient` — **never attaches Bearer tokens**.
- Refresh token: not stored / not used (`SessionStorage` only persists access tokens).
- Commerce features: almost entirely `FeaturePlaceholderPage`.

## Screen inventory

| Area | Route / screen | Status |
|------|----------------|--------|
| Public home | `/` | Real UI |
| Track order | `/track` | Placeholder |
| Storefront | `/store/:slug` | Placeholder |
| Product detail | `/store/:slug/products/:id` | Placeholder |
| Checkout | `/store/:slug/checkout` | Placeholder |
| Invoice | `/invoice/:invoiceCode` | Placeholder |
| Seller/customer/admin auth pages | `/seller/login` … | Real UI |
| Seller workspace tabs | dashboard, products, orders, store, conversations | Placeholders |
| Customer workspace tabs | dashboard, orders, profile, reviews, complaints, conversations, downloads | Placeholders |
| Admin workspace | dashboard, stores, orders, reviews, chats | Placeholders (web-only policy) |
| Appearance | seller/customer/admin appearance | Real controls |

## Critical gaps

1. **Authenticated API** — no Authorization header; seller/customer Me/dashboard calls will fail when wired.
2. **No Dio / interceptors / refresh** — seller `POST /auth/refresh` unused; customer has no refresh (re-login on 401).
3. **No feature repositories** beyond auth — products, orders, store, public catalog, uploads, WS.
4. **No motion / design token system** — spacing/radii/durations hardcoded; purple-heavy theme not yet ClickUp-density product system.
5. **No WebSocket** — ticket → connect → reconnect missing.
6. **No multipart uploads** — payment proofs, product images.
7. **No observability** — unhandled errors not routed to a safe reporter.
8. **No Flutter CI** — root `.github/workflows/ci.yml` covers backend/frontend/docker only.
9. **Admin on mobile** — routes exist; high-risk admin must stay web-only.
10. **Seller nav order** — current bottom nav: dashboard / products / orders / store / conversations; target: خانه / سفارش‌ها / محصولات / پیام‌ها / بیشتر.

## Model / contract drift risks

- Auth models exist only for token responses; commerce schemas (onboarding `payment_details`, guest entitlements, order status enums, variants/fields) are absent.
- Seller refresh token not persisted → silent expiry after access TTL.
- Guest checkout requires platform ∧ store ∧ plan entitlement (`free` typically off).
- Private media URLs use signed `?token=` — must never log proof URLs.

## Security / role risks

- Dual JWT realms (seller/admin vs customer) must not mix Bearer tokens on wrong routes.
- Admin impersonation / plan edit / password reset: **out of scope** for mobile.
- Deep links for verify-email / recovery / store must not leak tokens in logs.

## Performance / a11y / RTL risks

- Placeholders hide future list jank; lists must paginate + virtualize.
- Vazirmatn declared but font assets may need verification for production.
- No reduced-motion path yet.
- Text scaling / offline / empty / error families incomplete.

## Migration risks

- Replacing `http` with Dio must keep auth screens working via compatibility layer.
- Dual-session: prefer explicit role switch; clearing opposite role on login is safer.
- Redesigning shells mid-flight can break redirects — keep guard logic; redesign chrome.

## Phased delivery (approved)

1. Audit docs (this file + API coverage + architecture)  
2. Foundation (Dio, auth, tokens, shells)  
3. **2.5** Design validation reference screens + `docs/flutter-ui-direction.md`  
4. Public storefront + checkout slices  
5. Seller core slices  
6. Customer + messaging / WS  
7. Subscriptions, deep links  
8. Perf, a11y, CI, observability, release docs  

## Decision stop cases

Stop for human decision only if: ambiguous backend contract, missing endpoint, required backend business-rule change, irreversible architecture ambiguity, production credentials needed, or removing a working feature without replacement.

Staging unavailable → continue from schemas; mark coverage `implemented, staging verification pending`.
