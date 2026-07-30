# Flutter testing & CI

## Local commands

```bash
cd nisha_flutter
flutter pub get
dart format .
flutter analyze
flutter test
# Optional goldens:
flutter test --update-goldens
# Android build validation:
flutter build apk --debug
```

When Riverpod/json_serializable codegen is enabled:

```bash
dart run build_runner build --delete-conflicting-outputs
```

CI fails if generated outputs drift (`git diff --exit-code` after build_runner).

## CI workflow

[`.github/workflows/flutter.yml`](../.github/workflows/flutter.yml) runs on Flutter-related PRs/pushes:

1. `flutter pub get`
2. `dart format --set-exit-if-changed .`
3. `flutter analyze --fatal-infos`
4. `flutter test` (unit + widget)
5. Generated-code consistency (when annotations exist)
6. `flutter build apk --debug`

Flutter SDK is pinned to **3.44.2** (see `nisha_flutter/.fvmrc` and `docs/flutter-toolchain.md`).

## Test strategy

| Layer | Focus |
|-------|--------|
| Unit | Money formatting, auth refresh single-flight, parsers |
| Widget | Async state views, shells, reference screens smoke |
| Golden | Stable shared components only; avoid brittle full-page copy goldens |
| Integration / staging | Marked in API coverage; run manually when staging is available |

## Staging fallback

If staging credentials are unavailable, keep fixtures inside tests only. Production screens must not embed mock catalogs. Mark coverage rows `implemented, staging verification pending`.
