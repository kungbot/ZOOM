import {
  Player,
  Obstacle,
  Coin,
  GameState,
  GameStats,
  Difficulty,
  PlayerState,
} from '../types/game';
import {
  SCREEN,
  GROUND_Y,
  PLAYER,
  GAME,
} from '../utils/constants';
import { rectsOverlap, getPlayerRect, getObstacleRect } from '../utils/collision';
import {
  createObstacle,
  shouldSpawnObstacle,
  shouldSpawnCoin,
  getRandomObstacleType,
  generateCoinPattern,
  isSafeToSpawn,
  cleanupOffscreen,
} from './ProceduralGenerator';
import {
  Particle,
  createCoinParticles,
  createImpactParticles,
  updateParticles,
} from './Particles';

export type GameEvent =
  | { type: 'jump' }
  | { type: 'coin'; x: number; y: number }
  | { type: 'collision'; x: number; y: number }
  | { type: 'gameover' };

type EventCallback = (event: GameEvent) => void;

export class GameEngine {
  player: Player;
  obstacles: Obstacle[] = [];
  coins: Coin[] = [];
  particles: Particle[] = [];
  stats: GameStats;
  difficulty: Difficulty;
  gameState: GameState = 'start';
  shakeIntensity = 0;

  private frameCount = 0;
  private lastObstacleFrame = 0;
  private lastCoinFrame = 0;
  private speed = GAME.initialSpeed;
  private onEvent: EventCallback | null = null;

  constructor(bestScore: number = 0) {
    this.player = this.createPlayer();
    this.stats = {
      score: 0,
      coins: 0,
      bestScore,
      distance: 0,
    };
    this.difficulty = {
      speed: GAME.initialSpeed,
      obstacleFrequency: GAME.obstacleSpawnBase,
      coinFrequency: GAME.coinSpawnBase,
    };
  }

  setEventCallback(cb: EventCallback) {
    this.onEvent = cb;
  }

  private emit(event: GameEvent) {
    this.onEvent?.(event);
  }

  private createPlayer(): Player {
    return {
      position: { x: PLAYER.startX, y: GROUND_Y - PLAYER.height },
      velocity: { x: 0, y: 0 },
      width: PLAYER.width,
      height: PLAYER.height,
      state: 'idle',
      isOnGround: true,
      jumpForce: PLAYER.jumpForce,
      gravity: PLAYER.gravity,
    };
  }

  start() {
    this.gameState = 'playing';
    this.player.state = 'running';
    this.obstacles = [];
    this.coins = [];
    this.particles = [];
    this.stats.score = 0;
    this.stats.coins = 0;
    this.stats.distance = 0;
    this.frameCount = 0;
    this.lastObstacleFrame = 0;
    this.lastCoinFrame = 0;
    this.speed = GAME.initialSpeed;
    this.shakeIntensity = 0;
    this.player.position.y = GROUND_Y - PLAYER.height;
    this.player.velocity.y = 0;
    this.player.isOnGround = true;
  }

  pause() {
    if (this.gameState === 'playing') {
      this.gameState = 'paused';
    }
  }

  resume() {
    if (this.gameState === 'paused') {
      this.gameState = 'playing';
    }
  }

  jump(): boolean {
    if (
      this.gameState === 'playing' &&
      this.player.isOnGround &&
      this.player.state !== 'dead'
    ) {
      this.player.velocity.y = this.player.jumpForce;
      this.player.isOnGround = false;
      this.player.state = 'jumping';
      this.emit({ type: 'jump' });
      return true;
    }
    return false;
  }

