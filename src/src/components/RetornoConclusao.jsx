import styled from 'styled-components';

import { BarraProgresso } from './ui/BarraProgresso.jsx';
import { xpDaAtividade } from '../lib/gamificacao.js';

// T22 / RF15 — o retorno de ter concluído.
//
// É aqui que o Vértice mostra por que não é uma lista de tarefas: concluir
// não risca um item, move uma barra e credita experiência. Sem este bloco a
// pessoa conclui e não vê nada acontecer.
//
// O "antes" não vem de histórico guardado: é o mesmo conteúdo recalculado
// fingindo que esta atividade ainda não foi concluída (`progressoAntesDe`).
//
// Esta é a moldura da gamificação, e por isso usa o violeta — aqui ele é o
// que deve ser: raro e destacado. O anel de peso do cabeçalho continua ciano.

const Caixa = styled.aside`
  background: ${({ theme }) => theme.cores.gamificacaoSuave};
  border: 1.5px solid ${({ theme }) => theme.cores.gamificacaoBorda};
  border-radius: 12px;
  padding: 18px 20px;
  margin-bottom: ${({ theme }) => theme.espaco.lg};
`;

const Topo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Icone = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${({ theme }) => theme.cores.concluido};
  display: grid;
  place-items: center;
  flex: none;

  &::after {
    content: '';
    width: 15px;
    height: 8px;
    border-left: 3px solid ${({ theme }) => theme.cores.textoInverso};
    border-bottom: 3px solid ${({ theme }) => theme.cores.textoInverso};
    transform: rotate(-45deg) translate(2px, -2px);
  }
`;

const Texto = styled.div`
  min-width: 0;

  strong {
    display: block;
    font-size: 15.5px;
    font-weight: ${({ theme }) => theme.fonte.peso.extra};
    color: ${({ theme }) => theme.cores.textoForte};
    margin-bottom: 3px;
  }

  span {
    font-size: 13px;
    color: ${({ theme }) => theme.cores.textoSuave};
  }
`;

const Experiencia = styled.div`
  margin-left: auto;
  text-align: right;
  flex: none;

  strong {
    display: block;
    font-family: ${({ theme }) => theme.fonte.numero};
    font-size: 24px;
    font-weight: ${({ theme }) => theme.fonte.peso.extra};
    color: ${({ theme }) => theme.cores.gamificacao};
  }

  span {
    font-size: 10.5px;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.cores.gamificacao};
    font-weight: ${({ theme }) => theme.fonte.peso.forte};
    opacity: 0.85;
  }
`;

const AntesDepois = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;
  margin-top: 13px;
`;

const Metade = styled.div`
  flex: 1;
  min-width: 0;
`;

const Seta = styled.span`
  color: ${({ theme }) => theme.cores.textoSuave};
  flex: none;
`;

export function RetornoConclusao({ atividade, conteudo, antes, depois }) {
  const xp = xpDaAtividade(atividade);

  // O conteúdo pode ter sumido (link velho); sem ele não há barra a mostrar.
  const temBarras = Boolean(antes && depois);

  return (
    <Caixa>
      <Topo>
        <Icone aria-hidden="true" />
        <Texto>
          <strong>Atividade concluída</strong>
          <span>
            {conteudo
              ? `O progresso de ${conteudo.nome} subiu.`
              : 'O progresso do conteúdo subiu.'}
          </span>
        </Texto>
        {xp > 0 && (
          <Experiencia>
            <strong>+{xp}</strong>
            <span>XP</span>
          </Experiencia>
        )}
      </Topo>

      {temBarras && (
        <AntesDepois>
          <Metade>
            <BarraProgresso progresso={antes} rotulo="Antes" meta={false} />
          </Metade>
          <Seta aria-hidden="true">→</Seta>
          <Metade>
            <BarraProgresso progresso={depois} rotulo="Depois" meta={false} />
          </Metade>
        </AntesDepois>
      )}
    </Caixa>
  );
}
