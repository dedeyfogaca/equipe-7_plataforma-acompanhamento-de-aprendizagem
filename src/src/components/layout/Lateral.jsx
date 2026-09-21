import { createContext, useContext, useState } from 'react';
import { createPortal } from 'react-dom';

// A coluna da direita é da página, não do layout.
//
// O layout desenha a caixa (312px) e a registra aqui; cada página manda o
// conteúdo dela para dentro por portal — calendário no Painel, filtros nas
// Atividades. Assim o layout não precisa saber que páginas existem, e uma
// página que não tem contexto a oferecer simplesmente não usa nada.
//
// É portal, e não estado com o nó em JSX, porque um elemento JSX muda de
// identidade a cada render: guardá-lo em estado daria laço infinito.

const LateralContext = createContext(null);

export function LateralProvider({ children }) {
  const [caixa, setCaixa] = useState(null);
  return (
    <LateralContext.Provider value={{ caixa, registrar: setCaixa }}>
      {children}
    </LateralContext.Provider>
  );
}

/** Usado pelo layout: é a caixa que recebe o conteúdo das páginas. */
export function useRegistrarLateral() {
  const ctx = useContext(LateralContext);
  return ctx?.registrar ?? (() => {});
}

/** Usado pelas páginas: manda os filhos para a coluna da direita. */
export function Lateral({ children }) {
  const ctx = useContext(LateralContext);
  if (!ctx?.caixa) return null;
  return createPortal(children, ctx.caixa);
}
