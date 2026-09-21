import styled, { css } from 'styled-components';

// Selo colorido reutilizável, com cara de "etiqueta de dados": monoespaçado,
// em maiúsculas e com uma borda fininha na cor do tom. É a base do badge de
// status e do de prioridade.

const tons = {
  neutro: css`
    background: ${({ theme }) => theme.cores.aFazerSuave};
    color: ${({ theme }) => theme.cores.aFazer};
  `,
  alerta: css`
    background: ${({ theme }) => theme.cores.alertaSuave};
    color: ${({ theme }) => theme.cores.alerta};
  `,
  perigo: css`
    background: ${({ theme }) => theme.cores.perigoSuave};
    color: ${({ theme }) => theme.cores.perigo};
  `,
  sucesso: css`
    background: ${({ theme }) => theme.cores.concluidoSuave};
    color: ${({ theme }) => theme.cores.concluido};
  `,
  info: css`
    background: ${({ theme }) => theme.cores.infoSuave};
    color: ${({ theme }) => theme.cores.info};
  `,
  primaria: css`
    background: ${({ theme }) => theme.cores.primariaSuave};
    color: ${({ theme }) => theme.cores.primaria};
  `,
  destaque: css`
    background: ${({ theme }) => theme.cores.destaqueSuave};
    color: ${({ theme }) => theme.cores.destaque};
  `,
};

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  border-radius: ${({ theme }) => theme.raio.full};
  border: 1px solid color-mix(in srgb, currentColor 35%, transparent);
  font-size: ${({ theme }) => theme.fonte.tamanho.xs};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
  ${({ $tom = 'neutro' }) => tons[$tom]}
`;
