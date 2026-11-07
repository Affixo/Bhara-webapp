import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/constants/app_colors.dart';
import '../../../providers/admin_provider.dart';

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({Key? key}) : super(key: key);

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final admin = Provider.of<AdminProvider>(context, listen: false);
      admin.fetchDashboardStats();
      admin.fetchListings();
      admin.fetchUsers();
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final admin = Provider.of<AdminProvider>(context);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Admin Moderation'),
      ),
      body: Column(
        children: [
          // Metrics Cards (2x2 Grid)
          if (admin.stats != null)
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Expanded(
                    child: _buildMetricCard(
                      'Total Users',
                      '${admin.stats!['totalUsers'] ?? 0}',
                      Icons.people_outline,
                      Colors.blue,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: _buildMetricCard(
                      'All Listings',
                      '${admin.stats!['totalListings'] ?? 0}',
                      Icons.home_outlined,
                      Colors.green,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: _buildMetricCard(
                      'Rent Requests',
                      '${admin.stats!['totalRequests'] ?? 0}',
                      Icons.receipt_long_outlined,
                      Colors.orange,
                    ),
                  ),
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
              tabs: [
                Tab(text: 'Listings (${admin.listings.length})'),
                Tab(text: 'Users (${admin.users.length})'),
              ],
            ),
          ),

          // Tab Bar View
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                // 1. Listings Moderation Tab
                admin.isLoading && admin.listings.isEmpty
                    ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
                    : ListView.separated(
                        padding: const EdgeInsets.all(16),
                        itemCount: admin.listings.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 10),
                        itemBuilder: (context, index) {
                          final item = admin.listings[index];
                          return Card(
                            child: Padding(
                              padding: const EdgeInsets.all(12),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Expanded(
                                        child: Text(
                                          item.title,
                                          style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
                                        ),
                                      ),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                        decoration: BoxDecoration(
                                          color: item.isApproved
                                              ? Colors.green.shade50
                                              : Colors.amber.shade50,
                                          borderRadius: BorderRadius.circular(6),
                                        ),
                                        child: Text(
                                          item.isApproved ? 'LIVE' : 'PENDING',
                                          style: TextStyle(
                                            color: item.isApproved ? Colors.green : Colors.amber.shade800,
                                            fontSize: 10,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    'Rent: ৳${item.rent.toInt()} • Owner: ${item.owner?.name ?? "Landlord"}',
                                    style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                                  ),
                                  const SizedBox(height: 10),
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.end,
                                    children: [
                                      TextButton(
                                        onPressed: () => admin.deleteListing(item.id),
                                        child: const Text('Delete', style: TextStyle(color: Colors.red, fontSize: 12)),
                                      ),
                                      const SizedBox(width: 8),
                                      ElevatedButton(
                                        onPressed: () => admin.toggleListingApproval(item.id),
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: item.isApproved ? Colors.orange : AppColors.primary,
                                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                                        ),
                                        child: Text(
                                          item.isApproved ? 'Unapprove' : 'Approve',
                                          style: const TextStyle(fontSize: 12),
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),

                // 2. Users Management Tab
                admin.isLoading && admin.users.isEmpty
                    ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
                    : ListView.separated(
                        padding: const EdgeInsets.all(16),
                        itemCount: admin.users.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 10),
                        itemBuilder: (context, index) {
                          final user = admin.users[index];
                          return Card(
                            child: ListTile(
                              title: Text(user.name, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                              subtitle: Text('${user.email} • ${user.phone}', style: const TextStyle(fontSize: 12)),
                              trailing: Switch(
                                value: user.isActive,
                                activeColor: AppColors.primary,
                                onChanged: (_) => admin.toggleUser(user.id),
                              ),
                            ),
                          );
                        },
                      ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMetricCard(String label, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(height: 8),
          Text(
            value,
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
          ),
          Text(
            label,
            style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
          ),
        ],
      ),
    );
  }
}
