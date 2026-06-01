export default function TopBar({ onMenuClick }) {
  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-900 px-4 md:hidden">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-slate-400 hover:bg-slate-800/80 hover:text-white transition-colors focus:outline-none"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <span className="text-sm font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent uppercase tracking-wider">
        Ethara Admin
      </span>
      <div className="w-10"></div> {/* Spacer for symmetry */}
    </header>
  );
}
