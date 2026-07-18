import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import { CalendarDays, Heart, MessageSquareMore, UserCircle2, Send, PenLine, RotateCcw } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';
import CarCard from '../../components/car/CarCard';
import CarCompareTable from '../../components/car/CarCompareTable';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useCompare } from '../../context/CompareContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatDate } from '../../utils/formatDate';

export function ClientDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { cars, rendezvous, messages } = useAppData();
  const { favorites } = useFavorites();
  const unread = messages.filter((message) => message.to === user?.id && !message.read).length;
  const upcoming = rendezvous.filter((rdv) => rdv.clientId === user?.id && rdv.status !== 'Annulé').slice(0, 3);
  const favoriteCars = cars.filter((car) => favorites.includes(car.id)).slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="Favoris" value={favorites.length} icon={Heart} />
        <Stat label="RDV à venir" value={upcoming.length} icon={CalendarDays} />
        <Stat label="Messages non lus" value={unread} icon={MessageSquareMore} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <p className="text-sm font-semibold text-brand-700">{t.clientDashboardTitle}</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">{t.favoritesTitle}</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {favoriteCars.length ? favoriteCars.map((car) => <CarCard key={car.id} car={car} />) : <EmptyState title="Aucun favori" description="Ajoutez des voitures depuis le catalogue pour les retrouver ici." />}
          </div>
        </Card>

        <Card>
          <p className="text-sm font-semibold text-brand-700">{t.appointmentsTitle}</p>
          <div className="mt-4 space-y-3">
            {upcoming.length ? upcoming.map((rdv) => (
              <div key={rdv.id} className="rounded-3xl bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-950">{rdv.type}</p>
                  <Badge tone={rdv.status === 'Confirmé' ? 'success' : 'accent'}>{rdv.status}</Badge>
                </div>
                <p className="mt-2 text-sm text-slate-600">{formatDate(`${rdv.date}T${rdv.time}:00`)}</p>
              </div>
            )) : <EmptyState title="Aucun RDV" description="Réservez un essai depuis une fiche voiture." />}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function FavoritesPage() {
  const { cars } = useAppData();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const list = cars.filter((car) => favorites.includes(car.id));

  return list.length ? (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {list.map((car) => <CarCard key={car.id} car={car} onToggleFavorite={toggleFavorite} isFavorite={isFavorite(car.id)} />)}
    </section>
  ) : <EmptyState title="Favoris vides" description="Ouvrez le catalogue et sauvegardez des voitures pour les retrouver ici." />;
}

export function ComparePage() {
  const { cars } = useAppData();
  const { t } = useLanguage();
  const { compareIds, toggleCompare, isCompared } = useCompare();
  const selected = cars.filter((car) => compareIds.includes(car.id));

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-brand-700">Comparateur</p>
            <h1 className="text-2xl font-bold text-slate-950">{t.compareTitle}</h1>
          </div>
          <Badge tone="brand">{selected.length}/4</Badge>
        </div>
      </Card>
      <CarCompareTable cars={selected} />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {cars.slice(0, 6).map((car) => (
          <Button key={car.id} variant={isCompared(car.id) ? 'accent' : 'secondary'} onClick={() => toggleCompare(car.id)}>
            {isCompared(car.id) ? 'Retirer' : 'Ajouter'} {car.make} {car.model}
          </Button>
        ))}
      </div>
    </div>
  );
}

