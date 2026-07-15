import { Home, CarFront, MessageCircleMore, BadgeInfo, LogIn, UserPlus } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import ChatbotWidget from '../common/ChatbotWidget';

const navItems = [
  { to: '/', label: 'Accueil', icon: Home },
  { to: '/cars', label: 'Voitures', icon: CarFront },
  { to: '/contact', label: 'Agences', icon: BadgeInfo },
  { to: '/login', label: 'Connexion', icon: LogIn },
  { to: '/register', label: 'Inscription', icon: UserPlus },
];

export default function PublicLayout() {
  return (
    <div className="min-h-screen text-slate-900">
      <header className="sticky top-0 z-40 border-b border-white/40 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-900 text-white shadow-soft">
              <CarFront className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.24em] text-brand-700 uppercase">ScanDrive</p>
              <p className="text-xs text-slate-500">QR car marketplace</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink key={item.to} to={item.to} className={({ isActive }) => `inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition ${isActive ? 'bg-brand-50 text-brand-900' : 'text-slate-600 hover:bg-slate-100'}`}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 lg:hidden">
            <MessageCircleMore className="h-5 w-5 text-brand-700" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white/80">
        <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-slate-500 sm:px-6 lg:px-8">
          ScanDrive demo frontend only. Data, auth, and QR flows are fully simulated locally.
        </div>
      </footer>

      <ChatbotWidget />
    </div>
  );
}