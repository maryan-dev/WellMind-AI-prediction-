import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../core/responsive.dart';
import '../core/theme.dart';
import '../providers/app_state.dart';
import '../widgets/glass_card.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  late TextEditingController _name;

  @override
  void initState() {
    super.initState();
    _name = TextEditingController();
  }

  @override
  void dispose() {
    _name.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    final name = state.profile['name'] ?? '';
    if (_name.text.isEmpty && name.isNotEmpty) {
      _name.text = name;
    }

    final checks = state.history.length;

    return ResponsiveBody(
      child: ListView(
        children: [
          Text('Profile', style: Theme.of(context).textTheme.headlineSmall),
          Text('Account & preferences', style: Theme.of(context).textTheme.bodySmall),
          SizedBox(height: context.rh(20)),
          GlassCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Display name', style: TextStyle(fontSize: context.rs(14), fontWeight: FontWeight.w600)),
                SizedBox(height: context.rh(10)),
                TextField(
                  controller: _name,
                  decoration: const InputDecoration(hintText: 'Your name'),
                  onSubmitted: (v) => state.updateProfile({'name': v.trim()}),
                ),
                SizedBox(height: context.rh(14)),
                SizedBox(
                  width: double.infinity,
                  child: FilledButton(
                    onPressed: () {
                      state.updateProfile({'name': _name.text.trim()});
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Saved')),
                      );
                    },
                    child: const Text('Save'),
                  ),
                ),
              ],
            ),
          ),
          SizedBox(height: context.rh(14)),
          GlassCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Summary', style: Theme.of(context).textTheme.titleSmall),
                SizedBox(height: context.rh(10)),
                _Stat(label: 'Checks', value: '$checks'),
                _Stat(label: 'Latest category', value: state.latestResult?.category ?? '—'),
              ],
            ),
          ),
          SizedBox(height: context.rh(14)),
          GlassCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text('More', style: Theme.of(context).textTheme.titleSmall),
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: const Icon(Icons.history),
                  title: const Text('History'),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () => context.go('/home/history'),
                ),
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: const Icon(Icons.analytics_outlined),
                  title: const Text('Lifestyle analysis'),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () => context.go('/home/lifestyle'),
                ),
                SwitchListTile(
                  contentPadding: EdgeInsets.zero,
                  title: const Text('Dark mode'),
                  value: state.isDark,
                  activeThumbColor: AppColors.brandLight,
                  onChanged: (_) => state.toggleTheme(),
                ),
              ],
            ),
          ),
          SizedBox(height: context.rh(24)),
        ],
      ),
    );
  }
}

class _Stat extends StatelessWidget {
  const _Stat({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(bottom: context.rh(6)),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: Theme.of(context).textTheme.bodySmall),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }
}
