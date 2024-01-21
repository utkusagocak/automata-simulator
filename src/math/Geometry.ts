/**
 *  Sources
 *    https://paulbourke.net/geometry/circlesphere/
 */

export interface Point {
  x: number;
  y: number;
}

export interface PolarPoint {
  r: number; // Radius
  t: number; // Angle in RADIANS
}

export interface Circle {
  c: Point;
  r: number;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function isInRect(point: Point, rect: Rectangle) {
  if (point.x >= rect.x && point.x <= rect.x + rect.width && point.y >= rect.y && point.y <= rect.y + rect.width) {
    return true;
  }
  return false;
}

export function distanceBetween(point1: Point, point2: Point) {
  return Math.hypot(point2.x - point1.x, point2.y - point1.y);
}

export function midPointBetween(p1: Point, p2: Point) {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2,
  };
}

export function angleBetween(from: Point, to: Point) {
  const translatedPoint = { x: to.x - from.x, y: to.y - from.y };
  return Math.atan2(translatedPoint.y, translatedPoint.x);
}

export function toDegree(radian: number) {
  return radian * (180 / Math.PI);
}

export function toRadian(degree: number) {
  return degree * (Math.PI / 180);
}

/**
 * Angle in clockwise
 * @param point
 * @param center
 * @returns
 */
export function toPolar(point: Point, center: Point = { x: 0, y: 0 }): PolarPoint {
  const translatedPoint = { x: point.x - center.x, y: point.y - center.y };

  return {
    r: Math.hypot(translatedPoint.x, translatedPoint.y),
    t: Math.atan2(translatedPoint.y, translatedPoint.x), // Point.y must first
  };
}

export function fromPolar(point: PolarPoint): Point {
  return {
    x: point.r * Math.cos(point.t),
    y: point.r * Math.sin(point.t),
  };
}

// https://paulbourke.net/geometry/circlesphere/
export function getIntersectionOf2Circles(circle1: Circle, circle2: Circle): [Point, Point] | null {
  const q = distanceBetween(circle1.c, circle2.c);

  // No intersection
  if (q > circle1.r + circle2.r || q < Math.abs(circle1.r - circle2.r) || (q === 0 && circle1.r === circle2.r)) {
    return null;
  }

  // a = (r02 - r12 + d2 ) / (2 d)
  const a = (circle1.r ** 2 - circle2.r ** 2 + q ** 2) / (2 * q);

  // P2 = P0 + a ( P1 - P0 ) / d
  const point = {
    x: circle1.c.x + (a * (circle2.c.x - circle1.c.x)) / q,
    y: circle1.c.y + (a * (circle2.c.y - circle1.c.y)) / q,
  };

  // h2 = r02 - a2
  const h = Math.sqrt(circle1.r ** 2 - a ** 2);

  // x3 = x2 +- h ( y1 - y0 ) / d
  // y3 = y2 -+ h ( x1 - x0 ) / d
  const center1 = {
    x: point.x - h * ((circle1.c.y - circle2.c.y) / q),
    y: point.y + h * ((circle1.c.x - circle2.c.x) / q),
  };

  const center2 = {
    x: point.x + h * ((circle1.c.y - circle2.c.y) / q),
    y: point.y - h * ((circle1.c.x - circle2.c.x) / q),
  };

  return [center1, center2];
}

// TODO
export function getMidPointOfArc(center: Point, start: Point, end: Point) {
  // sweep-flag 1
  const p1 = toPolar(start, center);
  const p2 = toPolar(end, center);
  const angleBetween1 = p1.t - p2.t;
  const angleBetween2 = 2 * Math.PI - Math.abs(angleBetween1);

  // large-arc-flag 1
  const angleBetween = Math.max(angleBetween1, angleBetween2);

  const pMid = { r: p1.r, t: p1.t + angleBetween / 2 };

  const midPoint = fromPolar(pMid);
  midPoint.x += center.x;
  midPoint.y += center.y;

  return midPoint;
}
