import 'package:flutter/widgets.dart';

/// Centralized motion tokens. Do not scatter ad-hoc durations in feature code.
class NishaMotion {
  NishaMotion._();

  static const Duration press = Duration(milliseconds: 110);
  static const Duration control = Duration(milliseconds: 150);
  static const Duration listChange = Duration(milliseconds: 210);
  static const Duration navigation = Duration(milliseconds: 260);
  static const Duration bottomSheet = Duration(milliseconds: 280);
  static const Duration complex = Duration(milliseconds: 340);
  static const Duration shimmer = Duration(milliseconds: 1200);

  static const Curve standard = Curves.easeOutCubic;
  static const Curve emphasized = Curves.easeOutBack;
  static const Curve decelerate = Curves.decelerate;

  static bool reduceMotion(BuildContext context) {
    return MediaQuery.disableAnimationsOf(context) ||
        MediaQuery.maybeOf(context)?.disableAnimations == true;
  }

  static Duration resolve(BuildContext context, Duration preferred) {
    return reduceMotion(context) ? Duration.zero : preferred;
  }

  static Widget maybeAnimate({
    required BuildContext context,
    required Widget child,
    required Widget Function(Widget child) animated,
  }) {
    if (reduceMotion(context)) {
      return child;
    }
    return animated(child);
  }
}
