import 'package:flutter/foundation.dart';

import '../models/wellness_models.dart';
import '../services/api_service.dart';
import '../services/storage_service.dart';
import '../services/wellness_engine.dart';

class AppState extends ChangeNotifier {
  AppState({
    ApiService? api,
    StorageService? storage,
  })  : _api = api ?? ApiService(),
        _storage = storage ?? StorageService();

  final ApiService _api;
  final StorageService _storage;

  bool isDark = true;
  bool loading = false;
  String? apiNotice;

  Map<String, String> profile = {
    'name': 'WellMind User',
    'age': '',
    'gender': '',
    'occupation': '',
  };

  WellnessResult? latestResult;
  List<HistoryEntry> history = [];

  Future<void> init() async {
    profile = await _storage.loadProfile();
    history = await _storage.loadHistory();
    notifyListeners();
  }

  void toggleTheme() {
    isDark = !isDark;
    notifyListeners();
  }

  void updateProfile(Map<String, String> patch) {
    profile = {...profile, ...patch};
    _storage.saveProfile(profile);
    notifyListeners();
  }

  Future<void> submitWellnessCheck(WellnessFormData form) async {
    loading = true;
    apiNotice = null;
    notifyListeners();
    try {
      latestResult = await _api.predict(form);
    } catch (e) {
      final msg = e.toString();
      if (msg.contains('422') || msg.contains('Invalid')) {
        apiNotice = 'Could not reach AI with this data. Fix the form and try again.';
        loading = false;
        notifyListeners();
        return;
      }
      apiNotice = 'Backend offline — local analysis shown.';
      latestResult = analyzeWellnessLocal(form);
    }
    final entry = HistoryEntry(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      dateLabel: _formatDate(DateTime.now()),
      category: latestResult!.category,
      score: latestResult!.wellnessScore,
      summary: latestResult!.recommendations.first,
    );
    history = [entry, ...history].take(20).toList();
    await _storage.saveHistory(history);
    loading = false;
    notifyListeners();
  }

  String _formatDate(DateTime d) {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return '${d.day} ${months[d.month - 1]} ${d.year}';
  }
}
