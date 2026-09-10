/** ASCII earth — ray-sphere sampling after adamsky/globe (DinoZ1729). */

const CHARS = ' \'.-:;~=oi#@';
export const ASCII_COLS = 42;
export const ASCII_ROWS = 24;

const BLOBS: [number, number, number, number, number][] = [
  [-100, 48, 52, 26, 1],
  [-62, -14, 20, 30, 1],
  [18, 8, 20, 30, 1],
  [18, 52, 26, 12, 0.95],
  [88, 44, 68, 26, 1],
  [78, 22, 26, 14, 0.9],
  [134, -24, 20, 11, 1],
  [0, -84, 180, 10, 1],
];

function land(lon: number, lat: number) {
  const lo = (lon * 180) / Math.PI;
  const la = (lat * 180) / Math.PI;
  let d = 0;
  for (const [cx, cy, rx, ry, amp] of BLOBS) {
    let dx = lo - cx;
    if (dx > 180) dx -= 360;
    if (dx < -180) dx += 360;
    const e = (dx / rx) ** 2 + ((la - cy) / ry) ** 2;
    if (e < 1) d = Math.max(d, amp * (1 - e));
  }
  return d;
}

function sampleChar(nx: number, ny: number, cy: number, sy: number, ct: number, st: number) {
  const r2 = nx * nx + ny * ny;
  if (r2 >= 1) return { ch: ' ', land: false };
  const nz = Math.sqrt(1 - r2);
  const y = ny * ct + nz * st;
  const z1 = -ny * st + nz * ct;
  const x = nx * cy + z1 * sy;
  const z = -nx * sy + z1 * cy;
  const lat = Math.asin(Math.max(-1, Math.min(1, y)));
  const lon = Math.atan2(x, z);
  const L = land(lon, lat);
  if (L > 0.12) {
    const shade = 0.48 + L * 0.52;
    return { ch: CHARS[(shade * (CHARS.length - 1)) | 0], land: true };
  }
  const shade = 0.18 + nz * 0.32;
  return { ch: CHARS[(shade * (CHARS.length - 1)) | 0], land: false };
}

/** Plain text frame (newlines). */
export function renderAsciiGlobePlain(yaw: number, tilt: number) {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const ct = Math.cos(tilt);
  const st = Math.sin(tilt);
  let out = '';
  for (let row = 0; row < ASCII_ROWS; row++) {
    const ny = ((row + 0.5) / ASCII_ROWS) * 2 - 1;
    for (let col = 0; col < ASCII_COLS; col++) {
      const nx = ((col + 0.5) / ASCII_COLS) * 2 - 1;
      out += sampleChar(nx, ny, cy, sy, ct, st).ch;
    }
    if (row < ASCII_ROWS - 1) out += '\n';
  }
  return out;
}
