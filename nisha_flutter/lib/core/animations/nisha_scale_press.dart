import 'package:flutter/material.dart';

import '../animations/nisha_motion.dart';

class NishaScalePress extends StatefulWidget {
  const NishaScalePress({
    super.key,
    required this.child,
    this.onTap,
    this.enabled = true,
    this.minScale = 0.97,
  });

  final Widget child;
  final VoidCallback? onTap;
  final bool enabled;
  final double minScale;

  @override
  State<NishaScalePress> createState() => _NishaScalePressState();
}

class _NishaScalePressState extends State<NishaScalePress> {
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    final duration = NishaMotion.resolve(context, NishaMotion.press);
    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTapDown: widget.enabled && widget.onTap != null
          ? (_) => setState(() => _pressed = true)
          : null,
      onTapCancel: () => setState(() => _pressed = false),
      onTapUp: (_) => setState(() => _pressed = false),
      onTap: widget.enabled ? widget.onTap : null,
      child: AnimatedScale(
        scale: _pressed ? widget.minScale : 1,
        duration: duration,
        curve: NishaMotion.standard,
        child: widget.child,
      ),
    );
  }
}
