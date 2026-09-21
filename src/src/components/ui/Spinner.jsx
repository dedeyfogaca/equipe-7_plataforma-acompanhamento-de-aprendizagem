import styled, { keyframes } from 'styled-components';

const girar = keyframes`
  to { transform: rotate(360deg); }
`;

// Indicador de carregamento (usado enquanto a BrasilAPI responde).
export const Spinner = styled.div`
  width: ${({ $tamanho = 20 }) => $tamanho}px;
  height: ${({ $tamanho = 20 }) => $tamanho}px;
  border: 2px solid ${({ theme }) => theme.cores.borda};
  border-top-color: ${({ theme }) => theme.cores.primaria};
  border-radius: 50%;
  animation: ${girar} 0.7s linear infinite;
`;
