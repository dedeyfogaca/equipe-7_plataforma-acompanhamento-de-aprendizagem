import styled from 'styled-components';

// Selo de experiência (RN10).
//
// Usa a cor da gamificação — a mesma do anel de peso, e de mais nada no
// sistema. Antes de existir esse violeta, a experiência dividia o verde de
// "concluída" e as duas coisas se confundiam: uma é o estado da atividade,
// a outra é o que ela rendeu a quem a fez.

const Selo = styled.span`
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.raio.full};
  background: ${({ theme }) => theme.cores.gamificacaoSuave};
  color: ${({ theme }) => theme.cores.gamificacao};
  font-family: ${({ theme }) => theme.fonte.numero};
  font-size: ${({ theme }) => theme.fonte.tamanho.xs};
  font-weight: ${({ theme }) => theme.fonte.peso.negrito};
  white-space: nowrap;
`;

const Unidade = styled.span`
  font-weight: ${({ theme }) => theme.fonte.peso.normal};
  opacity: 0.85;
`;

export function SeloXp({ xp, title }) {
  return (
    <Selo title={title ?? `${xp} pontos de experiência`}>
      {xp}
      <Unidade>XP</Unidade>
    </Selo>
  );
}
