import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Obstacle as ObstacleType } from '../types/game';
import { COLORS } from '../utils/constants';

interface Props {
  obstacle: ObstacleType;
}

export default function ObstacleSprite({ obstacle }: Props) {
  const { type, position, width, height } = obstacle;

  if (type === 'ground') {
    return (
      <View
        style={[
          styles.base,
          {
            left: position.x,
            top: position.y,
            width,
            height,
            backgroundColor: COLORS.obstacle,
            borderRadius: 6,
          },
        ]}
      >
        <View style={styles.spike} />
        <View style={[styles.spike, { left: width * 0.4 }]} />
        <View style={[styles.spike, { left: width * 0.7 }]} />
      </View>
    );
  }

  if (type === 'tall') {
    return (
      <View
        style={[
          styles.base,
          {
            left: position.x,
            top: position.y,
            width,
            height,
            backgroundColor: COLORS.obstacleDark,
            borderRadius: 4,
          },
        ]}
      >
        <View style={styles.tallTop} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.base,
        {
          left: position.x,
          top: position.y,
          width,
          height,
          backgroundColor: '#f4a261',
          borderRadius: 20,
          borderWidth: 3,
          borderColor: COLORS.obstacleDark,
        },
      ]}
    >
      <View style={styles.eyeLeft} />
      <View style={styles.eyeRight} />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    position: 'absolute',
    zIndex: 5,
  },
  spike: {
    position: 'absolute',
    top: -10,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 14,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: COLORS.obstacleDark,
  },
  tallTop: {
    position: 'absolute',
    top: -8,
    left: 4,
    right: 4,
    height: 12,
    backgroundColor: COLORS.obstacle,
    borderRadius: 4,
  },
  eyeLeft: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#111',
  },
  eyeRight: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#111',
  },
});
