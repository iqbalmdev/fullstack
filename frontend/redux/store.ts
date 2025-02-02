import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // default is localStorage
import logger from 'redux-logger'; // Import redux-logger

import userReducer from './slices/userSlice';
import authReducer from './slices/authSlice';

// Persist configuration for Redux state
const persistConfig = {
  key: 'root',
  storage, // Using localStorage to persist the store
  whitelist: ['auth'], // State slices to persist (You can modify this as needed)
};

// Apply persisted reducer to the auth slice
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

// Configure the store with middleware

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer, // Correctly wrapped reducer
    user: userReducer, // User slice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable values in redux-persist actions
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(logger), // Add logger middleware only in development
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools only in dev
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
// Create a persistor object for redux-persist
export const persistor = persistStore(store);

export default store;
