import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import '../models/listing_model.dart';
import '../models/rent_request_model.dart';
import '../models/user_model.dart';
import '../services/admin_service.dart';

class AdminProvider extends ChangeNotifier {
  final AdminService _adminService = AdminService();

  Map<String, dynamic>? _stats;
  List<UserModel> _users = [];
  List<ListingModel> _listings = [];
  List<RentRequestModel> _requests = [];

  bool _isLoading = false;
  String? _errorMessage;

  Map<String, dynamic>? get stats => _stats;
  List<UserModel> get users => _users;
  List<ListingModel> get listings => _listings;
  List<RentRequestModel> get requests => _requests;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  /// Clear admin data on logout/account switch
  void clearData() {
    _stats = null;
    _users = [];
    _listings = [];
    _requests = [];
    _errorMessage = null;
    notifyListeners();
  }

  // Pending listings awaiting approval
  List<ListingModel> get pendingListings =>
      _listings.where((item) => !item.isApproved).toList();

  Future<void> fetchDashboardStats() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _stats = await _adminService.getDashboardStats();
    } on DioException catch (e) {
      _errorMessage = e.error?.toString() ?? 'Failed to load admin stats';
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchUsers() async {
    _isLoading = true;
    notifyListeners();
    try {
      _users = await _adminService.getAllUsers();
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> toggleUser(String userId) async {
    try {
      final updatedStatus = await _adminService.toggleUserStatus(userId);
      final index = _users.indexWhere((u) => u.id == userId);
      if (index != -1) {
        _users[index] = _users[index].copyWith(isActive: updatedStatus);
        notifyListeners();
      }
    } catch (e) {
      _errorMessage = e.toString();
      notifyListeners();
    }
  }

  Future<void> deleteUser(String userId) async {
    try {
      await _adminService.deleteUser(userId);
      _users.removeWhere((u) => u.id == userId);
      notifyListeners();
    } catch (e) {
      _errorMessage = e.toString();
      notifyListeners();
    }
  }

  Future<void> fetchListings() async {
    _isLoading = true;
    notifyListeners();
    try {
      _listings = await _adminService.getAllListings();
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> toggleListingApproval(String listingId) async {
    try {
      final newApproval = await _adminService.toggleListingApproval(listingId);
      final index = _listings.indexWhere((l) => l.id == listingId);
      if (index != -1) {
        final l = _listings[index];
        _listings[index] = ListingModel(
          id: l.id,
          owner: l.owner,
          ownerId: l.ownerId,
          title: l.title,
          description: l.description,
          type: l.type,
          rent: l.rent,
          negotiable: l.negotiable,
          bedrooms: l.bedrooms,
          bathrooms: l.bathrooms,
          area: l.area,
          floor: l.floor,
          furnished: l.furnished,
          amenities: l.amenities,
          images: l.images,
          location: l.location,
          availableFrom: l.availableFrom,
          status: l.status,
          isApproved: newApproval,
          views: l.views,
          createdAt: l.createdAt,
        );
        notifyListeners();
      }
    } catch (e) {
      _errorMessage = e.toString();
      notifyListeners();
    }
  }

  Future<void> deleteListing(String listingId) async {
    try {
      await _adminService.deleteListing(listingId);
      _listings.removeWhere((l) => l.id == listingId);
      notifyListeners();
    } catch (e) {
      _errorMessage = e.toString();
      notifyListeners();
    }
  }

  Future<void> fetchRequests() async {
    _isLoading = true;
    notifyListeners();
    try {
      _requests = await _adminService.getAllRequests();
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
