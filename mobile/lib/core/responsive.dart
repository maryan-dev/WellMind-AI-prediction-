import 'package:flutter/material.dart';

/// Scales layout from a 375×812 reference — no hard-coded pixel UI on one device.
extension Responsive on BuildContext {
  Size get screenSize => MediaQuery.sizeOf(this);

  double get _scaleW => (screenSize.width / 375).clamp(0.82, 1.35);

  double get _scaleH => (screenSize.height / 812).clamp(0.82, 1.35);

  /// Horizontal spacing / widths
  double rw(double value) => value * _scaleW;

  /// Vertical spacing / heights
  double rh(double value) => value * _scaleH;

  /// Font sizes — respect system text scale but clamp extremes
  double rs(double value) {
    final scaled = value * _scaleW;
    final textScale = MediaQuery.textScalerOf(this).scale(1);
    return (scaled * textScale).clamp(value * 0.85, value * 1.35);
  }

  /// Max content width on tablets / large phones
  double get contentMaxWidth {
    final w = screenSize.width;
    if (w >= 900) return 720;
    if (w >= 600) return 560;
    return w;
  }

  EdgeInsets get pagePadding => EdgeInsets.symmetric(
        horizontal: rw(16).clamp(12, 28),
        vertical: rh(12).clamp(8, 20),
      );

  bool get isCompact => screenSize.width < 360;

  bool get isTablet => screenSize.width >= 600;
}

/// Centers content and limits width on large screens.
class ResponsiveBody extends StatelessWidget {
  const ResponsiveBody({super.key, required this.child, this.padding});

  final Widget child;
  final EdgeInsets? padding;

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: Alignment.topCenter,
      child: ConstrainedBox(
        constraints: BoxConstraints(maxWidth: context.contentMaxWidth),
        child: Padding(
          padding: padding ?? context.pagePadding,
          child: child,
        ),
      ),
    );
  }
}
