import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { useAuth } from '../context/AuthContext.jsx';
import { useData } from '../context/DataContext.jsx';
import { useFeriados } from '../hooks/useFeriados.js';
import { BarraProgresso, Button, Card, EmptyState, PageHeader, Spinner } from '../components/ui';
import { AtividadeCard } from '../components/AtividadeCard.jsx';
import { CalendarioMes } from '../components/CalendarioMes.jsx';
import { FiltrosSituacao } from '../components/FiltrosSituacao.jsx';
import { Lateral } from '../components/layout/Lateral.jsx';
import { STATUS } from '../lib/constants.js';
import { contarPorSituacao, situacaoDaAtividade } from '../lib/situacoes.js';
import { anoDaData, formatarData } from '../lib/datas.js';

// Painel / visão geral: o grupo bate o olho e entende como está.
// Quantas atividades em cada status, o que está vencendo e os próximos feriados.

const Bloco = styled.div`
  h2 {
    font-size: ${({ theme }) => theme.fonte.tamanho.xl};
    margin-bottom: ${({ theme }) => theme.espaco.md};
  }
`;

const CardsAtividade = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
`;

// T20 — o progresso de cada disciplina, na coluna de contexto. É o número
// que o Vértice existe para mostrar; ele tem de estar na primeira tela.
const BlocoLateral = styled.div`
  display: flex;
  flex-direction: column;
  gap: 13px;
`;

const TituloLateral = styled.h2`
  font-size: 10.5px;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.cores.textoSuave};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
`;

const AvisoLateral = styled.p`
  font-size: ${({ theme }) => theme.fonte.tamanho.xs};
  color: ${({ theme }) => theme.cores.textoSuave};
  text-align: center;
`;

const AvisoFeriado = styled(Card)`
  background: ${({ theme }) => theme.cores.alertaSuave};
  border-color: ${({ theme }) => theme.cores.alerta};
  padding: ${({ theme }) => theme.espaco.md} ${({ theme }) => theme.espaco.lg};
  margin-bottom: ${({ theme }) => theme.espaco.lg};
  font-size: ${({ theme }) => theme.fonte.tamanho.sm};

  h3 {
    font-size: ${({ theme }) => theme.fonte.tamanho.sm};
    margin-bottom: 6px;
  }

  a {
    color: ${({ theme }) => theme.cores.primariaForte};
    font-weight: ${({ theme }) => theme.fonte.peso.forte};
    text-decoration: underline;
  }

  li + li {
    margin-top: 4px;
  }
