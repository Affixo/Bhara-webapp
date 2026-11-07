_Bhara Mobile App  —  Project Report_ 

SOFTWARE DEVELOPMENT PROJECT II  (SDP-II) 

## **Project Report** 

# **BHARA** 

### **Mobile Application** 

_A Native Android Rental Platform for Bangladesh_ 

Submitted by 

|**Group 2**|**Student ID**|
|---|---|
|Abrar Zahin|23524202100|
|Abid Rejwan|23524202148|
|Tabida Ahmed|23524202134|
|Abdullah Bin Towhid|23524202054|



Course: Software Development Project II Technology: Flutter (Dart)  ·  Android Studio  ·  MERN Backend Year: 2025 

Group 2  |  SDP-II  |  Page 1 of 24 

_Bhara Mobile App  —  Project Report_ 

### **1. Project Title** 

###### **Project Name:** 

#### **BHARA — Mobile Application** 

###### **Full Title:** 

Bhara: A Native Android To-Let Rental Platform for Bangladesh 

###### **Project Overview** 

Bhara (Bengali: ভা�ড়া�, meaning "rent") is a native Android mobile application that extends the existing Bhara web platform — a full-stack MERN rental marketplace built for the Bangladeshi property market. The mobile app is built using Flutter (Dart) and connects to the existing backend API, allowing landlords and tenants to interact with rental listings, send messages, manage requests, and receive real-time push notifications — all from their Android smartphones. 

|**Field**|**Details**|
|---|---|
|Platorm|Android (Fluter)|
|Language|Dart|
|IDE|Android Studio|
|Backend|Existng Bhara Render API (Node.js + Express)|
|Database|Shared MongoDB Atlas Cluster|
|Image Storage|Cloudinary CDN|
|Maps|Google Maps SDK for Fluter|



Group 2  |  SDP-II  |  Page 2 of 24 

_Bhara Mobile App  —  Project Report_ 

### **2. Problem Statement** 

##### **2.1  The Broader Problem: Finding a Home in Bangladesh** 

Finding a suitable place to live is one of the most stressful and time-consuming experiences a person can go through — and in Bangladesh, this process is uniquely difficult. Whether you are a university student searching for a bachelor room near your campus, a young professional relocating to Dhaka for a new job, or a family looking for a safe and affordable flat in a specific neighbourhood, the journey from "I need a place" to "I have a home" is filled with friction, uncertainty, and wasted effort. 

In Bangladesh, the rental market operates almost entirely through informal channels. The most common methods include: 

- Physical "To-Let" signs written on paper or painted on walls outside buildings — visible only to people who happen to walk or drive past. 

- Word-of-mouth referrals through friends, family members, or colleagues — highly limited in reach and dependent on personal networks. 

- Unverified Facebook groups and community pages where listings are posted without photos, without accurate addresses, and without any quality control. 

