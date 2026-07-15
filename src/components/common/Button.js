export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const styles = {
    primary: 'bg-brand-700 text-white hover:bg-brand-800 shadow-soft',
    secondary: 'bg-white text-brand-900 border border-slate-200 hover:border-brand-300',
    ghost: 'bg-transparent text-brand-800 hover:bg-brand-50',
    accent: 'bg-accent-500 text-white hover:bg-accent-600 shadow-soft',
    danger: 'bg-danger text-white hover:opacity-90',
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand-300 focus:ring-offset-2 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}