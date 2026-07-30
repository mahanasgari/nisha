import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/theme/nisha_tokens.dart';
import '../../../shared/extensions/build_context_x.dart';
import '../../../shared/widgets/nisha_ui.dart';
import '../data/ws_ticket_client.dart';

final sellerConversationsProvider = FutureProvider((ref) {
  return ref.watch(messagingRepositoryProvider).listSellerConversations();
});

final customerConversationsProvider = FutureProvider((ref) {
  return ref.watch(messagingRepositoryProvider).listCustomerConversations();
});

class SellerConversationsPage extends ConsumerWidget {
  const SellerConversationsPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(sellerConversationsProvider);
    return async.when(
      loading: () => const NishaAsyncStateView(
        kind: AsyncViewKind.loading,
        title: '',
      ),
      error: (e, _) => NishaAsyncStateView(
        kind: AsyncViewKind.error,
        title: context.l10n.conversations,
        subtitle: '$e',
        actionLabel: context.l10n.retry,
        onAction: () => ref.invalidate(sellerConversationsProvider),
      ),
      data: (items) {
        if (items.isEmpty) {
          return NishaAsyncStateView(
            kind: AsyncViewKind.empty,
            title: context.l10n.conversations,
          );
        }
        return ListView.separated(
          padding: const EdgeInsets.all(NishaSpace.lg),
          itemCount: items.length,
          separatorBuilder: (_, _) => const SizedBox(height: NishaSpace.sm),
          itemBuilder: (context, index) {
            final item = items[index];
            return NishaSurfaceCard(
              child: ListTile(
                contentPadding: EdgeInsets.zero,
                title: Text(
                  item.customerName.isNotEmpty
                      ? item.customerName
                      : item.storeName,
                ),
                subtitle: Text(item.lastMessageBody ?? item.invoiceCode ?? ''),
              ),
            );
          },
        );
      },
    );
  }
}

class CustomerConversationsPage extends ConsumerWidget {
  const CustomerConversationsPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(customerConversationsProvider);
    return async.when(
      loading: () => const NishaAsyncStateView(
        kind: AsyncViewKind.loading,
        title: '',
      ),
      error: (e, _) => NishaAsyncStateView(
        kind: AsyncViewKind.error,
        title: context.l10n.conversations,
        subtitle: '$e',
        actionLabel: context.l10n.retry,
        onAction: () => ref.invalidate(customerConversationsProvider),
      ),
      data: (items) {
        if (items.isEmpty) {
          return NishaAsyncStateView(
            kind: AsyncViewKind.empty,
            title: context.l10n.conversations,
          );
        }
        return ListView.separated(
          padding: const EdgeInsets.all(NishaSpace.lg),
          itemCount: items.length,
          separatorBuilder: (_, _) => const SizedBox(height: NishaSpace.sm),
          itemBuilder: (context, index) {
            final item = items[index];
            return NishaSurfaceCard(
              child: ListTile(
                contentPadding: EdgeInsets.zero,
                title: Text(
                  item.customerName.isNotEmpty
                      ? item.customerName
                      : item.storeName,
                ),
                subtitle: Text(item.lastMessageBody ?? item.invoiceCode ?? ''),
              ),
            );
          },
        );
      },
    );
  }
}
