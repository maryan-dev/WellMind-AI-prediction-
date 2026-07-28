import 'dart:convert';
import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;

import '../core/form_constants.dart';
import '../models/wellness_models.dart';
import 'recommendation_engine.dart';

class ApiConfig {
  static String get baseUrl {
    const fromEnv = String.fromEnvironment('API_BASE');
    if (fromEnv.isNotEmpty) return fromEnv;
    if (kIsWeb) return 'http://127.0.0.1:8000';
    if (!kIsWeb && Platform.isAndroid) return 'http://10.0.2.2:8000';
    return 'http://127.0.0.1:8000';
  }
}

class ApiService {
  ApiService({http.Client? client}) : _client = client ?? http.Client();

  final http.Client _client;

  int _normalizeConfidencePct(num? value) {
    if (value == null) return 82;
    var pct = value.toDouble();
    if (pct <= 1) pct *= 100;
    return pct.round().clamp(54, 93);
  }

  Future<AllModelsResult> fetchAllModelPredictions(WellnessFormData form) async {
    final body = buildApiPayload(form);
    if (body == null) {
      throw Exception('Incomplete wellness data — run a full wellness check.');
    }
    final res = await _client
        .post(
          Uri.parse('${ApiConfig.baseUrl}/predict/all-models'),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode(body),
        )
        .timeout(const Duration(seconds: 45));
    if (res.statusCode != 200) {
      throw Exception(_errorMessage(res));
    }
    return AllModelsResult.fromJson(jsonDecode(res.body) as Map<String, dynamic>);
  }

  Future<WellnessResult> predict(WellnessFormData form) async {
    final body = buildApiPayload(form);
    if (body == null) {
      throw Exception('Invalid form — check age, sleep, and daily steps.');
    }
    final res = await _client
        .post(
          Uri.parse('${ApiConfig.baseUrl}/predict'),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode(body),
        )
        .timeout(const Duration(seconds: 20));

    if (res.statusCode != 200) {
      throw Exception(_errorMessage(res));
    }
    final data = jsonDecode(res.body) as Map<String, dynamic>;
    return _mapPredict(data, form);
  }

  String _errorMessage(http.Response res) {
    if (res.statusCode == 422) {
      try {
        final decoded = jsonDecode(res.body);
        if (decoded is Map && decoded['detail'] != null) {
          return 'Invalid data — please review your wellness check.';
        }
      } catch (_) {}
      return 'Invalid wellness data (422). Complete all fields and try again.';
    }
    return 'API ${res.statusCode}';
  }

  WellnessResult _mapPredict(Map<String, dynamic> data, WellnessFormData form) {
    final scores = data['scores'] as Map<String, dynamic>? ?? {};
    final recItems = buildFeatureRecommendations(
      sleepDuration: form.sleepDuration,
      sleepQuality: form.sleepQuality,
      stressLevel: form.stressLevel,
      physicalActivityLevel: form.physicalActivityLevel,
      dailySteps: form.dailySteps,
      bmiCategory: form.bmiCategory,
      sleepDisorder: form.sleepDisorder,
    );
    final recs = recItems.map((r) => '${toneIcon(r.tone)} ${r.text}').toList();
    return WellnessResult(
      wellnessScore: (data['wellness_score'] as num?)?.round() ?? 0,
      category: data['lifestyle_category'] as String? ?? 'Average',
      confidence: _normalizeConfidencePct(data['confidence']),
      scores: ScoreBreakdown(
        sleep: (scores['sleep_score'] as num?)?.toDouble() ?? 0,
        activity: (scores['activity_score'] as num?)?.toDouble() ?? 0,
        stress: (scores['stress_index'] as num?)?.toDouble() ?? 0,
        fatigue: (scores['energy_score'] as num?)?.toDouble() ??
            (100 - ((scores['fatigue_score'] as num?)?.toDouble() ?? 0)),
      ),
      cluster: ClusterInfo(
        label: data['cluster_name'] as String? ?? 'Lifestyle Group',
      ),
      form: form.copy(),
      recommendations: recs.isNotEmpty ? recs : FormConstants.defaultRecommendations,
      analyzedAt: DateTime.now(),
      modelName: data['model_name'] as String?,
    );
  }

  Future<({String bestModel, List<ModelMetricRow> rows})> fetchModelReport() async {
    try {
      final res = await _client
          .get(Uri.parse('${ApiConfig.baseUrl}/models/comparison'))
          .timeout(const Duration(seconds: 15));
      if (res.statusCode == 200) {
        return _parseReport(jsonDecode(res.body) as Map<String, dynamic>);
      }
    } catch (_) {}
    final raw = await rootBundle.loadString('assets/data/best_model_report.json');
    return _parseReport(jsonDecode(raw) as Map<String, dynamic>);
  }

  ({String bestModel, List<ModelMetricRow> rows}) _parseReport(Map<String, dynamic> json) {
    final best = json['best_model'] as String? ?? 'XGBoost';
    final list = (json['comparison'] as List?) ?? [];
    final rows = list.map((e) => ModelMetricRow.fromJson(e as Map<String, dynamic>)).toList();
    return (bestModel: best, rows: rows);
  }
}
