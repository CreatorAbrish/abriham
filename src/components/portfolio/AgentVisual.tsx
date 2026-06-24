import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import avatarAsset from "@/assets/abriham-avatar.png.asset.json";

const GOLD = new THREE.Color("#E6A817");
const GREEN = new THREE.Color("#0F5E3C");

/**
 * Sample the avatar image into a set of particle target positions.
 * Brighter pixels => more likely to spawn a particle there.
 */
function useAvatarTargets(src: string, sampleCount = 6000) {
  const [targets, setTargets] = useState<Float32Array | null>(null);
  const [colors, setColors] = useState<Float32Array | null>(null);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    // Same-origin asset; skip crossOrigin to avoid CORS edge cases.
    img.src = src;
    img.onload = () => {
      if (cancelled) return;
      const W = 220;
      const H = Math.round((img.height / img.width) * W);
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, W, H);
      const { data } = ctx.getImageData(0, 0, W, H);

      const points: number[] = [];
      const cols: number[] = [];
      const aspect = W / H;
      // Rejection sampling weighted by brightness.
      let tries = 0;
      while (points.length / 3 < sampleCount && tries < sampleCount * 60) {
        tries++;
        const x = Math.floor(Math.random() * W);
        const y = Math.floor(Math.random() * H);
        const i = (y * W + x) * 4;
        const r = data[i] / 255;
        const g = data[i + 1] / 255;
        const b = data[i + 2] / 255;
        const a = data[i + 3] / 255;
        const lum = (0.299 * r + 0.587 * g + 0.114 * b) * a;
        // Favor mid-bright pixels (skin/features); skip near-black background.
        if (lum < 0.12) continue;
        if (Math.random() > Math.min(1, lum * 1.4)) continue;

        // Map to centered coordinates. Y inverted (image origin top-left).
        const px = (x / W - 0.5) * 2 * aspect * 1.2;
        const py = -(y / H - 0.5) * 2 * 1.5;
        // Give depth based on luminance — bright zones come forward.
        const pz = (lum - 0.5) * 0.6 + (Math.random() - 0.5) * 0.15;
        points.push(px, py, pz);
        // Blend gold/green based on luminance for an Ethiopian-accent palette.
        const c = GREEN.clone().lerp(GOLD, Math.min(1, lum * 1.3));
        cols.push(c.r, c.g, c.b);
      }
      setTargets(new Float32Array(points));
      setColors(new Float32Array(cols));
    };
    return () => {
      cancelled = true;
    };
  }, [src, sampleCount]);

  return { targets, colors };
}

function PortraitParticles({ active }: { active: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const { targets, colors } = useAvatarTargets(avatarAsset.url, 4500);

  // Random origin positions (dispersed cloud) — used while loading / for swarm dynamics.
  const origins = useMemo(() => {
    const n = targets ? targets.length / 3 : 4500;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 6;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 4;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 3;
    }
    return arr;
  }, [targets]);

  // Live positions buffer
  const live = useMemo(() => {
    if (!targets) return null;
    return new Float32Array(origins);
  }, [targets, origins]);

  // Activation easing
  const activation = useRef(0);
  // Form-up progress 0..1
  const formed = useRef(0);

  useFrame(({ clock }, delta) => {
    if (!ref.current || !targets || !live) return;
    const t = clock.getElapsedTime();

    formed.current = Math.min(1, formed.current + delta * 0.5);
    const targetAct = active ? 1 : 0;
    activation.current += (targetAct - activation.current) * Math.min(1, delta * 3);

    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    const amp = 0.04 + activation.current * 0.18;
    const swirl = 0.4 + activation.current * 1.4;

    for (let i = 0; i < targets.length; i += 3) {
      const tx = targets[i];
      const ty = targets[i + 1];
      const tz = targets[i + 2];

      // Wave displacement around the portrait target point.
      const phase = i * 0.013;
      const dx = Math.sin(t * swirl + phase) * amp * 0.6;
      const dy = Math.sin(t * (swirl * 0.8) + phase * 1.3) * amp;
      const dz = Math.cos(t * swirl + phase) * amp * 0.6;

      // Ease from random origin into portrait form.
      const f = formed.current;
      arr[i] = origins[i] * (1 - f) + (tx + dx) * f;
      arr[i + 1] = origins[i + 1] * (1 - f) + (ty + dy) * f;
      arr[i + 2] = origins[i + 2] * (1 - f) + (tz + dz) * f;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;

    // Gentle parallax rotation.
      ref.current.rotation.y = Math.sin(t * 0.3) * 0.12 + activation.current * Math.sin(t * 1.5) * 0.04;
      ref.current.rotation.x = Math.sin(t * 0.25) * 0.04;

    const mat = ref.current.material as THREE.PointsMaterial;
      mat.size = 0.022 + activation.current * 0.014;
      mat.opacity = 0.85 + activation.current * 0.15;
  });

  if (!targets || !colors || !live) return null;

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[live, 3]} count={live.length / 3} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} count={colors.length / 3} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        size={0.02}
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function AgentVisual({ active }: { active: boolean }) {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 3.2], fov: 50 }} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={0.6} />
      <PortraitParticles active={active} />
    </Canvas>
  );
}
