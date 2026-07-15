export default function Card({ children, className = '' }) {
  return <div className={`rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-soft backdrop-blur ${className}`}>{children}</div>;
}