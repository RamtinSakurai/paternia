// ============================================================
// Noise helper (shared)
// ============================================================
function createNoise(seed) {
  const p = new Array(512);
  for (let i = 0; i < 256; i++) {
    p[i] = Math.floor(((Math.sin(seed * 127.1 + i * 311.7) * 43758.5453) % 1 + 1) % 1 * 256);
  }
  for (let i = 0; i < 256; i++) p[256 + i] = p[i];
  const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (t, a, b) => a + t * (b - a);
  const grad = (hash, x, y) => {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 8 ? y : x;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  };
  return (x, y) => {
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const u = fade(xf);
    const v = fade(yf);
    const aa = p[p[xi] + yi], ba = p[p[xi + 1] + yi];
    const ab = p[p[xi] + yi + 1], bb = p[p[xi + 1] + yi + 1];
    return lerp(v,
      lerp(u, grad(aa, xf, yf), grad(ba, xf - 1, yf)),
      lerp(u, grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1))
    );
  };
}

// ============================================================
// Utilities
// ============================================================
function rgba(r, g, b, a) {
  return `rgba(${r},${g},${b},${a})`;
}

function clipCircle(ctx, s) {
  ctx.beginPath();
  ctx.arc(s / 2, s / 2, s / 2 - 2, 0, Math.PI * 2);
  ctx.clip();
}

function fillBg(ctx, s, color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, s, s);
}

// ============================================================
// 1. drawFractal (O × C) -- 数理宇宙 -- 紫+金 -- 再帰フラクタル
// ============================================================
function drawFractal(ctx, s, scores, _noise, t) {
  fillBg(ctx, s, "rgb(18,10,30)");
  const cx = s / 2, cy = s / 2;
  const zoom = 1 + Math.sin(t * 0.3) * 0.15;

  const colors = [
    [180, 130, 255],
    [255, 210, 100],
    [140, 90, 220],
    [255, 180, 80],
  ];

  const drawBranch = (x, y, angle, len, depth, colorIdx) => {
    if (depth === 0 || len < 2) return;
    const ex = x + Math.cos(angle) * len;
    const ey = y + Math.sin(angle) * len;
    const col = colors[colorIdx % colors.length];
    const alpha = 0.2 + (depth / 6) * 0.5;

    ctx.strokeStyle = rgba(col[0], col[1], col[2], alpha);
    ctx.lineWidth = depth * 0.6;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(ex, ey);
    ctx.stroke();

    const branchAngle = 0.5 + Math.sin(t * 0.4 + depth) * 0.1;
    const ratio = 0.7 * zoom * (scores.C * 0.2 + 0.8);
    drawBranch(ex, ey, angle - branchAngle, len * ratio, depth - 1, colorIdx + 1);
    drawBranch(ex, ey, angle + branchAngle, len * ratio, depth - 1, colorIdx + 1);
  };

  const mainLen = s * 0.18 * zoom;
  const branches = 6;
  for (let i = 0; i < branches; i++) {
    const a = (i / branches) * Math.PI * 2 + t * 0.05;
    drawBranch(cx, cy, a, mainLen, 6, i);
  }

  // Center gold jewel
  const coreR = 8 + Math.sin(t * 2) * 2;
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR + 15);
  g.addColorStop(0, "rgba(255,230,150,0.8)");
  g.addColorStop(0.5, "rgba(255,180,80,0.3)");
  g.addColorStop(1, "transparent");
  ctx.fillStyle = g;
  ctx.fillRect(cx - 30, cy - 30, 60, 60);
}

// ============================================================
// 2. drawKaleidoscope (O × E) -- 万華鏡 -- 虹色 -- 6回対称
// ============================================================
function drawKaleidoscope(ctx, s, scores, noise, t) {
  fillBg(ctx, s, "rgb(10,8,20)");
  const cx = s / 2, cy = s / 2;
  const segments = 6;
  const sliceAngle = (Math.PI * 2) / segments;
  const rot = t * 0.25;

  // Generate one "wedge" of content, mirror it
  for (let seg = 0; seg < segments; seg++) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(seg * sliceAngle + rot);
    if (seg % 2 === 1) ctx.scale(1, -1); // mirror every other segment

    // Draw asymmetric content inside one slice
    for (let i = 0; i < 18; i++) {
      const r = 15 + i * 7;
      const ax = Math.cos(sliceAngle * 0.3) * r + noise(i, t * 0.5) * 12;
      const ay = Math.sin(sliceAngle * 0.3) * r + noise(i + 50, t * 0.5) * 12;
      const hue = (i * 25 + t * 30) % 360;
      const sz = 3 + Math.sin(t * 1.5 + i) * 2 + scores.E * 3;
      ctx.fillStyle = `hsla(${hue},90%,65%,0.7)`;
      ctx.beginPath();
      ctx.arc(ax, ay, sz, 0, Math.PI * 2);
      ctx.fill();
    }

    // Triangle shards
    for (let j = 0; j < 5; j++) {
      const r = 30 + j * 22;
      ctx.fillStyle = `hsla(${(j * 60 + t * 40) % 360},85%,55%,0.25)`;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(0.1) * r, Math.sin(0.1) * r);
      ctx.lineTo(Math.cos(sliceAngle - 0.1) * (r * 0.8), Math.sin(sliceAngle - 0.1) * (r * 0.8));
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }
}

// ============================================================
// 3. drawSumiE (O × A) -- 墨の流れ -- 藍+クリーム -- 水墨
// ============================================================
function drawSumiE(ctx, s, scores, noise, t) {
  fillBg(ctx, s, "rgb(245,240,225)"); // cream paper
  const cx = s / 2, cy = s / 2;

  // Paper grain
  for (let i = 0; i < 300; i++) {
    const x = noise(i, 0) * s * 0.5 + cx;
    const y = noise(i + 100, 0) * s * 0.5 + cy;
    ctx.fillStyle = `rgba(100,80,50,${Math.abs(noise(i * 2, 0)) * 0.04})`;
    ctx.fillRect(x, y, 2, 2);
  }

  // Ink strokes -- horizontal gestural brush marks
  const strokes = 5 + Math.floor(scores.O * 3);
  for (let s2 = 0; s2 < strokes; s2++) {
    const baseY = cy + (s2 - strokes / 2) * 30;
    const driftX = (t * 15 + s2 * 80) % (s + 100) - 50;
    const startX = cx - s * 0.35 + driftX * 0.3;

    for (let seg = 0; seg < 40; seg++) {
      const progress = seg / 40;
      const x = startX + progress * s * 0.7;
      const y = baseY + noise(seg * 0.3 + s2, t * 0.2) * 15;
      const width = 15 - progress * 12 + Math.abs(noise(seg, s2)) * 8;
      const opacity = (1 - progress * 0.6) * 0.4 * (0.6 + noise(seg, t) * 0.4);

      // Ink dot with bleed
      const g = ctx.createRadialGradient(x, y, 0, x, y, width);
      g.addColorStop(0, `rgba(20,30,70,${opacity})`);
      g.addColorStop(0.6, `rgba(30,40,80,${opacity * 0.4})`);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.fillRect(x - width, y - width, width * 2, width * 2);
    }
  }

  // Red seal
  ctx.fillStyle = "rgba(170,40,40,0.7)";
  ctx.fillRect(s - 50, s - 50, 24, 24);
  ctx.fillStyle = "rgba(245,240,225,0.9)";
  ctx.font = "12px serif";
  ctx.fillText("印", s - 44, s - 34);
}

