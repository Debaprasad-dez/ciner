import { useState } from 'react';
import { motion } from 'framer-motion';
import type { ArcPoint } from '@/hooks/useAI';

const W = 800;
const H = 220;
const PAD = 20;

function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i];
    const p1 = pts[i + 1];
    const cx = (p0.x + p1.x) / 2;
    d += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  return d;
}

export default function EmotionalArc({ arc }: { arc: ArcPoint[] }) {
  const [hover, setHover] = useState<ArcPoint | null>(null);
  if (arc.length === 0) return null;

  const pts = arc.map((p) => ({
    x: PAD + (p.t / 100) * (W - PAD * 2),
    y: H - PAD - p.intensity * (H - PAD * 2),
  }));
  const line = smoothPath(pts);
  const area = `${line} L ${pts[pts.length - 1].x} ${H - PAD} L ${pts[0].x} ${H - PAD} Z`;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <defs>
          <linearGradient id="arcFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(232,98,74,0.35)" />
            <stop offset="100%" stopColor="rgba(232,98,74,0)" />
          </linearGradient>
        </defs>
        <motion.path
          d={area}
          fill="url(#arcFill)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />
        <motion.path
          d={line}
          fill="none"
          stroke="#E8624A"
          strokeWidth={2}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
        {arc.map((p, i) => (
          <circle
            key={i}
            cx={pts[i].x}
            cy={pts[i].y}
            r={6}
            fill="transparent"
            data-hoverable
            onMouseEnter={() => setHover(p)}
            onMouseLeave={() => setHover(null)}
          />
        ))}
      </svg>
      {hover && (
        <div className="mt-2 font-mono text-xs text-text-secondary">
          <span className="text-accent-crimson">{hover.t}%</span> · {hover.scene}
        </div>
      )}
    </div>
  );
}
