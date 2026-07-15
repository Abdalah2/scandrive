import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import users from '../data/users.json';

const STORAGE_KEY = 'scandrive-auth';
const AuthContext = createContext(null);

function authReducer(state, action) {
  switch (action.type) {
    case 'login':
      return { ...state, user: action.user };
    case 'logout':
      return { ...state, user: null };
    case 'register':
      return { ...state, user: action.user, users: [...state.users, action.user] };
    default:
      return state;
  }
}

function buildInitialState() {
  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (raw) {
    try {
      const parsed = JSON.parse(raw);

      return {
        user: parsed.user ?? null,
        users: parsed.users?.length ? parsed.users : users,
      };
    } catch (error) {
      // Ignore malformed cache and fall back to defaults.
    }
  }

  return { user: null, users };
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, undefined, buildInitialState);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const api = useMemo(() => {
    const login = (email, password) => {
      const matchedUser = state.users.find((entry) => entry.email.toLowerCase() === email.toLowerCase().trim() && entry.password === password);

      if (!matchedUser || matchedUser.active === false) {
        return { ok: false, message: 'Identifiants invalides ou compte désactivé.' };
      }

      const safeUser = { id: matchedUser.id, name: matchedUser.name, role: matchedUser.role, email: matchedUser.email };
      dispatch({ type: 'login', user: safeUser });
      window.localStorage.setItem('scandrive-session', JSON.stringify(safeUser));

      return { ok: true, user: safeUser };
    };

    const logout = () => {
      dispatch({ type: 'logout' });
      window.localStorage.removeItem('scandrive-session');
    };

    const register = (payload) => {
      const nextUser = {
        id: `user-${Date.now()}`,
        name: payload.name,
        email: payload.email,
        password: payload.password,
        role: payload.role || 'client',
        active: true,
      };

      dispatch({ type: 'register', user: nextUser });
      window.localStorage.setItem('scandrive-session', JSON.stringify({ id: nextUser.id, name: nextUser.name, role: nextUser.role, email: nextUser.email }));

      return nextUser;
    };

    return { user: state.user, users: state.users, login, logout, register };
  }, [state.user, state.users]);

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}