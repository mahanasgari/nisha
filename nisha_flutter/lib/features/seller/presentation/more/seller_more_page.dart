import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/router/route_paths.dart';
import '../../../../core/session/session_controller.dart';
import '../../../../core/theme/nisha_tokens.dart';
import '../../../../shared/extensions/build_context_x.dart';
import '../../../../shared/widgets/appearance_controls.dart';
import '../../../../shared/widgets/nisha_ui.dart';
import '../../data/seller_repository.dart';

final sellerSubscriptionProvider = FutureProvider((ref) async {
  final repo = ref.watch(sellerRepositoryProvider);
  final plans = await repo.listPlans();
  final sub = await repo.getSubscription();
  return (plans: plans, subscription: sub);
});

class SellerMorePage extends ConsumerWidget {
  const SellerMorePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return ListView(
      padding: const EdgeInsets.all(NishaSpace.lg),
      children: [
        NishaSurfaceCard(
          onTap: () => context.push(RoutePaths.sellerStore),
          child: ListTile(
            contentPadding: EdgeInsets.zero,
            leading: const Icon(Icons.store_rounded),
            title: Text(context.l10n.store),
            trailing: const Icon(Icons.chevron_right),
          ),
        ),
        const SizedBox(height: NishaSpace.sm),
        NishaSurfaceCard(
          onTap: () => context.push(RoutePaths.sellerSubscription),
          child: const ListTile(
            contentPadding: EdgeInsets.zero,
            leading: Icon(Icons.workspace_premium_outlined),
            title: Text('Subscription'),
            trailing: Icon(Icons.chevron_right),
          ),
        ),
        const SizedBox(height: NishaSpace.sm),
        NishaSurfaceCard(
          onTap: () => context.push(RoutePaths.sellerOnboarding),
          child: ListTile(
            contentPadding: EdgeInsets.zero,
            leading: const Icon(Icons.rocket_launch_outlined),
            title: Text(context.l10n.sellerSpace),
            trailing: const Icon(Icons.chevron_right),
          ),
        ),
        const SizedBox(height: NishaSpace.sm),
        NishaSurfaceCard(
          onTap: () => context.push(RoutePaths.sellerAppearance),
          child: ListTile(
            contentPadding: EdgeInsets.zero,
            leading: const Icon(Icons.palette_outlined),
            title: Text(context.l10n.appearance),
            trailing: const Icon(Icons.chevron_right),
          ),
        ),
        const SizedBox(height: NishaSpace.lg),
        OutlinedButton.icon(
          onPressed: () async {
            await ref.read(sessionControllerProvider.notifier).signOut();
            if (context.mounted) context.go(RoutePaths.home);
          },
          icon: const Icon(Icons.logout),
          label: Text(context.l10n.logout),
        ),
      ],
    );
  }
}

class SellerSubscriptionPage extends ConsumerWidget {
  const SellerSubscriptionPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(sellerSubscriptionProvider);
    return Scaffold(
      appBar: AppBar(title: const Text('Subscription')),
      body: async.when(
        loading: () => const NishaAsyncStateView(
          kind: AsyncViewKind.loading,
          title: '',
        ),
        error: (e, _) => NishaAsyncStateView(
          kind: AsyncViewKind.error,
          title: 'Subscription',
          subtitle: '$e',
        ),
        data: (data) {
          return ListView(
            padding: const EdgeInsets.all(NishaSpace.lg),
            children: [
              NishaSurfaceCard(
                child: Text(
                  'Current: ${data.subscription.raw}',
                  maxLines: 6,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(height: NishaSpace.md),
              ...data.plans.map(
                (plan) => Padding(
                  padding: const EdgeInsets.only(bottom: NishaSpace.sm),
                  child: NishaSurfaceCard(
                    child: ListTile(
                      contentPadding: EdgeInsets.zero,
                      title: Text(plan.nameFa.isEmpty ? plan.code : plan.nameFa),
                      subtitle: Text('${plan.monthlyPrice}'),
                    ),
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

class SellerStoreSettingsPage extends StatelessWidget {
  const SellerStoreSettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(context.l10n.store)),
      body: const Padding(
        padding: EdgeInsets.all(NishaSpace.lg),
        child: AppearanceSection(),
      ),
    );
  }
}
