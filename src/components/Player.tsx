import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { PlayerState } from '../types/game';
import { COLORS, PLAYER } from '../utils/constants';

interface Props {
  x: number;
  y: number;
  state: PlayerState;
}

export default function PlayerSprite({ x, y, state }: Props) {
  const runAnim = useRef(new Animated.Value(0)).current;
  const jumpScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (state === 'running') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(runAnim, {
            toValue: 1,
            duration: 120,
            useNativeDriver: true,
          }),
          Animated.timing(runAnim, {
            toValue: 0,
            duration: 120,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      runAnim.setValue(0);
    }
  }, [state]);

  useEffect(() => {
    if (state === 'jumping') {
      Animated.sequence([
        Animated.timing(jumpScale, {
          toValue: 1.15,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(jumpScale, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [state]);

  const legOffset = runAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 6],
  });

  const bodyColor = state === 'dead' ? '#555' : COLORS.player;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          left: x,
          top: y,
          transform: [{ scale: jumpScale }],
        },
      ]}
    >
      <View style={[styles.body, { backgroundColor: bodyColor }]}>
        <View style={styles.eye}>
          <View style={styles.pupil} />
        </View>
        {state === 'dead' ? (
          <View style={styles.deadMouth} />
        ) : (
          <View style={styles.mouth} />
        )}
      </View>

      {state !== 'dead' && (
        <>
          <Animated.View
            style={[
              styles.leg,
              styles.legLeft,
              { transform: [{ translateY: legOffset }] },
            ]}
          />
          <Animated.View
            style={[
              styles.leg,
              styles.legRight,
              {
                transform: [
                  {
                    translateY: runAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [6, 0],
                    }),
                  },
                ],
              },
            ]}
          />
        </>
      )}

      <View style={[styles.arm, styles.armLeft]} />
      <View style={[styles.arm, styles.armRight]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: PLAYER.width,
    height: PLAYER.height,
    zIndex: 10,
  },
  body: {
    width: 40,
    height: 44,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: COLORS.playerOutline,
    alignSelf: 'center',
    marginTop: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eye: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 10,
    right: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pupil: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#111',
  },
  mouth: {
    width: 10,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#111',
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  deadMouth: {
    width: 14,
    height: 3,
    backgroundColor: '#111',
    position: 'absolute',
    bottom: 12,
    right: 8,
    transform: [{ rotate: '15deg' }],
  },
  leg: {
    position: 'absolute',
    width: 10,
    height: 18,
    backgroundColor: COLORS.player,
    borderWidth: 2,
    borderColor: COLORS.playerOutline,
    borderRadius: 4,
    bottom: 0,
  },
  legLeft: {
    left: 10,
  },
  legRight: {
    right: 10,
  },
  arm: {
    position: 'absolute',
    width: 8,
    height: 16,
    backgroundColor: COLORS.player,
    borderWidth: 2,
    borderColor: COLORS.playerOutline,
    borderRadius: 4,
    top: 20,
  },
  armLeft: {
    left: 2,
    transform: [{ rotate: '-20deg' }],
  },
  armRight: {
    right: 2,
    transform: [{ rotate: '20deg' }],
  },
});
