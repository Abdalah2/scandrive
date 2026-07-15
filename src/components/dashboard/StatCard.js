import Card from '../common/Card';

export default function StatCard({ label, value, delta, icon: Icon }) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
          {delta ? <p className="mt-2 text-xs font-semibold text-emerald-600">{delta}</p> : null}
        </div>
        {Icon ? <div className="rounded-2xl bg-brand-50 p-3 text-brand-700"><Icon className="h-6 w-6" /></div> : null}
      </div>
    </Card>
  );
}