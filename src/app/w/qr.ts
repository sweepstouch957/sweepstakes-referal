// QR Model 2, version 5-L, byte mode. One Reed-Solomon block, mask 0.
// Fixed capacity keeps generation local and dependency-free.
export function drawCouponQr(canvas: HTMLCanvasElement, value: string) {
  const bytes = new TextEncoder().encode(value);
  if (bytes.length > 106) throw new Error("Coupon code exceeds QR capacity");
  const bits: number[] = [];
  const push = (n: number, length: number) => {
    for (let i = length - 1; i >= 0; i--) bits.push((n >>> i) & 1);
  };
  push(4, 4);
  push(bytes.length, 8);
  bytes.forEach(b => push(b, 8));
  push(0, Math.min(4, 864 - bits.length));
  while (bits.length % 8) bits.push(0);
  const data: number[] = [];
  for (let i = 0; i < bits.length; i += 8) data.push(bits.slice(i, i + 8).reduce((a, b) => a * 2 + b, 0));
  for (let pad = 0; data.length < 108; pad++) data.push(pad % 2 ? 0x11 : 0xec);
  const mul = (a: number, b: number) => {
    let result = 0;
    while (b) {
      if (b & 1) result ^= a;
      a <<= 1;
      if (a & 256) a ^= 0x11d;
      b >>>= 1;
    }
    return result;
  };
  let generator = [1];
  let power = 1;
  for (let i = 0; i < 26; i++) {
    const next = Array(generator.length + 1).fill(0);
    generator.forEach((v, j) => { next[j] ^= v; next[j + 1] ^= mul(v, power); });
    generator = next;
    power = mul(power, 2);
  }
  const remainder = [...data, ...Array(26).fill(0)];
  for (let i = 0; i < data.length; i++) {
    const factor = remainder[i];
    generator.forEach((g, j) => { remainder[i + j] ^= mul(g, factor); });
  }
  const codewords = [...data, ...remainder.slice(108)];
  const size = 37;
  const modules = Array.from({ length: size }, () => Array<boolean>(size).fill(false));
  const reserved = Array.from({ length: size }, () => Array<boolean>(size).fill(false));
  const set = (x: number, y: number, dark: boolean) => {
    if (x >= 0 && y >= 0 && x < size && y < size) {
      modules[y][x] = dark;
      reserved[y][x] = true;
    }
  };
  for (const [cx, cy] of [[3, 3], [33, 3], [3, 33]]) {
    for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
      const distance = Math.max(Math.abs(dx), Math.abs(dy));
      set(cx + dx, cy + dy, distance !== 2 && distance !== 4);
    }
  }
  for (let i = 8; i < size - 8; i++) { set(i, 6, i % 2 === 0); set(6, i, i % 2 === 0); }
  for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
    set(30 + dx, 30 + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
  }
  const format = 0x77c4; // L error correction, mask 0, BCH encoded and XOR masked.
  const bit = (i: number) => !!((format >>> i) & 1);
  for (let i = 0; i <= 5; i++) set(8, i, bit(i));
  set(8, 7, bit(6)); set(8, 8, bit(7)); set(7, 8, bit(8));
  for (let i = 9; i < 15; i++) set(14 - i, 8, bit(i));
  for (let i = 0; i < 8; i++) set(size - 1 - i, 8, bit(i));
  for (let i = 8; i < 15; i++) set(8, size - 15 + i, bit(i));
  set(8, size - 8, true);
  let index = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vertical = 0; vertical < size; vertical++) {
      const y = ((right + 1) & 2) === 0 ? size - 1 - vertical : vertical;
      for (let j = 0; j < 2; j++) {
        const x = right - j;
        if (reserved[y][x]) continue;
        const dark = index < codewords.length * 8 && !!((codewords[index >>> 3] >>> (7 - (index & 7))) & 1);
        modules[y][x] = dark !== ((x + y) % 2 === 0);
        index++;
      }
    }
  }
  const scale = 8;
  canvas.width = canvas.height = (size + 8) * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#171024";
  modules.forEach((row, y) => row.forEach((dark, x) => {
    if (dark) ctx.fillRect((x + 4) * scale, (y + 4) * scale, scale, scale);
  }));
}
