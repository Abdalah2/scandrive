export default function CarSpecsTable({ car }) {
  const rows = [
    ['Marque', car.make],
    ['Modèle', car.model],
    ['Année', car.year],
    ['Carburant', car.fuel],
    ['Boîte', car.transmission],
    ['Couleur', car.color],
    ['Ville', car.city],
    ['Kilométrage', `${car.mileage?.toLocaleString('fr-FR')} km`],
    ['Moteur', car.specs?.engine],
    ['Puissance', `${car.specs?.horsepower} ch`],
  ];

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-soft">
      <table className="min-w-full text-left text-sm">
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label} className="border-b border-slate-100 last:border-b-0">
              <th className="w-1/3 px-4 py-3 font-medium text-slate-500">{label}</th>
              <td className="px-4 py-3 text-slate-900">{value || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}