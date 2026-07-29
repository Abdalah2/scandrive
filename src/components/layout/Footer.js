import { ArrowRight, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import BrandMark from '../common/BrandMark';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 -translate-x-1/4 translate-y-1/4 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute left-0 bottom-0 h-56 w-56 -translate-y-1/4 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_0.95fr]">
          <div className="space-y-5">
            <Link to="/" className="inline-flex items-center gap-3">
              <BrandMark />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">ScanDrive</p>
                <p className="text-xs text-slate-400">Showroom digital & QR auto</p>
              </div>
            </Link>
            <p className="max-w-md text-sm leading-7 text-slate-300">
              Une expérience moderne et élégante pour valoriser les véhicules, fluidifier la prise de contact et générer des leads qualifiés.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Concessions', value: '24+' },
                { label: 'Véhicules', value: '118' },
                { label: 'QR-ready', value: '100%' },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm">
                  <p className="text-2xl font-bold text-white">{item.value}</p>
                  <p className="text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Ressources</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                <li><Link to="/cars" className="transition hover:text-white">Catalogue</Link></li>
                <li><Link to="/register" className="transition hover:text-white">Inscription</Link></li>
                <li><Link to="/contact" className="transition hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">À propos</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                <li><Link to="/" className="transition hover:text-white">Notre mission</Link></li>
                <li><Link to="/" className="transition hover:text-white">Support pro</Link></li>
                <li><a href="mailto:hello@scandrive.tn" className="transition hover:text-white">hello@scandrive.tn</a></li>
              </ul>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Contact rapide</p>
            <div className="mt-5 space-y-4 text-sm text-slate-300">
              <div className="rounded-3xl bg-slate-900/80 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Email</p>
                <p className="mt-1 font-semibold text-white">hello@scandrive.tn</p>
              </div>
              <div className="rounded-3xl bg-slate-900/80 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Téléphone</p>
                <p className="mt-1 font-semibold text-white">+216 71 000 000</p>
              </div>
            </div>
            <Link
              to="/cars"
              className="mt-6 inline-flex items-center justify-between rounded-full border border-cyan-300/20 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/15"
            >
              Voir le showroom
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 ScanDrive — Conçu pour le retail automobile moderne.</span>
          <div className="flex flex-wrap gap-4">
            <Link to="/legal" className="transition hover:text-white">Mentions légales</Link>
            <Link to="/privacy" className="transition hover:text-white">Confidentialité</Link>
            <Link to="/contact" className="transition hover:text-white">Assistance</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
