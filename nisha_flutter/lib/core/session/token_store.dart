import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

final tokenStoreProvider = Provider<TokenStore>((ref) {
  return TokenStore(const FlutterSecureStorage());
});

/// Low-level secure token accessors used by Dio interceptors.
class TokenStore {
  TokenStore(this._storage);

  static const String sellerTokenKey = 'nisha_access_token';
  static const String sellerRefreshKey = 'nisha_refresh_token';
  static const String sellerUserKey = 'nisha_user';
  static const String customerTokenKey = 'nisha_customer_token';
  static const String customerUserKey = 'nisha_customer';

  final FlutterSecureStorage _storage;

  Future<String?> readSellerAccessToken() => _storage.read(key: sellerTokenKey);

  Future<String?> readSellerRefreshToken() =>
      _storage.read(key: sellerRefreshKey);

  Future<String?> readCustomerAccessToken() =>
      _storage.read(key: customerTokenKey);

  Future<void> updateSellerTokens({
    required String accessToken,
    required String refreshToken,
  }) async {
    await _storage.write(key: sellerTokenKey, value: accessToken);
    await _storage.write(key: sellerRefreshKey, value: refreshToken);
  }

  Future<void> clearCustomer() async {
    await _storage.delete(key: customerTokenKey);
    await _storage.delete(key: customerUserKey);
  }

  Future<void> clearSeller() async {
    await _storage.delete(key: sellerTokenKey);
    await _storage.delete(key: sellerRefreshKey);
    await _storage.delete(key: sellerUserKey);
  }

  Future<void> clearAll() async {
    await clearSeller();
    await clearCustomer();
  }
}
