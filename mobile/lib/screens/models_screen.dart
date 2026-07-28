import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../core/responsive.dart';
import '../core/theme.dart';
import '../models/wellness_models.dart';
import '../providers/app_state.dart';
import '../services/api_service.dart';
import '../widgets/glass_card.dart';

class ModelsScreen extends StatefulWidget {
  const ModelsScreen({super.key});

  @override
  State<ModelsScreen> createState() => _ModelsScreenState();
}

class _ModelsScreenState extends State<ModelsScreen> {
  late Future<({String bestModel, List<ModelMetricRow> rows})> _reportFuture;
  AllModelsResult? _predictions;
  bool _loadingPredictions = false;
  String? _predictionsError;

  @override
  void initState() {
    super.initState();
    _reportFuture = ApiService().fetchModelReport();
    WidgetsBinding.instance.addPostFrameCallback((_) => _loadPredictions());
  }

  Future<void> _loadPredictions() async {
    final form = context.read<AppState>().latestResult?.form;
    if (form == null || !isFormReadyForApi(form)) return;
    setState(() {
      _loadingPredictions = true;
      _predictionsError = null;
    });
    try {
      final data = await ApiService().fetchAllModelPredictions(form);
      if (mounted) setState(() => _predictions = data);
    } catch (e) {
      if (mounted) setState(() => _predictionsError = e.toString());
    } finally {
      if (mounted) setState(() => _loadingPredictions = false);
    }
  }

  String _pct(double v) => '${(v * 100).toStringAsFixed(1)}%';

  Color _categoryColor(String label) {
    switch (label) {
      case 'Healthy':
        return AppColors.brand;
      case 'Poor':
        return Colors.redAccent;
      default:
        return Colors.amber;
    }
  }

