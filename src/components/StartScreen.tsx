import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../utils/constants';

interface Props {
  bestScore: number;
  onPlay: () => void;
  onSettings?: () => void;
}

export default function StartScreen({ bestScore, onPlay, onSettings }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[COLORS.skyTop, COLORS.background]}
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      {onSettings && (
        <TouchableOpacity style={[styles.settingsBtn, { top: insets.top + 12 }]} onPress={onSettings}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      )}

      <View style={styles.content}>
        <Text style={styles.title}>ZOOM</Text>
        <Text style={styles.tagline}>RUN. DODGE. ZOOM.</Text>

        <TouchableOpacity style={styles.playBtn} onPress={onPlay} activeOpacity={0.8}>
          <Text style={styles.playText}>PLAY</Text>
        </TouchableOpacity>

        <Text style={styles.best}>BEST: {bestScore}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 30,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 72,
    fontWeight: '900',
    color: COLORS.uiAccent,
    letterSpacing: 4,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  tagline: {
    fontSize: 16,
    color: COLORS.ui,
    letterSpacing: 3,
    marginTop: 8,
    marginBottom: 48,
    opacity: 0.9,
  },
  playBtn: {
    backgroundColor: COLORS.button,
    paddingHorizontal: 64,
    paddingVertical: 18,
    borderRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playText: {
    color: COLORS.buttonText,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 2,
  },
  best: {
    marginTop: 32,
    color: COLORS.highScore,
    fontSize: 18,
    fontWeight: '700',
  },
  settingsBtn: {
    position: 'absolute',
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    fontSize: 22,
  },
});
