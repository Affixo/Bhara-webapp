import 'dart:async';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import '../models/conversation_model.dart';
import '../services/chat_service.dart';

class ChatProvider extends ChangeNotifier {
  final ChatService _chatService = ChatService();

  List<ConversationModel> _conversations = [];
  ConversationModel? _activeConversation;
  int _unreadCount = 0;
  bool _isLoading = false;
  String? _errorMessage;

  Timer? _pollingTimer;

  List<ConversationModel> get conversations => _conversations;
  ConversationModel? get activeConversation => _activeConversation;
  int get unreadCount => _unreadCount;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  /// Clear all chat data and stop polling on logout/account switch
  void clearData() {
    stopPolling();
    _conversations = [];
    _activeConversation = null;
    _unreadCount = 0;
    _errorMessage = null;
    notifyListeners();
  }

  /// Fetch all conversations
  Future<void> fetchConversations() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _conversations = await _chatService.getMyConversations();
      await fetchUnreadCount();
    } on DioException catch (e) {
      _errorMessage = e.error?.toString() ?? 'Failed to load messages';
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Start or open conversation about a listing
  Future<ConversationModel?> startConversation(String listingId) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final convo = await _chatService.startConversation(listingId);
      _activeConversation = convo;
      final existingIndex = _conversations.indexWhere((c) => c.id == convo.id);
      if (existingIndex != -1) {
        _conversations[existingIndex] = convo;
      } else {
        _conversations.insert(0, convo);
      }
      _isLoading = false;
      notifyListeners();
      return convo;
    } on DioException catch (e) {
      _errorMessage = e.error?.toString() ?? 'Could not start chat';
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

  /// Open a specific conversation
  Future<void> openConversation(String id) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _activeConversation = await _chatService.getConversationById(id);
      final index = _conversations.indexWhere((c) => c.id == id);
      if (index != -1 && _activeConversation != null) {
        _conversations[index] = _activeConversation!;
      }
      await fetchUnreadCount();
    } on DioException catch (e) {
      _errorMessage = e.error?.toString() ?? 'Failed to open conversation';
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Optimistically mark a conversation's messages as read locally
  void markConversationAsReadLocally(String convoId, String currentUserId) {
    final index = _conversations.indexWhere((c) => c.id == convoId);
    if (index != -1) {
      final convo = _conversations[index];
      final unreadFromConvo = convo.getUnreadCount(currentUserId);

      if (unreadFromConvo > 0) {
        final updatedMessages = convo.messages.map((m) {
          final sId = m.senderId ?? m.sender?.id ?? '';
          if (sId.isNotEmpty && sId != currentUserId && !m.read) {
            return MessageModel(
              id: m.id,
              sender: m.sender,
              senderId: m.senderId,
              text: m.text,
              read: true,
              createdAt: m.createdAt,
            );
          }
          return m;
        }).toList();

        _conversations[index] = ConversationModel(
          id: convo.id,
          listing: convo.listing,
          listingId: convo.listingId,
          participants: convo.participants,
          messages: updatedMessages,
          lastMessage: convo.lastMessage,
          createdAt: convo.createdAt,
        );

        _unreadCount = (_unreadCount - unreadFromConvo).clamp(0, 999999);
        notifyListeners();
      }
    }
  }

  /// Call when user closes or leaves ChatDetailScreen
  Future<void> onLeaveConversation() async {
    _activeConversation = null;
    await fetchUnreadCount();
  }

  /// Send a message
  Future<bool> sendMessage(String text) async {
    if (_activeConversation == null || text.trim().isEmpty) return false;

    try {
      final updated = await _chatService.sendMessage(
        _activeConversation!.id,
        text,
      );
      _activeConversation = updated;
      final index = _conversations.indexWhere((c) => c.id == updated.id);
      if (index != -1) {
        _conversations[index] = updated;
      }
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString();
      notifyListeners();
      return false;
    }
  }

  /// Fetch unread badge count
  Future<void> fetchUnreadCount() async {
    try {
      _unreadCount = await _chatService.getUnreadCount();
      notifyListeners();
    } catch (_) {}
  }

  /// Polling for live chat updates (4-second interval as defined in SDP-II report)
  void startPolling() {
    stopPolling();
    _pollingTimer = Timer.periodic(const Duration(seconds: 4), (_) async {
      if (_activeConversation != null) {
        try {
          final refreshed = await _chatService.getConversationById(_activeConversation!.id);
          _activeConversation = refreshed;
          notifyListeners();
        } catch (_) {}
      } else {
        await fetchUnreadCount();
      }
    });
  }

  void stopPolling() {
    _pollingTimer?.cancel();
    _pollingTimer = null;
  }

  @override
  void dispose() {
    stopPolling();
    super.dispose();
  }
}
