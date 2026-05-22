import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import type { GalaxyNode } from '@/utils/galaxy';
import { posterUrl } from '@/services/tmdb';

interface Props {
  node: GalaxyNode;
  dimmed: boolean;
  selected: boolean;
  onSelect: (node: GalaxyNode) => void;
  onHover: (node: GalaxyNode | null) => void;
}

export default function MovieNode({ node, dimmed, selected, onSelect, onHover }: Props) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const [hovered, setHovered] = useState(false);
  const texture = useTexture(posterUrl(node.movie.poster_path, 'w342'));

  useFrame((_, dt) => {
    const mesh = meshRef.current;
    const mat = matRef.current;
    if (!mesh || !mat) return;
    mesh.rotation.y += dt * 0.15;
    const targetScale = (hovered || selected ? 1.4 : 1) * node.scale;
    mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
    const targetOpacity = dimmed ? 0.1 : 1;
    mat.opacity += (targetOpacity - mat.opacity) * 0.12;
    mat.emissiveIntensity += ((hovered ? 0.9 : node.glow * 0.5) - mat.emissiveIntensity) * 0.12;
  });

  return (
    <mesh
      ref={meshRef}
      position={node.position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHover(node);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover(null);
        document.body.style.cursor = 'auto';
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node);
      }}
    >
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        ref={matRef}
        map={texture}
        emissive={new THREE.Color(node.color)}
        emissiveIntensity={node.glow * 0.5}
        transparent
        opacity={1}
        roughness={0.6}
        metalness={0.1}
      />
    </mesh>
  );
}
