import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../core/responsive.dart';
import '../core/theme.dart';

class LandingScreen extends StatelessWidget {
  const LandingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: Theme.of(context).brightness == Brightness.dark
                ? [AppColors.darkBg, const Color(0xFF0F172A), const Color(0xFF042F2E)]
                : [const Color(0xFFECFDF5), const Color(0xFFF0FDFA), const Color(0xFFECFEFF)],
          ),
        ),
        child: SafeArea(
          child: ResponsiveBody(
            child: Column(
              children: [
                SizedBox(height: context.rh(8)),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      width: context.rw(40),
                      height: context.rw(40),
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(colors: [AppColors.brandDeep, AppColors.brand]),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Text('W', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                    ),
                    SizedBox(width: context.rw(8)),
                    Text('WellMind AI', style: TextStyle(fontSize: context.rs(18), fontWeight: FontWeight.bold)),
                  ],
                ),
                Expanded(
                  child: Center(
                    child: SingleChildScrollView(
                      padding: EdgeInsets.symmetric(horizontal: context.rw(8)),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          Container(
                            padding: EdgeInsets.symmetric(horizontal: context.rw(12), vertical: context.rh(6)),
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(999),
                              border: Border.all(color: AppColors.brand.withValues(alpha: 0.3)),
                              color: Theme.of(context).cardColor.withValues(alpha: 0.5),
                            ),
                            child: Text(
                              'AI-powered wellness platform',
                              textAlign: TextAlign.center,
                              style: TextStyle(fontSize: context.rs(12)),
                            ),
                          ),
                          SizedBox(height: context.rh(28)),
                          Text(
                            'Understand Your Wellness\nWith AI',
                            textAlign: TextAlign.center,
                            style: TextStyle(fontSize: context.rs(32), fontWeight: FontWeight.w800, height: 1.15),
                          ),
                          SizedBox(height: context.rh(16)),
                          Text(
                            'Analyze lifestyle habits and get personalized recommendations for a healthier routine.',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: context.rs(16),
                              color: Theme.of(context).textTheme.bodySmall?.color,
                              height: 1.45,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                Padding(
                  padding: EdgeInsets.fromLTRB(0, context.rh(8), 0, context.rh(20)),
                  child: SizedBox(
                    width: double.infinity,
                    child: FilledButton.icon(
                      onPressed: () => context.go('/home/check'),
                      icon: const Icon(Icons.health_and_safety),
                      label: const Text('Start Wellness Check'),
                      style: FilledButton.styleFrom(
                        padding: EdgeInsets.symmetric(vertical: context.rh(16)),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
