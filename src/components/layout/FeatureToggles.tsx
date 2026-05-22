import { useSettingsStore, type FeatureFlags } from '@/stores/settingsStore';
import Toggle from '@/components/ui/Toggle';

const ITEMS: { key: keyof FeatureFlags; title: string; desc: string }[] = [
  {
    key: 'watchParty',
    title: 'Watch Party',
    desc: 'Sync playback and chat with friends in real time. Adds a Watch Party entry to navigation.',
  },
  {
    key: 'friendCompat',
    title: 'Friend Compatibility',
    desc: 'Share a taste code and compare cinematic fingerprints with friends.',
  },
  {
    key: 'quests',
    title: 'Quests & XP',
    desc: 'Earn XP, level up, and unlock badges as you watch. Adds a Quests entry to navigation.',
  },
];

export default function FeatureToggles() {
  const { flags, toggle } = useSettingsStore();

  return (
    <div className="space-y-3">
      {ITEMS.map((it) => (
        <div
          key={it.key}
          className="glass flex items-start justify-between gap-4 p-4"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="font-ui text-base font-semibold text-text-primary">{it.title}</span>
              <span
                className="rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide"
                style={{
                  background: flags[it.key] ? 'rgba(78,205,196,0.18)' : 'rgba(255,255,255,0.06)',
                  color: flags[it.key] ? 'var(--accent-teal)' : 'var(--text-muted)',
                }}
              >
                {flags[it.key] ? 'on' : 'off'}
              </span>
            </div>
            <p className="mt-1 font-ui text-sm text-text-secondary">{it.desc}</p>
          </div>
          <Toggle checked={flags[it.key]} onChange={() => toggle(it.key)} label={`Toggle ${it.title}`} />
        </div>
      ))}
    </div>
  );
}