`;

export default function Painel() {
  const { grupoAtivo } = useAuth();
  const navigate = useNavigate();
  const { atividadesDoGrupo, membrosDoGrupo, disciplinasDoGrupo, progressoDaDisciplina } =
    useData();

  const atividades = atividadesDoGrupo(grupoAtivo.id);
  const membros = membrosDoGrupo(grupoAtivo.id);
  const disciplinas = disciplinasDoGrupo(grupoAtivo.id);
  const membroPorId = useMemo(() => {
    const mapa = {};
    membros.forEach((m) => {
      mapa[m.id] = m;
    });
    return mapa;
  }, [membros]);

  // Anos que precisamos consultar na BrasilAPI: o atual + os anos dos prazos.
  const anos = useMemo(() => {
    const conjunto = new Set([new Date().getFullYear()]);
    atividades.forEach((a) => {
      const ano = anoDaData(a.prazo);
      if (ano) conjunto.add(ano);
    });
    return Array.from(conjunto);
  }, [atividades]);

  const { feriados, carregando, erro, feriadoEm } = useFeriados(anos);

  // A contagem sai do mesmo módulo que a lista usa para filtrar, para os
  // dois números nunca discordarem.
  const contagem = useMemo(() => contarPorSituacao(atividades), [atividades]);

  // Próximas entregas: não concluídas, ordenadas por prazo (sem prazo no fim).
  const proximas = useMemo(() => {
    return atividades
      .filter((a) => a.status !== STATUS.CONCLUIDO)
      .sort((a, b) => {
        if (!a.prazo && !b.prazo) return 0;
        if (!a.prazo) return 1;
        if (!b.prazo) return -1;
        return a.prazo.localeCompare(b.prazo);
      })
      .slice(0, 6);
  }, [atividades]);

  // Prazos que o calendário marca com ponto.
  const prazos = useMemo(
    () =>
      atividades.map((a) => ({
        prazo: a.prazo,
        titulo: a.titulo,
        situacao: situacaoDaAtividade(a),
      })),
    [atividades]
  );

  // Cruzamento: atividades (não concluídas) cujo prazo cai num feriado.
  const atividadesEmFeriado = useMemo(() => {
    return atividades
      .filter((a) => a.status !== STATUS.CONCLUIDO && feriadoEm(a.prazo))
      .map((a) => ({ atividade: a, feriado: feriadoEm(a.prazo) }));
  }, [atividades, feriadoEm]);

  return (
    <>
      <PageHeader
        titulo="Painel"
        subtitulo={`${grupoAtivo.nome} · ${atividades.length} ${
          atividades.length === 1 ? 'atividade' : 'atividades'
        }`}
        acoes={
          <Button as={Link} to="/atividade/nova">
            + Nova atividade
          </Button>
        }
      />

      {/* Mesma peça da lista de Atividades: clicar leva para lá, já
          filtrado por aquela situação. */}
      <FiltrosSituacao
        contagem={contagem}
        aoEscolher={(valor) => navigate(`/atividades?situacao=${valor}`)}
      />

      {atividadesEmFeriado.length > 0 && (
        <AvisoFeriado as="aside">
          <h3>⚠️ Atenção aos feriados</h3>
          <ul>
            {atividadesEmFeriado.map(({ atividade, feriado }) => (
              <li key={atividade.id}>
                <Link to={`/atividade/${atividade.id}`}>{atividade.titulo}</Link> vence em{' '}
                {formatarData(atividade.prazo)}, feriado de {feriado.name}.
              </li>
            ))}
          </ul>
        </AvisoFeriado>
      )}

      {/* O calendário é o contexto do Painel: o feriado vira ponto no dia,
          em vez de uma lista de datas à parte. */}
      <Lateral>
        <CalendarioMes feriadoEm={feriadoEm} prazos={prazos} />

        {disciplinas.length > 0 && (
          <BlocoLateral>
            <TituloLateral>Progresso por disciplina</TituloLateral>
            {disciplinas.map((disciplina) => (
              <BarraProgresso
                key={disciplina.id}
                rotulo={disciplina.nome}
                progresso={progressoDaDisciplina(disciplina.id)}
              />
            ))}
          </BlocoLateral>
        )}

        {carregando && <Spinner $tamanho={24} />}
        {!carregando && erro && (
          <AvisoLateral>Não foi possível carregar os feriados agora.</AvisoLateral>
        )}
      </Lateral>

      <Bloco>
          <h2>Próximas entregas</h2>
          {proximas.length === 0 ? (
            <Card>
              <EmptyState
                icone="🎉"
                titulo="Nada pendente por aqui"
                descricao="Todas as atividades estão concluídas ou ainda não há atividades cadastradas."
              >
                <Button as={Link} to="/atividade/nova" $variante="secundario">
                  Criar uma atividade
                </Button>
              </EmptyState>
            </Card>
          ) : (
            <CardsAtividade>
              {proximas.map((atividade) => (
                <AtividadeCard
                  key={atividade.id}
                  atividade={atividade}
                  responsavel={membroPorId[atividade.responsavelId]}
                  feriado={feriadoEm(atividade.prazo)}
                />
              ))}
            </CardsAtividade>
          )}
      </Bloco>
    </>
  );
}