export function RdvPage() {
  const [searchParams] = useSearchParams();
  const { cars, agencies, addAppointment } = useAppData();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [form, setForm] = useState({ carId: searchParams.get('carId') || cars[0]?.id || '', agencyId: agencies[0]?.id || '', date: '', time: '10:00', type: 'Essai routier', sellerId: 'user-202' });
  const signatureRef = useRef(null);

  useEffect(() => {
    if (!form.carId && cars[0]) {
      setForm((current) => ({ ...current, carId: cars[0].id }));
    }
  }, [cars, form.carId]);

  const submit = (event) => {
    event.preventDefault();
    addAppointment({ ...form, clientId: user?.id || 'user-001', status: 'En attente' });
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
      <Card>
        <p className="text-sm font-semibold text-brand-700">{t.appointmentsTitle}</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-950">{t.rdvTitle}</h1>
        <form className="mt-6 grid gap-4" onSubmit={submit}>
          <Field label="Voiture" as="select" value={form.carId} onChange={(event) => setForm((current) => ({ ...current, carId: event.target.value }))} options={cars.map((car) => ({ value: car.id, label: `${car.make} ${car.model}` }))} />
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Date" type="date" value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} />
            <Field label="Heure" type="time" value={form.time} onChange={(event) => setForm((current) => ({ ...current, time: event.target.value }))} />
          </div>
          <Field label="Agence" as="select" value={form.agencyId} onChange={(event) => setForm((current) => ({ ...current, agencyId: event.target.value }))} options={agencies.map((agency) => ({ value: agency.id, label: `${agency.name} - ${agency.city}` }))} />
          <Field label="Type de rendez-vous" as="select" value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))} options={[{ value: 'Essai routier', label: 'Essai routier' }, { value: 'Visite', label: 'Visite' }, { value: 'Paiement', label: 'Paiement en ligne' }]} />
          <div className="grid gap-3 rounded-3xl bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700"><PenLine className="h-4 w-4" />{language === 'ar' ? 'التوقيع الإلكتروني التجريبي' : 'Signature électronique simulée'}</div>
            <SignatureCanvas ref={signatureRef} penColor="#102b4f" canvasProps={{ className: 'h-40 w-full rounded-2xl bg-white border border-slate-200' }} />
            <Button type="button" variant="secondary" className="gap-2" onClick={() => signatureRef.current?.clear()}><RotateCcw className="h-4 w-4" />{t.cancel}</Button>
          </div>
          <Button type="submit" className="gap-2"><Send className="h-4 w-4" />{t.save}</Button>
        </form>
      </Card>

      <Card>
        <p className="text-sm font-semibold text-brand-700">Aperçu</p>
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          <p>{language === 'ar' ? 'العميل' : 'Client'}: {user?.name || 'Client démo'}</p>
          <p>{language === 'ar' ? 'السيارة' : 'Voiture'}: {cars.find((car) => car.id === form.carId)?.make} {cars.find((car) => car.id === form.carId)?.model}</p>
          <p>{language === 'ar' ? 'الوكالة' : 'Agence'}: {agencies.find((agency) => agency.id === form.agencyId)?.name}</p>
          <p>Type: {form.type}</p>
        </div>
        <div className="mt-5 rounded-3xl bg-brand-50 p-4 text-sm text-brand-900">
          Les créneaux sont simulés et le RDV est persisté dans le stockage local du navigateur.
        </div>
      </Card>
    </div>
  );
}

