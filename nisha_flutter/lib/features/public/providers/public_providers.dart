import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../data/public_repository.dart';
import '../models/public_models.dart';

class CartState {
  const CartState({
    this.storeSlug,
    this.storeName,
    this.items = const <CartLineItem>[],
    this.guestCheckoutEnabled = true,
    this.paymentMethods = const <Map<String, dynamic>>[],
  });

  final String? storeSlug;
  final String? storeName;
  final List<CartLineItem> items;
  final bool guestCheckoutEnabled;
  final List<Map<String, dynamic>> paymentMethods;

  bool get isEmpty => items.isEmpty;

  CartState copyWith({
    String? storeSlug,
    String? storeName,
    List<CartLineItem>? items,
    bool? guestCheckoutEnabled,
    List<Map<String, dynamic>>? paymentMethods,
  }) {
    return CartState(
      storeSlug: storeSlug ?? this.storeSlug,
      storeName: storeName ?? this.storeName,
      items: items ?? this.items,
      guestCheckoutEnabled: guestCheckoutEnabled ?? this.guestCheckoutEnabled,
      paymentMethods: paymentMethods ?? this.paymentMethods,
    );
  }
}

class CartNotifier extends StateNotifier<CartState> {
  CartNotifier() : super(const CartState());

  void bindStore({
    required String slug,
    required String name,
    required bool guestCheckoutEnabled,
    required List<Map<String, dynamic>> paymentMethods,
  }) {
    if (state.storeSlug != null && state.storeSlug != slug && state.items.isNotEmpty) {
      state = CartState(
        storeSlug: slug,
        storeName: name,
        guestCheckoutEnabled: guestCheckoutEnabled,
        paymentMethods: paymentMethods,
      );
      return;
    }
    state = state.copyWith(
      storeSlug: slug,
      storeName: name,
      guestCheckoutEnabled: guestCheckoutEnabled,
      paymentMethods: paymentMethods,
    );
  }

  void addItem(CartLineItem item) {
    final existingIndex = state.items.indexWhere(
      (line) => line.productId == item.productId && line.variantId == item.variantId,
    );
    if (existingIndex >= 0) {
      final updated = List<CartLineItem>.from(state.items);
      final current = updated[existingIndex];
      updated[existingIndex] = current.copyWith(
        quantity: current.quantity + item.quantity,
      );
      state = state.copyWith(items: updated);
      return;
    }
    state = state.copyWith(items: [...state.items, item]);
  }

  void updateQuantity(int productId, int? variantId, int quantity) {
    if (quantity <= 0) {
      removeItem(productId, variantId);
      return;
    }
    final updated = state.items
        .map(
          (line) => line.productId == productId && line.variantId == variantId
              ? line.copyWith(quantity: quantity)
              : line,
        )
        .toList();
    state = state.copyWith(items: updated);
  }

  void removeItem(int productId, int? variantId) {
    state = state.copyWith(
      items: state.items
          .where(
            (line) =>
                !(line.productId == productId && line.variantId == variantId),
          )
          .toList(),
    );
  }

  void clear() {
    state = const CartState();
  }
}

final cartProvider =
    StateNotifierProvider<CartNotifier, CartState>((ref) => CartNotifier());

final publicHomeProvider =
    FutureProvider.family<PublicHomepageResponse, String>((ref, query) async {
  final repo = ref.watch(publicRepositoryProvider);
  return repo.getHome(query: query);
});

final publicStoreProvider =
    FutureProvider.family<PublicStorePageResponse, String>((ref, slug) async {
  final repo = ref.watch(publicRepositoryProvider);
  return repo.getStore(slug);
});

final publicProductProvider = FutureProvider.family<
    PublicProductDetailResponse,
    ({String slug, int productId})>((ref, args) async {
  final repo = ref.watch(publicRepositoryProvider);
  return repo.getProduct(args.slug, args.productId);
});
