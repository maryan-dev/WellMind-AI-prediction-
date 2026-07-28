import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../core/form_constants.dart';
import '../core/responsive.dart';
import '../core/theme.dart';
import '../models/wellness_models.dart';
import '../providers/app_state.dart';
import '../widgets/common_widgets.dart';

class WellnessCheckScreen extends StatefulWidget {
  const WellnessCheckScreen({super.key});

  @override
  State<WellnessCheckScreen> createState() => _WellnessCheckScreenState();
}

class _WellnessCheckScreenState extends State<WellnessCheckScreen> {
  final _formKey = GlobalKey<FormState>();
  final _pageController = PageController();
  final _form = WellnessFormData();
  int _step = 0;

  static const _steps = ['About you', 'Sleep', 'Lifestyle'];

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    _formKey.currentState!.save();
    if (!isFormReadyForApi(_form)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill every required field with valid values.')),
      );
      return;
    }
    final state = context.read<AppState>();
    await state.submitWellnessCheck(_form);
    if (!mounted) return;
    if (state.apiNotice != null) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(state.apiNotice!)));
    }
    context.go('/home/dashboard');
  }

  void _next() {
    if (!_formKey.currentState!.validate()) return;
    _formKey.currentState!.save();
    if (_step < _steps.length - 1) {
      setState(() => _step++);
      _pageController.nextPage(duration: const Duration(milliseconds: 280), curve: Curves.easeOutCubic);
    } else {
      _submit();
    }
  }

  void _back() {
    if (_step == 0) return;
    setState(() => _step--);
    _pageController.previousPage(duration: const Duration(milliseconds: 280), curve: Curves.easeOutCubic);
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final loading = context.watch<AppState>().loading;
    final progress = (_step + 1) / _steps.length;

    return ResponsiveBody(
      child: loading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text('Wellness Check', style: Theme.of(context).textTheme.headlineSmall),
                SizedBox(height: context.rh(4)),
                Text(
                  'Step ${_step + 1} of ${_steps.length} · ${_steps[_step]}',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
                SizedBox(height: context.rh(14)),
                ClipRRect(
                  borderRadius: BorderRadius.circular(999),
                  child: LinearProgressIndicator(
                    value: progress,
                    minHeight: 6,
                    backgroundColor: Theme.of(context).dividerColor.withValues(alpha: 0.25),
                    color: AppColors.brand,
                  ),
                ),
                SizedBox(height: context.rh(20)),
                Expanded(
                  child: Form(
                    key: _formKey,
                    child: PageView(
                      controller: _pageController,
                      physics: const NeverScrollableScrollPhysics(),
                      children: [
                        _stepPage(
                          context,
                          icon: Icons.person_outline,
                          title: 'Personal information',
                          subtitle: 'Tell us a little about yourself.',
                          fields: [
                            _field(
                              'Age',
                              (v) => _form.age = v ?? '',
                              keyboard: TextInputType.number,
                              validator: (v) {
                                if (v == null || v.trim().isEmpty) return 'Enter your age';
                                final n = int.tryParse(v.trim());
                                if (n == null || n < 1 || n > 120) return 'Age must be 1–120';
                                return null;
                              },
                            ),
                            _dropdown(
                              'Gender',
                              FormConstants.genders,
                              (v) => _form.gender = v ?? '',
                              validator: true,
                              hint: 'Select gender',
                            ),
                            _dropdown(
                              'Occupation',
                              FormConstants.occupations.where((o) => o.isNotEmpty).toList(),
                              (v) => _form.occupation = v ?? '',
                              validator: true,
                              hint: 'Select occupation',
                            ),
                          ],
                        ),
                        _stepPage(
                          context,
                          icon: Icons.bedtime_outlined,
                          title: 'Sleep',
                          subtitle: 'How you rest affects your wellness score.',
                          fields: [
                            _field(
                              'Sleep duration (hours)',
                              (v) => _form.sleepDuration = v ?? '',
                              keyboard: const TextInputType.numberWithOptions(decimal: true),
                              validator: (v) {
                                if (v == null || v.trim().isEmpty) return 'Required';
                                final n = double.tryParse(v.trim());
                                if (n == null || n < 0 || n > 24) return 'Use 0–24 hours';
                                return null;
                              },
                            ),
                            _field(
                              'Quality of sleep (1–10)',
                              (v) => _form.sleepQuality = v ?? '',
                              keyboard: TextInputType.number,
                              validator: (v) {
                                if (v == null || v.trim().isEmpty) return 'Required';
                                final n = int.tryParse(v.trim());
                                if (n == null || n < 1 || n > 10) return 'Use 1–10';
                                return null;
                              },
                            ),
                            RadioChipGroup(
                              label: 'Do you have any sleep disorder?',
                              options: FormConstants.sleepDisorders,
                              value: _form.sleepDisorder,
                              onChanged: (v) => setState(() => _form.sleepDisorder = v),
                            ),
                          ],
                        ),
                        _stepPage(
                          context,
                          icon: Icons.directions_run,
                          title: 'Lifestyle',
                          subtitle: 'Activity, stress, and daily movement.',
                          fields: [
                            _dropdown(
                              'Physical activity level',
                              FormConstants.activityLevels,
                              (v) => _form.physicalActivityLevel = v ?? 'Moderate',
                            ),
                            _field(
                              'Daily steps',
                              (v) => _form.dailySteps = v ?? '',
                              keyboard: TextInputType.number,
                              hint: 'e.g. 8000',
                              validator: (v) {
                                if (v == null || v.trim().isEmpty) return 'Enter your daily steps';
                                final n = int.tryParse(v.trim());
                                if (n == null || n < 0) return 'Steps must be 0 or more';
                                return null;
                              },
                            ),
                            _dropdown(
                              'Stress level',
                              FormConstants.stressLevels,
                              (v) => _form.stressLevel = v ?? 'Medium',
                            ),
                            _dropdown(
                              'Body type (optional)',
                              FormConstants.bmiCategories,
                              (v) => _form.bmiCategory = v ?? 'Normal',
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
                SizedBox(height: context.rh(12)),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    if (_step > 0) ...[
                      OutlinedButton(onPressed: _back, child: const Text('Back')),
                      SizedBox(height: context.rh(10)),
                    ],
                    FilledButton(
                      onPressed: _next,
                      style: FilledButton.styleFrom(
                        padding: EdgeInsets.symmetric(vertical: context.rh(16)),
                      ),
                      child: Text(_step < _steps.length - 1 ? 'Next' : 'Analyze my wellness'),
                    ),
                  ],
                ),
                SizedBox(height: context.rh(12)),
              ],
            ),
    );
  }

  Widget _stepPage(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String subtitle,
    required List<Widget> fields,
  }) {
    return ListView(
      padding: EdgeInsets.only(bottom: context.rh(16)),
      children: [
        SectionHeader(title: title, icon: icon),
        SizedBox(height: context.rh(6)),
        Text(subtitle, style: Theme.of(context).textTheme.bodySmall),
        SizedBox(height: context.rh(24)),
        ...fields.map(
          (w) => Padding(
            padding: EdgeInsets.only(bottom: context.rh(28)),
            child: w,
          ),
        ),
      ],
    );
  }

  Widget _field(
    String label,
    FormFieldSetter<String> onSaved, {
    TextInputType? keyboard,
    String? hint,
    String? Function(String?)? validator,
  }) {
    return _labeledControl(
      label: label,
      child: TextFormField(
        decoration: InputDecoration(hintText: hint ?? label),
        keyboardType: keyboard,
        onSaved: onSaved,
        validator: validator ?? (v) => v == null || v.trim().isEmpty ? 'Required' : null,
      ),
    );
  }

  Widget _dropdown(
    String label,
    List<String> items,
    FormFieldSetter<String> onSaved, {
    bool validator = false,
    String? hint,
  }) {
    final current = _readCurrent(label);
    final effective = items.contains(current) ? current : null;
    return _labeledControl(
      label: label,
      child: DropdownButtonFormField<String>(
        decoration: InputDecoration(hintText: hint ?? 'Select'),
        isExpanded: true,
        value: effective?.isEmpty == true ? null : effective,
        hint: hint != null ? Text(hint) : null,
        items: items
            .map((e) => DropdownMenuItem(value: e, child: Text(e.isEmpty ? hint ?? 'Select' : e)))
            .toList(),
        onChanged: (v) => setState(() => _setCurrent(label, v ?? '')),
        onSaved: onSaved,
        validator: validator ? (v) => v == null || v.isEmpty ? 'Select an option' : null : null,
      ),
    );
  }

  Widget _labeledControl({required String label, required Widget child}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: context.rs(14),
            fontWeight: FontWeight.w600,
            height: 1.3,
          ),
        ),
        SizedBox(height: context.rh(10)),
        child,
      ],
    );
  }

  String _readCurrent(String label) {
    switch (label) {
      case 'Gender':
        return _form.gender;
      case 'Occupation':
        return _form.occupation;
      case 'Physical activity level':
        return _form.physicalActivityLevel;
      case 'Stress level':
        return _form.stressLevel;
      case 'Body type (optional)':
        return _form.bmiCategory;
      default:
        return '';
    }
  }

  void _setCurrent(String label, String v) {
    switch (label) {
      case 'Gender':
        _form.gender = v;
      case 'Occupation':
        _form.occupation = v;
      case 'Physical activity level':
        _form.physicalActivityLevel = v;
      case 'Stress level':
        _form.stressLevel = v;
      case 'Body type (optional)':
        _form.bmiCategory = v;
    }
  }
}
