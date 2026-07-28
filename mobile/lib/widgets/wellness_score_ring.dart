import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../core/responsive.dart';
import '../core/theme.dart';

class WellnessScoreRing extends StatelessWidget {
  const WellnessScoreRing({super.key, required this.value, this.size});

  final int value;
  final double? size;

  @override
  Widget build(BuildContext context) {
    final dim = (size ?? context.rw(140)).clamp(100.0, 180.0);
    final stroke = context.rw(10).clamp(6.0, 12.0);
    return SizedBox(
      width: dim,
      height: dim,
      child: CustomPaint(
        painter: _RingPainter(value: value, stroke: stroke),
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                '$value',
                style: TextStyle(
                  fontSize: context.rs(dim * 0.22),
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text('/100', style: TextStyle(fontSize: context.rs(12), color: Theme.of(context).textTheme.bodySmall?.color)),
            ],
          ),
        ),
      ),
    );
  }
}

class _RingPainter extends CustomPainter {
  _RingPainter({required this.value, required this.stroke});

  final int value;
  final double stroke;

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2 - stroke;
    final bg = Paint()
      ..color = AppColors.brand.withValues(alpha: 0.15)
      ..style = PaintingStyle.stroke
      ..strokeWidth = stroke
      ..strokeCap = StrokeCap.round;
    final fg = Paint()
      ..shader = const LinearGradient(colors: [AppColors.brandDeep, AppColors.brandLight]).createShader(Rect.fromCircle(center: center, radius: radius))
      ..style = PaintingStyle.stroke
      ..strokeWidth = stroke
      ..strokeCap = StrokeCap.round;

    canvas.drawCircle(center, radius, bg);
    final sweep = 2 * math.pi * (value / 100);
    canvas.drawArc(Rect.fromCircle(center: center, radius: radius), -math.pi / 2, sweep, false, fg);
  }

  @override
  bool shouldRepaint(covariant _RingPainter oldDelegate) => oldDelegate.value != value;
}
