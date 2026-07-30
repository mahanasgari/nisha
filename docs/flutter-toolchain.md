# Flutter toolchain lock

Recorded at Phase 1 baseline on branch `feat/flutter-production-modernization`.

| Component | Version / policy |
|-----------|------------------|
| Flutter SDK | 3.44.2 stable (`c9a6c48423`) |
| Dart SDK | 3.12.2 (`pubspec` environment `^3.12.2`) |
| Android compile/target/min SDK | Flutter tooling defaults (`flutter.compileSdkVersion`, `flutter.targetSdkVersion`, `flutter.minSdkVersion`) |
| Java / Kotlin JVM | 17 |
| iOS | Project Runner defaults; raise floor only with documented need |
| CocoaPods | As required by Flutter iOS tooling on CI macOS runners |
| Dependency policy | No blind major upgrades; document each major addition below |

## Recommended local pin (FVM)

When FVM is available:

```bash
fvm use 3.44.2 --force
```

Commit `.fvmrc` with `{ "flutter": "3.44.2" }` in a later foundation commit if the team adopts FVM.

## Code generation (when enabled)

```bash
cd nisha_flutter
dart run build_runner build --delete-conflicting-outputs
```

CI must fail if generated Riverpod/serialization outputs drift.

## Major dependency additions log

| Package | Why | Phase |
|---------|-----|-------|
| *(none yet beyond baseline)* | — | Phase 1 |

Baseline already includes: `flutter_riverpod`, `go_router`, `http`, `flutter_secure_storage`, `shared_preferences`, `intl`.
