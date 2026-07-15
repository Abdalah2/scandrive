import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import carsSeed from '../data/cars.json';
import usersSeed from '../data/users.json';
import agenciesSeed from '../data/agences.json';
import rendezvousSeed from '../data/rendezvous.json';
import messagesSeed from '../data/messages.json';

const STORAGE_KEY = 'scandrive-app-data';
const AppDataContext = createContext(null);

function createThreadId(a, b) {
  return [a, b].sort().join('-');
}

function createActivity(text, type) {
  return { id: `activity-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`, type, text, createdAt: new Date().toISOString() };
}

function reducer(state, action) {
  switch (action.type) {
    case 'addCar':
      return { ...state, cars: [action.car, ...state.cars] };
    case 'updateCar':
      return { ...state, cars: state.cars.map((car) => (car.id === action.car.id ? action.car : car)) };
    case 'deleteCar':
      return { ...state, cars: state.cars.filter((car) => car.id !== action.id) };
    case 'incrementView':
      return {
        ...state,
        cars: state.cars.map((car) => (car.id === action.id ? { ...car, viewCount: (car.viewCount || 0) + 1 } : car)),
      };
    case 'addAppointment':
      return { ...state, rendezvous: [action.item, ...state.rendezvous] };
    case 'updateAppointment':
      return {
        ...state,
        rendezvous: state.rendezvous.map((appointment) => (appointment.id === action.item.id ? action.item : appointment)),
      };
    case 'addMessage':
      return { ...state, messages: [action.item, ...state.messages] };
    case 'markThreadRead':
      return {
        ...state,
        messages: state.messages.map((message) => (message.threadId === action.threadId && message.to === action.userId ? { ...message, read: true } : message)),
      };
    case 'addAgency':
      return { ...state, agencies: [action.item, ...state.agencies] };
    case 'updateAgency':
      return { ...state, agencies: state.agencies.map((agency) => (agency.id === action.item.id ? action.item : agency)) };
    case 'deleteAgency':
      return { ...state, agencies: state.agencies.filter((agency) => agency.id !== action.id) };
    case 'updateUser':
      return { ...state, users: state.users.map((user) => (user.id === action.item.id ? action.item : user)) };
    case 'seedActivity':
      return { ...state, activities: [action.item, ...state.activities].slice(0, 30) };
    default:
      return state;
  }
}

function loadState() {
  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return {
      cars: carsSeed,
      users: usersSeed,
      agencies: agenciesSeed,
      rendezvous: rendezvousSeed,
      messages: messagesSeed,
      activities: [],
    };
  }

  try {
    const parsed = JSON.parse(raw);

    return {
      cars: parsed.cars?.length ? parsed.cars : carsSeed,
      users: parsed.users?.length ? parsed.users : usersSeed,
      agencies: parsed.agencies?.length ? parsed.agencies : agenciesSeed,
      rendezvous: parsed.rendezvous?.length ? parsed.rendezvous : rendezvousSeed,
      messages: parsed.messages?.length ? parsed.messages : messagesSeed,
      activities: parsed.activities?.length ? parsed.activities : [],
    };
  } catch (error) {
    return {
      cars: carsSeed,
      users: usersSeed,
      agencies: agenciesSeed,
      rendezvous: rendezvousSeed,
      messages: messagesSeed,
      activities: [],
    };
  }
}

export function AppDataProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const api = useMemo(() => {
    const addCar = (car) => {
      const id = car.id || `car-${Date.now()}`;
      const nextCar = {
        ...car,
        id,
        qrCodeUrl: car.qrCodeUrl || `https://scandrive.com/car/${id}`,
        viewCount: car.viewCount || 0,
      };

      dispatch({ type: 'addCar', car: nextCar });
      dispatch({ type: 'seedActivity', item: createActivity(`${nextCar.make} ${nextCar.model} ajouté`, 'car-added') });
      return nextCar;
    };

    const updateCar = (car) => {
      dispatch({ type: 'updateCar', car });
      dispatch({ type: 'seedActivity', item: createActivity(`${car.make} ${car.model} mis à jour`, 'car-updated') });
    };

    const deleteCar = (id) => dispatch({ type: 'deleteCar', id });
    const incrementView = (id) => dispatch({ type: 'incrementView', id });

    const addAppointment = (appointment) => {
      const item = { ...appointment, id: appointment.id || `rdv-${Date.now()}`, status: appointment.status || 'En attente' };
      dispatch({ type: 'addAppointment', item });
      dispatch({ type: 'seedActivity', item: createActivity(`RDV ${item.type} créé`, 'appointment') });
      return item;
    };

    const updateAppointment = (appointment) => dispatch({ type: 'updateAppointment', item: appointment });

    const sendMessage = (message) => {
      const item = {
        ...message,
        id: message.id || `msg-${Date.now()}`,
        threadId: message.threadId || createThreadId(message.from, message.to),
        createdAt: message.createdAt || new Date().toISOString(),
        read: message.read ?? false,
      };

      dispatch({ type: 'addMessage', item });
      return item;
    };

    const markThreadRead = (threadId, userId) => dispatch({ type: 'markThreadRead', threadId, userId });

    const addAgency = (agency) => {
      const item = { ...agency, id: agency.id || `agency-${Date.now()}` };
      dispatch({ type: 'addAgency', item });
      return item;
    };

    const updateAgency = (agency) => dispatch({ type: 'updateAgency', item: agency });
    const deleteAgency = (id) => dispatch({ type: 'deleteAgency', id });
    const updateUser = (user) => dispatch({ type: 'updateUser', item: user });

    return {
      cars: state.cars,
      users: state.users,
      agencies: state.agencies,
      rendezvous: state.rendezvous,
      messages: state.messages,
      activities: state.activities,
      addCar,
      updateCar,
      deleteCar,
      incrementView,
      addAppointment,
      updateAppointment,
      sendMessage,
      markThreadRead,
      addAgency,
      updateAgency,
      deleteAgency,
      updateUser,
    };
  }, [state]);

  return <AppDataContext.Provider value={api}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);

  if (!context) {
    throw new Error('useAppData must be used inside AppDataProvider');
  }

  return context;
}