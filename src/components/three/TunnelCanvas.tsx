import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import TimelineTunnel, { type DecadeGroup } from './TimelineTunnel';
import type { TMDBMovie } from '@/types/movie';

interface Props {
  groups: DecadeGroup[];
  progress: number;
  onHover: (info: { movie: TMDBMovie; decade: number } | null) => void;
  onSelect: (movie: TMDBMovie) => void;
  onProgress: (pct: number, decade: number) => void;
}

export default function TunnelCanvas(props: Props) {
  return (
    <Canvas camera={{ position: [0, 0, 24], fov: 62 }} gl={{ antialias: true }} dpr={[1, 1.5]}>
      <color attach="background" args={[0x050508]} />
      <fog attach="fog" args={[0x050508, 18, 75]} />
      <Stars radius={120} depth={70} count={2500} factor={4} fade speed={0.4} />
      <Suspense fallback={null}>
        <TimelineTunnel {...props} />
      </Suspense>
    </Canvas>
  );
}
