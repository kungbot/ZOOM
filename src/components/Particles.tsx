import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Particle } from '../systems/Particles';

interface Props {
  particles: Particle[];
}

export default function ParticleLayer({ particles }: Props) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p) => {
        const opacity = Math.max(0, p.life);
        const scale = 0.5 + p.life * 0.5;
        return (
          <View
            key={p.id}
            style={{
              position: 'absolute',
              left: p.x - p.size / 2,
              top: p.y - p.size / 2,
              width: p.size,
              height: p.size,
              borderRadius: p.size / 2,
              backgroundColor: p.color,
              opacity,
              transform: [{ scale }],
            }}
          />
        );
      })}
    </View>
  );
}
