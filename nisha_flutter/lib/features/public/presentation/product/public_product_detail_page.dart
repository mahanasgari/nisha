import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/api/json_map.dart';
import '../../../../core/config/app_config.dart';
import '../../../../core/theme/nisha_tokens.dart';
import '../../../../shared/extensions/build_context_x.dart';
import '../../../../shared/widgets/nisha_ui.dart';
import '../../../../shared/widgets/public_shell.dart';
import '../../models/public_models.dart';
import '../../providers/public_providers.dart';

class PublicProductDetailPage extends ConsumerWidget {
  const PublicProductDetailPage({
    super.key,
    required this.slug,
    required this.productId,
  });

  final String slug;
  final int productId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(
      publicProductProvider((slug: slug, productId: productId)),
    );

    return PublicShell(
      child: async.when(
        loading: () => const NishaAsyncStateView(
          kind: AsyncViewKind.loading,
          title: '',
        ),
        error: (error, _) => NishaAsyncStateView(
          kind: AsyncViewKind.error,
          title: context.l10n.products,
          subtitle: '$error',
          actionLabel: context.l10n.retry,
          onAction: () => ref.invalidate(
            publicProductProvider((slug: slug, productId: productId)),
          ),
        ),
        data: (detail) {
          final product = detail.product;
          final image = AppConfig.resolveUrl(product.primaryImageUrl);
          return ListView(
            padding: const EdgeInsets.all(NishaSpace.lg),
            children: [
              if (image.isNotEmpty)
                ClipRRect(
                  borderRadius: BorderRadius.circular(NishaRadii.xl),
                  child: AspectRatio(
                    aspectRatio: 1.2,
                    child: CachedNetworkImage(
                      imageUrl: image,
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
              const SizedBox(height: NishaSpace.md),
              Text(
                product.title,
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.w800,
                    ),
              ),
              const SizedBox(height: NishaSpace.xs),
              Text(
                product.price,
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w700,
                      color: Theme.of(context).colorScheme.primary,
                    ),
              ),
              if (product.description != null) ...[
                const SizedBox(height: NishaSpace.sm),
                Text(product.description!),
              ],
              const SizedBox(height: NishaSpace.xl),
              FilledButton.icon(
                onPressed: () {
                  ref.read(cartProvider.notifier).bindStore(
                        slug: detail.store.slug,
                        name: detail.store.name,
                        guestCheckoutEnabled:
                            detail.store.guestCheckoutEnabled,
                        paymentMethods: const [],
                      );
                  ref.read(cartProvider.notifier).addItem(
                        CartLineItem(
                          productId: product.id,
                          title: product.title,
                          unitPrice: product.price,
                          quantity: 1,
                          imageUrl: product.primaryImageUrl,
                          variantId: product.variants.isEmpty
                              ? null
                              : asInt(product.variants.first['id']),
                        ),
                      );
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text(context.l10n.products)),
                  );
                  context.push('/store/$slug/checkout');
                },
                icon: const Icon(Icons.add_shopping_cart_rounded),
                label: Text(context.l10n.browseCatalog),
              ),
            ],
          );
        },
      ),
    );
  }
}
