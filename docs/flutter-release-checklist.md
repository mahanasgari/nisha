# Flutter release checklist

## Pre-release

- [ ] Flutter SDK matches `docs/flutter-toolchain.md` / `.fvmrc`
- [ ] `flutter analyze` clean
- [ ] `flutter test` green
- [ ] Android release build signed (`key.properties` present locally; never commit secrets)
- [ ] iOS archive on macOS CI/agent when shipping App Store
- [ ] API coverage table reviewed; staging-pending items called out
- [ ] No tokens/passwords/proof URLs in logs (spot-check `AppObservability`)

## Observability

`AppObservability` records:

- Unhandled Flutter / framework errors
- Platform dispatcher errors
- API connection and HTTP failures (sanitized)
- Seller refresh failures
- (Wire) WebSocket, upload, route/deep-link failures as those slices land

**Never include:** access/refresh tokens, passwords, payment-proof URLs, personal addresses, sensitive request bodies.

Hook the project’s production monitoring provider inside `AppObservability` when available (Sentry/etc.).

## Functional smoke

- [ ] Seller login → dashboard authenticated call
- [ ] Customer login → orders
- [ ] Public browse → checkout entitlement behavior
- [ ] Track order + proof upload
- [ ] Light/dark + FA RTL + EN LTR
- [ ] Reduced motion / large text spot check

## Store listing assets

- [ ] Screenshots for phone sizes
- [ ] Privacy policy / support URLs
- [ ] Version bump in `pubspec.yaml`
