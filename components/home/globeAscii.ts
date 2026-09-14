/** ASCII earth — ray-sphere sampling of a real land mask (adamsky/globe approach). */

import { LAND_B64, LAND_H, LAND_W } from './earthLand';

const BITS = (() => {
  const bin = atob(LAND_B64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
})();

const DLON = (2 * Math.PI) / LAND_W;
const DLAT = Math.PI / LAND_H;

export function globeGrid(box: number) {
  const rows = Math.max(36, Math.min(68, Math.round(box / 6.5)));
  return { cols: rows * 2, rows };
}

export function isLand(lon: number, lat: number) {
  let u = (lon / Math.PI + 1) * 0.5;
  u -= Math.floor(u);
  const v = Math.min(0.9999, Math.max(0, 0.5 - lat / Math.PI));
  const i = ((v * LAND_H) | 0) * LAND_W + ((u * LAND_W) | 0);
  return (BITS[i >> 3] & (1 << (i & 7))) !== 0;
}

/** Screen-space on the ASCII disk, or null if the point is on the far side. */
export function projectGlobePoint(latDeg: number, lonDeg: number, yaw: number, tilt: number) {
  const lat = (latDeg * Math.PI) / 180;
  const lon = (lonDeg * Math.PI) / 180;
  const cl = Math.cos(lat);
  const x = cl * Math.sin(lon);
  const y = Math.sin(lat);
  const z = cl * Math.cos(lon);
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const ct = Math.cos(tilt);
  const st = Math.sin(tilt);
  const nx = x * cy - z * sy;
  const z1 = x * sy + z * cy;
  const ny = y * ct - z1 * st;
  const nz = y * st + z1 * ct;
  if (nz <= 0.05) return null;
  return { nx, ny, nz };
}

function sampleChar(nx: number, ny: number, cy: number, sy: number, ct: number, st: number) {
  const r2 = nx * nx + ny * ny;
  if (r2 >= 1) return ' ';
  const nz = Math.sqrt(1 - r2);
  const y = ny * ct + nz * st;
  const z1 = -ny * st + nz * ct;
  const x = nx * cy + z1 * sy;
  const z = -nx * sy + z1 * cy;
  const lat = Math.asin(Math.max(-1, Math.min(1, y)));
  const lon = Math.atan2(x, z);
  if (!isLand(lon, lat)) return nz > 0.22 ? '.' : ':';
  const coast =
    !isLand(lon + DLON, lat) ||
    !isLand(lon - DLON, lat) ||
    !isLand(lon, lat + DLAT) ||
    !isLand(lon, lat - DLAT);
  if (coast) return Math.abs(lat) > 1.05 ? 'H' : 'g';
  return '@';
}

export function renderAsciiGlobePlain(yaw: number, tilt: number, cols: number, rows: number) {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const ct = Math.cos(tilt);
  const st = Math.sin(tilt);
  let out = '';
  for (let row = 0; row < rows; row++) {
    const ny = ((row + 0.5) / rows) * 2 - 1;
    for (let col = 0; col < cols; col++) {
      out += sampleChar(((col + 0.5) / cols) * 2 - 1, ny, cy, sy, ct, st);
    }
    if (row < rows - 1) out += '\n';
  }
  return out;
}
