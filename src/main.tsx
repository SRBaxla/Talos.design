import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

const rootElement = document.getElementById('root');

if (rootElement) {
  const isClientOnlyRoute =
    typeof window !== 'undefined' &&
    (window.location.pathname.startsWith('/admin') ||
      window.location.pathname.startsWith('/portal'));

  if (rootElement.hasChildNodes() && !isClientOnlyRoute) {
    hydrateRoot(
      rootElement,
      <StrictMode>
        <App />
      </StrictMode>
    );
  } else {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  }
}
