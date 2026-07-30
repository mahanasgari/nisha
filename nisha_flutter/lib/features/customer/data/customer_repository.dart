import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_client.dart';
import '../../../core/api/json_map.dart';
import '../models/customer_models.dart';

final customerRepositoryProvider = Provider<CustomerRepository>((ref) {
  return CustomerRepository(ref.watch(apiClientProvider));
});

class CustomerRepository {
  CustomerRepository(this._api);

  final ApiClient _api;

  Future<CustomerDashboard> getDashboard() {
    return _api.get('/customer/dashboard', CustomerDashboard.fromJson);
  }

  Future<List<CustomerOrderListItem>> listOrders({bool activeOnly = false}) {
    return _api.get(
      '/customer/orders',
      (data) =>
          asJsonList(data).map(CustomerOrderListItem.fromJson).toList(),
      queryParameters: activeOnly ? <String, dynamic>{'active_only': true} : null,
    );
  }

  Future<CustomerOrderDetail> getOrder(int id) {
    return _api.get(
      '/customer/orders/$id',
      CustomerOrderDetail.fromJson,
    );
  }

  Future<CustomerProfile> getProfile() {
    return _api.get('/customer/profile', CustomerProfile.fromJson);
  }

  Future<CustomerProfile> updateProfile({
    String? fullName,
    String? email,
    String? phone,
    String? postalCode,
  }) {
    return _api.patch(
      '/customer/profile',
      CustomerProfile.fromJson,
      data: <String, dynamic>{
        'full_name': ?fullName,
        'email': ?email,
        'phone': ?phone,
        'postal_code': ?postalCode,
      },
    );
  }
}
