export type GameState = 'start' | 'playing' | 'paused' | 'gameover';

export type PlayerState = 'idle' | 'running' | 'jumping' | 'falling' | 'dead';

export interface Vector2 {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Player {
  position: Vector2;
  velocity: Vector2;
  width: number;
  height: number;
  state: PlayerState;
  isOnGround: boolean;
  jumpForce: number;
  gravity: number;
}

export type ObstacleType = 'ground' | 'tall' | 'moving';

export interface Obstacle {
  id: string;
  type: ObstacleType;
  position: Vector2;
  width: number;
  height: number;
  speed?: number;
  direction?: number;
}

export interface Coin {
  id: string;
  position: Vector2;
  width: number;
  height: number;
  collected: boolean;
  rotation: number;
}

export interface GameStats {
  score: number;
  coins: number;
  bestScore: number;
  distance: number;
}

export interface Difficulty {
  speed: number;
  obstacleFrequency: number;
  coinFrequency: number;
}

export interface GameSettings {
  musicEnabled: boolean;
  sfxEnabled: boolean;
}
