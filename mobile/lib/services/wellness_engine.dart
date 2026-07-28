import '../core/form_constants.dart';
import '../models/wellness_models.dart';
import 'recommendation_engine.dart';

const _activityMap = {'Low': 30, 'Moderate': 60, 'High': 90};
const _stressMap = {'Low': 3, 'Medium': 6, 'High': 8};

double _parseActivity(String val) {
  if (_activityMap.containsKey(val)) return _activityMap[val]!.toDouble();
  return double.tryParse(val)?.clamp(30, 90) ?? 60;
}

int _parseStress(String val) {
  if (_stressMap.containsKey(val)) return _stressMap[val]!;
  return int.tryParse(val)?.clamp(1, 10) ?? 5;
}

WellnessResult analyzeWellnessLocal(WellnessFormData form) {
  final sleepDuration = double.tryParse(form.sleepDuration) ?? 7;
  final sleepQuality = double.tryParse(form.sleepQuality) ?? 7;
  final stressLevel = _parseStress(form.stressLevel);
  final activityLevel = _parseActivity(form.physicalActivityLevel);
  final dailySteps = int.tryParse(form.dailySteps) ?? 6000;

  final durationScore = sleepDuration < 5
      ? 30.0
      : sleepDuration < 7
          ? 55.0
          : sleepDuration <= 9
              ? 90.0
              : 70.0;
  final qualityScore = (sleepQuality / 10) * 100;
  final sleepScore = ((durationScore * 0.5 + qualityScore * 0.5) * 10).round() / 10;

  final palNorm = ((activityLevel.clamp(30, 90) - 30) / 60) * 100;
  final stepsNorm = (dailySteps / 10000 * 100).clamp(0, 100);
  final activityScore = ((palNorm * 0.5 + stepsNorm * 0.5) * 10).round() / 10;

  final stressIndex = stressLevel * 10.0;
  final fatigueBurden = ((100 - sleepScore) * 0.4 + stressIndex * 0.35 + (100 - activityScore) * 0.25)
      .clamp(0, 100);
  final fatigueRounded = (fatigueBurden * 10).round() / 10;
  final energyScore = ((100 - fatigueRounded) * 10).round() / 10;

  final wellnessScore = (sleepScore * 0.38 +
          activityScore * 0.32 +
          (100 - stressIndex) * 0.2 +
          (100 - fatigueRounded) * 0.10)
      .clamp(0, 100)
      .round();

  var category = 'Average';
  if (wellnessScore >= 75) {
    category = 'Healthy';
  } else if (wellnessScore < 50) {
    category = 'Poor';
  }

  final confidence = (72 + (wellnessScore - 62).abs() / 2).clamp(0, 96).round();

  var clusterLabel = 'Balanced Lifestyle Group';
  if (stressLevel >= 7) {
    clusterLabel = 'High Stress User';
  } else if (wellnessScore >= 70 && sleepDuration >= 7) {
    clusterLabel = 'Healthy Lifestyle User';
  } else if (dailySteps < 5500) {
    clusterLabel = 'Low Activity User';
  }

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
    wellnessScore: wellnessScore,
    category: category,
    confidence: confidence,
    scores: ScoreBreakdown(
      sleep: sleepScore,
      activity: activityScore,
      stress: stressIndex,
      fatigue: energyScore,
    ),
    cluster: ClusterInfo(label: clusterLabel),
    form: form.copy(),
    recommendations: recs.isNotEmpty ? recs : FormConstants.defaultRecommendations,
    analyzedAt: DateTime.now(),
  );
}