export function MessagesPage() {
  const { messages, users, sendMessage, markThreadRead } = useAppData();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [selectedThread, setSelectedThread] = useState('');
  const [reply, setReply] = useState('');

  const threads = useMemo(() => {
    const relevant = messages.filter((message) => message.from === user?.id || message.to === user?.id);
    return Object.values(relevant.reduce((acc, message) => {
      acc[message.threadId] = acc[message.threadId] || [];
      acc[message.threadId].push(message);
      return acc;
    }, {})).sort((a, b) => new Date(b[0].createdAt) - new Date(a[0].createdAt));
  }, [messages, user?.id]);

  useEffect(() => {
    if (!selectedThread && threads[0]) {
      setSelectedThread(threads[0][0].threadId);
    }
  }, [selectedThread, threads]);

  useEffect(() => {
    if (selectedThread && user?.id) {
      markThreadRead(selectedThread, user.id);
    }
  }, [selectedThread, user?.id, markThreadRead]);

  const currentMessages = messages.filter((message) => message.threadId === selectedThread).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const replyTo = currentMessages.find((message) => message.from !== user?.id)?.from || 'user-202';

  const submit = (event) => {
    event.preventDefault();
    if (!reply.trim()) {
      return;
    }
    sendMessage({ from: user?.id || 'user-001', to: replyTo, carId: currentMessages[0]?.carId, threadId: selectedThread || undefined, text: reply });
    setReply('');
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <Card>
        <p className="text-sm font-semibold text-brand-700">{t.messagesTitle}</p>
        <div className="mt-4 space-y-3">
          {threads.length ? threads.map((thread) => {
            const latest = thread[thread.length - 1];
            const partner = users.find((entry) => entry.id === (latest.from === user?.id ? latest.to : latest.from));
            return (
              <button key={thread[0].threadId} onClick={() => setSelectedThread(thread[0].threadId)} className={`w-full rounded-3xl border p-4 text-left transition ${selectedThread === thread[0].threadId ? 'border-brand-300 bg-brand-50' : 'border-slate-200 bg-white hover:border-brand-200'}`}>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-950">{partner?.name || 'Conversation'}</p>
                  {!latest.read ? <Badge tone="accent">{language === 'ar' ? 'جديد' : 'Nouveau'}</Badge> : null}
                </div>
                <p className="mt-2 text-sm text-slate-600 line-clamp-2">{latest.text}</p>
              </button>
            );
          }) : <Loader label="Aucun fil de discussion" />}
        </div>
      </Card>

      <Card>
        <p className="text-sm font-semibold text-brand-700">Message</p>
        <div className="mt-4 min-h-80 rounded-3xl bg-slate-50 p-4">
          {currentMessages.length ? currentMessages.map((message) => (
            <div key={message.id} className={`mb-3 flex ${message.from === user?.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-3xl px-4 py-3 text-sm ${message.from === user?.id ? 'bg-brand-900 text-white' : 'bg-white text-slate-800 shadow-soft'}`}>
                <p>{message.text}</p>
                <p className="mt-2 text-xs opacity-70">{formatDate(message.createdAt)}</p>
              </div>
            </div>
          )) : <EmptyState title="Aucun message" description="Choisissez une conversation ou envoyez un message depuis une fiche voiture." />}
        </div>

        <form className="mt-4 grid gap-3" onSubmit={submit}>
          <textarea value={reply} onChange={(event) => setReply(event.target.value)} className="min-h-28 rounded-3xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-300" placeholder={language === 'ar' ? 'اكتب ردًا...' : 'Écrire une réponse...'} />
          <Button type="submit" className="gap-2"><Send className="h-4 w-4" />{language === 'ar' ? 'إرسال' : 'Envoyer'}</Button>
        </form>
      </Card>
    </div>
  );
}

export function ClientProfilePage() {
  const { user } = useAuth();
  const { rendezvous } = useAppData();
  const { t } = useLanguage();
  const history = rendezvous.filter((rdv) => rdv.clientId === user?.id);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-50 text-brand-700"><UserCircle2 className="h-8 w-8" /></div>
          <div>
            <h1 className="text-2xl font-bold text-slate-950">{user?.name}</h1>
            <p className="text-sm text-slate-600">{user?.email}</p>
          </div>
        </div>
        <div className="mt-6 grid gap-3 text-sm text-slate-600">
          <p>Rôle: {user?.role}</p>
          <p>Compte: démo locale</p>
          <p>Historique synchronisé: localStorage</p>
        </div>
      </Card>

      <Card>
        <p className="text-sm font-semibold text-brand-700">{t.profileTitle}</p>
        <div className="mt-4 space-y-3">
          {history.length ? history.map((rdv) => (
            <div key={rdv.id} className="rounded-3xl bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-slate-950">{rdv.type}</p>
                <Badge tone={rdv.status === 'Confirmé' ? 'success' : 'accent'}>{rdv.status}</Badge>
              </div>
              <p className="mt-2 text-sm text-slate-600">{rdv.date} · {rdv.time}</p>
            </div>
          )) : <EmptyState title="Aucun historique" description="Les RDV créés apparaîtront ici." />}
        </div>
      </Card>
    </div>
  );
}

function Stat({ label, value, icon: Icon }) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
        </div>
        <div className="rounded-2xl bg-brand-50 p-3 text-brand-700"><Icon className="h-6 w-6" /></div>
      </div>
    </Card>
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