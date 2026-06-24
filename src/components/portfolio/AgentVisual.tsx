import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import avatarAsset from "@/assets/abriham-avatar.png.asset.json";

const GOLD = "#E6A817";
const GREEN = "#0F5E3C";

/**
 * Load the avatar as a THREE.Texture and produce a luminance grid we can
 * use to displace a high-resolution plane — giving the portrait real volume
 * without obscuring the face.
 */
function useDepthTexture(src: string) {
  const [data, setData] = useState<{
    texture: THREE.Texture;
    depth: Float32Array;
    width: number;
    height: number;
    aspect: number;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.src = src;
    img.onload = () => {
      if (cancelled) return;
      const W = 160;
      const H = Math.round((img.height / img.width) * W);
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, W, H);
      const { data: pixels } = ctx.getImageData(0, 0, W, H);
      const depth = new Float32Array(W * H);
      for (let i = 0; i < W * H; i++) {
        const r = pixels[i * 4] / 255;
        const g = pixels[i * 4 + 1] / 255;
        const b = pixels[i * 4 + 2] / 255;
        depth[i] = 0.299 * r + 0.587 * g + 0.114 * b;
      }
      const texture = new THREE.Texture(img);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 8;
      texture.needsUpdate = true;
      setData({ texture, depth, width: W, height: H, aspect: img.width / img.height });
    };
    return () => {
      cancelled = true;
    };
  }, [src]);

  return data;
}

function PortraitMesh({ active }: { active: boolean }) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const data = useDepthTexture(avatarAsset.url);
  const activation = useRef(0);

  // Build a displaced plane geometry once the depth map is ready.
  const geometry = useMemo(() => {
    if (!data) return null;
    const planeH = 2.6;
    const planeW = planeH * data.aspect;
    const segments = 180;
    const geo = new THREE.PlaneGeometry(planeW, planeH, segments, Math.round(segments / data.aspect));
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const u = (pos.getX(i) / planeW) + 0.5;
      const v = 1 - ((pos.getY(i) / planeH) + 0.5);
      const x = Math.min(data.width - 1, Math.max(0, Math.floor(u * data.width)));
      const y = Math.min(data.height - 1, Math.max(0, Math.floor(v * data.height)));
      const lum = data.depth[y * data.width + x];
      // Smooth radial falloff so edges don't poke out as flat slab corners.
      const cx = u - 0.5;
      const cy = v - 0.5;
      const radial = Math.max(0, 1 - Math.sqrt(cx * cx + cy * cy) * 1.6);
      const z = (lum - 0.45) * 0.55 * radial;
      pos.setZ(i, z);
    }
    geo.computeVertexNormals();
    return geo;
  }, [data]);

  useFrame(({ clock }, delta) => {
    const targetAct = active ? 1 : 0;
    activation.current += (targetAct - activation.current) * Math.min(1, delta * 3);
    const t = clock.getElapsedTime();
    if (group.current) {
      // Gentle breathing pulse (~2%).
      const breath = 1 + Math.sin(t * 1.2) * 0.02 + activation.current * 0.015;
      group.current.scale.setScalar(breath);
      group.current.rotation.y = Math.sin(t * 0.35) * 0.12;
      group.current.rotation.x = Math.sin(t * 0.25) * 0.04;
    }
    if (mesh.current) {
      const mat = mesh.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.12 + activation.current * 0.25;
      // Slow gold↔green shimmer on the emissive tint.
      const mix = (Math.sin(t * 0.6) + 1) / 2;
      mat.emissive.set(GREEN).lerp(new THREE.Color(GOLD), mix);
    }
  });

  if (!data || !geometry) return null;

  return (
    <group ref={group}>
      <mesh ref={mesh} geometry={geometry}>
        <meshStandardMaterial
          map={data.texture}
          roughness={0.55}
          metalness={0.1}
          emissive={new THREE.Color(GOLD)}
          emissiveIntensity={0.15}
        />
      </mesh>
    </group>
  );
}

export default function AgentVisual({ active }: { active: boolean }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 3.2], fov: 42 }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.45} />
      {/* Gold rim from upper-right */}
      <directionalLight position={[3, 2.5, 2]} intensity={1.3} color={GOLD} />
      {/* Green rim from lower-left */}
      <directionalLight position={[-3, -1.5, 2]} intensity={1.0} color={GREEN} />
      {/* Soft key from the front so features stay readable */}
      <pointLight position={[0, 0, 3]} intensity={0.6} color={"#ffffff"} />
      <PortraitMesh active={active} />
    </Canvas>
  );
}
