import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/api/api_exception.dart';
import '../../../../core/config/app_config.dart';
import '../../../../core/theme/nisha_tokens.dart';
import '../../../../shared/extensions/build_context_x.dart';
import '../../../../shared/widgets/nisha_ui.dart';
import '../../../../shared/widgets/public_shell.dart';
import '../../providers/public_providers.dart';

class PublicStorePage extends ConsumerStatefulWidget {
  const PublicStorePage({super.key, required this.slug});

  final String slug;

  @override
  ConsumerState<PublicStorePage> createState() => _PublicStorePageState();
}

class _PublicStorePageState extends ConsumerState<PublicStorePage> {
  final _search = TextEditingController();
  String _query = '';

  @override
  void dispose() {
    _search.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final storeAsync = ref.watch(publicStoreProvider(widget.slug));
    final theme = Theme.of(context);

    return PublicShell(
      child: storeAsync.when(
        loading: () => const NishaAsyncStateView(
          kind: AsyncViewKind.loading,
          title: '',
        ),
        error: (error, _) => NishaAsyncStateView(
          kind: error is ApiException && error.message.contains('Network')
              ? AsyncViewKind.offline
              : AsyncViewKind.error,
          title: context.l10n.store,
          subtitle: '$error',
          actionLabel: context.l10n.retry,
          onAction: () => ref.invalidate(publicStoreProvider(widget.slug)),
        ),
        data: (page) {
          final store = page.store;
          WidgetsBinding.instance.addPostFrameCallback((_) {
            ref.read(cartProvider.notifier).bindStore(
                  slug: store.slug,
                  name: store.name,
                  guestCheckoutEnabled: store.guestCheckoutEnabled,
                  paymentMethods: page.paymentMethods,
                );
          });

          final products = _query.isEmpty
              ? page.products
              : page.products
                  .where(
                    (p) =>
                        p.title.toLowerCase().contains(_query.toLowerCase()),
                  )
                  .toList();

          return RefreshIndicator(
            onRefresh: () async {
              ref.invalidate(publicStoreProvider(widget.slug));
              await ref.read(publicStoreProvider(widget.slug).future);
            },
            child: ListView(
              padding: const EdgeInsets.all(NishaSpace.lg),
              children: [
                Text(
                  store.name,
                  style: theme.textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.w800,
                  ),
                ),
                if (store.description != null) ...[
                  const SizedBox(height: NishaSpace.xs),
                  Text(store.description!),
                ],
                const SizedBox(height: NishaSpace.md),
                TextField(
                  controller: _search,
                  decoration: InputDecoration(
                    hintText: context.l10n.browseCatalog,
                    prefixIcon: const Icon(Icons.search_rounded),
                  ),
                  onChanged: (value) =>
                      setState(() => _query = value.trim()),
                ),
                const SizedBox(height: NishaSpace.md),
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        context.l10n.products,
                        style: theme.textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                    TextButton.icon(
                      onPressed: () =>
                          context.push('/store/${widget.slug}/checkout'),
                      icon: const Icon(Icons.shopping_cart_outlined),
                      label: Text(context.l10n.comingSoon),
                    ),
                  ],
                ),
                if (products.isEmpty)
                  NishaAsyncStateView(
                    kind: AsyncViewKind.empty,
                    title: context.l10n.products,
                    subtitle: context.l10n.comingSoon,
                  )
                else
                  ...products.map((product) {
                    final image = AppConfig.resolveUrl(product.primaryImageUrl);
                    return Padding(
                      padding: const EdgeInsets.only(bottom: NishaSpace.sm),
                      child: NishaSurfaceCard(
                        onTap: () => context.push(
                          '/store/${widget.slug}/products/${product.id}',
                        ),
                        child: Row(
                          children: [
                            ClipRRect(
                              borderRadius:
                                  BorderRadius.circular(NishaRadii.md),
                              child: SizedBox(
                                width: 64,
                                height: 64,
                                child: image.isEmpty
                                    ? const ColoredBox(
                                        color: Colors.black12,
                                        child: Icon(Icons.image_outlined),
                                      )
                                    : CachedNetworkImage(
                                        imageUrl: image,
                                        fit: BoxFit.cover,
                                      ),
                              ),
                            ),
                            const SizedBox(width: NishaSpace.sm),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    product.title,
                                    style: theme.textTheme.titleSmall
                                        ?.copyWith(fontWeight: FontWeight.w700),
                                  ),
                                  Text('${product.price} · ${product.stockQuantity}'),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  }),
              ],
            ),
          );
        },
      ),
    );
  }
}
