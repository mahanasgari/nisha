# Launch readiness (soft launch for test sellers / early adopters)

Status as of 2026-10-12, branch `launch-prep`. Companion to
[`qa-launch-checklist.fa.md`](./qa-launch-checklist.fa.md) and
[`soft-launch-runbook.fa.md`](./soft-launch-runbook.fa.md).

## Verified

| Check | Result |
|---|---|
| Backend tests (`pytest`) | all pass |
| Frontend type check (`tsc --noEmit`) / lint | pass (lint: warnings only) |
| Production images build (`Dockerfile.prod` ×2) | pass; both run as non-root |
| Fresh Postgres: all 25 migrations from empty DB | pass |
| E2E on the production build (`e2e/`) | 14/14 pass |
| Role sweep: every page as public / seller / customer / admin at 375px | no crashes, no horizontal scroll, no raw enum codes |
| Rate limits behind proxy | per client IP (verified with distinct `X-Forwarded-For`) |
| Authz spot checks | customer → seller API 401; seller A → seller B order 404 |

## Fixed in this pass

- **Product pages 500'd once a store had any approved review** (`PublicStoreReview`
  passed where `PublicProductReview` was required). Regression test added.
- **Rate limits were global in production**: uvicorn only trusted forwarded headers
  from 127.0.0.1, so every request looked like the Docker gateway — 4 bad logins from
  anyone locked out everyone, and guest checkout was capped at 5/min platform-wide.
  `Dockerfile.prod` now runs with `--proxy-headers --forwarded-allow-ips *` (API is
  bound to 127.0.0.1) and nginx overwrites `X-Forwarded-For` so clients can't spoof it.
- **No backend logs in production after startup**: running Alembic at startup reloaded
  `alembic.ini` logging and disabled the app's loggers (no request lines, no tracebacks).
- **Checkout page was ~10,000px wide** (RTL + honeypot at `left: -10000px`).
- **Order totals didn't add up on screen**: seller/admin/customer order views omitted
  shipping and discount (API returned `shipping_amount: 0`).
- Form labels weren't linked to inputs without an explicit `id` (screen readers, tap-to-focus).
- Raw codes shown in UI (`CARD_TO_CARD`, `NOT_RECEIVED`, `NON_DELIVERY`) → Persian labels.
- Missing store/product URLs returned HTTP 200 (soft 404) → real 404.
- Product structured data declared toman prices as IRR (10× too low in search results).
- Production Docker images ran as root; CI's prod-compose check was missing required env.
- Demo seed crashed when the image host is unreachable → writes placeholder images.

## Running the E2E suite

Needs the stack running and seeded (`scripts.seed` then `scripts.seed_rich`):

```bash
cd e2e && npm install
E2E_BASE_URL=http://localhost:3000 E2E_API_URL=http://localhost:9000 E2E_CHANNEL=chrome npx playwright test
```

Run it against staging before every production deploy. Against `next dev` the first
run is slow (routes compile on demand); against the production build it takes ~15s.

## Still on you before inviting sellers

1. **Merge `launch-prep`** into `main` (it also carries the work recovered from the stash).
2. **Server**: domain + TLS, nginx from `deploy/nginx.conf.example` (now with HSTS).
3. **Production `.env`**: strong `JWT_SECRET_KEY` (≥32 chars) and `POSTGRES_PASSWORD`,
   real `RESEND_API_KEY` with a verified sending domain, `FRONTEND_BASE_URL` /
   `CORS_ORIGINS` / `NEXT_PUBLIC_*` on the real domain.
4. **Admin account**: create with `scripts/ensure_admin.py`; never run the demo seeds in
   production (`ALLOW_DEMO_SEED` stays unset).
5. **`/admin/settings`**: fill the subscription card number / owner / bank — they are empty,
   and sellers can't pay for plans until they're set.
6. **Backups**: `db-backup` service covers DB + `uploads/` + `private_uploads/`; do one
   test restore.
7. **Monitoring**: `SENTRY_DSN`, plus an uptime monitor on `/` and `/api/v1/health`.
8. **Legal text**: final review of `/terms`, `/privacy`, `/complaints`.
9. **Real devices**: one full purchase on Android Chrome and iOS Safari.
10. **Email**: register a seller on staging and confirm the verification email arrives
    (not testable locally without sending real mail).

## Known, deliberately not changed

- `nisha_flutter/` was deleted in the stashed working tree; it was kept as-is in git.
  Decide separately whether the mobile app is still part of the plan.
- Lint warnings (unused vars, hook deps) — cosmetic.
- Existing deployments: if production volumes were created by the old root image,
  `chown -R 999:999` the `backend_uploads` / `backend_private_uploads` volumes once.
