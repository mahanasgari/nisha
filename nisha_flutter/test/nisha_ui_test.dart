import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:nisha_flutter/shared/widgets/nisha_ui.dart';

void main() {
  testWidgets('empty state shows title and action', (tester) async {
    var tapped = false;
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: NishaAsyncStateView(
            kind: AsyncViewKind.empty,
            title: 'No orders',
            subtitle: 'Try again later',
            actionLabel: 'Retry',
            onAction: () => tapped = true,
          ),
        ),
      ),
    );

    expect(find.text('No orders'), findsOneWidget);
    await tester.tap(find.text('Retry'));
    expect(tapped, isTrue);
  });
}
