import '../../../core/api/json_map.dart';

class CustomerDashboard {
  CustomerDashboard(this.raw);

  final Map<String, dynamic> raw;

  int get totalOrders => asInt(raw['total_orders']);
  int get activeOrders => asInt(raw['active_orders']);
  int get complaints => asInt(raw['complaints']);
  int get chats => asInt(raw['chats']);
  Map<String, dynamic> get profile => asJsonMap(raw['profile']);
  List<CustomerOrderListItem> get recentOrders =>
      asJsonList(raw['recent_orders'])
          .map(CustomerOrderListItem.fromJson)
          .toList();
  List<Map<String, dynamic>> get addresses => asJsonList(raw['addresses']);

  factory CustomerDashboard.fromJson(Object? data) =>
      CustomerDashboard(asJsonMap(data));
}

class CustomerOrderListItem {
  CustomerOrderListItem(this.raw);

  final Map<String, dynamic> raw;

  int get id => asInt(raw['id']);
  String get invoiceCode => asStringOr(raw['invoice_code']);
  String get status => asStringOr(raw['status']);
  String get buyerName => asStringOr(raw['buyer_name']);
  String get totalAmount => asStringOr(raw['total_amount']);
  String get createdAt => asStringOr(raw['created_at']);

  factory CustomerOrderListItem.fromJson(Map<String, dynamic> json) =>
      CustomerOrderListItem(json);
}

class CustomerOrderDetail {
  CustomerOrderDetail(this.raw);

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
  Map<String, dynamic> get store => asJsonMap(raw['store']);

  factory CustomerOrderDetail.fromJson(Object? data) =>
      CustomerOrderDetail(asJsonMap(data));
}

class CustomerProfile {
  CustomerProfile(this.raw);

  final Map<String, dynamic> raw;

  int get id => asInt(raw['id']);
  String get fullName => asStringOr(raw['full_name']);
  String? get email => asString(raw['email']);
  String? get phone => asString(raw['phone']);
  String? get postalCode => asString(raw['postal_code']);

  factory CustomerProfile.fromJson(Object? data) =>
      CustomerProfile(asJsonMap(data));
}
