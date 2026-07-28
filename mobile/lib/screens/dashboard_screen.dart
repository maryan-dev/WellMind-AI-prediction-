import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../core/responsive.dart';
import '../core/theme.dart';
import '../providers/app_state.dart';
import '../widgets/common_widgets.dart';
import '../widgets/glass_card.dart';
import '../services/recommendation_engine.dart';
import '../widgets/recommendations_panel.dart';
import '../widgets/wellness_score_ring.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    final result = state.latestResult;

    if (result == null) {
      return ResponsiveBody(
        child: EmptyStateWidget(
          title: 'No wellness analysis yet',
          description: 'Complete a wellness check to view your score and recommendations.',
          action: FilledButton(
            onPressed: () => context.go('/home/check'),
            child: const Text('Start Wellness Check'),
          ),
        ),
      );
    }

    return ResponsiveBody(
      child: ListView(
        children: [
          Text('Welcome back, ${state.profile['name'] ?? 'there'}', style: Theme.of(context).textTheme.titleLarge),
          Text('Your personalized wellness analysis', style: Theme.of(context).textTheme.bodySmall),
          SizedBox(height: context.rh(16)),
          GlassCard(
            padding: EdgeInsets.zero,
            child: Column(
              children: [
                Container(
                  width: double.infinity,
                  padding: EdgeInsets.all(context.rw(16)),
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(colors: [AppColors.brandDeep, AppColors.brand]),
                    borderRadius: BorderRadius.vertical(top: Radius.circular(18)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('AI Wellness Report', style: TextStyle(color: Colors.white70, fontSize: context.rs(13))),
                      Text('Your Wellness Status', style: TextStyle(color: Colors.white, fontSize: context.rs(20), fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
                Padding(
                  padding: EdgeInsets.all(context.rw(16)),
                  child: LayoutBuilder(
                    builder: (context, constraints) {
                      final wide = constraints.maxWidth > 500;
                      if (wide) {
                        return Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            WellnessScoreRing(value: result.wellnessScore),
                            SizedBox(width: context.rw(16)),
                            Expanded(child: _ResultDetails(result: result)),
                          ],
                        );
                      }
                      return Column(
                        children: [
                          WellnessScoreRing(value: result.wellnessScore),
                          SizedBox(height: context.rh(8)),
                          Text('Wellness Score: ${result.wellnessScore}/100', style: TextStyle(fontWeight: FontWeight.w600, color: AppColors.brandDeep)),
                          SizedBox(height: context.rh(12)),
                          _ResultDetails(result: result),
                        ],
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
          SizedBox(height: context.rh(12)),
          GridView.count(
            crossAxisCount: context.isTablet ? 4 : 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            mainAxisSpacing: context.rh(10),
            crossAxisSpacing: context.rw(10),
            childAspectRatio: context.isCompact ? 1.35 : 1.5,
            children: [
              ScoreTile(emoji: '😴', label: 'Sleep Score', value: result.scores.sleep.round()),
              ScoreTile(emoji: '🏃', label: 'Activity Score', value: result.scores.activity.round()),
              ScoreTile(emoji: '😰', label: 'Stress Index', value: result.scores.stress.round()),
              ScoreTile(emoji: '⚡', label: 'Energy Score', value: result.scores.fatigue.round()),
            ],
          ),
          SizedBox(height: context.rh(12)),
          RecommendationsPanel(
            items: buildFeatureRecommendations(
              sleepDuration: result.form.sleepDuration,
              sleepQuality: result.form.sleepQuality,
              stressLevel: result.form.stressLevel,
              physicalActivityLevel: result.form.physicalActivityLevel,
              dailySteps: result.form.dailySteps,
              bmiCategory: result.form.bmiCategory,
              sleepDisorder: result.form.sleepDisorder,
            ),
          ),
          SizedBox(height: context.rh(24)),
        ],
      ),
    );
  }
}

class _ResultDetails extends StatelessWidget {
  const _ResultDetails({required this.result});

  final dynamic result;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        _row(context, 'Lifestyle Category', result.category, highlight: true),
        SizedBox(height: context.rh(8)),
        _row(context, 'Cluster', result.cluster.label),
        SizedBox(height: context.rh(8)),
        if (result.modelName != null && result.modelName!.isNotEmpty) ...[
          _row(context, 'Production model', result.modelName!),
          SizedBox(height: context.rh(8)),
        ],
        _row(context, 'Model confidence', '${result.confidence}%'),
      ],
    );
  }

  Widget _row(BuildContext context, String label, String value, {bool highlight = false}) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: context.rw(12), vertical: context.rh(10)),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Theme.of(context).dividerColor.withValues(alpha: 0.3)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: Theme.of(context).textTheme.bodySmall),
          Text(
            value,
            style: TextStyle(
              fontWeight: FontWeight.w600,
              fontSize: highlight ? context.rs(16) : context.rs(14),
              color: highlight ? AppColors.brand : null,
            ),
          ),
        ],
      ),
    );
  }
}
