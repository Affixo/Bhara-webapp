import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import '../models/rent_request_model.dart';
import '../services/request_service.dart';

class RequestProvider extends ChangeNotifier {
  final RequestService _requestService = RequestService();

  List<RentRequestModel> _sentRequests = [];
  List<RentRequestModel> _receivedRequests = [];

  bool _isLoading = false;
  String? _errorMessage;

  List<RentRequestModel> get sentRequests => _sentRequests;
  List<RentRequestModel> get receivedRequests => _receivedRequests;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  /// Clear user request data on logout/account switch
  void clearData() {
    _sentRequests = [];
    _receivedRequests = [];
    _errorMessage = null;
    notifyListeners();
  }

  /// Fetch requests sent by current user
  Future<void> fetchSentRequests() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _sentRequests = await _requestService.getMyRequests();
    } on DioException catch (e) {
      _errorMessage = e.error?.toString() ?? 'Failed to load sent requests';
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Fetch requests received by current user for their listings
  Future<void> fetchReceivedRequests() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _receivedRequests = await _requestService.getReceivedRequests();
    } on DioException catch (e) {
      _errorMessage = e.error?.toString() ?? 'Failed to load received requests';
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Send a new rent request
  Future<bool> createRequest({
    required String listingId,
    String? message,
    DateTime? moveInDate,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final req = await _requestService.createRequest(
        listingId: listingId,
        message: message,
        moveInDate: moveInDate,
      );
      _sentRequests.insert(0, req);
      _isLoading = false;
      notifyListeners();
      return true;
    } on DioException catch (e) {
      _errorMessage = e.error?.toString() ?? 'Failed to send request';
      _isLoading = false;
      notifyListeners();
      return false;
    } catch (e) {
      _errorMessage = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  /// Update request status (Approve or Reject)
  Future<bool> updateStatus(String requestId, String status) async {
    try {
      final updated = await _requestService.updateRequestStatus(requestId, status);
      final index = _receivedRequests.indexWhere((r) => r.id == requestId);
      if (index != -1) {
        _receivedRequests[index] = updated;
        notifyListeners();
      }
      return true;
    } catch (e) {
      _errorMessage = e.toString();
      notifyListeners();
      return false;
    }
  }
}
