// src/store/redux-provider.tsx
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'; // Import PersistGate
import { store, persistor } from '../redux/store'; // Import the store and persistor from your redux store

// Create a component to wrap the app with the Redux Provider
const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      {/* Wrap with PersistGate to ensure persisted state is rehydrated */}
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default ReduxProvider;
