import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ── Helpers ───────────────────────────────────────────────────────────────────
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function lerpColor(hexA: number, hexB: number, t: number) {
  return new THREE.Color(hexA).lerp(new THREE.Color(hexB), t);
}

// ── Cloud texture (4 pre-designed layouts, white fluffy shading) ──────────────
function makeCloudTex(layout: number): THREE.CanvasTexture {
  const W = 512, H = 256;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d')!;

  // Each entry: [cx, cy, rx, ry] normalized 0-1
  const LAYOUTS = [
    // Tall classic cumulus
    [[.50,.54,.32,.24],[.36,.41,.22,.28],[.64,.39,.24,.30],
     [.50,.27,.18,.22],[.23,.60,.15,.17],[.77,.57,.17,.19]],
    // Wide flat cloud
    [[.50,.62,.44,.16],[.28,.52,.26,.20],[.72,.50,.28,.22],
     [.50,.40,.20,.20],[.13,.65,.12,.12],[.87,.64,.14,.13]],
    // Small puffy
    [[.50,.51,.27,.24],[.36,.43,.21,.26],[.64,.42,.22,.24],
     [.50,.31,.16,.20],[.26,.58,.13,.16],[.74,.56,.15,.16]],
    // Heavy flat storm cloud
    [[.50,.64,.46,.14],[.25,.56,.28,.18],[.75,.54,.30,.16],
     [.50,.45,.22,.18],[.14,.67,.12,.10],[.86,.66,.14,.11]],
  ] as number[][][];

  for (const [px, py, rx, ry] of LAYOUTS[layout % LAYOUTS.length]) {
    ctx.save();
    ctx.translate(px * W, py * H);
    ctx.scale(rx * W, ry * H);

    // Offset highlight to upper-left (sun from that side)
    const g = ctx.createRadialGradient(-0.18, -0.22, 0, 0, 0, 1);
    g.addColorStop(0,    'rgba(255,255,255,1.00)');
    g.addColorStop(0.22, 'rgba(252,253,255,0.96)');
    g.addColorStop(0.50, 'rgba(240,244,255,0.82)');
    g.addColorStop(0.78, 'rgba(220,228,248,0.42)');
    g.addColorStop(1.00, 'rgba(200,214,240,0.00)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Subtle base shadow
  const sh = ctx.createLinearGradient(0, H * 0.5, 0, H);
  sh.addColorStop(0, 'rgba(0,0,0,0)');
  sh.addColorStop(1, 'rgba(150,168,210,0.14)');
  ctx.fillStyle = sh;
  ctx.fillRect(0, 0, W, H);

  return new THREE.CanvasTexture(cv);
}

// ── Radial glow orb (sun / moon) ─────────────────────────────────────────────
function makeOrbTex(r: number, g: number, b: number, sz = 128): THREE.CanvasTexture {
  const cv = document.createElement('canvas');
  cv.width = sz; cv.height = sz;
  const ctx = cv.getContext('2d')!;
  const h = sz / 2;
  const grd = ctx.createRadialGradient(h, h, 0, h, h, h);
  grd.addColorStop(0,    `rgba(${r},${g},${b},1.0)`);
  grd.addColorStop(0.14, `rgba(${r},${g},${b},0.96)`);
  grd.addColorStop(0.38, `rgba(${r},${g},${b},0.55)`);
  grd.addColorStop(0.72, `rgba(${r},${g},${b},0.12)`);
  grd.addColorStop(1.00, 'rgba(0,0,0,0)');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, sz, sz);
  return new THREE.CanvasTexture(cv);
}

// ── Weather definitions ───────────────────────────────────────────────────────
type WID = 'sunny' | 'day' | 'rain' | 'night';
const CYCLE: WID[] = ['sunny', 'day', 'rain', 'night'];

interface WDef {
  dur: number;          // hold time (seconds) before transitioning out
  skyTopHex:   number;
  skyBotHex:   number;
  cloudTint:   number; // tint colour multiplied with the white texture
  cloudOp:     number; // base opacity multiplier
  cloudSpeed:  number; // drift speed scale
  cloudY:      number; // vertical shift (rain clouds hang lower)
  rainAlpha:   number;
  starAlpha:   number;
  sunAlpha:    number;
  moonAlpha:   number;
  fogHex:      number;
  fogDensity:  number;
}

const WD: Record<WID, WDef> = {
  sunny: {
    dur: 8,
    skyTopHex: 0x1a6ec0,  skyBotHex: 0x7ecef2,
    cloudTint: 0xffffff,  cloudOp: 0.88, cloudSpeed: 2.4, cloudY:  0,
    rainAlpha: 0, starAlpha: 0,   sunAlpha: 1.0, moonAlpha: 0,
    fogHex: 0x7ecef2, fogDensity: 0.0012,
  },
  day: {
    dur: 7,
    skyTopHex: 0x164c96,  skyBotHex: 0x64a8e0,
    cloudTint: 0xe8eefa,  cloudOp: 0.84, cloudSpeed: 1.6, cloudY:  0,
    rainAlpha: 0, starAlpha: 0,   sunAlpha: 0.5, moonAlpha: 0,
    fogHex: 0x64a8e0, fogDensity: 0.0018,
  },
  rain: {
    dur: 10,
    skyTopHex: 0x0d0f1e,  skyBotHex: 0x1e2130,
    cloudTint: 0x545770,  cloudOp: 1.00, cloudSpeed: 4.2, cloudY: -7,
    rainAlpha: 1, starAlpha: 0,   sunAlpha: 0,   moonAlpha: 0,
    fogHex: 0x0f1218, fogDensity: 0.0045,
  },
  night: {
    dur: 8,
    skyTopHex: 0x010108,  skyBotHex: 0x050416,
    cloudTint: 0x1c2040,  cloudOp: 0.52, cloudSpeed: 0.9, cloudY:  4,
    rainAlpha: 0, starAlpha: 1.0, sunAlpha: 0,   moonAlpha: 1.0,
    fogHex: 0x010108, fogDensity: 0.003,
  },
};

const TRANS_DUR = 2.5; // seconds for each cross-fade

// ── Component ─────────────────────────────────────────────────────────────────
export default function SkyBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Renderer (alpha:true → CSS gradient shows through) ──────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    scene.fog    = new THREE.FogExp2(0x010108, 0.003);
    const camera = new THREE.PerspectiveCamera(58, mount.clientWidth / mount.clientHeight, 0.1, 700);
    camera.position.set(0, 0, 65);

    // ─────────────────────────── Stars ──────────────────────────────────────
    const sCv  = document.createElement('canvas'); sCv.width = 32; sCv.height = 32;
    const sCtx = sCv.getContext('2d')!;
    const sG   = sCtx.createRadialGradient(16,16,0,16,16,16);
    sG.addColorStop(0,'rgba(215,228,255,1)');
    sG.addColorStop(0.4,'rgba(180,200,255,0.3)');
    sG.addColorStop(1,'rgba(0,0,0,0)');
    sCtx.fillStyle = sG; sCtx.fillRect(0,0,32,32);
    const starTex = new THREE.CanvasTexture(sCv);

    const SNUM = 1800;
    const sBuf = new Float32Array(SNUM * 3);
    for (let i = 0; i < SNUM; i++) {
      sBuf[i*3]   = (Math.random()-.5)*480;
      sBuf[i*3+1] = (Math.random()-.5)*240;
      sBuf[i*3+2] = -130 - Math.random()*130;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(sBuf, 3));
    const starMat = new THREE.PointsMaterial({
      size:.5, map:starTex, transparent:true, opacity:0,
      depthWrite:false, blending:THREE.AdditiveBlending, sizeAttenuation:true,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ─────────────────────────── Sun ────────────────────────────────────────
    const sunTex = makeOrbTex(255, 230, 120, 256);
    const sunMat = new THREE.SpriteMaterial({
      map:sunTex, transparent:true, opacity:0,
      depthWrite:false, blending:THREE.AdditiveBlending,
    });
    const sunSpr = new THREE.Sprite(sunMat);
    sunSpr.scale.set(30, 30, 1);
    sunSpr.position.set(55, 26, -40);
    scene.add(sunSpr);

    // ─────────────────────────── Moon ───────────────────────────────────────
    const moonTex = makeOrbTex(200, 210, 238, 128);
    const moonMat = new THREE.SpriteMaterial({
      map:moonTex, transparent:true, opacity:0,
      depthWrite:false, blending:THREE.AdditiveBlending,
    });
    const moonSpr = new THREE.Sprite(moonMat);
    moonSpr.scale.set(17, 17, 1);
    moonSpr.position.set(-52, 23, -50);
    scene.add(moonSpr);

    // ─────────────────────────── Clouds ─────────────────────────────────────
    const texPool = [0, 1, 2, 3].map(i => makeCloudTex(i));

    interface CE {
      sprite: THREE.Sprite;
      mat:    THREE.SpriteMaterial;
      baseOp: number;
      speedX: number;
      wobble: number;
      initY:  number;
    }
    const clouds: CE[] = [];
    const NUM_C   = 26;
    const X_RANGE = 270;

    for (let i = 0; i < NUM_C; i++) {
      const depth = Math.random();
      const z     = -98 + depth * 78;
      const sw    = 22  + depth * 62 + Math.random() * 26;
      const sh    = sw  * (0.27 + Math.random() * 0.17);
      const spd   = 1.1 + depth * 3.8 + Math.random() * 0.9;
      const y     = -4  + (Math.random()-.5) * 36;
      const bOp   = 0.11 + depth * 0.24 + Math.random() * 0.07;

      const mat = new THREE.SpriteMaterial({
        map: texPool[i % texPool.length],
        transparent: true, opacity: bOp,
        depthWrite: false, blending: THREE.NormalBlending,
        color: new THREE.Color(1, 1, 1),
      });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(sw, sh, 1);
      sprite.position.set((Math.random()-.5)*X_RANGE, y, z);
      scene.add(sprite);
      clouds.push({ sprite, mat, baseOp: bOp, speedX: spd, wobble: Math.random()*Math.PI*2, initY: y });
    }

    // ─────────────────────────── Rain ───────────────────────────────────────
    const RNUM = 7000;
    const rCv  = document.createElement('canvas'); rCv.width = 2; rCv.height = 16;
    const rCtx = rCv.getContext('2d')!;
    const rG   = rCtx.createLinearGradient(0,0,0,16);
    rG.addColorStop(0,    'rgba(188,210,238,0)');
    rG.addColorStop(0.45, 'rgba(188,210,238,0.88)');
    rG.addColorStop(1,    'rgba(188,210,238,0)');
    rCtx.fillStyle = rG; rCtx.fillRect(0, 0, 2, 16);
    const rainTex = new THREE.CanvasTexture(rCv);

    const rBuf  = new Float32Array(RNUM * 3);
    const rVel  = new Float32Array(RNUM);
    const rXRef = new Float32Array(RNUM);
    for (let i = 0; i < RNUM; i++) {
      rBuf[i*3]   = (Math.random()-.5)*240;
      rBuf[i*3+1] = (Math.random()-.5)*160;
      rBuf[i*3+2] = -10 + Math.random()*52;
      rVel[i]     = 1.5 + Math.random()*1.0;
      rXRef[i]    = rBuf[i*3];
    }
    const rainGeo = new THREE.BufferGeometry();
    rainGeo.setAttribute('position', new THREE.BufferAttribute(rBuf, 3));
    const rainMat = new THREE.PointsMaterial({
      size:0.9, map:rainTex, transparent:true, opacity:0,
      depthWrite:false, blending:THREE.AdditiveBlending, sizeAttenuation:true,
    });
    const rainPts = new THREE.Points(rainGeo, rainMat);
    scene.add(rainPts);

    // ─────────────────────────── Lightning flash plane ───────────────────────
    const ltGeo = new THREE.PlaneGeometry(600, 400);
    const ltMat = new THREE.MeshBasicMaterial({
      color: 0xdde8ff, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide,
    });
    const ltMesh = new THREE.Mesh(ltGeo, ltMat);
    ltMesh.position.z = 62; // just in front of camera
    scene.add(ltMesh);

    // ─────────────────────────── Weather state machine ───────────────────────
    let wIdx   = 0;
    let wFrom: WDef = WD[CYCLE[0]];
    let wTo:   WDef = WD[CYCLE[0]];
    let wTimer = 0;
    let tProg  = 1; // 0→1, done when 1

    // Lightning
    let ltTimer = 0, ltFlash = 0;

    // ─────────────────────────── Main animation loop ─────────────────────────
    const clock = new THREE.Clock();
    let raf: number, lastT = 0;

    function tick() {
      raf = requestAnimationFrame(tick);
      if (!mount) return; // narrows type for TypeScript inside closure
      const now = clock.getElapsedTime();
      const dt  = Math.min(now - lastT, 0.05);
      lastT = now;

      // ── Weather advance ───────────────────────────────────────────────────
      wTimer += dt;
      tProg   = Math.min(tProg + dt / TRANS_DUR, 1);
      if (wTimer >= wFrom.dur && tProg >= 1) {
        wFrom  = WD[CYCLE[wIdx]];
        wIdx   = (wIdx + 1) % CYCLE.length;
        wTo    = WD[CYCLE[wIdx]];
        wTimer = 0; tProg = 0;
      }
      const p = tProg;

      // ── Interpolated values ───────────────────────────────────────────────
      const cSpeed = lerp(wFrom.cloudSpeed,  wTo.cloudSpeed,  p);
      const cOp    = lerp(wFrom.cloudOp,     wTo.cloudOp,     p);
      const cY     = lerp(wFrom.cloudY,      wTo.cloudY,      p);
      const rAlpha = lerp(wFrom.rainAlpha,   wTo.rainAlpha,   p);
      const sAlpha = lerp(wFrom.starAlpha,   wTo.starAlpha,   p);
      const suAlph = lerp(wFrom.sunAlpha,    wTo.sunAlpha,    p);
      const moAlph = lerp(wFrom.moonAlpha,   wTo.moonAlpha,   p);

      // ── Sky gradient → applied directly to div ────────────────────────────
      const skyTop = lerpColor(wFrom.skyTopHex, wTo.skyTopHex, p);
      const skyBot = lerpColor(wFrom.skyBotHex, wTo.skyBotHex, p);
      mount.style.background =
        `linear-gradient(to bottom, ${skyTop.getStyle()} 0%, ` +
        `${lerpColor(wFrom.skyTopHex, wTo.skyTopHex, p).lerp(skyBot, 0.4).getStyle()} 35%, ` +
        `${skyBot.getStyle()} 100%)`;

      // ── Fog ───────────────────────────────────────────────────────────────
      const fog = scene.fog as THREE.FogExp2;
      fog.color.copy(lerpColor(wFrom.fogHex, wTo.fogHex, p));
      fog.density = lerp(wFrom.fogDensity, wTo.fogDensity, p);

      // ── Sun / Moon ────────────────────────────────────────────────────────
      sunMat.opacity   = suAlph;
      moonMat.opacity  = moAlph;
      sunSpr.position.x = 55 + Math.sin(now * 0.011) * 10;
      sunSpr.position.y = 26 + Math.cos(now * 0.008) * 4;

      // ── Stars ─────────────────────────────────────────────────────────────
      starMat.opacity  = sAlpha;
      stars.rotation.z = now * 0.00022;

      // ── Rain ──────────────────────────────────────────────────────────────
      rainMat.opacity = rAlpha;
      if (rAlpha > 0.01) {
        const pArr = (rainGeo.attributes.position as THREE.BufferAttribute).array as Float32Array;
        for (let i = 0; i < RNUM; i++) {
          pArr[i*3+1] -= rVel[i] * 1.0;           // fall
          pArr[i*3]   -= 0.08;                     // slight wind drift
          if (pArr[i*3+1] < -80) {
            pArr[i*3+1] = 80;
            pArr[i*3]   = rXRef[i] + (Math.random()-.5)*12;
          }
        }
        (rainGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      }

      // ── Lightning (during rain) ───────────────────────────────────────────
      if (rAlpha > 0.6) {
        ltTimer += dt;
        ltFlash  = Math.max(0, ltFlash - dt * 9);
        if (ltTimer > 2.5 + Math.random() * 4.5) { ltFlash = 1; ltTimer = 0; }
      } else {
        ltFlash = 0;
      }
      ltMat.opacity = ltFlash * 0.32;

      // ── Clouds ────────────────────────────────────────────────────────────
      const cloudTint = lerpColor(wFrom.cloudTint, wTo.cloudTint, p);
      clouds.forEach(({ sprite, mat, baseOp, speedX, wobble, initY }) => {
        sprite.position.x -= speedX * cSpeed * 0.040;
        if (sprite.position.x < -X_RANGE / 2 - 55) {
          sprite.position.x = X_RANGE / 2 + 55;
          sprite.position.y = initY + cY + (Math.random()-.5)*7;
        }
        // Thermal vertical drift
        sprite.position.y += Math.sin(now * 0.11 + wobble) * 0.0055;
        mat.color.copy(cloudTint);
        mat.opacity = baseOp * cOp;
      });

      // ── Subtle camera breathe ─────────────────────────────────────────────
      camera.position.x = Math.sin(now * 0.027) * 1.8;
      camera.position.y = Math.cos(now * 0.022) * 0.9;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }
    tick();

    // ── Resize ────────────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      texPool.forEach(t => t.dispose());
      starTex.dispose(); sunTex.dispose(); moonTex.dispose(); rainTex.dispose();
      starGeo.dispose(); rainGeo.dispose(); ltGeo.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  // No background here — it is set imperatively each frame via mount.style.background
  return <div ref={mountRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />;
}
