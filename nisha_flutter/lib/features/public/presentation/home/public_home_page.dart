import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/api/api_exception.dart';
import '../../../../core/config/app_config.dart';
import '../../../../core/router/route_paths.dart';
import '../../../../core/theme/nisha_tokens.dart';
import '../../../../shared/extensions/build_context_x.dart';
import '../../../../shared/widgets/app_backdrop.dart';
import '../../../../shared/widgets/app_brand_mark.dart';
import '../../../../shared/widgets/nisha_ui.dart';
import '../../../../shared/widgets/public_shell.dart';
import '../../providers/public_providers.dart';

class PublicHomePage extends ConsumerStatefulWidget {
  const PublicHomePage({super.key});

  @override
  ConsumerState<PublicHomePage> createState() => _PublicHomePageState();
}

class _PublicHomePageState extends ConsumerState<PublicHomePage> {
  final _search = TextEditingController();
  String _query = '';

  @override
  void dispose() {
    _search.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final asyncHome = ref.watch(publicHomeProvider(_query));
    final theme = Theme.of(context);

    return PublicShell(
      child: AppBackdrop(
        topPadding: 12,
        child: RefreshIndicator(
          onRefresh: () async {
            ref.invalidate(publicHomeProvider(_query));
            await ref.read(publicHomeProvider(_query).future);
          },
          child: CustomScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            slivers: [
              SliverPadding(
                padding: const EdgeInsets.fromLTRB(
                  NishaSpace.lg,
                  NishaSpace.md,
                  NishaSpace.lg,
                  NishaSpace.xxl,
                ),
                sliver: SliverList.list(
                  children: [
                    Row(
                      children: [
                        const AppBrandMark(size: 44),
                        const SizedBox(width: NishaSpace.sm),
                        Expanded(
                          child: Text(
                            context.l10n.appTitle,
                            style: theme.textTheme.headlineSmall?.copyWith(
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                        ),
                        IconButton(
                          onPressed: () => context.go(RoutePaths.trackOrder),
                          icon: const Icon(Icons.local_shipping_outlined),
                          tooltip: context.l10n.trackOrder,
                        ),
                      ],
                    ),
                    const SizedBox(height: NishaSpace.lg),
                    Text(
                      context.l10n.heroTitle,
                      style: theme.textTheme.headlineMedium?.copyWith(
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    const SizedBox(height: NishaSpace.xs),
                    Text(
                      context.l10n.heroSubtitle,
                      style: theme.textTheme.bodyLarge?.copyWith(
                        color: theme.colorScheme.onSurfaceVariant,
                      ),
                    ),
                    const SizedBox(height: NishaSpace.lg),
                    TextField(
                      controller: _search,
                      decoration: InputDecoration(
                        hintText: context.l10n.publicSpaceDescription,
                        prefixIcon: const Icon(Icons.search_rounded),
                        suffixIcon: IconButton(
                          icon: const Icon(Icons.arrow_forward_rounded),
                          onPressed: () => setState(
                            () => _query = _search.text.trim(),
                          ),
                        ),
                      ),
                      textInputAction: TextInputAction.search,
                      onSubmitted: (value) =>
                          setState(() => _query = value.trim()),
                    ),
                    const SizedBox(height: NishaSpace.md),
                    Wrap(
                      spacing: NishaSpace.xs,
                      runSpacing: NishaSpace.xs,
                      children: [
                        FilledButton(
                          onPressed: () => context.go(RoutePaths.sellerLogin),
                          child: Text(context.l10n.openSellerSpace),
                        ),
                        OutlinedButton(
                          onPressed: () => context.go(RoutePaths.customerLogin),
                          child: Text(context.l10n.openCustomerSpace),
                        ),
                      ],
                    ),
                    const SizedBox(height: NishaSpace.xl),
                    asyncHome.when(
                      loading: () => const NishaAsyncStateView(
                        kind: AsyncViewKind.loading,
                        title: '',
                      ),
                      error: (error, _) => NishaAsyncStateView(
                        kind: error is ApiException &&
                                error.message.contains('Network')
                            ? AsyncViewKind.offline
                            : AsyncViewKind.error,
                        title: context.l10n.comingSoon,
                        subtitle: '$error',
                        actionLabel: context.l10n.retry,
                        onAction: () =>
                            ref.invalidate(publicHomeProvider(_query)),
                      ),
                      data: (home) {
                        final stores = home.featuredStores;
                        final products = home.featuredProducts;
                        if (stores.isEmpty && products.isEmpty) {
                          return NishaAsyncStateView(
                            kind: AsyncViewKind.empty,
                            title: context.l10n.publicSpace,
                            subtitle: context.l10n.publicSpaceDescription,
                          );
                        }
                        return Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            if (stores.isNotEmpty) ...[
                              Text(
                                context.l10n.stores,
                                style: theme.textTheme.titleMedium?.copyWith(
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                              const SizedBox(height: NishaSpace.sm),
                              ...stores.map((entry) {
                                final store = entry.store;
                                return Padding(
                                  padding: const EdgeInsets.only(
                                    bottom: NishaSpace.sm,
                                  ),
                                  child: NishaSurfaceCard(
                                    onTap: () => context.go(
                                      '/store/${store.slug}',
                                    ),
                                    child: Row(
                                      children: [
                                        _thumb(store.logoUrl),
                                        const SizedBox(width: NishaSpace.sm),
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            children: [
                                              Text(
                                                store.name,
                                                style: theme
                                                    .textTheme.titleMedium
                                                    ?.copyWith(
                                                  fontWeight: FontWeight.w700,
                                                ),
                                              ),
                                              Text(
                                                '${entry.productCount} ${context.l10n.products}',
                                                style: theme
                                                    .textTheme.bodySmall,
                                              ),
                                            ],
                                          ),
                                        ),
                                        const Icon(Icons.chevron_right),
                                      ],
                                    ),
                                  ),
                                );
                              }),
                            ],
                            if (products.isNotEmpty) ...[
                              const SizedBox(height: NishaSpace.md),
                              Text(
                                context.l10n.products,
                                style: theme.textTheme.titleMedium?.copyWith(
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                              const SizedBox(height: NishaSpace.sm),
                              ...products.map((entry) {
                                final product = entry.product;
                                final store = entry.store;
                                return Padding(
                                  padding: const EdgeInsets.only(
                                    bottom: NishaSpace.sm,
                                  ),
                                  child: NishaSurfaceCard(
                                    onTap: () => context.go(
                                      '/store/${store.slug}/products/${product.id}',
                                    ),
                                    child: Row(
                                      children: [
                                        _thumb(product.primaryImageUrl),
                                        const SizedBox(width: NishaSpace.sm),
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            children: [
                                              Text(
                                                product.title,
                                                style: theme
                                                    .textTheme.titleSmall
                                                    ?.copyWith(
                                                  fontWeight: FontWeight.w700,
                                                ),
                                              ),
                                              Text(
                                                '${store.name} · ${product.price}',
                                                style: theme
                                                    .textTheme.bodySmall,
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                );
                              }),
                            ],
                          ],
                        );
                      },
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _thumb(String? url) {
    final resolved = AppConfig.resolveUrl(url);
    return ClipRRect(
      borderRadius: BorderRadius.circular(NishaRadii.md),
      child: SizedBox(
        width: 56,
        height: 56,
        child: resolved.isEmpty
            ? ColoredBox(
                color: Theme.of(context).colorScheme.surfaceContainerHighest,
                child: const Icon(Icons.storefront_outlined),
              )
            : CachedNetworkImage(imageUrl: resolved, fit: BoxFit.cover),
      ),
    );
  }
}
