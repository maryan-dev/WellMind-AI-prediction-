import 'package:go_router/go_router.dart';

import '../widgets/app_scaffold.dart';
import 'screens/dashboard_screen.dart';
import 'screens/history_screen.dart';
import 'screens/lifestyle_screen.dart';
import 'screens/landing_screen.dart';
import 'screens/models_screen.dart';
import 'screens/profile_screen.dart';
import 'screens/wellness_check_screen.dart';

GoRouter createRouter() {
  return GoRouter(
    initialLocation: '/',
    routes: [
      GoRoute(
        path: '/',
        builder: (context, state) => const LandingScreen(),
      ),
      ShellRoute(
        builder: (context, state, child) => AppScaffold(location: state.uri.path, child: child),
        routes: [
          GoRoute(path: '/home/dashboard', builder: (_, __) => const DashboardScreen()),
          GoRoute(path: '/home/check', builder: (_, __) => const WellnessCheckScreen()),
          GoRoute(path: '/home/models', builder: (_, __) => const ModelsScreen()),
          GoRoute(path: '/home/profile', builder: (_, __) => const ProfileScreen()),
          GoRoute(path: '/home/lifestyle', builder: (_, __) => const LifestyleScreen()),
          GoRoute(path: '/home/history', builder: (_, __) => const HistoryScreen()),
        ],
      ),
    ],
    redirect: (context, state) {
      if (state.uri.path == '/home') return '/home/dashboard';
      return null;
    },
  );
}
