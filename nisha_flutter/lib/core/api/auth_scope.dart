enum AuthScope {
  /// No Authorization header.
  none,

  /// Seller/admin user JWT.
  seller,

  /// Customer JWT.
  customer,

  /// Infer from request path.
  auto,
}

class AuthScopeKey {
  static const String extra = 'nisha_auth_scope';
}
