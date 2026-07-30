import 'package:flutter_test/flutter_test.dart';

import 'package:nisha_flutter/shared/widgets/money_input.dart';

void main() {
  group('MoneyInputFormatter', () {
    test('formats thousand separators', () {
      expect(MoneyInputFormatter.formatDigits('1000'), '1,000');
      expect(MoneyInputFormatter.formatDigits('1234567'), '1,234,567');
    });

    test('parses formatted money', () {
      expect(MoneyInputFormatter.parseToInt('1,234,567'), 1234567);
      expect(MoneyInputFormatter.parseToInt(''), isNull);
    });
  });
}
