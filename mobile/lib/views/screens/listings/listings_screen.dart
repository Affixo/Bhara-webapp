import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../../core/constants/app_colors.dart';
import '../../../providers/listing_provider.dart';
import '../../widgets/filter_bottom_sheet.dart';
import '../../widgets/listing_card.dart';

class ListingsScreen extends StatefulWidget {
  const ListingsScreen({Key? key}) : super(key: key);

  @override
  State<ListingsScreen> createState() => _ListingsScreenState();
}

class _ListingsScreenState extends State<ListingsScreen> {
  final TextEditingController _searchController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final lp = Provider.of<ListingProvider>(context, listen: false);
      if (lp.listings.isEmpty) {
        lp.fetchListings(refresh: true);
      }
      if (lp.searchQuery != null) {
        _searchController.text = lp.searchQuery!;
      }
    });
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      Provider.of<ListingProvider>(context, listen: false).loadMore();
    }
  }

  void _openFilterModal() {
    final lp = Provider.of<ListingProvider>(context, listen: false);
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => FilterBottomSheet(
        initialType: lp.selectedType,
        initialCity: lp.selectedCity,
        initialMinRent: lp.minRent,
        initialMaxRent: lp.maxRent,
        initialBedrooms: lp.bedrooms,
        initialFurnished: lp.furnished,
        onApply: (filters) {
          lp.setFilters(
            type: filters['type'],
            city: filters['city'],
            minRent: filters['minRent'],
            maxRent: filters['maxRent'],
            bedrooms: filters['bedrooms'],
            furnished: filters['furnished'],
          );
        },
      ),
    );
  }

  @override
  void dispose() {
    _searchController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final listingProvider = Provider.of<ListingProvider>(context);

    final hasActiveFilters = listingProvider.selectedType != null ||
        listingProvider.selectedCity != null ||
        listingProvider.minRent != null ||
        listingProvider.maxRent != null ||
        listingProvider.bedrooms != null;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Explore Rentals'),
        actions: [
          IconButton(
            icon: Stack(
              children: [
                const Icon(Icons.filter_list_rounded, size: 26),
                if (hasActiveFilters)
                  Positioned(
                    right: 0,
                    top: 0,
                    child: Container(
                      width: 9,
                      height: 9,
                      decoration: const BoxDecoration(
                        color: AppColors.primary,
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
              ],
            ),
            onPressed: _openFilterModal,
          ),
        ],
      ),
      body: Column(
        children: [
          // Search Box & Active Filter Chips
          Container(
            color: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  decoration: BoxDecoration(
                    color: AppColors.surfaceMuted,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: TextField(
                    controller: _searchController,
                    onSubmitted: (val) {
                      listingProvider.setFilters(search: val.trim());
                    },
                    decoration: InputDecoration(
                      hintText: 'Search properties or locations...',
                      prefixIcon: const Icon(Icons.search, color: AppColors.textMuted),
                      suffixIcon: _searchController.text.isNotEmpty
                          ? IconButton(
                              icon: const Icon(Icons.clear, size: 18),
                              onPressed: () {
                                _searchController.clear();
                                listingProvider.setFilters(search: '');
                              },
                            )
                          : null,
                      border: InputBorder.none,
                      contentPadding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                  ),
                ),

                // Active Filters Strip
                if (hasActiveFilters) ...[
                  const SizedBox(height: 8),
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        if (listingProvider.selectedType != null)
                          Padding(
                            padding: const EdgeInsets.only(right: 6),
                            child: Chip(
                              label: Text(listingProvider.selectedType!.toUpperCase()),
                              onDeleted: () => listingProvider.setFilters(type: null),
                              deleteIconColor: AppColors.primary,
                              backgroundColor: AppColors.primarySoft,
                              side: BorderSide.none,
                              labelStyle: const TextStyle(fontSize: 11, color: AppColors.primaryDark),
                            ),
                          ),
                        if (listingProvider.selectedCity != null)
                          Padding(
                            padding: const EdgeInsets.only(right: 6),
                            child: Chip(
                              label: Text(listingProvider.selectedCity!),
                              onDeleted: () => listingProvider.setFilters(city: null),
                              deleteIconColor: AppColors.primary,
                              backgroundColor: AppColors.primarySoft,
                              side: BorderSide.none,
                              labelStyle: const TextStyle(fontSize: 11, color: AppColors.primaryDark),
                            ),
                          ),
                        TextButton(
                          onPressed: () {
                            _searchController.clear();
                            listingProvider.clearFilters();
                          },
                          child: const Text(
                            'Clear All',
                            style: TextStyle(fontSize: 12, color: AppColors.error),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ],
            ),
          ),

          // Total Count Header
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Showing ${listingProvider.totalCount} properties',
                  style: const TextStyle(
                    fontSize: 13,
                    color: AppColors.textSecondary,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),

          // Listings List
          Expanded(
            child: RefreshIndicator(
              onRefresh: () => listingProvider.fetchListings(refresh: true),
              color: AppColors.primary,
              child: listingProvider.isLoading && listingProvider.listings.isEmpty
                  ? const Center(
                      child: CircularProgressIndicator(color: AppColors.primary),
                    )
                  : listingProvider.listings.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.search_off_rounded, size: 60, color: Colors.grey.shade400),
                              const SizedBox(height: 12),
                              const Text(
                                'No matching properties found',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                  color: AppColors.textSecondary,
                                ),
                              ),
                              const SizedBox(height: 6),
                              const Text(
                                'Try clearing some filters or searching a different area.',
                                style: TextStyle(fontSize: 13, color: AppColors.textMuted),
                              ),
                            ],
                          ),
                        )
                      : ListView.separated(
                          controller: _scrollController,
                          padding: const EdgeInsets.all(16),
                          itemCount: listingProvider.listings.length +
                              (listingProvider.isLoadingMore ? 1 : 0),
                          separatorBuilder: (_, __) => const SizedBox(height: 16),
                          itemBuilder: (context, index) {
                            if (index == listingProvider.listings.length) {
                              return const Padding(
                                padding: EdgeInsets.symmetric(vertical: 16),
                                child: Center(
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2.5,
                                    color: AppColors.primary,
                                  ),
                                ),
                              );
                            }
                            final listing = listingProvider.listings[index];
                            return ListingCard(
                              listing: listing,
                              onTap: () => context.push('/listing/${listing.id}'),
                            );
                          },
                        ),
            ),
          ),
        ],
      ),
    );
  }
}
