import React from 'react';

const colorMap = {
  blue: {
    ring: 'border-blue-500/20',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
  },
  green: {
    ring: 'border-emerald-500/20',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
  },
  purple: {
    ring: 'border-violet-500/20',
    bg: 'bg-violet-500/10',
    text: 'text-violet-400',
  },
  red: {
    ring: 'border-rose-500/20',
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
  },
};

export default function MetricCard({ title, value, icon, colorClass = 'blue' }) {
  const colors = colorMap[colorClass] ?? colorMap.blue;

  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm">
      {/* Icon circle */}
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border ${colors.ring} ${colors.bg} ${colors.text}`}
      >
        {icon}
      </div>

      {/* Text content */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-400">{title}</p>
        <p className="mt-0.5 truncate text-2xl font-bold text-slate-100">
          {value}
        </p>
      </div>
    </div>
  );
}
