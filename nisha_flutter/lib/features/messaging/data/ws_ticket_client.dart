import 'dart:async';
import 'dart:math';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

import '../../../core/api/api_client.dart';
import '../../../core/api/auth_scope.dart';
import '../../../core/api/json_map.dart';
import '../../../core/config/app_config.dart';
import '../models/messaging_models.dart';

final messagingRepositoryProvider = Provider<MessagingRepository>((ref) {
  return MessagingRepository(ref.watch(apiClientProvider));
});

class MessagingRepository {
  MessagingRepository(this._api);

  final ApiClient _api;

  Future<List<ConversationListItem>> listSellerConversations({
    int page = 1,
    int pageSize = 20,
  }) async {
    final response = await _api.get(
      '/seller/conversations',
      asJsonMap,
      queryParameters: <String, dynamic>{
        'page': page,
        'page_size': pageSize,
      },
    );
    return asJsonList(response['items'])
        .map(ConversationListItem.fromJson)
        .toList();
  }

  Future<ConversationDetail> getSellerConversation(int id) {
    return _api.get(
      '/seller/conversations/$id',
      ConversationDetail.fromJson,
    );
  }

  Future<List<ConversationListItem>> listCustomerConversations({
    int page = 1,
    int pageSize = 20,
  }) async {
    final response = await _api.get(
      '/customer/conversations',
      asJsonMap,
      queryParameters: <String, dynamic>{
        'page': page,
        'page_size': pageSize,
      },
    );
    return asJsonList(response['items'])
        .map(ConversationListItem.fromJson)
        .toList();
  }

  Future<ConversationDetail> getCustomerConversation(int id) {
    return _api.get(
      '/customer/conversations/$id',
      ConversationDetail.fromJson,
    );
  }

  Future<WsTicketResponse> issueSellerTicket() {
    return _api.post(
      '/ws/tickets/seller',
      WsTicketResponse.fromJson,
      scope: AuthScope.seller,
    );
  }

  Future<WsTicketResponse> issueCustomerTicket() {
    return _api.post(
      '/ws/tickets/customer',
      WsTicketResponse.fromJson,
      scope: AuthScope.customer,
    );
  }

  Future<WsTicketResponse> issueOrderTicket({
    required String invoiceCode,
    required String invoiceEditPassword,
  }) {
    return _api.post(
      '/ws/tickets/order',
      WsTicketResponse.fromJson,
      data: <String, dynamic>{
        'invoice_code': invoiceCode,
        'invoice_edit_password': invoiceEditPassword,
      },
    );
  }
}

/// WebSocket client with reconnect backoff.
///
/// TODO: Wire inbound messages to chat UI state once conversation detail screen
/// supports realtime updates.
class WsTicketClient {
  WsTicketClient({
    required this.path,
    required this.fetchTicket,
    this.onMessage,
    this.onError,
  });

  final String path;
  final Future<String> Function() fetchTicket;
  final void Function(dynamic message)? onMessage;
  final void Function(Object error)? onError;

  WebSocketChannel? _channel;
  StreamSubscription<dynamic>? _subscription;
  Timer? _reconnectTimer;
  bool _disposed = false;
  int _attempt = 0;

  Future<void> connect() async {
    if (_disposed) {
      return;
    }
    await disconnect(clearBackoff: false);
    try {
      final ticket = await fetchTicket();
      final base = AppConfig.apiBaseUrl.replaceFirst('http', 'ws');
      final uri = Uri.parse('$base/api/v1$path?ticket=$ticket');
      _channel = WebSocketChannel.connect(uri);
      _subscription = _channel!.stream.listen(
        (message) {
          _attempt = 0;
          onMessage?.call(message);
        },
        onError: (Object error) {
          onError?.call(error);
          _scheduleReconnect();
        },
        onDone: _scheduleReconnect,
        cancelOnError: true,
      );
    } catch (error) {
      onError?.call(error);
      _scheduleReconnect();
    }
  }

  void _scheduleReconnect() {
    if (_disposed) {
      return;
    }
    _reconnectTimer?.cancel();
    _attempt += 1;
    final delayMs = min(30000, 1000 * pow(2, min(_attempt, 5)).toInt());
    _reconnectTimer = Timer(Duration(milliseconds: delayMs), connect);
  }

  Future<void> disconnect({bool clearBackoff = true}) async {
    _reconnectTimer?.cancel();
    _reconnectTimer = null;
    await _subscription?.cancel();
    _subscription = null;
    await _channel?.sink.close();
    _channel = null;
    if (clearBackoff) {
      _attempt = 0;
    }
  }

  Future<void> dispose() async {
    _disposed = true;
    await disconnect();
  }
}