// ============================================================
// 4. drawEscher (O × N) -- 不可能な幾何 -- 橙+ティール
// ============================================================
function drawEscher(ctx, s, scores, _noise, t) {
  fillBg(ctx, s, "rgb(20,30,40)");
  const cx = s / 2, cy = s / 2;
  const rot = t * 0.15;

  // Penrose triangle
  const size = s * 0.32;
  const colors = [
    [255, 130, 70],   // burnt orange
    [70, 200, 200],   // teal
    [180, 100, 180],  // violet
  ];

  // 3 bars forming impossible triangle
  for (let i = 0; i < 3; i++) {
    const a1 = (i / 3) * Math.PI * 2 + rot;
    const a2 = ((i + 1) / 3) * Math.PI * 2 + rot;
    const x1 = cx + Math.cos(a1) * size;
    const y1 = cy + Math.sin(a1) * size;
    const x2 = cx + Math.cos(a2) * size;
    const y2 = cy + Math.sin(a2) * size;

    // Depth shift illusion
    const perpA = Math.atan2(y2 - y1, x2 - x1) + Math.PI / 2;
    const d = 18 + scores.O * 10;
    const p1x = x1 + Math.cos(perpA) * d;
    const p1y = y1 + Math.sin(perpA) * d;
    const p2x = x2 + Math.cos(perpA) * d;
    const p2y = y2 + Math.sin(perpA) * d;

    const col = colors[i];
    ctx.fillStyle = rgba(col[0], col[1], col[2], 0.85);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(p2x, p2y);
    ctx.lineTo(p1x, p1y);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = rgba(col[0] * 0.5, col[1] * 0.5, col[2] * 0.5, 0.8);
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Tessellated small shapes around -- fish/lizard grid
  const grid = 12;
  for (let gx = 0; gx < s; gx += grid) {
    for (let gy = 0; gy < s; gy += grid) {
      const dist = Math.hypot(gx - cx, gy - cy);
      if (dist < size * 1.3 || dist > s * 0.48) continue;
      const col = colors[(Math.floor(gx / grid) + Math.floor(gy / grid)) % 3];
      ctx.fillStyle = rgba(col[0], col[1], col[2], 0.12);
      ctx.fillRect(gx, gy, grid - 1, grid - 1);
    }
  }
}

// ============================================================
// 5. drawCrystal (C × O) -- 結晶格子 -- 青白シルバー
// ============================================================
function drawCrystal(ctx, s, scores, _noise, t) {
  fillBg(ctx, s, "rgb(15,20,30)");
  const cx = s / 2, cy = s / 2;
  const rot = t * 0.12;

  // Crystal cluster -- hexagonal prisms from center
  const crystals = 7;
  for (let c = 0; c < crystals; c++) {
    const angle = (c / crystals) * Math.PI * 2 + rot;
    const dist = 25 + (c % 3) * 20;
    const cxx = cx + Math.cos(angle) * dist;
    const cyy = cy + Math.sin(angle) * dist;
    const len = 30 + (c % 4) * 15 + scores.C * 20;
    const width = 12 + (c % 3) * 4;

    const tipX = cxx + Math.cos(angle) * len;
    const tipY = cyy + Math.sin(angle) * len;

    // Crystal body (elongated hexagon)
    const perpA = angle + Math.PI / 2;
    const pts = [
      [cxx + Math.cos(perpA) * width, cyy + Math.sin(perpA) * width],
      [tipX + Math.cos(perpA) * width * 0.3, tipY + Math.sin(perpA) * width * 0.3],
      [tipX, tipY],
      [tipX - Math.cos(perpA) * width * 0.3, tipY - Math.sin(perpA) * width * 0.3],
      [cxx - Math.cos(perpA) * width, cyy - Math.sin(perpA) * width],
    ];

    const gradient = ctx.createLinearGradient(cxx, cyy, tipX, tipY);
    gradient.addColorStop(0, "rgba(150,180,220,0.4)");
    gradient.addColorStop(0.5, "rgba(220,240,255,0.7)");
    gradient.addColorStop(1, "rgba(180,210,240,0.3)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(cxx, cyy);
    pts.forEach((p) => ctx.lineTo(p[0], p[1]));
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 0.7;
    ctx.stroke();

    // Facet line
    ctx.beginPath();
    ctx.moveTo(cxx, cyy);
    ctx.lineTo(tipX, tipY);
    ctx.strokeStyle = "rgba(200,220,255,0.3)";
    ctx.stroke();
  }

  // Light glint moving
  const glintAngle = t * 0.8;
  const glintR = s * 0.2;
  const gx = cx + Math.cos(glintAngle) * glintR;
  const gy = cy + Math.sin(glintAngle) * glintR;
  const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, 25);
  g.addColorStop(0, "rgba(255,255,255,0.6)");
  g.addColorStop(1, "transparent");
  ctx.fillStyle = g;
  ctx.fillRect(gx - 25, gy - 25, 50, 50);
}

// ============================================================
// 6. drawSubway (C × E) -- 路線図 -- 赤/黄/青 on 黒
// ============================================================
function drawSubway(ctx, s, scores, _noise, t) {
  fillBg(ctx, s, "rgb(8,8,14)");
  const cx = s / 2, cy = s / 2;

  const lines = [
    { color: [230, 60, 70], rot: 0 },
    { color: [255, 200, 40], rot: Math.PI / 3 },
    { color: [60, 130, 230], rot: (Math.PI * 2) / 3 },
  ];

  lines.forEach((line, li) => {
    const col = line.color;
    const rotBase = line.rot + t * 0.08;

    // Draw curved line -- S-curve across canvas
    ctx.beginPath();
    const segs = 40;
    const stations = [];
    for (let i = 0; i <= segs; i++) {
      const u = (i / segs - 0.5) * 2; // -1 to 1
      const pathR = s * 0.38;
      const curveParam = u * Math.PI;
      const localX = u * pathR;
      const localY = Math.sin(curveParam * 1.3 + li * 0.5) * 40;

      // Rotate to line's angle
      const rx = Math.cos(rotBase) * localX - Math.sin(rotBase) * localY;
      const ry = Math.sin(rotBase) * localX + Math.cos(rotBase) * localY;
      const px = cx + rx;
      const py = cy + ry;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
      if (i % 8 === 0) stations.push([px, py]);
    }
    ctx.strokeStyle = rgba(col[0], col[1], col[2], 0.9);
    ctx.lineWidth = 4 + scores.C * 1.5;
    ctx.lineCap = "round";
    ctx.stroke();

    // Stations
    stations.forEach((st, idx) => {
      ctx.fillStyle = "rgb(10,10,15)";
      ctx.beginPath();
      ctx.arc(st[0], st[1], 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = rgba(col[0], col[1], col[2], 1);
      ctx.lineWidth = 2;
      ctx.stroke();

      // Moving train dot
      const trainPhase = ((t * 0.6 + idx * 0.2 + li * 0.3) % 1);
      if (trainPhase < 0.1) {
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.beginPath();
        ctx.arc(st[0], st[1], 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  });

  // Center interchange marker
  ctx.strokeStyle = "rgba(255,255,255,0.4)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, 12, 0, Math.PI * 2);
  ctx.stroke();
}

// ============================================================
// 7. drawSeigaiha (C × A) -- 青海波 -- 藍+白 -- 日本伝統タイル
// ============================================================
function drawSeigaiha(ctx, s, scores, _noise, t) {
  fillBg(ctx, s, "rgb(30,50,95)");
  const tileW = 28;
  const tileH = 16;
  const wave = Math.sin(t * 0.8) * 3;

  // Hex-offset grid of concentric arcs
  const rows = Math.ceil(s / tileH) + 1;
  const cols = Math.ceil(s / tileW) + 2;

  for (let row = -1; row < rows; row++) {
    for (let col = -1; col < cols; col++) {
      const offsetX = (row % 2) * (tileW / 2);
      const cx2 = col * tileW + offsetX;
      const cy2 = row * tileH + wave * (1 + (row % 3) * 0.3);

      for (let ring = 4; ring >= 0; ring--) {
        const r = tileW / 2 - ring * 3.5;
        if (r <= 0) continue;
        const lightness = 50 + ring * 12 + scores.C * 5;
        ctx.strokeStyle = `hsla(220,60%,${lightness}%,0.9)`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(cx2, cy2, r, Math.PI, 0);
        ctx.stroke();
      }
    }
  }

  // Vignette
  const g = ctx.createRadialGradient(s / 2, s / 2, s * 0.3, s / 2, s / 2, s * 0.55);
  g.addColorStop(0, "transparent");
  g.addColorStop(1, "rgba(10,20,50,0.5)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
}

// ============================================================
// 8. drawSeismograph (C × N) -- 地震計 -- セピア+赤
// ============================================================
function drawSeismograph(ctx, s, scores, noise, t) {
  fillBg(ctx, s, "rgb(240,225,200)"); // sepia paper
  const cx = s / 2, cy = s / 2;

  // Paper grain
  for (let i = 0; i < 250; i++) {
    const x = noise(i * 0.5, 0) * s * 0.5 + cx;
    const y = noise(i + 50, 0) * s * 0.5 + cy;
    ctx.fillStyle = `rgba(120,90,50,${Math.abs(noise(i, 0)) * 0.06})`;
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  // Horizontal faint grid lines
  for (let row = 0; row < 6; row++) {
    const y = cy - 90 + row * 32;
    ctx.strokeStyle = "rgba(100,70,40,0.12)";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(20, y);
    ctx.lineTo(s - 20, y);
    ctx.stroke();
  }

  // Seismograph traces -- 3 parallel tracks
  const tracks = 3;
  for (let tr = 0; tr < tracks; tr++) {
    const trY = cy - 50 + tr * 50;
    ctx.strokeStyle = tr === 1 ? "rgba(150,30,30,0.85)" : "rgba(50,35,25,0.75)";
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    for (let x = 20; x < s - 20; x += 1.5) {
      const progress = (x - 20) / (s - 40);
      const scrollT = t * 0.7;
      const n1 = noise(x * 0.05 + scrollT + tr * 10, 0);
      const n2 = noise(x * 0.2 - scrollT * 0.5 + tr, 0);
      // Spikes at specific times
      const spike = Math.sin(x * 0.08 + scrollT * 2 + tr) > 0.9 ? n1 * 25 * scores.N : 0;
      const amp = (5 + scores.N * 8) * (Math.abs(n1) + Math.abs(n2) * 0.5) + spike;
      const y = trY + amp;
      if (x === 20) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Moving playhead
  const ph = 30 + ((t * 40) % (s - 60));
  ctx.strokeStyle = "rgba(150,30,30,0.4)";
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(ph, cy - 80);
  ctx.lineTo(ph, cy + 80);
  ctx.stroke();
}

// ============================================================
// 9. drawFireworks (E × O) -- 花火 -- 赤金白 on 紺
// ============================================================
function drawFireworks(ctx, s, scores, _noise, t) {
  fillBg(ctx, s, "rgb(8,15,35)");
  const cx = s / 2, cy = s / 2;

  // Multiple fireworks at widely-spaced positions with staggered phases
  const bursts = [
    { x: cx - 70, y: cy - 50, phase: (t * 0.8) % 3, color: [255, 80, 100] },
    { x: cx + 70, y: cy - 30, phase: (t * 0.7 + 1.0) % 3, color: [255, 210, 80] },
    { x: cx + 20, y: cy + 60, phase: (t * 0.6 + 2.0) % 3, color: [255, 255, 255] },
    { x: cx - 50, y: cy + 40, phase: (t * 0.75 + 1.5) % 3, color: [180, 220, 255] },
  ];

  bursts.forEach((b) => {
    const p = b.phase;
    if (p < 0.2) return; // dark gap between bursts
    const lifespan = p / 3;
    const particles = 40 + Math.floor(scores.E * 30);
    const maxR = s * 0.32 * (0.5 + lifespan * 0.8);
    const alpha = Math.max(0, 1 - lifespan * 1.2);

    for (let i = 0; i < particles; i++) {
      const a = (i / particles) * Math.PI * 2;
      const speed = 0.8 + (i % 5) * 0.08;
      const r = maxR * speed * (lifespan * 1.3);
      const gravity = lifespan * lifespan * 25;
      const px = b.x + Math.cos(a) * r;
      const py = b.y + Math.sin(a) * r + gravity;

      // Particle head
      ctx.fillStyle = rgba(b.color[0], b.color[1], b.color[2], alpha * 0.9);
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fill();

      // Trailing spark
      for (let tr = 1; tr < 5; tr++) {
        const trR = r - tr * 3;
        if (trR < 0) continue;
        const trX = b.x + Math.cos(a) * trR;
        const trY = b.y + Math.sin(a) * trR + gravity * (1 - tr * 0.15);
        ctx.fillStyle = rgba(b.color[0], b.color[1], b.color[2], alpha * 0.3 * (1 - tr / 5));
        ctx.fillRect(trX, trY, 1.5, 1.5);
      }
    }

    // Center flash at start
    if (lifespan < 0.15) {
      const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, 40);
      g.addColorStop(0, rgba(b.color[0], b.color[1], b.color[2], 0.6));
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.fillRect(b.x - 40, b.y - 40, 80, 80);
    }
  });

  // Rising launch trails (thin streaks from bottom)
  for (let i = 0; i < 3; i++) {
    const trailPhase = (t * 0.4 + i * 0.7) % 1.5;
    if (trailPhase > 0.6) continue;
    const trailX = cx - 80 + i * 80;
    const trailY = s - 20 - trailPhase * s * 0.5;
    const len = 40;
    const g = ctx.createLinearGradient(trailX, trailY, trailX + 3, trailY + len);
    g.addColorStop(0, "rgba(255,200,100,0.7)");
    g.addColorStop(1, "transparent");
    ctx.fillStyle = g;
    ctx.fillRect(trailX - 1, trailY, 2, len);
  }

  // Dim stars in sky
  for (let i = 0; i < 40; i++) {
    const sx = ((i * 97) % s);
    const sy = ((i * 43) % s);
    ctx.fillStyle = `rgba(200,210,255,${0.2 + Math.sin(t * 2 + i) * 0.15})`;
    ctx.fillRect(sx, sy, 1, 1);
  }
}

// ============================================================
// 10. drawArtDeco (E × C) -- アールデコ -- 黒+金+ジェード
// ============================================================
function drawArtDeco(ctx, s, scores, _noise, t) {
  fillBg(ctx, s, "rgb(5,10,12)");
  const cx = s / 2, cy = s / 2;
  const pulse = 1 + Math.sin(t * 0.8) * 0.08;

  // Concentric deco rings with jade accents
  const colors = [
    [212, 175, 55],   // gold
    [60, 145, 110],   // jade
    [255, 215, 100],  // bright gold
  ];

  // Rigid radiating rays
  const rays = 24;
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * Math.PI * 2;
    const long = i % 3 === 0;
    const rOuter = (long ? s * 0.42 : s * 0.32) * pulse;
    const rInner = 35 * pulse;
    const col = long ? colors[0] : colors[1];

    // Tapered ray
    const w = long ? 3 : 1.5;
    const perp = a + Math.PI / 2;
    const p1x = cx + Math.cos(a) * rInner + Math.cos(perp) * w * 0.3;
    const p1y = cy + Math.sin(a) * rInner + Math.sin(perp) * w * 0.3;
    const p2x = cx + Math.cos(a) * rOuter + Math.cos(perp) * w;
    const p2y = cy + Math.sin(a) * rOuter + Math.sin(perp) * w;
    const p3x = cx + Math.cos(a) * rOuter - Math.cos(perp) * w;
    const p3y = cy + Math.sin(a) * rOuter - Math.sin(perp) * w;
    const p4x = cx + Math.cos(a) * rInner - Math.cos(perp) * w * 0.3;
    const p4y = cy + Math.sin(a) * rInner - Math.sin(perp) * w * 0.3;

    ctx.fillStyle = rgba(col[0], col[1], col[2], 0.85);
    ctx.beginPath();
    ctx.moveTo(p1x, p1y);
    ctx.lineTo(p2x, p2y);
    ctx.lineTo(p3x, p3y);
    ctx.lineTo(p4x, p4y);
    ctx.closePath();
    ctx.fill();
  }

  // Concentric chevron rings (deco style)
  for (let ring = 1; ring <= 3; ring++) {
    const r = 30 + ring * 22;
    ctx.strokeStyle = rgba(colors[0][0], colors[0][1], colors[0][2], 0.6);
    ctx.lineWidth = 2.5;
    const points = 12;
    ctx.beginPath();
    for (let p = 0; p <= points; p++) {
      const a = (p / points) * Math.PI * 2;
      const rP = p % 2 === 0 ? r : r + 5;
      const px = cx + Math.cos(a) * rP * pulse;
      const py = cy + Math.sin(a) * rP * pulse;
      if (p === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }

  // Center jade jewel diamond
  const dS = 18 + scores.E * 4;
  ctx.fillStyle = rgba(colors[1][0], colors[1][1], colors[1][2], 0.95);
  ctx.beginPath();
  ctx.moveTo(cx, cy - dS);
  ctx.lineTo(cx + dS * 0.7, cy);
  ctx.lineTo(cx, cy + dS);
  ctx.lineTo(cx - dS * 0.7, cy);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = rgba(colors[2][0], colors[2][1], colors[2][2], 0.9);
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

// ============================================================
// 11. drawParade (E × A) -- パレードの旗 -- 暖色リボン
// ============================================================
function drawParade(ctx, s, scores, noise, t) {
  fillBg(ctx, s, "rgb(40,20,35)");

  const ribbons = [
    { color: [255, 130, 100], yOffset: -50, phase: 0 },
    { color: [255, 210, 100], yOffset: -15, phase: 1.2 },
    { color: [220, 130, 210], yOffset: 20, phase: 2.4 },
    { color: [180, 150, 255], yOffset: 55, phase: 3.6 },
  ];

  ribbons.forEach((r, ri) => {
    const col = r.color;
    const centerY = s / 2 + r.yOffset;

    // Draw ribbon as filled band with wavy top/bottom edges
    ctx.beginPath();
    const pts = [];
    for (let x = 0; x <= s; x += 3) {
      const waveT = t * 1.5 + r.phase + x * 0.015;
      const amp = 14 + Math.sin(t * 0.5 + ri) * 3 + scores.E * 5;
      const y = centerY + Math.sin(waveT) * amp + noise(x * 0.02, t * 0.5 + ri) * 4;
      pts.push([x, y]);
    }

    // Top edge
    pts.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p[0], p[1] - 8);
      else ctx.lineTo(p[0], p[1] - 8);
    });
    // Bottom edge (reverse)
    for (let i = pts.length - 1; i >= 0; i--) {
      ctx.lineTo(pts[i][0], pts[i][1] + 8);
    }
    ctx.closePath();

    const grad = ctx.createLinearGradient(0, centerY - 15, 0, centerY + 15);
    grad.addColorStop(0, rgba(col[0], col[1], col[2], 0.9));
    grad.addColorStop(0.5, rgba(col[0] * 0.8, col[1] * 0.8, col[2] * 0.8, 0.85));
    grad.addColorStop(1, rgba(col[0], col[1], col[2], 0.9));
    ctx.fillStyle = grad;
    ctx.fill();

    // Sparkle dots along ribbon
    for (let i = 0; i < 6; i++) {
      const idx = (Math.floor(t * 30 + i * 20 + r.phase * 10) % pts.length);
      if (idx >= 0 && idx < pts.length) {
        const p = pts[idx];
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.beginPath();
        ctx.arc(p[0], p[1], 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });
}

// ============================================================
// 12. drawExpressionism (E × N) -- 表現主義の渦 -- 血赤+紫黒+黄土
// ============================================================
function drawExpressionism(ctx, s, scores, noise, t) {
  // Textured dark background
  fillBg(ctx, s, "rgb(35,20,25)");
  const cx = s / 2, cy = s / 2;

  // Background texture noise
  for (let i = 0; i < 400; i++) {
    const x = (i * 37) % s;
    const y = (i * 53) % s;
    ctx.fillStyle = `rgba(${60 + Math.abs(noise(i, 0)) * 40},30,40,${Math.abs(noise(i, 1)) * 0.15})`;
    ctx.fillRect(x, y, 3, 3);
  }

  const colors = [
    [180, 30, 30],   // blood red
    [60, 20, 70],    // dark purple
    [200, 140, 50],  // ochre
    [80, 15, 45],
  ];

  // Expressive swirling brush strokes (Munch-like)
  const strokes = 12 + Math.floor(scores.E * 6);
  for (let st = 0; st < strokes; st++) {
    const startAngle = (st / strokes) * Math.PI * 2 + t * 0.1;
    const swirlCenter = (st % 3) - 1;
    const scx = cx + swirlCenter * 30;
    const scy = cy + Math.sin(st) * 30;

    const col = colors[st % colors.length];
    ctx.strokeStyle = rgba(col[0], col[1], col[2], 0.75);
    ctx.lineWidth = 6 + Math.abs(noise(st, t)) * 8;
    ctx.lineCap = "round";

    ctx.beginPath();
    let angle = startAngle;
    let r = 10 + (st % 4) * 18;
    let px = scx + Math.cos(angle) * r;
    let py = scy + Math.sin(angle) * r;
    ctx.moveTo(px, py);

    const segs = 18;
    for (let seg = 0; seg < segs; seg++) {
      angle += 0.4 + noise(seg + st * 10, t * 0.3) * 0.3;
      r += 3;
      if (r > s * 0.4) break;
      px = scx + Math.cos(angle) * r;
      py = scy + Math.sin(angle) * r;
      ctx.lineTo(px, py);
    }
    ctx.stroke();
  }

  // Emotional ochre eye-like blob in center
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30);
  g.addColorStop(0, "rgba(200,140,50,0.7)");
  g.addColorStop(0.6, "rgba(150,40,30,0.4)");
  g.addColorStop(1, "transparent");
  ctx.fillStyle = g;
  ctx.fillRect(cx - 30, cy - 30, 60, 60);
}

// ============================================================
// 13. drawMycelium (A × O) -- 菌糸ネットワーク -- 苔緑+琥珀+白
// ============================================================
function drawMycelium(ctx, s, scores, noise, t) {
  fillBg(ctx, s, "rgb(20,25,18)");
  const cx = s / 2, cy = s / 2;

  // Soil texture
  for (let i = 0; i < 200; i++) {
    const x = (i * 71) % s;
    const y = (i * 29) % s;
    ctx.fillStyle = `rgba(60,45,25,${Math.abs(noise(i, 0.5)) * 0.15})`;
    ctx.fillRect(x, y, 2, 2);
  }

  // Recursive branching function (with memoization via depth limit)
  const drawMycelBranch = (x, y, angle, length, depth) => {
    if (depth === 0 || length < 3) return;

    const growth = Math.min(1, t * 0.3 + depth * 0.1);
    const endX = x + Math.cos(angle) * length * growth;
    const endY = y + Math.sin(angle) * length * growth;

    // Thin hair-like line
    ctx.strokeStyle = `rgba(${180 + depth * 8},${200 + depth * 5},${150 + depth * 10},${0.35 + depth * 0.05})`;
    ctx.lineWidth = 0.5 + depth * 0.15;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Node
    if (depth % 2 === 0) {
      ctx.fillStyle = `rgba(200,170,80,${0.5 + Math.sin(t + depth) * 0.3})`;
      ctx.beginPath();
      ctx.arc(endX, endY, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    const branches = 2 + (depth % 2);
    for (let b = 0; b < branches; b++) {
      const newAngle = angle + (b - branches / 2) * 0.5 + noise(depth * 3 + b, t * 0.2) * 0.6;
      const newLen = length * (0.7 + noise(depth + b * 5, 0) * 0.15);
      drawMycelBranch(endX, endY, newAngle, newLen, depth - 1);
    }
  };

  // Few seeds on lower edge (like trees growing upward from ground)
  const seedPositions = [
    { x: cx - 60, y: cy + 50, ang: -Math.PI * 0.55 },
    { x: cx - 15, y: cy + 70, ang: -Math.PI * 0.5 },
    { x: cx + 40, y: cy + 60, ang: -Math.PI * 0.45 },
    { x: cx + 80, y: cy + 40, ang: -Math.PI * 0.4 },
  ];
  seedPositions.forEach((seed, i) => {
    const angleVariation = Math.sin(t * 0.2 + i) * 0.15;
    drawMycelBranch(seed.x, seed.y, seed.ang + angleVariation, 30 + i * 2, 7);
  });

  // Ground dots scattered at base
  for (let i = 0; i < 30; i++) {
    const gx = cx - 80 + (i * 6);
    const gy = cy + 60 + noise(i, 0) * 15;
    ctx.fillStyle = `rgba(180,150,80,${0.3 + Math.abs(noise(i, 1)) * 0.3})`;
    ctx.beginPath();
    ctx.arc(gx, gy, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Amber fruits along branches (random bright spots)
  for (let i = 0; i < 8; i++) {
    const fx = cx - 60 + noise(i, t * 0.3) * 100;
    const fy = cy + 20 + noise(i + 50, t * 0.3) * 50;
    const fg = ctx.createRadialGradient(fx, fy, 0, fx, fy, 6);
    fg.addColorStop(0, `rgba(255,180,80,${0.5 + Math.sin(t + i) * 0.2})`);
    fg.addColorStop(1, "transparent");
    ctx.fillStyle = fg;
    ctx.fillRect(fx - 6, fy - 6, 12, 12);
  }
}

// ============================================================
// 14. drawKnit (A × C) -- 編み物 -- クリーム+ローズ+セージ
// ============================================================
function drawKnit(ctx, s, scores, _noise, t) {
  fillBg(ctx, s, "rgb(60,40,40)");

  const stitchW = 14;
  const stitchH = 16;
  const cols = Math.ceil(s / stitchW) + 1;
  const rows = Math.ceil(s / stitchH) + 1;

  const palettes = [
    [230, 200, 170], // cream
    [220, 140, 150], // rose
    [170, 190, 150], // sage
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Pattern: stripe of rose, then sage, then cream
      const pat = (r + Math.floor(t * 0.3)) % 6;
      let col;
      if (pat < 2) col = palettes[1];
      else if (pat < 4) col = palettes[2];
      else col = palettes[0];

      const offsetX = (r % 2) * (stitchW / 2);
      const x = c * stitchW + offsetX;
      const y = r * stitchH;

      // V-shape stitch
      ctx.strokeStyle = rgba(col[0], col[1], col[2], 0.9);
      ctx.lineWidth = 2.5 + scores.A * 1;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + stitchW / 2, y + stitchH * 0.6);
      ctx.lineTo(x + stitchW, y);
      ctx.stroke();

      // Highlight
      ctx.strokeStyle = rgba(
        Math.min(255, col[0] + 30),
        Math.min(255, col[1] + 30),
        Math.min(255, col[2] + 30),
        0.4
      );
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + 1, y + 1);
      ctx.lineTo(x + stitchW / 2, y + stitchH * 0.6 - 1);
      ctx.lineTo(x + stitchW - 1, y + 1);
      ctx.stroke();
    }
  }
}

// ============================================================
// 15. drawSunshine (A × E) -- 日だまりの雲 -- ピーチ+サーモン+金
// ============================================================
function drawSunshine(ctx, s, scores, noise, t) {
  fillBg(ctx, s, "rgb(70,40,50)");
  const cx = s / 2, cy = s / 2;

  const colors = [
    [255, 200, 150],
    [255, 160, 140],
    [255, 220, 140],
    [250, 180, 190],
    [255, 235, 190],
  ];

  // Soft radial sun rays (14 directions)
  const rays = 14;
  for (let r = 0; r < rays; r++) {
    const a = (r / rays) * Math.PI * 2 + t * 0.1;
    const col = colors[r % colors.length];
    const ex = cx + Math.cos(a) * s * 0.5;
    const ey = cy + Math.sin(a) * s * 0.5;
    const g = ctx.createLinearGradient(cx, cy, ex, ey);
    g.addColorStop(0, rgba(col[0], col[1], col[2], 0.28));
    g.addColorStop(0.55, rgba(col[0], col[1], col[2], 0.1));
    g.addColorStop(1, "transparent");
    ctx.save();
    ctx.strokeStyle = g;
    ctx.lineWidth = 6 + Math.sin(t + r) * 2.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(ex, ey);
    ctx.stroke();
    ctx.restore();
  }

  // Layered warm light pools (denser, richer)
  const pools = 13;
  for (let i = 0; i < pools; i++) {
    const angle = (i / pools) * Math.PI * 2 + t * 0.05;
    const distR = 35 + Math.sin(t * 0.4 + i) * 22;
    const px = cx + Math.cos(angle) * distR + noise(i, t * 0.2) * 15;
    const py = cy + Math.sin(angle) * distR + noise(i + 50, t * 0.2) * 15;
    const poolR = 55 + (i % 4) * 18 + Math.sin(t * 0.5 + i * 0.7) * 12 + scores.A * 10;

    const col = colors[i % colors.length];
    const g = ctx.createRadialGradient(px, py, 0, px, py, poolR);
    g.addColorStop(0, rgba(col[0], col[1], col[2], 0.42));
    g.addColorStop(0.5, rgba(col[0] * 0.9, col[1] * 0.9, col[2] * 0.9, 0.18));
    g.addColorStop(1, "transparent");
    ctx.fillStyle = g;
    ctx.fillRect(px - poolR, py - poolR, poolR * 2, poolR * 2);
  }

  // Shimmering particles (more and varied sizes)
  for (let i = 0; i < 45; i++) {
    const a = (i / 45) * Math.PI * 2 + t * (0.2 + (i % 3) * 0.1);
    const r = 45 + (i % 8) * 14 + Math.sin(t + i) * 18;
    const px = cx + Math.cos(a) * r;
    const py = cy + Math.sin(a) * r;
    const col = colors[i % colors.length];
    const sparkle = (Math.sin(t * 3 + i) + 1) / 2;
    const pr = 1 + sparkle * 2.2;
    ctx.fillStyle = rgba(col[0], col[1], col[2], 0.4 + sparkle * 0.4);
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fill();
  }

  // Corona (broad central glow)
  const coronaR = 78 + Math.sin(t * 0.8) * 8;
  const gCorona = ctx.createRadialGradient(cx, cy, 0, cx, cy, coronaR);
  gCorona.addColorStop(0, "rgba(255,240,200,0.7)");
  gCorona.addColorStop(0.45, "rgba(255,210,160,0.3)");
  gCorona.addColorStop(1, "transparent");
  ctx.fillStyle = gCorona;
  ctx.fillRect(cx - coronaR, cy - coronaR, coronaR * 2, coronaR * 2);

  // Pure center bright core
  const gCore = ctx.createRadialGradient(cx, cy, 0, cx, cy, 22);
  gCore.addColorStop(0, "rgba(255,255,230,0.92)");
  gCore.addColorStop(1, "rgba(255,240,200,0)");
  ctx.fillStyle = gCore;
  ctx.beginPath();
  ctx.arc(cx, cy, 22, 0, Math.PI * 2);
  ctx.fill();
}

// ============================================================
// 16. drawPetals (A × N) -- 散らばる花びら -- パステル on 白灰
// ============================================================
function drawPetals(ctx, s, scores, noise, t) {
  // Pale misty background (different from #15/17 dark purple)
  fillBg(ctx, s, "rgb(220,215,225)");
  const cx = s / 2, cy = s / 2;

  // Subtle texture
  for (let i = 0; i < 200; i++) {
    const x = (i * 47) % s;
    const y = (i * 31) % s;
    ctx.fillStyle = `rgba(200,180,210,${Math.abs(noise(i, 0)) * 0.15})`;
    ctx.fillRect(x, y, 2, 2);
  }

  const colors = [
    [255, 150, 180],  // pink
    [200, 150, 220],  // lavender
    [255, 200, 220],  // soft pink
    [180, 200, 230],  // periwinkle
  ];

  // Scattered individual petals falling (non-symmetric, random positions)
  const petalCount = 18 + Math.floor(scores.A * 8);
  for (let i = 0; i < petalCount; i++) {
    // Random but deterministic position via noise
    const baseX = cx + noise(i * 0.3, 0) * s * 0.42;
    const baseY = cy + noise(i * 0.3 + 100, 0) * s * 0.42;
    // Slow drift / falling motion
    const driftX = Math.sin(t * 0.5 + i * 0.7) * 8;
    const driftY = (t * 12 + i * 20) % s - s / 2;
    const px = baseX + driftX;
    const py = baseY + driftY * 0.3;

    const rot = t * 0.3 + i * 0.8 + noise(i, t * 0.2) * Math.PI;
    const petalLen = 18 + (i % 4) * 6;
    const petalW = petalLen * 0.5;
    const col = colors[i % colors.length];

    // Draw single petal as rotated ellipse
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(rot);
    ctx.fillStyle = rgba(col[0], col[1], col[2], 0.55);
    ctx.beginPath();
    ctx.ellipse(0, 0, petalW, petalLen, 0, 0, Math.PI * 2);
    ctx.fill();

    // Petal vein
    ctx.strokeStyle = rgba(col[0] * 0.7, col[1] * 0.7, col[2] * 0.7, 0.4);
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(0, -petalLen);
    ctx.lineTo(0, petalLen);
    ctx.stroke();
    ctx.restore();
  }

  // Subtle gray mist overlay
  const mistGrad = ctx.createRadialGradient(cx, cy, s * 0.2, cx, cy, s * 0.5);
  mistGrad.addColorStop(0, "transparent");
  mistGrad.addColorStop(1, "rgba(180,180,200,0.3)");
  ctx.fillStyle = mistGrad;
  ctx.fillRect(0, 0, s, s);
}

// ============================================================
// 17. drawMelting (N × O) -- 溶ける時計 -- ライム+マゼンタ+バーント
// ============================================================
function drawMelting(ctx, s, scores, noise, t) {
  fillBg(ctx, s, "rgb(30,15,25)");
  const cx = s / 2, cy = s / 2;

  const colors = [
    [180, 230, 80],   // lime
    [220, 60, 180],   // magenta
    [230, 120, 50],   // burnt orange
  ];

  // Distorted clock face
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(Math.sin(t * 0.4) * 0.1);

  // Melted clock shape (warped circle)
  ctx.beginPath();
  for (let a = 0; a <= Math.PI * 2; a += 0.05) {
    const warp = noise(a * 3, t * 0.4) * 12;
    const dripV = a > Math.PI * 0.5 && a < Math.PI * 1.3
      ? Math.sin((a - Math.PI * 0.5) / 0.8 * Math.PI) * 25 * scores.N
      : 0;
    const r = s * 0.22 + warp;
    const px = Math.cos(a) * r;
    const py = Math.sin(a) * r + dripV;
    if (a === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  const clockGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, s * 0.25);
  clockGrad.addColorStop(0, "rgba(230,120,50,0.85)");
  clockGrad.addColorStop(1, "rgba(150,70,30,0.7)");
  ctx.fillStyle = clockGrad;
  ctx.fill();
  ctx.strokeStyle = "rgba(100,40,20,0.8)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Distorted numerals (dots)
  for (let h = 0; h < 12; h++) {
    const a = (h / 12) * Math.PI * 2 - Math.PI / 2;
    const warp = noise(a * 3, t * 0.4) * 12;
    const r = s * 0.18 + warp;
    const px = Math.cos(a) * r;
    const py = Math.sin(a) * r + (a > Math.PI * 0.5 && a < Math.PI * 1.3 ? Math.sin((a - Math.PI * 0.5) / 0.8 * Math.PI) * 15 : 0);
    ctx.fillStyle = "rgba(40,20,10,0.8)";
    ctx.beginPath();
    ctx.arc(px, py, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Clock hands (lime + magenta)
  const hourA = t * 0.1;
  const minA = t * 0.6;
  ctx.strokeStyle = rgba(colors[0][0], colors[0][1], colors[0][2], 0.9);
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(Math.cos(hourA) * s * 0.12, Math.sin(hourA) * s * 0.12);
  ctx.stroke();

  ctx.strokeStyle = rgba(colors[1][0], colors[1][1], colors[1][2], 0.9);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(Math.cos(minA) * s * 0.18, Math.sin(minA) * s * 0.18);
  ctx.stroke();

  ctx.restore();
}

// ============================================================
// 18. drawStipple (N × C) -- 強迫の点描 -- セピア+黒
// ============================================================
function drawStipple(ctx, s, scores, noise, t) {
  fillBg(ctx, s, "rgb(235,220,195)"); // aged paper
  const cx = s / 2, cy = s / 2;

  // Central golden halo (paper glow)
  const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, s * 0.45);
  halo.addColorStop(0, "rgba(255,220,140,0.38)");
  halo.addColorStop(0.55, "rgba(255,200,110,0.1)");
  halo.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, s, s);

  // ============================================================
  // Fibonacci (golden-angle) seed pattern — sunflower mandala
  // ============================================================
  const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ≈ 137.5°
  const fibCount = 1100;
  for (let i = 0; i < fibCount; i++) {
    const a = i * goldenAngle + t * 0.06;
    const r = Math.sqrt(i) * 3.4;
    if (r > s * 0.44) continue;
    const px = cx + Math.cos(a) * r;
    const py = cy + Math.sin(a) * r;
    const ring = Math.floor(i / 55); // Fibonacci 55
    let color;
    let size;
    if (i % 89 === 0) {
      // Fibonacci 89: rare vermilion highlight
      color = "rgba(170,50,30,0.82)";
      size = 2.6;
    } else if (ring % 3 === 0) {
      color = `rgba(200,160,70,${0.55 + Math.sin(t * 0.5 + i * 0.03) * 0.1})`;
      size = i % 21 === 0 ? 1.8 : 1.3;
    } else if (ring % 3 === 1) {
      color = "rgba(60,40,25,0.5)";
      size = 1.2;
    } else {
      color = "rgba(140,110,60,0.32)";
      size = 1.1;
    }
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(px, py, size, 0, Math.PI * 2);
    ctx.fill();
  }

  const tremor = Math.sin(t * 8) * 0.5;

  // Double spiral stipple: main (CW ink) + counter (CCW gold) — slightly thinned
  const dotCount = 3200;
  for (let i = 0; i < dotCount; i++) {
    const phi1 = i * 0.15 + t * 0.04;
    const rBase1 = Math.sqrt(i) * 2.0;
    if (rBase1 < s * 0.47 && Math.abs(noise(i * 0.1, 0)) >= 0.2) {
      const px = cx + Math.cos(phi1) * rBase1 + tremor * Math.sin(i);
      const py = cy + Math.sin(phi1) * rBase1 + tremor * Math.cos(i);
      const inkDensity = 0.3 + Math.abs(noise(i * 0.02, 0)) * 0.6;
      if (i % 23 === 0) {
        ctx.fillStyle = `rgba(170,50,30,${inkDensity * 0.85})`;
        ctx.fillRect(px - 0.5, py - 0.5, 2, 2);
      } else {
        ctx.fillStyle = `rgba(25,15,10,${inkDensity * 0.7})`;
        ctx.fillRect(px, py, 1, 1);
      }
    }

    if (i % 4 === 0) {
      const phi2 = -i * 0.12 - t * 0.035;
      const rBase2 = Math.sqrt(i) * 2.15;
      if (rBase2 < s * 0.47 && Math.abs(noise(i * 0.1 + 100, 0)) >= 0.3) {
        const px = cx + Math.cos(phi2) * rBase2;
        const py = cy + Math.sin(phi2) * rBase2;
        ctx.fillStyle = `rgba(190,150,60,${0.4 + Math.abs(noise(i * 0.02, t * 0.1)) * 0.45})`;
        ctx.fillRect(px, py, 1, 1);
      }
    }
  }

  // Obsessive rings (tremor)
  for (let ring = 0; ring < 8 + Math.floor(scores.N * 4); ring++) {
    const r = 15 + ring * 12;
    ctx.strokeStyle = `rgba(40,25,15,${0.25 - ring * 0.02})`;
    ctx.lineWidth = 0.4;
    ctx.beginPath();
    for (let a = 0; a <= Math.PI * 2; a += 0.08) {
      const j = Math.sin(a * 30 + ring + t * 2) * 0.8;
      const px = cx + Math.cos(a) * (r + j);
      const py = cy + Math.sin(a) * (r + j);
      if (a === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
  }

  // ============================================================
  // Pilgrim walkers — moving light points spiraling outward
  // ============================================================
  const walkerCount = 3;
  for (let w = 0; w < walkerCount; w++) {
    const walkerT = (t * 0.12 + w / walkerCount) % 1;
    for (let trail = 0; trail < 8; trail++) {
      const tt = Math.max(0, walkerT - trail * 0.012);
      const wA = tt * Math.PI * 7 + w * 2.1;
      const wR = tt * s * 0.42;
      const wx = cx + Math.cos(wA) * wR;
      const wy = cy + Math.sin(wA) * wR;
      const fade = 1 - trail / 8;
      const size = (3 + fade * 3) * (trail === 0 ? 1 : 0.8);
      const wGlow = ctx.createRadialGradient(wx, wy, 0, wx, wy, size * 2);
      wGlow.addColorStop(0, `rgba(255,240,180,${0.85 * fade})`);
      wGlow.addColorStop(1, "rgba(255,220,140,0)");
      ctx.fillStyle = wGlow;
      ctx.beginPath();
      ctx.arc(wx, wy, size * 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Outer gold ritual bounds (3 thin circles)
  for (let gc = 0; gc < 3; gc++) {
    const rR = s * 0.45 + gc * 3;
    ctx.strokeStyle = `rgba(180,140,60,${0.38 - gc * 0.1})`;
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.arc(cx, cy, rR, 0, Math.PI * 2);
    ctx.stroke();
  }

  // ============================================================
  // Ritual gems — 12 markers on the outer circle (4 cardinal = vermilion)
  // ============================================================
  const gemCount = 12;
  const gemR = s * 0.455;
  for (let g = 0; g < gemCount; g++) {
    const a = (g / gemCount) * Math.PI * 2 - Math.PI / 2;
    const gx = cx + Math.cos(a) * gemR;
    const gy = cy + Math.sin(a) * gemR;
    const isCardinal = g % 3 === 0; // 12, 3, 6, 9 o'clock
    const pulse = (Math.sin(t * 1.5 + g * 0.5) + 1) / 2;
    const gemSize = isCardinal ? 3.5 : 2.2;
    const gGlow = ctx.createRadialGradient(gx, gy, 0, gx, gy, gemSize * 3);
    if (isCardinal) {
      gGlow.addColorStop(0, `rgba(220,80,50,${0.7 + pulse * 0.3})`);
      gGlow.addColorStop(1, "rgba(220,80,50,0)");
    } else {
      gGlow.addColorStop(0, `rgba(220,170,80,${0.6 + pulse * 0.2})`);
      gGlow.addColorStop(1, "rgba(220,170,80,0)");
    }
    ctx.fillStyle = gGlow;
    ctx.beginPath();
    ctx.arc(gx, gy, gemSize * 3, 0, Math.PI * 2);
    ctx.fill();
    // bright inner point
    ctx.fillStyle = isCardinal ? "rgba(255,150,120,0.95)" : "rgba(255,220,140,0.9)";
    ctx.beginPath();
    ctx.arc(gx, gy, gemSize, 0, Math.PI * 2);
    ctx.fill();
  }

  // Central focal dot (pilgrimage destination)
  const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 16);
  coreGlow.addColorStop(0, "rgba(255,240,180,0.92)");
  coreGlow.addColorStop(1, "rgba(255,220,140,0)");
  ctx.fillStyle = coreGlow;
  ctx.beginPath();
  ctx.arc(cx, cy, 16, 0, Math.PI * 2);
  ctx.fill();
}

// ============================================================
// 19. drawWarning (N × E) -- 警告記号 -- 蛍光イエロー+黒+赤
// ============================================================
function drawWarning(ctx, s, scores, _noise, t) {
  fillBg(ctx, s, "rgb(8,6,4)");
  const cx = s / 2, cy = s / 2;
  const flash = (Math.sin(t * 5) + 1) / 2;

  // Yellow-black hazard stripe border (retained)
  const stripes = 20;
  for (let i = 0; i < stripes; i++) {
    const a1 = (i / stripes) * Math.PI * 2;
    const a2 = ((i + 1) / stripes) * Math.PI * 2;
    const r1 = s * 0.42;
    const r2 = s * 0.48;
    ctx.fillStyle = i % 2 === 0 ? "rgb(255,220,0)" : "rgb(10,10,10)";
    ctx.beginPath();
    ctx.arc(cx, cy, r1, a1, a2);
    ctx.arc(cx, cy, r2, a2, a1, true);
    ctx.closePath();
    ctx.fill();
  }

  // Propagating sonar waves (concentric rings expanding outward)
  const waveCount = 4;
  for (let w = 0; w < waveCount; w++) {
    const phase = ((t * 0.8 + w / waveCount) % 1);
    const rW = s * (0.1 + phase * 0.28);
    const alpha = (1 - phase) * 0.55;
    ctx.strokeStyle = `rgba(255,230,50,${alpha})`;
    ctx.lineWidth = 2 + (1 - phase) * 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, rW, 0, Math.PI * 2);
    ctx.stroke();

    // thin red shadow outside the yellow wave — warning echo
    ctx.strokeStyle = `rgba(230,50,40,${alpha * 0.5})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, rW + 2.5, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Central sharp 8-pointed caution star (replaces triangle + exclamation)
  const points = 8;
  const rInner = s * 0.045;
  const rOuter = s * 0.16 + flash * 4;
  ctx.beginPath();
  for (let p = 0; p < points * 2; p++) {
    const a = (p / (points * 2)) * Math.PI * 2 - Math.PI / 2 + t * 0.2;
    const r = p % 2 === 0 ? rOuter : rInner;
    const px = cx + Math.cos(a) * r;
    const py = cy + Math.sin(a) * r;
    if (p === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  const starGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rOuter);
  starGrad.addColorStop(0, `rgba(255,240,80,${0.9 + flash * 0.1})`);
  starGrad.addColorStop(1, "rgba(230,180,0,0.75)");
  ctx.fillStyle = starGrad;
  ctx.fill();
  ctx.strokeStyle = "rgb(10,10,10)";
  ctx.lineWidth = 2.5 + scores.N * 1.5;
  ctx.stroke();

  // Red alert pulse (retained, subtler)
  if (flash > 0.6) {
    ctx.strokeStyle = `rgba(230,30,30,${(flash - 0.6) * 1.8})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, s * 0.39, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Rotating radar scanline
  const scanA = t * 1.2;
  const scanGrad = ctx.createLinearGradient(
    cx, cy,
    cx + Math.cos(scanA) * s * 0.4,
    cy + Math.sin(scanA) * s * 0.4
  );
  scanGrad.addColorStop(0, "rgba(255,230,0,0.55)");
  scanGrad.addColorStop(1, "rgba(255,230,0,0)");
  ctx.strokeStyle = scanGrad;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(scanA) * s * 0.4, cy + Math.sin(scanA) * s * 0.4);
  ctx.stroke();

  // Zigzag lightning strokes around border (retained)
  const zigzags = 6;
  for (let z = 0; z < zigzags; z++) {
    const a = (z / zigzags) * Math.PI * 2 + t * 0.3;
    const rStart = s * 0.3;
    const rEnd = s * 0.4;
    ctx.strokeStyle = "rgba(255,230,0,0.6)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const segs = 5;
    for (let seg = 0; seg <= segs; seg++) {
      const u = seg / segs;
      const r = rStart + u * (rEnd - rStart);
      const zigA = a + (seg % 2 === 0 ? 0.05 : -0.05);
      const px = cx + Math.cos(zigA) * r;
      const py = cy + Math.sin(zigA) * r;
      if (seg === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }
}

// ============================================================
// 20. drawRipple (N × A) -- 雨の波紋 -- グレー+スチール青+シルバー
// ============================================================
function drawRipple(ctx, s, scores, noise, t) {
  fillBg(ctx, s, "rgb(40,50,60)");
  const cx = s / 2, cy = s / 2;

  // Water surface base with subtle gradient
  const bgG = ctx.createRadialGradient(cx, cy, 0, cx, cy, s * 0.5);
  bgG.addColorStop(0, "rgba(80,100,120,0.4)");
  bgG.addColorStop(1, "rgba(20,30,45,0.6)");
  ctx.fillStyle = bgG;
  ctx.fillRect(0, 0, s, s);

  // Multiple raindrop centers
  const drops = [
    { x: cx, y: cy, phase: (t * 0.5) % 1.5 },
    { x: cx - 45, y: cy + 30, phase: (t * 0.5 + 0.5) % 1.5 },
    { x: cx + 50, y: cy - 35, phase: (t * 0.5 + 1.0) % 1.5 },
    { x: cx - 20, y: cy - 55, phase: (t * 0.5 + 0.75) % 1.5 },
  ];

  drops.forEach((d) => {
    const rings = 4;
    for (let r = 0; r < rings; r++) {
      const phase = d.phase - r * 0.2;
      if (phase < 0 || phase > 1.5) continue;
      const ringR = phase * s * 0.28;
      const alpha = Math.max(0, (1 - phase / 1.5)) * 0.5;

      // Ring with slight wobble
      ctx.strokeStyle = `rgba(180,200,220,${alpha})`;
      ctx.lineWidth = 1.5 - phase * 0.5;
      ctx.beginPath();
      for (let a = 0; a <= Math.PI * 2; a += 0.08) {
        const wobble = noise(a * 2, phase + r) * 2;
        const px = d.x + Math.cos(a) * (ringR + wobble);
        const py = d.y + Math.sin(a) * (ringR + wobble);
        if (a === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }

    // Drop impact point -- teardrop reflection
    if (d.phase < 0.2) {
      const a = 1 - d.phase / 0.2;
      ctx.fillStyle = `rgba(200,220,240,${a * 0.8})`;
      ctx.beginPath();
      ctx.ellipse(d.x, d.y, 3, 4, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Silver streaks of rainfall
  for (let i = 0; i < 15; i++) {
    const x = (i * 31 + Math.floor(t * 100) * 2) % s;
    const yStart = (i * 13 + Math.floor(t * 80) * 3) % s;
    ctx.strokeStyle = `rgba(200,210,225,${0.15 + scores.N * 0.1})`;
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(x, yStart);
    ctx.lineTo(x + 3, yStart + 12);
    ctx.stroke();
  }
}

// ============================================================
// Export map (type code -> draw function) for typecards.html
// ============================================================
window.PATERNIA_DRAW_FUNCTIONS = {
  "OC": drawFractal,
  "OE": drawKaleidoscope,
  "OA": drawSumiE,
  "ON": drawEscher,
  "CO": drawCrystal,
  "CE": drawSubway,
  "CA": drawSeigaiha,
  "CN": drawSeismograph,
  "EO": drawFireworks,
  "EC": drawArtDeco,
  "EA": drawParade,
  "EN": drawExpressionism,
  "AO": drawMycelium,
  "AC": drawKnit,
  "AE": drawSunshine,
  "AN": drawPetals,
  "NO": drawMelting,
  "NC": drawStipple,
  "NE": drawWarning,
  "NA": drawRipple,
};
window.PATERNIA_CREATE_NOISE = createNoise;
