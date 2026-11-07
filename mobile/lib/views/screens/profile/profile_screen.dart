import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/utils/image_helper.dart';
import '../../../core/utils/session_helper.dart';
import '../../../models/rent_request_model.dart';
import '../../../models/user_model.dart';
import '../../../providers/auth_provider.dart';
import '../../../providers/listing_provider.dart';
import '../../../providers/request_provider.dart';
import '../../widgets/custom_button.dart';
import 'edit_profile_bottom_sheet.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final auth = Provider.of<AuthProvider>(context, listen: false);
      if (auth.isAuthenticated) {
        Provider.of<ListingProvider>(context, listen: false).fetchMyListings();
        Provider.of<RequestProvider>(context, listen: false).fetchSentRequests();
        Provider.of<RequestProvider>(context, listen: false).fetchReceivedRequests();
      }
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _openEditProfile(BuildContext context, UserModel user) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => EditProfileBottomSheet(user: user),
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final listingProvider = Provider.of<ListingProvider>(context);
    final requestProvider = Provider.of<RequestProvider>(context);

    if (!auth.isAuthenticated) {
      return Scaffold(
        backgroundColor: AppColors.background,
        appBar: AppBar(title: const Text('My Profile')),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(32),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.account_circle_outlined, size: 80, color: AppColors.primary),
                const SizedBox(height: 16),
                const Text(
                  'Sign in to Bhara',
                  style: TextStyle(fontSize: 22, fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Log in to view your listings, track rent requests, and chat with landlords.',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 14, color: AppColors.textSecondary),
                ),
                const SizedBox(height: 24),
                CustomButton(
                  text: 'Log In',
                  onPressed: () => context.push('/login'),
                ),
                const SizedBox(height: 12),
                CustomButton(
                  text: 'Create New Account',
                  isOutlined: true,
                  onPressed: () => context.push('/register'),
                ),
              ],
            ),
          ),
        ),
      );
    }

    final user = auth.currentUser!;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('My Profile'),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit_outlined, color: AppColors.primary),
            tooltip: 'Edit Profile',
            onPressed: () => _openEditProfile(context, user),
          ),
          IconButton(
            icon: const Icon(Icons.logout, color: AppColors.error),
            tooltip: 'Log Out',
            onPressed: () async {
              await SessionHelper.logout(context);
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Profile Info Card
          Container(
            color: Colors.white,
            padding: const EdgeInsets.fromLTRB(20, 10, 20, 16),
            child: Column(
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    GestureDetector(
                      onTap: () => _openEditProfile(context, user),
                      child: Stack(
                        children: [
                          CircleAvatar(
                            radius: 32,
                            backgroundColor: AppColors.primarySoft,
                            backgroundImage: user.avatar.isNotEmpty
                                ? CachedNetworkImageProvider(ImageHelper.resolveUrl(user.avatar))
                                : null,
                            child: user.avatar.isEmpty
                                ? const Icon(Icons.person, size: 38, color: AppColors.primary)
                                : null,
                          ),
                          Positioned(
                            bottom: 0,
                            right: 0,
                            child: Container(
                              padding: const EdgeInsets.all(4),
                              decoration: BoxDecoration(
                                color: AppColors.primary,
                                shape: BoxShape.circle,
                                border: Border.all(color: Colors.white, width: 1.5),
                              ),
                              child: const Icon(Icons.camera_alt, color: Colors.white, size: 12),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Flexible(
                                child: Text(
                                  user.name,
                                  style: const TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                              ),
                              if (user.isAdmin) ...[
                                const SizedBox(width: 8),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: Colors.purple.shade50,
                                    borderRadius: BorderRadius.circular(6),
                                    border: Border.all(color: Colors.purple.shade200),
                                  ),
                                  child: const Text(
                                    'ADMIN',
                                    style: TextStyle(
                                      color: Colors.purple,
                                      fontSize: 10,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                ),
                              ],
                            ],
                          ),
                          const SizedBox(height: 3),
                          Row(
                            children: [
                              const Icon(Icons.email_outlined, size: 14, color: AppColors.primary),
                              const SizedBox(width: 5),
                              Expanded(
                                child: Text(
                                  user.email,
                                  style: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 2),
                          Row(
                            children: [
                              const Icon(Icons.phone_outlined, size: 14, color: AppColors.primary),
                              const SizedBox(width: 5),
                              Text(
                                user.phone,
                                style: const TextStyle(fontSize: 13, color: AppColors.textMuted),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          // Edit Profile Button (like web app)
                          InkWell(
                            onTap: () => _openEditProfile(context, user),
                            borderRadius: BorderRadius.circular(6),
                            child: const Padding(
                              padding: EdgeInsets.symmetric(vertical: 2),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(Icons.edit_outlined, size: 15, color: AppColors.primary),
                                  SizedBox(width: 4),
                                  Text(
                                    'Edit Profile',
                                    style: TextStyle(
                                      fontSize: 13,
                                      fontWeight: FontWeight.w600,
                                      color: AppColors.primary,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                if (user.isAdmin) ...[
                  const SizedBox(height: 14),
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton.icon(
                      icon: const Icon(Icons.admin_panel_settings, color: Colors.purple),
                      label: const Text('Open Admin Moderation Panel', style: TextStyle(color: Colors.purple)),
                      onPressed: () => context.push('/admin'),
                      style: OutlinedButton.styleFrom(
                        side: BorderSide(color: Colors.purple.shade200),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),

          // Tab Bar
          Container(
            color: Colors.white,
            child: TabBar(
              controller: _tabController,
              indicatorColor: AppColors.primary,
              labelColor: AppColors.primary,
              unselectedLabelColor: AppColors.textSecondary,
              labelStyle: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
              tabs: const [
                Tab(text: 'My Listings'),
                Tab(text: 'Sent Requests'),
                Tab(text: 'Received'),
              ],
            ),
          ),

          // Tab Bar Views
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                // 1. My Listings Tab
                RefreshIndicator(
                  onRefresh: () => listingProvider.fetchMyListings(),
                  color: AppColors.primary,
                  child: listingProvider.myListings.isEmpty
                      ? const Center(
                          child: Text(
                            'You have not posted any listings yet',
                            style: TextStyle(color: AppColors.textSecondary),
                          ),
                        )
                      : ListView.separated(
                          padding: const EdgeInsets.all(16),
                          itemCount: listingProvider.myListings.length,
                          separatorBuilder: (_, __) => const SizedBox(height: 12),
                          itemBuilder: (context, index) {
                            final listing = listingProvider.myListings[index];
                            final imageUrl = listing.images.isNotEmpty
                                ? ImageHelper.resolveUrl(listing.images.first)
                                : ImageHelper.propertyPlaceholder;
                            return Card(
                              child: ListTile(
                                leading: ClipRRect(
                                  borderRadius: BorderRadius.circular(8),
                                  child: CachedNetworkImage(
                                    imageUrl: imageUrl,
                                    width: 54,
                                    height: 54,
                                    fit: BoxFit.cover,
                                  ),
                                ),
                                title: Row(
                                  children: [
                                    Expanded(
                                      child: Text(
                                        listing.title,
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                        style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
                                      ),
                                    ),
                                    const SizedBox(width: 6),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                      decoration: BoxDecoration(
                                        color: listing.isApproved ? const Color(0xFFECFDF5) : const Color(0xFFFFFBEB),
                                        borderRadius: BorderRadius.circular(4),
                                        border: Border.all(
                                          color: listing.isApproved ? const Color(0xFFA7F3D0) : const Color(0xFFFDE68A),
                                        ),
                                      ),
                                      child: Text(
                                        listing.isApproved ? 'LIVE' : 'PENDING',
                                        style: TextStyle(
                                          color: listing.isApproved ? const Color(0xFF047857) : const Color(0xFFB45309),
                                          fontSize: 9,
                                          fontWeight: FontWeight.w800,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                subtitle: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const SizedBox(height: 2),
                                    Text(
                                      '৳${listing.rent.toInt()}/mo • ${listing.type.toUpperCase()}',
                                      style: const TextStyle(fontSize: 12, color: AppColors.primary),
                                    ),
                                    if (!listing.isApproved) ...[
                                      const SizedBox(height: 2),
                                      const Text(
                                        'Awaiting Admin Review',
                                        style: TextStyle(fontSize: 10, color: Color(0xFFD97706), fontWeight: FontWeight.w500),
                                      ),
                                    ],
                                  ],
                                ),
                                trailing: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    IconButton(
                                      icon: const Icon(Icons.delete_outline, color: AppColors.error, size: 20),
                                      onPressed: () async {
                                        final confirm = await showDialog<bool>(
                                          context: context,
                                          builder: (_) => AlertDialog(
                                            title: const Text('Delete Listing'),
                                            content: const Text('Are you sure you want to remove this property?'),
                                            actions: [
                                              TextButton(
                                                onPressed: () => Navigator.pop(context, false),
                                                child: const Text('Cancel'),
                                              ),
                                              TextButton(
                                                onPressed: () => Navigator.pop(context, true),
                                                child: const Text('Delete', style: TextStyle(color: Colors.red)),
                                              ),
                                            ],
                                          ),
                                        );
                                        if (confirm == true) {
                                          await listingProvider.deleteListing(listing.id);
                                        }
                                      },
                                    ),
                                  ],
                                ),
                                onTap: () => context.push('/listing/${listing.id}'),
                              ),
                            );
                          },
                        ),
                ),

                // 2. Sent Requests Tab
                RefreshIndicator(
                  onRefresh: () => requestProvider.fetchSentRequests(),
                  color: AppColors.primary,
                  child: requestProvider.sentRequests.isEmpty
                      ? const Center(
                          child: Text(
                            'No rent requests sent yet',
                            style: TextStyle(color: AppColors.textSecondary),
                          ),
                        )
                      : ListView.separated(
                          padding: const EdgeInsets.all(16),
                          itemCount: requestProvider.sentRequests.length,
                          separatorBuilder: (_, __) => const SizedBox(height: 12),
                          itemBuilder: (context, index) {
                            final req = requestProvider.sentRequests[index];
                            return _buildRequestCard(req, isSent: true);
                          },
                        ),
                ),

                // 3. Received Requests Tab
                RefreshIndicator(
                  onRefresh: () => requestProvider.fetchReceivedRequests(),
                  color: AppColors.primary,
                  child: requestProvider.receivedRequests.isEmpty
                      ? const Center(
                          child: Text(
                            'No received rent requests yet',
                            style: TextStyle(color: AppColors.textSecondary),
                          ),
                        )
                      : ListView.separated(
                          padding: const EdgeInsets.all(16),
                          itemCount: requestProvider.receivedRequests.length,
                          separatorBuilder: (_, __) => const SizedBox(height: 12),
                          itemBuilder: (context, index) {
                            final req = requestProvider.receivedRequests[index];
                            return _buildRequestCard(req, isSent: false);
                          },
                        ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRequestCard(RentRequestModel req, {required bool isSent}) {
    Color statusColor = AppColors.warning;
    if (req.isApproved) statusColor = AppColors.success;
    if (req.isRejected) statusColor = AppColors.error;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    req.listing?.title ?? 'Property Listing',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: statusColor.withAlpha(30),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    req.status.toUpperCase(),
                    style: TextStyle(
                      color: statusColor,
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 6),
            if (isSent)
              Text(
                'Landlord: ${req.owner?.name ?? "Owner"} (${req.owner?.phone ?? ""})',
                style: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
              )
            else
              Text(
                'Applicant: ${req.requester?.name ?? "Tenant"} • ${req.requester?.phone ?? ""}',
                style: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
              ),
            if (req.moveInDate != null) ...[
              const SizedBox(height: 4),
              Text(
                'Move-in Date: ${DateFormat("dd MMM, yyyy").format(req.moveInDate!)}',
                style: const TextStyle(fontSize: 12, color: AppColors.textMuted),
              ),
            ],
            if (req.message.isNotEmpty) ...[
              const SizedBox(height: 6),
              Text(
                '"${req.message}"',
                style: const TextStyle(fontSize: 13, fontStyle: FontStyle.italic),
              ),
            ],

            // Landlord Approve / Reject Actions
            if (!isSent && req.isPending) ...[
              const Divider(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  OutlinedButton(
                    onPressed: () {
                      Provider.of<RequestProvider>(context, listen: false)
                          .updateStatus(req.id, 'rejected');
                    },
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.error,
                      side: const BorderSide(color: AppColors.error),
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    ),
                    child: const Text('Reject', style: TextStyle(fontSize: 12)),
                  ),
                  const SizedBox(width: 10),
                  ElevatedButton(
                    onPressed: () {
                      Provider.of<RequestProvider>(context, listen: false)
                          .updateStatus(req.id, 'approved');
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.success,
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    ),
                    child: const Text('Approve', style: TextStyle(fontSize: 12)),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }
}
