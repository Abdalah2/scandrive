import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import { Bot, CalendarDays, CheckCircle2, Sparkles, ScanSearch, ArrowRight, Download, Printer, Mail, Phone, MapPinned } from 'lucide-react';
import { jsPDF } from 'jspdf';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';
import CarCard from '../../components/car/CarCard';
import CarGallery from '../../components/car/CarGallery';
import CarSpecsTable from '../../components/car/CarSpecsTable';
import QRCodeBlock from '../../components/car/QRCodeBlock';
import { useAppData } from '../../context/AppDataContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useCompare } from '../../context/CompareContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/formatPrice';
import { generateQrUrl } from '../../utils/generateQrUrl';
import { paginate, useMockApi } from '../../hooks/useMockApi';

function estimateMarketPrice(car) {
  const agePenalty = Math.max(0.55, 1 - ((2026 - car.year) * 0.045));
  const mileagePenalty = Math.max(0.72, 1 - (car.mileage / 240000));
  const premiumBonus = ['BMW', 'Mercedes', 'Audi', 'Tesla'].includes(car.make) ? 1.12 : 1;
  return Math.round(car.price * agePenalty * mileagePenalty * premiumBonus);
}

function parseSmartQuery(query) {
  return query.toLowerCase().trim().split(/\s+/).filter(Boolean);
}

function matchesQuery(car, tokens) {
  if (!tokens.length) {
    return true;
  }

  const haystack = `${car.make} ${car.model} ${car.city} ${car.color} ${car.fuel} ${car.transmission} ${car.year}`.toLowerCase();
  return tokens.every((token) => haystack.includes(token));
}

