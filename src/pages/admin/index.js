import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Users, CarFront, BadgeEuro, Trash2, PencilLine, PlusCircle } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import StatCard from '../../components/dashboard/StatCard';
import QRCodeBlock from '../../components/car/QRCodeBlock';
import { useAppData } from '../../context/AppDataContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice } from '../../utils/formatPrice';
import { generateQrUrl } from '../../utils/generateQrUrl';

export function AdminDashboard() {
  const { cars, users, activities } = useAppData();
  const { t } = useLanguage();
  const available = cars.filter((car) => car.status === 'Disponible').length;
  const clients = users.filter((user) => user.role === 'client').length;
  const ca = cars.reduce((sum, car) => sum + car.price, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Voitures" value={cars.length} icon={CarFront} />
        <StatCard label="Disponibles" value={available} icon={BadgeEuro} />
        <StatCard label="Clients" value={clients} icon={Users} />
        <StatCard label="CA simulé" value={formatPrice(ca)} icon={BadgeEuro} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <p className="text-sm font-semibold text-brand-700">Vue globale</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">{t.adminStatsTitle}</h2>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cars.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="model" tick={{ fill: '#475569', fontSize: 12 }} />
                <YAxis tick={{ fill: '#475569', fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="viewCount" fill="#194f9c" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <p className="text-sm font-semibold text-brand-700">Dernières activités</p>
          <div className="mt-4 space-y-3">
            {activities.length ? activities.slice(0, 5).map((activity) => (
              <div key={activity.id} className="rounded-3xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-950">{activity.text}</p>
                <p className="mt-2 text-xs text-slate-500">{activity.createdAt}</p>
              </div>
            )) : <EmptyState title="Aucune activité" description="Les modifications administrateur apparaîtront ici." />}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function ManageCarsPage() {
  const { t, language } = useLanguage();
  const { cars, addCar, updateCar, deleteCar } = useAppData();
  const [editingId, setEditingId] = useState('');
  const [form, setForm] = useState({ make: '', model: '', year: 2024, fuel: 'Essence', transmission: 'Auto', color: '', city: '', price: '', mileage: '', status: 'Disponible', featured: true, sellerId: 'user-202', agencyId: 'agency-1', photos: ['https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=900&q=80'] });
  const editingCar = cars.find((car) => car.id === editingId);

  const reset = () => {
    setEditingId('');
    setForm({ make: '', model: '', year: 2024, fuel: 'Essence', transmission: 'Auto', color: '', city: '', price: '', mileage: '', status: 'Disponible', featured: true, sellerId: 'user-202', agencyId: 'agency-1', photos: ['https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=900&q=80'] });
  };

  const submit = (event) => {
    event.preventDefault();
    const payload = { ...form, year: Number(form.year), price: Number(form.price), mileage: Number(form.mileage), specs: editingCar?.specs || { doors: 5, seats: 5, horsepower: 120, engine: '1.6L' }, qrCodeUrl: generateQrUrl(editingCar?.id || `car-${Date.now()}`) };
    if (editingCar) {
      updateCar({ ...editingCar, ...payload, id: editingCar.id });
    } else {
      addCar(payload);
    }
    reset();
  };

  return (
    <div className="space-y-6">
      <Card>
        <h1 className="text-2xl font-bold text-slate-950">{t.adminCarsTitle}</h1>
        <form className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3" onSubmit={submit}>
          {['make', 'model', 'color', 'city'].map((field) => (
            <Field key={field} label={field} value={form[field]} onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))} />
          ))}
          <Field label="Année" type="number" value={form.year} onChange={(event) => setForm((current) => ({ ...current, year: event.target.value }))} />
          <Field label="Prix" type="number" value={form.price} onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))} />
          <Field label="Kilométrage" type="number" value={form.mileage} onChange={(event) => setForm((current) => ({ ...current, mileage: event.target.value }))} />
          <Field label="Carburant" as="select" value={form.fuel} onChange={(event) => setForm((current) => ({ ...current, fuel: event.target.value }))} options={['Essence', 'Diesel', 'Hybrid', 'Electric'].map((item) => ({ value: item, label: item }))} />
          <Field label="Boîte" as="select" value={form.transmission} onChange={(event) => setForm((current) => ({ ...current, transmission: event.target.value }))} options={['Auto', 'Manuelle'].map((item) => ({ value: item, label: item }))} />
          <Field label="Statut" as="select" value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))} options={['Disponible', 'Réservée', 'Vendue'].map((item) => ({ value: item, label: item }))} />
          <div className="flex items-end gap-3">
            <Button type="submit" className="gap-2"><PlusCircle className="h-4 w-4" />{editingCar ? t.save : (language === 'ar' ? 'إنشاء' : 'Créer')}</Button>
            {editingCar ? <Button type="button" variant="secondary" onClick={reset}>{t.cancel}</Button> : null}
          </div>
        </form>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {cars.map((car) => (
          <Card key={car.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">{car.make} {car.model}</h2>
                <p className="text-sm text-slate-600">{car.city} · {formatPrice(car.price)}</p>
              </div>
              <Badge tone={car.status === 'Disponible' ? 'success' : 'accent'}>{car.status}</Badge>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
              <img src={car.photos?.[0]} alt={car.make} className="h-44 w-full rounded-3xl object-cover" />
              <QRCodeBlock value={car.qrCodeUrl || generateQrUrl(car.id)} label="QR auto-généré" />
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant="secondary" className="gap-2" onClick={() => { setEditingId(car.id); setForm({ ...car, price: car.price, mileage: car.mileage, year: car.year }); }}><PencilLine className="h-4 w-4" />{t.edit}</Button>
              <Button variant="danger" className="gap-2" onClick={() => deleteCar(car.id)}><Trash2 className="h-4 w-4" />{t.delete}</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function ManageUsersPage() {
  const { users, updateUser } = useAppData();
  const { language } = useLanguage();

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {users.map((user) => (
        <Card key={user.id}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">{user.name}</h2>
              <p className="text-sm text-slate-600">{user.email}</p>
            </div>
            <Badge tone={user.role === 'admin' ? 'brand' : user.role === 'vendeur' ? 'accent' : 'success'}>{user.role}</Badge>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button variant="secondary" onClick={() => updateUser({ ...user, active: !user.active })}>{user.active ? (language === 'ar' ? 'تعطيل' : 'Désactiver') : (language === 'ar' ? 'تفعيل' : 'Activer')}</Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function ManageAgencesPage() {
  const { t, language } = useLanguage();
  const { agencies, addAgency, updateAgency, deleteAgency } = useAppData();
  const [editingId, setEditingId] = useState('');
  const [form, setForm] = useState({ name: '', city: '', address: '', phone: '', hours: '' });
  const editingAgency = agencies.find((agency) => agency.id === editingId);

  const submit = (event) => {
    event.preventDefault();
    if (editingAgency) {
      updateAgency({ ...editingAgency, ...form });
    } else {
      addAgency(form);
    }
    setForm({ name: '', city: '', address: '', phone: '', hours: '' });
    setEditingId('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <h1 className="text-2xl font-bold text-slate-950">{t.adminAgenciesTitle}</h1>
        <form className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3" onSubmit={submit}>
          {['name', 'city', 'address', 'phone', 'hours'].map((field) => (
            <Field key={field} label={field} value={form[field]} onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))} />
          ))}
          <div className="flex items-end gap-3">
            <Button type="submit">{editingAgency ? t.save : (language === 'ar' ? 'إنشاء' : 'Créer')}</Button>
            {editingAgency ? <Button type="button" variant="secondary" onClick={() => { setEditingId(''); setForm({ name: '', city: '', address: '', phone: '', hours: '' }); }}>{t.cancel}</Button> : null}
          </div>
        </form>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {agencies.map((agency) => (
          <Card key={agency.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">{agency.name}</h2>
                <p className="text-sm text-slate-600">{agency.address}</p>
              </div>
              <Badge tone="brand">{agency.city}</Badge>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant="secondary" onClick={() => { setEditingId(agency.id); setForm({ ...agency }); }}>{t.edit}</Button>
              <Button variant="danger" onClick={() => deleteAgency(agency.id)}>{t.delete}</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function StatsPage() {
  const { cars } = useAppData();
  const data = cars.slice(0, 10).map((car) => ({ label: car.model, views: car.viewCount || 0, price: car.price }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <p className="text-sm font-semibold text-brand-700">Consultations</p>
        <div className="mt-5 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fill: '#475569', fontSize: 12 }} />
              <YAxis tick={{ fill: '#475569', fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="views" stroke="#194f9c" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <p className="text-sm font-semibold text-brand-700">Prix marché</p>
        <div className="mt-5 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fill: '#475569', fontSize: 12 }} />
              <YAxis tick={{ fill: '#475569', fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="price" fill="#f08100" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

export function QRGeneratorPage() {
  const { cars } = useAppData();
  const { t } = useLanguage();
  const [selectedIds, setSelectedIds] = useState(cars.slice(0, 4).map((car) => car.id));
  const selectedCars = cars.filter((car) => selectedIds.includes(car.id));

  return (
    <div className="space-y-6">
      <Card>
        <p className="text-sm font-semibold text-brand-700">Batch QR</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-950">{t.adminQrTitle}</h1>
        <p className="mt-2 text-sm text-slate-600">Sélectionnez des voitures pour visualiser et télécharger les QR codes de lot.</p>
      </Card>

      <Card>
        <div className="flex flex-wrap gap-2">
          {cars.map((car) => (
            <Button key={car.id} variant={selectedIds.includes(car.id) ? 'accent' : 'secondary'} onClick={() => setSelectedIds((current) => current.includes(car.id) ? current.filter((id) => id !== car.id) : [...current, car.id])}>
              {car.make} {car.model}
            </Button>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {selectedCars.map((car) => <QRCodeBlock key={car.id} value={car.qrCodeUrl || generateQrUrl(car.id)} label={`${car.make} ${car.model}`} />)}
      </div>
    </div>
  );
}

function Field({ label, as = 'input', options = [], ...props }) {
  const common = 'rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-300';
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-semibold text-slate-700">{label}</span>
      {as === 'select' ? (
        <select {...props} className={common}>
          {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      ) : (
        <input {...props} className={common} />
      )}
    </label>
  );
}