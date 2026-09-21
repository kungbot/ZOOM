import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../utils/constants';

interface Props {
  score: number;
  coins: number;
  bestScore: number;
  isNewHigh: boolean;
  onRetry: () => void;
  onHome: () => void;
}

export default function GameOverScreen({
  score,
  coins,
  bestScore,
  isNewHigh,
  onRetry,
  onHome,
}: Props) {
  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={styles.title}>GAME OVER</Text>

        {isNewHigh && <Text style={styles.newHigh}>NEW HIGH SCORE!</Text>}

        <Text style={styles.stat}>Score: {score}</Text>
        <Text style={styles.stat}>Coins: {coins}</Text>
        <Text style={[styles.stat, styles.best]}>Best: {bestScore}</Text>

        <TouchableOpacity style={styles.btn} onPress={onRetry} activeOpacity={0.8}>
          <Text style={styles.btnText}>RETRY</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnSecondary]}
          onPress={onHome}
          activeOpacity={0.8}
        >
          <Text style={[styles.btnText, styles.btnTextSecondary]}>HOME</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 40,
  },
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '80%',
    maxWidth: 320,
    borderWidth: 2,
    borderColor: COLORS.uiAccent,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.uiAccent,
    marginBottom: 12,
  },
  newHigh: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.highScore,
    marginBottom: 16,
  },
  stat: {
    fontSize: 20,
    color: COLORS.ui,
    marginVertical: 4,
    fontWeight: '600',
  },
  best: {
    color: COLORS.highScore,
    marginBottom: 24,
  },
  btn: {
    backgroundColor: COLORS.button,
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 12,
    width: '100%',
    alignItems: 'center',
  },
  btnSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.ui,
  },
  btnText: {
    color: COLORS.buttonText,
    fontSize: 18,
    fontWeight: '800',
  },
  btnTextSecondary: {
    color: COLORS.ui,
  },
});
