import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../core/responsive.dart';
import '../core/theme.dart';
import '../providers/app_state.dart';

class AppScaffold extends StatelessWidget {
  const AppScaffold({super.key, required this.child, required this.location});

  final Widget child;
  final String location;

  int get _selectedIndex {
    if (location.contains('/check')) return 1;
    if (location.contains('/models')) return 2;
    if (location.contains('/profile')) return 3;
    return 0;
  }

  bool get _hideBottomNav =>
      location.contains('/check') ||
      location.contains('/lifestyle') ||
      location.contains('/history');

  bool get _showBack => location.contains('/lifestyle') || location.contains('/history');

  void _goTab(BuildContext context, int index) {
    switch (index) {
      case 0:
        context.go('/home/dashboard');
      case 1:
        context.go('/home/check');
      case 2:
        context.go('/home/models');
      case 3:
        context.go('/home/profile');
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();

    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: _showBack,
        leading: _showBack ? BackButton(onPressed: () => context.go('/home/dashboard')) : null,
        title: Row(
          children: [
            Container(
              width: context.rw(36),
              height: context.rw(36),
              alignment: Alignment.center,
              decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [AppColors.brandDeep, AppColors.brand]),
                borderRadius: BorderRadius.circular(context.rw(10)),
              ),
              child: const Text('W', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ),
            SizedBox(width: context.rw(8)),
            Flexible(
              child: Text(
                'WellMind AI',
                style: TextStyle(fontSize: context.rs(18), fontWeight: FontWeight.bold),
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            onPressed: state.toggleTheme,
            icon: Icon(state.isDark ? Icons.light_mode : Icons.dark_mode),
            tooltip: 'Theme',
          ),
        ],
      ),
      body: SafeArea(bottom: _hideBottomNav, child: child),
      bottomNavigationBar: _hideBottomNav
          ? null
          : NavigationBar(
              selectedIndex: _selectedIndex,
              onDestinationSelected: (i) => _goTab(context, i),
              destinations: const [
                NavigationDestination(
                  icon: Icon(Icons.home_outlined),
                  selectedIcon: Icon(Icons.home_rounded),
                  label: 'Home',
                ),
                NavigationDestination(
                  icon: Icon(Icons.favorite_outline),
                  selectedIcon: Icon(Icons.favorite_rounded),
                  label: 'Check',
                ),
                NavigationDestination(
                  icon: Icon(Icons.psychology_outlined),
                  selectedIcon: Icon(Icons.psychology_rounded),
                  label: 'Models',
                ),
                NavigationDestination(
                  icon: Icon(Icons.person_outline),
                  selectedIcon: Icon(Icons.person_rounded),
                  label: 'Profile',
                ),
              ],
            ),
    );
  }
}
