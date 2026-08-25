import 'bootstrap/dist/css/bootstrap.min.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { LanguageProvider } from './context/LanguageContext';
import { NetworkProvider } from './context/NetworkContext';
import { AuthProvider } from './context/AuthContext';
import { FarmerDataProvider } from './context/FarmerDataContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <NetworkProvider>
        <AuthProvider>
          <FarmerDataProvider>
            <App />
          </FarmerDataProvider>
        </AuthProvider>
      </NetworkProvider>
    </LanguageProvider>
  </StrictMode>,
);