export function LandingPage() {
  const { cars, agencies } = useAppData();
  const { data: loadedCars, loading } = useMockApi(cars, { delay: 520 });
  const navigate = useNavigate();
  const featured = loadedCars.filter((car) => car.featured).slice(0, 3);
  const stats = [
    { value: `${cars.length}+`, label: 'voitures' },
    { value: `${agencies.length}`, label: 'agences' },
    { value: 'QR', label: 'scan direct' },
  ];
  const [search, setSearch] = useState('SUV hybride à Casablanca');

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top_right,_rgba(255,159,28,0.22),_transparent_35%),linear-gradient(135deg,_#102b4f_0%,_#173f79_48%,_#0f172a_100%)] text-white shadow-soft">
        <div className="grid gap-10 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-14">
          <div className="space-y-6">
            <Badge tone="accent" className="bg-white/10 text-white">Frontend 100% mocké</Badge>
            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
                ScanDrive centralise la vente automobile autour du QR code et du mobile.
              </h1>
              <p className="max-w-xl text-base text-slate-200 sm:text-lg">
                Parcours public, espace client, back-office vendeur et admin, le tout simulé localement avec données réelles de démo.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <div className="rounded-3xl border border-white/10 bg-white/10 p-3 backdrop-blur">
                <label className="sr-only" htmlFor="smart-search">Recherche intelligente</label>
                <input id="smart-search" value={search} onChange={(event) => setSearch(event.target.value)} className="w-full bg-transparent px-2 py-3 text-sm text-white outline-none placeholder:text-slate-300" placeholder="Ex: SUV hybride à Casablanca, moins de 350000 MAD" />
              </div>
              <Button variant="accent" className="gap-2 px-6" onClick={() => navigate(`/cars?q=${encodeURIComponent(search)}`)}>
                <ScanSearch className="h-4 w-4" />
                Rechercher
              </Button>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={() => navigate('/register')} className="gap-2">
                <Sparkles className="h-4 w-4" />
                Commencer
              </Button>
              <Button variant="ghost" onClick={() => navigate('/cars')} className="border border-white/20 text-white hover:bg-white/10">
                Voir le catalogue
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {stats.map((stat) => (
                <Card key={stat.label} className="border-white/10 bg-white/10 p-4 text-white backdrop-blur">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-slate-200">{stat.label}</p>
                </Card>
              ))}
            </div>
          </div>

          <Card className="bg-white p-5">
            <p className="text-sm font-semibold text-brand-700">Démo scan QR</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">Flux mobile-first pensé pour le scan en concession</h2>
            <div className="mt-5 space-y-4">
              {[
                'Le client scanne un QR code sur la voiture.',
                'La fiche publique se charge avec galerie, specs et actions.',
                'Le RDV, le message et le comparateur sont disponibles immédiatement.',
              ].map((step, index) => (
                <div key={step} className="flex gap-3 rounded-2xl bg-slate-50 p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-900 text-sm font-bold text-white">{index + 1}</div>
                  <p className="text-sm text-slate-700">{step}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading ? <Loader label="Chargement des voitures à la une" /> : featured.map((car) => <CarCard key={car.id} car={car} />)}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-brand-700">Comment ça marche</p>
              <h2 className="text-2xl font-bold text-slate-950">Une expérience QR, pas un simple catalogue</h2>
            </div>
            <Bot className="h-10 w-10 text-brand-700" />
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              ['Scanner', 'Le QR ouvre directement la fiche publique de la voiture.'],
              ['Comparer', 'Les favoris alimentent le comparateur en un clic.'],
              ['Réserver', 'Le formulaire de RDV simule la prise de contact.'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-3xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-950">{title}</p>
                <p className="mt-2 text-sm text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-sm font-semibold text-brand-700">Suggestion IA mockée</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">Véhicules recommandés</h2>
          <div className="mt-5 space-y-3">
            {featured.slice(0, 2).map((car) => (
              <Link key={car.id} to={`/car/${car.id}`} className="flex items-center gap-4 rounded-3xl border border-slate-200 p-3 transition hover:border-brand-300 hover:bg-brand-50/40">
                <img src={car.photos[0]} alt={car.make} className="h-16 w-20 rounded-2xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-950">{car.make} {car.model}</p>
                  <p className="text-sm text-slate-500">{car.city} · {formatPrice(car.price)}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-brand-700" />
              </Link>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}

export function CarListPage() {
  const { cars } = useAppData();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { toggleCompare, isCompared } = useCompare();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ minPrice: '', maxPrice: '', brand: '', model: '', year: '', fuel: '', transmission: '', color: '', city: '', sort: 'featured' });

  useEffect(() => {
    setSearchParams(query ? { q: query } : {});
  }, [query, setSearchParams]);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 500);
    setLoading(true);
    return () => window.clearTimeout(timer);
  }, [query, filters]);

  const tokens = useMemo(() => parseSmartQuery(query), [query]);

  const filteredCars = useMemo(() => {
    const list = cars.filter((car) => {
      const lowerBrand = filters.brand ? car.make.toLowerCase().includes(filters.brand.toLowerCase()) : true;
      const lowerModel = filters.model ? car.model.toLowerCase().includes(filters.model.toLowerCase()) : true;
      const yearMatch = filters.year ? String(car.year) === String(filters.year) : true;
      const fuelMatch = filters.fuel ? car.fuel.toLowerCase().includes(filters.fuel.toLowerCase()) : true;
      const transmissionMatch = filters.transmission ? car.transmission.toLowerCase().includes(filters.transmission.toLowerCase()) : true;
      const colorMatch = filters.color ? car.color.toLowerCase().includes(filters.color.toLowerCase()) : true;
      const cityMatch = filters.city ? car.city.toLowerCase().includes(filters.city.toLowerCase()) : true;
      const minPriceMatch = filters.minPrice ? car.price >= Number(filters.minPrice) : true;
      const maxPriceMatch = filters.maxPrice ? car.price <= Number(filters.maxPrice) : true;
      const smartMatch = matchesQuery(car, tokens);

      return lowerBrand && lowerModel && yearMatch && fuelMatch && transmissionMatch && colorMatch && cityMatch && minPriceMatch && maxPriceMatch && smartMatch;
    });

    switch (filters.sort) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'year-desc':
        return list.sort((a, b) => b.year - a.year);
      case 'popular':
        return list.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
      default:
        return list.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
  }, [cars, filters, tokens]);

  const pageSize = 6;
  const pagedCars = paginate(filteredCars, page, pageSize);
  const totalPages = Math.max(1, Math.ceil(filteredCars.length / pageSize));

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-brand-700">Catalogue ScanDrive</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-950">Trouver la bonne voiture avec une recherche simple ou intelligente</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">Les résultats sont filtrés localement, avec une latence simulée pour le rendu IA et une pagination côté client.</p>
          </div>
          <div className="rounded-3xl bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-800">{filteredCars.length} résultat(s)</div>
        </div>
      </Card>

      <Card>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-slate-700">Recherche</span>
            <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-300" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Marque, ville, carburant, mot-clé..." />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-slate-700">Marque</span>
            <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-300" value={filters.brand} onChange={(event) => setFilters((current) => ({ ...current, brand: event.target.value }))} placeholder="Toyota" />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-slate-700">Modèle</span>
            <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-300" value={filters.model} onChange={(event) => setFilters((current) => ({ ...current, model: event.target.value }))} placeholder="Corolla" />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-slate-700">Tri</span>
            <select className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-300" value={filters.sort} onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value }))}>
              <option value="featured">À la une</option>
              <option value="popular">Plus consultées</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="year-desc">Année récente</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-slate-700">Prix min</span>
            <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-300" type="number" value={filters.minPrice} onChange={(event) => setFilters((current) => ({ ...current, minPrice: event.target.value }))} />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-slate-700">Prix max</span>
            <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-300" type="number" value={filters.maxPrice} onChange={(event) => setFilters((current) => ({ ...current, maxPrice: event.target.value }))} />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-slate-700">Carburant</span>
            <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-300" value={filters.fuel} onChange={(event) => setFilters((current) => ({ ...current, fuel: event.target.value }))} placeholder="Hybride" />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-slate-700">Ville</span>
            <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-300" value={filters.city} onChange={(event) => setFilters((current) => ({ ...current, city: event.target.value }))} placeholder="Casablanca" />
          </label>
        </div>
      </Card>

      {loading ? <Loader label="Recherche intelligente en cours..." /> : null}

      {pagedCars.length ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {pagedCars.map((car) => (
            <CarCard key={car.id} car={car} onToggleFavorite={toggleFavorite} onToggleCompare={toggleCompare} isFavorite={isFavorite(car.id)} isCompared={isCompared(car.id)} />
          ))}
        </section>
      ) : (
        <EmptyState title="Aucune voiture trouvée" description="Essayez un autre mot-clé ou réinitialisez les filtres." actionLabel="Réinitialiser" onAction={() => { setQuery(''); setFilters({ minPrice: '', maxPrice: '', brand: '', model: '', year: '', fuel: '', transmission: '', color: '', city: '', sort: 'featured' }); }} />
      )}

      <div className="flex items-center justify-between gap-3">
        <Button variant="secondary" disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Précédent</Button>
        <p className="text-sm text-slate-600">Page {page} / {totalPages}</p>
        <Button variant="secondary" disabled={page >= totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>Suivant</Button>
      </div>
    </div>
  );
}

