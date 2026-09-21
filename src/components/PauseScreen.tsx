import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../utils/constants';

interface Props {
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
  onSettings?: () => void;
}

export default function PauseScreen({ onResume, onRestart, onHome, onSettings }: Props) {
  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={styles.title}>PAUSED</Text>

        <TouchableOpacity style={styles.btn} onPress={onResume} activeOpacity={0.8}>
          <Text style={styles.btnText}>RESUME</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnSecondary]}
          onPress={onRestart}
          activeOpacity={0.8}
        >
          <Text style={[styles.btnText, styles.btnTextSecondary]}>RESTART</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnSecondary]}
          onPress={onHome}
          activeOpacity={0.8}
        >
          <Text style={[styles.btnText, styles.btnTextSecondary]}>HOME</Text>
        </TouchableOpacity>

        {onSettings && (
          <TouchableOpacity
            style={[styles.btn, styles.btnSecondary]}
            onPress={onSettings}
            activeOpacity={0.8}
          >
            <Text style={[styles.btnText, styles.btnTextSecondary]}>SETTINGS</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 40,
  },
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '75%',
    maxWidth: 300,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.ui,
    marginBottom: 28,
  },
  btn: {
    backgroundColor: COLORS.button,
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 10,
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
    fontSize: 16,
    fontWeight: '800',
  },
  btnTextSecondary: {
    color: COLORS.ui,
  },
});
