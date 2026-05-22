import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import type { TMDBMovie } from '@/types/movie';
import { posterUrl } from '@/services/tmdb';

const SPACING = 30; // z per decade
const RADIUS = 8;
const FONT = `${import.meta.env.BASE_URL}Syne-Bold.ttf`;

export interface DecadeGroup {
  decade: number;
  films: TMDBMovie[];
}

interface HoverInfo {
  movie: TMDBMovie;
  decade: number;
}

interface Props {
  groups: DecadeGroup[];
  progress: number; // 0..1, driven by wheel from the page
  onHover: (info: HoverInfo | null) => void;
  onSelect: (movie: TMDBMovie) => void;
  onProgress: (pct: number, decade: number) => void;
}

function FilmSphere({
  movie,
  position,
  decade,
  onHover,
  onSelect,
}: {
  movie: TMDBMovie;
  position: [number, number, number];
  decade: number;
  onHover: (info: HoverInfo | null) => void;
  onSelect: (m: TMDBMovie) => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const tex = useTexture(posterUrl(movie.poster_path, 'w342'));

  useFrame((_s, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.25;
    const target = hovered ? 1.5 : 1;
    ref.current.scale.lerp(new THREE.Vector3(target, target, target), 0.15);
  });

  return (
    <mesh
      ref={ref}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHover({ movie, decade });
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover(null);
        document.body.style.cursor = 'auto';
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(movie);
      }}
    >
      <sphereGeometry args={[1.1, 28, 28]} />
      <meshStandardMaterial
        map={tex}
        emissive={new THREE.Color('#7B5EA7')}
        emissiveIntensity={hovered ? 0.7 : 0.25}
        roughness={0.55}
      />
    </mesh>
  );
}

export default function TimelineTunnel({ groups, progress, onHover, onSelect, onProgress }: Props) {
  const total = (groups.length - 1) * SPACING;
  const smooth = useRef(0);

  const layout = useMemo(
    () =>
      groups.map((g, ring) => ({
        ...g,
        z: -ring * SPACING,
        films: g.films.map((film, i) => {
          const angle = (i / g.films.length) * Math.PI * 2;
          return {
            film,
            pos: [Math.cos(angle) * RADIUS, Math.sin(angle) * RADIUS, -ring * SPACING] as [number, number, number],
          };
        }),
      })),
    [groups],
  );

  useFrame((state) => {
    // ease toward the target progress for buttery camera motion
    smooth.current += (progress - smooth.current) * 0.08;
    const offset = smooth.current;
    // Stop a little short of the last ring so the final decade stays framed.
    const z = 20 - offset * total;
    state.camera.position.set(Math.sin(offset * Math.PI * 2) * 2.5, Math.cos(offset * Math.PI * 1.5) * 1.5, z);
    state.camera.lookAt(0, 0, z - 12);

    const ring = Math.min(groups.length - 1, Math.round((offset * total) / SPACING));
    onProgress(offset, groups[ring]?.decade ?? groups[0].decade);
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 12]} intensity={2} color="#7B5EA7" distance={50} />
      <pointLight position={[0, 0, -40]} intensity={1.5} color="#E8624A" distance={60} />

      {layout.map((g) => (
        <group key={g.decade}>
          <mesh position={[0, 0, g.z]}>
            <torusGeometry args={[RADIUS, 0.05, 16, 90]} />
            <meshBasicMaterial color="#7B5EA7" transparent opacity={0.4} />
          </mesh>
          <Billboard position={[0, RADIUS + 2, g.z]}>
            <Text font={FONT} fontSize={1.8} letterSpacing={0.08} color="#C9954C" anchorX="center">
              {`${g.decade}s`}
            </Text>
          </Billboard>
          {g.films.map(({ film, pos }) => (
            <FilmSphere key={film.id} movie={film} position={pos} decade={g.decade} onHover={onHover} onSelect={onSelect} />
          ))}
        </group>
      ))}
    </>
  );
}
