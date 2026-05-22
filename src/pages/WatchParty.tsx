import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useMovie } from '@/hooks/useTMDB';
import { useWatchPartySim } from '@/hooks/useWatchPartySim';
import PageTransition from '@/components/layout/PageTransition';
import VidkingPlayer from '@/components/cinema/VidkingPlayer';

const REACTIONS = ['🔥', '😂', '😢', '🤯', '👀'];

export default function WatchParty() {
  const { id } = useParams();
  const { data: movie } = useMovie(Number(id));
  const { participants, messages, poll, sendMessage, react, votePoll } = useWatchPartySim(true);
  const [input, setInput] = useState('');
  const [vibeBurst, setVibeBurst] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const pName = (aid: string) => participants.find((p) => p.id === aid);

  return (
    <PageTransition>
      <div className="grid min-h-screen grid-cols-1 gap-4 px-4 py-6 pb-24 lg:grid-cols-[2fr_1fr] lg:px-8">
        {/* Player */}
        <div className="flex flex-col">
          {movie ? (
            <VidkingPlayer tmdbId={movie.id} autoPlay />
          ) : (
            <div className="shimmer aspect-video w-full rounded-2xl" />
          )}

          <div className="mt-4 flex items-center justify-between">
            <h1 className="font-display text-2xl italic">{movie?.title ?? 'Watch Party'}</h1>
            <button
              data-hoverable
              onClick={() => {
                setVibeBurst(true);
                setTimeout(() => setVibeBurst(false), 1200);
              }}
              className="relative rounded-full border border-glass px-4 py-2 font-ui text-sm hover:border-glass-hover"
            >
              ✦ Vibe Check
              <AnimatePresence>
                {vibeBurst && (
                  <motion.span
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 2.4, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.1 }}
                    className="pointer-events-none absolute inset-0 rounded-full border border-accent-gold"
                  />
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Social panel */}
        <div className="glass flex h-[80vh] flex-col p-4 lg:h-auto">
          {/* participants */}
          <div className="mb-3 flex items-center gap-2 border-b border-glass pb-3">
            {participants.map((p) => (
              <div key={p.id} className="relative">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full font-ui text-xs font-semibold text-white"
                  style={{ background: p.color }}
                  title={p.name}
                >
                  {p.name[0]}
                </div>
                <motion.span
                  animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full"
                  style={{ boxShadow: `0 0 0 2px ${p.color}` }}
                />
              </div>
            ))}
            <span className="ml-auto font-mono text-xs text-text-muted">{participants.length} watching</span>
          </div>

          {/* poll */}
          <AnimatePresence>
            {poll && (
              <motion.div
                key={poll.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-3 rounded-xl border border-glass bg-surface/40 p-3"
              >
                <div className="mb-2 font-ui text-sm font-semibold">{poll.question}</div>
                {poll.options.map((opt, i) => {
                  const total = poll.votes.reduce((a, b) => a + b, 0) || 1;
                  const pct = Math.round((poll.votes[i] / total) * 100);
                  return (
                    <button
                      key={opt}
                      data-hoverable
                      onClick={() => votePoll(i)}
                      className="relative mb-1.5 block w-full overflow-hidden rounded-lg bg-surface-2 px-3 py-1.5 text-left font-ui text-xs"
                    >
                      <span
                        className="absolute inset-y-0 left-0 bg-accent-violet/30"
                        style={{ width: `${pct}%` }}
                      />
                      <span className="relative flex justify-between">
                        <span>{opt}</span>
                        <span className="font-mono text-text-muted">{pct}%</span>
                      </span>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* chat */}
          <div ref={chatRef} data-lenis-prevent className="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain">
            {messages.length === 0 && <p className="font-ui text-sm text-text-muted">Chat is quiet… say hi.</p>}
            {messages.map((m) => {
              const p = pName(m.authorId);
              return (
                <div key={m.id} className="group flex items-start gap-2">
                  <span className="mt-0.5 h-6 w-6 shrink-0 rounded-full text-center font-ui text-[10px] leading-6 text-white" style={{ background: p?.color }}>
                    {p?.name[0]}
                  </span>
                  <div className="flex-1">
                    <span className="font-ui text-xs font-semibold" style={{ color: p?.color }}>{p?.name}</span>
                    <p className="font-ui text-sm text-text-secondary">{m.text}</p>
                    {m.reactions.length > 0 && <div className="text-sm">{m.reactions.join(' ')}</div>}
                  </div>
                  <div className="flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                    {REACTIONS.slice(0, 3).map((e) => (
                      <button key={e} data-hoverable onClick={() => react(m.id, e)} className="text-xs">
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
              setInput('');
            }}
            className="mt-3 flex gap-2 border-t border-glass pt-3"
          >
            <input
              data-hoverable
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message the party…"
              className="flex-1 rounded-full border border-glass bg-void px-4 py-2 font-ui text-sm outline-none placeholder:text-text-muted"
            />
            <button data-hoverable type="submit" className="rounded-full bg-gradient-to-br from-accent-crimson to-accent-violet px-4 text-white">→</button>
          </form>
        </div>
      </div>

      <div className="px-4 lg:px-8">
        <Link to="/galaxy" data-hoverable className="font-ui text-sm text-text-muted hover:text-text-primary">← Leave party</Link>
      </div>
    </PageTransition>
  );
}
