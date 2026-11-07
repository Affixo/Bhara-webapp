import 'listing_model.dart';
import 'user_model.dart';

class MessageModel {
  final String id;
  final UserModel? sender;
  final String? senderId;
  final String text;
  final bool read;
  final DateTime? createdAt;

  MessageModel({
    required this.id,
    this.sender,
    this.senderId,
    required this.text,
    this.read = false,
    this.createdAt,
  });

  factory MessageModel.fromJson(Map<String, dynamic> json) {
    UserModel? parsedSender;
    String? rawSenderId;
    if (json['sender'] != null) {
      if (json['sender'] is Map<String, dynamic>) {
        parsedSender = UserModel.fromJson(json['sender']);
        rawSenderId = parsedSender.id;
      } else if (json['sender'] is String) {
        rawSenderId = json['sender'];
      }
    }

    return MessageModel(
      id: json['_id'] ?? json['id'] ?? '',
      sender: parsedSender,
      senderId: rawSenderId,
      text: json['text'] ?? '',
      read: json['read'] ?? false,
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'sender': senderId ?? sender?.id,
      'text': text,
      'read': read,
    };
  }
}

class ConversationModel {
  final String id;
  final ListingModel? listing;
  final String? listingId;
  final List<UserModel> participants;
  final List<MessageModel> messages;
  final DateTime? lastMessage;
  final DateTime? createdAt;

  ConversationModel({
    required this.id,
    this.listing,
    this.listingId,
    this.participants = const [],
    this.messages = const [],
    this.lastMessage,
    this.createdAt,
  });

  // Get the other participant (the one who is not the current user)
  UserModel? getOtherParticipant(String currentUserId) {
    return participants.firstWhere(
      (p) => p.id != currentUserId,
      orElse: () => UserModel(id: '', name: 'User', email: '', phone: '', role: 'user'),
    );
  }

  // Get count of unread messages sent by the other participant
  int getUnreadCount(String currentUserId) {
    if (messages.isEmpty) return 0;
    return messages.where((m) {
      final sId = m.senderId ?? m.sender?.id ?? '';
      return sId.isNotEmpty && sId != currentUserId && !m.read;
    }).length;
  }

  // Check if there are any unread messages for this user
  bool hasUnread(String currentUserId) {
    return getUnreadCount(currentUserId) > 0;
  }

  // Last message snippet
  String get lastMessagePreview {
    if (messages.isEmpty) return 'No messages yet';
    return messages.last.text;
  }

  factory ConversationModel.fromJson(Map<String, dynamic> json) {
    ListingModel? parsedListing;
    String? rawListingId;
    if (json['listing'] != null) {
      if (json['listing'] is Map<String, dynamic>) {
        parsedListing = ListingModel.fromJson(json['listing']);
        rawListingId = parsedListing.id;
      } else if (json['listing'] is String) {
        rawListingId = json['listing'];
      }
    }

    List<UserModel> parsedParticipants = [];
    if (json['participants'] != null && json['participants'] is List) {
      for (var p in json['participants']) {
        if (p is Map<String, dynamic>) {
          parsedParticipants.add(UserModel.fromJson(p));
        }
      }
    }

    List<MessageModel> parsedMessages = [];
    if (json['messages'] != null && json['messages'] is List) {
      for (var m in json['messages']) {
        if (m is Map<String, dynamic>) {
          parsedMessages.add(MessageModel.fromJson(m));
        }
      }
    }

    return ConversationModel(
      id: json['_id'] ?? json['id'] ?? '',
      listing: parsedListing,
      listingId: rawListingId,
      participants: parsedParticipants,
      messages: parsedMessages,
      lastMessage: json['lastMessage'] != null
          ? DateTime.tryParse(json['lastMessage'])
          : null,
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'])
          : null,
    );
  }
}
