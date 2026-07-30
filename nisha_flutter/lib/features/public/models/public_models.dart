import '../../../core/api/json_map.dart';

class PublicStoreProfile {
  PublicStoreProfile(this.raw);

  final Map<String, dynamic> raw;

  int get id => asInt(raw['id']);
  String get name => asStringOr(raw['name']);
  String get slug => asStringOr(raw['slug']);
  String? get description => asString(raw['description']);
  String? get logoUrl => asString(raw['logo_url']);
  String? get coverImageUrl => asString(raw['cover_image_url']);
  bool get guestCheckoutEnabled => asBool(raw['guest_checkout_enabled']);

  factory PublicStoreProfile.fromJson(Object? data) =>
      PublicStoreProfile(asJsonMap(data));
}

class PublicProduct {
  PublicProduct(this.raw);

  final Map<String, dynamic> raw;

  int get id => asInt(raw['id']);
  String get title => asStringOr(raw['title']);
  String? get description => asString(raw['description']);
  String get price => asStringOr(raw['price']);
  int get stockQuantity => asInt(raw['stock_quantity']);
  List<Map<String, dynamic>> get images => asJsonList(raw['images']);
  List<Map<String, dynamic>> get variants => asJsonList(raw['variants']);
  String? get primaryImageUrl {
    if (images.isEmpty) {
      return null;
    }
    return asString(images.first['image_url']) ??
        asString(images.first['thumbnail_url']);
  }

  factory PublicProduct.fromJson(Object? data) =>
      PublicProduct(asJsonMap(data));
}

class PublicHomepageResponse {
  PublicHomepageResponse(this.raw);

  final Map<String, dynamic> raw;

  String? get query => asString(raw['query']);
  String get heroTitle => asStringOr(raw['hero_title']);
  String get heroSubtitle => asStringOr(raw['hero_subtitle']);
  String get searchHint => asStringOr(raw['search_hint']);

  Map<String, dynamic> get stats => asJsonMap(raw['stats']);

  List<Map<String, dynamic>> get categories => asJsonList(raw['categories']);

  List<PublicHomepageProduct> get featuredProducts => asJsonList(
        raw['featured_products'],
      )
          .map(PublicHomepageProduct.fromJson)
          .toList();

  List<PublicHomepageStore> get featuredStores => asJsonList(
        raw['featured_stores'],
      )
          .map(PublicHomepageStore.fromJson)
          .toList();

  List<Map<String, dynamic>> get recentReviews =>
      asJsonList(raw['recent_reviews']);

  List<String> get trustIndicators => asJsonList(raw['trust_indicators'])
      .map((item) => asStringOr(item['label'] ?? item))
      .where((item) => item.isNotEmpty)
      .toList();

  factory PublicHomepageResponse.fromJson(Object? data) =>
      PublicHomepageResponse(asJsonMap(data));
}

class PublicHomepageProduct {
  PublicHomepageProduct({
    required this.product,
    required this.store,
    required this.averageRating,
    required this.reviewCount,
  });

  final PublicProduct product;
  final PublicStoreProfile store;
  final double averageRating;
  final int reviewCount;

  factory PublicHomepageProduct.fromJson(Map<String, dynamic> json) {
    return PublicHomepageProduct(
      product: PublicProduct.fromJson(json['product']),
      store: PublicStoreProfile.fromJson(json['store']),
      averageRating: asDouble(json['average_rating']),
      reviewCount: asInt(json['review_count']),
    );
  }
}

class PublicHomepageStore {
  PublicHomepageStore({
    required this.store,
    required this.productCount,
    required this.averageRating,
    required this.reviewCount,
  });

  final PublicStoreProfile store;
  final int productCount;
  final double averageRating;
  final int reviewCount;

  factory PublicHomepageStore.fromJson(Map<String, dynamic> json) {
    return PublicHomepageStore(
      store: PublicStoreProfile.fromJson(json['store']),
      productCount: asInt(json['product_count']),
      averageRating: asDouble(json['average_rating']),
      reviewCount: asInt(json['review_count']),
    );
  }
}

class PublicStorePageResponse {
  PublicStorePageResponse(this.raw);

