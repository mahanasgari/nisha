import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_client.dart';
import '../../../core/api/json_map.dart';
import '../models/seller_models.dart';

final sellerRepositoryProvider = Provider<SellerRepository>((ref) {
  return SellerRepository(ref.watch(apiClientProvider));
});

class SellerRepository {
  SellerRepository(this._api);

  final ApiClient _api;

  Future<SellerDashboard> getDashboard() {
    return _api.get('/seller/dashboard', SellerDashboard.fromJson);
  }

  Future<PaginatedResponse<SellerOrderListItem>> listOrders({
    String? status,
    String? search,
    int page = 1,
    int pageSize = 20,
  }) {
    return _api.get(
      '/seller/orders',
      (data) => PaginatedResponse.fromJson(
        data,
        SellerOrderListItem.fromJson,
      ),
      queryParameters: <String, dynamic>{
        if (status != null && status.isNotEmpty) 'status': status,
        if (search != null && search.isNotEmpty) 'search': search,
        'page': page,
        'page_size': pageSize,
      },
    );
  }

  Future<SellerOrderDetail> getOrder(int id) {
    return _api.get(
      '/seller/orders/$id',
      SellerOrderDetail.fromJson,
    );
  }

  Future<Map<String, dynamic>> confirmPayment(int id) {
    return _api.post(
      '/seller/orders/$id/confirm-payment',
      asJsonMap,
    );
  }

  Future<Map<String, dynamic>> rejectPayment(int id) {
    return _api.post(
      '/seller/orders/$id/reject-payment',
      asJsonMap,
    );
  }

  Future<Map<String, dynamic>> patchOrderStatus(
    int id, {
    required String status,
    String? note,
  }) {
    return _api.patch(
      '/seller/orders/$id/status',
      asJsonMap,
      data: <String, dynamic>{
        'status': status,
        'note': ?note,
      },
    );
  }

  Future<PaginatedResponse<SellerProduct>> listProducts({
    int page = 1,
    int pageSize = 20,
  }) {
    return _api.get(
      '/seller/products',
      (data) => PaginatedResponse.fromJson(data, SellerProduct.fromJson),
      queryParameters: <String, dynamic>{
        'page': page,
        'page_size': pageSize,
      },
    );
  }

  Future<SellerProduct> getProduct(int id) {
    return _api.get(
      '/seller/products/$id',
      (data) => SellerProduct.fromJson(asJsonMap(data)),
    );
  }

  Future<SellerProduct> createProduct({
    required String title,
    String? description,
    required int price,
    int stockQuantity = 0,
    bool isActive = true,
  }) {
    return _api.post(
      '/seller/products',
      (data) => SellerProduct.fromJson(asJsonMap(data)),
      data: <String, dynamic>{
        'title': title,
        'description': ?description,
        'price': price,
        'stock_quantity': stockQuantity,
        'is_active': isActive,
      },
    );
  }

  Future<SellerProduct> updateProduct(
    int id, {
    String? title,
    String? description,
    int? price,
    int? stockQuantity,
    bool? isActive,
  }) {
    return _api.put(
      '/seller/products/$id',
      (data) => SellerProduct.fromJson(asJsonMap(data)),
      data: <String, dynamic>{
        'title': ?title,
        'description': ?description,
        'price': ?price,
        'stock_quantity': ?stockQuantity,
        'is_active': ?isActive,
      },
    );
  }

  Future<SellerOnboardingResponse> getOnboarding() {
    return _api.get('/seller/onboarding', SellerOnboardingResponse.fromJson);
  }

  Future<SellerOnboardingResponse> updateOnboarding(
    Map<String, dynamic> body,
  ) {
    return _api.patch(
      '/seller/onboarding',
      SellerOnboardingResponse.fromJson,
      data: body,
    );
  }

  Future<List<SubscriptionPlan>> listPlans() {
    return _api.get(
      '/seller/plans',
      (data) => asJsonList(data).map(SubscriptionPlan.fromJson).toList(),
    );
  }

  Future<SellerSubscriptionDetail> getSubscription() {
    return _api.get(
      '/seller/subscription',
      SellerSubscriptionDetail.fromJson,
    );
  }
}
