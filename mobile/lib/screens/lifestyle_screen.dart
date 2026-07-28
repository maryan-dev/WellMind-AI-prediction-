import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../core/responsive.dart';
import '../core/theme.dart';
import '../providers/app_state.dart';
import '../widgets/common_widgets.dart';
import '../widgets/glass_card.dart';

class LifestyleScreen extends StatelessWidget {
  const LifestyleScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final result = context.watch<AppState>().latestResult;
    if (result == null) {
      return ResponsiveBody(
        child: EmptyStateWidget(
          title: 'No cluster data yet',
          description: 'Run a wellness check first.',
          action: FilledButton(onPressed: () => context.go('/home/check'), child: const Text('Wellness Check')),
        ),
      );
    }

    return ResponsiveBody(
      child: ListView(
        children: [
          Text('Lifestyle Analysis', style: Theme.of(context).textTheme.headlineSmall),
          SizedBox(height: context.rh(12)),
          GlassCard(
            borderColor: AppColors.ai,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Your lifestyle group', style: Theme.of(context).textTheme.bodySmall),
                Text(result.cluster.label, style: TextStyle(fontSize: context.rs(22), fontWeight: FontWeight.bold)),
                SizedBox(height: context.rh(8)),
                Text(
                  'Based on clustering patterns similar to your sleep, stress, and activity profile.',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ],
            ),
          ),
          SizedBox(height: context.rh(12)),
          GlassCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Your metrics', style: Theme.of(context).textTheme.titleMedium),
                SizedBox(height: context.rh(12)),
                _bar(context, 'Sleep score', result.scores.sleep),
                _bar(context, 'Activity score', result.scores.activity),
                _bar(context, 'Stress index', result.scores.stress),
                _bar(context, 'Energy', result.scores.fatigue),
              ],
            ),
          ),
          SizedBox(height: context.rh(24)),
        ],
      ),
    );
  }

  Widget _bar(BuildContext context, String label, double value) {
    final pct = (value / 100).clamp(0.0, 1.0);
    return Padding(
      padding: EdgeInsets.only(bottom: context.rh(12)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(label),
              Text('${value.round()}'),
            ],
          ),
          SizedBox(height: context.rh(4)),
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: LinearProgressIndicator(
              value: pct,
              minHeight: context.rh(8),
              backgroundColor: AppColors.brand.withValues(alpha: 0.12),
              color: AppColors.brand,
            ),
          ),
        ],
      ),
    );
  }
}
