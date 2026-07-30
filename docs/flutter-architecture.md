# Flutter Architecture (Target)

## Principles

1. Backend schemas and routes are the source of truth.
2. Feature-first layout under `nisha_flutter/lib/features/<domain>/`.
3. Riverpod for DI and state; go_router for navigation and role guards.
4. Vertical slices: models → repository → providers → UI → motion → tests → coverage.
5. Preserve working auth/storage/l10n/RTL/guards; redesign visuals freely for ClickUp-level quality.
6. Admin high-risk tooling stays web-only.

## Target directory layout

```
lib/
  core/
    api/           Dio client, interceptors, ApiException, auth context
    animations/    Motion tokens + primitives (NishaScalePress, shimmer, …)
    config/        AppConfig, toolchain constants
    localization/  LocaleController
    observability/ Safe error reporting (no secrets)
    router/        go_router, shells wiring, route paths
    session/       SessionController, SessionStorage (secure)
    theme/         Colors, spacing, radii, typography, ThemeData
  features/
    auth/
    public/        home, store, product, cart, checkout, track, invoice
    seller/        dashboard, products, orders, store, onboarding, …
    customer/      dashboard, orders, profile, conversations, …
    messaging/     shared WS ticket client + connection state
    subscription/  seller plans / invoices (Phase 6)
  shared/
    widgets/       buttons, fields, chips, cards, states, money input
    extensions/
  l10n/
```

## Networking

- **Dio** base URL: `AppConfig.apiUrl` (`API_BASE_URL` + `/api/v1`).
- Interceptor attaches Bearer from active role (`seller` | `customer`) based on request path prefix or explicit `AuthScope`.
- Seller 401 → single-flight `POST /auth/refresh` using stored refresh token; queue retries; logout on failure.
- Customer 401 → clear session and redirect to login (no refresh).
- Multipart + progress callbacks for proofs/images.
- Never log tokens, passwords, proof URLs, addresses, or full sensitive bodies.

Compatibility: keep `ApiClient` method signatures (`get/post/…` + parser) so `AuthRepository` can migrate with minimal churn.

## Session policy

- Secure storage keys for seller access + refresh + user JSON; customer access + customer JSON.
- Prefer explicit role switch; on login of one role, clear the other role’s cache to avoid cross-realm Bearer mistakes.
- Deep-link `?redirect=` after successful login (already present).

## Navigation shells

| Shell | Tabs (FA) |
|-------|-----------|
| Public | Top chrome / home-focused |
| Seller | خانه / سفارش‌ها / محصولات / پیام‌ها / بیشتر |
| Customer | خانه / سفارش‌ها / پیام‌ها / حساب |

Role guards unchanged in spirit. Admin destinations: empty “use web” or redirect — no high-risk features.

## Design + motion

Tokens (centralized only):

| Token | Duration |
|-------|----------|
| press | 80–140 ms |
| control | 120–180 ms |
| listChange | 180–240 ms |
| navigation | 220–300 ms |
| bottomSheet | 220–320 ms |
| complex max | 350 ms |

Spacing: 4, 8, 12, 16, 20, 24, 32, 40. Radii: 8, 12, 16, 20, 24.

Respect `MediaQuery.disableAnimations` / reduced motion. See `docs/flutter-ui-direction.md` (Phase 2.5).

## Riverpod rules

- Repositories as `Provider`.
- Async feature state as `AsyncNotifier` / `Notifier`.
- Codegen (`riverpod_annotation`) introduced in foundation; commit generated files; CI verifies freshness.
- No API calls inside `build()` without proper family keys and cancellation.

## Vertical slice checklist

1. Inspect backend route + schema  
2. Models  
3. Repository  
4. Providers  
5. Screens (list + detail/edit)  
6. Loading / empty / error / offline  
7. Motion feedback  
8. Tests  
9. Update `docs/flutter-api-coverage.md`  
10. Staging verify or mark pending  

## Toolchain lock

| Tool | Locked / recorded |
|------|-------------------|
| Flutter | 3.44.2 (document in `.fvmrc` / `docs/flutter-toolchain.md`) |
| Dart | 3.12.2 |
| Android Java | 17 |
| Codegen | `dart run build_runner build --delete-conflicting-outputs` when enabled |

Do not upgrade Flutter or major deps blindly. Document each new major dependency in the audit or toolchain doc.

## Related docs

- `docs/flutter-modernization-audit.md`
- `docs/flutter-api-coverage.md`
- `docs/flutter-ui-direction.md` (Phase 2.5)
- `docs/flutter-design-system.md`, `docs/flutter-testing.md`, `docs/flutter-release-checklist.md` (filled through Phase 7)

Older `docs/FLUTTER_*.md` files are superseded where they conflict with this architecture and the live backend.
