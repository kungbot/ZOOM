import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { COLORS } from '../utils/constants';
import { GameSettings } from '../types/game';

interface Props {
  visible: boolean;
  settings: GameSettings;
  onClose: () => void;
  onToggleMusic: (value: boolean) => void;
  onToggleSfx: (value: boolean) => void;
}

export default function SettingsModal({
  visible,
  settings,
  onClose,
  onToggleMusic,
  onToggleSfx,
}: Props) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={styles.title}>SETTINGS</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Music</Text>
          <Switch
            value={settings.musicEnabled}
            onValueChange={onToggleMusic}
            trackColor={{ false: '#555', true: COLORS.uiAccent }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Sound Effects</Text>
          <Switch
            value={settings.sfxEnabled}
            onValueChange={onToggleSfx}
            trackColor={{ false: '#555', true: COLORS.uiAccent }}
            thumbColor="#fff"
          />
        </View>

        <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
          <Text style={styles.closeText}>CLOSE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
  },
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 20,
    padding: 28,
    width: '80%',
    maxWidth: 300,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.ui,
    textAlign: 'center',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    color: COLORS.ui,
    fontSize: 16,
    fontWeight: '600',
  },
  closeBtn: {
    backgroundColor: COLORS.button,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 8,
  },
  closeText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
});
