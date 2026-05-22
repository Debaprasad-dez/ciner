import { motion } from 'framer-motion';

interface Props {
  checked: boolean;
  onChange: () => void;
  label: string;
}

export default function Toggle({ checked, onChange, label }: Props) {
  return (
    <button
      data-hoverable
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className="flex h-7 w-12 shrink-0 items-center rounded-full p-0.5 transition-colors"
      style={{ background: checked ? 'var(--accent-teal)' : 'var(--surface-3)' }}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        className="h-6 w-6 rounded-full bg-white shadow"
        style={{ marginLeft: checked ? 'auto' : 0 }}
      />
    </button>
  );
}
