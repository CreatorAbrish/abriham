import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function ParticleWave({ active }: { active: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const COUNT = 1800;
  const positions = useRef<Float32Array>(
    (() => {
      const arr = new Float32Array(COUNT * 3);
      for (let i = 0; i < COUNT; i++) {
        const t = (i / COUNT) * Math.PI * 2;
        const r = 1.4 + Math.random() * 0.6;
        arr[i * 3] = Math.cos(t * 3) * r;
        arr[i * 3 + 1] = (Math.random() - 0.5) * 2.2;
        arr[i * 3 + 2] = Math.sin(t * 3) * r;
      }
      return arr;
    })(),
  );

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    const intensity = active ? 0.55 : 0.18;
    for (let i = 0; i < COUNT; i++) {
      const ox = positions.current[i * 3];
      const oz = positions.current[i * 3 + 2];
      const baseY = positions.current[i * 3 + 1];
      arr[i * 3] = ox + Math.sin(t * 1.2 + i * 0.01) * intensity * 0.3;
      arr[i * 3 + 1] = baseY + Math.sin(t * 1.6 + i * 0.05) * intensity;
      arr[i * 3 + 2] = oz + Math.cos(t * 1.2 + i * 0.01) * intensity * 0.3;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.rotation.y = t * 0.1;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions.current, 3]}
          count={COUNT}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.018}
        color={active ? "#E6A817" : "#0F5E3C"}
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
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0.2, 4], fov: 50 }} gl={{ alpha: true }}>
      <ambientLight intensity={0.5} />
      <ParticleWave active={active} />
    </Canvas>
  );
}