export function CarDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars, agencies, addAppointment, sendMessage, incrementView } = useAppData();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { toggleCompare, isCompared } = useCompare();
  const [message, setMessage] = useState('Bonjour, je souhaite recevoir plus d’informations.');
  const [name, setName] = useState('Client démo');
  const car = cars.find((entry) => entry.id === id);
  const estimate = car ? estimateMarketPrice(car) : 0;

  useEffect(() => {
    if (car) {
      incrementView(car.id);
    }
  }, [car, incrementView]);

  if (!car) {
    return <EmptyState title="Voiture introuvable" description="Le lien peut être obsolète ou le véhicule supprimé." actionLabel="Retour au catalogue" onAction={() => navigate('/cars')} />;
  }

  const qrCodeUrl = generateQrUrl(car.id);

  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`ScanDrive - ${car.make} ${car.model}`, 14, 20);
    doc.setFontSize(12);
    doc.text(`Prix: ${formatPrice(car.price)}`, 14, 32);
    doc.text(`Estimation marché: ${formatPrice(estimate)}`, 14, 40);
    doc.text(`Ville: ${car.city}`, 14, 48);
    doc.text(`Kilométrage: ${car.mileage} km`, 14, 56);
    doc.text(`QR: ${qrCodeUrl}`, 14, 64);
    doc.save(`scandrive-${car.id}.pdf`);
  };

  const handleAppointment = () => {
    addAppointment({
      carId: car.id,
      clientId: 'user-001',
      sellerId: car.sellerId,
      agencyId: car.agencyId,
      date: new Date().toISOString().slice(0, 10),
      time: '10:00',
      type: 'Essai routier',
      status: 'En attente',
    });
    navigate('/client/rdv?carId=' + car.id);
  };

  const handleSendMessage = () => {
    sendMessage({ from: 'user-001', to: car.sellerId, carId: car.id, text: `${name}: ${message}` });
    navigate('/client/messages');
  };

  const agency = agencies.find((item) => item.id === car.agencyId);

  return (
    <div className="space-y-6">
      <Card className="bg-[linear-gradient(135deg,_rgba(16,43,79,0.98),_rgba(23,63,121,0.96))] text-white">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-200">Fiche voiture publique</p>
            <h1 className="mt-2 text-3xl font-bold">{car.make} {car.model}</h1>
            <p className="mt-2 text-slate-200">{car.city} · {car.year} · {car.fuel} · {car.transmission}</p>
          </div>
          <Badge tone={car.status === 'Disponible' ? 'success' : 'accent'}>{car.status}</Badge>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="accent" onClick={handleAppointment}>Prendre RDV</Button>
          <Button variant="secondary" onClick={() => navigate('/contact')}>Contacter l'agence</Button>
          <Button variant="ghost" className="border border-white/20 text-white hover:bg-white/10" onClick={() => navigate(`/car/${car.id}`)}>Simuler scan QR</Button>
          <Button variant="ghost" className="border border-white/20 text-white hover:bg-white/10" onClick={() => toggleFavorite(car.id)}>{isFavorite(car.id) ? 'Retirer favoris' : 'Ajouter favoris'}</Button>
          <Button variant="ghost" className="border border-white/20 text-white hover:bg-white/10" onClick={() => toggleCompare(car.id)}>{isCompared(car.id) ? 'Retirer comparateur' : 'Comparer'}</Button>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <CarGallery car={car} />
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-brand-700">Description</p>
                <h2 className="text-2xl font-bold text-slate-950">Tout ce qu’un scan QR doit afficher</h2>
              </div>
              <div className="text-3xl font-bold text-brand-900">{formatPrice(car.price)}</div>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-700">{car.description}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                ['Consultations', car.viewCount || 0],
                ['Estimation marché', formatPrice(estimate)],
                ['Agence', agency?.city || car.city],
              ].map(([label, value]) => (
                <div key={label} className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
                  <p className="mt-2 font-semibold text-slate-950">{value}</p>
                </div>
              ))}
            </div>
          </Card>
          <CarSpecsTable car={car} />
        </div>

        <div className="space-y-6">
          <QRCodeBlock value={qrCodeUrl} label="QR code véhicule" />

          <Card>
            <p className="text-sm font-semibold text-brand-700">Estimation prix marché</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">{formatPrice(estimate)}</p>
            <p className="mt-2 text-sm text-slate-600">Calcul local simulé selon l’âge, le kilométrage et la catégorie du véhicule.</p>
          </Card>

          <Card>
            <p className="text-sm font-semibold text-brand-700">Actions</p>
            <div className="mt-4 grid gap-3">
              <Button className="gap-2" onClick={downloadPdf}><Download className="h-4 w-4" />Fiche PDF</Button>
              <Button variant="secondary" className="gap-2" onClick={handleAppointment}><CalendarDays className="h-4 w-4" />RDV essai</Button>
              <Button variant="secondary" className="gap-2" onClick={() => window.print()}><Printer className="h-4 w-4" />Imprimer</Button>
            </div>
          </Card>

          <Card>
            <p className="text-sm font-semibold text-brand-700">Contacter le vendeur</p>
            <div className="mt-4 grid gap-3">
              <label className="grid gap-2 text-sm">
                <span className="font-semibold text-slate-700">Nom</span>
                <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-300" value={name} onChange={(event) => setName(event.target.value)} />
              </label>
              <label className="grid gap-2 text-sm">
                <span className="font-semibold text-slate-700">Message</span>
                <textarea className="min-h-28 rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-300" value={message} onChange={(event) => setMessage(event.target.value)} />
              </label>
              <Button onClick={handleSendMessage} className="gap-2"><Mail className="h-4 w-4" />Envoyer</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function AuthField({ label, type = 'text', value, onChange, placeholder }) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-semibold text-slate-700">{label}</span>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-300" />
    </label>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [email, setEmail] = useState('client@scandrive.com');
  const [password, setPassword] = useState('client123');
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    const result = authLogin(email, password);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    const roleToRoute = { client: '/client', vendeur: '/vendeur', admin: '/admin' };
    navigate(roleToRoute[result.user.role] || '/client');
  };

  return (
    <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <Card className="bg-[linear-gradient(180deg,_rgba(16,43,79,1),_rgba(23,63,121,0.95))] text-white">
        <p className="text-sm font-semibold tracking-[0.22em] text-slate-200 uppercase">Connexion</p>
        <h1 className="mt-3 text-3xl font-bold">Accédez aux espaces client, vendeur ou admin</h1>
        <ul className="mt-6 space-y-3 text-sm text-slate-200">
          <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" />Session simulée en localStorage</li>
          <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" />Rôles protégés via route guard</li>
          <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" />Données de démo sans backend</li>
        </ul>
      </Card>

      <Card>
        <h2 className="text-2xl font-bold text-slate-950">Connexion démo</h2>
        {error ? <div className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
        <form className="mt-5 grid gap-4" onSubmit={submit}>
          <AuthField label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <AuthField label="Mot de passe" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          <div className="flex flex-wrap gap-3">
            <Button type="submit" className="gap-2">Se connecter</Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/register')}>Créer un compte</Button>
          </div>
        </form>
        <div className="mt-5 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
          Essais rapides: client@scandrive.com / client123, vendeur1@scandrive.com / vendeur123, admin@scandrive.com / admin123.
        </div>
      </Card>
    </div>
  );
}

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'client' });

  const submit = (event) => {
    event.preventDefault();
    const user = register(form);
    navigate(user.role === 'admin' ? '/admin' : user.role === 'vendeur' ? '/vendeur' : '/client');
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <h1 className="text-3xl font-bold text-slate-950">Créer un compte</h1>
        <p className="mt-2 text-sm text-slate-600">Le compte est simulé et reste disponible tant que le stockage local n’est pas vidé.</p>
        <form className="mt-6 grid gap-4" onSubmit={submit}>
          <AuthField label="Nom complet" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
          <AuthField label="Email" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
          <AuthField label="Mot de passe" type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} />
          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-slate-700">Rôle</span>
            <select className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-300" value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}>
              <option value="client">Client</option>
              <option value="vendeur">Vendeur</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <Button type="submit">Créer le compte</Button>
        </form>
      </Card>
    </div>
  );
}

