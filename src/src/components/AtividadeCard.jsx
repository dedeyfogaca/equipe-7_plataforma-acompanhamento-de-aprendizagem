import { Link, useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { Avatar } from './ui/Avatar.jsx';
import { AnelPeso } from './AnelPeso.jsx';
import { useData } from '../context/DataContext.jsx';
import { PRIORIDADE, STATUS, rotuloPrioridade } from '../lib/constants.js';
import { ehFimDeSemana, formatarData, rotuloPrazo } from '../lib/datas.js';
import { SITUACAO, situacaoDaAtividade } from '../lib/situacoes.js';

// T24 — cartão de atividade, no desenho do protótipo.
//
// Três colunas: a pilha (check de concluído e, sob ele, o anel de peso), o
// corpo (título e trilha) e o lado (prazo, prioridade e responsável).
//
// O status não tem selo: ele é a cor da barra à esquerda. Atrasada ganha a
// barra vermelha mesmo estando "a fazer" ou "fazendo", porque atraso é
// cruzamento de prazo com status (RN05), não um status à parte.

// A barra da esquerda segue a situação. A ordem de precedência mora em
// `situacoes.js`, para o cartão e o calendário não discordarem.
function corDaSituacao(theme, atividade) {
  return (
    {
      [SITUACAO.CONCLUIDAS]: theme.cores.concluido,
      [SITUACAO.ATRASADAS]: theme.cores.perigo,
      [SITUACAO.FAZENDO]: theme.cores.fazendo,
      [SITUACAO.A_FAZER]: theme.cores.aFazer,
    }[situacaoDaAtividade(atividade)] || theme.cores.aFazer
  );
}

const Artigo = styled.article`
  background: ${({ theme }) => theme.cores.superficie};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-left: 3px solid ${({ $atividade, theme }) => corDaSituacao(theme, $atividade)};
  border-radius: 11px;
  padding: 13px 15px;
  display: flex;
  gap: 13px;
  align-items: flex-start;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.sombra.md};
  }
`;

const Pilha = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  flex: none;
`;

// Quadrado arredondado, não círculo — é como o protótipo desenha.
const Check = styled.button`
  width: 19px;
  height: 19px;
  border-radius: 6px;
  border: 1.8px solid ${({ theme }) => theme.cores.bordaForte};
  background: transparent;
  flex: none;
  display: grid;
  place-items: center;
  transition: background 0.15s ease, border-color 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.cores.concluido};
  }

  ${({ $marcado, theme }) =>
    $marcado &&
    css`
      background: ${theme.cores.concluido};
      border-color: ${theme.cores.concluido};

      /* O tique é desenhado com duas bordas, como no protótipo. */
      &::after {
        content: '';
        width: 9px;
        height: 5px;
        border-left: 2px solid ${theme.cores.textoInverso};
        border-bottom: 2px solid ${theme.cores.textoInverso};
        transform: rotate(-45deg) translate(1px, -1px);
      }
    `}
`;

const Corpo = styled.div`
  flex: 1;
  min-width: 0;
`;

const Titulo = styled.h3`
  font-size: 14.5px;
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
  color: ${({ theme }) => theme.cores.textoForte};
  letter-spacing: 0;
  margin-bottom: 5px;

  a:hover {
    color: ${({ theme }) => theme.cores.primaria};
  }

  ${({ $concluida, theme }) =>
    $concluida &&
    css`
      color: ${theme.cores.textoSuave};
      text-decoration: line-through;
    `}
