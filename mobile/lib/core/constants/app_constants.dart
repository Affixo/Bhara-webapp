import 'package:flutter/material.dart';

class AppConstants {
  static const String appName = 'Bhara';
  static const String appTagline = 'Find Your Perfect To-Let in Bangladesh';

  // Rental Types exactly matching backend schema
  static const List<Map<String, dynamic>> rentalTypes = [
    {
      'id': 'family',
      'label': 'Family Flat',
      'icon': Icons.family_restroom,
      'description': 'Full apartments suitable for families',
    },
    {
      'id': 'bachelor',
      'label': 'Bachelor',
      'icon': Icons.person,
      'description': 'Rooms/flats for working individuals or students',
    },
    {
      'id': 'sublet',
      'label': 'Sublet',
      'icon': Icons.meeting_room,
      'description': 'Single room sublet in a shared apartment',
    },
    {
      'id': 'office',
      'label': 'Office Space',
      'icon': Icons.business,
      'description': 'Commercial office space or shop',
    },
    {
      'id': 'seat',
      'label': 'Seat Rent',
      'icon': Icons.bed,
      'description': 'Single bed/seat in a shared bachelor room',
    },
  ];

  // 8 Administrative Divisions of Bangladesh
  static const List<String> divisions = [
    'Dhaka',
    'Chittagong',
    'Sylhet',
    'Rajshahi',
    'Khulna',
    'Barisal',
    'Rangpur',
    'Mymensingh',
  ];

  // Popular Areas in Dhaka for Quick Search
  static const List<String> popularDhakaAreas = [
    'Mirpur',
    'Uttara',
    'Dhanmondi',
    'Gulshan',
    'Banani',
    'Mohammadpur',
    'Badda',
    'Bashundhara R/A',
    'Farmgate',
    'Khilgaon',
  ];

  // Furnishing Statuses
  static const List<String> furnishingOptions = [
    'unfurnished',
    'semi-furnished',
    'furnished',
  ];

  // Amenities supported by the platform
  static const List<Map<String, dynamic>> amenities = [
    {'id': 'gas', 'label': 'Gas Line / Cylinder', 'icon': Icons.local_fire_department},
    {'id': 'wifi', 'label': 'High-Speed Wi-Fi', 'icon': Icons.wifi},
    {'id': 'parking', 'label': 'Parking Space', 'icon': Icons.directions_car},
    {'id': 'generator', 'label': 'Generator Backup', 'icon': Icons.electric_bolt},
    {'id': 'lift', 'label': 'Elevator / Lift', 'icon': Icons.elevator},
    {'id': 'cctv', 'label': 'CCTV Security', 'icon': Icons.videocam},
    {'id': 'balcony', 'label': 'Balcony', 'icon': Icons.balcony},
    {'id': 'water', 'label': '24/7 Running Water', 'icon': Icons.water_drop},
  ];
}
