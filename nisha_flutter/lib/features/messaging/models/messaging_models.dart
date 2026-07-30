import '../../../core/api/json_map.dart';

class ConversationListItem {
  ConversationListItem(this.raw);

  final Map<String, dynamic> raw;

  int get id => asInt(raw['id']);
  String get storeName => asStringOr(raw['store_name']);
  String get storeSlug => asStringOr(raw['store_slug']);
  String get customerName => asStringOr(raw['customer_name']);
  int get unreadCount => asInt(raw['unread_count']);
  String? get lastMessageBody => asString(raw['last_message_body']);
  String? get lastMessageAt => asString(raw['last_message_at']);
  String? get invoiceCode => asString(raw['invoice_code']);

  factory ConversationListItem.fromJson(Map<String, dynamic> json) =>
      ConversationListItem(json);
}

class ConversationDetail {
  ConversationDetail(this.raw);

  final Map<String, dynamic> raw;

  int get id => asInt(raw['id']);
  String get storeName => asStringOr(raw['store_name']);
  String get customerName => asStringOr(raw['customer_name']);
  String? get invoiceCode => asString(raw['invoice_code']);
  List<Map<String, dynamic>> get messages => asJsonList(raw['messages']);

  factory ConversationDetail.fromJson(Object? data) =>
      ConversationDetail(asJsonMap(data));
}

class WsTicketResponse {
  WsTicketResponse({
    required this.ticket,
    required this.expiresIn,
  });

  final String ticket;
  final int expiresIn;

  factory WsTicketResponse.fromJson(Object? data) {
    final map = asJsonMap(data);
    return WsTicketResponse(
      ticket: asStringOr(map['ticket']),
      expiresIn: asInt(map['expires_in'], 60),
    );
  }
}
