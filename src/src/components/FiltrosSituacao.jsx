import styled from 'styled-components';

import { SITUACAO_OPCOES } from '../lib/situacoes.js';

// T24 — as quatro situações, no desenho do protótipo.
//
// "A fazer", "Fazendo", "Concluídas" e "Atrasadas" não são contadores:
// clicar filtra a lista. Por isso são botões, e não texto.
//
// É um componente só, usado no Painel e na lista de Atividades. No protótipo
// as duas telas mostram exatamente a mesma peça — se cada uma tivesse a sua,
// elas divergiriam na primeira mudança.

const Grade = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 9px;
  margin-bottom: 22px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

function corDoTom(theme, tom) {
  return (
    {
      afazer: theme.cores.aFazer,
      fazendo: theme.cores.fazendo,
      concluido: theme.cores.concluido,
      atrasada: theme.cores.perigo,
    }[tom] || theme.cores.borda
  );
}

// A faixa colorida no topo é o que identifica a situação de relance.
const Filtro = styled.button`
  background: ${({ $ativo, theme }) =>
    $ativo ? theme.cores.superficieAlt : theme.cores.superficie};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-top: 2.5px solid ${({ $tom, theme }) => corDoTom(theme, $tom)};
  border-radius: 11px;
  padding: 12px 13px;
  text-align: left;
  position: relative;
  transition: box-shadow 0.15s ease, background 0.15s ease;

  ${({ $ativo, theme }) =>
    $ativo && `box-shadow: inset 0 0 0 1.5px ${theme.cores.primaria};`}

  &:hover {
    background: ${({ theme }) => theme.cores.superficieAlt};
  }
`;

const Quantidade = styled.span`
  display: block;
  font-family: ${({ theme }) => theme.fonte.numero};
  font-size: 23px;
  font-weight: ${({ theme }) => theme.fonte.peso.extra};
  line-height: 1;
  color: ${({ theme }) => theme.cores.textoForte};
`;

const Rotulo = styled.span`
  display: block;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
  color: ${({ $ativo, theme }) =>
    $ativo ? theme.cores.primariaForte : theme.cores.textoSuave};
  margin-top: 6px;
`;

export function FiltrosSituacao({ contagem, ativa, aoEscolher }) {
  return (
    <Grade role="group" aria-label="Filtrar por situação">
      {SITUACAO_OPCOES.map(({ valor, rotulo, tom }) => {
        const ativo = ativa === valor;
        return (
          <Filtro
            key={valor}
            type="button"
            $ativo={ativo}
            $tom={tom}
            aria-pressed={ativo}
            title={`Ver as atividades em "${rotulo.toLowerCase()}"`}
            onClick={() => aoEscolher(valor)}
          >
            <Quantidade>{contagem[valor]}</Quantidade>
            <Rotulo $ativo={ativo}>{rotulo}</Rotulo>
          </Filtro>
        );
      })}
    </Grade>
  );
}
