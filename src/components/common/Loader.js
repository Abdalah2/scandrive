export default function Loader({ label = 'Chargement...' }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-600">
      <span className="h-3 w-3 animate-pulse rounded-full bg-brand-600" />
      {label}
    </div>
  );
}