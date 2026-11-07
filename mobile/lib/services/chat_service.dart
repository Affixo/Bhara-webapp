import 'package:dio/dio.dart';
import '../core/constants/api_constants.dart';
import '../core/network/dio_client.dart';
import '../models/conversation_model.dart';

class ChatService {
  final Dio _dio = DioClient().dio;

  /// Start a new conversation or retrieve existing one for a listing
  Future<ConversationModel> startConversation(String listingId) async {
    final response = await _dio.post(
      ApiConstants.conversations,
      data: {'listingId': listingId},
    );
    return ConversationModel.fromJson(response.data);
  }

  /// Get all user conversations
  Future<List<ConversationModel>> getMyConversations() async {
    final response = await _dio.get(ApiConstants.conversations);
    final List<dynamic> list = response.data ?? [];
    return list.map((e) => ConversationModel.fromJson(e)).toList();
  }

  /// Get single conversation by ID
  Future<ConversationModel> getConversationById(String id) async {
    final response = await _dio.get(ApiConstants.conversationById(id));
    return ConversationModel.fromJson(response.data);
  }

  /// Send a message in a conversation
  Future<ConversationModel> sendMessage(String conversationId, String text) async {
    final response = await _dio.post(
      ApiConstants.conversationMessages(conversationId),
      data: {'text': text.trim()},
    );
    return ConversationModel.fromJson(response.data);
  }

  /// Get total unread messages count
  Future<int> getUnreadCount() async {
    try {
      final response = await _dio.get(ApiConstants.unreadCount);
      return response.data['count'] ?? 0;
    } catch (_) {
      return 0;
    }
  }
}