  final Map<String, dynamic> raw;

  PublicStoreProfile get store => PublicStoreProfile.fromJson(raw['store']);
  List<PublicProduct> get products =>
      asJsonList(raw['products']).map(PublicProduct.fromJson).toList();
  List<Map<String, dynamic>> get categories => asJsonList(raw['categories']);
  List<Map<String, dynamic>> get paymentMethods =>
      asJsonList(raw['payment_methods']);
  Map<String, dynamic> get reviewSummary => asJsonMap(raw['review_summary']);

  factory PublicStorePageResponse.fromJson(Object? data) =>
      PublicStorePageResponse(asJsonMap(data));
}

class PublicProductListResponse {
  PublicProductListResponse(this.raw);

  final Map<String, dynamic> raw;

  List<PublicProduct> get items =>
      asJsonList(raw['items']).map(PublicProduct.fromJson).toList();
  int get total => asInt(raw['total']);
  int get page => asInt(raw['page'], 1);
  bool get hasMore => asBool(raw['has_more']);

  factory PublicProductListResponse.fromJson(Object? data) =>
      PublicProductListResponse(asJsonMap(data));
}

class PublicProductDetailResponse {
  PublicProductDetailResponse(this.raw);

  final Map<String, dynamic> raw;

  PublicStoreProfile get store => PublicStoreProfile.fromJson(raw['store']);
  PublicProduct get product => PublicProduct.fromJson(raw['product']);
  List<Map<String, dynamic>> get publicReviews =>
      asJsonList(raw['public_reviews']);

  factory PublicProductDetailResponse.fromJson(Object? data) =>
      PublicProductDetailResponse(asJsonMap(data));
}

class CheckoutResponse {
  CheckoutResponse(this.raw);

  final Map<String, dynamic> raw;

  String get invoiceCode => asStringOr(raw['invoice_code']);
  String get invoiceEditPassword => asStringOr(raw['invoice_edit_password']);
  int get orderId => asInt(raw['order_id']);
  String get status => asStringOr(raw['status']);
  String get totalAmount => asStringOr(raw['total_amount']);
  Map<String, dynamic> get paymentMethod => asJsonMap(raw['payment_method']);
  List<Map<String, dynamic>> get items => asJsonList(raw['items']);

  factory CheckoutResponse.fromJson(Object? data) =>
      CheckoutResponse(asJsonMap(data));
}

class OrderTrackResponse {
  OrderTrackResponse(this.raw);

  final Map<String, dynamic> raw;

  int get orderId => asInt(raw['order_id']);
  String get invoiceCode => asStringOr(raw['invoice_code']);
  String get status => asStringOr(raw['status']);
  String get buyerName => asStringOr(raw['buyer_name']);
  String get totalAmount => asStringOr(raw['total_amount']);
  String get createdAt => asStringOr(raw['created_at']);
  List<Map<String, dynamic>> get items => asJsonList(raw['items']);
  List<Map<String, dynamic>> get paymentProofs =>
      asJsonList(raw['payment_proofs']);
  PublicStoreProfile get store => PublicStoreProfile.fromJson(raw['store']);
  Map<String, dynamic> get paymentMethod => asJsonMap(raw['payment_method']);

  factory OrderTrackResponse.fromJson(Object? data) =>
      OrderTrackResponse(asJsonMap(data));
}

class CartLineItem {
  CartLineItem({
    required this.productId,
    this.variantId,
    required this.title,
    required this.unitPrice,
    required this.quantity,
    this.imageUrl,
  });

  final int productId;
  final int? variantId;
  final String title;
  final String unitPrice;
  final int quantity;
  final String? imageUrl;

  Map<String, dynamic> toOrderItemInput() => <String, dynamic>{
        'product_id': productId,
        if (variantId != null) 'variant_id': variantId,
        'quantity': quantity,
      };

  CartLineItem copyWith({int? quantity}) {
    return CartLineItem(
      productId: productId,
      variantId: variantId,
      title: title,
      unitPrice: unitPrice,
      quantity: quantity ?? this.quantity,
      imageUrl: imageUrl,
    );
  }
}
