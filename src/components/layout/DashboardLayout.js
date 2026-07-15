import { LayoutDashboard, Heart, GitCompareArrows, CalendarDays, MessagesSquare, CarFront, Users, Building2, BarChart3, QrCode, LogOut, Search } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import ChatbotWidget from '../common/ChatbotWidget';

const navigation = {
  client: [
    { to: '/client', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/client/favorites', label: 'Favoris', icon: Heart },
    { to: '/client/compare', label: 'Comparer', icon: GitCompareArrows },
    { to: '/client/rdv', label: 'RDV', icon: CalendarDays },
    { to: '/client/messages', label: 'Messages', icon: MessagesSquare },
    { to: '/client/profile', label: 'Profil', icon: Search },
  ],
  vendeur: [
    { to: '/vendeur', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/vendeur/cars', label: 'Mes voitures', icon: CarFront },
    { to: '/vendeur/rdv', label: 'RDV', icon: CalendarDays },
    { to: '/vendeur/messages', label: 'Messages', icon: MessagesSquare },
  ],
  admin: [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/cars', label: 'Voitures', icon: CarFront },
    { to: '/admin/users', label: 'Utilisateurs', icon: Users },
    { to: '/admin/agencies', label: 'Agences', icon: Building2 },
    { to: '/admin/stats', label: 'Stats', icon: BarChart3 },
    { to: '/admin/qr', label: 'QR', icon: QrCode },
  ],
};

function SidebarLink({ item }) {
  const Icon = item.icon;

  return (
    <NavLink to={item.to} className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${isActive ? 'bg-brand-50 text-brand-900' : 'text-slate-600 hover:bg-slate-100'}`}>
      <Icon className="h-4 w-4" />
      {item.label}
    </NavLink>
  );
}

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const nav = navigation[user?.role] || navigation.client;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 lg:flex">
      <aside className="border-b border-slate-200 bg-white lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-5 lg:block">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-900 text-white shadow-soft">
              <CarFront className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.24em] text-brand-700 uppercase">ScanDrive</p>
              <p className="text-xs text-slate-500">{user?.role || 'visitor'} workspace</p>
            </div>
          </Link>
        </div>

        <div className="hidden px-5 pb-4 lg:block">
          <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>

        <nav className="grid gap-2 px-3 pb-5">
          {nav.map((item) => <SidebarLink key={item.to} item={item} />)}
        </nav>

        <div className="px-5 pb-6">
          <Button variant="secondary" className="w-full gap-2" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-sm font-medium text-slate-500">Espace {user?.role}</p>
              <h1 className="text-xl font-semibold text-slate-950">Bonjour, {user?.name}</h1>
            </div>
            <div className="rounded-2xl bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-800">Mode démo</div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>

      <ChatbotWidget />
    </div>
  );
}