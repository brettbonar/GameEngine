
function getDistance(a, b) {
  let dx = a.x - b.x;
  let dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
};
    
function normalize(point) {
  if (point) {
    let norm = Math.sqrt(point.x * point.x + point.y * point.y);
    if (norm !== 0) {
      return {
        x: point.x / norm,
        y: point.y / norm,
        z: point.z
      }
    }
  }
  return point;
}

export { getDistance, normalize }
