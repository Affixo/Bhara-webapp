import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/utils/image_helper.dart';
import '../../../providers/auth_provider.dart';
import '../../../providers/chat_provider.dart';

class ConversationListScreen extends StatefulWidget {
  const ConversationListScreen({Key? key}) : super(key: key);

  @override
  State<ConversationListScreen> createState() => _ConversationListScreenState();
}

class _ConversationListScreenState extends State<ConversationListScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final auth = Provider.of<AuthProvider>(context, listen: false);
      if (auth.isAuthenticated) {
        Provider.of<ChatProvider>(context, listen: false).fetchConversations();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final chatProvider = Provider.of<ChatProvider>(context);

    if (!auth.isAuthenticated) {
      return Scaffold(
        appBar: AppBar(title: const Text('Messages')),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(32),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.chat_outlined, size: 70, color: AppColors.primary),
                const SizedBox(height: 16),
                const Text(
                  'Your Messages',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Log in to chat with landlords, negotiate rent, and discuss move-in details.',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 14, color: AppColors.textSecondary),
                ),
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: () => context.push('/login'),
                  child: const Text('Log In'),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Messages & Bargaining'),
      ),
      body: RefreshIndicator(
        onRefresh: () => chatProvider.fetchConversations(),
        color: AppColors.primary,
        child: chatProvider.isLoading && chatProvider.conversations.isEmpty
            ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
            : chatProvider.conversations.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.forum_outlined, size: 60, color: Colors.grey.shade400),
                        const SizedBox(height: 12),
                        const Text(
                          'No conversations yet',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          'Tap "Chat / Bargain" on any listing to start messaging a landlord.',
                          textAlign: TextAlign.center,
                          style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
                        ),
                      ],
                    ),
                  )
                : ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: chatProvider.conversations.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 10),
                    itemBuilder: (context, index) {
                      final convo = chatProvider.conversations[index];
                      final otherUser = convo.getOtherParticipant(auth.currentUser!.id);
                      final unreadCount = convo.getUnreadCount(auth.currentUser!.id);
                      final bool isUnread = unreadCount > 0;

                      final listingImg = (convo.listing?.images.isNotEmpty ?? false)
                          ? ImageHelper.resolveUrl(convo.listing!.images.first)
                          : ImageHelper.propertyPlaceholder;

                      return Container(
                        decoration: BoxDecoration(
                          color: isUnread ? const Color(0xFFFFF7F7) : Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: isUnread ? const Color(0xFFFCA5A5) : AppColors.border,
                            width: isUnread ? 1.5 : 1.0,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: isUnread ? Colors.red.withOpacity(0.06) : Colors.black.withOpacity(0.02),
                              blurRadius: 8,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: ListTile(
                          contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                          leading: Stack(
                            clipBehavior: Clip.none,
                            children: [
                              CircleAvatar(
                                radius: 25,
                                backgroundColor: isUnread ? const Color(0xFFFEE2E2) : AppColors.primarySoft,
                                backgroundImage: (otherUser?.avatar.isNotEmpty ?? false)
                                    ? CachedNetworkImageProvider(
                                        ImageHelper.resolveUrl(otherUser!.avatar),
                                      )
                                    : null,
                                child: (otherUser?.avatar.isEmpty ?? true)
                                    ? Icon(
                                        Icons.person,
                                        color: isUnread ? Colors.redAccent : AppColors.primary,
                                      )
                                    : null,
                              ),
                              // Red Unread Indicator Dot on Top-Left
                              if (isUnread)
                                Positioned(
                                  top: -2,
                                  left: -2,
                                  child: Container(
                                    width: 13,
                                    height: 13,
                                    decoration: BoxDecoration(
                                      color: Colors.redAccent,
                                      shape: BoxShape.circle,
                                      border: Border.all(color: Colors.white, width: 2),
                                    ),
                                  ),
                                ),
                              // Listing Property Thumbnail on Bottom-Right
                              Positioned(
                                right: -2,
                                bottom: -2,
                                child: Container(
                                  width: 20,
                                  height: 20,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    border: Border.all(color: Colors.white, width: 2),
                                  ),
                                  child: ClipOval(
                                    child: CachedNetworkImage(
                                      imageUrl: listingImg,
                                      fit: BoxFit.cover,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                          title: Row(
                            children: [
                              Expanded(
                                child: Text(
                                  otherUser?.name ?? 'User',
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: TextStyle(
                                    fontWeight: isUnread ? FontWeight.w900 : FontWeight.w700,
                                    fontSize: 15,
                                    color: isUnread ? const Color(0xFF111827) : AppColors.textPrimary,
                                  ),
                                ),
                              ),
                              if (isUnread) ...[
                                const SizedBox(width: 6),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFFEE2E2),
                                    borderRadius: BorderRadius.circular(6),
                                    border: Border.all(color: const Color(0xFFFCA5A5)),
                                  ),
                                  child: const Text(
                                    'NEW',
                                    style: TextStyle(
                                      color: Color(0xFFDC2626),
                                      fontSize: 9,
                                      fontWeight: FontWeight.w800,
                                      letterSpacing: 0.5,
                                    ),
                                  ),
                                ),
                              ],
                            ],
                          ),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const SizedBox(height: 3),
                              Text(
                                convo.listing?.title ?? 'Listing',
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(fontSize: 12, color: AppColors.primary),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                convo.lastMessagePreview,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: isUnread ? FontWeight.w700 : FontWeight.w400,
                                  color: isUnread ? const Color(0xFF1F2937) : AppColors.textSecondary,
                                ),
                              ),
                            ],
                          ),
                          trailing: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              if (convo.lastMessage != null)
                                Text(
                                  DateFormat('hh:mm a').format(convo.lastMessage!),
                                  style: TextStyle(
                                    fontSize: 11,
                                    fontWeight: isUnread ? FontWeight.w700 : FontWeight.normal,
                                    color: isUnread ? Colors.redAccent : AppColors.textMuted,
                                  ),
                                ),
                              const SizedBox(height: 4),
                              if (isUnread)
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2.5),
                                  decoration: BoxDecoration(
                                    color: Colors.redAccent,
                                    borderRadius: BorderRadius.circular(10),
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.redAccent.withOpacity(0.3),
                                        blurRadius: 4,
                                        offset: const Offset(0, 1),
                                      ),
                                    ],
                                  ),
                                  child: Text(
                                    unreadCount > 99 ? '99+' : '$unreadCount new',
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 10,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                            ],
                          ),
                          onTap: () async {
                            chatProvider.markConversationAsReadLocally(convo.id, auth.currentUser!.id);
                            await context.push('/chat/${convo.id}');
                            if (mounted) {
                              chatProvider.fetchConversations();
                            }
                          },
                        ),
                      );
                    },
                  ),
      ),
    );
  }
}
