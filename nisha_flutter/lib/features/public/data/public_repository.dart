import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_client.dart';
import '../../../core/api/json_map.dart';
import '../models/public_models.dart';

final publicRepositoryProvider = Provider<PublicRepository>((ref) {
  return PublicRepository(ref.watch(apiClientProvider));
});

class PublicRepository {
  PublicRepository(this._api);

  final ApiClient _api;

  Future<PublicHomepageResponse> getHome({String? query}) {
    return _api.get(
      '/public/home',
      PublicHomepageResponse.fromJson,
      queryParameters: query != null && query.trim().isNotEmpty
          ? <String, dynamic>{'query': query.trim()}
          : null,
    );
  }

  Future<PublicStorePageResponse> getStore(String slug) {
    return _api.get(
      '/public/stores/$slug',
      PublicStorePageResponse.fromJson,
    );
  }

  Future<PublicProductListResponse> listProducts(
    String slug, {
    String? q,
    int page = 1,
    int pageSize = 20,
  }) {
    return _api.get(
      '/public/stores/$slug/products',
      PublicProductListResponse.fromJson,
      queryParameters: <String, dynamic>{
        if (q != null && q.isNotEmpty) 'q': q,
        'page': page,
        'page_size': pageSize,
      },
    );
  }

  Future<PublicProductDetailResponse> getProduct(String slug, int productId) {
    return _api.get(
      '/public/stores/$slug/products/$productId',
      PublicProductDetailResponse.fromJson,
    );
  }

  Future<CheckoutResponse> createGuestOrder(
    String slug, {
    required String buyerName,
    required String buyerPhone,
    required String buyerAddress,
    String? buyerNote,
    required int paymentMethodId,
    required List<CartLineItem> items,
  }) {
    return _api.post(
      '/public/stores/$slug/orders',
      CheckoutResponse.fromJson,
      data: <String, dynamic>{
        'buyer_name': buyerName,
        'buyer_phone': buyerPhone,
        'buyer_address': buyerAddress,
        if (buyerNote != null && buyerNote.isNotEmpty) 'buyer_note': buyerNote,
        'payment_method_id': paymentMethodId,
        'items': items.map((item) => item.toOrderItemInput()).toList(),
      },
    );
  }

  Future<OrderTrackResponse> trackOrder({
    required String invoiceCode,
    required String invoiceEditPassword,
  }) {
    return _api.post(
      '/public/orders/track',
      OrderTrackResponse.fromJson,
      data: <String, dynamic>{
        'invoice_code': invoiceCode,
        'invoice_edit_password': invoiceEditPassword,
      },
    );
  }

  Future<Map<String, dynamic>> uploadPaymentProof({
    required String invoiceCode,
    required String invoiceEditPassword,
    required String filePath,
    String? fileName,
  }) async {
    final formData = FormData.fromMap(<String, dynamic>{
      'invoice_edit_password': invoiceEditPassword,
      'file': await MultipartFile.fromFile(
        filePath,
        filename: fileName,
      ),
    });
    return _api.uploadMultipart(
      '/public/orders/$invoiceCode/upload-payment-proof',
      asJsonMap,
      formData: formData,
    );
  }
}
