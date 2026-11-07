import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:geolocator/geolocator.dart';
import 'package:latlong2/latlong.dart' as ll;
import '../../core/constants/app_colors.dart';

/// City default coordinates for Bangladesh
final Map<String, ll.LatLng> bangladeshCityCoordinates = {
  'Dhaka': const ll.LatLng(23.8103, 90.4125),
  'Chittagong': const ll.LatLng(22.3569, 91.7832),
  'Sylhet': const ll.LatLng(24.8949, 91.8687),
  'Rajshahi': const ll.LatLng(24.3636, 88.6241),
  'Khulna': const ll.LatLng(22.8456, 89.5403),
  'Barishal': const ll.LatLng(22.7010, 90.3535),
  'Rangpur': const ll.LatLng(25.7439, 89.2752),
  'Mymensingh': const ll.LatLng(24.7471, 90.4203),
  'Comilla': const ll.LatLng(23.4682, 91.1788),
};

class MapLocationPicker extends StatefulWidget {
  final double? initialLat;
  final double? initialLng;
  final String selectedCity;
  final Function(double? lat, double? lng) onLocationChanged;

  const MapLocationPicker({
    Key? key,
    this.initialLat,
    this.initialLng,
    this.selectedCity = 'Dhaka',
    required this.onLocationChanged,
  }) : super(key: key);

  @override
  State<MapLocationPicker> createState() => MapLocationPickerState();
}

class MapLocationPickerState extends State<MapLocationPicker> {
  final MapController _mapController = MapController();
  ll.LatLng? _pickedLocation;
  bool _isDetectingGps = false;

  @override
  void initState() {
    super.initState();
    if (widget.initialLat != null && widget.initialLng != null) {
      _pickedLocation = ll.LatLng(widget.initialLat!, widget.initialLng!);
    }
  }

