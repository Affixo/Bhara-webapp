import 'package:dio/dio.dart';
import '../core/constants/api_constants.dart';
import '../core/network/dio_client.dart';
import '../models/rent_request_model.dart';

class RequestService {
  final Dio _dio = DioClient().dio;

  /// Send a rent request for a listing
  Future<RentRequestModel> createRequest({
    required String listingId,
    String? message,
    DateTime? moveInDate,
  }) async {
    final response = await _dio.post(
      ApiConstants.requests,
      data: {
        'listingId': listingId,
        if (message != null) 'message': message.trim(),
        if (moveInDate != null) 'moveInDate': moveInDate.toIso8601String(),
      },
    );
    return RentRequestModel.fromJson(response.data);
  }

  /// Get requests sent by the current user
  Future<List<RentRequestModel>> getMyRequests() async {
    final response = await _dio.get(ApiConstants.myRequests);
    final List<dynamic> list = response.data ?? [];
    return list.map((e) => RentRequestModel.fromJson(e)).toList();
  }

  /// Get requests received by current user (for their posted listings)
  Future<List<RentRequestModel>> getReceivedRequests() async {
    final response = await _dio.get(ApiConstants.receivedRequests);
    final List<dynamic> list = response.data ?? [];
    return list.map((e) => RentRequestModel.fromJson(e)).toList();
  }

  /// Update request status (e.g. 'approved' or 'rejected')
  Future<RentRequestModel> updateRequestStatus(String id, String status) async {
    final response = await _dio.put(
      ApiConstants.requestById(id),
      data: {'status': status},
    );
    return RentRequestModel.fromJson(response.data);
  }
}
