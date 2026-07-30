import 'dart:convert';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../../features/auth/models/auth_models.dart';
import 'app_session.dart';
import 'token_store.dart';

final sessionStorageProvider = Provider<SessionStorage>((ref) {
  return SessionStorage(const FlutterSecureStorage());
});

class SessionStorage {
  const SessionStorage(this._storage);

  final FlutterSecureStorage _storage;

  Future<SellerSession?> readSellerSession() async {
    final token = await _storage.read(key: TokenStore.sellerTokenKey);
    final rawUser = await _storage.read(key: TokenStore.sellerUserKey);
    if (token == null || rawUser == null) {
      return null;
    }
    return SellerSession(
      token: token,
      user: SellerUser.fromJson(
        jsonDecode(rawUser) as Map<String, dynamic>,
      ),
    );
  }

  Future<CustomerSession?> readCustomerSession() async {
    final token = await _storage.read(key: TokenStore.customerTokenKey);
    final rawUser = await _storage.read(key: TokenStore.customerUserKey);
    if (token == null || rawUser == null) {
      return null;
    }
    return CustomerSession(
      token: token,
      customer: CustomerUser.fromJson(
        jsonDecode(rawUser) as Map<String, dynamic>,
      ),
    );
  }

  Future<void> saveSellerSession(SellerTokenResponse response) async {
    await _storage.write(
      key: TokenStore.sellerTokenKey,
      value: response.accessToken,
    );
    if (response.refreshToken != null && response.refreshToken!.isNotEmpty) {
      await _storage.write(
        key: TokenStore.sellerRefreshKey,
        value: response.refreshToken,
      );
    }
    await _storage.write(
      key: TokenStore.sellerUserKey,
      value: jsonEncode(response.user.toJson()),
    );
    // Dual-session policy: clear opposite realm on seller login.
    await _storage.delete(key: TokenStore.customerTokenKey);
    await _storage.delete(key: TokenStore.customerUserKey);
  }

  Future<void> saveCustomerSession(CustomerTokenResponse response) async {
    await _storage.write(
      key: TokenStore.customerTokenKey,
      value: response.accessToken,
    );
    await _storage.write(
      key: TokenStore.customerUserKey,
      value: jsonEncode(response.customer.toJson()),
    );
    await _storage.delete(key: TokenStore.sellerTokenKey);
    await _storage.delete(key: TokenStore.sellerRefreshKey);
    await _storage.delete(key: TokenStore.sellerUserKey);
  }

  Future<void> clearAll() async {
    await _storage.delete(key: TokenStore.sellerTokenKey);
    await _storage.delete(key: TokenStore.sellerRefreshKey);
    await _storage.delete(key: TokenStore.sellerUserKey);
    await _storage.delete(key: TokenStore.customerTokenKey);
    await _storage.delete(key: TokenStore.customerUserKey);
  }
}
