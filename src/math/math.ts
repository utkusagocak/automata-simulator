export function IsInRect(
  point: { x: number; y: number },
  rect: { x: number; y: number; width: number; height: number },
) {
  if (point.x >= rect.x && point.x <= rect.x + rect.width && point.y >= rect.y && point.y <= rect.y + rect.width) {
    return true;
  }
  return false;
}
