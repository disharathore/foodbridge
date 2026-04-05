import { createContext, useContext, useReducer } from 'react';
import { useSocket } from '../hooks/useSocket';

const AppContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case 'SET_LISTINGS':
      return { ...state, listings: Array.isArray(action.payload) ? action.payload : [] };
    case 'SET_TOTAL':
      return { ...state, total: action.payload };
    case 'ADD_LISTING':
      return { ...state, listings: [action.payload, ...(Array.isArray(state.listings) ? state.listings : [])] };
    case 'UPDATE_LISTING':
      return {
        ...state,
        listings: (Array.isArray(state.listings) ? state.listings : []).map(l =>
          l._id === action.payload._id ? action.payload : l
        ),
      };
    case 'UPDATE_METRICS':
      return { ...state, metrics: { ...state.metrics, ...action.payload } };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_CITY':
      return { ...state, city: action.payload };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications].slice(0, 20) };
    default:
      return state;
  }
}

const initialState = {
  listings: [],
  total: 0,
  metrics: {},
  user: null,
  city: 'Delhi',
  notifications: [],
};

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { emit } = useSocket(state.city, {
    'listing:created':    (data) => {
      dispatch({ type: 'ADD_LISTING', payload: data });
      dispatch({ type: 'ADD_NOTIFICATION', payload: { type: 'new', text: `New listing: ${data.restaurantName} posted ${data.portions} meals`, time: new Date() } });
    },
    'listing:claimed':    (data) => dispatch({ type: 'UPDATE_LISTING', payload: data }),
    'listing:in_transit': (data) => dispatch({ type: 'UPDATE_LISTING', payload: data }),
    'listing:completed':  (data) => dispatch({ type: 'UPDATE_LISTING', payload: data }),
    'metrics:update':     (data) => dispatch({ type: 'UPDATE_METRICS', payload: data }),
  });

  return (
    <AppContext.Provider value={{ state, dispatch, emit }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
