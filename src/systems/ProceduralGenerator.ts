import { Obstacle, Coin, ObstacleType } from '../types/game';
import { SCREEN, GROUND_Y, OBSTACLE_SIZES, PLAYER } from '../utils/constants';

let obstacleIdCounter = 0;
let coinIdCounter = 0;

function generateId(prefix: string): string {
  if (prefix === 'obs') {
    obstacleIdCounter += 1;
    return `obs_${obstacleIdCounter}`;
  }
  coinIdCounter += 1;
  return `coin_${coinIdCounter}`;
}

export function createObstacle(
  type: ObstacleType,
  x: number,
  speed: number
): Obstacle {
  const size = OBSTACLE_SIZES[type];
  let y = GROUND_Y - size.height;

  if (type === 'moving') {
    y = GROUND_Y - size.height - 20;
  }

  return {
    id: generateId('obs'),
    type,
    position: { x, y },
    width: size.width,
    height: size.height,
    speed: type === 'moving' ? 2 + Math.random() * 2 : undefined,
    direction: type === 'moving' ? (Math.random() > 0.5 ? 1 : -1) : undefined,
  };
}

export function createCoin(x: number, yOffset: number = 0): Coin {
  const size = 28;
  return {
    id: generateId('coin'),
    position: {
      x,
      y: GROUND_Y - size - 10 - yOffset,
    },
    width: size,
    height: size,
    collected: false,
    rotation: 0,
  };
}

export function shouldSpawnObstacle(
  frameCount: number,
  lastSpawnFrame: number,
  baseInterval: number,
  speed: number
): boolean {
  const interval = Math.max(40, baseInterval - speed * 4);
  return frameCount - lastSpawnFrame >= interval;
}

export function shouldSpawnCoin(
  frameCount: number,
  lastSpawnFrame: number,
  baseInterval: number
): boolean {
  return frameCount - lastSpawnFrame >= baseInterval;
}

export function getRandomObstacleType(difficulty: number): ObstacleType {
  const r = Math.random();
  if (difficulty < 0.3) {
    return r < 0.7 ? 'ground' : 'tall';
  }
  if (difficulty < 0.6) {
    if (r < 0.4) return 'ground';
    if (r < 0.75) return 'tall';
    return 'moving';
  }
  if (r < 0.3) return 'ground';
  if (r < 0.6) return 'tall';
  return 'moving';
}

export function generateCoinPattern(
  startX: number,
  pattern: 'single' | 'arc' | 'line' = 'single'
): Coin[] {
  const coins: Coin[] = [];

  if (pattern === 'single') {
    coins.push(createCoin(startX, Math.random() * 60));
  } else if (pattern === 'line') {
    for (let i = 0; i < 4; i++) {
      coins.push(createCoin(startX + i * 40, 20));
    }
  } else if (pattern === 'arc') {
    coins.push(createCoin(startX, 0));
    coins.push(createCoin(startX + 35, 50));
    coins.push(createCoin(startX + 70, 90));
    coins.push(createCoin(startX + 105, 50));
    coins.push(createCoin(startX + 140, 0));
  }

  return coins;
}

export function isSafeToSpawn(
  obstacles: Obstacle[],
  newX: number,
  minGap: number = 180
): boolean {
  for (const obs of obstacles) {
    if (Math.abs(obs.position.x - newX) < minGap) {
      return false;
    }
  }
  return true;
}

export function cleanupOffscreen(
  obstacles: Obstacle[],
  coins: Coin[],
  playerX: number
): { obstacles: Obstacle[]; coins: Coin[] } {
  const margin = 100;
  return {
    obstacles: obstacles.filter((o) => o.position.x + o.width > -margin),
    coins: coins.filter((c) => !c.collected && c.position.x + c.width > -margin),
  };
}
