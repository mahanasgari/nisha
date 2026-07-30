# Nisha Flutter UI direction

## Design principles

1. **One continuous product** — seller, customer, and public feel related but role-appropriate.
2. **Clarity over decoration** — hierarchy via type, spacing, and motion—not purple glow stacks.
3. **Persian-first RTL** with first-class English LTR.
4. **ClickUp-level refinement** for density, sheets, lists, dashboards, filters, and feedback—without cloning ClickUp.
5. **Backend-honest UI** — no screen is done merely because an API call succeeds.

## ClickUp-inspired interaction principles

- Immediate press feedback (<140 ms)
- Soft list insert/remove
- Predictable navigation transitions
- Skeleton → content without layout jump
- Sheets for filters and secondary actions
- Empty/error/offline as first-class states
- Status changes animate, not flash

## Tokens

Documented in `docs/flutter-design-system.md` and implemented under `lib/core/theme` + `lib/core/animations`.

## Component hierarchy

1. Shells (public / seller / customer)
2. Page scaffolds (app bar + body density)
3. Surfaces (`NishaSurfaceCard`)
4. Lists + chips + forms
5. Sheets / dialogs
6. Feedback (snackbars, validation, mutation)

## Navigation patterns

- Seller: خانه / سفارش‌ها / محصولات / پیام‌ها / بیشتر
- Customer: خانه / سفارش‌ها / پیام‌ها / حساب
- Preserve tab scroll positions where `StatefulShellRoute` / keyed scrollables allow

## Motion patterns

Use `NishaMotion.*` only. Respect reduced motion.

## Correct vs incorrect

| Correct | Incorrect |
|---------|-----------|
| Shared tokens for spacing/motion | One-off paddings and durations |
| Redesign weak placeholders | Shipping API-wired gray boxes |
| Role-differentiated chrome | Copying web admin onto mobile |
| Staging-pending markers in docs | Fake store data in release builds |

## Reference screens (Phase 2.5)

Implement and visually verify:

1. Public home  
2. Public store / product listing  
3. Seller dashboard  
4. Seller orders list  
5. Product create/edit  
6. Customer order detail  
7. One bottom sheet pattern  
8. Loading / empty / error family  

### Visual matrix

Persian RTL · English LTR · light · dark · small phone · ordinary phone · large text · loading · empty · error · offline · disabled.

## Status

Phase 2.5 reference screens shipped as real feature UIs:

1. **Public home** — branded search + featured stores/products, skeleton/error/empty  
2. **Public store listing** — store header, search, product cards  
3. **Seller dashboard** — metrics + recent orders + onboarding CTA  
4. **Seller orders list** — dense list cards  
5. **Product create/edit** — form with `MoneyTextField`  
6. **Customer order detail** — status + totals surface  
7. **Bottom sheet** — checkout success sheet via `showNishaBottomSheet`  
8. **State family** — `NishaAsyncStateView` loading/empty/error/offline  

Visual matrix (RTL/LTR, light/dark, scaling, disabled) should be re-checked on device before release; widget coverage exists for empty-state + home smoke.
