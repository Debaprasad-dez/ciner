import { motion } from 'framer-motion';
import { useThemeStore, THEMES } from '@/stores/themeStore';

export default function ThemePicker() {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {THEMES.map((t) => {
        const active = theme === t.id;
        return (
          <button
            key={t.id}
            data-hoverable
            onClick={() => setTheme(t.id)}
            className="glass glass-hover relative flex items-center gap-4 overflow-hidden p-4 text-left"
            style={{ borderColor: active ? t.swatch[1] : undefined }}
          >
            {/* gradient preview chip */}
            <div
              className="h-12 w-12 shrink-0 rounded-xl"
              style={{ background: `linear-gradient(135deg, ${t.swatch[0]}, ${t.swatch[1]}, ${t.swatch[2]})` }}
            />
            <div className="flex-1">
              <div className="font-ui text-base font-semibold text-text-primary">{t.name}</div>
              <div className="font-mono text-xs text-text-muted">{t.desc}</div>
            </div>
            {/* swatch dots */}
            <div className="flex gap-1">
              {t.swatch.map((c) => (
                <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
              ))}
            </div>
            {active && (
              <motion.span
                layoutId="theme-active"
                className="absolute inset-0 rounded-[18px] border-2"
                style={{ borderColor: t.swatch[1] }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
