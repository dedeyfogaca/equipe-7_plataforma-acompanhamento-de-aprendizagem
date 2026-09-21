import { createGlobalStyle } from 'styled-components';

// Estilos globais: reset enxuto + tema escuro + tipografia.
// box-sizing: border-box deixa o Box Model previsível (padding/borda entram
// dentro da largura). color-scheme: dark faz os controles nativos (date, select,
// scrollbar) já virem escuros.
export const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    -webkit-text-size-adjust: 100%;
    color-scheme: ${({ theme }) => theme.esquema};
  }

  body {
    font-family: ${({ theme }) => theme.fonte.corpo};
    font-size: ${({ theme }) => theme.fonte.tamanho.md};
    line-height: 1.6;
    color: ${({ theme }) => theme.cores.texto};
    background-color: ${({ theme }) => theme.cores.fundo};
    /* Halo de luz sutil no topo, para o fundo não ficar chapado. */
    background-image: radial-gradient(
      1200px 600px at 50% -15%,
      ${({ theme }) =>
        theme.esquema === 'dark'
          ? 'rgba(34, 211, 238, 0.07)'
          : 'rgba(8, 145, 178, 0.06)'},
      transparent 60%
    );
    background-attachment: fixed;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    min-height: 100vh;
  }

  #root {
    min-height: 100vh;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonte.display};
    font-weight: ${({ theme }) => theme.fonte.peso.negrito};
    line-height: 1.15;
    /* Manrope é geométrica: em tamanho grande pede tracking negativo, ao
       contrário da serifada que saiu daqui. */
    letter-spacing: -0.02em;
    color: ${({ theme }) => theme.cores.textoForte};
  }

  a {
    color: inherit;
    text-decoration: none;
    transition: color 0.15s ease;
  }

  button {
    cursor: pointer;
  }

  input, textarea, select, button {
    font-family: inherit;
    font-size: inherit;
  }

  img {
    max-width: 100%;
    display: block;
  }

  ul, ol {
    list-style: none;
  }

  ::selection {
    background: ${({ theme }) => theme.cores.primaria};
    color: ${({ theme }) => theme.cores.textoInverso};
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.cores.primaria};
    outline-offset: 2px;
  }

  /* Barra de rolagem combinando com o tema escuro. */
  * {
    scrollbar-width: thin;
    scrollbar-color: ${({ theme }) => theme.cores.bordaForte} transparent;
  }
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.cores.fundoAlt};
  }
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.cores.bordaForte};
    border-radius: ${({ theme }) => theme.raio.full};
    border: 2px solid ${({ theme }) => theme.cores.fundoAlt};
  }
  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.cores.primariaForte};
  }
`;
