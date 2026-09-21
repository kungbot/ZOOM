import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SCREEN, GROUND_Y, COLORS } from '../utils/constants';

interface Props {
  offset: number;
}

export default function Background({ offset }: Props) {
  const cloudOffset = (offset * 0.3) % (SCREEN.width + 100);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.skyTop, COLORS.skyBottom]}
        style={StyleSheet.absoluteFill}
      />

      <View
        style={[
          styles.cloud,
          { left: SCREEN.width - cloudOffset, top: 80 },
        ]}
      />
      <View
        style={[
          styles.cloud,
          {
            left: SCREEN.width * 1.5 - cloudOffset,
            top: 140,
            width: 70,
            height: 30,
          },
        ]}
      />

      <View style={styles.ground}>
        <View style={styles.groundTop} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  cloud: {
    position: 'absolute',
    width: 90,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 20,
  },
  ground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: GROUND_Y,
    bottom: 0,
    backgroundColor: COLORS.groundDark,
  },
  groundTop: {
    height: 18,
    backgroundColor: COLORS.ground,
  },
});
