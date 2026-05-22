import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import type { GalaxyNode, Constellation } from '@/utils/galaxy';
import MovieNode from './MovieNode';
import Constellations from './Constellations';

export type GalaxyMode = 'cluster' | 'tunnel';

interface SceneProps {
  nodes: GalaxyNode[];
  constellations: Constellation[];
  activeGenre: string | null;
  selected: GalaxyNode | null;
  onSelect: (n: GalaxyNode | null) => void;
  onHover: (n: GalaxyNode | null) => void;
  embedded?: boolean;
}

// Subtly tilts the galaxy toward the cursor, hinting it's interactive.
function ParallaxGroup({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const tx = state.pointer.y * 0.18;
    const ty = state.pointer.x * 0.25;
    ref.current.rotation.x += (tx - ref.current.rotation.x) * 0.04;
    ref.current.rotation.y += (ty - ref.current.rotation.y) * 0.04;
  });
  return <group ref={ref}>{children}</group>;
}

// Only drives the camera while a node is selected. When nothing is selected,
// it does nothing so OrbitControls retains whatever view the user dragged to.
function CameraRig({ selected }: { selected: GalaxyNode | null }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3());
  const look = useRef(new THREE.Vector3());

  useFrame(() => {
    if (!selected) return;
    const [x, y, z] = selected.position;
    target.current.set(x + 4, y + 2, z + 6);
    look.current.set(x, y, z);
    camera.position.lerp(target.current, 0.05);
    camera.lookAt(look.current);
  });
  return null;
}

function Scene({ nodes, constellations, activeGenre, selected, onSelect, onHover, embedded }: SceneProps) {
  return (
    <>
      <fog attach="fog" args={[0x050508, 20, 80]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 0]} intensity={1.2} color="#7B5EA7" />
      <pointLight position={[20, 20, 20]} intensity={0.6} color="#E8624A" />
      <Stars radius={120} depth={60} count={3000} factor={4} saturation={0} fade speed={0.5} />

      {(() => {
        const content = (
          <>
            <Constellations constellations={constellations} nodes={nodes} activeGenre={activeGenre} />
            {nodes.map((node) => (
              <MovieNode
                key={node.movie.id}
                node={node}
                dimmed={activeGenre !== null && activeGenre !== node.genre}
                selected={selected?.movie.id === node.movie.id}
                onSelect={onSelect}
                onHover={onHover}
              />
            ))}
          </>
        );
        return embedded ? <ParallaxGroup>{content}</ParallaxGroup> : content;
      })()}
      {!embedded && <CameraRig selected={selected} />}
      <OrbitControls
        enablePan={false}
        enableDamping
        dampingFactor={0.05}
        minDistance={6}
        maxDistance={70}
        enabled={!selected && !embedded}
        autoRotate={embedded}
        autoRotateSpeed={0.4}
      />
    </>
  );
}

export default function GalaxyScene(props: SceneProps) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return null;

  return (
    <Canvas
      camera={{ position: [0, 0, 32], fov: 60 }}
      gl={{ antialias: true }}
      onPointerMissed={() => props.onSelect(null)}
      dpr={[1, 1.5]}
    >
      <color attach="background" args={[0x050508]} />
      <Scene {...props} />
    </Canvas>
  );
}
