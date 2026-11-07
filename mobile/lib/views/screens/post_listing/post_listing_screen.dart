import 'dart:io';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_constants.dart';
import '../../../providers/listing_provider.dart';
import '../../widgets/amenity_chip.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/custom_text_field.dart';
import '../../widgets/map_location_picker.dart';

class PostListingScreen extends StatefulWidget {
  const PostListingScreen({Key? key}) : super(key: key);

  @override
  State<PostListingScreen> createState() => _PostListingScreenState();
}

class _PostListingScreenState extends State<PostListingScreen> {
  final _formKey = GlobalKey<FormState>();
  final GlobalKey<MapLocationPickerState> _mapKey = GlobalKey<MapLocationPickerState>();

  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _rentController = TextEditingController();
  final _bedroomsController = TextEditingController(text: '1');
  final _bathroomsController = TextEditingController(text: '1');
  final _areaController = TextEditingController();
  final _floorController = TextEditingController();
  final _addressController = TextEditingController();
  final _areaLocationController = TextEditingController();

  String _selectedType = 'family';
  String _selectedCity = 'Dhaka';
  String _selectedFurnished = 'unfurnished';
  bool _negotiable = false;
  final List<String> _selectedAmenities = [];
  final List<File> _selectedImages = [];

  double? _lat;
  double? _lng;

