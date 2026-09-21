import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const SCREEN = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
};

export const GROUND_Y = SCREEN_HEIGHT * 0.75;

export const PLAYER = {
  width: 48,
  height: 64,
  startX: SCREEN_WIDTH * 0.2,
  jumpForce: -16,
  gravity: 0.7,
  maxFallSpeed: 20,
};

export const GAME = {
  initialSpeed: 6,
  maxSpeed: 18,
  speedIncreaseRate: 0.0008,
  obstacleSpawnBase: 120,
  coinSpawnBase: 80,
};

export const COLORS = {
  background: '#1a1a2e',
  skyTop: '#16213e',
  skyBottom: '#0f3460',
  ground: '#2d6a4f',
  groundDark: '#1b4332',
  player: '#e94560',
  playerOutline: '#0f0f23',
  coin: '#ffd700',
  coinShine: '#fff3b0',
  obstacle: '#e76f51',
  obstacleDark: '#9b2226',
  ui: '#ffffff',
  uiAccent: '#e94560',
  button: '#e94560',
  buttonText: '#ffffff',
  score: '#ffffff',
  highScore: '#ffd700',
};

export const OBSTACLE_SIZES = {
  ground: { width: 50, height: 40 },
  tall: { width: 40, height: 90 },
  moving: { width: 45, height: 35 },
};
