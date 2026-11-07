import 'package:flutter_test/flutter_test.dart';
import 'package:bhara_mobile/main.dart';

void main() {
  testWidgets('Bhara app smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const BharaApp());
  });
}
