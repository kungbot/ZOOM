import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Platform,
  Animated,
} from 'react-native';
import { GameEngine, GameEvent } from '../systems/GameEngine';
import { audioManager } from '../systems/AudioManager';
import { getBestScore, setBestScore, addTotalCoins } from '../utils/storage';
import { GameSettings } from '../types/game';
import Background from './Background';
import PlayerSprite from './Player';
import ObstacleSprite from './Obstacle';
import CoinSprite from './Coin';
import ParticleLayer from './Particles';
import HUD from './HUD';
import StartScreen from './StartScreen';
import GameOverScreen from './GameOverScreen';
import PauseScreen from './PauseScreen';
import SettingsModal from './SettingsModal';

export default function GameScreen() {
  const engineRef = useRef<GameEngine | null>(null);
  const [tick, setTick] = useState(0);
  const [bestScore, setBestScoreState] = useState(0);
  const [isNewHigh, setIsNewHigh] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<GameSettings>({
    musicEnabled: true,
    sfxEnabled: true,
  });

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    (async () => {
      await audioManager.init();
      const s = audioManager.getSettings();
      setSettings(s);

      const best = await getBestScore();
      setBestScoreState(best);

      const engine = new GameEngine(best);
      engine.setEventCallback((event: GameEvent) => {
        switch (event.type) {
          case 'jump':
            audioManager.playJump();
            break;
          case 'coin':
            audioManager.playCoin();
            break;
          case 'collision':
            audioManager.playCollision();
            Animated.sequence([
              Animated.timing(shakeAnim, {
                toValue: 1,
                duration: 50,
                useNativeDriver: true,
              }),
              Animated.timing(shakeAnim, {
                toValue: -1,
                duration: 50,
                useNativeDriver: true,
              }),
              Animated.timing(shakeAnim, {
                toValue: 1,
                duration: 50,
                useNativeDriver: true,
              }),
              Animated.timing(shakeAnim, {
                toValue: 0,
                duration: 50,
                useNativeDriver: true,
              }),
            ]).start();
            break;
          case 'gameover':
            audioManager.playGameOver();
            break;
        }
      });
      engineRef.current = engine;
      setTick((t) => t + 1);
    })();
  }, []);

  useEffect(() => {
    const loop = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const delta = Math.min(2, (time - lastTimeRef.current) / 16.67);
      lastTimeRef.current = time;

      const engine = engineRef.current;
      if (engine) {
        engine.update(delta);
        if (
          engine.gameState === 'playing' ||
          engine.particles.length > 0 ||
          engine.shakeIntensity > 0
        ) {
          setTick((t) => t + 1);
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        engineRef.current?.jump();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleJump = useCallback(() => {
    engineRef.current?.jump();
  }, []);

  const handlePlay = useCallback(() => {
    audioManager.playButton();
    engineRef.current?.start();
    setIsNewHigh(false);
    setTick((t) => t + 1);
  }, []);

  const handlePause = useCallback(() => {
    audioManager.playButton();
    engineRef.current?.pause();
    setTick((t) => t + 1);
  }, []);

  const handleResume = useCallback(() => {
    audioManager.playButton();
    engineRef.current?.resume();
    setTick((t) => t + 1);
  }, []);

  const handleRestart = useCallback(() => {
    audioManager.playButton();
    engineRef.current?.start();
    setIsNewHigh(false);
    setTick((t) => t + 1);
  }, []);

  const handleHome = useCallback(() => {
    audioManager.playButton();
    if (engineRef.current) {
      engineRef.current.gameState = 'start';
      setTick((t) => t + 1);
    }
  }, []);

  const handleToggleMusic = useCallback(async (value: boolean) => {
    await audioManager.setMusicEnabled(value);
    setSettings(audioManager.getSettings());
  }, []);

  const handleToggleSfx = useCallback(async (value: boolean) => {
    await audioManager.setSfxEnabled(value);
    setSettings(audioManager.getSettings());
  }, []);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine || engine.gameState !== 'gameover') return;

    (async () => {
      const score = engine.stats.score;
      if (score > bestScore) {
        await setBestScore(score);
        setBestScoreState(score);
        setIsNewHigh(true);
      }
      if (engine.stats.coins > 0) {
        await addTotalCoins(engine.stats.coins);
      }
    })();
  }, [tick, bestScore]);

  const engine = engineRef.current;
  if (!engine) {
    return <View style={styles.container} />;
  }

  const { player, obstacles, coins, particles, stats, gameState, shakeIntensity } = engine;

  const shakeX = shakeAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-8, 8],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.world,
          {
            transform: [
              { translateX: shakeIntensity > 0 ? shakeX : 0 },
            ],
          },
        ]}
      >
        <Background offset={stats.distance} />

        {gameState !== 'start' && (
          <Pressable style={styles.gameArea} onPress={handleJump}>
            <PlayerSprite
              x={player.position.x}
              y={player.position.y}
              state={player.state}
            />

            {obstacles.map((obs) => (
              <ObstacleSprite key={obs.id} obstacle={obs} />
            ))}

            {coins.map((coin) => (
              <CoinSprite key={coin.id} coin={coin} />
            ))}

            <ParticleLayer particles={particles} />
          </Pressable>
        )}
      </Animated.View>

      {(gameState === 'playing' || gameState === 'paused') && (
        <HUD
          score={stats.score}
          coins={stats.coins}
          onPause={handlePause}
        />
      )}

      {gameState === 'start' && (
        <StartScreen
          bestScore={bestScore}
          onPlay={handlePlay}
          onSettings={() => setShowSettings(true)}
        />
      )}

      {gameState === 'paused' && (
        <PauseScreen
          onResume={handleResume}
          onRestart={handleRestart}
          onHome={handleHome}
          onSettings={() => setShowSettings(true)}
        />
      )}

      {gameState === 'gameover' && (
        <GameOverScreen
          score={stats.score}
          coins={stats.coins}
          bestScore={Math.max(bestScore, stats.score)}
          isNewHigh={isNewHigh}
          onRetry={handleRestart}
          onHome={handleHome}
        />
      )}

      <SettingsModal
        visible={showSettings}
        settings={settings}
        onClose={() => setShowSettings(false)}
        onToggleMusic={handleToggleMusic}
        onToggleSfx={handleToggleSfx}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    overflow: 'hidden',
  },
  world: {
    ...StyleSheet.absoluteFillObject,
  },
  gameArea: {
    ...StyleSheet.absoluteFillObject,
  },
});
