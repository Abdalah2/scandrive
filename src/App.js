import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { CompareProvider } from './context/CompareContext';
import { AppDataProvider } from './context/AppDataContext';

function App() {
  return (
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
  );
}

export default App;
