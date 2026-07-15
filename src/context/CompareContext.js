import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

const STORAGE_KEY = 'scandrive-compare';
const CompareContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case 'toggle':
      if (state.includes(action.id)) {
        return state.filter((item) => item !== action.id);
      }

      if (state.length >= 4) {
        return state;
      }

      return [...state, action.id];
    case 'remove':
      return state.filter((item) => item !== action.id);
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

export function CompareProvider({ children }) {
  const [compareIds, dispatch] = useReducer(reducer, undefined, getInitialState);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(compareIds));
  }, [compareIds]);

  const value = useMemo(
    () => ({
      compareIds,
      toggleCompare: (id) => dispatch({ type: 'toggle', id }),
      removeFromCompare: (id) => dispatch({ type: 'remove', id }),
      clearCompare: () => dispatch({ type: 'clear' }),
      isCompared: (id) => compareIds.includes(id),
    }),
    [compareIds]
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const context = useContext(CompareContext);

  if (!context) {
    throw new Error('useCompare must be used inside CompareProvider');
  }

  return context;
}