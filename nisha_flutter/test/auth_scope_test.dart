import 'package:flutter_test/flutter_test.dart';
import 'package:nisha_flutter/core/api/auth_scope.dart';

void main() {
  test('AuthScopeKey is stable for Dio extras', () {
    expect(AuthScopeKey.extra, 'nisha_auth_scope');
    expect(AuthScope.values.contains(AuthScope.seller), isTrue);
  });
}
