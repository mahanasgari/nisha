# Flutter design system (Nisha mobile)

ClickUp is the quality benchmark for hierarchy, density, sheets, lists, motion, and feedback. Nisha keeps its logo, purple-black palette, Persian identity, and workflows—without copying ClickUp assets or exact layouts.

## Tokens

See `lib/core/theme/nisha_tokens.dart` and `lib/core/animations/nisha_motion.dart`.

| Category | Values |
|----------|--------|
| Space | 4, 8, 12, 16, 20, 24, 32, 40 |
| Radii | 8, 12, 16, 20, 24 |
| Press | 80–140 ms (token 110) |
| Control | 120–180 ms (token 150) |
| List | 180–240 ms (token 210) |
| Navigation | 220–300 ms (token 260) |
| Sheet | 220–320 ms (token 280) |
| Complex max | 350 ms (token 340) |

## Components

- `NishaScalePress` — press feedback
- `NishaShimmer` / `NishaSkeletonBox` — loading
- `NishaAsyncStateView` — empty / error / offline / loading family
- `NishaSurfaceCard` — list/dashboard surfaces
- `NishaFilterChipBar` — filters
- `showNishaBottomSheet` — sheets
- `MoneyTextField` — comma-formatted money input

## Themes

`AppTheme.light()` / `AppTheme.dark()` with Vazirmatn. Prefer surface containers and hairline borders over heavy shadows/blur.

## Do / Don’t

- Do use centralized motion tokens.
- Do preserve scroll and tab state.
- Don’t scatter `Duration(milliseconds: …)` in features.
- Don’t ship placeholder-quality primary screens.
- Don’t put mock catalogs in production widgets.

Full interaction principles and reference-screen notes: `docs/flutter-ui-direction.md`.
