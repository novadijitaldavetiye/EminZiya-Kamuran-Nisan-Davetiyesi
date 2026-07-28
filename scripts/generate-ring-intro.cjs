const fs = require("fs");
const path = require("path");

const sampleRate = 44100;
const duration = 7.5;
const frames = sampleRate * duration;
const left = new Float64Array(frames);
const right = new Float64Array(frames);
const TAU = Math.PI * 2;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const smooth = (a, b, x) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

function addTone(start, length, frequency, gain, options = {}) {
  const begin = Math.floor(start * sampleRate);
  const end = Math.min(frames, Math.floor((start + length) * sampleRate));
  const attack = options.attack ?? 0.08;
  const release = options.release ?? 0.35;
  const pan = options.pan ?? 0;
  const shimmer = options.shimmer ?? 0;

  for (let i = begin; i < end; i += 1) {
    const t = (i - begin) / sampleRate;
    const local = t / length;
    const envelope = smooth(0, attack / length, local) * (1 - smooth(1 - release / length, 1, local));
    const drift = 1 + 0.0018 * Math.sin(TAU * 0.23 * t);
    const phase = TAU * frequency * drift * t;
    const fundamental = Math.sin(phase);
    const harmonic = 0.32 * Math.sin(phase * 2 + 0.4) + 0.13 * Math.sin(phase * 3 + 1.1);
    const sparkle = shimmer * Math.sin(phase * 4.01 + Math.sin(t * 2.7));
    const value = (fundamental + harmonic + sparkle) * gain * envelope;
    left[i] += value * Math.sqrt((1 - pan) / 2);
    right[i] += value * Math.sqrt((1 + pan) / 2);
  }
}

function addBell(start, frequency, gain, pan) {
  const length = Math.min(2.5, duration - start);
  const begin = Math.floor(start * sampleRate);
  const end = Math.min(frames, Math.floor((start + length) * sampleRate));

  for (let i = begin; i < end; i += 1) {
    const t = (i - begin) / sampleRate;
    const envelope = Math.exp(-2.4 * t) * smooth(0, 0.012, t);
    const value = gain * envelope * (
      Math.sin(TAU * frequency * t) +
      0.55 * Math.sin(TAU * frequency * 2.01 * t + 0.3) +
      0.24 * Math.sin(TAU * frequency * 3.98 * t + 0.8)
    );
    left[i] += value * Math.sqrt((1 - pan) / 2);
    right[i] += value * Math.sqrt((1 + pan) / 2);
  }
}

function addImpact(start, gain) {
  const begin = Math.floor(start * sampleRate);
  const end = Math.min(frames, begin + Math.floor(1.5 * sampleRate));
  let seed = 918273;

  for (let i = begin; i < end; i += 1) {
    const t = (i - begin) / sampleRate;
    seed = (seed * 16807) % 2147483647;
    const noise = seed / 1073741823.5 - 1;
    const body = Math.sin(TAU * (62 - 19 * t) * t) * Math.exp(-4.2 * t);
    const air = noise * Math.exp(-8 * t) * 0.22;
    const value = gain * (body + air);
    left[i] += value * 0.72;
    right[i] += value * 0.72;
  }
}

function addRise(start, length, gain) {
  const begin = Math.floor(start * sampleRate);
  const end = Math.min(frames, Math.floor((start + length) * sampleRate));
  let seed = 456789;

  for (let i = begin; i < end; i += 1) {
    const t = (i - begin) / sampleRate;
    const p = t / length;
    seed = (seed * 48271) % 2147483647;
    const noise = seed / 1073741823.5 - 1;
    const shimmer = Math.sin(TAU * (280 + 900 * p * p) * t);
    const envelope = smooth(0, 1, p) * (1 - smooth(0.91, 1, p));
    const value = gain * envelope * (noise * 0.32 + shimmer * 0.18);
    left[i] += value * (0.65 + 0.2 * Math.sin(t * 2.1));
    right[i] += value * (0.65 - 0.2 * Math.sin(t * 2.1));
  }
}

// Bespoke engagement cue: a warm D-major bed, two answering crystal
// notes for the approaching light lines, and a gentle union at the rings.
addTone(0.08, 7.42, 73.42, 0.09, { attack: .7, release: 1.15, pan: -0.08 });
addTone(0.18, 7.32, 110, 0.055, { attack: .8, release: 1.1, pan: 0.1 });
addTone(0.65, 3.8, 146.83, 0.047, { attack: .55, release: 1.0, pan: -0.25, shimmer: 0.07 });
addTone(0.92, 3.5, 185, 0.038, { attack: .62, release: 1.0, pan: 0.28, shimmer: 0.06 });

// The two light lines answer one another across the stereo field.
addBell(1.2, 587.33, 0.062, -0.62);
addBell(1.85, 698.46, 0.056, 0.62);
addBell(2.55, 880, 0.044, -0.3);
addBell(3.05, 1046.5, 0.038, 0.3);

// The rings meet and the invitation message blooms.
addRise(2.45, 1.75, 0.09);
addImpact(3.65, 0.15);
addBell(3.65, 1174.66, 0.084, -0.08);
addBell(3.82, 1479.98, 0.046, 0.34);
addTone(3.6, 3.65, 293.66, 0.049, { attack: 0.16, release: 1.15, pan: -0.2, shimmer: 0.18 });
addTone(3.6, 3.65, 369.99, 0.042, { attack: 0.18, release: 1.15, pan: 0.2, shimmer: 0.17 });
addTone(3.72, 3.4, 440, 0.026, { attack: 0.28, release: 1.1, pan: 0, shimmer: 0.2 });

// A soft golden breath carries the final transition.
addRise(5.55, 1.72, 0.105);
addImpact(6.92, 0.085);
addBell(6.88, 880, 0.035, 0);

// Gentle stereo ambience and final fade.
let seed = 1234567;
for (let i = 0; i < frames; i += 1) {
  const t = i / sampleRate;
  seed = (seed * 16807) % 2147483647;
  const noise = seed / 1073741823.5 - 1;
  const fadeIn = smooth(0.08, 0.55, t);
  const fadeOut = 1 - smooth(6.82, 7.5, t);
  const motion = 0.008 * noise * fadeIn * fadeOut;
  left[i] = (left[i] + motion) * fadeOut;
  right[i] = (right[i] - motion * 0.82) * fadeOut;
}

let peak = 0;
for (let i = 0; i < frames; i += 1) {
  peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
}
const scale = 0.88 / Math.max(peak, 0.001);
const dataSize = frames * 2 * 2;
const buffer = Buffer.alloc(44 + dataSize);
buffer.write("RIFF", 0);
buffer.writeUInt32LE(36 + dataSize, 4);
buffer.write("WAVE", 8);
buffer.write("fmt ", 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20);
buffer.writeUInt16LE(2, 22);
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(sampleRate * 4, 28);
buffer.writeUInt16LE(4, 32);
buffer.writeUInt16LE(16, 34);
buffer.write("data", 36);
buffer.writeUInt32LE(dataSize, 40);

for (let i = 0; i < frames; i += 1) {
  buffer.writeInt16LE(Math.round(clamp(left[i] * scale, -1, 1) * 32767), 44 + i * 4);
  buffer.writeInt16LE(Math.round(clamp(right[i] * scale, -1, 1) * 32767), 46 + i * 4);
}

const output = path.join(__dirname, "..", "public", "music", "engagement-intro-7-5s.wav");
fs.writeFileSync(output, buffer);
console.log(`Created ${output} (${duration}s, stereo, ${sampleRate}Hz)`);
