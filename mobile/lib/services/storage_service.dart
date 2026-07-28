import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

import '../models/wellness_models.dart';

typedef ProfileMap = Map<String, String>;

class StorageService {
  static const _profileKey = 'wellmind-profile';
  static const _historyKey = 'wellmind-history';

  Future<ProfileMap> loadProfile() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_profileKey);
    if (raw == null) {
      return {'name': 'WellMind User', 'age': '', 'gender': '', 'occupation': ''};
    }
    final map = jsonDecode(raw) as Map<String, dynamic>;
    return map.map((k, v) => MapEntry(k, v?.toString() ?? ''));
  }

  Future<void> saveProfile(ProfileMap profile) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_profileKey, jsonEncode(profile));
  }

  Future<List<HistoryEntry>> loadHistory() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_historyKey);
    if (raw == null) return [];
    final list = jsonDecode(raw) as List;
    return list.map((e) {
      final m = e as Map<String, dynamic>;
      return HistoryEntry(
        id: m['id'] as String? ?? '',
        dateLabel: m['date'] as String? ?? '',
        category: m['category'] as String? ?? '',
        score: (m['score'] as num?)?.round() ?? 0,
        summary: m['recommendation'] as String? ?? '',
      );
    }).toList();
  }

  Future<void> saveHistory(List<HistoryEntry> entries) async {
    final prefs = await SharedPreferences.getInstance();
    final jsonList = entries
        .map(
          (e) => {
            'id': e.id,
            'date': e.dateLabel,
            'category': e.category,
            'score': e.score,
            'recommendation': e.summary,
          },
        )
        .toList();
    await prefs.setString(_historyKey, jsonEncode(jsonList));
  }
}
