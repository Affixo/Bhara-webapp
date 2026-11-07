import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_constants.dart';
import 'custom_button.dart';

class FilterBottomSheet extends StatefulWidget {
  final String? initialType;
  final String? initialCity;
  final double? initialMinRent;
  final double? initialMaxRent;
  final int? initialBedrooms;
  final String? initialFurnished;
  final Function(Map<String, dynamic> filters) onApply;

  const FilterBottomSheet({
    Key? key,
    this.initialType,
    this.initialCity,
    this.initialMinRent,
    this.initialMaxRent,
    this.initialBedrooms,
    this.initialFurnished,
    required this.onApply,
  }) : super(key: key);

  @override
  State<FilterBottomSheet> createState() => _FilterBottomSheetState();
}

class _FilterBottomSheetState extends State<FilterBottomSheet> {
  String? _selectedType;
  String? _selectedCity;
  RangeValues _rentRange = const RangeValues(2000, 80000);
  int? _selectedBedrooms;
  String? _selectedFurnished;

  @override
  void initState() {
    super.initState();
    _selectedType = widget.initialType;
    _selectedCity = widget.initialCity;
    _selectedBedrooms = widget.initialBedrooms;
    _selectedFurnished = widget.initialFurnished;

    if (widget.initialMinRent != null || widget.initialMaxRent != null) {
      _rentRange = RangeValues(
        widget.initialMinRent ?? 2000,
        widget.initialMaxRent ?? 80000,
      );
    }
  }

  void _reset() {
    setState(() {
      _selectedType = null;
      _selectedCity = null;
      _rentRange = const RangeValues(2000, 80000);
      _selectedBedrooms = null;
      _selectedFurnished = null;
    });
  }

  void _apply() {
    widget.onApply({
      'type': _selectedType,
      'city': _selectedCity,
      'minRent': _rentRange.start > 2000 ? _rentRange.start : null,
      'maxRent': _rentRange.end < 80000 ? _rentRange.end : null,
      'bedrooms': _selectedBedrooms,
      'furnished': _selectedFurnished,
    });
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.only(
        top: 20,
        left: 20,
        right: 20,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
      ),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            // Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Filters',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                  ),
                ),
                TextButton(
                  onPressed: _reset,
                  child: const Text(
                    'Reset',
                    style: TextStyle(
                      color: AppColors.error,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
            const Divider(height: 24),

            // Rental Type
            const Text(
              'Rental Type',
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 10),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: AppConstants.rentalTypes.map((t) {
                final id = t['id'] as String;
                final isSelected = _selectedType == id;
                return ChoiceChip(
                  label: Text(t['label'] as String),
                  selected: isSelected,
                  selectedColor: AppColors.primarySoft,
                  labelStyle: TextStyle(
                    color: isSelected ? AppColors.primaryDark : AppColors.textSecondary,
                    fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                  ),
                  side: BorderSide(
                    color: isSelected ? AppColors.primary : AppColors.border,
                  ),
                  onSelected: (val) {
                    setState(() {
                      _selectedType = val ? id : null;
                    });
                  },
                );
              }).toList(),
            ),
            const SizedBox(height: 20),

            // Rent Range Slider
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Monthly Rent (৳)',
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
                ),
                Text(
                  '৳${_rentRange.start.toInt()} - ৳${_rentRange.end.toInt()}',
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: AppColors.primary,
                  ),
                ),
              ],
            ),
            RangeSlider(
              values: _rentRange,
              min: 2000,
              max: 80000,
              divisions: 78,
              activeColor: AppColors.primary,
              inactiveColor: AppColors.border,
              onChanged: (values) {
                setState(() {
                  _rentRange = values;
                });
              },
            ),
            const SizedBox(height: 16),

            // Division / City
            const Text(
              'Division / City',
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 10),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: AppConstants.divisions.map((div) {
                final isSelected = _selectedCity == div;
                return ChoiceChip(
                  label: Text(div),
                  selected: isSelected,
                  selectedColor: AppColors.primarySoft,
                  labelStyle: TextStyle(
                    color: isSelected ? AppColors.primaryDark : AppColors.textSecondary,
                    fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                  ),
                  side: BorderSide(
                    color: isSelected ? AppColors.primary : AppColors.border,
                  ),
                  onSelected: (val) {
                    setState(() {
                      _selectedCity = val ? div : null;
                    });
                  },
                );
              }).toList(),
            ),
            const SizedBox(height: 20),

            // Bedrooms
            const Text(
              'Bedrooms',
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 10),
            Wrap(
              spacing: 8,
              children: [1, 2, 3, 4, 5].map((count) {
                final isSelected = _selectedBedrooms == count;
                return ChoiceChip(
                  label: Text('$count Bed${count > 1 ? "s" : ""}'),
                  selected: isSelected,
                  selectedColor: AppColors.primarySoft,
                  labelStyle: TextStyle(
                    color: isSelected ? AppColors.primaryDark : AppColors.textSecondary,
                    fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                  ),
                  side: BorderSide(
                    color: isSelected ? AppColors.primary : AppColors.border,
                  ),
                  onSelected: (val) {
                    setState(() {
                      _selectedBedrooms = val ? count : null;
                    });
                  },
                );
              }).toList(),
            ),
            const SizedBox(height: 24),

            // Apply Button
            CustomButton(
              text: 'Apply Filters',
              onPressed: _apply,
            ),
          ],
        ),
      ),
    );
  }
}
