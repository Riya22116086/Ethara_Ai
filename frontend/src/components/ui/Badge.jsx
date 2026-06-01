import React from 'react';

const variantStyles = {
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  danger:  'bg-rose-500/10 text-rose-400 border-rose-500/20',
  info:    'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  default: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

export default function Badge({ variant = 'default', children, className = '' }) {
  const styles = variantStyles[variant] ?? variantStyles.default;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles} ${className}`}
    >
      {children}
    </span>
  );
}
