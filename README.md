# Lokal Music - JioSaavn API Music Player

A production-ready music streaming application built with React Native (Expo), TypeScript, and Zustand.

##  Features

- **Real-time Search:** Debounced search using JioSaavn API.
- **Persistent Playback:** Background audio support with `react-native-track-player`.
- **Global Mini Player:** Persistent control bar across all screens.
- **Full Player UI:** Beautiful full-screen player with album art, seek bar, and advanced controls.
- **Queue System:** Manage current playback queue with persistence via MMKV.
- **Infinite Scroll:** Paginated search results for seamless browsing.
- **Shuffle & Repeat:** Full support for playback modes.
- **Dark Mode:** Sleek, modern dark-themed UI.

##  Tech Stack

- **Framework:** React Native (Expo)
- **Language:** TypeScript (Strict Mode)
- **State Management:** Zustand
- **Storage:** MMKV (via `react-native-mmkv`)
- **Navigation:** React Navigation v6 (Stack)
- **Audio:** `react-native-track-player`
- **Icons:** Lucide React Native

##  Architecture

```text
src/
 ├── components/       # Reusable UI pieces (SongCard, MiniPlayer, etc.)
 ├── screens/          # Application screens (Home, Player)
 ├── navigation/       # Navigation configuration
 ├── store/            # Zustand state management
 ├── services/         # API (JioSaavn) and TrackPlayer services
 ├── hooks/            # Custom hooks (usePlayer for logic abstraction)
 ├── utils/            # Helper functions
 ├── constants/        # App constants
 ├── App.tsx           # Entry point & Provider setup
```

##  Setup Instructions

### 1. Prerequisites
- Node.js & npm
- Expo Go (for testing UI) or Development Client (for audio playback)

### 2. Installation
```bash
npm install
```

### 3. Running the App
Since `react-native-track-player` is a native module, it requires a **Development Build** or **Prebuild** to run on a real device/emulator with audio capability.

**To run with Expo Prebuild (Recommended for testing native modules):**
```bash
npx expo prebuild
npx expo run:android # or run:ios
```

**To run the dev server:**
```bash
npx expo start
```

##  Trade-offs & Decisions

- **Zustand vs Redux:** Chose Zustand for its simplicity and minimal boilerplate, which fits the requirements for state synchronization perfectly.
- **MMKV:** Selected for its high performance over AsyncStorage, especially for persisting the playback queue.
- **Custom Hook (`usePlayer`):** Abstracted all playback logic into a single hook to ensure consistency between the Mini Player and Full Player screens.
- **Direct API:** Used `saavn.sumit.co` API directly to ensure real data as requested.
# Lokal-Music-Trending-App
