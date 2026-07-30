import 'package:flutter/material.dart';

import '../../core/animations/nisha_scale_press.dart';
import '../../core/animations/nisha_shimmer.dart';
import '../../core/theme/nisha_tokens.dart';

enum AsyncViewKind { loading, empty, error, offline }

class NishaAsyncStateView extends StatelessWidget {
  const NishaAsyncStateView({
    super.key,
    required this.kind,
    required this.title,
    this.subtitle,
    this.actionLabel,
    this.onAction,
    this.icon,
  });

  final AsyncViewKind kind;
  final String title;
  final String? subtitle;
  final String? actionLabel;
  final VoidCallback? onAction;
  final IconData? icon;

  factory NishaAsyncStateView.loading({Key? key, String title = '…'}) {
    return NishaAsyncStateView(
      key: key,
      kind: AsyncViewKind.loading,
      title: title,
    );
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    if (kind == AsyncViewKind.loading) {
      return Padding(
        padding: const EdgeInsets.all(NishaSpace.xl),
        child: Column(
          children: [
            const NishaSkeletonBox(height: 18, width: 160),
            const SizedBox(height: NishaSpace.sm),
            const NishaSkeletonBox(height: 14, width: double.infinity),
            const SizedBox(height: NishaSpace.xs),
            const NishaSkeletonBox(height: 14, width: double.infinity),
            const SizedBox(height: NishaSpace.md),
            const NishaSkeletonBox(height: 96, width: double.infinity, borderRadius: NishaRadii.lg),
          ],
        ),
      );
    }

    final resolvedIcon = icon ??
        switch (kind) {
          AsyncViewKind.empty => Icons.inbox_rounded,
          AsyncViewKind.error => Icons.error_outline_rounded,
          AsyncViewKind.offline => Icons.wifi_off_rounded,
          AsyncViewKind.loading => Icons.hourglass_empty_rounded,
        };

    return Padding(
      padding: const EdgeInsets.all(NishaSpace.xl),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 420),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(resolvedIcon, size: 44, color: scheme.primary),
              const SizedBox(height: NishaSpace.md),
              Text(
                title,
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w700,
                    ),
              ),
              if (subtitle != null) ...[
                const SizedBox(height: NishaSpace.xs),
                Text(
                  subtitle!,
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: scheme.onSurfaceVariant,
                      ),
                ),
              ],
              if (actionLabel != null && onAction != null) ...[
                const SizedBox(height: NishaSpace.lg),
                FilledButton(
                  onPressed: onAction,
                  child: Text(actionLabel!),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

class NishaSurfaceCard extends StatelessWidget {
  const NishaSurfaceCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(NishaSpace.md),
    this.onTap,
  });

  final Widget child;
  final EdgeInsetsGeometry padding;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final card = AnimatedContainer(
      duration: const Duration(milliseconds: 150),
      padding: padding,
      decoration: BoxDecoration(
        color: scheme.surfaceContainerHighest.withValues(alpha: 0.72),
        borderRadius: BorderRadius.circular(NishaRadii.lg),
        border: Border.all(color: scheme.outlineVariant.withValues(alpha: 0.7)),
      ),
      child: child,
    );
    if (onTap == null) {
      return card;
    }
    return NishaScalePress(onTap: onTap, child: card);
  }
}

class NishaFilterChipBar extends StatelessWidget {
  const NishaFilterChipBar({
    super.key,
    required this.labels,
    required this.selectedIndex,
    required this.onSelected,
  });

  final List<String> labels;
  final int selectedIndex;
  final ValueChanged<int> onSelected;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: NishaSpace.md),
      child: Row(
        children: [
          for (var i = 0; i < labels.length; i++) ...[
            FilterChip(
              selected: i == selectedIndex,
              label: Text(labels[i]),
              onSelected: (_) => onSelected(i),
            ),
            if (i != labels.length - 1) const SizedBox(width: NishaSpace.xs),
          ],
        ],
      ),
    );
  }
}

Future<T?> showNishaBottomSheet<T>({
  required BuildContext context,
  required Widget child,
  bool isScrollControlled = true,
}) {
  return showModalBottomSheet<T>(
    context: context,
    isScrollControlled: isScrollControlled,
    useSafeArea: true,
    showDragHandle: true,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(NishaRadii.xxl)),
    ),
    builder: (context) => Padding(
      padding: EdgeInsets.only(
        left: NishaSpace.lg,
        right: NishaSpace.lg,
        bottom: MediaQuery.viewInsetsOf(context).bottom + NishaSpace.lg,
        top: NishaSpace.sm,
      ),
      child: child,
    ),
  );
}
