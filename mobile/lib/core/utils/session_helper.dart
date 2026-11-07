import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/admin_provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/chat_provider.dart';
import '../../providers/listing_provider.dart';
import '../../providers/request_provider.dart';

class SessionHelper {
  /// Clears all user-specific data from memory across all providers
  static void clearAllUserData(BuildContext context) {
    Provider.of<ListingProvider>(context, listen: false).clearUserData();
    Provider.of<ChatProvider>(context, listen: false).clearData();
    Provider.of<RequestProvider>(context, listen: false).clearData();
    Provider.of<AdminProvider>(context, listen: false).clearData();
  }

  /// Clears old state and fetches fresh data for newly logged-in account
  static Future<void> onUserAuthenticated(BuildContext context) async {
    clearAllUserData(context);
    final auth = Provider.of<AuthProvider>(context, listen: false);
    if (auth.isAuthenticated) {
      await Future.wait([
        Provider.of<ListingProvider>(context, listen: false).fetchMyListings(),
        Provider.of<ChatProvider>(context, listen: false).fetchConversations(),
        Provider.of<RequestProvider>(context, listen: false).fetchSentRequests(),
        Provider.of<RequestProvider>(context, listen: false).fetchReceivedRequests(),
      ]);
    }
  }

  /// Performs complete logout, clearing local storage and all provider states
  static Future<void> logout(BuildContext context) async {
    clearAllUserData(context);
    await Provider.of<AuthProvider>(context, listen: false).logout();
  }
}
