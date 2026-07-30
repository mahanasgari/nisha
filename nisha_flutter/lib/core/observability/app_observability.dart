import 'package:flutter/foundation.dart';

/// Production-safe observability façade.
/// Never log tokens, passwords, proof URLs, addresses, or sensitive bodies.
class AppObservability {
  AppObservability._();

  static void recordError(
    Object error,
    StackTrace? stack, {
    String? context,
  }) {
    final safe = _sanitize('$error');
    debugPrint('[nisha][$context] $safe');
    if (stack != null && kDebugMode) {
      debugPrint(stack.toString());
    }
    // Hook existing monitoring provider here when available (Sentry/etc.).
  }

  static void recordEvent(String name, {Map<String, Object?>? data}) {
    final safeData = data?.map(
      (key, value) => MapEntry(key, _sanitize('$value')),
    );
    debugPrint('[nisha][event] $name ${safeData ?? ''}');
  }

  static String _sanitize(String input) {
    var value = input;
    final patterns = <RegExp>[
      RegExp(r'Bearer\s+[A-Za-z0-9\-._~+/]+=*', caseSensitive: false),
      RegExp(r'(access_token|refresh_token|password)\s*[:=]\s*[^,\s}]+',
          caseSensitive: false),
      RegExp(r'/media/private/[^\s"?]+'),
      RegExp(r'token=[^\s&"]+', caseSensitive: false),
    ];
    for (final pattern in patterns) {
      value = value.replaceAll(pattern, '[redacted]');
    }
    return value;
  }
}
