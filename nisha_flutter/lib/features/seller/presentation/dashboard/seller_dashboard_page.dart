import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/api/api_exception.dart';
import '../../../../core/api/json_map.dart';
import '../../../../core/router/route_paths.dart';
import '../../../../core/theme/nisha_tokens.dart';
import '../../../../shared/extensions/build_context_x.dart';
import '../../../../shared/widgets/nisha_ui.dart';
import '../../data/seller_repository.dart';

final sellerDashboardProvider = FutureProvider((ref) {
  return ref.watch(sellerRepositoryProvider).getDashboard();
});

class SellerDashboardPage extends ConsumerWidget {
  const SellerDashboardPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(sellerDashboardProvider);
    return async.when(
      loading: () => const NishaAsyncStateView(
        kind: AsyncViewKind.loading,
        title: '',
      ),
      error: (error, _) => NishaAsyncStateView(
        kind: error is ApiException && error.message.contains('Network')
            ? AsyncViewKind.offline
            : AsyncViewKind.error,
        title: context.l10n.dashboard,
        subtitle: '$error',
        actionLabel: context.l10n.retry,
        onAction: () => ref.invalidate(sellerDashboardProvider),
      ),
      data: (dash) {
        return RefreshIndicator(
          onRefresh: () async {
            ref.invalidate(sellerDashboardProvider);
            await ref.read(sellerDashboardProvider.future);
          },
          child: ListView(
            padding: const EdgeInsets.all(NishaSpace.lg),
            children: [
              Text(
                context.l10n.dashboard,
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.w800,
                    ),
              ),
              const SizedBox(height: NishaSpace.md),
              Wrap(
                spacing: NishaSpace.sm,
                runSpacing: NishaSpace.sm,
                children: [
                  _metric(context, context.l10n.orders, '${dash.totalOrders}'),
                  _metric(context, 'Pending', '${dash.pendingOrders}'),
                  _metric(context, 'Today', dash.todayRevenue),
                  _metric(context, 'Confirmed', dash.confirmedRevenue),
                ],
              ),
              if (dash.onboardingStatus.toUpperCase() != 'COMPLETED') ...[
                const SizedBox(height: NishaSpace.md),
                NishaSurfaceCard(
                  onTap: () => context.push(RoutePaths.sellerOnboarding),
                  child: ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: const Icon(Icons.rocket_launch_outlined),
                    title: Text(context.l10n.sellerSpace),
                    subtitle: Text(dash.onboardingStatus),
                    trailing: const Icon(Icons.chevron_right),
                  ),
                ),
              ],
              const SizedBox(height: NishaSpace.lg),
              Text(
                context.l10n.orders,
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w700,
                    ),
              ),
              const SizedBox(height: NishaSpace.sm),
              if (dash.recentOrders.isEmpty)
                NishaAsyncStateView(
                  kind: AsyncViewKind.empty,
                  title: context.l10n.orders,
                )
              else
                ...dash.recentOrders.map((order) {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: NishaSpace.sm),
                    child: NishaSurfaceCard(
                      onTap: () => context.push(
                        '/seller/orders/${asInt(order['id'])}',
                      ),
                      child: ListTile(
                        contentPadding: EdgeInsets.zero,
                        title: Text(asStringOr(order['invoice_code'])),
                        subtitle: Text(
                          '${asStringOr(order['buyer_name'])} · ${asStringOr(order['status'])}',
                        ),
                        trailing: Text(asStringOr(order['total_amount'])),
                      ),
                    ),
                  );
                }),
            ],
          ),
        );
      },
    );
  }

  Widget _metric(BuildContext context, String label, String value) {
    return SizedBox(
      width: 150,
      child: NishaSurfaceCard(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: Theme.of(context).textTheme.bodySmall),
            const SizedBox(height: 4),
            Text(
              value,
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w800,
                  ),
            ),
          ],
        ),
      ),
    );
  }
}
