import { Component } from 'react';
import Button from './Button';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ScanDrive crashed:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
          <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Une erreur est survenue</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Quelque chose s’est mal passé lors de l’affichage de cette page.
            </p>
            <Button className="mt-5" onClick={() => window.location.assign('/')}>
              Retour à l’accueil
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
