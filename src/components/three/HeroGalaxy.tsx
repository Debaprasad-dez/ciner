import { useMemo, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGalaxyMovies } from '@/hooks/useTMDB';
import { buildGalaxy, type GalaxyNode } from '@/utils/galaxy';
import GalaxyScene from './GalaxyScene';

// Autorotating, click-to-navigate galaxy used as the home hero background.
export default function HeroGalaxy() {
  const { data: movies } = useGalaxyMovies();
  const navigate = useNavigate();

  const { nodes, constellations } = useMemo(
    () => (movies ? buildGalaxy(movies) : { nodes: [], constellations: [] }),
    [movies],
  );

  if (!movies) return null;

  const onSelect = (n: GalaxyNode | null) => {
    if (n) navigate(`/movie/${n.movie.id}`);
  };

  return (
    <Suspense fallback={null}>
      <GalaxyScene
        nodes={nodes}
        constellations={constellations}
        activeGenre={null}
        selected={null}
        onSelect={onSelect}
        onHover={() => {}}
        embedded
      />
    </Suspense>
  );
}
