import { Home, CarFront, BadgeInfo, LayoutDashboard, Heart, GitCompareArrows, CalendarDays, MessagesSquare, Users, Building2, BarChart3, QrCode, LogOut, Search, SunMedium, MoonStar } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import ChatbotWidget from '../common/ChatbotWidget';
import BrandMark from '../common/BrandMark';
import { useThemeMode } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { toggleTheme, isDark } = useThemeMode();
  const { t, language, setLanguage } = useLanguage();

  const navigation = {
    client: [
      { to: '/client', label: t.menuDashboard, icon: LayoutDashboard },
      { to: '/client/favorites', label: t.menuFavorites, icon: Heart },
      { to: '/client/compare', label: t.menuCompare, icon: GitCompareArrows },
      { to: '/client/rdv', label: t.menuRdv, icon: CalendarDays },
      { to: '/client/messages', label: t.menuMessages, icon: MessagesSquare },
      { to: '/client/profile', label: t.menuProfile, icon: Search },
    ],
    vendeur: [
      { to: '/vendeur', label: t.menuDashboard, icon: LayoutDashboard },
      { to: '/vendeur/cars', label: t.menuMyCars, icon: CarFront },
      { to: '/vendeur/rdv', label: t.menuRdv, icon: CalendarDays },
      { to: '/vendeur/messages', label: t.menuMessages, icon: MessagesSquare },
    ],
    admin: [
      { to: '/admin', label: t.menuDashboard, icon: LayoutDashboard },
      { to: '/admin/cars', label: t.menuCars, icon: CarFront },
      { to: '/admin/users', label: t.menuUsers, icon: Users },
      { to: '/admin/agencies', label: t.menuAgencies, icon: Building2 },
      { to: '/admin/stats', label: t.menuStats, icon: BarChart3 },
      { to: '/admin/qr', label: t.menuQr, icon: QrCode },
    ],
  };

  const nav = navigation[user?.role] || navigation.client;
  const publicNav = [
    { to: '/', label: t.navHome, icon: Home },
    { to: '/cars', label: t.navCars, icon: CarFront },
    { to: '/contact', label: t.navAgencies, icon: BadgeInfo },
  ];
  const dashboardRoute = user?.role === 'admin' ? '/admin' : user?.role === 'vendeur' ? '/vendeur' : '/client';

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 lg:flex">
      <aside className="border-b border-slate-200 bg-white lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center justify-between px-5 py-5 lg:block">
          <Link to="/" className="flex items-center gap-3">
            <BrandMark compact />
            <div>
              <p className="text-sm font-semibold tracking-[0.24em] text-brand-700 uppercase">ScanDrive</p>
              <p className="text-xs text-slate-500">{t.brandTag}</p>
            </div>
          </Link>
        </div>

        <div className="hidden px-5 pb-4 lg:block">
          <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>

        <nav className="grid gap-2 px-3 pb-5">
          {publicNav.map((item) => <SidebarLink key={item.to} item={item} />)}
          <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
            {nav.map((item) => <SidebarLink key={item.to} item={item} />)}
          </div>
        </nav>

        <div className="px-5 pb-6">
          <Button variant="secondary" className="w-full gap-2" onClick={logout}>
            <LogOut className="h-4 w-4" />
            {t.logout}
          </Button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85">
          <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-500">{language === 'ar' ? 'مساحة' : `Espace ${user?.role}`}</p>
                <h1 className="text-xl font-semibold text-slate-950 dark:text-white">{language === 'ar' ? 'مرحبًا' : 'Bonjour'}, {user?.name}</h1>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to={dashboardRoute}
                  className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  {t.menuDashboard}
                </Link>
                <select
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  <option value="fr">FR</option>
                  <option value="ar">AR</option>
                  <option value="en">EN</option>
                </select>
                <Button variant="secondary" className="gap-2" onClick={toggleTheme} type="button">
                  {isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
                  {isDark ? t.themeLight : t.themeDark}
                </Button>
                <div className="rounded-2xl bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-800 dark:bg-brand-900/30 dark:text-brand-50">{t.modeDemo}</div>
              </div>
            </div>
            <nav className="flex flex-wrap gap-2">
              {publicNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition ${isActive ? 'border-brand-500 bg-brand-50 text-brand-900 dark:border-brand-400 dark:bg-brand-900/30 dark:text-brand-50' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800'}`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
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

function SidebarLink({ item }) {
  const Icon = item.icon;

  return (
    <NavLink to={item.to} className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${isActive ? 'bg-brand-50 text-brand-900' : 'text-slate-600 hover:bg-slate-100'}`}>
      <Icon className="h-4 w-4" />
      {item.label}
    </NavLink>
  );
}