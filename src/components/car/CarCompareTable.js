import Badge from '../common/Badge';

export default function CarCompareTable({ cars }) {
  if (!cars.length) {
    return <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-8 text-center text-sm text-slate-500">Ajoutez des voitures au comparateur pour afficher le tableau.</div>;
  }

  const rows = [
    { label: 'Prix', get: (car) => `${car.price?.toLocaleString('fr-TN')} TND` },
    { label: 'Année', get: (car) => car.year },
    { label: 'Carburant', get: (car) => car.fuel },
    { label: 'Boîte', get: (car) => car.transmission },
    { label: 'Ville', get: (car) => car.city },
    { label: 'Kilométrage', get: (car) => `${car.mileage?.toLocaleString('fr-TN')} km` },
    { label: 'Statut', get: (car) => <Badge tone={car.status === 'Disponible' ? 'success' : 'accent'}>{car.status}</Badge> },
  ];

  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-soft">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="bg-slate-50 text-slate-600">
            <th className="px-4 py-3">Critère</th>
            {cars.map((car) => (
              <th key={car.id} className="px-4 py-3">{car.make} {car.model}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-slate-100">
              <th className="px-4 py-3 font-medium text-slate-500">{row.label}</th>
              {cars.map((car) => (
                <td key={`${row.label}-${car.id}`} className="px-4 py-3 text-slate-900">{row.get(car)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}