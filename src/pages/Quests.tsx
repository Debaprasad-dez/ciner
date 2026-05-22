import { useMemo } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/layout/PageTransition';
import ProgressRing from '@/components/ui/ProgressRing';
import { useUserStore } from '@/stores/userStore';
import { questStatuses, totalXP, levelInfo } from '@/utils/quests';

const ACCENTS = ['#E8624A', '#7B5EA7', '#C9954C', '#4ECDC4', '#E8624A'];

export default function Quests() {
  const watched = useUserStore((s) => s.watched);
  const quests = useMemo(() => questStatuses(watched), [watched]);
  const xp = useMemo(() => totalXP(watched), [watched]);
  const level = useMemo(() => levelInfo(xp), [xp]);
  const completed = quests.filter((q) => q.complete);

  return (
    <PageTransition>
      <div className="mx-auto min-h-screen max-w-4xl px-6 py-12 pb-24 md:px-12">
        <div className="eyebrow mb-2">Phase 03 · Progression</div>
        <h1 className="display-fluid mb-10 text-5xl text-text-primary md:text-6xl">Quests</h1>

        {/* Level header */}
        <div className="glass mb-12 flex flex-col items-center gap-6 p-8 sm:flex-row sm:gap-10">
          <ProgressRing pct={level.xpIntoLevel / level.xpForLevel} size={120} stroke={8} color="#7B5EA7">
            <div className="text-center">
              <div className="display-fluid text-3xl text-text-primary">{level.level}</div>
              <div className="eyebrow text-[8px]">level</div>
            </div>
          </ProgressRing>
          <div className="flex-1 text-center sm:text-left">
            <div className="display-fluid text-3xl text-text-primary">{level.title}</div>
            <div className="mt-1 font-mono text-sm text-text-secondary">
              <span className="text-accent-gold">{xp.toLocaleString()} XP</span> · {level.xpForLevel - level.xpIntoLevel} XP to level {level.level + 1}
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-xs text-text-muted sm:justify-start">
              <span>{watched.length} watched</span>
              <span>{completed.length}/{quests.length} quests</span>
            </div>
          </div>
        </div>

        {/* Active quests */}
        <h2 className="eyebrow mb-4">Active quests</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {quests.map((q, i) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className={`glass glass-hover flex items-center gap-4 p-5 ${q.complete ? 'border-accent-teal/40' : ''}`}
            >
              <ProgressRing pct={q.current / q.goal} color={ACCENTS[i % ACCENTS.length]}>
                <span className="text-2xl">{q.icon}</span>
              </ProgressRing>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-ui text-base font-semibold text-text-primary">{q.title}</h3>
                  {q.complete && (
                    <span className="rounded-full bg-accent-teal/20 px-2 py-0.5 font-mono text-[9px] uppercase text-accent-teal">
                      done
                    </span>
                  )}
                </div>
                <p className="mt-0.5 font-ui text-sm text-text-secondary">{q.description}</p>
                <div className="mt-2 flex items-center justify-between font-mono text-xs">
                  <span className="text-text-muted">{q.current}/{q.goal}</span>
                  <span className="text-accent-gold">+{q.xp} XP</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Badges */}
        <h2 className="eyebrow mb-4 mt-12">Badges</h2>
        <div className="flex flex-wrap gap-4">
          {quests.map((q) => (
            <div key={q.id} className="flex w-24 flex-col items-center text-center">
              <motion.div
                initial={false}
                animate={{
                  scale: q.complete ? 1 : 0.9,
                  filter: q.complete ? 'grayscale(0)' : 'grayscale(1)',
                  opacity: q.complete ? 1 : 0.4,
                }}
                className="flex h-16 w-16 items-center justify-center rounded-2xl border text-3xl"
                style={{
                  borderColor: q.complete ? 'var(--accent-gold)' : 'var(--border)',
                  background: q.complete ? 'rgba(201,149,76,0.12)' : 'rgba(20,20,31,0.6)',
                  boxShadow: q.complete ? '0 0 28px rgba(201,149,76,0.25)' : 'none',
                }}
              >
                {q.complete ? q.icon : '🔒'}
              </motion.div>
              <span className="mt-2 font-ui text-[10px] leading-tight text-text-muted">{q.title}</span>
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
