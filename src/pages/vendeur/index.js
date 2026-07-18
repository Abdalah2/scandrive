import { useEffect, useMemo, useState } from 'react';
import { PlusCircle, PencilLine, Trash2, CircleCheckBig, CircleX, MessageSquareMore, CalendarDays, CarFront } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import StatCard from '../../components/dashboard/StatCard';
import QRCodeBlock from '../../components/car/QRCodeBlock';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatDate } from '../../utils/formatDate';
import { generateQrUrl } from '../../utils/generateQrUrl';

export function VendeurDashboard() {
  const { user } = useAuth();
  const { cars, rendezvous, messages } = useAppData();
  const assignedCars = cars.filter((car) => car.sellerId === user?.id);
  const pendingRdv = rendezvous.filter((rdv) => rdv.sellerId === user?.id && rdv.status !== 'Confirmé');
  const unreadMessages = messages.filter((message) => message.to === user?.id && !message.read);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard label="Voitures affectées" value={assignedCars.length} icon={CarFront} />
      <StatCard label="RDV à confirmer" value={pendingRdv.length} icon={CalendarDays} />
      <StatCard label="Messages" value={unreadMessages.length} icon={MessageSquareMore} />
    </div>
  );
}

export function MyCarsPage() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { cars, addCar, updateCar, deleteCar } = useAppData();
  const [editingId, setEditingId] = useState('');
  const [form, setForm] = useState({ make: '', model: '', year: 2024, fuel: 'Essence', transmission: 'Auto', color: '', city: '', price: '', mileage: '', status: 'Disponible', featured: false, photos: ['https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=900&q=80'], sellerId: user?.id, agencyId: 'agency-1' });

  const list = cars.filter((car) => car.sellerId === user?.id);
  const editingCar = list.find((car) => car.id === editingId);

  useEffect(() => {
    if (editingCar) {
      setForm((current) => ({ ...editingCar, photos: editingCar.photos || current.photos }));
    }
  }, [editingCar]);

  const reset = () => {
    setEditingId('');
    setForm({ make: '', model: '', year: 2024, fuel: 'Essence', transmission: 'Auto', color: '', city: '', price: '', mileage: '', status: 'Disponible', featured: false, photos: ['https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=900&q=80'], sellerId: user?.id, agencyId: 'agency-1' });
  };

  const submit = (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      year: Number(form.year),
      price: Number(form.price),
      mileage: Number(form.mileage),
      sellerId: user?.id,
      qrCodeUrl: generateQrUrl(editingCar?.id || `car-${Date.now()}`),
      specs: editingCar?.specs || { doors: 5, seats: 5, horsepower: 120, engine: '1.6L' },
    };

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
        <p className="text-sm font-semibold text-brand-700">{t.actions}</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-950">{language === 'ar' ? 'سياراتي' : 'Mes voitures'}</h1>
        <form className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3" onSubmit={submit}>
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
            <Button type="submit" className="gap-2"><PlusCircle className="h-4 w-4" />{editingCar ? t.save : (language === 'ar' ? 'إضافة' : 'Ajouter')}</Button>
            {editingCar ? <Button type="button" variant="secondary" onClick={reset}>{t.cancel}</Button> : null}
          </div>
        </form>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {list.length ? list.map((car) => (
          <Card key={car.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-slate-950">{car.make} {car.model}</p>
                <p className="text-sm text-slate-600">{car.city} · {car.year} · {car.status}</p>
              </div>
              <Badge tone={car.status === 'Disponible' ? 'success' : 'accent'}>{car.status}</Badge>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
              <img src={car.photos?.[0]} alt={car.make} className="h-44 w-full rounded-3xl object-cover" />
              <QRCodeBlock value={car.qrCodeUrl || generateQrUrl(car.id)} label="QR véhicule" />
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant="secondary" className="gap-2" onClick={() => setEditingId(car.id)}><PencilLine className="h-4 w-4" />{t.edit}</Button>
              <Button variant="danger" className="gap-2" onClick={() => deleteCar(car.id)}><Trash2 className="h-4 w-4" />{t.delete}</Button>
            </div>
          </Card>
        )) : <EmptyState title="Aucune voiture" description="Ajoutez votre première voiture depuis le formulaire ci-dessus." />}
      </div>
    </div>
  );
}

export function VendeurRdvPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { rendezvous, updateAppointment, cars } = useAppData();
  const list = rendezvous.filter((rdv) => rdv.sellerId === user?.id);

  return (
    <div className="space-y-4">
      {list.length ? list.map((rdv) => {
        const car = cars.find((item) => item.id === rdv.carId);
        return (
          <Card key={rdv.id}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-slate-950">{car?.make} {car?.model}</p>
                <p className="text-sm text-slate-600">{formatDate(`${rdv.date}T${rdv.time}:00`)} · {rdv.type}</p>
              </div>
              <Badge tone={rdv.status === 'Confirmé' ? 'success' : 'accent'}>{rdv.status}</Badge>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button className="gap-2" onClick={() => updateAppointment({ ...rdv, status: 'Confirmé' })}><CircleCheckBig className="h-4 w-4" />{t.confirm}</Button>
              <Button variant="secondary" className="gap-2" onClick={() => updateAppointment({ ...rdv, status: 'Annulé' })}><CircleX className="h-4 w-4" />{t.cancel}</Button>
            </div>
          </Card>
        );
      }) : <EmptyState title="Aucun RDV" description="Les rendez-vous assignés au vendeur apparaîtront ici." />}
    </div>
  );
}

export function VendeurMessagesPage() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { messages, users, sendMessage, markThreadRead } = useAppData();
  const [reply, setReply] = useState('');
  const threads = useMemo(() => messages.filter((message) => message.from === user?.id || message.to === user?.id), [messages, user?.id]);
  const selected = threads[0];

  useEffect(() => {
    if (selected?.threadId && user?.id) {
      markThreadRead(selected.threadId, user.id);
    }
  }, [selected?.threadId, user?.id, markThreadRead]);

  const submit = (event) => {
    event.preventDefault();
    if (!reply.trim() || !selected) {
      return;
    }

    sendMessage({ from: user?.id, to: selected.from === user?.id ? selected.to : selected.from, carId: selected.carId, threadId: selected.threadId, text: reply });
    setReply('');
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <p className="text-sm font-semibold text-brand-700">{t.messagesTitle}</p>
        <div className="mt-4 space-y-3">
          {threads.length ? threads.map((message) => {
            const partner = users.find((entry) => entry.id === (message.from === user?.id ? message.to : message.from));
            return (
              <div key={message.id} className="rounded-3xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-950">{partner?.name}</p>
                <p className="mt-2 text-sm text-slate-600">{message.text}</p>
              </div>
            );
          }) : <EmptyState title="Messages vides" description="Les messages clients apparaissent ici." />}
        </div>
      </Card>

      <Card>
        <p className="text-sm font-semibold text-brand-700">{t.replyTitle}</p>
        <form className="mt-4 grid gap-3" onSubmit={submit}>
          <textarea value={reply} onChange={(event) => setReply(event.target.value)} className="min-h-40 rounded-3xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-300" placeholder={language === 'ar' ? 'الرد على العميل...' : 'Répondre au client...'} />
          <Button type="submit" className="gap-2"><MessageSquareMore className="h-4 w-4" />{language === 'ar' ? 'إرسال' : 'Envoyer'}</Button>
        </form>
      </Card>
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