import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'app_router.dart';
import 'core/theme.dart';
import 'providers/app_state.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const WellMindApp());
}

class WellMindApp extends StatefulWidget {
  const WellMindApp({super.key});

  @override
  State<WellMindApp> createState() => _WellMindAppState();
}

class _WellMindAppState extends State<WellMindApp> {
  late final AppState _state = AppState()..init();
  late final _router = createRouter();

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider.value(
      value: _state,
      child: Consumer<AppState>(
        builder: (context, state, _) {
          return MaterialApp.router(
            title: 'WellMind AI',
            debugShowCheckedModeBanner: false,
            theme: buildAppTheme(isDark: false),
            darkTheme: buildAppTheme(isDark: true),
            themeMode: state.isDark ? ThemeMode.dark : ThemeMode.light,
            routerConfig: _router,
          );
        },
      ),
    );
  }
}
