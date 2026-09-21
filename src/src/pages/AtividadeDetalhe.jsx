import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { useAuth } from '../context/AuthContext.jsx';
import { useData } from '../context/DataContext.jsx';
import { useFeriados } from '../hooks/useFeriados.js';
import {
  Avatar,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Select,
} from '../components/ui';
import { PrioridadeBadge, StatusBadge } from '../components/Badges.jsx';
import { AnelPeso } from '../components/AnelPeso.jsx';
import { SeloXp } from '../components/SeloXp.jsx';
import { RetornoConclusao } from '../components/RetornoConclusao.jsx';
import { normalizarPeso, PESO, STATUS, STATUS_OPCOES } from '../lib/constants.js';
import { xpPotencial } from '../lib/gamificacao.js';
import {
  anoDaData,
  ehFimDeSemana,
  formatarDataExtensa,
  rotuloPrazo,
} from '../lib/datas.js';

// Detalhe da atividade (rota dinâmica /atividade/:id). Mostra tudo da atividade e
// permite mudar o status rapidamente, editar ou excluir.

// Cor do texto do prazo conforme o setor (verde/amarelo/vermelho).
function corDoTom(theme, tom) {
  return (
    {
      neutro: theme.cores.textoSuave,
      sucesso: theme.cores.sucesso,
      alerta: theme.cores.alerta,
      perigo: theme.cores.perigo,
    }[tom] || theme.cores.textoSuave
  );
}

const Voltar = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.cores.textoSuave};
  font-size: ${({ theme }) => theme.fonte.tamanho.sm};
  margin-bottom: ${({ theme }) => theme.espaco.lg};

  &:hover {
    color: ${({ theme }) => theme.cores.primaria};
  }
`;

const Observacao = styled.span`
  color: ${({ theme }) => theme.cores.textoSuave};
  font-size: ${({ theme }) => theme.fonte.tamanho.sm};
`;

const ComAnel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.espaco.sm};
`;

const Cabecalho = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.espaco.lg};
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.espaco.md};
`;

const Titulo = styled.h1`
  font-weight: ${({ theme }) => theme.fonte.peso.negrito};
  font-size: ${({ theme }) => theme.fonte.tamanho.xxl};
`;

const Badges = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.espaco.sm};
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.espaco.xl};
`;

const Colunas = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: ${({ theme }) => theme.espaco.xl};
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const Descricao = styled.p`
  white-space: pre-wrap;
  line-height: 1.7;
  color: ${({ theme }) => theme.cores.texto};
`;

const SemDescricao = styled.p`
  color: ${({ theme }) => theme.cores.textoSuave};
  font-style: italic;
`;

const Lateral = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco.lg};
`;

const Dado = styled.dl`
  display: flex;
  flex-direction: column;
  gap: 4px;

  dt {
    font-size: ${({ theme }) => theme.fonte.tamanho.xs};
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: ${({ theme }) => theme.cores.textoSuave};
  }

  dd {
    font-weight: ${({ theme }) => theme.fonte.peso.medio};
  }
`;

const Responsavel = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.espaco.sm};
`;

const AvisoPrazo = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.fonte.tamanho.sm};
  color: ${({ theme, $tom }) =>
    $tom ? corDoTom(theme, $tom) : theme.cores.alerta};
  margin-top: 2px;
`;

const Acoes = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.espaco.sm};
`;

