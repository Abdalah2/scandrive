import { ArrowRight, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import BrandMark from '../common/BrandMark';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-3">
              <BrandMark />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">ScanDrive</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Marché auto QR premium</p>
              </div>
            </Link>
            <p className="max-w-md text-sm leading-7 text-slate-600 dark:text-slate-300">
              Une expérience showroom pensée pour mettre les véhicules en valeur et accélérer les rendez-vous.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-700 dark:text-slate-200">Contact</p>
            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-brand-700" /> hello@scandrive.tn</div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-brand-700" /> +216 71 000 000</div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 pt-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <span>© 2026 ScanDrive</span>
          <Link to="/cars" className="inline-flex items-center gap-2 hover:text-brand-700">
            Voir le catalogue <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
