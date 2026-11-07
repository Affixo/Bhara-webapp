import 'user_model.dart';

class LocationModel {
  final String address;
  final String city;
  final String area;
  final double? lat;
  final double? lng;

  LocationModel({
    required this.address,
    required this.city,
    this.area = '',
    this.lat,
    this.lng,
  });

  factory LocationModel.fromJson(Map<String, dynamic> json) {
    return LocationModel(
      address: json['address'] ?? '',
      city: json['city'] ?? '',
      area: json['area'] ?? '',
      lat: json['lat'] != null ? (json['lat'] as num).toDouble() : null,
      lng: json['lng'] != null ? (json['lng'] as num).toDouble() : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'address': address,
      'city': city,
      'area': area,
      'lat': lat,
      'lng': lng,
    };
  }
}

class ListingModel {
  final String id;
  final UserModel? owner;
  final String? ownerId;
  final String title;
  final String description;
  final String type; // family, bachelor, sublet, office, seat
  final double rent;
  final bool negotiable;
  final int bedrooms;
  final int bathrooms;
  final double? area; // sq ft
  final String? floor;
  final String furnished; // furnished, semi-furnished, unfurnished
  final List<String> amenities;
  final List<String> images;
  final LocationModel location;
  final DateTime? availableFrom;
  final String status; // available, rented, pending
  final bool isApproved;
  final int views;
  final DateTime? createdAt;

  ListingModel({
    required this.id,
    this.owner,
    this.ownerId,
    required this.title,
    required this.description,
    required this.type,
    required this.rent,
    this.negotiable = false,
    this.bedrooms = 1,
    this.bathrooms = 1,
    this.area,
    this.floor,
    this.furnished = 'unfurnished',
    this.amenities = const [],
    this.images = const [],
    required this.location,
    this.availableFrom,
    this.status = 'available',
    this.isApproved = true,
    this.views = 0,
    this.createdAt,
  });

  bool get isAvailable => status == 'available';

  factory ListingModel.fromJson(Map<String, dynamic> json) {
    UserModel? parsedOwner;
    String? rawOwnerId;

    if (json['owner'] != null) {
      if (json['owner'] is Map<String, dynamic>) {
        parsedOwner = UserModel.fromJson(json['owner']);
        rawOwnerId = parsedOwner.id;
      } else if (json['owner'] is String) {
        rawOwnerId = json['owner'];
      }
    }

    return ListingModel(
      id: json['_id'] ?? json['id'] ?? '',
      owner: parsedOwner,
      ownerId: rawOwnerId,
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      type: json['type'] ?? 'family',
      rent: json['rent'] != null ? (json['rent'] as num).toDouble() : 0.0,
      negotiable: json['negotiable'] ?? false,
      bedrooms: json['bedrooms'] ?? 1,
      bathrooms: json['bathrooms'] ?? 1,
      area: json['area'] != null ? (json['area'] as num).toDouble() : null,
      floor: json['floor']?.toString(),
      furnished: json['furnished'] ?? 'unfurnished',
      amenities: (json['amenities'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          [],
      images: (json['images'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          [],
      location: json['location'] != null
          ? LocationModel.fromJson(json['location'])
          : LocationModel(address: '', city: ''),
      availableFrom: json['availableFrom'] != null
          ? DateTime.tryParse(json['availableFrom'])
          : null,
      status: json['status'] ?? 'available',
      isApproved: json['isApproved'] ?? true,
      views: json['views'] ?? 0,
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'title': title,
      'description': description,
      'type': type,
      'rent': rent,
      'negotiable': negotiable,
      'bedrooms': bedrooms,
      'bathrooms': bathrooms,
      'area': area,
      'floor': floor,
      'furnished': furnished,
      'amenities': amenities,
      'images': images,
      'location': location.toJson(),
      'status': status,
      'isApproved': isApproved,
      'views': views,
    };
  }
}