export default function AtividadeDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { grupoAtivo } = useAuth();
  const {
    obterAtividade,
    atualizarAtividade,
    removerAtividade,
    membrosDoGrupo,
    trilhaDaAtividade,
    progressoDoConteudo,
    progressoAntesDe,
  } = useData();

  const atividade = obterAtividade(id);
  const membros = membrosDoGrupo(grupoAtivo.id);
  const responsavel = useMemo(
    () => membros.find((m) => m.id === atividade?.responsavelId) || null,
    [membros, atividade]
  );

  const anos = useMemo(
    () => Array.from(new Set([new Date().getFullYear(), anoDaData(atividade?.prazo)].filter(Boolean))),
    [atividade]
  );
  const { feriadoEm } = useFeriados(anos);

  const [confirmando, setConfirmando] = useState(false);

  // Atividade inexistente (link velho, id errado).
  if (!atividade) {
    return (
      <Card>
        <EmptyState
          icone="❓"
          titulo="Atividade não encontrada"
          descricao="Essa atividade não existe mais ou o endereço está errado."
        >
          <Button as={Link} to="/atividades">
            Voltar para as atividades
          </Button>
        </EmptyState>
      </Card>
    );
  }

  const { conteudo, disciplina } = trilhaDaAtividade(atividade);

  // RF15 — o que a conclusão desta atividade fez com o conteúdo.
  const concluida = atividade.status === STATUS.CONCLUIDO;
  const depois = concluida ? progressoDoConteudo(atividade.conteudoId) : null;
  const antes = concluida ? progressoAntesDe(atividade) : null;
  const prazo = rotuloPrazo(atividade.prazo);
  const feriado = feriadoEm(atividade.prazo);
  const fimDeSemana = ehFimDeSemana(atividade.prazo);

  const excluir = () => {
    removerAtividade(atividade.id);
    navigate('/atividades');
  };

  return (
    <>
      <Voltar to="/atividades">← Voltar para as atividades</Voltar>

      {/* T22 — concluir não risca um item: move a barra e credita
          experiência. Sem isto a pessoa conclui e não vê nada acontecer. */}
      {concluida && (
        <RetornoConclusao
          atividade={atividade}
          conteudo={conteudo}
          antes={antes}
          depois={depois}
        />
      )}

      <Cabecalho>
        <Titulo>{atividade.titulo}</Titulo>
        <Acoes>
          <Button as={Link} to={`/atividade/${atividade.id}/editar`} $variante="secundario">
            Editar
          </Button>
          <Button
            type="button"
            $variante="perigo"
            onClick={() => setConfirmando(true)}
          >
            Excluir
          </Button>
        </Acoes>
      </Cabecalho>

      <Badges>
        <StatusBadge status={atividade.status} />
        <PrioridadeBadge prioridade={atividade.prioridade} />
      </Badges>

      <Colunas>
        <Card as="section">
          <h2 style={{ fontSize: '1rem', marginBottom: 8 }}>Descrição</h2>
          {atividade.descricao ? (
            <Descricao>{atividade.descricao}</Descricao>
          ) : (
            <SemDescricao>Sem descrição.</SemDescricao>
          )}
        </Card>

        <Lateral as="aside">
          <Dado>
            <dt>Status</dt>
            <dd>
              <Select
                aria-label="Mudar status"
                value={atividade.status}
                onChange={(e) => atualizarAtividade(atividade.id, { status: e.target.value })}
              >
                {STATUS_OPCOES.map((o) => (
                  <option key={o.valor} value={o.valor}>
                    {o.rotulo}
                  </option>
                ))}
              </Select>
            </dd>
          </Dado>

          <Dado>
            <dt>Responsável</dt>
            <dd>
              <Responsavel>
                <Avatar seed={responsavel?.avatar} nome={responsavel?.nome} tamanho={32} />
                <span>{responsavel?.nome || 'Sem responsável'}</span>
              </Responsavel>
            </dd>
          </Dado>

          {disciplina && (
            <Dado>
              <dt>Disciplina</dt>
              <dd>
                <Link to={`/disciplina/${disciplina.id}`}>{disciplina.nome}</Link>
              </dd>
            </Dado>
          )}

          {conteudo && (
            <Dado>
              <dt>Conteúdo</dt>
              <dd>{conteudo.nome}</dd>
            </Dado>
          )}

          {/* RN09 — o peso é o que a atividade vale no progresso do conteúdo. */}
          <Dado>
            <dt>Peso</dt>
            <dd>
              <ComAnel>
                <AnelPeso peso={atividade.peso} />
                <span>{`${normalizarPeso(atividade.peso)} de ${PESO.MAXIMO}`}</span>
              </ComAnel>
            </dd>
          </Dado>

          {/* RN10 — xp = peso x 10, para o responsável, enquanto concluída. */}
          <Dado>
            <dt>Experiência</dt>
            <dd>
              {!atividade.responsavelId ? (
                <Observacao>Sem responsável — não gera experiência.</Observacao>
              ) : (
                <ComAnel>
                  <SeloXp xp={xpPotencial(atividade)} />
                  <Observacao>
                    {atividade.status === STATUS.CONCLUIDO
                      ? `creditados a ${responsavel?.nome ?? 'quem é responsável'}`
                      : 'ao concluir'}
                  </Observacao>
                </ComAnel>
              )}
            </dd>
          </Dado>

          <Dado>
            <dt>Prazo</dt>
            <dd>
              {formatarDataExtensa(atividade.prazo)}
              {atividade.prazo && (
                <AvisoPrazo as="span" $tom={prazo.tom}>
                  ● {prazo.texto}
                </AvisoPrazo>
              )}
              {feriado && <AvisoPrazo>📅 Feriado: {feriado.name}</AvisoPrazo>}
              {!feriado && fimDeSemana && (
                <AvisoPrazo>📅 Cai num fim de semana</AvisoPrazo>
              )}
            </dd>
          </Dado>
        </Lateral>
      </Colunas>

      <ConfirmDialog
        aberto={confirmando}
        titulo="Excluir atividade?"
        mensagem={`A atividade "${atividade.titulo}" será removida permanentemente. Essa ação não pode ser desfeita.`}
        textoConfirmar="Excluir"
        perigo
        onConfirmar={excluir}
        onCancelar={() => setConfirmando(false)}
      />
    </>
  );
}
