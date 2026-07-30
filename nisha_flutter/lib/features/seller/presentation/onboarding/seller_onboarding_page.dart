import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/api/api_exception.dart';
import '../../../../core/api/json_map.dart';
import '../../../../core/theme/nisha_tokens.dart';
import '../../../../shared/extensions/build_context_x.dart';
import '../../../../shared/widgets/nisha_ui.dart';
import '../../data/seller_repository.dart';

final sellerOnboardingProvider = FutureProvider((ref) {
  return ref.watch(sellerRepositoryProvider).getOnboarding();
});

class SellerOnboardingPage extends ConsumerWidget {
  const SellerOnboardingPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(sellerOnboardingProvider);
    return Scaffold(
      appBar: AppBar(title: Text(context.l10n.sellerSpace)),
      body: async.when(
        loading: () => const NishaAsyncStateView(
          kind: AsyncViewKind.loading,
          title: '',
        ),
        error: (e, _) => NishaAsyncStateView(
          kind: AsyncViewKind.error,
          title: context.l10n.sellerSpace,
          subtitle: '$e',
          actionLabel: context.l10n.retry,
          onAction: () => ref.invalidate(sellerOnboardingProvider),
        ),
        data: (data) {
          final drafts = asJsonMap(data.raw['state']);
          final nested = asJsonMap(drafts['drafts']);
          return ListView(
            padding: const EdgeInsets.all(NishaSpace.lg),
            children: [
              NishaSurfaceCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      asStringOr(data.raw['status'] ?? drafts['status']),
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    Text(
                      'Step: ${asStringOr(data.raw['current_step'] ?? drafts['current_step'])}',
                    ),
                    const SizedBox(height: NishaSpace.sm),
                    Text('payment_details present: ${nested.containsKey('payment_details')}'),
                  ],
                ),
              ),
              const SizedBox(height: NishaSpace.md),
              FilledButton(
                onPressed: () async {
                  try {
                    await ref.read(sellerRepositoryProvider).updateOnboarding({
                      'current_step': 'payment_details',
                    });
                    ref.invalidate(sellerOnboardingProvider);
                  } on ApiException catch (error) {
                    if (context.mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text(error.message)),
                      );
                    }
                  }
                },
                child: const Text('Continue onboarding'),
              ),
            ],
          );
        },
      ),
    );
  }
}