`;

// Disciplina › conteúdo. É o caminho da atividade na cadeia.
const Trilha = styled.p`
  font-size: 11.5px;
  color: ${({ theme }) => theme.cores.textoSuave};
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 0;

  b {
    font-weight: ${({ theme }) => theme.fonte.peso.forte};
    color: ${({ theme }) => theme.cores.texto};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const Aviso = styled.p`
  font-size: 11.5px;
  color: ${({ theme }) => theme.cores.alerta};
  margin-top: 5px;
`;

const Lado = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  flex: none;
`;

const Prazo = styled.span`
  font-size: 11.5px;
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
  white-space: nowrap;
  font-family: ${({ theme }) => theme.fonte.numero};
  color: ${({ $tom, theme }) =>
    ({
      perigo: theme.cores.perigo,
      alerta: theme.cores.fazendo,
    })[$tom] || theme.cores.textoSuave};
`;

const Selos = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Selo = styled.span`
  font-size: 10px;
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
  padding: 3px 7px;
  border-radius: 5px;
  letter-spacing: 0.03em;
  white-space: nowrap;
  background: ${({ $prioridade, theme }) =>
    ({
      [PRIORIDADE.ALTA]: theme.cores.perigoSuave,
      [PRIORIDADE.MEDIA]: theme.cores.fazendoSuave,
      [PRIORIDADE.BAIXA]: theme.cores.concluidoSuave,
    })[$prioridade]};
  color: ${({ $prioridade, theme }) =>
    ({
      [PRIORIDADE.ALTA]: theme.cores.perigo,
      [PRIORIDADE.MEDIA]: theme.cores.fazendo,
      [PRIORIDADE.BAIXA]: theme.cores.concluido,
    })[$prioridade]};
`;

export function AtividadeCard({ atividade, responsavel, feriado }) {
  const { atualizarAtividade, trilhaDaAtividade } = useData();
  const { conteudo, disciplina } = trilhaDaAtividade(atividade);
  const navigate = useNavigate();

  const concluida = atividade.status === STATUS.CONCLUIDO;
  const prazo = rotuloPrazo(atividade.prazo);
  const tomPrazo = concluida ? 'neutro' : prazo.tom;
  const fimDeSemana = ehFimDeSemana(atividade.prazo);
  const destino = `/atividade/${atividade.id}`;

  // RN04 — desmarcar devolve para "a fazer". A experiência acompanha
  // sozinha, porque é derivada do status (RN10).
  const alternarConclusao = (evento) => {
    evento.stopPropagation();
    atualizarAtividade(atividade.id, {
      status: concluida ? STATUS.A_FAZER : STATUS.CONCLUIDO,
    });
  };

  return (
    <Artigo $atividade={atividade} onClick={() => navigate(destino)}>
      <Pilha>
        <Check
          type="button"
          $marcado={concluida}
          aria-pressed={concluida}
          aria-label={
            concluida
              ? `Desmarcar ${atividade.titulo} como concluída`
              : `Marcar ${atividade.titulo} como concluída`
          }
          title={concluida ? 'Desmarcar como concluída' : 'Marcar como concluída'}
          onClick={alternarConclusao}
        />
        <AnelPeso peso={atividade.peso} />
      </Pilha>

      <Corpo>
        {/* O cartão inteiro navega no clique; o título continua sendo um
            link de verdade, para quem usa teclado ou leitor de tela. */}
        <Titulo $concluida={concluida}>
          <Link to={destino} onClick={(e) => e.stopPropagation()}>
            {atividade.titulo}
          </Link>
        </Titulo>
        {disciplina && (
          <Trilha>
            {disciplina.nome}
            <span aria-hidden="true">›</span>
            <b>{conteudo?.nome}</b>
          </Trilha>
        )}
        {!concluida && feriado && <Aviso>📅 Prazo em feriado: {feriado.name}</Aviso>}
        {!concluida && !feriado && fimDeSemana && (
          <Aviso>📅 Esse prazo cai num fim de semana</Aviso>
        )}
      </Corpo>

      <Lado>
        <Prazo $tom={tomPrazo}>
          {atividade.prazo ? formatarData(atividade.prazo) : 'Sem prazo'}
        </Prazo>
        <Selos>
          {atividade.prioridade && (
            <Selo $prioridade={atividade.prioridade}>
              {rotuloPrioridade(atividade.prioridade)}
            </Selo>
          )}
          <Avatar
            seed={responsavel?.avatar}
            nome={responsavel?.nome || 'Sem responsável'}
            tamanho={24}
          />
        </Selos>
      </Lado>
    </Artigo>
  );
}
