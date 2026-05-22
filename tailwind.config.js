/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: '#050508',
          2: '#0A0A12',
          3: '#10101C',
        },
        surface: {
          DEFAULT: '#14141F',
          2: '#1C1C2A',
          3: '#242435',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        accent: {
          crimson: 'var(--accent-crimson)',
          violet: 'var(--accent-violet)',
          gold: 'var(--accent-gold)',
          teal: 'var(--accent-teal)',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        ui: ['Syne', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backdropBlur: {
        glass: '24px',
      },
      boxShadow: {
        glow: '0 0 40px rgba(123,94,167,0.1)',
        'glow-crimson': '0 0 40px rgba(232,98,74,0.15)',
      },
      borderColor: {
        glass: 'rgba(255,255,255,0.06)',
        'glass-hover': 'rgba(255,255,255,0.12)',
      },
    },
  },
  plugins: [],
};
