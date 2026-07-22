export default function BrandMark({ compact = false }) {
  const size = compact ? 'h-10 w-10' : 'h-14 w-14';

  return (
    <div className={`relative flex items-center justify-center rounded-[2rem] ${size} bg-gradient-to-br from-sky-600 via-cyan-500 to-amber-400 text-white`}>
      <svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="p-1">
        <defs>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0" stopColor="#7dd3fc" />
            <stop offset="1" stopColor="#60a5fa" />
          </linearGradient>
        </defs>
        <rect x="0.5" y="0.5" width="47" height="47" rx="9" fill="url(#g1)" opacity="0.06" />
        <path d="M6 28c1-5 6-8 12-8h12c6 0 11 3 12 8v3H6v-3z" fill="#0f172a" opacity="0.12" />
        <path d="M7.5 27.5c1.2-4 5.6-6.5 10.5-6.5h12c4.9 0 9.3 2.5 10.5 6.5" stroke="#7dd3fc" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 22l2-3h22l2 3" stroke="#bfe9ff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="14" cy="32" r="2.5" fill="#7dd3fc" />
        <circle cx="34" cy="32" r="2.5" fill="#7dd3fc" />
        <path d="M14 30v-2" stroke="#0b1220" strokeWidth="0.8" strokeLinecap="round" />
        <path d="M34 30v-2" stroke="#0b1220" strokeWidth="0.8" strokeLinecap="round" />
        <path d="M16 18c2-2 10-2 14 0" stroke="#e6f8ff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
      </svg>
    </div>
  );
}