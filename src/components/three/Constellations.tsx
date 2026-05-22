import { useMemo } from 'react';
import { Billboard, Text, Line } from '@react-three/drei';
import type { Constellation, GalaxyNode } from '@/utils/galaxy';

interface Props {
  constellations: Constellation[];
  nodes: GalaxyNode[];
  activeGenre: string | null;
}

export default function Constellations({ constellations, nodes, activeGenre }: Props) {
  const nodeMap = useMemo(() => {
    const m = new Map<number, GalaxyNode>();
    nodes.forEach((n) => m.set(n.movie.id, n));
    return m;
  }, [nodes]);

  return (
    <>
      {constellations.map((c) => {
        const dim = activeGenre !== null && activeGenre !== c.genre;
        const opacity = dim ? 0.04 : 0.22;
        return (
          <group key={c.genre}>
            {c.nodeIds.map((id) => {
              const node = nodeMap.get(id);
              if (!node) return null;
              return (
                <Line
                  key={id}
                  points={[c.center, node.position]}
                  color={c.color}
                  lineWidth={1}
                  transparent
                  opacity={opacity}
                />
              );
            })}
            <Billboard position={[c.center[0], c.center[1] + 4.5, c.center[2]]}>
              <Text
                font="/Syne-Bold.ttf"
                fontSize={0.9}
                letterSpacing={0.18}
                color={c.color}
                anchorX="center"
                anchorY="middle"
                fillOpacity={dim ? 0.18 : 0.92}
                outlineWidth={0.012}
                outlineColor={c.color}
                outlineOpacity={dim ? 0.1 : 0.4}
              >
                {c.genre.toUpperCase()}
              </Text>
              <Text
                font="/Syne-Bold.ttf"
                position={[0, -0.85, 0]}
                fontSize={0.32}
                letterSpacing={0.4}
                color="#F2F0FF"
                anchorX="center"
                anchorY="middle"
                fillOpacity={dim ? 0.12 : 0.45}
              >
                {`${c.nodeIds.length} FILMS`}
              </Text>
            </Billboard>
            <mesh position={c.center}>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshBasicMaterial color={c.color} transparent opacity={dim ? 0.1 : 0.6} />
            </mesh>
          </group>
        );
      })}
    </>
  );
}
