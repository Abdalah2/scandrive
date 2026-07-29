export default function BrandMark({ compact = false }) {
  const size = compact ? 'h-10 w-10' : 'h-14 w-14';

  return (
    <div className={`relative flex items-center justify-center rounded-[2.5rem] ${size} bg-gradient-to-br from-slate-900 via-cyan-500 to-amber-400 shadow-[0_18px_50px_-28px_rgba(34,197,94,0.8)]`}>
      <svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="p-2">
        <defs>
          <linearGradient id="brandMarkGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="45%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="brandGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(56,189,248,0.65)" />
            <stop offset="100%" stopColor="rgba(251,191,36,0.12)" />
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="19" fill="url(#brandMarkGradient)" opacity="0.14" />
        <path d="M15 30C15 26.134 18.134 23 22 23H26C29.866 23 33 26.134 33 30V31C33 32.1046 32.1046 33 31 33H17C15.8954 33 15 32.1046 15 31V30Z" fill="#e2e8f0" opacity="0.12" />
        <path d="M13 25L17 18H31L35 25" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 25.5L20 16H28L32 25.5" stroke="#7dd3fc" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17.5 29.5C17.5 28.1 18.6 27 20 27H28C29.4 27 30.5 28.1 30.5 29.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="20.5" cy="32" r="2.5" fill="#ffffff" opacity="0.95" />
        <circle cx="27.5" cy="32" r="2.5" fill="#ffffff" opacity="0.95" />
        <path d="M19 32V30" stroke="#0f172a" strokeWidth="1" strokeLinecap="round" />
        <path d="M28 32V30" stroke="#0f172a" strokeWidth="1" strokeLinecap="round" />
        <path d="M18 20C19 18 22 17 24 17C26 17 29 18 30 20" stroke="#f8fafc" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
        <path d="M9 14L39 34" stroke="url(#brandGlow)" strokeWidth="3" opacity="0.25" strokeLinecap="round" />
      </svg>
      <div className="pointer-events-none absolute inset-x-0 top-2 h-1 rounded-full bg-white/10 blur-[1px]" />
    </div>
  );
}