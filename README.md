# Student Management Mobile App

A mobile application for managing student data, developed with **React Native** and **Expo** framework.

This project is created for the **Platform-Based Development (PBP)** course assignment.

The application features user authentication, student data management, and multiple screens built with TypeScript and file-based routing system.

---

## ✨ Key Features

- **User Authentication** - Secure login and registration using Firebase Auth
- **Student Data Display** - View student records (Name, Student ID, Major, Year) from Firestore
- **Persistent Sessions** - Automatic session handling with local storage
- **Live Data Updates** - Real-time synchronization with Firestore database
- **Modern Navigation** - File-based routing powered by Expo Router
- **Reusable Components** - Modular UI components for consistent design

---

## 🛠️ Technologies Used

- **React Native** (v0.81.5)
- **Expo SDK** (v54.0.23)
- **Expo Router** (v6.0.14) - File-based navigation
- **TypeScript** (v5.9.2)
- **Firebase** (v12.6.0)
  - Authentication (Email/Password)
  - Cloud Firestore (NoSQL database)
- **Storage Solutions**
  - AsyncStorage (primary)
  - MMKV (fallback)
  - In-memory storage (last resort)

---

## 📂 Directory Structure

```
MahasiswaFirebase/
│
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Main screen - displays student list
│   │   ├── login.tsx          # User login interface
│   │   ├── register.tsx       # User registration interface
│   │   └── explore.tsx        # Additional explore screen
│   └── _layout.tsx            # Application root layout
│
├── src/
│   ├── firebaseConfig.js      # Firebase setup and configuration
│   └── storage.js             # Storage abstraction layer
│
├── components/                # Shared UI components
├── constants/                 # Application constants
└── hooks/                     # Custom React hooks

```

---

## 🚀 Getting Started

### Prerequisites

- Node.js installed
- Expo CLI (or use npx)
- Android Studio / Xcode (for emulator) or physical device with Expo Go

### Installation Steps

1. **Install project dependencies:**

   ```bash
   npm install
   ```

2. **Launch the development server:**

   ```bash
   npm start
   ```

3. **Run on Android device/emulator:**

   ```bash
   npm run android
   ```

   Alternatively, scan the QR code displayed in the terminal using:

   - **Expo Go app** (Android/iOS)
   - **Camera app** (iOS)

---

## ⚙️ Configuration

Firebase settings are configured in:

```
src/firebaseConfig.js
```

**Required Firebase setup:**

1. Enable **Email/Password** authentication in Firebase Console
2. Create a **Cloud Firestore** database
3. Set up a collection named `Mahasiswa` with the following fields:
   - `Nama` (string)
   - `NIM` (string)
   - `Jurusan` (string)
   - `Angkatan` (string)

---

## 📱 Application Flow

1. **Unauthenticated users** are redirected to login/register screen
2. **After authentication**, users can view the student data list
3. **Data updates** are automatically reflected via Firestore real-time listeners
4. **Session persistence** ensures users remain logged in across app restarts

---

**Platform-Based Development (PBP) Course Project**
