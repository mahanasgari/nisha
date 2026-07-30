import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/theme/nisha_tokens.dart';
import '../../../../shared/extensions/build_context_x.dart';
import '../../../../shared/widgets/nisha_ui.dart';
import '../data/customer_repository.dart';

final customerDashboardProvider = FutureProvider((ref) {
  return ref.watch(customerRepositoryProvider).getDashboard();
});

final customerOrdersProvider = FutureProvider((ref) {
  return ref.watch(customerRepositoryProvider).listOrders();
});

final customerOrderDetailProvider =
    FutureProvider.family((ref, int id) {
  return ref.watch(customerRepositoryProvider).getOrder(id);
});

final customerProfileProvider = FutureProvider((ref) {
  return ref.watch(customerRepositoryProvider).getProfile();
});

class CustomerDashboardPage extends ConsumerWidget {
  const CustomerDashboardPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(customerDashboardProvider);
    return async.when(
      loading: () => const NishaAsyncStateView(
        kind: AsyncViewKind.loading,
        title: '',
      ),
      error: (e, _) => NishaAsyncStateView(
        kind: AsyncViewKind.error,
        title: context.l10n.dashboard,
        subtitle: '$e',
        actionLabel: context.l10n.retry,
        onAction: () => ref.invalidate(customerDashboardProvider),
      ),
      data: (dash) {
        return ListView(
          padding: const EdgeInsets.all(NishaSpace.lg),
          children: [
            Text(
              context.l10n.dashboard,
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.w800,
                  ),
            ),
            const SizedBox(height: NishaSpace.md),
            NishaSurfaceCard(
              child: Text('${dash.raw}', maxLines: 12, overflow: TextOverflow.ellipsis),
            ),
          ],
        );
      },
    );
  }
}

class CustomerOrdersPage extends ConsumerWidget {
  const CustomerOrdersPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(customerOrdersProvider);
    return async.when(
      loading: () => const NishaAsyncStateView(
        kind: AsyncViewKind.loading,
        title: '',
      ),
      error: (e, _) => NishaAsyncStateView(
        kind: AsyncViewKind.error,
        title: context.l10n.orders,
        subtitle: '$e',
        actionLabel: context.l10n.retry,
        onAction: () => ref.invalidate(customerOrdersProvider),
      ),
      data: (orders) {
        if (orders.isEmpty) {
          return NishaAsyncStateView(
            kind: AsyncViewKind.empty,
            title: context.l10n.orders,
          );
        }
        return ListView.separated(
          padding: const EdgeInsets.all(NishaSpace.lg),
          itemCount: orders.length,
          separatorBuilder: (_, _) => const SizedBox(height: NishaSpace.sm),
          itemBuilder: (context, index) {
            final order = orders[index];
            return NishaSurfaceCard(
              onTap: () => context.push('/customer/orders/${order.id}'),
              child: ListTile(
                contentPadding: EdgeInsets.zero,
                title: Text(order.invoiceCode),
                subtitle: Text(order.status),
                trailing: Text(order.totalAmount),
              ),
            );
          },
        );
      },
    );
  }
}

class CustomerOrderDetailPage extends ConsumerWidget {
  const CustomerOrderDetailPage({super.key, required this.orderId});

  final int orderId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(customerOrderDetailProvider(orderId));
    return Scaffold(
      appBar: AppBar(title: Text(context.l10n.orders)),
      body: async.when(
        loading: () => const NishaAsyncStateView(
          kind: AsyncViewKind.loading,
          title: '',
        ),
        error: (e, _) => NishaAsyncStateView(
          kind: AsyncViewKind.error,
          title: context.l10n.orders,
          subtitle: '$e',
        ),
        data: (order) {
          return ListView(
            padding: const EdgeInsets.all(NishaSpace.lg),
            children: [
              NishaSurfaceCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      order.invoiceCode,
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                            fontWeight: FontWeight.w800,
                          ),
                    ),
                    Text(order.status),
                    Text(order.totalAmount),
                    Text(order.createdAt),
                  ],
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

class CustomerProfilePage extends ConsumerWidget {
  const CustomerProfilePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(customerProfileProvider);
    return async.when(
      loading: () => const NishaAsyncStateView(
        kind: AsyncViewKind.loading,
        title: '',
      ),
      error: (e, _) => NishaAsyncStateView(
        kind: AsyncViewKind.error,
        title: context.l10n.profile,
        subtitle: '$e',
        actionLabel: context.l10n.retry,
        onAction: () => ref.invalidate(customerProfileProvider),
      ),
      data: (profile) {
        return ListView(
          padding: const EdgeInsets.all(NishaSpace.lg),
          children: [
            NishaSurfaceCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    profile.fullName,
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.w800,
                        ),
                  ),
                  if (profile.email != null) Text(profile.email!),
                  if (profile.phone != null) Text(profile.phone!),
                ],
              ),
            ),
          ],
        );
      },
    );
  }
}

class CustomerAccountPage extends ConsumerWidget {
  const CustomerAccountPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return ListView(
      padding: const EdgeInsets.all(NishaSpace.lg),
      children: [
        NishaSurfaceCard(
          onTap: () => context.push('/customer/profile'),
          child: ListTile(
            contentPadding: EdgeInsets.zero,
            leading: const Icon(Icons.person_outline),
            title: Text(context.l10n.profile),
            trailing: const Icon(Icons.chevron_right),
          ),
        ),
        const SizedBox(height: NishaSpace.sm),
        NishaSurfaceCard(
          onTap: () => context.push('/customer/appearance'),
          child: ListTile(
            contentPadding: EdgeInsets.zero,
            leading: const Icon(Icons.palette_outlined),
            title: Text(context.l10n.appearance),
            trailing: const Icon(Icons.chevron_right),
          ),
        ),
      ],
    );
  }
}
