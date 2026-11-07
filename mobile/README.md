# Bhara Mobile Application (Flutter)

A native Android/iOS mobile application for **Bhara (ভাড়া)** — the To-Let rental platform for Bangladesh. Built with **Flutter (Dart)** and connected directly to the existing **Node.js + Express** backend and shared **MongoDB Atlas** database.

---

## 📱 Features

- **JWT Authentication:** Register, Login, Auto-login with persistent secure token storage.
- **Home & Discovery:** Hero search bar, quick categories (Family, Bachelor, Sublet, Office, Seat), popular Dhaka areas, and latest listings.
- **Browse & Filter:** Search by location or keyword, filter by rental type, division, price range (৳), and bedroom count.
- **Listing Details:** Multi-photo gallery with pinch-zoom lightbox, specs grid, amenities chips, and Google Maps preview.
- **Direct Landlord Contact:** 1-tap Phone Call, Rent Request modal, and in-app Chat.
- **Real-Time Bargaining Chat:** Message threads with landlords and quick bargaining chips with 4-second live polling.
- **Post Rental:** Camera/gallery photo picker (up to 8 photos uploaded to Cloudinary), GPS auto-detect location, and specs wizard.
- **Profile & Management:** Tabbed interface for My Listings, Sent Requests, and Received Requests (approve/reject).
- **Admin Panel:** Platform metrics (Total Users, Listings, Requests) and listing moderation queue.

---

## 🏗️ Architecture

```
mobile/
├── android/app/src/main/
│   └── AndroidManifest.xml   # Camera, GPS, Maps permissions
├── lib/
│   ├── main.dart             # App entry point, MultiProvider setup
│   ├── core/
│   │   ├── constants/        # API routes, Emerald colors, Category definitions
│   │   ├── network/          # Dio client with JWT Bearer interceptor
│   │   ├── theme/            # Material 3 emerald design theme
│   │   └── utils/            # Cloudinary image URL resolver
│   ├── models/               # UserModel, ListingModel, RentRequestModel, ConversationModel
│   ├── services/             # AuthService, ListingService, RequestService, ChatService, AdminService
│   ├── providers/            # AuthProvider, ListingProvider, RequestProvider, ChatProvider, AdminProvider
│   ├── routes/               # GoRouter route declarations
│   └── views/
│       ├── screens/          # Splash, Login, Register, Home, Listings, Detail, Post, Profile, Chat, Admin
│       └── widgets/          # ListingCard, CustomButton, CustomTextField, AmenityChip, FilterBottomSheet, Lightbox
└── pubspec.yaml              # Dependencies and metadata
```

---

## 🚀 Getting Started

### 1. Prerequisites
- [Flutter SDK](https://docs.flutter.dev/get-started/install/windows) (Version >= 3.0.0)
- [Android Studio](https://developer.android.com/studio) with Android SDK and Emulator installed
- VS Code (with Flutter extension) or Android Studio

### 2. Backend Connection
The mobile app communicates with the existing backend in [`../server`](../server).

Open `lib/core/constants/api_constants.dart`:
- **Android Emulator:** Defaults to `http://10.0.2.2:5000/api` (automatically routes to `localhost:5000` on your PC).
- **Physical Phone on same Wi-Fi:** Set to your computer's local IP (e.g. `http://192.168.1.100:5000/api`).
- **Production (Render):** Uncomment the live Render URL.

### 3. Run the App

1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```

2. Fetch Flutter packages:
   ```bash
   flutter pub get
   ```

3. Launch an Android Emulator or connect a physical phone with USB debugging enabled.

4. Run the app:
   ```bash
   flutter run
   ```

### 4. Build Distributable Release APK
To build an installable `.apk` for Android:
```bash
flutter build apk --release
```
The generated APK will be located at:
`build/app/outputs/flutter-apk/app-release.apk`
