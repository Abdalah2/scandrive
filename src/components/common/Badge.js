export default function Badge({ children, tone = 'slate', className = '' }) {
  const styles = {
    slate: 'bg-slate-100 text-slate-700',
    brand: 'bg-brand-50 text-brand-700',
    accent: 'bg-orange-100 text-orange-700',
    success: 'bg-emerald-100 text-emerald-700',
    danger: 'bg-rose-100 text-rose-700',
  };

  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[tone]} ${className}`}>{children}</span>;
}