import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import * as THREE from "three";

/**
 * Immersive 3D digital-network background:
 *  - glowing particle nodes floating in depth
 *  - dynamically drawn connecting lines between nearby nodes
 *  - subtle parallax that follows the cursor
 * GPU-accelerated via three.js; sits behind hero content.
 */

const PALETTE = [
  new THREE.Color("#E6A817"), // gold
  new THREE.Color("#3ABEFF"), // cyan
  new THREE.Color("#0F9E6C"), // green
  new THREE.Color("#E94E77"), // magenta
  new THREE.Color("#F5F0E0"), // cream
];

function Network({
  count = 90,
  linkEveryNFrames = 2,
}: {
  count?: number;
  linkEveryNFrames?: number;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { gl } = useThree();
  const frameRef = useRef(0);
  const visibleRef = useRef(true);

  // Pause work when the canvas scrolls out of view — big win on long pages.
  useEffect(() => {
    const el = gl.domElement;
    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { rootMargin: "100px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [gl]);

  // Initial positions, velocities, colors
  const { positions, velocities, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      velocities[i * 3 + 0] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.015;
      const c = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      colors[i * 3 + 0] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      sizes[i] = 0.06 + Math.random() * 0.11;
    }
    return { positions, velocities, colors, sizes };
  }, [count]);

  // Pre-allocate line buffer (max pairs)
  const maxLines = count * 6;
  const linePositions = useMemo(() => new Float32Array(maxLines * 2 * 3), [maxLines]);
  const lineColors = useMemo(() => new Float32Array(maxLines * 2 * 3), [maxLines]);

  const pointsGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    g.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    return g;
  }, [positions, colors, sizes]);

  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));
    g.setDrawRange(0, 0);
    return g;
  }, [linePositions, lineColors]);

  // Circular sprite for glow
  const sprite = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.35, "rgba(255,255,255,0.55)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }, []);

  useFrame(({ clock, pointer }) => {
    if (!visibleRef.current) return;
    frameRef.current++;
    const t = clock.getElapsedTime();
    const posAttr = pointsGeo.getAttribute("position") as THREE.BufferAttribute;
    const pos = posAttr.array as Float32Array;

    // Update node positions
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      pos[ix + 0] += velocities[ix + 0];
      pos[ix + 1] += velocities[ix + 1];
      pos[ix + 2] += velocities[ix + 2];
      if (pos[ix + 0] > 7 || pos[ix + 0] < -7) velocities[ix + 0] *= -1;
      if (pos[ix + 1] > 4.5 || pos[ix + 1] < -4.5) velocities[ix + 1] *= -1;
      if (pos[ix + 2] > 3 || pos[ix + 2] < -3) velocities[ix + 2] *= -1;
    }
    posAttr.needsUpdate = true;

    // Rebuild connecting lines (near neighbors only) — throttled: O(n^2) is the hot path.
    if (frameRef.current % linkEveryNFrames === 0) {
    const linkDist = 2.1;
    const linkDist2 = linkDist * linkDist;
    let ptr = 0;
    for (let i = 0; i < count; i++) {
      const ax = pos[i * 3];
      const ay = pos[i * 3 + 1];
      const az = pos[i * 3 + 2];
      const ar = colors[i * 3];
      const ag = colors[i * 3 + 1];
      const ab = colors[i * 3 + 2];
      for (let j = i + 1; j < count; j++) {
        const dx = ax - pos[j * 3];
        const dy = ay - pos[j * 3 + 1];
        const dz = az - pos[j * 3 + 2];
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < linkDist2 && ptr < maxLines) {
          const alpha = 1 - Math.sqrt(d2) / linkDist;
          const p = ptr * 6;
          linePositions[p + 0] = ax;
          linePositions[p + 1] = ay;
          linePositions[p + 2] = az;
          linePositions[p + 3] = pos[j * 3];
          linePositions[p + 4] = pos[j * 3 + 1];
          linePositions[p + 5] = pos[j * 3 + 2];
          const br = colors[j * 3];
          const bg = colors[j * 3 + 1];
          const bb = colors[j * 3 + 2];
          const a = alpha * 0.9;
          lineColors[p + 0] = ar * a;
          lineColors[p + 1] = ag * a;
          lineColors[p + 2] = ab * a;
          lineColors[p + 3] = br * a;
          lineColors[p + 4] = bg * a;
          lineColors[p + 5] = bb * a;
          ptr++;
        }
      }
    }
    const lp = lineGeo.getAttribute("position") as THREE.BufferAttribute;
    const lc = lineGeo.getAttribute("color") as THREE.BufferAttribute;
    lp.needsUpdate = true;
    lc.needsUpdate = true;
    lineGeo.setDrawRange(0, ptr * 2);
    }

    // Parallax rotation from pointer
    if (groupRef.current) {
      groupRef.current.rotation.y += (pointer.x * 0.25 - groupRef.current.rotation.y) * 0.03;
      groupRef.current.rotation.x += (-pointer.y * 0.18 - groupRef.current.rotation.x) * 0.03;
      groupRef.current.rotation.z = Math.sin(t * 0.05) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <lineSegments ref={linesRef} geometry={lineGeo}>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.55}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
      <points ref={pointsRef} geometry={pointsGeo}>
        <pointsMaterial
          vertexColors
          size={0.18}
          sizeAttenuation
          map={sprite}
          transparent
          alphaTest={0.01}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function ResponsiveNodes({ density = 1 }: { density?: number }) {
  const { size, viewport } = useThree();
  const isMobile = size.width < 640;
  const isTablet = size.width < 1024;
  // Base counts tuned to keep O(n^2) link scan cheap.
  const base = isMobile ? 40 : isTablet ? 60 : 85;
  // Penalize very high-dpr mobile screens where fillrate is the bottleneck.
  const dprPenalty = viewport.dpr > 2 && isMobile ? 0.75 : 1;
  const count = Math.max(18, Math.round(base * density * dprPenalty));
  const linkEveryNFrames = isMobile ? 3 : 2;
  return <Network count={count} linkEveryNFrames={linkEveryNFrames} />;
}

export default function HeroNetwork3D({
  density = 1,
  opacity = 1,
}: {
  density?: number;
  opacity?: number;
}) {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setMounted(true);
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mob = window.matchMedia("(max-width: 640px)");
    setReduced(rm.matches);
    setIsMobile(mob.matches);
    const a = () => setReduced(rm.matches);
    const b = () => setIsMobile(mob.matches);
    rm.addEventListener("change", a);
    mob.addEventListener("change", b);
    return () => {
      rm.removeEventListener("change", a);
      mob.removeEventListener("change", b);
    };
  }, []);
  if (!mounted) return null;
  return (
    <Canvas
      // Lower dpr ceiling on mobile — fillrate dominates on retina phones.
      dpr={isMobile ? [1, 1.25] : [1, 1.6]}
      gl={{
        antialias: !isMobile,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
        depth: false,
      }}
      camera={{ position: [0, 0, 8], fov: 55 }}
      // Static frame when reduced-motion is on; on-demand otherwise saves ~40% CPU.
      frameloop={reduced ? "demand" : "always"}
      className="!absolute inset-0"
      style={{ opacity, pointerEvents: "none" }}
    >
      <Suspense fallback={null}>
        <ResponsiveNodes density={reduced ? 0.6 : density} />
      </Suspense>
    </Canvas>
  );
}