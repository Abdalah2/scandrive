import { ChevronRight, Heart, Scale, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Card from '../common/Card';
import { formatPrice } from '../../utils/formatPrice';

export default function CarCard({ car, onToggleFavorite, onToggleCompare, isFavorite, isCompared }) {
  return (
    <Card className="flex h-full flex-col overflow-hidden p-0">
      <img src={car.photos?.[0]} alt={`${car.make} ${car.model}`} className="h-48 w-full object-cover" />
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-950">{car.make} {car.model}</h3>
            <p className="text-sm text-slate-500">{car.year} · {car.city}</p>
          </div>
          <Badge tone={car.status === 'Disponible' ? 'success' : 'accent'}>{car.status}</Badge>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-slate-600">
          <Badge tone="slate">{car.fuel}</Badge>
          <Badge tone="slate">{car.transmission}</Badge>
          <Badge tone="slate">{car.color}</Badge>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Prix</p>
            <p className="text-xl font-bold text-brand-900">{formatPrice(car.price)}</p>
          </div>
          <div className="flex flex-col gap-2 xs:flex-row">
            <Button variant="ghost" className="gap-2 px-3" onClick={() => onToggleFavorite?.(car.id)} aria-pressed={isFavorite}>
              <Heart className="h-4 w-4" />
              {isFavorite ? 'Sauvé' : 'Favori'}
            </Button>
            <Button variant="ghost" className="gap-2 px-3" onClick={() => onToggleCompare?.(car.id)} aria-pressed={isCompared}>
              <Scale className="h-4 w-4" />
              {isCompared ? 'Comparé' : 'Comparer'}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <MapPin className="h-4 w-4" />
            {car.city}
          </div>
          <Link to={`/car/${car.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-900">
            Détails
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </Card>
  );
}