/**
 * ============================================================================
 * A Garden For You - Cinematic Interactive Digital Flower Garden
 * High-Performance Smooth 60+ FPS Botanical & Particle Engine (Ultra Optimized)
 * ============================================================================
 */

(function () {
  'use strict';

  // --- Configuration & Tuning ---
  const CONFIG = {
    grassCountFactor: 0.16,      // Optimized for buttery 60+ FPS
    flowerCountFactor: 0.048,    // Lush rich field density
    minFlowers: 36,
    maxFlowers: 72,
    minGrass: 140,
    maxGrass: 260,
    fireflyCount: 45,
    starCount: 75,
    dandelionCount: 14,
    timings: {
      introStart: 400,
      introFadeOut: 3600,
      grassSproutStart: 4000,
      flowerSproutStart: 4500,
      fullBloomDuration: 7500,
      finalMessageDelay: 11000
    }
  };

  // --- Curated Vibrant Botanical Palettes ---
  const FLOWER_PALETTES = [
    { // 1. Radiant Ruby & Velvet Rose
      name: 'ruby-rose',
      outer: '#ff1464',
      inner: '#ff5388',
      highlight: '#ffb3c6',
      core: '#ffe600',
      shadow: '#990033',
      glowRgba: '255, 20, 100'
    },
    { // 2. Sunset Coral, Peach & Golden Tangerine
      name: 'sunset-coral',
      outer: '#ff4b2b',
      inner: '#ff416c',
      highlight: '#ffd166',
      core: '#fff3b0',
      shadow: '#801800',
      glowRgba: '255, 75, 43'
    },
    { // 3. Royal Orchid & Celestial Lavender
      name: 'royal-orchid',
      outer: '#8a2be2',
      inner: '#b55fe6',
      highlight: '#f3c4fb',
      core: '#ffeaa7',
      shadow: '#4b0082',
      glowRgba: '181, 95, 230'
    },
    { // 4. Sunburst Gold & Marigold
      name: 'golden-sun',
      outer: '#f39c12',
      inner: '#f1c40f',
      highlight: '#fff8cc',
      core: '#d35400',
      shadow: '#963e00',
      glowRgba: '241, 196, 15'
    },
    { // 5. Moonlit Opal & Cherry Blossom Pink
      name: 'moon-sakura',
      outer: '#f78ca0',
      inner: '#fe9a8b',
      highlight: '#ffffff',
      core: '#ff99c8',
      shadow: '#b84d64',
      glowRgba: '255, 180, 210'
    },
    { // 6. Bioluminescent Aurora Cyan & Aqua
      name: 'aurora-cyan',
      outer: '#00c6ff',
      inner: '#0072ff',
      highlight: '#cbf3f0',
      core: '#00f5d4',
      shadow: '#004080',
      glowRgba: '0, 245, 212'
    },
    { // 7. Enchanted Indigo & Electric Violet
      name: 'electric-violet',
      outer: '#654ea3',
      inner: '#eaafc8',
      highlight: '#ffffff',
      core: '#ffe66d',
      shadow: '#311b92',
      glowRgba: '101, 78, 163'
    },
    { // 8. Passionate Crimson Scarlet
      name: 'scarlet',
      outer: '#e52d27',
      inner: '#b31217',
      highlight: '#ff9999',
      core: '#ffd700',
      shadow: '#660000',
      glowRgba: '229, 45, 39'
    },
    { // 9. Pastel Holographic / Lilac Cream
      name: 'pastel-fairy',
      outer: '#a18cd1',
      inner: '#fbc2eb',
      highlight: '#ffffff',
      core: '#f6d365',
      shadow: '#5e35b1',
      glowRgba: '251, 194, 235'
    }
  ];

  // --- Botanical Species Enum ---
  const SPECIES = {
    TULIP_ROSE: 0,
    SAKURA: 1,
    DAISY_COSMOS: 2,
    LAVENDER_SPIRE: 3,
    STAR_BLOOM: 4,
    LOTUS_WATERLILY: 5,
    PEONY_LUSH: 6,
    BLEEDING_HEART: 7,
    FAIRY_BLUEBELL: 8
  };

  // --- Pre-rendered Glow Sprites for Blazing Performance ---
  const SpriteCache = {
    fireflies: {},
    pollen: {},

    init() {
      // Pre-render Firefly Glow Sprites (Gold, Pink, Cyan)
      const colors = {
        gold: '255, 235, 140',
        pink: '255, 150, 200',
        cyan: '140, 240, 255'
      };

      for (const [key, rgb] of Object.entries(colors)) {
        const size = 48;
        const cvs = document.createElement('canvas');
        cvs.width = size;
        cvs.height = size;
        const ctx = cvs.getContext('2d');
        const center = size / 2;

        const grad = ctx.createRadialGradient(center, center, 0, center, center, center);
        grad.addColorStop(0, `rgba(${rgb}, 1)`);
        grad.addColorStop(0.35, `rgba(${rgb}, 0.5)`);
        grad.addColorStop(0.7, `rgba(${rgb}, 0.15)`);
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(center, center, center, 0, Math.PI * 2);
        ctx.fill();

        // White hot center
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(center, center, 2.5, 0, Math.PI * 2);
        ctx.fill();

        this.fireflies[key] = cvs;
      }
    }
  };

  // --- Sound Synthesizer (Web Audio API) ---
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.enabled = false;
      this.chords = [
        [293.66, 369.99, 440.00, 554.37], // Dmaj7
        [329.63, 392.00, 493.88, 587.33], // Em7
        [369.99, 440.00, 554.37, 659.25], // F#m7
        [440.00, 554.37, 659.25, 880.00]  // A
      ];
      this.chordIndex = 0;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggle() {
      this.init();
      this.enabled = !this.enabled;
      if (this.enabled) {
        this.playChordPad();
      }
      return this.enabled;
    }

    playSparkle(freqMultiplier = 1) {
      if (!this.enabled || !this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const notes = [587.33, 659.25, 739.99, 880.00, 987.77, 1174.66];
      const freq = notes[Math.floor(Math.random() * notes.length)] * freqMultiplier;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.35);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.65);
    }

    playChordPad() {
      if (!this.enabled || !this.ctx) return;
      const now = this.ctx.currentTime;
      const chord = this.chords[this.chordIndex % this.chords.length];
      this.chordIndex++;

      chord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.02, now + 1.2);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 4.6);
      });

      if (this.enabled) {
        setTimeout(() => this.playChordPad(), 4200);
      }
    }
  }

  // --- Background Star Class ---
  class Star {
    constructor(w, h) {
      this.x = Math.random() * w;
      this.y = Math.random() * (h * 0.72);
      this.radius = 0.6 + Math.random() * 1.4;
      this.twinkleSpeed = 1.0 + Math.random() * 2.0;
      this.twinklePhase = Math.random() * Math.PI * 2;
      this.hue = Math.random() > 0.6 ? 330 : Math.random() > 0.3 ? 200 : 60;
    }

    draw(ctx, time) {
      const alpha = 0.25 + 0.7 * (0.5 + 0.5 * Math.sin(time * 0.0018 * this.twinkleSpeed + this.twinklePhase));
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 90%, 92%, ${alpha})`;
      ctx.fill();

      // Soft glow halo without shadowBlur
      if (this.radius > 1.2 && alpha > 0.6) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 100%, 80%, ${alpha * 0.25})`;
        ctx.fill();
      }
    }
  }

  // --- Floating Dandelion Seed Class ---
  class DandelionSeed {
    constructor(w, h) {
      this.reset(w, h, true);
    }

    reset(w, h, randomY = false) {
      this.x = Math.random() * w;
      this.y = randomY ? Math.random() * h : h + 20;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = -0.3 - Math.random() * 0.4;
      this.size = 5 + Math.random() * 5;
      this.angle = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
      this.alpha = 0.35 + Math.random() * 0.45;
    }

    update(w, h, time, windGlobal) {
      this.x += this.vx + windGlobal * 1.1 + Math.sin(time * 0.0015 + this.x) * 0.25;
      this.y += this.vy;
      this.angle += this.rotSpeed;

      if (this.y < -30 || this.x < -40 || this.x > w + 40) {
        this.reset(w, h);
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.globalAlpha = this.alpha;

      ctx.beginPath();
      ctx.arc(0, 0, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = '#fff9e6';
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 0.6;
      const count = 6;
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI - (Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * this.size, Math.sin(a) * this.size);
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  // --- Grass Blade Class ---
  class GrassBlade {
    constructor(x, width, groundY, layer) {
      this.baseX = x;
      this.groundY = groundY;
      this.layer = layer;

      const heightRanges = [
        [35, 75],    // Layer 0
        [65, 125],   // Layer 1
        [95, 165],   // Layer 2
        [130, 210]   // Layer 3
      ];
      const range = heightRanges[layer] || [65, 125];
      this.targetHeight = range[0] + Math.random() * (range[1] - range[0]);
      this.bladeWidth = (layer === 0 ? 1.2 : layer === 1 ? 2.0 : layer === 2 ? 2.6 : 3.4) + Math.random() * 1.0;

      this.lean = (Math.random() - 0.5) * 0.45;
      this.curveControl = (Math.random() - 0.5) * 30;
      this.swaySpeed = 1.1 + Math.random() * 1.5;
      this.swayPhase = Math.random() * Math.PI * 2;
      this.swayAmount = 7 + Math.random() * 12;

      const greens = [
        ['#06170e', '#133d26'],
        ['#082014', '#184d31'],
        ['#0b2a1a', '#226943'],
        ['#0f3923', '#2ea15b']
      ];
      this.colorPair = greens[layer] || greens[1];

      this.sproutProgress = 0;
      this.sproutSpeed = 0.015 + Math.random() * 0.02;
      this.sproutDelay = Math.random() * 1800;
    }

    update(elapsedTime, windGlobal, mouseEffect) {
      if (elapsedTime > this.sproutDelay) {
        if (this.sproutProgress < 1) {
          this.sproutProgress = Math.min(1, this.sproutProgress + this.sproutSpeed);
        }
      }

      this.currentSway = Math.sin(elapsedTime * 0.0014 * this.swaySpeed + this.swayPhase) * this.swayAmount
        + (windGlobal * 13)
        + mouseEffect;
    }

    draw(ctx) {
      if (this.sproutProgress <= 0) return;

      const currentH = this.targetHeight * easeOutCubic(this.sproutProgress);
      const tipX = this.baseX + (this.lean * currentH) + (this.currentSway * this.sproutProgress);
      const tipY = this.groundY - currentH;
      const ctrlX = this.baseX + this.curveControl + (this.currentSway * 0.5 * this.sproutProgress);
      const ctrlY = this.groundY - (currentH * 0.55);

      const grad = ctx.createLinearGradient(this.baseX, this.groundY, tipX, tipY);
      grad.addColorStop(0, this.colorPair[0]);
      grad.addColorStop(1, this.colorPair[1]);

      ctx.beginPath();
      ctx.moveTo(this.baseX - this.bladeWidth * 0.5, this.groundY);
      ctx.quadraticCurveTo(ctrlX, ctrlY, tipX, tipY);
      ctx.quadraticCurveTo(ctrlX + this.bladeWidth * 0.3, ctrlY, this.baseX + this.bladeWidth * 0.5, this.groundY);
      ctx.closePath();

      ctx.fillStyle = grad;
      ctx.fill();
    }
  }

  // --- Flower Botanical Class (9 Species & 4 Depth Layers) ---
  class Flower {
    constructor(x, groundY, layer, index) {
      this.baseX = x;
      this.groundY = groundY;
      this.layer = layer;
      this.index = index;

      const heightConfig = [
        [110, 175], // 0: Horizon
        [165, 250], // 1: Mid-back
        [230, 325], // 2: Mid-front
        [285, 410]  // 3: Foreground hero
      ];
      const scaleConfig = [0.55, 0.78, 1.05, 1.35];
      const opacityConfig = [0.70, 0.85, 0.96, 1.0];

      this.scale = (scaleConfig[layer] || 1.0) * (0.88 + Math.random() * 0.25);
      this.opacity = opacityConfig[layer] || 1.0;
      const range = heightConfig[layer] || [180, 280];
      this.targetHeight = (range[0] + Math.random() * (range[1] - range[0])) * (this.scale / (scaleConfig[layer] || 1.0));

      this.stemCurve = (Math.random() - 0.5) * 50;
      this.stemWidth = (layer === 0 ? 1.8 : layer === 1 ? 2.5 : layer === 2 ? 3.4 : 4.4) * this.scale;

      const allSpecies = [
        SPECIES.TULIP_ROSE,
        SPECIES.SAKURA,
        SPECIES.DAISY_COSMOS,
        SPECIES.LAVENDER_SPIRE,
        SPECIES.STAR_BLOOM,
        SPECIES.LOTUS_WATERLILY,
        SPECIES.PEONY_LUSH,
        SPECIES.BLEEDING_HEART,
        SPECIES.FAIRY_BLUEBELL
      ];
      this.species = allSpecies[Math.floor(Math.random() * allSpecies.length)];
      this.palette = FLOWER_PALETTES[Math.floor(Math.random() * FLOWER_PALETTES.length)];

      this.petalCount = this.species === SPECIES.SAKURA ? 5
        : this.species === SPECIES.DAISY_COSMOS ? (10 + Math.floor(Math.random() * 4))
        : this.species === SPECIES.STAR_BLOOM ? 6
        : this.species === SPECIES.LOTUS_WATERLILY ? 8
        : this.species === SPECIES.PEONY_LUSH ? 10
        : 6;

      this.headRotation = (Math.random() - 0.5) * 0.35;
      this.bloomSize = (26 + Math.random() * 16) * this.scale;

      this.leaves = [
        { heightRatio: 0.33 + Math.random() * 0.15, side: Math.random() > 0.5 ? 1 : -1, size: 22 * this.scale, angle: 0.42 },
        { heightRatio: 0.60 + Math.random() * 0.15, side: Math.random() > 0.5 ? 1 : -1, size: 18 * this.scale, angle: 0.42 }
      ];

      this.growthProgress = 0;
      this.bloomProgress = 0;
      this.growthSpeed = 0.008 + Math.random() * 0.006;
      this.bloomSpeed = 0.009 + Math.random() * 0.007;
      this.growthDelay = Math.random() * 4500;

      this.swaySpeed = 0.95 + Math.random() * 1.25;
      this.swayPhase = Math.random() * Math.PI * 2;
      this.swayAmount = 9 + Math.random() * 13;
      this.currentSway = 0;
      this.headX = this.baseX;
      this.headY = this.groundY;
    }

    update(elapsedTime, windGlobal, mouseX, mouseY, particleSystem) {
      if (elapsedTime < this.growthDelay) return;

      if (this.growthProgress < 1) {
        this.growthProgress = Math.min(1, this.growthProgress + this.growthSpeed);
      } else if (this.bloomProgress < 1) {
        this.bloomProgress = Math.min(1, this.bloomProgress + this.bloomSpeed);
      }

      const mouseDistX = mouseX ? mouseX - this.headX : 999;
      const mouseDistY = mouseY ? mouseY - this.headY : 999;
      const dist = Math.sqrt(mouseDistX * mouseDistX + mouseDistY * mouseDistY);
      let mouseWind = 0;
      if (dist < 180) {
        mouseWind = (1 - dist / 180) * (mouseDistX > 0 ? -12 : 12);
      }

      this.currentSway = Math.sin(elapsedTime * 0.0012 * this.swaySpeed + this.swayPhase) * this.swayAmount
        + (windGlobal * 16)
        + mouseWind;

      if (this.bloomProgress > 0.8 && Math.random() < 0.015) {
        particleSystem.addPollen(this.headX + (Math.random() - 0.5) * 20, this.headY + (Math.random() - 0.5) * 20, this.palette.highlight);
      }
    }

    draw(ctx) {
      if (this.growthProgress <= 0) return;

      const currentH = this.targetHeight * easeOutCubic(this.growthProgress);
      const headSway = this.currentSway * this.growthProgress;
      const endX = this.baseX + this.stemCurve + headSway;
      const endY = this.groundY - currentH;

      this.headX = endX;
      this.headY = endY;

      const ctrlX = this.baseX + (this.stemCurve * 0.4) + (headSway * 0.45);
      const ctrlY = this.groundY - (currentH * 0.52);

      ctx.save();
      ctx.globalAlpha = this.opacity;

      // 1. Draw Stem
      const stemGrad = ctx.createLinearGradient(this.baseX, this.groundY, endX, endY);
      stemGrad.addColorStop(0, '#092415');
      stemGrad.addColorStop(1, '#27854e');

      ctx.beginPath();
      ctx.moveTo(this.baseX, this.groundY);
      ctx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);
      ctx.lineWidth = this.stemWidth;
      ctx.lineCap = 'round';
      ctx.strokeStyle = stemGrad;
      ctx.stroke();

      // 2. Draw Leaves
      if (this.growthProgress > 0.35) {
        const leafProgress = Math.min(1, (this.growthProgress - 0.35) / 0.65);
        this.leaves.forEach(leaf => {
          const t = leaf.heightRatio;
          const lx = (1 - t) * (1 - t) * this.baseX + 2 * (1 - t) * t * ctrlX + t * t * endX;
          const ly = (1 - t) * (1 - t) * this.groundY + 2 * (1 - t) * t * ctrlY + t * t * endY;
          const leafSize = leaf.size * leafProgress;

          ctx.save();
          ctx.translate(lx, ly);
          ctx.rotate((leaf.side * leaf.angle) + (this.currentSway * 0.02));

          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(leaf.side * leafSize * 0.75, -leafSize * 0.4, leaf.side * leafSize * 1.3, 0);
          ctx.quadraticCurveTo(leaf.side * leafSize * 0.75, leafSize * 0.4, 0, 0);
          ctx.fillStyle = '#1b6338';
          ctx.fill();

          ctx.restore();
        });
      }

      // 3. Draw Bloom Head
      if (this.growthProgress > 0.72) {
        const bloomRatio = easeOutBack(this.bloomProgress);
        this.drawBloom(ctx, endX, endY, bloomRatio);
      }

      ctx.restore();
    }

    drawBloom(ctx, x, y, bloomRatio) {
      if (bloomRatio <= 0.01) return;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(this.headRotation + (this.currentSway * 0.035));

      // Fast GPU Radial Halo
      if (this.bloomProgress > 0.4) {
        const glowRadius = this.bloomSize * 1.9 * bloomRatio;
        const glowGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, glowRadius);
        glowGrad.addColorStop(0, `rgba(${this.palette.glowRgba}, 0.4)`);
        glowGrad.addColorStop(0.5, `rgba(${this.palette.glowRgba}, 0.12)`);
        glowGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      switch (this.species) {
        case SPECIES.TULIP_ROSE:
          this.drawTulipRose(ctx, bloomRatio);
          break;
        case SPECIES.SAKURA:
          this.drawSakura(ctx, bloomRatio);
          break;
        case SPECIES.DAISY_COSMOS:
          this.drawDaisy(ctx, bloomRatio);
          break;
        case SPECIES.LAVENDER_SPIRE:
          this.drawLavender(ctx, bloomRatio);
          break;
        case SPECIES.STAR_BLOOM:
          this.drawStarBloom(ctx, bloomRatio);
          break;
        case SPECIES.LOTUS_WATERLILY:
          this.drawLotus(ctx, bloomRatio);
          break;
        case SPECIES.PEONY_LUSH:
          this.drawPeony(ctx, bloomRatio);
          break;
        case SPECIES.BLEEDING_HEART:
          this.drawBleedingHeart(ctx, bloomRatio);
          break;
        case SPECIES.FAIRY_BLUEBELL:
          this.drawFairyBluebell(ctx, bloomRatio);
          break;
      }

      ctx.restore();
    }

    // 1. Tulip / Romantic Rose
    drawTulipRose(ctx, progress) {
      const r = this.bloomSize * progress;
      const outerGrad = ctx.createLinearGradient(0, r, 0, -r);
      outerGrad.addColorStop(0, this.palette.shadow);
      outerGrad.addColorStop(0.5, this.palette.outer);
      outerGrad.addColorStop(1, this.palette.highlight);

      // Back outer petal
      ctx.beginPath();
      ctx.moveTo(0, r * 0.4);
      ctx.bezierCurveTo(-r * 0.85, -r * 0.4, -r * 0.75, -r * 1.2, 0, -r * 1.3);
      ctx.bezierCurveTo(r * 0.75, -r * 1.2, r * 0.85, -r * 0.4, 0, r * 0.4);
      ctx.fillStyle = this.palette.outer;
      ctx.fill();

      // Left Cupped Petal
      ctx.beginPath();
      ctx.moveTo(0, r * 0.45);
      ctx.bezierCurveTo(-r * 1.1, 0, -r * 0.9, -r * 1.1, -r * 0.25, -r * 1.2);
      ctx.bezierCurveTo(-r * 0.1, -r * 0.5, 0, 0, 0, r * 0.45);
      ctx.fillStyle = outerGrad;
      ctx.fill();

      // Right Cupped Petal
      ctx.beginPath();
      ctx.moveTo(0, r * 0.45);
      ctx.bezierCurveTo(r * 1.1, 0, r * 0.9, -r * 1.1, r * 0.25, -r * 1.2);
      ctx.bezierCurveTo(r * 0.1, -r * 0.5, 0, 0, 0, r * 0.45);
      ctx.fillStyle = outerGrad;
      ctx.fill();

      // Center Core Petal
      ctx.beginPath();
      ctx.moveTo(0, r * 0.5);
      ctx.bezierCurveTo(-r * 0.5, -r * 0.2, -r * 0.35, -r * 1.25, 0, -r * 1.32);
      ctx.bezierCurveTo(r * 0.35, -r * 1.25, r * 0.5, -r * 0.2, 0, r * 0.5);
      ctx.fillStyle = this.palette.highlight;
      ctx.fill();

      // Glowing Stamen (Fast Concentric Halo)
      ctx.beginPath();
      ctx.arc(0, -r * 0.15, r * 0.24, 0, Math.PI * 2);
      ctx.fillStyle = this.palette.core;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, -r * 0.15, r * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 240, 150, 0.25)`;
      ctx.fill();
    }

    // 2. Sakura / Cherry Blossom
    drawSakura(ctx, progress) {
      const r = this.bloomSize * progress;
      const count = 5;

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        ctx.save();
        ctx.rotate(angle);

        const petalGrad = ctx.createLinearGradient(0, 0, 0, -r);
        petalGrad.addColorStop(0, this.palette.core);
        petalGrad.addColorStop(0.3, this.palette.inner);
        petalGrad.addColorStop(0.85, this.palette.outer);
        petalGrad.addColorStop(1, this.palette.highlight);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-r * 0.5, -r * 0.38, -r * 0.52, -r * 0.82, -r * 0.2, -r);
        ctx.lineTo(0, -r * 0.88);
        ctx.lineTo(r * 0.2, -r);
        ctx.bezierCurveTo(r * 0.52, -r * 0.82, r * 0.5, -r * 0.38, 0, 0);
        ctx.fillStyle = petalGrad;
        ctx.fill();

        ctx.restore();
      }

      // Golden Stamen Dots (Fast batch)
      ctx.save();
      for (let s = 0; s < 8; s++) {
        const sa = (s / 8) * Math.PI * 2;
        const sl = r * 0.36;
        const sx = Math.cos(sa) * sl;
        const sy = Math.sin(sa) * sl;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = 'rgba(255, 240, 160, 0.7)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(sx, sy, 1.8 * this.scale, 0, Math.PI * 2);
        ctx.fillStyle = '#fff475';
        ctx.fill();
      }
      ctx.restore();

      ctx.beginPath();
      ctx.arc(0, 0, r * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = this.palette.core;
      ctx.fill();
    }

    // 3. Daisy / Sunburst Cosmos
    drawDaisy(ctx, progress) {
      const r = this.bloomSize * progress;
      const count = this.petalCount;

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        ctx.save();
        ctx.rotate(angle);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(-r * 0.2, -r * 0.5, 0, -r);
        ctx.quadraticCurveTo(r * 0.2, -r * 0.5, 0, 0);
        ctx.fillStyle = i % 2 === 0 ? this.palette.outer : this.palette.inner;
        ctx.fill();

        ctx.restore();
      }

      ctx.beginPath();
      ctx.arc(0, 0, r * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = this.palette.core;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 0, r * 0.16, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }

    // 4. Lavender / Lupine Spire
    drawLavender(ctx, progress) {
      const r = this.bloomSize * progress * 0.95;
      const tiers = 6;

      for (let t = 0; t < tiers; t++) {
        const yOffset = -t * (r * 0.35);
        const tierScale = (1 - (t / tiers) * 0.45);
        const floretSize = r * 0.34 * tierScale;

        ctx.beginPath();
        ctx.ellipse(-floretSize * 0.85, yOffset, floretSize, floretSize * 0.65, -0.3, 0, Math.PI * 2);
        ctx.fillStyle = t % 2 === 0 ? this.palette.outer : this.palette.inner;
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(floretSize * 0.85, yOffset, floretSize, floretSize * 0.65, 0.3, 0, Math.PI * 2);
        ctx.fillStyle = t % 2 === 0 ? this.palette.inner : this.palette.highlight;
        ctx.fill();
      }
    }

    // 5. Star Bloom / Bioluminescent Astral Flower
    drawStarBloom(ctx, progress) {
      const r = this.bloomSize * 1.15 * progress;
      const points = this.petalCount;

      ctx.save();
      for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 2;
        ctx.save();
        ctx.rotate(angle);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-r * 0.25, -r * 0.35);
        ctx.lineTo(0, -r * 1.15);
        ctx.lineTo(r * 0.25, -r * 0.35);
        ctx.closePath();
        ctx.fillStyle = i % 2 === 0 ? this.palette.outer : this.palette.inner;
        ctx.fill();

        ctx.restore();
      }

      ctx.beginPath();
      ctx.arc(0, 0, r * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      ctx.restore();
    }

    // 6. Lotus / Celestial Water Lily
    drawLotus(ctx, progress) {
      const r = this.bloomSize * 1.1 * progress;
      const count = 7;

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        ctx.save();
        ctx.rotate(angle);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(-r * 0.32, -r * 0.6, 0, -r * 0.95);
        ctx.quadraticCurveTo(r * 0.32, -r * 0.6, 0, 0);
        ctx.fillStyle = this.palette.outer;
        ctx.fill();

        ctx.restore();
      }

      // Inner tier
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (Math.PI / count);
        ctx.save();
        ctx.rotate(angle);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(-r * 0.25, -r * 0.5, 0, -r * 0.75);
        ctx.quadraticCurveTo(r * 0.25, -r * 0.5, 0, 0);
        ctx.fillStyle = this.palette.highlight;
        ctx.fill();

        ctx.restore();
      }

      ctx.beginPath();
      ctx.arc(0, 0, r * 0.22, 0, Math.PI * 2);
      ctx.fillStyle = this.palette.core;
      ctx.fill();
    }

    // 7. Peony / English Rose
    drawPeony(ctx, progress) {
      const r = this.bloomSize * 1.12 * progress;
      const layers = 3;

      for (let l = 0; l < layers; l++) {
        const layerR = r * (1 - l * 0.22);
        const petalNum = 5 + l * 2;

        for (let p = 0; p < petalNum; p++) {
          const angle = (p / petalNum) * Math.PI * 2 + (l * 0.5);
          ctx.save();
          ctx.rotate(angle);

          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-layerR * 0.45, -layerR * 0.3, -layerR * 0.4, -layerR * 0.9, 0, -layerR);
          ctx.bezierCurveTo(layerR * 0.4, -layerR * 0.9, layerR * 0.45, -layerR * 0.3, 0, 0);
          ctx.fillStyle = l === 0 ? this.palette.outer : l === 1 ? this.palette.inner : this.palette.highlight;
          ctx.fill();

          ctx.restore();
        }
      }

      ctx.beginPath();
      ctx.arc(0, 0, r * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = this.palette.core;
      ctx.fill();
    }

    // 8. Bleeding Heart / Arching Orchid
    drawBleedingHeart(ctx, progress) {
      const r = this.bloomSize * progress;
      const drops = 3;

      for (let d = 0; d < drops; d++) {
        const dx = (d - 1) * (r * 0.52);
        const dy = (Math.abs(d - 1) * 8) + (d * 5);
        const heartSize = (r * 0.44) * (1 - d * 0.12);

        ctx.save();
        ctx.translate(dx, dy);

        ctx.beginPath();
        ctx.moveTo(0, heartSize * 0.4);
        ctx.bezierCurveTo(-heartSize * 1.1, -heartSize * 0.6, -heartSize * 0.9, -heartSize * 1.4, 0, -heartSize * 0.6);
        ctx.bezierCurveTo(heartSize * 0.9, -heartSize * 1.4, heartSize * 1.1, -heartSize * 0.6, 0, heartSize * 0.4);
        ctx.fillStyle = d % 2 === 0 ? this.palette.outer : this.palette.inner;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, heartSize * 0.7, heartSize * 0.22, 0, Math.PI * 2);
        ctx.fillStyle = this.palette.highlight;
        ctx.fill();

        ctx.restore();
      }
    }

    // 9. Fairy Bluebell / Hanging Lanterns
    drawFairyBluebell(ctx, progress) {
      const r = this.bloomSize * progress;
      const bells = 3;

      for (let b = 0; b < bells; b++) {
        const side = b % 2 === 0 ? -1 : 1;
        const bx = side * (r * 0.52);
        const by = b * (r * 0.46);
        const bSize = r * 0.5 * (1 - b * 0.12);

        ctx.save();
        ctx.translate(bx, by);
        ctx.rotate(side * 0.35);

        ctx.beginPath();
        ctx.moveTo(0, -bSize * 0.6);
        ctx.quadraticCurveTo(-bSize * 0.7, 0, -bSize * 0.8, bSize * 0.7);
        ctx.quadraticCurveTo(0, bSize * 0.4, bSize * 0.8, bSize * 0.7);
        ctx.quadraticCurveTo(bSize * 0.7, 0, 0, -bSize * 0.6);
        ctx.fillStyle = this.palette.outer;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, bSize * 0.8, bSize * 0.22, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        ctx.restore();
      }
    }
  }

  // --- Fast Sprite-Based Firefly Particle Class ---
  class Firefly {
    constructor(canvasWidth, canvasHeight) {
      this.reset(canvasWidth, canvasHeight, true);
    }

    reset(w, h, randomY = false) {
      this.x = Math.random() * w;
      this.y = randomY ? Math.random() * h : h + 10;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = -0.35 - Math.random() * 0.55;
      this.pulseSpeed = 1.5 + Math.random() * 2.5;
      this.pulsePhase = Math.random() * Math.PI * 2;
      this.spriteKey = Math.random() > 0.5 ? 'gold' : Math.random() > 0.25 ? 'pink' : 'cyan';
      this.size = 28 + Math.random() * 18;
    }

    update(w, h, time, mouseX, mouseY) {
      this.x += this.speedX + Math.sin(time * 0.002 + this.pulsePhase) * 0.4;
      this.y += this.speedY;

      if (mouseX !== null && mouseY !== null) {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140 && dist > 1) {
          const force = (1 - dist / 140) * 0.8;
          this.x += (dx / dist) * force;
          this.y += (dy / dist) * force;
        }
      }

      if (this.y < -20 || this.x < -30 || this.x > w + 30) {
        this.reset(w, h);
      }
    }

    draw(ctx, time) {
      const alpha = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(time * 0.003 * this.pulseSpeed + this.pulsePhase));
      const sprite = SpriteCache.fireflies[this.spriteKey];
      if (!sprite) return;

      const half = this.size * 0.5;
      ctx.globalAlpha = alpha;
      ctx.drawImage(sprite, this.x - half, this.y - half, this.size, this.size);
      ctx.globalAlpha = 1.0;
    }
  }

  // --- Dynamic Particle Manager (Sparkles, Hearts, Pollen) ---
  class ParticleSystem {
    constructor() {
      this.particles = [];
      this.pollens = [];
    }

    addSparkleBurst(x, y) {
      const count = 22;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const speed = 2.2 + Math.random() * 4.5;
        this.particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.2,
          radius: 1.5 + Math.random() * 2.5,
          alpha: 1,
          decay: 0.016 + Math.random() * 0.02,
          color: Math.random() > 0.6 ? '#ff758c' : Math.random() > 0.3 ? '#ffd166' : '#a1c4fd',
          isHeart: Math.random() < 0.3,
          rot: Math.random() * Math.PI,
          vrot: (Math.random() - 0.5) * 0.12
        });
      }
    }

    addPollen(x, y, color) {
      if (this.pollens.length > 80) return;
      this.pollens.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.3 - Math.random() * 0.4,
        radius: 1 + Math.random() * 1.5,
        alpha: 0.9,
        decay: 0.008 + Math.random() * 0.01,
        color: color || '#ffeaa7'
      });
    }

    update() {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06;
        p.vx *= 0.97;
        p.alpha -= p.decay;
        p.rot += p.vrot;

        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
        }
      }

      for (let i = this.pollens.length - 1; i >= 0; i--) {
        const po = this.pollens[i];
        po.x += po.vx;
        po.y += po.vy;
        po.alpha -= po.decay;

        if (po.alpha <= 0) {
          this.pollens.splice(i, 1);
        }
      }
    }

    draw(ctx) {
      // Pollen Motes (Fast batch)
      this.pollens.forEach(po => {
        ctx.globalAlpha = Math.max(0, po.alpha);
        ctx.beginPath();
        ctx.arc(po.x, po.y, po.radius, 0, Math.PI * 2);
        ctx.fillStyle = po.color;
        ctx.fill();
      });

      // Interactive Click Sparkles / Hearts
      this.particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);

        if (p.isHeart) {
          const s = p.radius * 1.8;
          ctx.beginPath();
          ctx.moveTo(0, s * 0.3);
          ctx.bezierCurveTo(-s, -s * 0.5, -s * 0.8, -s * 1.2, 0, -s * 0.6);
          ctx.bezierCurveTo(s * 0.8, -s * 1.2, s, -s * 0.5, 0, s * 0.3);
          ctx.fillStyle = p.color;
          ctx.fill();
        } else {
          const r = p.radius * 2.0;
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        }

        ctx.restore();
      });
      ctx.globalAlpha = 1.0;
    }
  }

  // --- Main Garden Controller ---
  class GardenController {
    constructor() {
      this.canvas = document.getElementById('garden-canvas');
      this.ctx = this.canvas.getContext('2d', { alpha: true });
      this.groundGlow = document.querySelector('.ground-glow');
      this.openingCard = document.getElementById('opening-card');
      this.finalCard = document.getElementById('final-card');
      this.cursorGlow = document.getElementById('cursor-glow');
      this.soundBtn = document.getElementById('sound-btn');
      this.replayBtn = document.getElementById('replay-btn');

      SpriteCache.init();
      this.soundEngine = new SoundEngine();
      this.particles = new ParticleSystem();

      this.width = 0;
      this.height = 0;
      this.dpr = 1;
      this.groundY = 0;

      this.stars = [];
      this.dandelions = [];
      this.grassBlades = [];
      this.flowers = [];
      this.fireflies = [];

      this.startTime = null;
      this.lastTime = 0;
      this.isPaused = false;
      this.animationFrameId = null;

      this.mouseX = null;
      this.mouseY = null;
      this.globalWind = 0;

      this.init();
    }

    init() {
      this.setupCanvas();
      this.bindEvents();
      this.startGarden();
    }

    setupCanvas() {
      this.dpr = Math.min(window.devicePixelRatio || 1, 1.5); // 1.5 DPR is razor-sharp on Retina while saving massive GPU fill-rate!
      this.width = window.innerWidth;
      this.height = window.innerHeight;

      this.canvas.width = Math.floor(this.width * this.dpr);
      this.canvas.height = Math.floor(this.height * this.dpr);
      this.canvas.style.width = `${this.width}px`;
      this.canvas.style.height = `${this.height}px`;

      this.ctx.scale(this.dpr, this.dpr);
      this.groundY = this.height * 0.96;
    }

    generateGarden() {
      this.stars = [];
      this.dandelions = [];
      this.grassBlades = [];
      this.flowers = [];
      this.fireflies = [];

      for (let i = 0; i < CONFIG.starCount; i++) {
        this.stars.push(new Star(this.width, this.height));
      }

      for (let i = 0; i < CONFIG.dandelionCount; i++) {
        this.dandelions.push(new DandelionSeed(this.width, this.height));
      }

      for (let i = 0; i < CONFIG.fireflyCount; i++) {
        this.fireflies.push(new Firefly(this.width, this.height));
      }

      const grassCount = Math.min(CONFIG.maxGrass, Math.max(CONFIG.minGrass, Math.floor(this.width * CONFIG.grassCountFactor)));
      for (let i = 0; i < grassCount; i++) {
        const x = (i / grassCount) * this.width + (Math.random() - 0.5) * (this.width / grassCount * 1.5);
        const layer = i % 4;
        this.grassBlades.push(new GrassBlade(x, this.width, this.groundY, layer));
      }
      this.grassBlades.sort((a, b) => a.layer - b.layer);

      const flowerCount = Math.min(CONFIG.maxFlowers, Math.max(CONFIG.minFlowers, Math.floor(this.width * CONFIG.flowerCountFactor)));
      for (let i = 0; i < flowerCount; i++) {
        const x = 25 + Math.random() * (this.width - 50);
        const rand = Math.random();
        const layer = rand < 0.22 ? 0 : rand < 0.52 ? 1 : rand < 0.80 ? 2 : 3;
        this.flowers.push(new Flower(x, this.groundY, layer, i));
      }
      this.flowers.sort((a, b) => a.layer - b.layer);
    }

    startGarden() {
      this.startTime = performance.now();
      this.generateGarden();

      this.openingCard.className = 'opening-card';
      this.finalCard.className = 'final-card hidden';
      this.groundGlow.classList.remove('active');

      setTimeout(() => {
        this.openingCard.classList.add('visible');
      }, CONFIG.timings.introStart);

      setTimeout(() => {
        this.openingCard.classList.add('fade-out');
        this.groundGlow.classList.add('active');
      }, CONFIG.timings.introFadeOut);

      setTimeout(() => {
        this.finalCard.classList.remove('hidden');
        void this.finalCard.offsetWidth;
        this.finalCard.classList.add('visible');
      }, CONFIG.timings.finalMessageDelay);

      if (!this.animationFrameId) {
        this.loop(performance.now());
      }
    }

    replay() {
      if (this.soundEngine.enabled) {
        this.soundEngine.playSparkle(1.2);
      }
      this.startGarden();
    }

    bindEvents() {
      window.addEventListener('resize', debounce(() => {
        this.setupCanvas();
        this.generateGarden();
      }, 250));

      window.addEventListener('pointermove', (e) => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;

        if (this.cursorGlow) {
          this.cursorGlow.style.left = `${this.mouseX}px`;
          this.cursorGlow.style.top = `${this.mouseY}px`;
        }
      });

      window.addEventListener('pointerleave', () => {
        this.mouseX = null;
        this.mouseY = null;
      });

      window.addEventListener('pointerdown', (e) => {
        if (e.target.closest('.control-btn')) return;

        this.particles.addSparkleBurst(e.clientX, e.clientY);
        this.soundEngine.playSparkle();

        this.flowers.forEach(f => {
          const dx = f.headX - e.clientX;
          const dy = f.headY - e.clientY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            f.currentSway += (dx > 0 ? 15 : -15) * (1 - dist / 180);
          }
        });
      });

      this.soundBtn.addEventListener('click', () => {
        const isSoundOn = this.soundEngine.toggle();
        const soundOffIcon = this.soundBtn.querySelector('.sound-off');
        const soundOnIcon = this.soundBtn.querySelector('.sound-on');

        if (isSoundOn) {
          soundOffIcon.classList.add('hidden');
          soundOnIcon.classList.remove('hidden');
          this.soundBtn.classList.add('active');
        } else {
          soundOffIcon.classList.remove('hidden');
          soundOnIcon.classList.add('hidden');
          this.soundBtn.classList.remove('active');
        }
      });

      this.replayBtn.addEventListener('click', () => {
        this.replay();
      });

      document.addEventListener('visibilitychange', () => {
        this.isPaused = document.hidden;
      });
    }

    loop(currentTime) {
      this.animationFrameId = requestAnimationFrame((t) => this.loop(t));

      if (this.isPaused) return;

      const elapsed = currentTime - this.startTime;
      this.lastTime = currentTime;

      this.globalWind = Math.sin(currentTime * 0.0008) * 0.5 + Math.sin(currentTime * 0.0022) * 0.25;

      this.ctx.clearRect(0, 0, this.width, this.height);

      // 1. Sky Stars
      this.stars.forEach(star => {
        star.draw(this.ctx, currentTime);
      });

      // 2. Dandelion Seeds
      this.dandelions.forEach(dandelion => {
        dandelion.update(this.width, this.height, currentTime, this.globalWind);
        dandelion.draw(this.ctx);
      });

      // 3. Fireflies (Fast Sprite Blit)
      this.fireflies.forEach(firefly => {
        firefly.update(this.width, this.height, currentTime, this.mouseX, this.mouseY);
        firefly.draw(this.ctx, currentTime);
      });

      // 4. Botanical Layers (0 to 3) in sorted depth order
      const grassSproutTime = Math.max(0, elapsed - (CONFIG.timings.grassSproutStart - CONFIG.timings.introStart));

      for (let layer = 0; layer <= 3; layer++) {
        this.grassBlades.forEach(blade => {
          if (blade.layer === layer) {
            blade.update(grassSproutTime, this.globalWind, this.getMouseWind(blade.baseX, blade.groundY));
            blade.draw(this.ctx);
          }
        });

        this.flowers.forEach(flower => {
          if (flower.layer === layer) {
            flower.update(elapsed, this.globalWind, this.mouseX, this.mouseY, this.particles);
            flower.draw(this.ctx);
          }
        });
      }

      // 5. Dynamic Particles
      this.particles.update();
      this.particles.draw(this.ctx);
    }

    getMouseWind(x, y) {
      if (this.mouseX === null) return 0;
      const dx = this.mouseX - x;
      const dist = Math.abs(dx);
      if (dist < 150) {
        return (1 - dist / 150) * (dx > 0 ? -6 : 6);
      }
      return 0;
    }
  }

  // --- Easing Helper Functions ---
  function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
  }

  function easeOutBack(x) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  }

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  window.addEventListener('DOMContentLoaded', () => {
    new GardenController();
  });

})();
