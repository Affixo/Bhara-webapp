import 'package:dio/dio.dart';
import '../core/constants/api_constants.dart';
import '../core/network/dio_client.dart';
import '../models/listing_model.dart';
import '../models/user_model.dart';
import '../models/rent_request_model.dart';

class AdminService {
  final Dio _dio = DioClient().dio;

  /// Get Admin Dashboard overview statistics
  Future<Map<String, dynamic>> getDashboardStats() async {
    final response = await _dio.get(ApiConstants.adminStats);
    return response.data as Map<String, dynamic>;
  }

  /// Get all registered users
  Future<List<UserModel>> getAllUsers() async {
    final response = await _dio.get(ApiConstants.adminUsers);
    final List<dynamic> list = response.data ?? [];
    return list.map((e) => UserModel.fromJson(e)).toList();
  }

  /// Toggle user active/deactive status
  Future<bool> toggleUserStatus(String userId) async {
    final response = await _dio.put(ApiConstants.adminToggleUser(userId));
    return response.data['isActive'] ?? false;
  }

  /// Delete a user
  Future<void> deleteUser(String userId) async {
    await _dio.delete(ApiConstants.adminDeleteUser(userId));
  }

  /// Get all listings for moderation
  Future<List<ListingModel>> getAllListings() async {
    final response = await _dio.get(ApiConstants.adminListings);
    final List<dynamic> list = response.data ?? [];
    return list.map((e) => ListingModel.fromJson(e)).toList();
  }

  /// Toggle approval status of a listing
  Future<bool> toggleListingApproval(String listingId) async {
    final response = await _dio.put(ApiConstants.adminToggleListing(listingId));
    return response.data['isApproved'] ?? false;
  }

  /// Delete a listing as admin
  Future<void> deleteListing(String listingId) async {
    await _dio.delete(ApiConstants.adminDeleteListing(listingId));
  }

  /// Get all rent requests across the platform
  Future<List<RentRequestModel>> getAllRequests() async {
    final response = await _dio.get(ApiConstants.adminRequests);
    final List<dynamic> list = response.data ?? [];
    return list.map((e) => RentRequestModel.fromJson(e)).toList();
  }
}
