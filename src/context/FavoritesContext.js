import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

const STORAGE_KEY = 'scandrive-favorites';
const FavoritesContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case 'toggle':
      return state.includes(action.id) ? state.filter((item) => item !== action.id) : [...state, action.id];
    case 'clear':
      return [];
    default:
      return state;
  }
}

function getInitialState() {
  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    return [];
  }
}

export function FavoritesProvider({ children }) {
  const [favorites, dispatch] = useReducer(reducer, undefined, getInitialState);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const value = useMemo(
    () => ({
      favorites,
      toggleFavorite: (id) => dispatch({ type: 'toggle', id }),
      clearFavorites: () => dispatch({ type: 'clear' }),
      isFavorite: (id) => favorites.includes(id),
    }),
    [favorites]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error('useFavorites must be used inside FavoritesProvider');
  }

  return context;
}