  update(delta: number = 1) {
    if (this.gameState !== 'playing') {
      this.particles = updateParticles(this.particles, delta);
      this.shakeIntensity = Math.max(0, this.shakeIntensity - 0.8 * delta);
      return;
    }

    this.frameCount += 1;

    this.stats.distance += this.speed * delta;
    this.stats.score = Math.floor(this.stats.distance);

    const progress = Math.min(1, this.stats.distance / 8000);
    this.speed = GAME.initialSpeed + (GAME.maxSpeed - GAME.initialSpeed) * progress;
    this.difficulty.speed = this.speed;

    this.updatePlayer(delta);

    if (
      shouldSpawnObstacle(
        this.frameCount,
        this.lastObstacleFrame,
        this.difficulty.obstacleFrequency,
        this.speed
      )
    ) {
      const type = getRandomObstacleType(progress);
      const spawnX = SCREEN.width + 50;
      if (isSafeToSpawn(this.obstacles, spawnX, 160 + this.speed * 5)) {
        this.obstacles.push(createObstacle(type, spawnX, this.speed));
        this.lastObstacleFrame = this.frameCount;
      }
    }

    if (
      shouldSpawnCoin(
        this.frameCount,
        this.lastCoinFrame,
        this.difficulty.coinFrequency
      )
    ) {
      const patternRoll = Math.random();
      let pattern: 'single' | 'arc' | 'line' = 'single';
      if (patternRoll > 0.7) pattern = 'arc';
      else if (patternRoll > 0.4) pattern = 'line';

      const newCoins = generateCoinPattern(SCREEN.width + 30, pattern);
      this.coins.push(...newCoins);
      this.lastCoinFrame = this.frameCount;
    }

    this.obstacles.forEach((obs) => {
      obs.position.x -= this.speed * delta;
      if (obs.type === 'moving' && obs.speed && obs.direction) {
        obs.position.y += obs.speed * obs.direction * delta;
        const minY = GROUND_Y - obs.height - 80;
        const maxY = GROUND_Y - obs.height;
        if (obs.position.y < minY || obs.position.y > maxY) {
          obs.direction *= -1;
        }
      }
    });

    this.coins.forEach((coin) => {
      if (!coin.collected) {
        coin.position.x -= this.speed * delta;
        coin.rotation += 4 * delta;
      }
    });

    this.checkCollisions();

    this.particles = updateParticles(this.particles, delta);
    this.shakeIntensity = Math.max(0, this.shakeIntensity - 0.8 * delta);

    const cleaned = cleanupOffscreen(this.obstacles, this.coins, this.player.position.x);
    this.obstacles = cleaned.obstacles;
    this.coins = cleaned.coins;
  }

  private updatePlayer(delta: number) {
    if (!this.player.isOnGround) {
      this.player.velocity.y += this.player.gravity * delta;
      if (this.player.velocity.y > 20) {
        this.player.velocity.y = 20;
      }
    }

    this.player.position.y += this.player.velocity.y * delta;

    const groundLevel = GROUND_Y - this.player.height;
    if (this.player.position.y >= groundLevel) {
      this.player.position.y = groundLevel;
      this.player.velocity.y = 0;
      this.player.isOnGround = true;
      if (this.player.state === 'jumping' || this.player.state === 'falling') {
        this.player.state = 'running';
      }
    } else {
      this.player.isOnGround = false;
      if (this.player.velocity.y > 0) {
        this.player.state = 'falling';
      }
    }
  }

  private checkCollisions() {
    const playerRect = getPlayerRect(
      this.player.position.x,
      this.player.position.y,
      this.player.width,
      this.player.height
    );

    for (const obs of this.obstacles) {
      const obsRect = getObstacleRect(
        obs.position.x,
        obs.position.y,
        obs.width,
        obs.height
      );
      if (rectsOverlap(playerRect, obsRect)) {
        this.player.state = 'dead';
        this.gameState = 'gameover';
        this.shakeIntensity = 12;
        this.particles.push(
          ...createImpactParticles(
            this.player.position.x + this.player.width / 2,
            this.player.position.y + this.player.height / 2
          )
        );
        this.emit({
          type: 'collision',
          x: this.player.position.x,
          y: this.player.position.y,
        });
        this.emit({ type: 'gameover' });
        return;
      }
    }

    for (const coin of this.coins) {
      if (coin.collected) continue;
      const coinRect = {
        x: coin.position.x,
        y: coin.position.y,
        width: coin.width,
        height: coin.height,
      };
      if (rectsOverlap(playerRect, coinRect)) {
        coin.collected = true;
        this.stats.coins += 1;
        this.particles.push(
          ...createCoinParticles(
            coin.position.x + coin.width / 2,
            coin.position.y + coin.height / 2
          )
        );
        this.emit({
          type: 'coin',
          x: coin.position.x,
          y: coin.position.y,
        });
      }
    }
  }

  getPlayerState(): PlayerState {
    return this.player.state;
  }
}
