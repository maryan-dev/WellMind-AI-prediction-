import 'package:flutter/material.dart';

import '../core/responsive.dart';
import '../core/theme.dart';

class GlassCard extends StatelessWidget {
  const GlassCard({
    super.key,
    required this.child,
    this.padding,
    this.onTap,
    this.borderColor,
  });

  final Widget child;
  final EdgeInsetsGeometry? padding;
  final VoidCallback? onTap;
  final Color? borderColor;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(context.rw(18)),
        child: Container(
          width: double.infinity,
          padding: padding ?? EdgeInsets.all(context.rw(16)),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(context.rw(18)),
            border: Border.all(color: borderColor ?? (isDark ? AppColors.mutedDark.withValues(alpha: 0.35) : AppColors.mutedLight.withValues(alpha: 0.35))),
            color: isDark ? const Color(0xFF0F172A).withValues(alpha: 0.65) : Colors.white.withValues(alpha: 0.88),
            boxShadow: [
              BoxShadow(
                color: AppColors.brand.withValues(alpha: isDark ? 0.08 : 0.06),
                blurRadius: 24,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: child,
        ),
      ),
    );
  }
}
