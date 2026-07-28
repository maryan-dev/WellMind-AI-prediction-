import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../core/responsive.dart';
import '../providers/app_state.dart';
import '../widgets/glass_card.dart';

class HistoryScreen extends StatelessWidget {
  const HistoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final history = context.watch<AppState>().history;
    return ResponsiveBody(
      child: ListView(
        children: [
          Text('History', style: Theme.of(context).textTheme.headlineSmall),
          Text('Your recent wellness checks', style: Theme.of(context).textTheme.bodySmall),
          SizedBox(height: context.rh(16)),
          if (history.isEmpty)
            const GlassCard(child: Text('No history yet. Complete a wellness check.'))
          else
            ...history.map(
              (e) => Padding(
                padding: EdgeInsets.only(bottom: context.rh(10)),
                child: GlassCard(
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(e.dateLabel, style: Theme.of(context).textTheme.bodySmall),
                            Text(e.category, style: TextStyle(fontSize: context.rs(16), fontWeight: FontWeight.w600)),
                            Text(e.summary, maxLines: 2, overflow: TextOverflow.ellipsis),
                          ],
                        ),
                      ),
                      Text('${e.score}', style: TextStyle(fontSize: context.rs(22), fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
              ),
            ),
          SizedBox(height: context.rh(24)),
        ],
      ),
    );
  }
}
