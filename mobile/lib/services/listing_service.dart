import 'dart:convert';
import 'dart:io';
import 'package:dio/dio.dart';
import '../core/constants/api_constants.dart';
import '../core/network/dio_client.dart';
import '../models/listing_model.dart';

class ListingService {
  final Dio _dio = DioClient().dio;

  /// Fetch listings with filtering, search, and pagination
  Future<Map<String, dynamic>> getListings({
    String? search,
    String? type,
    String? city,
    String? area,
    double? minRent,
    double? maxRent,
    int? bedrooms,
    String? furnished,
    int page = 1,
    int limit = 12,
  }) async {
    final queryParams = <String, dynamic>{
      'page': page,
      'limit': limit,
    };

    if (search != null && search.trim().isNotEmpty) {
      queryParams['search'] = search.trim();
    }
    if (type != null && type.isNotEmpty && type != 'all') {
      queryParams['type'] = type;
    }
    if (city != null && city.isNotEmpty && city != 'all') {
      queryParams['city'] = city;
    }
    if (area != null && area.trim().isNotEmpty) {
      queryParams['area'] = area.trim();
    }
    if (minRent != null) queryParams['minRent'] = minRent;
    if (maxRent != null) queryParams['maxRent'] = maxRent;
    if (bedrooms != null) queryParams['bedrooms'] = bedrooms;
    if (furnished != null && furnished.isNotEmpty) {
      queryParams['furnished'] = furnished;
    }

    final response = await _dio.get(
      ApiConstants.listings,
      queryParameters: queryParams,
    );

    final List<dynamic> rawList = response.data['listings'] ?? [];
    final List<ListingModel> listings =
        rawList.map((item) => ListingModel.fromJson(item)).toList();

    return {
      'listings': listings,
      'total': response.data['total'] ?? 0,
      'page': response.data['page'] ?? 1,
      'pages': response.data['pages'] ?? 1,
    };
  }

  /// Get single listing by ID (increments views on backend)
  Future<ListingModel> getListingById(String id) async {
    final response = await _dio.get(ApiConstants.listingById(id));
    return ListingModel.fromJson(response.data);
  }

  /// Get listings created by currently logged-in user
  Future<List<ListingModel>> getMyListings() async {
    final response = await _dio.get(ApiConstants.myListings);
    final List<dynamic> rawList = response.data ?? [];
    return rawList.map((item) => ListingModel.fromJson(item)).toList();
  }

  /// Create a new listing with multipart image files
  Future<ListingModel> createListing({
    required String title,
    required String description,
    required String type,
    required double rent,
    bool negotiable = false,
    int bedrooms = 1,
    int bathrooms = 1,
    double? area,
    String? floor,
    String furnished = 'unfurnished',
    List<String> amenities = const [],
    required String address,
    required String city,
    String? locationArea,
    double? lat,
    double? lng,
    DateTime? availableFrom,
    List<File> imageFiles = const [],
  }) async {
    final Map<String, dynamic> formMap = {
      'title': title,
      'description': description,
      'type': type,
      'rent': rent.toString(),
      'negotiable': negotiable.toString(),
      'bedrooms': bedrooms.toString(),
      'bathrooms': bathrooms.toString(),
      if (area != null) 'area': area.toString(),
      if (floor != null) 'floor': floor,
      'furnished': furnished,
      'amenities': jsonEncode(amenities),
      'address': address,
      'city': city,
      if (locationArea != null) 'locationArea': locationArea,
      if (lat != null) 'lat': lat.toString(),
      if (lng != null) 'lng': lng.toString(),
      if (availableFrom != null)
        'availableFrom': availableFrom.toIso8601String(),
    };

    final formData = FormData.fromMap(formMap);

    // Attach images as multipart files
    for (var file in imageFiles) {
      formData.files.add(
        MapEntry(
          'images',
          await MultipartFile.fromFile(
            file.path,
            filename: file.path.split('/').last,
          ),
        ),
      );
    }

    final response = await _dio.post(
      ApiConstants.listings,
      data: formData,
      options: Options(contentType: 'multipart/form-data'),
    );

    return ListingModel.fromJson(response.data);
  }

  /// Update an existing listing
  Future<ListingModel> updateListing({
    required String id,
    Map<String, dynamic>? textFields,
    List<String>? amenities,
    List<File> newImageFiles = const [],
  }) async {
    final Map<String, dynamic> formMap = {...?textFields};

    if (amenities != null) {
      formMap['amenities'] = jsonEncode(amenities);
    }

    final formData = FormData.fromMap(formMap);

    for (var file in newImageFiles) {
      formData.files.add(
        MapEntry(
          'images',
          await MultipartFile.fromFile(
            file.path,
            filename: file.path.split('/').last,
          ),
        ),
      );
    }

    final response = await _dio.put(
      ApiConstants.listingById(id),
      data: formData,
      options: Options(contentType: 'multipart/form-data'),
    );

    return ListingModel.fromJson(response.data);
  }

  /// Delete a listing
  Future<void> deleteListing(String id) async {
    await _dio.delete(ApiConstants.listingById(id));
  }

  /// Delete an individual image from a listing (removes from Cloudinary & DB)
  Future<void> deleteListingImage(String listingId, String imageUrl) async {
    await _dio.delete(
      ApiConstants.listingImages(listingId),
      data: {'imageUrl': imageUrl},
    );
  }
}
