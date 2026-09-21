import { Rect } from '../types/game';

export function rectsOverlap(a: Rect, b: Rect): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

export function getPlayerRect(
  x: number,
  y: number,
  width: number,
  height: number
): Rect {
  const paddingX = width * 0.15;
  const paddingY = height * 0.1;
  return {
    x: x + paddingX,
    y: y + paddingY,
    width: width - paddingX * 2,
    height: height - paddingY * 2,
  };
}

export function getObstacleRect(
  x: number,
  y: number,
  width: number,
  height: number
): Rect {
  return { x, y, width, height };
}
