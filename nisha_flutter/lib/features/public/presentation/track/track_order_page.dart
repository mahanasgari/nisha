import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';

import '../../../../core/api/api_exception.dart';
import '../../../../core/theme/nisha_tokens.dart';
import '../../../../shared/extensions/build_context_x.dart';
import '../../../../shared/widgets/nisha_ui.dart';
import '../../../../shared/widgets/public_shell.dart';
import '../../data/public_repository.dart';
import '../../models/public_models.dart';

class TrackOrderPage extends ConsumerStatefulWidget {
  const TrackOrderPage({super.key});

  @override
  ConsumerState<TrackOrderPage> createState() => _TrackOrderPageState();
}

class _TrackOrderPageState extends ConsumerState<TrackOrderPage> {
  final _invoice = TextEditingController();
  final _password = TextEditingController();
  bool _loading = false;
  String? _error;
  OrderTrackResponse? _result;

  @override
  void dispose() {
    _invoice.dispose();
    _password.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return PublicShell(
      child: ListView(
        padding: const EdgeInsets.all(NishaSpace.lg),
        children: [
          Text(
            context.l10n.trackOrder,
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.w800,
                ),
          ),
          const SizedBox(height: NishaSpace.xs),
          Text(context.l10n.trackOrderSubtitle),
          const SizedBox(height: NishaSpace.lg),
          TextField(
            controller: _invoice,
            decoration: InputDecoration(labelText: context.l10n.invoiceCode),
          ),
          const SizedBox(height: NishaSpace.sm),
          TextField(
            controller: _password,
            decoration: InputDecoration(labelText: context.l10n.password),
            obscureText: true,
          ),
          if (_error != null) ...[
            const SizedBox(height: NishaSpace.sm),
            Text(
              _error!,
              style: TextStyle(color: Theme.of(context).colorScheme.error),
            ),
          ],
          const SizedBox(height: NishaSpace.md),
          FilledButton(
            onPressed: _loading ? null : _track,
            child: _loading
                ? const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : Text(context.l10n.trackOrder),
          ),
          if (_result != null) ...[
            const SizedBox(height: NishaSpace.xl),
            NishaSurfaceCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    _result!.invoiceCode,
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.w700,
                        ),
                  ),
                  Text('${_result!.status} · ${_result!.totalAmount}'),
                  Text(_result!.buyerName),
                  const SizedBox(height: NishaSpace.md),
                  OutlinedButton.icon(
                    onPressed: _uploadProof,
                    icon: const Icon(Icons.upload_file_outlined),
                    label: Text(context.l10n.paymentMethods),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  Future<void> _track() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final result = await ref.read(publicRepositoryProvider).trackOrder(
            invoiceCode: _invoice.text.trim(),
            invoiceEditPassword: _password.text.trim(),
          );
      setState(() => _result = result);
    } on ApiException catch (error) {
      setState(() {
        _result = null;
        _error = error.message;
      });
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _uploadProof() async {
    final picker = ImagePicker();
    final file = await picker.pickImage(source: ImageSource.gallery);
    if (file == null) return;
    try {
      await ref.read(publicRepositoryProvider).uploadPaymentProof(
            invoiceCode: _invoice.text.trim(),
            invoiceEditPassword: _password.text.trim(),
            filePath: file.path,
            fileName: file.name,
          );
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(context.l10n.retry)),
      );
      await _track();
    } on ApiException catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(error.message)),
      );
    }
  }
}