  @override
  void didUpdateWidget(covariant MapLocationPicker oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.selectedCity != widget.selectedCity && _pickedLocation == null) {
      animateToCity(widget.selectedCity);
    }
  }

  /// Animate map to selected division/city
  void animateToCity(String city) {
    final coords = bangladeshCityCoordinates[city] ?? bangladeshCityCoordinates['Dhaka']!;
    _mapController.move(coords, 13.0);
  }

  /// Set and notify picked location
  void _setLocation(ll.LatLng? latLng) {
    setState(() {
      _pickedLocation = latLng;
    });
    widget.onLocationChanged(latLng?.latitude, latLng?.longitude);
  }

  /// Fetch GPS location and move map
  Future<void> detectGps() async {
    setState(() => _isDetectingGps = true);
    try {
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Please enable GPS location service on your phone')),
          );
        }
        return;
      }

      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Location permission was denied')),
            );
          }
          return;
        }
      }

      Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );

      final latLng = ll.LatLng(position.latitude, position.longitude);
      _setLocation(latLng);
      _mapController.move(latLng, 16.0);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('GPS Pinned: ${latLng.latitude.toStringAsFixed(4)}, ${latLng.longitude.toStringAsFixed(4)}'),
            backgroundColor: AppColors.primary,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to detect GPS: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isDetectingGps = false);
    }
  }

  /// Open fullscreen map picker for higher precision
  void _openFullscreenPicker() async {
    final defaultLocation = _pickedLocation ??
        (bangladeshCityCoordinates[widget.selectedCity] ?? const ll.LatLng(23.8103, 90.4125));

    final result = await Navigator.of(context).push<ll.LatLng>(
      MaterialPageRoute(
        fullscreenDialog: true,
        builder: (ctx) => FullscreenMapPicker(initialLocation: defaultLocation),
      ),
    );

    if (result != null) {
      _setLocation(result);
      _mapController.move(result, 16.0);
    }
  }

  @override
  Widget build(BuildContext context) {
    final defaultCenter = _pickedLocation ??
        (bangladeshCityCoordinates[widget.selectedCity] ?? const ll.LatLng(23.8103, 90.4125));

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Action Header: Title, GPS & Fullscreen controls
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Property Location Map',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w700,
                color: AppColors.textPrimary,
              ),
            ),
            Row(
              children: [
                // GPS button
                InkWell(
                  onTap: _isDetectingGps ? null : detectGps,
                  borderRadius: BorderRadius.circular(8),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: const Color(0xFFECFDF5),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: const Color(0xFFA7F3D0)),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        _isDetectingGps
                            ? const SizedBox(
                                width: 14,
                                height: 14,
                                child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.primary),
                              )
                            : const Icon(Icons.my_location, size: 14, color: AppColors.primary),
                        const SizedBox(width: 4),
                        const Text(
                          'My GPS',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: AppColors.primary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                // Fullscreen button
                InkWell(
                  onTap: _openFullscreenPicker,
                  borderRadius: BorderRadius.circular(8),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF3F4F6),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: AppColors.border),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.fullscreen, size: 16, color: AppColors.textSecondary),
                        SizedBox(width: 3),
                        Text(
                          'Fullscreen',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),

        const SizedBox(height: 8),

        // Embedded Map Container with Instruction & Confirmation Bars
        Container(
          width: double.infinity,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.border, width: 1.5),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.04),
                blurRadius: 10,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(15),
            child: Column(
              children: [
                // Top instruction banner (Webapp style)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  color: const Color(0xFFF0FDF4),
                  child: const Row(
                    children: [
                      Icon(Icons.touch_app, size: 16, color: Color(0xFF047857)),
                      SizedBox(width: 6),
                      Expanded(
                        child: Text(
                          'Tap anywhere on the map to pin your property',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF047857),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                // Interactive Map View (Instant Live Tiles)
                SizedBox(
                  height: 250,
                  width: double.infinity,
                  child: FlutterMap(
                    mapController: _mapController,
                    options: MapOptions(
                      initialCenter: defaultCenter,
                      initialZoom: _pickedLocation != null ? 16.0 : 13.0,
                      onTap: (tapPosition, point) => _setLocation(point),
                      interactionOptions: const InteractionOptions(
                        flags: InteractiveFlag.all & ~InteractiveFlag.rotate,
                      ),
                    ),
                    children: [
                      TileLayer(
                        urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                        userAgentPackageName: 'com.bhara.bhara_mobile',
                      ),
                      if (_pickedLocation != null)
                        MarkerLayer(
                          markers: [
                            Marker(
                              point: _pickedLocation!,
                              width: 50,
                              height: 50,
                              alignment: Alignment.topCenter,
                              child: const Icon(
                                Icons.location_on_rounded,
                                color: Color(0xFFDC2626), // Bright red marker
                                size: 46,
                                shadows: [
                                  Shadow(
                                    color: Colors.black38,
                                    offset: Offset(0, 4),
                                    blurRadius: 6,
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                    ],
                  ),
                ),

                // Bottom confirmation bar (Webapp style)
                if (_pickedLocation != null)
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    color: const Color(0xFF059669),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Text(
                            '📍 Pinned: ${_pickedLocation!.latitude.toStringAsFixed(5)}, ${_pickedLocation!.longitude.toStringAsFixed(5)}',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                        InkWell(
                          onTap: () => _setLocation(null),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: const Text(
                              'Clear',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  )
                else
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    color: const Color(0xFFF9FAFB),
                    child: const Text(
                      'No location pinned yet — tap the map above or click "My GPS"',
                      style: TextStyle(
                        color: Color(0xFF9CA3AF),
                        fontSize: 12,
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

/// Fullscreen Map Picker dialog
class FullscreenMapPicker extends StatefulWidget {
  final ll.LatLng initialLocation;

  const FullscreenMapPicker({Key? key, required this.initialLocation}) : super(key: key);

  @override
  State<FullscreenMapPicker> createState() => _FullscreenMapPickerState();
}

class _FullscreenMapPickerState extends State<FullscreenMapPicker> {
  late ll.LatLng _currentLocation;
  final MapController _controller = MapController();

  @override
  void initState() {
    super.initState();
    _currentLocation = widget.initialLocation;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Pin Property Location'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(_currentLocation),
            child: const Text(
              'CONFIRM',
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 14,
              ),
            ),
          ),
        ],
      ),
      body: Stack(
        children: [
          FlutterMap(
            mapController: _controller,
            options: MapOptions(
              initialCenter: widget.initialLocation,
              initialZoom: 16.0,
              onTap: (tapPosition, point) {
                setState(() => _currentLocation = point);
              },
              interactionOptions: const InteractionOptions(
                flags: InteractiveFlag.all & ~InteractiveFlag.rotate,
              ),
            ),
            children: [
              TileLayer(
                urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                userAgentPackageName: 'com.bhara.bhara_mobile',
              ),
              MarkerLayer(
                markers: [
                  Marker(
                    point: _currentLocation,
                    width: 50,
                    height: 50,
                    alignment: Alignment.topCenter,
                    child: const Icon(
                      Icons.location_on_rounded,
                      color: Color(0xFFDC2626),
                      size: 48,
                      shadows: [
                        Shadow(
                          color: Colors.black45,
                          offset: Offset(0, 4),
                          blurRadius: 8,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ],
          ),

          // Top Instruction banner
          Positioned(
            top: 12,
            left: 16,
            right: 16,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.12),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: const Row(
                children: [
                  Icon(Icons.touch_app, color: AppColors.primary, size: 20),
                  SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Tap anywhere on the map to place your pin, then tap CONFIRM at the top right.',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Bottom Bar showing coordinates & confirm button
          Positioned(
            bottom: 24,
            left: 16,
            right: 16,
            child: Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.15),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Selected Coordinates',
                          style: TextStyle(fontSize: 11, color: AppColors.textMuted),
                        ),
                        Text(
                          '${_currentLocation.latitude.toStringAsFixed(5)}, ${_currentLocation.longitude.toStringAsFixed(5)}',
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w800,
                            color: AppColors.primary,
                          ),
                        ),
                      ],
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () => Navigator.of(context).pop(_currentLocation),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                    ),
                    child: const Text(
                      'Confirm Pin',
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
