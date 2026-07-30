import '../../../core/api/json_map.dart';

class PaginatedResponse<T> {
  PaginatedResponse({
    required this.items,
    required this.total,
    required this.page,
    required this.pageSize,
    required this.totalPages,
  });

  final List<T> items;
  final int total;
  final int page;
  final int pageSize;
  final int totalPages;

  static PaginatedResponse<T> fromJson<T>(
    Object? data,
    T Function(Map<String, dynamic> json) itemParser,
  ) {
    final map = asJsonMap(data);
    return PaginatedResponse<T>(
      items: asJsonList(map['items']).map(itemParser).toList(),
      total: asInt(map['total']),
      page: asInt(map['page'], 1),
      pageSize: asInt(map['page_size'], 20),
      totalPages: asInt(map['total_pages']),
    );
  }
}

class SellerDashboard {
  SellerDashboard(this.raw);

  final Map<String, dynamic> raw;

  int get storeReadinessScore => asInt(raw['store_readiness_score']);
  List<String> get missingTasks =>
      asJsonList(raw['store_readiness_missing_tasks'])
          .map((item) => asStringOr(item['label'] ?? item))
          .toList();
  String get onboardingStatus => asStringOr(raw['onboarding_status']);
  int get totalOrders => asInt(raw['total_orders']);
  int get pendingOrders => asInt(raw['pending_orders']);
  String get todayRevenue => asStringOr(raw['today_revenue']);
  String get confirmedRevenue => asStringOr(raw['confirmed_revenue']);
  List<Map<String, dynamic>> get recentOrders =>
      asJsonList(raw['recent_orders']);
  List<Map<String, dynamic>> get lowStockProducts =>
      asJsonList(raw['low_stock_products']);

  factory SellerDashboard.fromJson(Object? data) =>
      SellerDashboard(asJsonMap(data));
}

class SellerProduct {
  SellerProduct(this.raw);

  final Map<String, dynamic> raw;

  int get id => asInt(raw['id']);
  String get title => asStringOr(raw['title']);
  String? get description => asString(raw['description']);
  String get price => asStringOr(raw['price']);
  int get stockQuantity => asInt(raw['stock_quantity']);
  bool get isActive => asBool(raw['is_active'], true);
  String? get imageUrl {
    final images = asJsonList(raw['images']);
    if (images.isEmpty) {
      return null;
    }
    return asString(images.first['image_url']) ??
        asString(images.first['thumbnail_url']);
  }

  factory SellerProduct.fromJson(Map<String, dynamic> json) =>
      SellerProduct(json);
}

class SellerOrderListItem {
  SellerOrderListItem(this.raw);

  final Map<String, dynamic> raw;

  int get id => asInt(raw['id']);
  String get invoiceCode => asStringOr(raw['invoice_code']);
  String get status => asStringOr(raw['status']);
  String get buyerName => asStringOr(raw['buyer_name']);
  String get totalAmount => asStringOr(raw['total_amount']);
  String get createdAt => asStringOr(raw['created_at']);

  factory SellerOrderListItem.fromJson(Map<String, dynamic> json) =>
      SellerOrderListItem(json);
}

class SellerOrderDetail {
  SellerOrderDetail(this.raw);

  final Map<String, dynamic> raw;

  int get id => asInt(raw['id']);
  String get invoiceCode => asStringOr(raw['invoice_code']);
  String get status => asStringOr(raw['status']);
  String get buyerName => asStringOr(raw['buyer_name']);
  String get buyerPhone => asStringOr(raw['buyer_phone']);
  String get buyerAddress => asStringOr(raw['buyer_address']);
  String? get buyerNote => asString(raw['buyer_note']);
  String get totalAmount => asStringOr(raw['total_amount']);
  String get createdAt => asStringOr(raw['created_at']);
  List<Map<String, dynamic>> get items => asJsonList(raw['items']);
  List<Map<String, dynamic>> get paymentProofs =>
      asJsonList(raw['payment_proofs']);
  Map<String, dynamic> get paymentMethod => asJsonMap(raw['payment_method']);

  factory SellerOrderDetail.fromJson(Object? data) =>
      SellerOrderDetail(asJsonMap(data));
}

class SellerOnboardingResponse {
  SellerOnboardingResponse(this.raw);

  final Map<String, dynamic> raw;

  Map<String, dynamic> get store => asJsonMap(raw['store']);
  Map<String, dynamic> get state => asJsonMap(raw['state']);
  List<Map<String, dynamic>> get categories => asJsonList(raw['categories']);

  factory SellerOnboardingResponse.fromJson(Object? data) =>
      SellerOnboardingResponse(asJsonMap(data));
}

class SubscriptionPlan {
  SubscriptionPlan(this.raw);

  final Map<String, dynamic> raw;

  int get id => asInt(raw['id']);
  String get code => asStringOr(raw['code']);
  String get nameFa => asStringOr(raw['name_fa']);
  int get monthlyPrice => asInt(raw['monthly_price_toman']);
  bool get isRecommended => asBool(raw['is_recommended']);

  factory SubscriptionPlan.fromJson(Map<String, dynamic> json) =>
      SubscriptionPlan(json);
}

class SellerSubscriptionDetail {
  SellerSubscriptionDetail(this.raw);

  final Map<String, dynamic> raw;

  Map<String, dynamic> get subscription => asJsonMap(raw['subscription']);
  Map<String, dynamic> get effectivePlan => asJsonMap(raw['effective_plan']);
  Map<String, dynamic> get entitlements => asJsonMap(raw['entitlements']);
  bool get isExpiredFallback => asBool(raw['is_expired_fallback']);

  factory SellerSubscriptionDetail.fromJson(Object? data) =>
      SellerSubscriptionDetail(asJsonMap(data));
}
