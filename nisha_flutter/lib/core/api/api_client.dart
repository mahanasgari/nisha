import 'dart:async';

import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../config/app_config.dart';
import '../observability/app_observability.dart';
import '../session/token_store.dart';
import 'api_exception.dart';
import 'auth_scope.dart';

final apiClientProvider = Provider<ApiClient>((ref) {
  final client = ApiClient(
    tokenStore: ref.watch(tokenStoreProvider),
    onSellerSessionInvalid: () {
      // Wired from SessionController after providers exist; noop-safe.
    },
  );
  ref.onDispose(client.close);
  return client;
});

/// Compatibility Dio-backed client preserving the previous parser-based API.
class ApiClient {
  ApiClient({
    required this._tokenStore,
    this._onSellerSessionInvalid,
    Dio? dio,
  }) : _dio = dio ??
            Dio(
              BaseOptions(
                baseUrl: AppConfig.apiUrl,
                connectTimeout: const Duration(seconds: 20),
                receiveTimeout: const Duration(seconds: 30),
                sendTimeout: const Duration(seconds: 30),
                headers: const <String, dynamic>{
                  'Accept': 'application/json',
                },
              ),
            ) {
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: _onRequest,
        onError: _onError,
      ),
    );
  }

  final Dio _dio;
  final TokenStore _tokenStore;
  void Function()? _onSellerSessionInvalid;
  Completer<bool>? _refreshCompleter;

  void bindSessionInvalidHandler(void Function() handler) {
    _onSellerSessionInvalid = handler;
  }

  void close() => _dio.close(force: true);

  Future<T> get<T>(
    String path,
    T Function(Object? data) parser, {
    Map<String, dynamic>? queryParameters,
    Map<String, String>? headers,
    AuthScope scope = AuthScope.auto,
    CancelToken? cancelToken,
  }) {
    return _request<T>(
      'GET',
      path,
      parser,
      queryParameters: queryParameters,
      headers: headers,
      scope: scope,
      cancelToken: cancelToken,
    );
  }

  Future<T> post<T>(
    String path,
    T Function(Object? data) parser, {
    Object? data,
    Map<String, dynamic>? queryParameters,
    Map<String, String>? headers,
    AuthScope scope = AuthScope.auto,
    CancelToken? cancelToken,
  }) {
    return _request<T>(
      'POST',
      path,
      parser,
      data: data,
      queryParameters: queryParameters,
      headers: headers,
      scope: scope,
      cancelToken: cancelToken,
    );
  }

  Future<T> patch<T>(
    String path,
    T Function(Object? data) parser, {
    Object? data,
    Map<String, dynamic>? queryParameters,
    Map<String, String>? headers,
    AuthScope scope = AuthScope.auto,
    CancelToken? cancelToken,
  }) {
    return _request<T>(
      'PATCH',
      path,
      parser,
      data: data,
      queryParameters: queryParameters,
      headers: headers,
      scope: scope,
      cancelToken: cancelToken,
    );
  }

  Future<T> put<T>(
    String path,
    T Function(Object? data) parser, {
    Object? data,
    Map<String, dynamic>? queryParameters,
    Map<String, String>? headers,
    AuthScope scope = AuthScope.auto,
    CancelToken? cancelToken,
  }) {
    return _request<T>(
      'PUT',
      path,
      parser,
      data: data,
      queryParameters: queryParameters,
      headers: headers,
      scope: scope,
      cancelToken: cancelToken,
    );
  }

  Future<T> delete<T>(
    String path,
    T Function(Object? data) parser, {
    Object? data,
    Map<String, dynamic>? queryParameters,
    Map<String, String>? headers,
    AuthScope scope = AuthScope.auto,
    CancelToken? cancelToken,
  }) {
    return _request<T>(
      'DELETE',
      path,
      parser,
      data: data,
      queryParameters: queryParameters,
      headers: headers,
      scope: scope,
      cancelToken: cancelToken,
    );
  }

  Future<T> uploadMultipart<T>(
    String path,
    T Function(Object? data) parser, {
    required FormData formData,
    AuthScope scope = AuthScope.auto,
    void Function(int sent, int total)? onSendProgress,
    CancelToken? cancelToken,
  }) async {
    try {
      final response = await _dio.post<dynamic>(
        path,
        data: formData,
        cancelToken: cancelToken,
        onSendProgress: onSendProgress,
        options: Options(
          extra: <String, dynamic>{AuthScopeKey.extra: scope},
          contentType: 'multipart/form-data',
        ),
      );
      return parser(response.data);
    } on DioException catch (error) {
      throw _mapDioException(error);
    }
  }

  Future<T> _request<T>(
    String method,
    String path,
    T Function(Object? data) parser, {
    Object? data,
    Map<String, dynamic>? queryParameters,
    Map<String, String>? headers,
    AuthScope scope = AuthScope.auto,
    CancelToken? cancelToken,
  }) async {
    try {
      final response = await _dio.request<dynamic>(
        path,
        data: data,
        queryParameters: queryParameters,
        cancelToken: cancelToken,
        options: Options(
          method: method,
          headers: headers,
          extra: <String, dynamic>{AuthScopeKey.extra: scope},
          contentType: data == null ? null : Headers.jsonContentType,
        ),
      );
      return parser(response.data);
    } on DioException catch (error) {
      throw _mapDioException(error);
    }
  }

  Future<void> _onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final scope = _resolveScope(options);
    if (scope == AuthScope.seller) {
      final token = await _tokenStore.readSellerAccessToken();
      if (token != null && token.isNotEmpty) {
        options.headers['Authorization'] = 'Bearer $token';
      }
    } else if (scope == AuthScope.customer) {
      final token = await _tokenStore.readCustomerAccessToken();
      if (token != null && token.isNotEmpty) {
        options.headers['Authorization'] = 'Bearer $token';
      }
    }
    handler.next(options);
  }

  Future<void> _onError(
    DioException error,
    ErrorInterceptorHandler handler,
  ) async {
    final status = error.response?.statusCode;
    final options = error.requestOptions;
    final alreadyRetried = options.extra['nisha_retried'] == true;
    final scope = _resolveScope(options);

    if (status == 401 &&
        scope == AuthScope.seller &&
        !alreadyRetried &&
        !options.path.contains('/auth/refresh') &&
        !options.path.contains('/auth/login')) {
      final refreshed = await _refreshSellerToken();
      if (refreshed) {
        final token = await _tokenStore.readSellerAccessToken();
        options.headers['Authorization'] = 'Bearer $token';
        options.extra['nisha_retried'] = true;
        try {
          final response = await _dio.fetch<dynamic>(options);
          handler.resolve(response);
          return;
        } on DioException catch (retryError) {
          handler.next(retryError);
          return;
        }
      } else {
        _onSellerSessionInvalid?.call();
      }
    }

    if (status == 401 && scope == AuthScope.customer) {
      await _tokenStore.clearCustomer();
    }

    handler.next(error);
  }

  Future<bool> _refreshSellerToken() async {
    if (_refreshCompleter != null) {
      return _refreshCompleter!.future;
    }
    final completer = Completer<bool>();
    _refreshCompleter = completer;
    try {
      final refresh = await _tokenStore.readSellerRefreshToken();
      if (refresh == null || refresh.isEmpty) {
        completer.complete(false);
        return false;
      }
      final response = await _dio.post<dynamic>(
        '/auth/refresh',
        data: <String, dynamic>{'refresh_token': refresh},
        options: Options(
          extra: <String, dynamic>{AuthScopeKey.extra: AuthScope.none},
        ),
      );
      final data = response.data;
      if (data is! Map) {
        completer.complete(false);
        return false;
      }
      final map = Map<String, dynamic>.from(data);
      final access = (map['access_token'] ?? '') as String;
      final nextRefresh = (map['refresh_token'] ?? refresh) as String;
      if (access.isEmpty) {
        completer.complete(false);
        return false;
      }
      await _tokenStore.updateSellerTokens(
        accessToken: access,
        refreshToken: nextRefresh,
      );
      completer.complete(true);
      return true;
    } catch (error, stack) {
      AppObservability.recordError(
        error,
        stack,
        context: 'seller_token_refresh',
      );
      completer.complete(false);
      return false;
    } finally {
      _refreshCompleter = null;
    }
  }

  AuthScope _resolveScope(RequestOptions options) {
    final raw = options.extra[AuthScopeKey.extra];
    if (raw is AuthScope && raw != AuthScope.auto) {
      return raw;
    }
    final path = options.path;
    if (path.startsWith('/seller') ||
        path.startsWith('/admin') ||
        path == '/auth/me' ||
        path.startsWith('/ws/tickets/seller')) {
      return AuthScope.seller;
    }
    if (path.startsWith('/customer') &&
        !path.startsWith('/customer/login') &&
        !path.startsWith('/customer/register') &&
        !path.startsWith('/customer/password-recovery')) {
      return AuthScope.customer;
    }
    if (path.startsWith('/ws/tickets/customer')) {
      return AuthScope.customer;
    }
    if (path.startsWith('/public/uploads/') &&
        !path.startsWith('/public/uploads/guest')) {
      // Prefer active seller token, else customer — resolved at request time
      // by checking tokens; default seller then customer.
      return AuthScope.seller;
    }
    return AuthScope.none;
  }

  ApiException _mapDioException(DioException error) {
    if (error.type == DioExceptionType.cancel) {
      return const ApiException(message: 'Request cancelled');
    }
    if (error.type == DioExceptionType.connectionError ||
        error.type == DioExceptionType.connectionTimeout) {
      AppObservability.recordError(
        error,
        error.stackTrace,
        context: 'api_connection',
      );
      return const ApiException(message: 'Network unavailable');
    }
    final status = error.response?.statusCode;
    final data = error.response?.data;
    final message = _extractErrorMessage(data) ??
        error.message ??
        'Request failed.';
    AppObservability.recordError(
      error,
      error.stackTrace,
      context: 'api_failure_$status',
    );
    return ApiException(
      message: message,
      statusCode: status,
      payload: data,
    );
  }

  String? _extractErrorMessage(Object? data) {
    if (data is Map) {
      final detail = data['detail'];
      final message = _extractValue(detail) ?? _extractValue(data['message']);
      if (message != null) {
        return message;
      }
    }
    if (data is String && data.isNotEmpty) {
      return data;
    }
    return null;
  }

  String? _extractValue(Object? value) {
    if (value == null) {
      return null;
    }
    if (value is String) {
      return value;
    }
    if (value is List) {
      return value.map((item) => item.toString()).join('\n');
    }
    if (value is Map) {
      return value.values.map((item) => item.toString()).join('\n');
    }
    return value.toString();
  }
}
