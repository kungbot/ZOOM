import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameSettings } from '../types/game';

const KEYS = {
  BEST_SCORE: '@zoom_best_score',
  TOTAL_COINS: '@zoom_total_coins',
  SETTINGS: '@zoom_settings',
};

export async function getBestScore(): Promise<number> {
  try {
    const value = await AsyncStorage.getItem(KEYS.BEST_SCORE);
    return value ? parseInt(value, 10) : 0;
  } catch {
    return 0;
  }
}

export async function setBestScore(score: number): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.BEST_SCORE, score.toString());
  } catch {
    // ignore
  }
}

export async function getTotalCoins(): Promise<number> {
  try {
    const value = await AsyncStorage.getItem(KEYS.TOTAL_COINS);
    return value ? parseInt(value, 10) : 0;
  } catch {
    return 0;
  }
}

export async function addTotalCoins(amount: number): Promise<void> {
  try {
    const current = await getTotalCoins();
    await AsyncStorage.setItem(KEYS.TOTAL_COINS, (current + amount).toString());
  } catch {
    // ignore
  }
}

export async function getSettings(): Promise<GameSettings> {
  try {
    const value = await AsyncStorage.getItem(KEYS.SETTINGS);
    if (value) {
      return JSON.parse(value);
    }
  } catch {
    // ignore
  }
  return { musicEnabled: true, sfxEnabled: true };
}

export async function saveSettings(settings: GameSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch {
    // ignore
  }
}
