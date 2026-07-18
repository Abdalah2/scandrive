export default function BrandMark({ compact = false }) {
  const size = compact ? 'h-10 w-10' : 'h-14 w-14';

  return (
    <div className={`relative flex items-center justify-center rounded-[2rem] ${size} bg-[radial-gradient(circle_at_top_left,_#1d4ed8,_#2563eb_55%,_#fb923c_100%)] text-white shadow-[0_30px_60px_-30px_rgba(37,99,235,0.8)]`}>
      <span className="absolute inset-[3px] rounded-[1.75rem] border border-white/15" />
      <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-white/90 shadow-sm" />
      <span className="absolute left-2 top-2 h-2 w-2 rounded-sm bg-white/75" />
      <span className="absolute right-2 bottom-2 h-2 w-2 rounded-sm bg-white/75" />
      <span className="relative font-display text-sm font-black tracking-[0.2em]">SD</span>
    </div>
  );
}