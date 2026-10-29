// src/store/useAppStore.jsx
// React Context + useReducer with localStorage persistence.

import { createContext, useContext, useReducer, useEffect, useCallback, useState } from 'react';
import {
  campaignConfig,
  seedChannels,
  seedRegistrations,
  seedAmbassadors,
  seedExperiments,
  seedDailyPlan,
  seedTransactions,
} from '../data/seedData.js';

const STORAGE_KEY = 'growthpilot-state-v2';

const SEED_STATE = {
  campaign:      campaignConfig,
  channels:      seedChannels,
  registrations: seedRegistrations,
  ambassadors:   seedAmbassadors,
  experiments:   seedExperiments,
  dailyPlan:     seedDailyPlan,
  transactions:  seedTransactions,
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Basic validation — must have all keys
      if (parsed.campaign && parsed.channels && parsed.registrations) return parsed;
    }
  } catch {
    // ignore
  }
  return SEED_STATE;
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // quota exceeded — silently skip
  }
}

function appReducer(state, action) {
  switch (action.type) {
    case 'ADD_REGISTRATION': {
      const emailLower = action.payload.email.toLowerCase();
      const duplicate  = state.registrations.some(r => r.email.toLowerCase() === emailLower);
      if (duplicate) {
        throw new Error(`A registration with email "${action.payload.email}" already exists.`);
      }
      return { ...state, registrations: [...state.registrations, action.payload] };
    }
    case 'REMOVE_REGISTRATION':
      return { ...state, registrations: state.registrations.filter(r => r.id !== action.payload) };

    case 'ADD_AMBASSADOR':
      return { ...state, ambassadors: [...state.ambassadors, action.payload] };
    case 'UPDATE_AMBASSADOR':
      return { ...state, ambassadors: state.ambassadors.map(a => a.id === action.payload.id ? { ...a, ...action.payload } : a) };
    case 'DELETE_AMBASSADOR':
      return { ...state, ambassadors: state.ambassadors.filter(a => a.id !== action.payload) };

    case 'ADD_CHANNEL':
      return { ...state, channels: [...state.channels, action.payload] };
    case 'UPDATE_CHANNEL':
      return { ...state, channels: state.channels.map(c => c.id === action.payload.id ? { ...c, ...action.payload } : c) };

    case 'ADD_EXPERIMENT':
      return { ...state, experiments: [...state.experiments, action.payload] };
    case 'UPDATE_EXPERIMENT':
      return { ...state, experiments: state.experiments.map(e => e.id === action.payload.id ? { ...e, ...action.payload } : e) };
    case 'UPDATE_VARIANT':
      return {
        ...state,
        experiments: state.experiments.map(exp =>
          exp.id === action.payload.experimentId
            ? {
                ...exp,
                variants: exp.variants.map(v =>
                  v.id === action.payload.variantId ? { ...v, ...action.payload.data } : v
                ),
              }
            : exp
        ),
      };

    case 'UPDATE_DAY_PLAN':
      return {
        ...state,
        dailyPlan: state.dailyPlan.map(d =>
          d.day === action.payload.day ? { ...d, ...action.payload.data } : d
        ),
      };

    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] };

    case 'RESET_TO_SEED':
      return { ...SEED_STATE };

    default:
      return state;
  }
}

const AppContext   = createContext(null);
const ToastContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch]   = useReducer(appReducer, null, loadState);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts(prev => [...prev.slice(-3), { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Safe dispatch wrapper — catches duplicate-email errors and converts to toasts
  const safeDispatch = useCallback((action, onError) => {
    try {
      dispatch(action);
    } catch (err) {
      if (onError) {
        onError(err.message);
      } else {
        addToast(err.message, 'error');
      }
    }
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      <AppContext.Provider value={{ state, dispatch, safeDispatch }}>
        {children}
      </AppContext.Provider>
    </ToastContext.Provider>
  );
}

export const useAppStore  = () => useContext(AppContext);
export const useToastCtx  = () => useContext(ToastContext);
