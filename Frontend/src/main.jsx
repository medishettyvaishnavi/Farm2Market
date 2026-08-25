import 'bootstrap/dist/css/bootstrap.min.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './App.css';
import App from './App.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { NetworkProvider } from './context/NetworkContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { FarmerDataProvider } from './context/FarmerDataContext.jsx';

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
