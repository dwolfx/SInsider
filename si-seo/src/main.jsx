import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.jsx';

const mountNode = document.getElementById('si-seo-root');

if (mountNode) {
  // Detecta se foi injetado pelo WordPress no editor de posts ou se é a página do playground
  const isPostEditor = mountNode.dataset.mode === 'drawer' || (typeof window !== 'undefined' && window.SI_SEO_MODE === 'drawer');
  const root = ReactDOM.createRoot(mountNode);
  root.render(
    <React.StrictMode>
      <App mode={isPostEditor ? 'drawer' : 'playground'} />
    </React.StrictMode>
  );
}
