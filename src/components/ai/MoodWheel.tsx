import { motion } from 'framer-motion';
import { MOODS } from '@/utils/constants';
import type { Mood } from '@/types/ai';

interface Props {
  selected: Mood[];
  onToggle: (m: Mood) => void;
}

const R = 150;
const INNER = 60;
const CENTER = 170;

function sector(i: number, total: number) {
  const a0 = (i / total) * Math.PI * 2 - Math.PI / 2;
  const a1 = ((i + 1) / total) * Math.PI * 2 - Math.PI / 2;
  const p = (r: number, a: number) => `${CENTER + r * Math.cos(a)} ${CENTER + r * Math.sin(a)}`;
  return `M ${p(INNER, a0)} L ${p(R, a0)} A ${R} ${R} 0 0 1 ${p(R, a1)} L ${p(INNER, a1)} A ${INNER} ${INNER} 0 0 0 ${p(INNER, a0)} Z`;
}

function labelPos(i: number, total: number) {
  const a = ((i + 0.5) / total) * Math.PI * 2 - Math.PI / 2;
  const r = (R + INNER) / 2;
  return { x: CENTER + r * Math.cos(a), y: CENTER + r * Math.sin(a), a };
}

export default function MoodWheel({ selected, onToggle }: Props) {
  return (
    <svg viewBox="0 0 340 340" className="h-[340px] w-[340px]">
      {MOODS.map((m, i) => {
        const active = selected.includes(m);
        const { x, y } = labelPos(i, MOODS.length);
        return (
          <g key={m} data-hoverable onClick={() => onToggle(m)} style={{ cursor: 'none' }}>
            <motion.path
              d={sector(i, MOODS.length)}
              initial={false}
              animate={{
                fill: active ? 'rgba(232,98,74,0.35)' : 'rgba(28,28,42,0.6)',
                stroke: active ? '#E8624A' : 'rgba(255,255,255,0.06)',
              }}
              whileHover={{ fill: 'rgba(123,94,167,0.3)' }}
              strokeWidth={1}
            />
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="pointer-events-none select-none font-ui text-[9px]"
              fill={active ? '#F2F0FF' : 'rgba(242,240,255,0.6)'}
            >
              {m}
            </text>
          </g>
        );
      })}
      <circle cx={CENTER} cy={CENTER} r={INNER - 4} fill="rgba(10,10,18,0.9)" stroke="rgba(255,255,255,0.06)" />
      <text
        x={CENTER}
        y={CENTER}
        textAnchor="middle"
        dominantBaseline="middle"
        className="font-display text-sm italic"
        fill="#F2F0FF"
      >
        {selected.length}/3
      </text>
    </svg>
  );
}
