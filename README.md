# ZOOM — Endless Runner MVP

Original mobile endless runner built with **React Native + Expo + TypeScript**.

## Features (MVP)

- Original doodle-style character with run / jump / fall / death animations
- Automatic forward running
- Tap to jump (Space / ↑ on keyboard for testing)
- Procedurally generated obstacles (ground, tall, moving)
- Collectible coins with patterns + particle bursts
- Score based on distance + smooth difficulty ramp
- Local high-score persistence
- Start / Pause / Game Over screens
- Screen shake on collision
- Haptic feedback + settings (Music / SFX mute)
- Portrait orientation, safe-area aware
- Ready for iOS & Android builds

## Quick Start

```bash
cd ZOOM
npm install
npx expo start
```

Then:

- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go on a real device

## Project Structure

```
ZOOM/
├── App.tsx
├── app.json
├── package.json
├── src/
│   ├── components/          # UI & sprites
│   │   ├── Background.tsx
│   │   ├── Coin.tsx
│   │   ├── GameOverScreen.tsx
│   │   ├── GameScreen.tsx   # main orchestrator
│   │   ├── HUD.tsx
│   │   ├── Obstacle.tsx
│   │   ├── Particles.tsx
│   │   ├── PauseScreen.tsx
│   │   ├── Player.tsx
│   │   ├── SettingsModal.tsx
│   │   └── StartScreen.tsx
│   ├── systems/
│   │   ├── AudioManager.ts  # haptics + future sounds
│   │   ├── GameEngine.ts    # core loop & state
│   │   ├── Particles.ts
│   │   └── ProceduralGenerator.ts
│   ├── types/game.ts
│   └── utils/
│       ├── collision.ts
│       ├── constants.ts
│       └── storage.ts
└── assets/
```

## Tech Stack

- Expo SDK 52
- React Native 0.76
- TypeScript
- React Native Reanimated + Gesture Handler
- expo-av + expo-haptics
- AsyncStorage for local saves
- Pure View-based rendering (no external art required for MVP)

## Controls

| Input          | Action   |
|----------------|----------|
| Tap screen     | Jump     |
| Space / ↑      | Jump (dev) |

## Settings

- Toggle Music
- Toggle Sound Effects (currently drives haptics; drop real `.mp3` files into `assets/sounds/` later)

## Next Steps

1. Drop real sound files into `assets/sounds/` and wire them in `AudioManager`
2. Add simple background music loop
3. Create app icon + splash screen
4. `npx eas build` for production iOS/Android
5. Further animation polish / more obstacle variety

---

**ZOOM — RUN. DODGE. ZOOM.**
