import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'app.dart';
import 'core/observability/app_observability.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  FlutterError.onError = (details) {
    FlutterError.presentError(details);
    AppObservability.recordError(
      details.exception,
      details.stack,
      context: 'flutter_framework',
    );
  };

  PlatformDispatcher.instance.onError = (error, stack) {
    AppObservability.recordError(error, stack, context: 'platform');
    return true;
  };

  ErrorWidget.builder = (details) {
    AppObservability.recordError(
      details.exception,
      details.stack,
      context: 'error_widget',
    );
    return const Material(
      child: Center(child: Text('Something went wrong')),
    );
  };

  runApp(const ProviderScope(child: NishaApp()));
}
