import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'scandrive-theme';
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => window.localStorage.getItem(STORAGE_KEY) || 'light');

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo(() => ({
    theme,
    isDark: theme === 'dark',
    setTheme,
    toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
  }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeMode() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useThemeMode must be used inside ThemeProvider');
  }

  return context;
}