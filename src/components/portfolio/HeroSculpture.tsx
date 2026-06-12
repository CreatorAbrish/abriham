import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Environment } from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";

function MorphingCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.15 + pointer.y * 0.3;
      meshRef.current.rotation.y = t * 0.2 + pointer.x * 0.4;
    }
    if (wireRef.current) {
      wireRef.current.rotation.x = -t * 0.1;
      wireRef.current.rotation.y = -t * 0.15;
      wireRef.current.scale.setScalar(1.35 + Math.sin(t * 0.8) * 0.04);
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
      {/* Glass distort core */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.3, 6]} />
        <MeshDistortMaterial
          color="#E6A817"
          emissive="#E6A817"
          emissiveIntensity={0.25}
          metalness={0.9}
          roughness={0.15}
          distort={0.42}
          speed={1.4}
        />
      </mesh>
      {/* Wireframe shell */}
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[1.55, 1]} />
        <meshBasicMaterial color="#0F5E3C" wireframe transparent opacity={0.45} />
      </mesh>
    </Float>
  );
}

export default function HeroSculpture() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 4.2], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#fff7d6" />
        <pointLight position={[-4, -2, -2]} intensity={2} color="#0F5E3C" />
        <pointLight position={[3, -3, 2]} intensity={1.5} color="#E6A817" />
        <MorphingCore />
        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}
