import 'package:flutter/material.dart';

import '../core/responsive.dart';
import '../core/theme.dart';
import 'glass_card.dart';

class EmptyStateWidget extends StatelessWidget {
  const EmptyStateWidget({
    super.key,
    required this.title,
    required this.description,
    this.action,
  });

  final String title;
  final String description;
  final Widget? action;

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      child: Column(
        children: [
          Icon(Icons.insights_outlined, size: context.rw(48), color: AppColors.brand),
          SizedBox(height: context.rh(12)),
          Text(title, style: Theme.of(context).textTheme.titleLarge, textAlign: TextAlign.center),
          SizedBox(height: context.rh(8)),
          Text(description, textAlign: TextAlign.center),
          if (action != null) ...[SizedBox(height: context.rh(16)), action!],
        ],
      ),
    );
  }
}

class SectionHeader extends StatelessWidget {
  const SectionHeader({super.key, required this.title, required this.icon});

  final String title;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(
          padding: EdgeInsets.all(context.rw(8)),
          decoration: BoxDecoration(
            color: AppColors.brand.withValues(alpha: 0.12),
            borderRadius: BorderRadius.circular(context.rw(10)),
          ),
          child: Icon(icon, size: context.rw(18), color: AppColors.brand),
        ),
        SizedBox(width: context.rw(10)),
        Expanded(
          child: Text(title, style: TextStyle(fontSize: context.rs(17), fontWeight: FontWeight.w600)),
        ),
      ],
    );
  }
}

class ScoreTile extends StatelessWidget {
  const ScoreTile({super.key, required this.emoji, required this.label, required this.value});

  final String emoji;
  final String label;
  final int value;

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      padding: EdgeInsets.all(context.rw(12)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(emoji, style: TextStyle(fontSize: context.rs(22))),
          SizedBox(height: context.rh(6)),
          Text(label, style: Theme.of(context).textTheme.bodySmall),
          Text('$value', style: TextStyle(fontSize: context.rs(22), fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}

class RadioChipGroup extends StatelessWidget {
  const RadioChipGroup({
    super.key,
    required this.label,
    required this.options,
    required this.value,
    required this.onChanged,
  });

  final String label;
  final List<String> options;
  final String value;
  final ValueChanged<String> onChanged;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: TextStyle(fontSize: context.rs(14), fontWeight: FontWeight.w500)),
        SizedBox(height: context.rh(12)),
        Wrap(
          spacing: context.rw(8),
          runSpacing: context.rh(8),
          children: options.map((opt) {
            final selected = opt == value;
            return ChoiceChip(
              label: Text(opt),
              selected: selected,
              onSelected: (_) => onChanged(opt),
              selectedColor: AppColors.brand.withValues(alpha: 0.2),
              labelStyle: TextStyle(
                color: selected ? AppColors.brandDeep : null,
                fontWeight: selected ? FontWeight.w600 : FontWeight.normal,
              ),
            );
          }).toList(),
        ),
      ],
    );
  }
}
