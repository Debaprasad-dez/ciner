import { useMemo, useState, useEffect } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import PageTransition from '@/components/layout/PageTransition';
import MagneticButton from '@/components/ui/MagneticButton';
import { MOODS } from '@/utils/constants';
import { useUserStore } from '@/stores/userStore';
import { tasteVector } from '@/utils/taste';
import { encodeTaste, decodeTaste, compatibilityScore, sharedMoods } from '@/utils/compat';
import { chat } from '@/services/openrouter';

const SIZE = 260;
const C = SIZE / 2;
const RAD = C - 38;

function points(values: number[]) {
  return values
    .map((v, i) => {
      const a = (i / values.length) * Math.PI * 2 - Math.PI / 2;
      return `${C + RAD * v * Math.cos(a)},${C + RAD * v * Math.sin(a)}`;
    })
    .join(' ');
}

function ScoreCounter({ target }: { target: number }) {
  const mv = useMotionValue(0);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const controls = animate(mv, target, { duration: 1.4, ease: 'easeOut', onUpdate: (v) => setVal(Math.round(v)) });
    return controls.stop;
  }, [target, mv]);
  return <span>{val}%</span>;
}

export default function Compatibility() {
  const { watched, watchlist } = useUserStore();
  const myVec = useMemo(() => tasteVector([...watched, ...watchlist]), [watched, watchlist]);
  const myCode = useMemo(() => encodeTaste(myVec), [myVec]);

  const [friendCode, setFriendCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [aiPick, setAiPick] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const friendVec = useMemo(() => decodeTaste(friendCode.trim()), [friendCode]);
  const score = friendVec ? compatibilityScore(myVec, friendVec) : null;
  const shared = friendVec ? sharedMoods(myVec, friendVec) : [];

  const copyMine = () => {
    navigator.clipboard?.writeText(myCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const getPick = async () => {
    if (!friendVec) return;
    setAiLoading(true);
    setAiPick(null);
    try {
      const reply = await chat(
        [
          { role: 'system', content: 'You recommend one film. Reply with ONLY: Title (Year) — one sentence why.' },
          {
            role: 'user',
            content: `Two friends share these moods: ${shared.join(', ') || 'eclectic taste'}. Recommend one film they should watch together.`,
          },
        ],
        0.85,
      );
      setAiPick(reply.trim());
    } catch {
      setAiPick('Could not reach the curator. Try again.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="mx-auto min-h-screen max-w-4xl px-6 py-10 pb-24 md:px-12">
        <h1 className="mb-2 font-display text-4xl italic">Taste Compatibility</h1>
        <p className="mb-8 font-ui text-text-secondary">Share your code. Compare cinematic fingerprints.</p>

        {/* my code */}
        <div className="glass mb-8 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="font-mono text-xs uppercase tracking-wide text-text-muted">Your taste code</div>
            <div className="mt-1 break-all font-mono text-sm text-accent-teal">{myCode}</div>
          </div>
          <MagneticButton variant="ghost" onClick={copyMine}>{copied ? '✓ Copied' : 'Copy code'}</MagneticButton>
        </div>

        {/* friend input */}
        <div className="mb-10">
          <label className="mb-2 block font-ui text-sm text-text-muted">Paste a friend's code</label>
          <input
            data-hoverable
            value={friendCode}
            onChange={(e) => setFriendCode(e.target.value)}
            placeholder="e.g. paste their code here…"
            className="w-full rounded-full border border-glass bg-void px-5 py-3 font-mono text-sm outline-none focus:border-glass-hover"
          />
          {friendCode.trim() && !friendVec && (
            <p className="mt-2 font-ui text-xs text-accent-crimson">Invalid code.</p>
          )}
        </div>

        {/* comparison */}
        {friendVec && score !== null && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="relative flex justify-center">
              <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-72 w-72">
                {[0.25, 0.5, 0.75, 1].map((r) => (
                  <polygon key={r} points={points(MOODS.map(() => r))} fill="none" stroke="rgba(255,255,255,0.06)" />
                ))}
                {MOODS.map((m, i) => {
                  const a = (i / MOODS.length) * Math.PI * 2 - Math.PI / 2;
                  return (
                    <text key={m} x={C + (RAD + 18) * Math.cos(a)} y={C + (RAD + 18) * Math.sin(a)} textAnchor="middle" dominantBaseline="middle" className="font-ui text-[7px]" fill="rgba(242,240,255,0.4)">
                      {m}
                    </text>
                  );
                })}
                <motion.polygon initial={{ opacity: 0 }} animate={{ opacity: 1 }} points={points(myVec)} fill="rgba(232,98,74,0.22)" stroke="#E8624A" strokeWidth={1.5} />
                <motion.polygon initial={{ opacity: 0 }} animate={{ opacity: 1 }} points={points(friendVec)} fill="rgba(78,205,196,0.22)" stroke="#4ECDC4" strokeWidth={1.5} />
              </svg>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <div className="font-display text-5xl italic text-gradient">
                  <ScoreCounter target={score} />
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-text-muted">match</div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 font-ui text-xs">
              <span className="flex items-center gap-2"><span className="h-2 w-4 rounded bg-accent-crimson" /> You</span>
              <span className="flex items-center gap-2"><span className="h-2 w-4 rounded bg-accent-teal" /> Friend</span>
            </div>

            {shared.length > 0 && (
              <div className="mt-6 text-center">
                <div className="mb-2 font-mono text-xs uppercase tracking-wide text-text-muted">Shared moods</div>
                <div className="flex flex-wrap justify-center gap-2">
                  {shared.map((m) => (
                    <motion.span key={m} initial={{ scale: 0 }} animate={{ scale: 1 }} className="rounded-full bg-surface-2 px-3 py-1 font-ui text-sm">
                      ✓ {m}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 text-center">
              <MagneticButton onClick={getPick} disabled={aiLoading}>
                {aiLoading ? 'Curating…' : 'Film to watch together'}
              </MagneticButton>
              {aiPick && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 font-display text-lg italic text-text-secondary">
                  {aiPick}
                </motion.p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
