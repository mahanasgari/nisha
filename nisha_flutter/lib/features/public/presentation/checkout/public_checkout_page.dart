import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/api/api_exception.dart';
import '../../../../core/api/json_map.dart';
import '../../../../core/router/route_paths.dart';
import '../../../../core/theme/nisha_tokens.dart';
import '../../../../shared/extensions/build_context_x.dart';
import '../../../../shared/widgets/nisha_ui.dart';
import '../../../../shared/widgets/public_shell.dart';
import '../../data/public_repository.dart';
import '../../providers/public_providers.dart';

class PublicCheckoutPage extends ConsumerStatefulWidget {
  const PublicCheckoutPage({super.key, required this.slug});

  final String slug;

  @override
  ConsumerState<PublicCheckoutPage> createState() => _PublicCheckoutPageState();
}

class _PublicCheckoutPageState extends ConsumerState<PublicCheckoutPage> {
  final _name = TextEditingController();
  final _phone = TextEditingController();
  final _address = TextEditingController();
  final _note = TextEditingController();
  int? _paymentMethodId;
  bool _submitting = false;
  String? _error;

  @override
  void dispose() {
    _name.dispose();
    _phone.dispose();
    _address.dispose();
    _note.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final cart = ref.watch(cartProvider);
    final storeAsync = ref.watch(publicStoreProvider(widget.slug));

    return PublicShell(
      child: storeAsync.when(
        loading: () => const NishaAsyncStateView(
          kind: AsyncViewKind.loading,
          title: '',
        ),
        error: (e, _) => NishaAsyncStateView(
          kind: AsyncViewKind.error,
          title: context.l10n.comingSoon,
          subtitle: '$e',
        ),
        data: (page) {
          final methods = page.paymentMethods;
          _paymentMethodId ??= methods.isEmpty
              ? null
              : asInt(methods.first['id']);

          if (cart.isEmpty) {
            return NishaAsyncStateView(
              kind: AsyncViewKind.empty,
              title: context.l10n.comingSoon,
              subtitle: context.l10n.publicSpaceDescription,
              actionLabel: context.l10n.browseCatalog,
              onAction: () => context.go('/store/${widget.slug}'),
            );
          }

          if (!page.store.guestCheckoutEnabled) {
            return NishaAsyncStateView(
              kind: AsyncViewKind.error,
              title: context.l10n.loginCustomer,
              subtitle: context.l10n.customerLoginSubtitle,
              actionLabel: context.l10n.signIn,
              onAction: () => context.go(
                '${RoutePaths.customerLogin}?redirect=${Uri.encodeComponent('/store/${widget.slug}/checkout')}',
              ),
            );
          }

          return ListView(
            padding: const EdgeInsets.all(NishaSpace.lg),
            children: [
              Text(
                context.l10n.comingSoon,
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w800,
                    ),
              ),
              const SizedBox(height: NishaSpace.md),
              ...cart.items.map(
                (item) => NishaSurfaceCard(
                  child: ListTile(
                    contentPadding: EdgeInsets.zero,
                    title: Text(item.title),
                    subtitle: Text('${item.unitPrice} × ${item.quantity}'),
                    trailing: IconButton(
                      icon: const Icon(Icons.delete_outline),
                      onPressed: () => ref
                          .read(cartProvider.notifier)
                          .removeItem(item.productId, item.variantId),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: NishaSpace.md),
              TextField(
                controller: _name,
                decoration: InputDecoration(labelText: context.l10n.buyerName),
              ),
              const SizedBox(height: NishaSpace.sm),
              TextField(
                controller: _phone,
                decoration: InputDecoration(labelText: context.l10n.buyerPhone),
              ),
              const SizedBox(height: NishaSpace.sm),
              TextField(
                controller: _address,
                decoration:
                    InputDecoration(labelText: context.l10n.buyerAddress),
                maxLines: 2,
              ),
              const SizedBox(height: NishaSpace.sm),
              DropdownButtonFormField<int>(
                initialValue: _paymentMethodId,
                decoration:
                    InputDecoration(labelText: context.l10n.paymentMethods),
                items: [
                  for (final method in methods)
                    DropdownMenuItem(
                      value: asInt(method['id']),
                      child: Text(asStringOr(method['title'] ?? method['type'])),
                    ),
                ],
                onChanged: (value) => setState(() => _paymentMethodId = value),
              ),
              if (_error != null) ...[
                const SizedBox(height: NishaSpace.sm),
                Text(_error!, style: TextStyle(color: Theme.of(context).colorScheme.error)),
              ],
              const SizedBox(height: NishaSpace.lg),
              FilledButton(
                onPressed: _submitting ? null : () => _submit(cart.items),
                child: _submitting
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : Text(context.l10n.signUp),
              ),
            ],
          );
        },
      ),
    );
  }

  Future<void> _submit(List items) async {
    if (_paymentMethodId == null) {
      setState(() => _error = 'Payment method required');
      return;
    }
    setState(() {
      _submitting = true;
      _error = null;
    });
    try {
      final result = await ref.read(publicRepositoryProvider).createGuestOrder(
            widget.slug,
            buyerName: _name.text.trim(),
            buyerPhone: _phone.text.trim(),
            buyerAddress: _address.text.trim(),
            buyerNote: _note.text.trim().isEmpty ? null : _note.text.trim(),
            paymentMethodId: _paymentMethodId!,
            items: ref.read(cartProvider).items,
          );
      ref.read(cartProvider.notifier).clear();
      if (!mounted) return;
      await showNishaBottomSheet<void>(
        context: context,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              context.l10n.invoiceCode,
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: NishaSpace.xs),
            SelectableText(result.invoiceCode),
            SelectableText(result.invoiceEditPassword),
            const SizedBox(height: NishaSpace.md),
            FilledButton(
              onPressed: () {
                Navigator.pop(context);
                context.go(RoutePaths.trackOrder);
              },
              child: Text(context.l10n.trackOrder),
            ),
          ],
        ),
      );
    } on ApiException catch (error) {
      setState(() => _error = error.message);
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }
}
