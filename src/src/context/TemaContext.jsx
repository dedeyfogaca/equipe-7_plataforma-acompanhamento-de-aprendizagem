import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ThemeProvider } from 'styled-components';
import { temaClaro, temaEscuro } from '../styles/theme.js';
import { GlobalStyle } from '../styles/GlobalStyle.js';

// Controla o modo de cor (escuro/claro). Guarda a escolha no LocalStorage e
// entrega o tema correspondente ao styled-components. O botão de alternar lê
// daqui via useTema().
const TemaContext = createContext(null);
const CHAVE = 'tema';

function lerModoSalvo() {
  try {
    const salvo = localStorage.getItem(CHAVE);
    return salvo === 'light' || salvo === 'dark' ? salvo : 'dark';
  } catch {
    return 'dark';
  }
}

export function TemaProvider({ children }) {
  const [modo, setModo] = useState(lerModoSalvo);

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE, modo);
    } catch {
      /* armazenamento indisponível */
    }
  }, [modo]);

  const alternarTema = useCallback(() => {
    setModo((atual) => (atual === 'dark' ? 'light' : 'dark'));
  }, []);

  const tema = modo === 'dark' ? temaEscuro : temaClaro;

  const valor = useMemo(() => ({ modo, alternarTema }), [modo, alternarTema]);

  return (
    <TemaContext.Provider value={valor}>
      <ThemeProvider theme={tema}>
        <GlobalStyle />
        {children}
      </ThemeProvider>
    </TemaContext.Provider>
  );
}

export function useTema() {
  const ctx = useContext(TemaContext);
  if (!ctx) {
    throw new Error('useTema precisa ser usado dentro de <TemaProvider>.');
  }
  return ctx;
}
