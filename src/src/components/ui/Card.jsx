import styled, { css } from 'styled-components';

// Superfície base de conteúdo. O Box Model aparece bem aqui: borda + padding
// + raio + sombra. Com $interativo, ganha o brilho ciano no hover.
export const Card = styled.div`
  background: ${({ theme }) => theme.cores.superficie};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: ${({ theme }) => theme.raio.lg};
  padding: ${({ theme }) => theme.espaco.xl};
  box-shadow: ${({ theme }) => theme.sombra.sm};
  transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;

  ${({ $interativo }) =>
    $interativo &&
    css`
      cursor: pointer;
      &:hover {
        border-color: ${({ theme }) => theme.cores.primaria};
        box-shadow: ${({ theme }) => theme.sombra.glowCiano};
        transform: translateY(-2px);
      }
    `}
`;