export function ContactPage() {
  const { agencies } = useAppData();

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-brand-700">Agences ScanDrive</p>
            <h1 className="text-3xl font-bold text-slate-950">Carte des agences et contact direct</h1>
          </div>
          <Badge tone="brand">Carte simulée sans API</Badge>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <iframe
            title="Carte ScanDrive"
            src="https://www.google.com/maps?q=Morocco&output=embed"
            className="h-80 w-full rounded-3xl border-0"
            loading="lazy"
          />
        </Card>
        <div className="space-y-4">
          {agencies.map((agency) => (
            <Card key={agency.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">{agency.name}</h2>
                  <p className="mt-1 text-sm text-slate-600">{agency.address}</p>
                </div>
                <Badge tone="accent">{agency.city}</Badge>
              </div>
              <div className="mt-4 grid gap-2 text-sm text-slate-600">
                <div className="flex items-center gap-2"><Phone className="h-4 w-4" />{agency.phone}</div>
                <div className="flex items-center gap-2"><MapPinned className="h-4 w-4" />{agency.hours}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ForbiddenPage() {
  return <EmptyState title="Accès interdit" description="Votre rôle actuel ne permet pas d’accéder à cette page." actionLabel="Retour accueil" onAction={() => (window.location.href = '/')} />;
}

export function NotFoundPage() {
  return <EmptyState title="Page introuvable" description="L’URL demandée ne correspond à aucune route de l’application." actionLabel="Retour accueil" onAction={() => (window.location.href = '/')} />;
}