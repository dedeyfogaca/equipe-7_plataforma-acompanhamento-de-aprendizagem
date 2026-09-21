import styled, { css } from 'styled-components';

// Botão do Design System, com variações e tamanhos. Os hovers ganham um
// "glow" (brilho) e uma leve elevação, que é a vibe das referências.
// Usa props transientes ($) para não vazarem como atributos no DOM.

const estilosVariante = {
  primario: css`
    background: ${({ theme }) => theme.cores.primaria};
    color: ${({ theme }) => theme.cores.textoInverso};
    box-shadow: 0 0 0 1px transparent;
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.cores.primaria};
      box-shadow: ${({ theme }) => theme.sombra.glowCiano};
      transform: translateY(-1px);
    }
  `,
  destaque: css`
    background: ${({ theme }) => theme.cores.destaque};
    color: ${({ theme }) => theme.cores.textoInverso};
    &:hover:not(:disabled) {
      box-shadow: ${({ theme }) => theme.sombra.glowDestaque};
      transform: translateY(-1px);
    }
  `,
  secundario: css`
    background: ${({ theme }) => theme.cores.superficieAlt};
    color: ${({ theme }) => theme.cores.texto};
    border-color: ${({ theme }) => theme.cores.bordaForte};
    &:hover:not(:disabled) {
      border-color: ${({ theme }) => theme.cores.primaria};
      color: ${({ theme }) => theme.cores.primaria};
      box-shadow: ${({ theme }) => theme.sombra.glowCiano};
      transform: translateY(-1px);
    }
  `,
  perigo: css`
    background: transparent;
    color: ${({ theme }) => theme.cores.perigo};
    border-color: ${({ theme }) => theme.cores.perigo};
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.cores.perigo};
      color: ${({ theme }) => theme.cores.textoInverso};
      box-shadow: 0 0 0 1px rgba(251, 113, 133, 0.5),
        0 10px 30px rgba(251, 113, 133, 0.22);
      transform: translateY(-1px);
    }
  `,
  fantasma: css`
    background: transparent;
    color: ${({ theme }) => theme.cores.textoSuave};
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.cores.superficieAlt};
      color: ${({ theme }) => theme.cores.texto};
    }
  `,
};

const estilosTamanho = {
  sm: css`
    padding: 6px 12px;
    font-size: ${({ theme }) => theme.fonte.tamanho.sm};
  `,
  md: css`
    padding: 10px 18px;
    font-size: ${({ theme }) => theme.fonte.tamanho.sm};
  `,
};

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.espaco.sm};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.raio.md};
  font-family: ${({ theme }) => theme.fonte.corpo};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  line-height: 1;
  text-align: center;
  transition: background 0.18s ease, color 0.18s ease, box-shadow 0.18s ease,
    border-color 0.18s ease, transform 0.18s ease;
  white-space: nowrap;
  width: ${({ $bloco }) => ($bloco ? '100%' : 'auto')};

  ${({ $tamanho = 'md' }) => estilosTamanho[$tamanho]}
  ${({ $variante = 'primario' }) => estilosVariante[$variante]}

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
