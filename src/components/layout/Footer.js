import { Mail, MapPin, Phone, Share2, MessageCircle, Link2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export default function Footer() {
  const { language } = useLanguage();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    fr: {
      about: 'À propos',
      services: 'Services',
      contact: 'Contact',
      legal: 'Mentions légales',
      privacy: 'Confidentialité',
      terms: 'Conditions',
      company: 'ScanDrive',
      tagline: 'La révolution QR du marché automobile tunisien',
      quickLinks: 'Liens rapides',
      followUs: 'Nous suivre',
      contact_info: 'Nous contacter',
    },
    en: {
      about: 'About',
      services: 'Services',
      contact: 'Contact',
      legal: 'Legal',
      privacy: 'Privacy',
      terms: 'Terms',
      company: 'ScanDrive',
      tagline: 'The future of car shopping in Tunisia',
      quickLinks: 'Quick Links',
      followUs: 'Follow Us',
      contact_info: 'Get in Touch',
    },
    ar: {
      about: 'حول',
      services: 'الخدمات',
      contact: 'اتصل',
      legal: 'القانونية',
      privacy: 'الخصوصية',
      terms: 'الشروط',
      company: 'ScanDrive',
      tagline: 'ثورة الشراء الذكي للسيارات في تونس',
      quickLinks: 'روابط سريعة',
      followUs: 'تابعنا',
      contact_info: 'تواصل معنا',
    },
  };

  const content = footerLinks[language] || footerLinks.fr;

  return (
    <footer className="border-t border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid gap-8 md:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-950 dark:text-white">{content.company}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{content.tagline}</p>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>Tunis, Tunisie</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+216 XX XXX XXX</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>hello@scandrive.tn</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-950 dark:text-white">{content.quickLinks}</h4>
            <ul className="space-y-2">
              {[
                { label: content.about, to: '#' },
                { label: content.services, to: '#' },
                { label: content.contact, to: '/contact' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-600 transition hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-950 dark:text-white">Legal</h4>
            <ul className="space-y-2">
              {[
                { label: content.privacy, to: '#' },
                { label: content.terms, to: '#' },
                { label: content.legal, to: '#' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-600 transition hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-950 dark:text-white">{content.followUs}</h4>
            <div className="flex gap-4">
              {[
                { icon: Share2, url: 'https://facebook.com', label: 'Facebook' },
                { icon: MessageCircle, url: 'https://twitter.com', label: 'Twitter' },
                { icon: Link2, url: 'https://linkedin.com', label: 'LinkedIn' },
              ].map(({ icon: Icon, url, label }, idx) => (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition hover:bg-brand-600 hover:text-white dark:bg-slate-800 dark:text-slate-400"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-slate-200 dark:border-slate-800" />

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-slate-600 sm:flex-row dark:text-slate-400">
          <p>© {currentYear} ScanDrive. Tous droits réservés.</p>
          <p className="text-xs">
            Designed & Built with{' '}
            <span className="inline-block text-red-500">♥</span> for Tunisia
          </p>
        </div>
      </div>
    </footer>
  );
}