  @override
  Widget build(BuildContext context) {
    final latest = context.watch<AppState>().latestResult;

    return ResponsiveBody(
      child: FutureBuilder(
        future: _reportFuture,
        builder: (context, snap) {
          if (snap.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snap.hasError || !snap.hasData) {
            return Text('Could not load models: ${snap.error}');
          }
          final data = snap.data!;
          final best = data.rows.firstWhere((r) => r.name == data.bestModel, orElse: () => data.rows.first);

          return ListView(
            children: [
              Text('ML Models', style: Theme.of(context).textTheme.headlineSmall),
              Text('Production metrics & your predictions', style: Theme.of(context).textTheme.bodySmall),
              SizedBox(height: context.rh(12)),
              _hero(context, data.bestModel, best),
              SizedBox(height: context.rh(12)),
              _yourPredictions(context, latest),
              SizedBox(height: context.rh(12)),
              GlassCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Test set metrics', style: Theme.of(context).textTheme.titleSmall),
                    SizedBox(height: context.rh(8)),
                    ...data.rows.map((m) => _metricRow(context, m, m.name == data.bestModel)),
                  ],
                ),
              ),
              SizedBox(height: context.rh(24)),
            ],
          );
        },
      ),
    );
  }

  Widget _hero(BuildContext context, String bestName, ModelMetricRow best) {
    return Container(
      padding: EdgeInsets.all(context.rw(14)),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(context.rw(16)),
        border: Border.all(color: AppColors.brand.withValues(alpha: 0.35)),
        gradient: LinearGradient(
          colors: [AppColors.brandDeep.withValues(alpha: 0.2), Theme.of(context).cardColor],
        ),
      ),
      child: Row(
        children: [
          Icon(Icons.emoji_events, color: AppColors.brandLight, size: context.rw(26)),
          SizedBox(width: context.rw(10)),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Production', style: TextStyle(fontSize: context.rs(10), color: AppColors.brand)),
                Text(bestName, style: TextStyle(fontSize: context.rs(18), fontWeight: FontWeight.bold)),
                SizedBox(height: context.rh(6)),
                Text(
                  'F1 ${_pct(best.f1)} · Acc ${_pct(best.accuracy)}',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _yourPredictions(BuildContext context, WellnessResult? latest) {
    if (latest == null || !isFormReadyForApi(latest.form)) {
      return GlassCard(
        child: Column(
          children: [
            Text('Your predictions', style: Theme.of(context).textTheme.titleSmall),
            SizedBox(height: context.rh(6)),
            Text('Complete a wellness check first.', style: Theme.of(context).textTheme.bodySmall),
            SizedBox(height: context.rh(10)),
            FilledButton(onPressed: () => context.go('/home/check'), child: const Text('Wellness Check')),
          ],
        ),
      );
    }

    return GlassCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(child: Text('Your predictions', style: Theme.of(context).textTheme.titleSmall)),
              if (_predictions != null)
                Text(
                  'Final · ${_predictions!.bestModel}',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
            ],
          ),
          if (_predictions != null) ...[
            SizedBox(height: context.rh(4)),
            Wrap(
              spacing: 6,
              children: [
                _chip(context, _predictions!.bestModelPrediction),
                if (_predictions!.productionConfidencePct != null)
                  Text(
                    '${_predictions!.productionConfidencePct!.toStringAsFixed(1)}%',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
              ],
            ),
          ],
          if (_loadingPredictions)
            Padding(
              padding: EdgeInsets.only(top: context.rh(8)),
              child: Text('Running models…', style: Theme.of(context).textTheme.bodySmall),
            ),
          if (_predictionsError != null)
            Padding(
              padding: EdgeInsets.only(top: context.rh(8)),
              child: Text(_predictionsError!, style: const TextStyle(color: Colors.redAccent, fontSize: 12)),
            ),
          if (_predictions != null) ...[
            SizedBox(height: context.rh(8)),
            ..._predictions!.predictions.map((row) {
              return Container(
                margin: EdgeInsets.only(bottom: context.rh(6)),
                padding: EdgeInsets.symmetric(horizontal: context.rw(10), vertical: context.rh(8)),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: Theme.of(context).dividerColor.withValues(alpha: 0.35)),
                  color: row.isBestModel ? AppColors.brand.withValues(alpha: 0.08) : null,
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Text(
                        row.model,
                        style: TextStyle(fontSize: context.rs(13), fontWeight: FontWeight.w600),
                      ),
                    ),
                    if (row.isBestModel)
                      Container(
                        margin: EdgeInsets.only(right: context.rw(6)),
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppColors.brand.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text('LIVE', style: TextStyle(fontSize: context.rs(9), color: AppColors.brand)),
                      ),
                    _chip(context, row.prediction),
                    SizedBox(width: context.rw(6)),
                    if (row.confidencePct != null)
                      Text(
                        '${row.confidencePct!.toStringAsFixed(1)}%',
                        style: TextStyle(fontSize: context.rs(12), color: Theme.of(context).textTheme.bodySmall?.color),
                      ),
                  ],
                ),
              );
            }),
          ],
        ],
      ),
    );
  }

  Widget _chip(BuildContext context, String label) {
    final c = _categoryColor(label);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: c.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(label, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: c)),
    );
  }

  Widget _metricRow(BuildContext context, ModelMetricRow m, bool isBest) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: context.rh(6)),
      child: Row(
        children: [
          Expanded(
            child: Text(
              m.name,
              style: TextStyle(fontWeight: isBest ? FontWeight.w700 : FontWeight.w500, fontSize: context.rs(13)),
            ),
          ),
          Text(_pct(m.f1), style: TextStyle(fontWeight: FontWeight.bold, fontSize: context.rs(13))),
          SizedBox(width: context.rw(8)),
          Text('F1', style: Theme.of(context).textTheme.bodySmall),
          if (isBest) ...[
            SizedBox(width: context.rw(6)),
            Text('BEST', style: TextStyle(fontSize: context.rs(9), color: AppColors.brand, fontWeight: FontWeight.bold)),
          ],
        ],
      ),
    );
  }
}
