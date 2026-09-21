import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../utils/constants';

interface Props {
  score: number;
  coins: number;
  onPause: () => void;
}

export default function HUD({ score, coins, onPause }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.left}>
        <Text style={styles.coinLabel}>🪙 {coins}</Text>
      </View>

      <View style={styles.center}>
        <Text style={styles.score}>{score}</Text>
      </View>

      <View style={styles.right}>
        <TouchableOpacity style={styles.pauseBtn} onPress={onPause}>
          <Text style={styles.pauseText}>❚❚</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 20,
  },
  left: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
  },
  coinLabel: {
    color: COLORS.ui,
    fontSize: 18,
    fontWeight: '700',
  },
  score: {
    color: COLORS.score,
    fontSize: 28,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  pauseBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseText: {
    color: COLORS.ui,
    fontSize: 16,
  },
});
