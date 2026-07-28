import 'package:flutter/material.dart';

class AppColors {
  static const brand = Color(0xFF0D9488);
  static const brandLight = Color(0xFF2DD4BF);
  static const brandDeep = Color(0xFF0F766E);
  static const ai = Color(0xFF0891B2);
  static const aiDark = Color(0xFF0E7490);
  static const aiLight = Color(0xFF22D3EE);

  static const lightBg = Color(0xFFF0F9FA);
  static const darkBg = Color(0xFF0A1018);
  static const lightText = Color(0xFF0F172A);
  static const darkText = Color(0xFFF1F5F9);
  static const mutedLight = Color(0xFF64748B);
  static const mutedDark = Color(0xFF94A3B8);
}

ThemeData buildAppTheme({required bool isDark}) {
  final bg = isDark ? AppColors.darkBg : AppColors.lightBg;
  final text = isDark ? AppColors.darkText : AppColors.lightText;
  final muted = isDark ? AppColors.mutedDark : AppColors.mutedLight;
  final card = isDark
      ? const Color(0xFF0F172A).withValues(alpha: 0.72)
      : Colors.white.withValues(alpha: 0.88);

  return ThemeData(
    useMaterial3: true,
    brightness: isDark ? Brightness.dark : Brightness.light,
    scaffoldBackgroundColor: bg,
    colorScheme: ColorScheme.fromSeed(
      seedColor: AppColors.brand,
      brightness: isDark ? Brightness.dark : Brightness.light,
      primary: isDark ? AppColors.brandLight : AppColors.brandDeep,
      secondary: AppColors.ai,
    ),
    appBarTheme: AppBarTheme(
      elevation: 0,
      scrolledUnderElevation: 0,
      backgroundColor: card,
      foregroundColor: text,
      centerTitle: false,
    ),
    navigationBarTheme: NavigationBarThemeData(
      height: 68,
      elevation: 0,
      backgroundColor: isDark ? const Color(0xFF0C1220).withValues(alpha: 0.95) : Colors.white.withValues(alpha: 0.95),
      indicatorColor: AppColors.brand.withValues(alpha: 0.18),
      surfaceTintColor: Colors.transparent,
      labelTextStyle: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.w700,
            letterSpacing: 0.2,
            color: isDark ? AppColors.brandLight : AppColors.brandDeep,
          );
        }
        return TextStyle(fontSize: 11, fontWeight: FontWeight.w500, color: muted);
      }),
      iconTheme: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return IconThemeData(color: isDark ? AppColors.brandLight : AppColors.brandDeep, size: 24);
        }
        return IconThemeData(color: muted.withValues(alpha: 0.85), size: 22);
      }),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: isDark ? const Color(0xFF0F172A).withValues(alpha: 0.5) : Colors.white.withValues(alpha: 0.7),
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: BorderSide(color: muted.withValues(alpha: 0.35)),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: BorderSide(color: isDark ? AppColors.brandLight : AppColors.brand, width: 1.5),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
      floatingLabelBehavior: FloatingLabelBehavior.never,
    ),
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        backgroundColor: AppColors.brandDeep,
        foregroundColor: Colors.white,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      ),
    ),
    textTheme: TextTheme(
      headlineLarge: TextStyle(fontWeight: FontWeight.w800, color: text),
      titleLarge: TextStyle(fontWeight: FontWeight.w700, color: text),
      bodyMedium: TextStyle(color: text),
      bodySmall: TextStyle(color: muted),
    ),
  );
}