  final ImagePicker _picker = ImagePicker();

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _rentController.dispose();
    _bedroomsController.dispose();
    _bathroomsController.dispose();
    _areaController.dispose();
    _floorController.dispose();
    _addressController.dispose();
    _areaLocationController.dispose();
    super.dispose();
  }

  Future<void> _pickImage(ImageSource source) async {
    if (_selectedImages.length >= 8) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Maximum 8 photos allowed')),
      );
      return;
    }

    try {
      final XFile? file = await _picker.pickImage(
        source: source,
        maxWidth: 1200,
        maxHeight: 1200,
        imageQuality: 80,
      );
      if (file != null) {
        setState(() {
          _selectedImages.add(File(file.path));
        });
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Could not pick photo: $e')),
      );
    }
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    if (_selectedImages.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please add at least one photo of the property')),
      );
      return;
    }

    final listingProvider = Provider.of<ListingProvider>(context, listen: false);
    final created = await listingProvider.createListing(
      title: _titleController.text.trim(),
      description: _descriptionController.text.trim(),
      type: _selectedType,
      rent: double.parse(_rentController.text.trim()),
      negotiable: _negotiable,
      bedrooms: int.tryParse(_bedroomsController.text.trim()) ?? 1,
      bathrooms: int.tryParse(_bathroomsController.text.trim()) ?? 1,
      area: double.tryParse(_areaController.text.trim()),
      floor: _floorController.text.trim().isNotEmpty ? _floorController.text.trim() : null,
      furnished: _selectedFurnished,
      amenities: _selectedAmenities,
      address: _addressController.text.trim(),
      city: _selectedCity,
      locationArea: _areaLocationController.text.trim().isNotEmpty
          ? _areaLocationController.text.trim()
          : null,
      lat: _lat,
      lng: _lng,
      imageFiles: _selectedImages,
    );

    if (created != null && mounted) {
      final bool isLive = created.isApproved;
      await showDialog(
        context: context,
        barrierDismissible: false,
        builder: (ctx) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: Row(
            children: [
              Icon(
                isLive ? Icons.check_circle_rounded : Icons.hourglass_top_rounded,
                color: isLive ? AppColors.primary : Colors.amber.shade800,
                size: 28,
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  isLive ? 'Listing Live!' : 'Pending Approval',
                  style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 18),
                ),
              ),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                isLive
                    ? 'Your rental listing has been published and is now live on the public feed!'
                    : 'Your rental listing has been submitted successfully! 🎉\n\nIt is currently pending review by an admin. Once approved, it will appear on the public search and home feeds.',
                style: const TextStyle(fontSize: 14, color: AppColors.textSecondary, height: 1.4),
              ),
              const SizedBox(height: 14),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: isLive ? const Color(0xFFECFDF5) : const Color(0xFFFFFBEB),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: isLive ? const Color(0xFFA7F3D0) : const Color(0xFFFDE68A),
                  ),
                ),
                child: Row(
                  children: [
                    Icon(
                      isLive ? Icons.verified : Icons.info_outline,
                      size: 18,
                      color: isLive ? AppColors.primary : Colors.amber.shade800,
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        isLive
                            ? 'Status: LIVE & Visible to tenants'
                            : 'Status: PENDING ADMIN APPROVAL',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: isLive ? AppColors.primaryDark : Colors.amber.shade900,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          actions: [
            ElevatedButton(
              onPressed: () {
                Navigator.of(ctx).pop();
                context.go('/main');
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: isLive ? AppColors.primary : Colors.amber.shade800,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
              ),
              child: const Text(
                'View My Listings',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final listingProvider = Provider.of<ListingProvider>(context);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('Post To-Let Rental'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Step 1: Basic Information
                const Text(
                  '1. Basic Information',
                  style: TextStyle(fontSize: 17, fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: 12),

                CustomTextField(
                  controller: _titleController,
                  label: 'Listing Title',
                  hintText: 'e.g. 3 Bed Spacious Flat in Mirpur 10',
                  validator: (val) =>
                      val == null || val.trim().isEmpty ? 'Title is required' : null,
                ),
                const SizedBox(height: 14),

                // Rental Type Selector
                const Text(
                  'Rental Category',
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: AppConstants.rentalTypes.map((t) {
                    final isSelected = _selectedType == t['id'];
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
                        if (val) setState(() => _selectedType = t['id'] as String);
                      },
                    );
                  }).toList(),
                ),
                const SizedBox(height: 14),

                // Monthly Rent & Negotiable
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      flex: 3,
                      child: CustomTextField(
                        controller: _rentController,
                        label: 'Monthly Rent (৳)',
                        hintText: 'e.g. 22000',
                        keyboardType: TextInputType.number,
                        validator: (val) {
                          if (val == null || val.trim().isEmpty) {
                            return 'Rent is required';
                          }
                          if (double.tryParse(val.trim()) == null) {
                            return 'Invalid number';
                          }
                          return null;
                        },
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      flex: 2,
                      child: Padding(
                        padding: const EdgeInsets.only(top: 28),
                        child: Row(
                          children: [
                            Checkbox(
                              value: _negotiable,
                              activeColor: AppColors.primary,
                              onChanged: (val) => setState(() => _negotiable = val ?? false),
                            ),
                            const Text('Negotiable', style: TextStyle(fontSize: 13)),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
                const Divider(height: 32),

                // Step 2: Property Specifications
                const Text(
                  '2. Specifications',
                  style: TextStyle(fontSize: 17, fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: 12),

                Row(
                  children: [
                    Expanded(
                      child: CustomTextField(
                        controller: _bedroomsController,
                        label: 'Bedrooms',
                        hintText: '1',
                        keyboardType: TextInputType.number,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: CustomTextField(
                        controller: _bathroomsController,
                        label: 'Bathrooms',
                        hintText: '1',
                        keyboardType: TextInputType.number,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 14),

                Row(
                  children: [
                    Expanded(
                      child: CustomTextField(
                        controller: _areaController,
                        label: 'Area (sq. ft)',
                        hintText: 'e.g. 1200',
                        keyboardType: TextInputType.number,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: CustomTextField(
                        controller: _floorController,
                        label: 'Floor',
                        hintText: 'e.g. 4th Floor',
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 14),

                // Furnished Status
                const Text(
                  'Furnishing Status',
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  children: AppConstants.furnishingOptions.map((opt) {
                    final isSelected = _selectedFurnished == opt;
                    return ChoiceChip(
                      label: Text(opt.toUpperCase()),
                      selected: isSelected,
                      selectedColor: AppColors.primarySoft,
                      labelStyle: TextStyle(
                        color: isSelected ? AppColors.primaryDark : AppColors.textSecondary,
                        fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                        fontSize: 11,
                      ),
                      side: BorderSide(
                        color: isSelected ? AppColors.primary : AppColors.border,
                      ),
                      onSelected: (val) {
                        if (val) setState(() => _selectedFurnished = opt);
                      },
                    );
                  }).toList(),
                ),
                const Divider(height: 32),

                // Step 3: Amenities
                const Text(
                  '3. Amenities & Facilities',
                  style: TextStyle(fontSize: 17, fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: AppConstants.amenities.map((a) {
                    final id = a['id'] as String;
                    final isSelected = _selectedAmenities.contains(id);
                    return AmenityChip(
                      amenityId: id,
                      isSelected: isSelected,
                      onTap: () {
                        setState(() {
                          if (isSelected) {
                            _selectedAmenities.remove(id);
                          } else {
                            _selectedAmenities.add(id);
                          }
                        });
                      },
                    );
                  }).toList(),
                ),
                const Divider(height: 32),

                // Step 4: Location & GPS
                const Text(
                  '4. Property Location',
                  style: TextStyle(fontSize: 17, fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: 12),

                // Division Dropdown
                const Text(
                  'Division / City',
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 6),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14),
                  decoration: BoxDecoration(
                    border: Border.all(color: AppColors.border),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<String>(
                      value: _selectedCity,
                      isExpanded: true,
                      items: AppConstants.divisions.map((div) {
                        return DropdownMenuItem(value: div, child: Text(div));
                      }).toList(),
                      onChanged: (val) {
                        if (val != null) {
                          setState(() => _selectedCity = val);
                          _mapKey.currentState?.animateToCity(val);
                        }
                      },
                    ),
                  ),
                ),
                const SizedBox(height: 14),

                CustomTextField(
                  controller: _areaLocationController,
                  label: 'Area / Thana',
                  hintText: 'e.g. Mirpur 10, Sector 4, Dhanmondi',
                ),
                const SizedBox(height: 14),

                CustomTextField(
                  controller: _addressController,
                  label: 'Detailed Address',
                  hintText: 'e.g. House 14, Road 5, Block C',
                  validator: (val) =>
                      val == null || val.trim().isEmpty ? 'Address is required' : null,
                ),
                const SizedBox(height: 16),

                // Interactive Google Map Picker (Webapp Style)
                MapLocationPicker(
                  key: _mapKey,
                  selectedCity: _selectedCity,
                  initialLat: _lat,
                  initialLng: _lng,
                  onLocationChanged: (lat, lng) {
                    setState(() {
                      _lat = lat;
                      _lng = lng;
                    });
                  },
                ),
                const Divider(height: 32),

                // Step 5: Description
                const Text(
                  '5. Description',
                  style: TextStyle(fontSize: 17, fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: 12),
                CustomTextField(
                  controller: _descriptionController,
                  hintText: 'Describe details about the flat, environment, bills, etc.',
                  maxLines: 4,
                  validator: (val) => val == null || val.trim().isEmpty
                      ? 'Description is required'
                      : null,
                ),
                const Divider(height: 32),

                // Step 6: Photos Upload
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      '6. Property Photos',
                      style: TextStyle(fontSize: 17, fontWeight: FontWeight.w700),
                    ),
                    Text(
                      '${_selectedImages.length} / 8 photos',
                      style: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                // Photo picker grid
                Wrap(
                  spacing: 12,
                  runSpacing: 12,
                  children: [
                    ..._selectedImages.asMap().entries.map((entry) {
                      final idx = entry.key;
                      final file = entry.value;
                      return Stack(
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(12),
                            child: Image.file(
                              file,
                              width: 90,
                              height: 90,
                              fit: BoxFit.cover,
                            ),
                          ),
                          Positioned(
                            top: 4,
                            right: 4,
                            child: GestureDetector(
                              onTap: () {
                                setState(() {
                                  _selectedImages.removeAt(idx);
                                });
                              },
                              child: const CircleAvatar(
                                radius: 11,
                                backgroundColor: Colors.red,
                                child: Icon(Icons.close, size: 14, color: Colors.white),
                              ),
                            ),
                          ),
                        ],
                      );
                    }),
                    if (_selectedImages.length < 8)
                      Container(
                        width: 90,
                        height: 90,
                        decoration: BoxDecoration(
                          color: AppColors.surfaceMuted,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: AppColors.border,
                            style: BorderStyle.solid,
                          ),
                        ),
                        child: PopupMenuButton<ImageSource>(
                          icon: const Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.add_a_photo_outlined, color: AppColors.primary, size: 28),
                              SizedBox(height: 4),
                              Text('Add', style: TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                            ],
                          ),
                          onSelected: _pickImage,
                          itemBuilder: (context) => [
                            const PopupMenuItem(
                              value: ImageSource.camera,
                              child: Row(
                                children: [
                                  Icon(Icons.camera_alt_outlined, color: AppColors.primary),
                                  SizedBox(width: 8),
                                  Text('Take Photo'),
                                ],
                              ),
                            ),
                            const PopupMenuItem(
                              value: ImageSource.gallery,
                              child: Row(
                                children: [
                                  Icon(Icons.photo_library_outlined, color: AppColors.primary),
                                  SizedBox(width: 8),
                                  Text('Choose from Gallery'),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 36),

                // Submit Button
                CustomButton(
                  text: 'Submit Listing for Approval',
                  isLoading: listingProvider.isLoading,
                  onPressed: _submit,
                ),
                const SizedBox(height: 24),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
