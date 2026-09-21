import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.jsx';
import { TemaProvider } from './context/TemaContext.jsx';
import { DataProvider } from './context/DataContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { migrarDados } from './lib/migracao.js';

// Migra o que estiver gravado no formato antigo ANTES de qualquer provider
// ler as coleções. Roda uma vez só: o marcador de versão barra a segunda.
migrarDados();

// Ponto de entrada da aplicação.
// TemaProvider entrega o tema (escuro/claro) ao styled-components. Em seguida,
// DataProvider guarda as coleções e o AuthProvider (sessão) as lê
// para resolver quem está logado.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TemaProvider>
      <DataProvider>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </DataProvider>
    </TemaProvider>
  </React.StrictMode>
);
