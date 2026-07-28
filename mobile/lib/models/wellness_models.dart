const _sleepDisorderToApi = {
  'No': 'Healthy',
  'Insomnia': 'Insomnia',
  'Sleep Apnea': 'Sleep Apnea',
};

const _bmiToApi = {
  'Underweight': 'Normal Weight',
  'Normal': 'Normal Weight',
  'Overweight': 'Overweight',
  'Obese': 'Obese',
};

Map<String, dynamic>? buildApiPayload(WellnessFormData form) {
  final age = int.tryParse(form.age.trim());
  if (age == null || age < 1 || age > 120) return null;

  if (form.gender.trim().isEmpty || form.occupation.trim().isEmpty) return null;

  final sleepDuration = double.tryParse(form.sleepDuration.trim());
  if (sleepDuration == null || sleepDuration < 0 || sleepDuration > 24) return null;

  final sleepQuality = int.tryParse(form.sleepQuality.trim());
  if (sleepQuality == null || sleepQuality < 1 || sleepQuality > 10) return null;

  final dailySteps = int.tryParse(form.dailySteps.trim());
  if (dailySteps == null || dailySteps < 0) return null;

  final disorder = form.sleepDisorder.trim();
  final bmi = form.bmiCategory.trim();

  return {
    'age': age,
    'gender': form.gender.trim(),
    'occupation': form.occupation.trim(),
    'sleep_duration': sleepDuration,
    'sleep_quality': sleepQuality,
    'stress_level': form.stressLevel.trim().isEmpty ? 'Medium' : form.stressLevel.trim(),
    'physical_activity_level':
        form.physicalActivityLevel.trim().isEmpty ? 'Moderate' : form.physicalActivityLevel.trim(),
    'daily_steps': dailySteps,
    'bmi_category': _bmiToApi[bmi] ?? (bmi.isEmpty ? 'Normal Weight' : bmi),
    'sleep_disorder': _sleepDisorderToApi[disorder] ?? disorder,
  };
}

bool isFormReadyForApi(WellnessFormData form) => buildApiPayload(form) != null;

class WellnessFormData {
  WellnessFormData({
    this.age = '',
    this.gender = '',
    this.occupation = '',
    this.sleepDuration = '',
    this.sleepQuality = '',
    this.sleepDisorder = 'No',
    this.physicalActivityLevel = 'Moderate',
    this.dailySteps = '',
    this.stressLevel = 'Medium',
    this.bmiCategory = 'Normal',
  });

  String age;
  String gender;
  String occupation;
  String sleepDuration;
  String sleepQuality;
  String sleepDisorder;
  String physicalActivityLevel;
  String dailySteps;
  String stressLevel;
  String bmiCategory;

  Map<String, dynamic> toApiJson() {
    final payload = buildApiPayload(this);
    if (payload == null) {
      throw StateError('Complete all wellness fields before calling the API.');
    }
    return payload;
  }

  bool get isReadyForApi => isFormReadyForApi(this);

  WellnessFormData copy() => WellnessFormData(
        age: age,
        gender: gender,
        occupation: occupation,
        sleepDuration: sleepDuration,
        sleepQuality: sleepQuality,
        sleepDisorder: sleepDisorder,
        physicalActivityLevel: physicalActivityLevel,
        dailySteps: dailySteps,
        stressLevel: stressLevel,
        bmiCategory: bmiCategory,
      );
}

class ScoreBreakdown {
  ScoreBreakdown({
    required this.sleep,
    required this.activity,
    required this.stress,
    required this.fatigue,
  });

  final double sleep;
  final double activity;
  final double stress;
  final double fatigue;
}

class ClusterInfo {
  ClusterInfo({
    required this.label,
    this.averages = const {
      'sleep': 7.0,
      'activity': 60.0,
      'stress': 5.5,
      'steps': 6500.0,
    },
  });

  final String label;
  final Map<String, double> averages;
}

class WellnessResult {
  WellnessResult({
    required this.wellnessScore,
    required this.category,
    required this.confidence,
    required this.scores,
    required this.cluster,
    required this.form,
    required this.recommendations,
    this.analyzedAt,
    this.modelName,
  });

  final int wellnessScore;
  final String category;
  final int confidence;
  final ScoreBreakdown scores;
  final ClusterInfo cluster;
  final WellnessFormData form;
  final List<String> recommendations;
  final DateTime? analyzedAt;
  final String? modelName;
}

class HistoryEntry {
  HistoryEntry({
    required this.id,
    required this.dateLabel,
    required this.category,
    required this.score,
    required this.summary,
  });

  final String id;
  final String dateLabel;
  final String category;
  final int score;
  final String summary;
}

class ModelMetricRow {
  ModelMetricRow({
    required this.name,
    required this.accuracy,
    required this.precision,
    required this.recall,
    required this.f1,
  });

  final String name;
  final double accuracy;
  final double precision;
  final double recall;
  final double f1;

  static ModelMetricRow fromJson(Map<String, dynamic> row) => ModelMetricRow(
        name: row['Model'] as String? ?? '',
        accuracy: (row['Accuracy'] as num?)?.toDouble() ?? 0,
        precision: (row['Precision (macro)'] as num?)?.toDouble() ?? 0,
        recall: (row['Recall (macro)'] as num?)?.toDouble() ?? 0,
        f1: (row['Macro F1'] as num?)?.toDouble() ?? 0,
      );
}

class ModelPredictionRow {
  ModelPredictionRow({
    required this.model,
    required this.prediction,
    this.confidencePct,
    this.isBestModel = false,
  });

  final String model;
  final String prediction;
  final double? confidencePct;
  final bool isBestModel;

  static ModelPredictionRow fromJson(Map<String, dynamic> row) => ModelPredictionRow(
        model: row['model'] as String? ?? '',
        prediction: row['prediction'] as String? ?? '',
        confidencePct: (row['confidence_pct'] as num?)?.toDouble(),
        isBestModel: row['is_best_model'] as bool? ?? false,
      );
}

class AllModelsResult {
  AllModelsResult({
    required this.bestModel,
    required this.bestModelPrediction,
    required this.predictions,
    this.productionConfidencePct,
  });

  final String bestModel;
  final String bestModelPrediction;
  final List<ModelPredictionRow> predictions;
  final double? productionConfidencePct;

  factory AllModelsResult.fromJson(Map<String, dynamic> json) {
    final list = (json['predictions'] as List?) ?? [];
    return AllModelsResult(
      bestModel: json['best_model'] as String? ?? 'XGBoost',
      bestModelPrediction: json['best_model_prediction'] as String? ?? '',
      productionConfidencePct: (json['production_confidence_pct'] as num?)?.toDouble(),
      predictions: list.map((e) => ModelPredictionRow.fromJson(e as Map<String, dynamic>)).toList(),
    );
  }
}
