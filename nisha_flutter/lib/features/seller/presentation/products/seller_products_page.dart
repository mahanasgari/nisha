import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/api/api_exception.dart';
import '../../../../core/router/route_paths.dart';
import '../../../../core/theme/nisha_tokens.dart';
import '../../../../shared/extensions/build_context_x.dart';
import '../../../../shared/widgets/money_input.dart';
import '../../../../shared/widgets/nisha_ui.dart';
import '../../data/seller_repository.dart';

final sellerProductsProvider = FutureProvider((ref) {
  return ref.watch(sellerRepositoryProvider).listProducts();
});

class SellerProductsPage extends ConsumerWidget {
  const SellerProductsPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(sellerProductsProvider);
    return Scaffold(
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.push(RoutePaths.sellerProductNew),
        child: const Icon(Icons.add),
      ),
      body: async.when(
        loading: () => const NishaAsyncStateView(
          kind: AsyncViewKind.loading,
          title: '',
        ),
        error: (error, _) => NishaAsyncStateView(
          kind: AsyncViewKind.error,
          title: context.l10n.products,
          subtitle: '$error',
          actionLabel: context.l10n.retry,
          onAction: () => ref.invalidate(sellerProductsProvider),
        ),
        data: (page) {
          if (page.items.isEmpty) {
            return NishaAsyncStateView(
              kind: AsyncViewKind.empty,
              title: context.l10n.products,
              actionLabel: context.l10n.signUp,
              onAction: () => context.push(RoutePaths.sellerProductNew),
            );
          }
          return RefreshIndicator(
            onRefresh: () async {
              ref.invalidate(sellerProductsProvider);
              await ref.read(sellerProductsProvider.future);
            },
            child: ListView.separated(
              padding: const EdgeInsets.all(NishaSpace.lg),
              itemCount: page.items.length,
              separatorBuilder: (_, _) =>
                  const SizedBox(height: NishaSpace.sm),
              itemBuilder: (context, index) {
                final product = page.items[index];
                return NishaSurfaceCard(
                  onTap: () =>
                      context.push('/seller/products/${product.id}/edit'),
                  child: ListTile(
                    contentPadding: EdgeInsets.zero,
                    title: Text(product.title),
                    subtitle: Text(
                      '${product.price} · stock ${product.stockQuantity}',
                    ),
                    trailing: Icon(
                      product.isActive
                          ? Icons.check_circle_outline
                          : Icons.pause_circle_outline,
                    ),
                  ),
                );
              },
            ),
          );
        },
      ),
    );
  }
}

class SellerProductFormPage extends ConsumerStatefulWidget {
  const SellerProductFormPage({super.key, this.productId});

  final int? productId;

  @override
  ConsumerState<SellerProductFormPage> createState() =>
      _SellerProductFormPageState();
}

class _SellerProductFormPageState extends ConsumerState<SellerProductFormPage> {
  final _title = TextEditingController();
  final _description = TextEditingController();
  final _price = TextEditingController();
  final _stock = TextEditingController(text: '0');
  bool _active = true;
  bool _loading = false;
  bool _bootstrapped = false;

  @override
  void dispose() {
    _title.dispose();
    _description.dispose();
    _price.dispose();
    _stock.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    if (widget.productId == null || _bootstrapped) return;
    final product =
        await ref.read(sellerRepositoryProvider).getProduct(widget.productId!);
    _title.text = product.title;
    _description.text = product.description ?? '';
    _price.text = MoneyInputFormatter.formatDigits(
      product.price.replaceAll(RegExp(r'[^0-9]'), ''),
    );
    _stock.text = '${product.stockQuantity}';
    _active = product.isActive;
    _bootstrapped = true;
    if (mounted) setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    if (widget.productId != null && !_bootstrapped) {
      _load();
    }
    return Scaffold(
      appBar: AppBar(
        title: Text(
          widget.productId == null
              ? context.l10n.products
              : context.l10n.products,
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(NishaSpace.lg),
        children: [
          TextField(
            controller: _title,
            decoration: InputDecoration(labelText: context.l10n.fullName),
          ),
          const SizedBox(height: NishaSpace.sm),
          TextField(
            controller: _description,
            maxLines: 3,
            decoration: const InputDecoration(labelText: 'Description'),
          ),
          const SizedBox(height: NishaSpace.sm),
          MoneyTextField(controller: _price, label: 'Price'),
          const SizedBox(height: NishaSpace.sm),
          TextField(
            controller: _stock,
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(labelText: 'Stock'),
          ),
          SwitchListTile(
            contentPadding: EdgeInsets.zero,
            title: const Text('Active'),
            value: _active,
            onChanged: (value) => setState(() => _active = value),
          ),
          const SizedBox(height: NishaSpace.lg),
          FilledButton(
            onPressed: _loading ? null : _save,
            child: Text(context.l10n.signUp),
          ),
        ],
      ),
    );
  }

  Future<void> _save() async {
    final price = MoneyInputFormatter.parseToInt(_price.text);
    final stock = int.tryParse(_stock.text.trim()) ?? 0;
    if (price == null || _title.text.trim().isEmpty) {
      return;
    }
    setState(() => _loading = true);
    try {
      final repo = ref.read(sellerRepositoryProvider);
      if (widget.productId == null) {
        await repo.createProduct(
          title: _title.text.trim(),
          description: _description.text.trim(),
          price: price,
          stockQuantity: stock,
          isActive: _active,
        );
      } else {
        await repo.updateProduct(
          widget.productId!,
          title: _title.text.trim(),
          description: _description.text.trim(),
          price: price,
          stockQuantity: stock,
          isActive: _active,
        );
      }
      ref.invalidate(sellerProductsProvider);
      if (mounted) context.pop();
    } on ApiException catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(error.message)),
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }
}
