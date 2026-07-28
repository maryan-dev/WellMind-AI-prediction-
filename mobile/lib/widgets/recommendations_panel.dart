import 'package:flutter/material.dart';

import '../core/responsive.dart';
import '../core/theme.dart';
import '../services/recommendation_engine.dart';
import 'glass_card.dart';

class RecommendationsPanel extends StatelessWidget {
  const RecommendationsPanel({super.key, required this.items});

  final List<RecItem> items;

  @override
  Widget build(BuildContext context) {
    final muted = Theme.of(context).textTheme.bodySmall?.color;
    final groups = <String, List<RecItem>>{};
    for (final item in items) {
      groups.putIfAbsent(item.category, () => []).add(item);
    }

    return GlassCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Recommendations', style: TextStyle(fontSize: context.rs(17), fontWeight: FontWeight.w600)),
          SizedBox(height: context.rh(6)),
          Text(
            'Based on sleep, stress, activity, BMI, and sleep health',
            style: TextStyle(fontSize: context.rs(13), height: 1.4, color: muted),
          ),
          SizedBox(height: context.rh(16)),
          ...groups.entries.map((entry) {
            return Padding(
              padding: EdgeInsets.only(bottom: context.rh(14)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(entry.key, style: TextStyle(fontSize: context.rs(14), fontWeight: FontWeight.w600, color: AppColors.brand)),
                  SizedBox(height: context.rh(6)),
                  ...entry.value.map(
                    (r) => Padding(
                      padding: EdgeInsets.only(bottom: context.rh(6)),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(toneIcon(r.tone), style: TextStyle(fontSize: context.rs(14))),
                          SizedBox(width: context.rw(8)),
                          Expanded(child: Text(r.text, style: TextStyle(fontSize: context.rs(14), height: 1.45, color: muted))),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }
}
