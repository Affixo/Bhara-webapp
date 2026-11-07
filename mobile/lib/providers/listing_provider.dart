import 'dart:io';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import '../models/listing_model.dart';
import '../services/listing_service.dart';

class ListingProvider extends ChangeNotifier {
  final ListingService _listingService = ListingService();

  List<ListingModel> _listings = [];
  List<ListingModel> _myListings = [];
  ListingModel? _currentListing;

  bool _isLoading = false;
  bool _isLoadingMore = false;
  String? _errorMessage;

  int _currentPage = 1;
  int _totalPages = 1;
  int _totalCount = 0;

  // Filter State
  String? _searchQuery;
  String? _selectedType;
  String? _selectedCity;
  String? _selectedArea;
  double? _minRent;
  double? _maxRent;
  int? _bedrooms;
  String? _furnished;

  // Getters
  List<ListingModel> get listings => _listings;
  List<ListingModel> get myListings => _myListings;
  ListingModel? get currentListing => _currentListing;
  bool get isLoading => _isLoading;
  bool get isLoadingMore => _isLoadingMore;
  String? get errorMessage => _errorMessage;
  int get totalCount => _totalCount;
  bool get hasMore => _currentPage < _totalPages;

  String? get searchQuery => _searchQuery;
  String? get selectedType => _selectedType;
  String? get selectedCity => _selectedCity;
  String? get selectedArea => _selectedArea;
  double? get minRent => _minRent;
  double? get maxRent => _maxRent;
  int? get bedrooms => _bedrooms;
  String? get furnished => _furnished;

  /// Clear user-specific listing data on logout/account switch
  void clearUserData() {
    _myListings = [];
    _currentListing = null;
    _errorMessage = null;
    notifyListeners();
  }

  /// Fetch listings from scratch or apply current filters
  Future<void> fetchListings({bool refresh = false}) async {
    if (refresh) {
      _currentPage = 1;
      _isLoading = true;
      _errorMessage = null;
      notifyListeners();
    } else if (_isLoading) {
      return;
    }

    try {
      final result = await _listingService.getListings(
        search: _searchQuery,
        type: _selectedType,
        city: _selectedCity,
        area: _selectedArea,
        minRent: _minRent,
        maxRent: _maxRent,
        bedrooms: _bedrooms,
        furnished: _furnished,
        page: _currentPage,
      );

      final List<ListingModel> fetched = result['listings'];
      _totalPages = result['pages'];
      _totalCount = result['total'];

      if (_currentPage == 1) {
        _listings = fetched;
      } else {
        _listings.addAll(fetched);
      }
    } on DioException catch (e) {
      _errorMessage = e.error?.toString() ?? 'Failed to load listings';
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      _isLoadingMore = false;
      notifyListeners();
    }
  }

  /// Load next page for infinite scrolling
  Future<void> loadMore() async {
    if (_isLoadingMore || !hasMore) return;
    _isLoadingMore = true;
    _currentPage++;
    notifyListeners();
    await fetchListings();
  }

  /// Update search and filter parameters
  void setFilters({
    String? search,
    String? type,
    String? city,
    String? area,
    double? minRent,
    double? maxRent,
    int? bedrooms,
    String? furnished,
  }) {
    _searchQuery = search;
    _selectedType = type;
    _selectedCity = city;
    _selectedArea = area;
    _minRent = minRent;
    _maxRent = maxRent;
    _bedrooms = bedrooms;
    _furnished = furnished;
    fetchListings(refresh: true);
  }

  void clearFilters() {
    _searchQuery = null;
    _selectedType = null;
    _selectedCity = null;
    _selectedArea = null;
    _minRent = null;
    _maxRent = null;
    _bedrooms = null;
    _furnished = null;
    fetchListings(refresh: true);
  }

  /// Fetch single listing detail
  Future<void> fetchListingById(String id) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _currentListing = await _listingService.getListingById(id);
    } on DioException catch (e) {
      _errorMessage = e.error?.toString() ?? 'Failed to load property details';
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Fetch currently logged in user's own listings
  Future<void> fetchMyListings() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _myListings = await _listingService.getMyListings();
    } on DioException catch (e) {
      _errorMessage = e.error?.toString() ?? 'Failed to load your listings';
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Create a new listing
  Future<ListingModel?> createListing({
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
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final newListing = await _listingService.createListing(
        title: title,
        description: description,
        type: type,
        rent: rent,
        negotiable: negotiable,
        bedrooms: bedrooms,
        bathrooms: bathrooms,
        area: area,
        floor: floor,
        furnished: furnished,
        amenities: amenities,
        address: address,
        city: city,
        locationArea: locationArea,
        lat: lat,
        lng: lng,
        availableFrom: availableFrom,
        imageFiles: imageFiles,
      );

      _myListings.insert(0, newListing);
      _listings.insert(0, newListing);
      _isLoading = false;
      notifyListeners();
      return newListing;
    } on DioException catch (e) {
      _errorMessage = e.error?.toString() ?? 'Failed to create listing';
      _isLoading = false;
      notifyListeners();
      return null;
    } catch (e) {
      _errorMessage = e.toString();
      _isLoading = false;
      notifyListeners();
      return null;
    }
  }

  /// Delete a listing
  Future<bool> deleteListing(String id) async {
    try {
      await _listingService.deleteListing(id);
      _myListings.removeWhere((item) => item.id == id);
      _listings.removeWhere((item) => item.id == id);
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString();
      notifyListeners();
      return false;
    }
  }

  /// Delete an image from a listing
  Future<bool> deleteListingImage(String listingId, String imageUrl) async {
    try {
      await _listingService.deleteListingImage(listingId, imageUrl);
      if (_currentListing != null && _currentListing!.id == listingId) {
        _currentListing = ListingModel(
          id: _currentListing!.id,
          owner: _currentListing!.owner,
          ownerId: _currentListing!.ownerId,
          title: _currentListing!.title,
          description: _currentListing!.description,
          type: _currentListing!.type,
          rent: _currentListing!.rent,
          negotiable: _currentListing!.negotiable,
          bedrooms: _currentListing!.bedrooms,
          bathrooms: _currentListing!.bathrooms,
          area: _currentListing!.area,
          floor: _currentListing!.floor,
          furnished: _currentListing!.furnished,
          amenities: _currentListing!.amenities,
          images: _currentListing!.images.where((img) => img != imageUrl).toList(),
          location: _currentListing!.location,
          availableFrom: _currentListing!.availableFrom,
          status: _currentListing!.status,
          isApproved: _currentListing!.isApproved,
          views: _currentListing!.views,
          createdAt: _currentListing!.createdAt,
        );
        notifyListeners();
      }
      return true;
    } catch (e) {
      return false;
    }
  }
}
