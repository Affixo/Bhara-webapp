import 'dart:io';
import 'package:dio/dio.dart';
import '../core/constants/api_constants.dart';
import '../core/network/dio_client.dart';
import '../models/user_model.dart';

class AuthService {
  final Dio _dio = DioClient().dio;

  /// Register a new account
  Future<UserModel> register({
    required String name,
    required String email,
    required String phone,
    required String password,
  }) async {
    final response = await _dio.post(
      ApiConstants.register,
      data: {
        'name': name.trim(),
        'email': email.trim().toLowerCase(),
        'phone': phone.trim(),
        'password': password,
      },
    );
    return UserModel.fromJson(response.data);
  }

  /// Login with email and password
  Future<UserModel> login({
    required String email,
    required String password,
  }) async {
    final response = await _dio.post(
      ApiConstants.login,
      data: {
        'email': email.trim().toLowerCase(),
        'password': password,
      },
    );
    return UserModel.fromJson(response.data);
  }

  /// Get current user profile
  Future<UserModel> getMe() async {
    final response = await _dio.get(ApiConstants.getMe);
    return UserModel.fromJson(response.data);
  }

  /// Update user profile details (optionally upload new avatar image)
  Future<UserModel> updateProfile({
    String? name,
    String? phone,
    String? password,
    File? avatarFile,
  }) async {
    final Map<String, dynamic> map = {};
    if (name != null) map['name'] = name.trim();
    if (phone != null) map['phone'] = phone.trim();
    if (password != null && password.isNotEmpty) map['password'] = password;

    if (avatarFile != null) {
      final fileName = avatarFile.path.split(RegExp(r'[/\\]')).last;
      map['avatar'] = await MultipartFile.fromFile(
        avatarFile.path,
        filename: fileName,
      );
    }

    final formData = FormData.fromMap(map);
    final response = await _dio.put(
      ApiConstants.updateProfile,
      data: formData,
      options: Options(contentType: 'multipart/form-data'),
    );
    return UserModel.fromJson(response.data);
  }
}
