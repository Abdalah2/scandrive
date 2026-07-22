import { Home, CarFront, MessageCircleMore, BadgeInfo, LogIn, UserPlus, SunMedium, MoonStar } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import ChatbotWidget from '../common/ChatbotWidget';
import BrandMark from '../common/BrandMark';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useThemeMode } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export default function PublicLayout() {
  const { user, logout } = useAuth();
  const { toggleTheme, isDark } = useThemeMode();
  const { t, language, setLanguage } = useLanguage();
  const dashboardRoute = user?.role === 'admin' ? '/admin' : user?.role === 'vendeur' ? '/vendeur' : '/client';

  const navItems = [
    { to: '/', label: t.navHome, icon: Home },
    { to: '/cars', label: t.navCars, icon: CarFront },
    { to: '/contact', label: t.navAgencies, icon: BadgeInfo },
    ...(!user ? [{ to: '/login', label: t.navLogin, icon: LogIn }, { to: '/register', label: t.navRegister, icon: UserPlus }] : []),
  ];

  return (
    <div className="min-h-screen text-slate-900 transition-colors dark:text-slate-100">
      <header className="sticky top-0 z-40 border-b border-white/40 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <BrandMark />
            <div>
              <p className="text-sm font-semibold tracking-[0.24em] text-brand-700 uppercase">ScanDrive</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t.brandTag}</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink key={item.to} to={item.to} className={({ isActive }) => `inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition ${isActive ? 'bg-brand-50 text-brand-900 dark:bg-brand-900/30 dark:text-brand-50' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link
                  to={dashboardRoute}
                  className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  {t.menuDashboard}
                </Link>
                <Button variant="secondary" className="gap-2" onClick={logout} type="button">
                  {t.logout}
                </Button>
              </>
            ) : null}
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              aria-label={t.language}
            >
              <option value="fr">FR</option>
              <option value="ar">AR</option>
              <option value="en">EN</option>
            </select>
            <Button variant="secondary" className="hidden lg:inline-flex p-2" onClick={toggleTheme} type="button" aria-label={isDark ? t.themeLight : t.themeDark}>
              {isDark ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
            </Button>
            <button className="rounded-2xl p-2 text-brand-700 hover:bg-slate-100 dark:text-brand-200 dark:hover:bg-slate-800 lg:hidden" aria-label="menu">
              <MessageCircleMore className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-slate-500 dark:text-slate-400 sm:px-6 lg:px-8">
          ScanDrive demo frontend only. Data, auth, and QR flows are fully simulated locally.
        </div>
      </footer>

      <ChatbotWidget />
    </div>
  );
}