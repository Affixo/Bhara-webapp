import 'dart:io';
import 'package:flutter/foundation.dart';

class ApiConstants {
  // Automatically route to local server in debug mode, or live Render in production
  static String get baseUrl {
    if (kDebugMode) {
      if (kIsWeb) return "http://localhost:5000/api";
      if (Platform.isAndroid) return "http://10.0.2.2:5000/api";
      return "http://localhost:5000/api";
    }
    return "https://bhara-webapp-backend.onrender.com/api";
  }

  // Base domain without /api (used for static image resolution if needed)
  static String get baseDomain {
    if (kDebugMode) {
      if (kIsWeb) return "http://localhost:5000";
      if (Platform.isAndroid) return "http://10.0.2.2:5000";
      return "http://localhost:5000";
    }
    return "https://bhara-webapp-backend.onrender.com";
  }

  // Auth Endpoints
  static const String register = "/auth/register";
  static const String login = "/auth/login";
  static const String getMe = "/auth/me";
  static const String updateProfile = "/auth/profile";

  // Listings Endpoints
  static const String listings = "/listings";
  static const String myListings = "/listings/my";
  static String listingById(String id) => "/listings/$id";
  static String listingImages(String id) => "/listings/$id/images";

  // Requests Endpoints
  static const String requests = "/requests";
  static const String myRequests = "/requests/my";
  static const String receivedRequests = "/requests/received";
  static String requestById(String id) => "/requests/$id";

  // Conversation & Chat Endpoints
  static const String conversations = "/conversations";
  static const String unreadCount = "/conversations/unread-count";
  static String conversationById(String id) => "/conversations/$id";
  static String conversationMessages(String id) => "/conversations/$id/messages";

  // Admin Endpoints
  static const String adminStats = "/admin/stats";
  static const String adminUsers = "/admin/users";
  static String adminToggleUser(String id) => "/admin/users/$id/toggle";
  static String adminDeleteUser(String id) => "/admin/users/$id";
  static const String adminListings = "/admin/listings";
  static String adminToggleListing(String id) => "/admin/listings/$id/toggle";
  static String adminDeleteListing(String id) => "/admin/listings/$id";
  static const String adminRequests = "/admin/requests";
}
