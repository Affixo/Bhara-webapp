import '../constants/api_constants.dart';

class ImageHelper {
  /// Resolves any image URL for both local backend and Cloudinary.
  /// - Full Cloudinary URLs (https://res.cloudinary.com/...) returned as-is
  /// - Relative local /uploads paths are prefixed with base domain
  static String resolveUrl(String? url) {
    if (url == null || url.trim().isEmpty) {
      return '';
    }

    final trimmed = url.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }

    // Fallback for local uploads directory
    final domain = ApiConstants.baseDomain;
    if (trimmed.startsWith('/')) {
      return '$domain$trimmed';
    }
    return '$domain/$trimmed';
  }

  /// Placeholder image URL when a property has no images
  static const String propertyPlaceholder =
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=60';

  /// Placeholder avatar for user profile
  static const String avatarPlaceholder =
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=60';
}