- Local property brokers or dalals who charge commission fees (often one to two months' rent) and whose information is frequently outdated or biassed toward higher-priced properties. 

- Classified ad websites (such as Bikroy) that list properties alongside products, vehicles, and electronics — making property search a disorganised and time-consuming experience. 

These methods share a common set of fundamental problems that make the rental process unnecessarily difficult for both tenants and landlords: 

###### **A. Information Asymmetry and Lack of Transparency** 

Tenants have almost no way to verify the accuracy of a listing before physically visiting the property. There are no standardised photos, no confirmed addresses, no amenity lists, and no price benchmarks. A tenant may visit five or six properties in a single weekend — spending money on transportation, taking time off work or university — only to discover that the property does not match the description, is 

Group 2  |  SDP-II  |  Page 3 of 24 

_Bhara Mobile App  —  Project Report_ 

already taken, or is in a different condition than advertised. This information gap wastes enormous amounts of time and money on both sides of the transaction. 

###### **B. Rental Type Mismatch** 

Bangladesh has a specific and deeply culturally embedded rental classification system. Landlords distinguish between Family flats (for married couples and families only), Bachelor accommodations (for unmarried males or working individuals), Sub-lets (where an existing tenant rents out a portion of their accommodation), Office spaces (for commercial use), and Seat-based rentals (where a single bed or seat in a shared room is rented). These distinctions are critical — a landlord advertising a Family flat will not rent to bachelors, and a student looking for a seat has entirely different needs from a family looking for a full flat. Existing platforms do not support or filter by these categories, making searches frustratingly imprecise. 

###### **C. Location Uncertainty** 

Addresses in Bangladesh, particularly in Dhaka, are notoriously difficult to navigate for newcomers. Localities are divided into blocks, roads, and house numbers that are not intuitively organised. A listing that says "Road 5, Block C, Mirpur" tells a tenant very little about the actual distance to their workplace, the nearest market, or the state of the road. Without a map-based location pin, tenants cannot make informed decisions about commute times or neighbourhood suitability before visiting. 

###### **D. No Direct and Structured Communication Channel** 

When a tenant finds a listing they are interested in — on a Facebook group, a paper sign, or a classified site — their only option is to call or text the landlord's personal phone number. This is inefficient for both parties: landlords receive calls at all hours, cannot track which property a caller is enquiring about, and have no record of previous conversations. Tenants must call multiple landlords sequentially, often receiving no answer or being told the property is no longer available. There is no structured way to express interest, ask questions, negotiate rent, or confirm move-in dates without repeated phone calls. 

###### **E. No Bargaining Support** 

Rent negotiation in Bangladesh is common and expected. Most landlords list a price with the expectation that tenants will negotiate — the phrase "negotiable" appears in almost every listing. However, this negotiation happens entirely over phone calls or in person during property visits, with no written record and no platform support. Tenants who are shy, who do not speak the landlord's dialect confidently, or who are negotiating from a different city are at a significant disadvantage. A structured, text-based bargaining channel would level this playing field considerably. 

Group 2  |  SDP-II  |  Page 4 of 24 

_Bhara Mobile App  —  Project Report_ 

###### **F. The Digital Gap for Smartphone Users** 

Bangladesh has over 120 million internet users, of whom more than 95% access the internet through a smartphone. Even when digital rental platforms exist, they are typically designed for desktop browsers. A tenant browsing listings on their phone must pinch and zoom to read text, struggle with dropdown menus sized for a mouse cursor, and navigate complex multi-step forms through a browser interface. A landlord trying to upload photos must navigate through the phone's file system via a browser file picker — a process that is unintuitive and prone to errors. The absence of a native mobile application means that even digital-first solutions fail to deliver the experience that smartphone users expect and deserve. 

###### **G. Lack of Trust and Verification** 

Perhaps the most significant problem in Bangladesh's rental market is the near-total absence of trust mechanisms. Tenants have no way to verify that a listing is genuine, that the photos are of the actual property, that the price is fair, or that the landlord is legitimate. Scams involving fake listings — where someone collects advance rent and disappears — are a known risk. Landlords, conversely, have no way to screen tenants, understand their employment status, or gauge whether they are likely to be responsible occupants. This mutual distrust slows transactions, increases the number of in-person visits required, and leaves both parties feeling vulnerable. 

##### **2.2  The Opportunity: What Bhara Mobile Addresses** 

The Bhara platform was built to solve these problems digitally — providing a structured, photo-rich, map-based, and chat-enabled marketplace specifically for the Bangladeshi rental market. The Bhara web application has already demonstrated that users will adopt a well-designed digital rental platform. The Bhara Mobile App extends this solution to where Bangladeshi users actually live — their smartphones — delivering a native Android experience that makes finding, posting, and managing rental properties as natural and effortless as opening WhatsApp or bKash. 

Specifically, Bhara Mobile addresses: 

- Information asymmetry — through photo-rich listings, verified addresses, amenity lists, and Google Maps location pins. 

- Rental type mismatch — through structured type filters (Family, Bachelor, Sublet, Office, Seat) built into every search. 

Group 2  |  SDP-II  |  Page 5 of 24 

_Bhara Mobile App  —  Project Report_ 

- Location uncertainty — through GPS-powered listing creation and an interactive map view on every listing detail screen. 

- Communication friction — through an in-app real-time messaging system that replaces ad-hoc phone calls with structured, searchable conversations. 

- Bargaining support — through a dedicated chat interface where tenants and landlords can negotiate rent with a written record. 

- Smartphone accessibility — through a native Flutter Android app designed for touch, with a bottom navigation bar, swipe gestures, and camera integration. 

- Trust and verification — through an admin approval workflow where every listing is reviewed before going live, and a notification system that keeps both parties informed at every step. 

###### **Problem Statement Summary** 

Finding a suitable rental property in Bangladesh is a fragmented, time-consuming, and trust-deficient process that forces tenants and landlords to rely on physical signs, informal networks, and unverified social media posts. The absence of a structured, mobile-native digital platform means that millions of Bangladeshis — most of whom are smartphone-first internet users — navigate one of life's most important decisions with inadequate tools. Bhara Mobile aims to change that by delivering a purpose-built Android application that brings transparency, structure, location accuracy, real-time communication, and verified listings to the Bangladeshi rental market — directly on the device that users already carry in their pocket. 

Group 2  |  SDP-II  |  Page 6 of 24 

_Bhara Mobile App  —  Project Report_ 

### **3. Target Users** 

Bhara Mobile is designed to serve three distinct user groups, each with specific needs, behaviours, and expectations from the platform. 

##### **3.1  Tenants / Renters (Primary Users)** 

Tenants are the largest user group and the primary drivers of traffic. They include: 

- University students and fresh graduates looking for Bachelor or Seat accommodations near their institution or workplace in cities like Dhaka, Chittagong, and Sylhet. 

- Young professionals relocating for work who need to find Family or Bachelor flats quickly, often before physically arriving in the city. 

- Families seeking spacious apartments with specific requirements such as gas supply, generator backup, parking, and proximity to schools. 

- Short-term renters looking for Sub-let arrangements while their main accommodation is being renovated or while working on a project in a different city. 

###### **User Profile — Tenant:** 

|**Atribute**|**Descripton**|
|---|---|
|Age Range|18–40 years|
|Tech Literacy|Moderate to high; comfortable with apps like Pathao, Shohoz, Bkash|
|Device|Android smartphone (mid-range: Samsung Galaxy A-series, Xiaomi Redmi)|
|Primary Need|Find verifed, photo-rich listngs with accurate locaton and direct landlord<br>contact|
|Key Behaviour|Browses listngs during commute, searches by area, contacts via chat|



##### **3.2  Landlords / Property Owners (Secondary Users)** 

Landlords are the content creators of the platform. Without them, there are no listings. They include: 

- Individual homeowners renting out one or two flats or rooms in Dhaka, Chittagong, or other major cities. 

- Property managers overseeing multiple units across different buildings who need a quick way to post and manage listings on their phone. 

Group 2  |  SDP-II  |  Page 7 of 24 

_Bhara Mobile App  —  Project Report_ 

- Small landlords who currently rely on physical signs, local agents, or informal WhatsApp groups to find tenants — and who stand to gain the most from digital adoption. 

###### **User Profile — Landlord:** 

|**Atribute**|**Descripton**|
|---|---|
|Age Range|30–60 years|
|Tech Literacy|Basic to moderate; may need an intuitve UI with minimal steps|
|Device|Android smartphone (ofen older or mid-range models)|
|Primary Need|Post a listng quickly with photos, set a fair price, and get contacted by<br>genuine tenants|
|Key Behaviour|Posts once, waits for requests, responds to chats, manages approval<br>status|



##### **3.3  Platform Administrators** 

Administrators are internal team members responsible for platform health. On mobile, they need to: 

- Review and approve or reject new listing submissions from their phone without being tied to a desktop. 

- Monitor user activity and respond to reports of fraudulent or misleading listings. 

- Access dashboard statistics — total users, live listings, pending approvals — while on the move. 

###### **Demographics Summary:** 

Bhara Mobile's primary demographic is urban Bangladeshis aged 18–50 who are smartphone-first internet users, live in or are relocating to major cities, and are seeking or offering residential or commercial rentals. The unifying characteristic is that all three user groups carry an Android smartphone and expect the same app-quality experience they get from services like Shohoz, Pathao, or Daraz. 

### **4. Project Objectives** 

The Bhara Mobile project has the following measurable objectives, organised into primary objectives (core deliverables) and secondary objectives (quality and experience goals). 

Group 2  |  SDP-II  |  Page 8 of 24 

_Bhara Mobile App  —  Project Report_ 

##### **4.1  Primary Objectives** 

- **# Objective** 01 Deliver a fully functional Flutter Android application that replicates all core Bhara web features in a native mobile environment. 

- 02 Implement JWT-based user authentication (login, register, logout) connected to the existing Bhara backend API. 

- 03 Build a listing browsing screen with full search and filter support — by rental type, city, area, price range, and number of bedrooms. 

- 04 Implement a listing detail screen with an image gallery, Google Maps location view, amenity tags, and a rent request button. 

- 05 Enable landlords to post new listings from the mobile app using the phone camera for photos and GPS for location. 

- 06 Build a real-time messaging system allowing tenants and landlords to chat and negotiate rent within the app. 

- 07 Implement push notifications (Firebase Cloud Messaging) for listing approvals, rejections, new rent requests, and chat messages. 

- 08 Build a user profile screen with tabs for My Listings, Sent Requests, Received Requests, and Messages. 

- 09 Include an admin panel screen for reviewing and approving or rejecting pending listings. 10 Generate a distributable .apk file that any Android user can install and use immediately. 

##### **4.2  Secondary Objectives** 

- Ensure the app is responsive and usable on screen sizes from 5-inch to 7-inch Android devices. 

- Achieve an average app launch time of under 2 seconds on a mid-range Android device. 

- Implement pull-to-refresh on all list screens for user-controlled data refresh. 

- Cache the last-viewed listing results so users can browse without an active internet connection. 

- Follow Flutter best practices including separation of concerns (services, providers, screens, widgets). 

- Maintain code readability with clear comments and a consistent folder structure. 

Group 2  |  SDP-II  |  Page 9 of 24 

_Bhara Mobile App  —  Project Report_ 

### **5. Major Features and Functionalities** 

The following table provides a comprehensive list of features the Bhara Mobile application will include, along with a description and the corresponding web feature it mirrors. 

|**Feature**|**Descripton**|
|---|---|
|User Registraton|New users can create an account with full name, 11-digit phone number<br>(validated), email, and password. Duplicate phone and email are rejected with<br>clear error messages.|
|User Login / Logout|Secure JWT-based authentcaton. Token stored in device Keystore via<br>futer_secure_storage. Session persists between app launches.|
|Home Screen|Displays a hero search bar, Browse by Type cards (Family, Bachelor, Sublet,<br>Ofce, Seat), and a grid of the 8 latest available listngs fetched from the API.|
|Browse & Search Listngs|Full-screen listng grid with search by keyword, and flters for: rental type, city,<br>area/thana, price range (min/max), number of bedrooms, and furnishing<br>status.|
|Listng Detail Screen|Shows full image gallery with swipe navigaton and fullscreen lightbox, all<br>property details, Google Maps view with pin, amenites, owner info (name,<br>phone, email), and acton butons.|
|Rent Request|Tenant can send a rent request with an optonal message and expected move-<br>in date. Owner receives notfcaton and can approve or reject from the<br>Received tab.|
|Post a Listng|Mult-step form: ttle, type, rent, descripton, property details (bedrooms,<br>bathrooms, area, foor, furnished status, available date), amenity selecton,<br>GPS-powered locaton picker, and camera/gallery photo upload (up to 8<br>photos).|
|Edit / Delete Listng|Owners can edit all listng felds, add or delete individual photos (Cloudinary<br>delete), and update the map pin.|
|Google Maps Integraton|Two modes: (1) MapPicker on create/edit — GPS auto-detect + manual tap to<br>pin; (2) MapView on detail — shows saved pin with property info popup and<br>'Open in Google Maps' link.|
|Real-tme Messaging|Conversaton list with thumbnail, unread badge, and last message preview.<br>Chat window with message bubbles, tmestamps, read receipts (<br>/<br>), and<br>✓<br>✓✓<br>4-second polling for live updates.|
|Push Notfcatons|Firebase Cloud Messaging delivers notfcatons for: listng approved, listng<br>rejected (with reason), new rent request, and new chat message. Tapping a<br>notfcaton navigates to the relevant screen.|
|User Profle|Displays avatar, name, email, phone with edit opton. Four tabs: My Listngs,<br>Sent Requests, Received Requests, Messages. Sent/Received tabs show listng<br>thumbnail and status badge.|



Group 2  |  SDP-II  |  Page 10 of 24 

_Bhara Mobile App  —  Project Report_ 

|**Feature**|**Descripton**|
|---|---|
|Admin Panel|Three-tab view: Pending (listngs awaitng approval), All Listngs, Rejected. Each<br>listng shows thumbnail, owner info, approve buton, and reject buton (with<br>reason modal and pre-set reasons).|
|Image Lightbox|Tapping any listng photo opens a full-screen overlay with swipe navigaton<br>between photos, a photo counter, and a thumbnail strip.|
|Notfcaton History|In-app notfcaton centre listng all past alerts with unread dot indicators,<br>read-all buton, and tap-to-navigate functonality.|



Group 2  |  SDP-II  |  Page 11 of 24 

_Bhara Mobile App  —  Project Report_ 

### **6. Proposed Technology Stack** 

The technology stack is chosen to maximise development speed, code quality, and seamless integration with the existing Bhara backend infrastructure. 

##### **6.1  Mobile Frontend** 

|**Technology**|**Role & Ratonale**|
|---|---|
|Fluter (SDK 3.x)|Primary UI framework. Dart-based, cross-platorm (Android + iOS from<br>one codebase), with a rich widget library that produces natve-quality UIs.<br>Chosen for its hot reload, strong Google Maps support, and large<br>community.|
|Dart 3.x|The programming language Fluter uses. Strongly typed, fast to compile,<br>and similar in concept to JavaScript/TypeScript making it approachable for<br>web developers.|
|Android Studio|Ofcial IDE for Fluter/Android development. Provides the Android<br>emulator, APK builder, Logcat debugger, and integrated Dart analysis.|
|Provider (State Mgmt)|Lightweight state management package. Replaces React Context from the<br>web app. AuthProvider holds JWT + user state; ListngProvider holds the<br>current listng list and flters.|
|Go Router|Declaratve navigaton / routng package for Fluter. Handles deep linking<br>from push notfcatons (e.g. tapping a notfcaton opens the correct<br>listng screen).|



##### **6.2  HTTP & Data Layer** 

|**Technology**|**Role & Ratonale**|
|---|---|
|Dio|HTTP client for Dart. Supports interceptors (auto-atach JWT Bearer token<br>to every request), tmeout handling, form data (multpart image upload),<br>and error mapping.|
|futer_secure_storage|Stores the JWT authentcaton token in the device's secure Keystore<br>(Android) or Keychain (iOS). Replaces localStorage from the web app.|
|cached_network_image|Loads and caches Cloudinary image URLs. Shows a shimmer placeholder<br>while loading and falls back to a grey box on error. Critcal for smooth<br>listng image display.|
|shared_preferences|Stores lightweight non-sensitve data locally (e.g. last search city, flter<br>preferences) so the app remembers user preferences between sessions.|



##### **6.3  Native Device Features** 

Group 2  |  SDP-II  |  Page 12 of 24 

_Bhara Mobile App  —  Project Report_ 

|**Technology**|**Role & Ratonale**|
|---|---|
|google_maps_futer|Ofcial Google Maps SDK for Fluter. Renders interactve maps, handles<br>marker placement (listng pin), info window display, and camera<br>movement.|
|geolocator|Accesses the device's GPS to get the current locaton. Used on the Create<br>Listng screen to auto-detect and pre-fll the map pin.|
|image_picker|Provides a natve camera and gallery picker. Landlords can photograph the<br>property or choose from the gallery; returns image fles for Cloudinary<br>upload.|
|frebase_messaging (FCM)|Firebase Cloud Messaging for push notfcatons. Works in foreground,<br>background, and when the app is fully closed. Requires a Firebase project<br>linked to the Render backend.|
|futer_local_notfcatons|Displays rich notfcaton banners when FCM delivers a message while the<br>app is in the foreground.|



##### **6.4  Backend & Infrastructure (Shared with Web App)** 

|**Technology**|**Role**|
|---|---|
|Node.js + Express.js (Render)|Existng REST API backend — no changes needed for basic mobile<br>integraton.|
|MongoDB Atlas|Shared cloud database. All web and mobile users, listngs, chats, and<br>requests exist in the same cluster.|
|Cloudinary|Image CDN. Photos uploaded from the mobile camera are stored here;<br>the returned htps:// URL is saved to MongoDB exactly like web uploads.|
|JWT (JSON Web Token)|The same auth tokens issued by the web backend are used by the mobile<br>app — no separate auth system needed.|
|Firebase (FCM only)|The only new backend service required. A small Firebase Cloud Messaging<br>integraton is added to the Express server to trigger push notfcatons.|



Group 2  |  SDP-II  |  Page 13 of 24 

_Bhara Mobile App  —  Project Report_ 

### **7. Basic System Workflow** 

This section describes how the application works from a user's perspective, covering the three main user journeys: tenant renting flow, landlord posting flow, and admin moderation flow. 

##### **7.1  Application Startup** 

When the app is launched, a Splash Screen is displayed for approximately 1.5 seconds while the app checks flutter_secure_storage for an existing JWT token. If a valid token is found, the user is redirected directly to the Home Screen. If no token exists or the token has expired, the user is redirected to the Login Screen. This ensures a seamless experience for returning users. 

##### **7.2  Tenant / Renter Journey** 

|**Step**|**Acton**|
|---|---|
|1. Onboarding|User opens the app and registers with name, email, 11-digit phone, and password.<br>Phone and email uniqueness is validated before account creaton.|
|2. Home Screen|User lands on the home screen, which shows a search bar, Browse by Type cards,<br>and a scrollable grid of the 8 most recent listngs.|
|3. Search & Filter|User searches by keyword or taps Filters to narrow results by rental type, city,<br>area/thana, price range, and number of bedrooms.|
|4. Browse Listngs|The listng grid updates with matching results. Each card shows a thumbnail, type<br>badge, ttle, locaton, key stats, and price.|
|5. View Listng Detail|User taps a listng card. The detail screen shows the full image gallery (swipe to<br>navigate), property specs, amenites, a Google Maps pin, and the owner's contact<br>info.|
|6. Message Landlord|User taps 'Message & Bargain'. A conversaton is created (or an existng one<br>opened). The user can type messages, negotate the price, and ask questons in<br>real-tme.|
|7. Send Rent<br>Request|User taps 'Send Rent Request', optonally writes a note and expected move-in date,<br>and submits. The landlord receives a push notfcaton.|
|8. Track Status|User navigates to Profle → Sent Requests tab to see whether their request is<br>Pending, Approved, or Rejected.|



##### **7.3  Landlord / Property Owner Journey** 

Group 2  |  SDP-II  |  Page 14 of 24 

_Bhara Mobile App  —  Project Report_ 

|**Step**|**Acton**|
|---|---|
|1. Login|Landlord logs in with email and password. JWT token is stored securely on the<br>device.|
|2. Post Listng|Taps 'Post Rental' on the home screen. A mult-step form opens covering basic info,<br>property details, amenites, locaton (GPS auto-detect or manual map pin), and<br>photo upload (camera or gallery, up to 8 photos).|
|3. Submission|Listng is submited to the backend with status Pending (awaitng admin approval).<br>A confrmaton message appears.|
|4. Admin Review|The admin reviews the listng. The landlord receives a push notfcaton: either<br>Approved (listng goes live) or Rejected (reason is provided).|
|5. Manage Listng|Landlord can edit details, delete individual photos, update the map pin, or change<br>the listng status (Available / Rented) from the Profle → My Listngs tab.|
|6. Handle Requests|When a tenant sends a rent request, the landlord receives a push notfcaton. They<br>can Approve or Reject from Profle → Received Requests. Approval sets the listng<br>status to Rented.|
|7. Chat|Landlord can view and reply to tenant messages from Profle → Messages tab or by<br>opening a conversaton directly from the request.|



##### **7.4  Admin Journey** 

|**Step**|**Acton**|
|---|---|
|1. Login (Admin<br>Account)|Admin logs in with an account where role = 'admin' in the database.|
|2. Admin Dashboard|Dashboard shows stat cards: Total Users, Total Listngs, Live Listngs, Pending<br>Approvals (with acton badge if > 0).|
|3. Review Pending<br>Listngs|Admin navigates to Manage Listngs → Pending tab. Each listng shows the<br>thumbnail (from Cloudinary), ttle, owner name/email, and Approve / Reject<br>butons.|
|4. Approve|Admin taps Approve. The listng's isApproved fag is set to true and its status<br>becomes Available. A push notfcaton is sent to the owner.|
|5. Reject|Admin taps Reject. A modal appears with pre-set rejecton reasons (e.g. Incomplete<br>informaton, Suspicious listng) and a custom text feld. On confrm, a push<br>notfcaton is sent to the owner with the reason.|
|6. Manage Users|Admin can view all users, actvate/deactvate accounts, and delete accounts if<br>needed.|



Group 2  |  SDP-II  |  Page 15 of 24 

_Bhara Mobile App  —  Project Report_ 

### **8. UI Mockups and Reference Design** 

The Bhara web application is fully operational and its UI serves as the direct reference design for the mobile application. Each screen shown below will be reimplemented as a native Flutter screen with mobile-appropriate layouts, bottom navigation, swipe gestures, and touch-optimised components. 

##### **8.1  Home Screen** 

The home screen features a gradient hero section with a search bar, a statistics bar, a Browse by Type section, a Latest Listings grid, and a Popular Cities section. On mobile, this becomes a scrollable singlecolumn layout with a bottom navigation bar. 

_Figure 1: Bhara Web Home Screen — will be adapted as the Flutter home screen with bottom nav bar_ 

##### **8.2  Registration Screen** 

The registration form validates the full name (min 2 chars), email format (regex), phone number (exactly 11 digits, numbers only), password (min 6 chars), and password confirmation in real-time. Duplicate email or phone triggers a server-side error with a specific message. 

_Figure 2: Registration screen with inline validation — all validation logic carries over to Flutter form fields_ 

##### **8.3  Browse Listings Screen** 

The listing grid shows type-colour-coded badges, listing thumbnail, title, location, bedroom count, furnishing status, view count, and price. On mobile, this becomes a single-column scrollable list with a floating filter button. 

_Figure 3: Browse To-Let screen with listing cards — mobile version uses a vertical list with pull-to-refresh_ 

##### **8.4  Post Rental Screen** 

Group 2  |  SDP-II  |  Page 16 of 24 

_Bhara Mobile App  —  Project Report_ 

The multi-section form covers basic info, property details, amenities selection (toggle chips), location with Google Maps embed, and photo upload zone. On mobile, the form becomes a step-by-step wizard with a progress indicator, and photo upload triggers the native camera or gallery. 

_Figure 4: Post Rental form — mobile version uses camera integration and GPS auto-detect for location_ 

##### **8.5  Listing Detail Screen** 

The detail screen shows the full image gallery, property specs grid, description, amenities tags, an interactive Google Maps view with a pinned location and info popup, and an owner card with action buttons. The mobile version adds swipe-to-dismiss on the lightbox and 'Call' / 'WhatsApp' direct action buttons on the owner card. 

_Figure 5: Listing detail screen showing Google Maps pin and property info — carried over exactly to Flutter_ 

##### **8.6  Admin Dashboard** 

The admin dashboard shows stat cards (Total Users, Total Listings, Available, Rent Requests) and quicklink cards for Manage Users, Manage Listings, and Rent Requests. On mobile, the stat cards become a 2x2 grid and the quick-link cards become a vertical menu with chevron icons. 

_Figure 6: Admin Dashboard — mobile version adds a Pending Approvals card with a notification badge_ 

##### **8.7  User Profile Screen** 

The profile screen shows the user's avatar, name, email, phone, and a tab bar with My Listings, Sent Requests, Received Requests, and Messages. Each tab shows the relevant content with listing thumbnails loaded from Cloudinary. 

_Figure 7: User profile screen with tabs — mobile version adds a Notifications tab and a bottom nav bar_ 

Group 2  |  SDP-II  |  Page 17 of 24 

_Bhara Mobile App  —  Project Report_ 

### **9. Uniqueness and Significance** 

Bhara Mobile is not simply a web-to-app wrapper. It is a purposefully designed native application with several qualities that distinguish it from both the existing web app and competing platforms. 

##### **9.1  First Dedicated Rental App for the Bangladeshi Market** 

While platforms like Bproperty and Bikroy list properties, neither provides the structured rental types (Family, Bachelor, Sublet, Seat) that are specific to how Bangladeshis search for accommodation. Bhara Mobile is designed from the ground up around these categories, making it immediately intuitive to local users. 

##### **9.2  Unified Web and Mobile Ecosystem** 

Because the mobile app shares the exact same backend and database as the web app, a listing posted from the web is instantly visible on mobile, and vice versa. Users registered on the web can log into the mobile app with the same credentials, and all their conversations, requests, and listings are immediately available. This seamless continuity is rare among student projects and mirrors how production platforms like Airbnb or Shohoz operate. 

##### **9.3  In-App Bargaining via Real-time Chat** 

Most rental platforms display a phone number and expect the user to call or send a WhatsApp message. Bhara Mobile includes an in-app chat that allows tenants and landlords to negotiate rent, discuss movein dates, and exchange information — all within a tracked, searchable conversation. This reduces privacy concerns (no need to share personal phone numbers until both parties are comfortable) and keeps the transaction on-platform. 

##### **9.4  Admin-Verified Listing Quality** 

Every listing submitted through the mobile app goes through an admin approval workflow before it goes live. The admin can reject listings with a specific reason (sent as a push notification to the landlord), and the landlord can edit and resubmit. This creates a quality filter that reduces spam, fraudulent listings, and misleading property descriptions — a significant trust differentiator in the Bangladeshi market. 

##### **9.5  GPS-Powered Accurate Location** 

Group 2  |  SDP-II  |  Page 18 of 24 

_Bhara Mobile App  —  Project Report_ 

The native GPS integration allows landlords to set their property location with one tap — the phone's location hardware places the pin precisely on the map. Tenants can then see the exact location, calculate their commute, and make an informed decision before visiting — saving time for both parties. 

##### **9.6  Camera-First Photo Upload** 

By integrating with the device camera through the image_picker package, Bhara Mobile makes it trivial for landlords to photograph their property and post high-quality images. Studies show that listings with photos receive 3-5x more enquiries than those without; removing the friction of photo upload is a direct business impact feature. 

##### **9.7  Push Notifications for Time-Sensitive Actions** 

Rent approvals, request notifications, and chat messages all benefit from real-time delivery. A tenant who receives a push notification that their rent request was approved can respond immediately — before another tenant takes the slot. This time-sensitivity feature has a direct impact on successful rental transactions. 

Group 2  |  SDP-II  |  Page 19 of 24 

_Bhara Mobile App  —  Project Report_ 

### **10. Feasibility and Project Scope** 

##### **10.1  Technical Feasibility** 

The project is technically feasible for the following reasons: 

- The entire backend API (authentication, listings, requests, conversations, notifications) is already built, tested, and deployed on Render. The mobile app is a new client consuming existing endpoints — no backend changes are required for core functionality. 

- Flutter has extensive official documentation (flutter.dev), a large open-source package ecosystem (pub.dev), and thousands of community tutorials specifically covering CRUD apps, Google Maps, image upload, and Firebase integration. 

- The team has hands-on experience with the Bhara data models (User, Listing, RentRequest, Conversation, Notification) from building the web app. This significantly reduces the learning curve for the mobile implementation. 

- Android Studio provides an emulator that can be run on any Windows/macOS PC — no physical Android device is required for development and testing. 

- All third-party services (Google Maps, Cloudinary, MongoDB Atlas, Render) are already configured and free-tier accounts are active. 

##### **10.2  Financial Feasibility** 

The project has zero additional financial cost: 

|**Service**|**Cost**|
|---|---|
|Fluter SDK|Free, open source|
|Android Studio|Free|
|Google Maps API|Free (within $200 monthly credit)|
|Cloudinary|Free (25 GB storage + bandwidth)|
|MongoDB Atlas|Free (M0 cluster, 512 MB)|
|Render (Backend)|Free (750 hrs/month)|
|Firebase (FCM)|Free (Spark plan, unlimited notfcatons)|
|Google Play Store (optonal)|$25 one-tme developer fee|



##### **10.3  Time Feasibility** 

Group 2  |  SDP-II  |  Page 20 of 24 

_Bhara Mobile App  —  Project Report_ 

Based on a 12-week semester, the following phased plan demonstrates that the project can be completed within the course duration: 

|**Phase**|**Duraton**|
|---|---|
|**Phase 1: Setup &**<br>**Auth**|**Week 1–2**|
|**Phase 2: Browse**<br>**& Search**|**Week 3–4**|
|**Phase 3: Detail &**<br>**Maps**|**Week 5–6**|
|**Phase 4: Post &**<br>**Edit**|**Week 7–8**|
|**Phase 5: Chat &**<br>**Requests**|**Week 9–10**|
|**Phase 6: Admin &**<br>**Notfcatons**|**Week 11**|
|**Phase 7: Testng**<br>**& APK**|**Week 12**|



##### **10.4  Project Scope** 

In Scope: 

- All screens and features listed in Section 5 (Major Features and Functionalities). 

- Android APK distribution (sideload-ready). 

- Firebase Cloud Messaging integration for push notifications. 

- Full admin panel mobile interface. 

Out of Scope (deferred to future versions): 

- iOS App Store publication (Flutter codebase is cross-platform but iOS publishing requires a macOS device and Apple Developer account). 

- In-app payment gateway (Stripe, bKash integration). 

- Video uploads for listings. 

- Advanced analytics dashboard for admins. 

- AI-powered rent price suggestions. 

Group 2  |  SDP-II  |  Page 21 of 24 

_Bhara Mobile App  —  Project Report_ 

Group 2  |  SDP-II  |  Page 22 of 24 

_Bhara Mobile App  —  Project Report_ 

### **11. Expected Outcome** 

Upon successful completion of the project, the Bhara Mobile application will deliver the following concrete outcomes: 

##### **11.1  Deliverables** 

|**Deliverable**|**Descripton**|
|---|---|
|Android APK|A fully installable .apk fle compatble with Android 5.0 (API 21) and above,<br>covering over 98% of actve Android devices.|
|Complete Fluter Codebase|A well-structured, documented Fluter project following the Service-<br>Provider-Screen-Widget architecture, ready for further development.|
|Firebase FCM Integraton|A working push notfcaton system with server-side trigger code added to<br>the Express backend and the Fluter app registered as a notfcaton receiver.|
|Final Project Report|This document — a comprehensive record of the project's design,<br>implementaton decisions, and outcomes.|
|Presentaton|A slide deck demonstratng the app's features, architecture, and live demo<br>on an Android device or emulator.|



##### **11.2  User-Facing Outcomes** 

- Tenants will be able to browse, search, filter, and view Bhara rental listings from their Android phone with a smooth, native experience. 

- Landlords will be able to post new listings by photographing the property with their phone camera and setting a GPS location pin — the entire posting workflow completed in under 5 minutes. 

- Both parties will be able to negotiate rent in real-time through the in-app chat without exchanging phone numbers. 

- All users will receive instant push notifications for time-sensitive events (approval, requests, messages) even when the app is closed. 

- Admins will be able to review, approve, and reject listing submissions from a dedicated mobile admin panel. 

##### **11.3  Platform-Level Outcomes** 

Group 2  |  SDP-II  |  Page 23 of 24 

_Bhara Mobile App  —  Project Report_ 

- Bhara becomes a true multi-platform product — web (React) and mobile (Flutter) — served by a single backend and database. 

- All user data, listings, conversations, and requests are unified. A web user and a mobile user interact with the same platform seamlessly. 

- The project demonstrates a production-grade multi-client architecture using industry-standard tools and practices. 

##### **11.4  Learning Outcomes** 

- Proficiency in Flutter and Dart — including state management with Provider, navigation with GoRouter, and HTTP with Dio. 

- Experience integrating third-party native services: Google Maps SDK, Firebase Cloud Messaging, Cloudinary, and device camera/GPS APIs. 

- Understanding of multi-client API architecture — how a single backend serves both a web frontend and a native mobile app. 

- Practical experience building and distributing a release-grade Android APK. 

###### **Conclusion** 

Bhara Mobile is a natural and high-impact extension of the Bhara web platform. By bringing the full rental marketplace experience to Android — with camera integration, GPS location, real-time push notifications, and a native UI — the project addresses the most fundamental gap in Bhara's current offering: accessibility for Bangladesh's smartphone-first user base. The technical foundation is already in place, the team has proven experience with the platform's data models, and the chosen technologies (Flutter, Firebase, Google Maps) are industry-standard, well-documented, and free at the scale required. The project is feasible within a 12-week semester and will produce a meaningful, functional, and distributable product. 

Group 2  |  SDP-II  |  Page 24 of 24 

