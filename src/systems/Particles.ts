export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: 'coin' | 'impact';
}

let particleId = 0;

export function createCoinParticles(x: number, y: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 * i) / 8 + Math.random() * 0.4;
    const speed = 3 + Math.random() * 4;
    particles.push({
      id: `p_${++particleId}`,
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      life: 1,
      maxLife: 1,
      size: 4 + Math.random() * 4,
      color: '#ffd700',
      type: 'coin',
    });
  }
  return particles;
}

export function createImpactParticles(x: number, y: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < 12; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 6;
    particles.push({
      id: `p_${++particleId}`,
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      life: 1,
      maxLife: 1,
      size: 3 + Math.random() * 5,
      color: i % 2 === 0 ? '#e94560' : '#ffffff',
      type: 'impact',
    });
  }
  return particles;
}

export function updateParticles(particles: Particle[], delta: number): Particle[] {
  return particles
    .map((p) => {
      p.x += p.vx * delta;
      p.y += p.vy * delta;
      p.vy += 0.3 * delta;
      p.life -= 0.04 * delta;
      return p;
    })
    .filter((p) => p.life > 0);
}
