import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/api/api_exception.dart';
import '../../../../core/theme/nisha_tokens.dart';
import '../../../../shared/extensions/build_context_x.dart';
import '../../../../shared/widgets/nisha_ui.dart';
import '../../data/seller_repository.dart';

final sellerOrdersProvider = FutureProvider((ref) {
  return ref.watch(sellerRepositoryProvider).listOrders();
});

class SellerOrdersPage extends ConsumerWidget {
  const SellerOrdersPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(sellerOrdersProvider);
    return async.when(
      loading: () => const NishaAsyncStateView(
        kind: AsyncViewKind.loading,
        title: '',
      ),
      error: (error, _) => NishaAsyncStateView(
        kind: AsyncViewKind.error,
        title: context.l10n.orders,
        subtitle: '$error',
        actionLabel: context.l10n.retry,
        onAction: () => ref.invalidate(sellerOrdersProvider),
      ),
      data: (page) {
        if (page.items.isEmpty) {
          return NishaAsyncStateView(
            kind: AsyncViewKind.empty,
            title: context.l10n.orders,
            subtitle: context.l10n.comingSoon,
          );
        }
        return RefreshIndicator(
          onRefresh: () async {
            ref.invalidate(sellerOrdersProvider);
            await ref.read(sellerOrdersProvider.future);
          },
          child: ListView.separated(
            padding: const EdgeInsets.all(NishaSpace.lg),
            itemCount: page.items.length,
            separatorBuilder: (_, _) => const SizedBox(height: NishaSpace.sm),
            itemBuilder: (context, index) {
              final order = page.items[index];
              return NishaSurfaceCard(
                onTap: () => context.push('/seller/orders/${order.id}'),
                child: ListTile(
                  contentPadding: EdgeInsets.zero,
                  title: Text(order.invoiceCode),
                  subtitle: Text('${order.buyerName} · ${order.status}'),
                  trailing: Text(order.totalAmount),
                ),
              );
            },
          ),
        );
      },
    );
  }
}

final sellerOrderDetailProvider =
    FutureProvider.family((ref, int id) {
  return ref.watch(sellerRepositoryProvider).getOrder(id);
});

class SellerOrderDetailPage extends ConsumerWidget {
  const SellerOrderDetailPage({super.key, required this.orderId});

  final int orderId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(sellerOrderDetailProvider(orderId));
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
                    Text('${order.buyerName} · ${order.buyerPhone}'),
                    Text(order.buyerAddress),
                    Text(order.totalAmount),
                  ],
                ),
              ),
              const SizedBox(height: NishaSpace.md),
              Wrap(
                spacing: NishaSpace.sm,
                children: [
                  FilledButton(
                    onPressed: () async {
                      try {
                        await ref
                            .read(sellerRepositoryProvider)
                            .confirmPayment(orderId);
                        ref.invalidate(sellerOrderDetailProvider(orderId));
                      } on ApiException catch (error) {
                        if (context.mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text(error.message)),
                          );
                        }
                      }
                    },
                    child: const Text('Confirm payment'),
                  ),
                  OutlinedButton(
                    onPressed: () async {
                      try {
                        await ref
                            .read(sellerRepositoryProvider)
                            .rejectPayment(orderId);
                        ref.invalidate(sellerOrderDetailProvider(orderId));
                      } on ApiException catch (error) {
                        if (context.mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text(error.message)),
                          );
                        }
                      }
                    },
                    child: const Text('Reject payment'),
                  ),
                ],
              ),
            ],
          );
        },
      ),
    );
  }
}
