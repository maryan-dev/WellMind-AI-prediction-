class RecItem {
  RecItem({required this.id, required this.category, required this.tone, required this.text});

  final String id;
  final String category;
  final String tone;
  final String text;
}

const _stressMap = {'Low': 3, 'Medium': 6, 'High': 8};
const _activityMap = {'Low': 30, 'Moderate': 60, 'High': 90};

int _parseStress(String? val) {
  if (val != null && _stressMap.containsKey(val)) return _stressMap[val]!;
  return int.tryParse(val ?? '')?.clamp(1, 10) ?? 5;
}

String _activityLabel(String? val) {
  if (val != null && _activityMap.containsKey(val)) return val;
  final n = double.tryParse(val ?? '');
  if (n == null) return 'Moderate';
  if (n <= 40) return 'Low';
  if (n >= 75) return 'High';
  return 'Moderate';
}

String _bmi(String? ui) {
  final s = (ui ?? 'Normal').toLowerCase();
  if (s.contains('under')) return 'Underweight';
  if (s.contains('obese')) return 'Obese';
  if (s.contains('over')) return 'Overweight';
  return 'Normal';
}

String _disorder(String? ui) {
  final s = (ui ?? 'No').toLowerCase();
  if (s.contains('insomnia')) return 'Insomnia';
  if (s.contains('apnea')) return 'Sleep Apnea';
  if (s == 'no' || s.contains('healthy')) return 'None';
  return 'None';
}

List<RecItem> buildFeatureRecommendations({
  required String sleepDuration,
  required String sleepQuality,
  required String stressLevel,
  required String physicalActivityLevel,
  required String dailySteps,
  required String bmiCategory,
  required String sleepDisorder,
}) {
  final sleep = double.tryParse(sleepDuration) ?? 7;
  final stress = _parseStress(stressLevel);
  final steps = int.tryParse(dailySteps) ?? 0;
  final activity = _activityLabel(physicalActivityLevel);
  final bmi = _bmi(bmiCategory);
  final disorder = _disorder(sleepDisorder);
  final quality = int.tryParse(sleepQuality) ?? 7;

  final out = <RecItem>[];
  void push(String cat, String tone, String text) {
    out.add(RecItem(id: '${cat}-${out.length}', category: cat, tone: tone, text: text));
  }

  if (sleep < 5) {
    for (final t in [
      'Sleep is critically low.',
      'Increase your sleep by 2–3 hours.',
      'Avoid screen time before bed.',
      'Try sleeping before 10:30 PM.',
    ]) {
      push('Sleep Duration', 'warning', t);
    }
  } else if (sleep < 7) {
    for (final t in [
      'Increase sleep by about 1 hour.',
      'Maintain a consistent bedtime.',
      'Reduce caffeine in the evening.',
    ]) {
      push('Sleep Duration', 'warning', t);
    }
  } else if (sleep <= 9) {
    for (final t in [
      'Excellent sleep duration.',
      'Keep your current routine.',
      'Continue maintaining good sleep habits.',
    ]) {
      push('Sleep Duration', 'positive', t);
    }
  } else {
    push('Sleep Duration', 'neutral', 'You are sleeping longer than average.');
    push('Sleep Duration', 'neutral', 'If you still feel tired, consider consulting a healthcare professional.');
  }

  if (quality <= 5) {
    push('Sleep Quality', 'warning', 'Your sleep quality score is low — darken the room and limit late caffeine.');
  } else if (quality >= 8) {
    push('Sleep Quality', 'positive', 'Your sleep quality is strong — keep your wind-down routine.');
  }

  if (stress <= 3) {
    push('Stress Level', 'positive', 'Great job managing stress.');
    push('Stress Level', 'positive', 'Continue your current routine.');
  } else if (stress <= 6) {
    for (final t in ['Take short breaks during work.', 'Practice breathing exercises.', 'Balance work and rest.']) {
      push('Stress Level', 'warning', t);
    }
  } else {
    for (final t in [
      'Your stress level is high.',
      'Consider relaxation techniques.',
      'Reduce workload if possible.',
      'Get adequate sleep.',
    ]) {
      push('Stress Level', 'warning', t);
    }
  }

  if (steps < 4000) {
    push('Daily Steps', 'warning', 'Increase walking gradually.');
    push('Daily Steps', 'warning', 'Aim for 6,000–8,000 steps.');
  } else if (steps < 8000) {
    push('Daily Steps', 'warning', 'Good progress.');
    push('Daily Steps', 'warning', 'Try reaching 8,000–10,000 daily.');
  } else {
    push('Daily Steps', 'positive', 'Excellent activity level.');
    push('Daily Steps', 'positive', 'Maintain your current routine.');
  }

  if (activity == 'Low') {
    push('Physical Activity', 'warning', 'Add 20–30 minutes of exercise.');
    push('Physical Activity', 'warning', 'Start with walking.');
  } else if (activity == 'Moderate') {
    push('Physical Activity', 'positive', 'Good activity level.');
    push('Physical Activity', 'positive', 'Continue exercising regularly.');
  } else {
    push('Physical Activity', 'positive', 'Excellent physical activity.');
    push('Physical Activity', 'positive', 'Remember to rest and stay hydrated.');
  }

  if (bmi == 'Underweight') {
    for (final t in ['Eat nutrient-rich foods.', 'Increase healthy calories.', 'Include eggs, fish, beans, milk, and nuts.']) {
      push('BMI Category', 'warning', t);
    }
  } else if (bmi == 'Normal') {
    push('BMI Category', 'positive', 'Maintain your balanced diet.');
    push('BMI Category', 'positive', 'Continue exercising.');
  } else if (bmi == 'Overweight') {
    for (final t in ['Reduce sugary drinks.', 'Eat more vegetables and lean protein.', 'Walk daily.', 'Reduce processed foods.']) {
      push('BMI Category', 'warning', t);
    }
  } else {
    for (final t in [
      'Consult a healthcare professional.',
      'Follow a balanced diet.',
      'Increase physical activity gradually.',
      'Avoid excessive sugar and fast food.',
    ]) {
      push('BMI Category', 'warning', t);
    }
  }

  if (disorder == 'None') {
    push('Sleep Disorder', 'positive', 'No sleep disorder reported.');
    push('Sleep Disorder', 'positive', 'Maintain healthy sleep habits.');
  } else if (disorder == 'Insomnia') {
    for (final t in ['Keep a regular bedtime.', 'Avoid caffeine late in the day.', 'Limit screen use before sleep.']) {
      push('Sleep Disorder', 'warning', t);
    }
  } else {
    for (final t in ['Consider medical evaluation.', 'Maintain a healthy weight.', 'Sleep on your side if advised.']) {
      push('Sleep Disorder', 'warning', t);
    }
  }

  return out.take(15).toList();
}

String toneIcon(String tone) {
  switch (tone) {
    case 'positive':
      return '✅';
    case 'warning':
      return '⚠️';
    default:
      return '•';
  }
}
