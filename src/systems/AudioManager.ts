import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { GameSettings } from '../types/game';
import { getSettings, saveSettings } from '../utils/storage';

// Simple programmatic short tones using expo-av (no external files needed for MVP)
// We use very short silent buffers + haptics for reliable feedback on device.
// Real sound assets can be dropped into assets/sounds later.

type SoundKey = 'jump' | 'coin' | 'collision' | 'button' | 'gameover';

class AudioManager {
  private settings: GameSettings = { musicEnabled: true, sfxEnabled: true };
  private initialized = false;
  private musicSound: Audio.Sound | null = null;

  async init() {
    if (this.initialized) return;
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
      this.settings = await getSettings();
      this.initialized = true;
    } catch (e) {
      console.warn('Audio init failed', e);
    }
  }

  getSettings(): GameSettings {
    return { ...this.settings };
  }

  async setMusicEnabled(enabled: boolean) {
    this.settings.musicEnabled = enabled;
    await saveSettings(this.settings);
    if (!enabled && this.musicSound) {
      await this.musicSound.stopAsync();
    }
  }

  async setSfxEnabled(enabled: boolean) {
    this.settings.sfxEnabled = enabled;
    await saveSettings(this.settings);
  }

  async play(key: SoundKey) {
    if (!this.settings.sfxEnabled) return;

    // Haptic feedback as primary reliable feedback on real devices
    try {
      switch (key) {
        case 'jump':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'coin':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'collision':
        case 'gameover':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
        case 'button':
          await Haptics.selectionAsync();
          break;
      }
    } catch {
      // haptics may not be available on all platforms
    }

    // Placeholder for real audio files later:
    // const { sound } = await Audio.Sound.createAsync(require('../../assets/sounds/jump.mp3'));
    // await sound.playAsync();
  }

  async playButton() {
    await this.play('button');
  }

  async playJump() {
    await this.play('jump');
  }

  async playCoin() {
    await this.play('coin');
  }

  async playCollision() {
    await this.play('collision');
  }

  async playGameOver() {
    await this.play('gameover');
  }
}

export const audioManager = new AudioManager();
