import 'listing_model.dart';
import 'user_model.dart';

class RentRequestModel {
  final String id;
  final ListingModel? listing;
  final String? listingId;
  final UserModel? requester;
  final String? requesterId;
  final UserModel? owner;
  final String? ownerId;
  final String message;
  final DateTime? moveInDate;
  final String status; // pending, approved, rejected
  final DateTime? createdAt;

  RentRequestModel({
    required this.id,
    this.listing,
    this.listingId,
    this.requester,
    this.requesterId,
    this.owner,
    this.ownerId,
    this.message = '',
    this.moveInDate,
    this.status = 'pending',
    this.createdAt,
  });

  bool get isPending => status == 'pending';
  bool get isApproved => status == 'approved';
  bool get isRejected => status == 'rejected';

  factory RentRequestModel.fromJson(Map<String, dynamic> json) {
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

    UserModel? parsedRequester;
    String? rawRequesterId;
    if (json['requester'] != null) {
      if (json['requester'] is Map<String, dynamic>) {
        parsedRequester = UserModel.fromJson(json['requester']);
        rawRequesterId = parsedRequester.id;
      } else if (json['requester'] is String) {
        rawRequesterId = json['requester'];
      }
    }

    UserModel? parsedOwner;
    String? rawOwnerId;
    if (json['owner'] != null) {
      if (json['owner'] is Map<String, dynamic>) {
        parsedOwner = UserModel.fromJson(json['owner']);
        rawOwnerId = parsedOwner.id;
      } else if (json['owner'] is String) {
        rawOwnerId = json['owner'];
      }
    }

    return RentRequestModel(
      id: json['_id'] ?? json['id'] ?? '',
      listing: parsedListing,
      listingId: rawListingId,
      requester: parsedRequester,
      requesterId: rawRequesterId,
      owner: parsedOwner,
      ownerId: rawOwnerId,
      message: json['message'] ?? '',
      moveInDate: json['moveInDate'] != null
          ? DateTime.tryParse(json['moveInDate'])
          : null,
      status: json['status'] ?? 'pending',
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'listing': listingId ?? listing?.id,
      'requester': requesterId ?? requester?.id,
      'owner': ownerId ?? owner?.id,
      'message': message,
      if (moveInDate != null) 'moveInDate': moveInDate!.toIso8601String(),
      'status': status,
    };
  }
}
