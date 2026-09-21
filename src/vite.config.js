import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuração do Vite com o plugin oficial do React.
// O plugin do styled-components não é obrigatório, mas o babel plugin
// melhora os nomes das classes no DevTools. Mantemos simples por enquanto.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
});
