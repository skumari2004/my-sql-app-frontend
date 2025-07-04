import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, MeshWobbleMaterial } from '@react-three/drei';

export default function ThreeDLogo() {
  return (
    <Canvas style={{ height: 120 }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[2, 2, 2]} />
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <mesh>
          <torusKnotGeometry args={[0.6, 0.2, 100, 16]} />
          <MeshWobbleMaterial color="#3b82f6" speed={2} factor={0.6} />
        </mesh>
      </Float>
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}
