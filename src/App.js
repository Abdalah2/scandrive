import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { CompareProvider } from './context/CompareContext';
import { AppDataProvider } from './context/AppDataContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <AuthProvider>
            <AppDataProvider>
              <FavoritesProvider>
                <CompareProvider>
                  <AppRouter />
                </CompareProvider>
              </FavoritesProvider>
            </AppDataProvider>
          </AuthProvider>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
