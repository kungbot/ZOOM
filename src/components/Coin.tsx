import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Coin as CoinType } from '../types/game';
import { COLORS } from '../utils/constants';

interface Props {
  coin: CoinType;
}

export default function CoinSprite({ coin }: Props) {
  if (coin.collected) return null;

  return (
    <View
      style={[
        styles.container,
        {
          left: coin.position.x,
          top: coin.position.y,
          width: coin.width,
          height: coin.height,
          transform: [{ rotate: `${coin.rotation % 360}deg` }],
        },
      ]}
    >
      <View style={styles.outer}>
        <View style={styles.inner}>
          <Text style={styles.symbol}>$</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outer: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    backgroundColor: COLORS.coin,
    borderWidth: 3,
    borderColor: '#c9a227',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    width: '70%',
    height: '70%',
    borderRadius: 999,
    backgroundColor: COLORS.coinShine,
    justifyContent: 'center',
    alignItems: 'center',
  },
  symbol: {
    fontSize: 12,
    fontWeight: '900',
    color: '#c9a227',
  },
});
