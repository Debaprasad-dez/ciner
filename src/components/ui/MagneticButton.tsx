import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { useMagnetic } from '@/hooks/useMagnetic';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'ghost';
}

export default function MagneticButton({ children, variant = 'primary', className = '', ...rest }: Props) {
  const { ref, onMouseMove, onMouseLeave } = useMagnetic<HTMLButtonElement>(0.3);

  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 font-ui text-sm font-semibold transition-colors duration-300';
  const styles =
    variant === 'primary'
      ? 'bg-grad text-white hover:shadow-glow-crimson'
      : 'border border-glass text-text-primary hover:border-glass-hover';

  return (
    <button
      ref={ref}
      data-hoverable
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`${base} ${styles} ${className}`}
      style={{ transition: 'transform 0.2s ease, box-shadow 0.3s ease, background 0.3s ease' }}
      {...rest}
    >
      {children}
    </button>
  );
}
