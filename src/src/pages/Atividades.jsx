import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

import { useAuth } from '../context/AuthContext.jsx';
import { useData } from '../context/DataContext.jsx';
import { useFeriados } from '../hooks/useFeriados.js';
import { Button, Card, EmptyState, Input, Label, PageHeader, Select } from '../components/ui';
import { AtividadeCard } from '../components/AtividadeCard.jsx';
import { FiltrosSituacao } from '../components/FiltrosSituacao.jsx';
import { Lateral } from '../components/layout/Lateral.jsx';
import { anoDaData, diasRestantes } from '../lib/datas.js';
import { contarPorSituacao, ehSituacaoValida, naSituacao, SITUACAO } from '../lib/situacoes.js';

// Lista de atividades. É onde o grupo passa mais tempo: filtra, encontra e
// clica para o detalhe.
//
// As situações ficam no topo, como botões: elas não são contadores, clicar
// filtra a lista. A situação escolhida vai para a URL, para o Painel poder
// mandar o grupo direto para "as atrasadas" e o endereço poder ser guardado.
//
// Os filtros finos (busca, responsável, prazo, ordem) vão para a coluna de
// contexto, à direita.

const PainelFiltros = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco.md};

  h2 {
    font-size: ${({ theme }) => theme.fonte.tamanho.sm};
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: ${({ theme }) => theme.cores.textoSuave};
  }
`;

const CampoFiltro = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Resultado = styled.p`
  color: ${({ theme }) => theme.cores.textoSuave};
  font-size: ${({ theme }) => theme.fonte.tamanho.sm};
  margin-bottom: ${({ theme }) => theme.espaco.md};
`;

// Lista em coluna, como o protótipo: linha é mais fácil de varrer que
// cartão em grade quando o que importa é prazo e situação.
const Lista = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
`;

const ORDENS = [
  { valor: 'prazo', rotulo: 'Prazo mais próximo' },
  { valor: 'recentes', rotulo: 'Mais recentes' },
  { valor: 'titulo', rotulo: 'Título (A-Z)' },
];

function ordenarPorPrazo(a, b) {
  if (!a.prazo && !b.prazo) return 0;
  if (!a.prazo) return 1;
  if (!b.prazo) return -1;
  return a.prazo.localeCompare(b.prazo);
}

export default function Atividades() {
  const { grupoAtivo } = useAuth();
  const { atividadesDoGrupo, membrosDoGrupo, conteudosDoGrupo, trilhaDaAtividade } = useData();

  const atividades = atividadesDoGrupo(grupoAtivo.id);
  const membros = membrosDoGrupo(grupoAtivo.id);
  const membroPorId = useMemo(() => {
    const mapa = {};
    membros.forEach((m) => {
      mapa[m.id] = m;
    });
    return mapa;
  }, [membros]);

  const anos = useMemo(() => {
    const conjunto = new Set([new Date().getFullYear()]);
    atividades.forEach((a) => {
      const ano = anoDaData(a.prazo);
      if (ano) conjunto.add(ano);
    });
    return Array.from(conjunto);
  }, [atividades]);
  const { feriadoEm } = useFeriados(anos);

  // Estado dos filtros.
  // A situação mora na URL: o Painel liga direto para "/atividades?situacao=
  // atrasadas", e o endereço filtrado pode ser guardado e compartilhado.
  const [params, setParams] = useSearchParams();
  const bruta = params.get('situacao');
  const situacao = ehSituacaoValida(bruta) ? bruta : SITUACAO.TODAS;

  const escolherSituacao = (valor) => {
    const proximos = new URLSearchParams(params);
    // Clicar na situação já ativa volta para "todas".
    if (valor === situacao || valor === SITUACAO.TODAS) proximos.delete('situacao');
    else proximos.set('situacao', valor);
    setParams(proximos, { replace: true });
  };

  const contagem = useMemo(() => contarPorSituacao(atividades), [atividades]);

  const [fResponsavel, setFResponsavel] = useState('todos');
  const [fPrazo, setFPrazo] = useState('todos');
  const [busca, setBusca] = useState('');
  const [ordem, setOrdem] = useState('prazo');

  const filtradas = useMemo(() => {
    let lista = [...atividades];

    lista = lista.filter((a) => naSituacao(a, situacao));

    if (fResponsavel !== 'todos') {
      lista = lista.filter((a) =>
        fResponsavel === 'sem' ? !a.responsavelId : a.responsavelId === fResponsavel
      );
    }

    const termo = busca.trim().toLowerCase();
    if (termo) {
      // A disciplina não está mais escrita na atividade: a busca sobe a
      // cadeia e casa também pelo nome do conteúdo.
      lista = lista.filter((a) => {
        const { conteudo, disciplina } = trilhaDaAtividade(a);
        return (
          a.titulo.toLowerCase().includes(termo) ||
          (disciplina?.nome || '').toLowerCase().includes(termo) ||
          (conteudo?.nome || '').toLowerCase().includes(termo)
        );
      });
    }

    // "Atrasadas" saiu daqui: virou situação, no topo da lista.
    if (fPrazo === 'semana') {
      lista = lista.filter((a) => {
        const dias = diasRestantes(a.prazo);
        return dias !== null && dias >= 0 && dias <= 7;
      });
    } else if (fPrazo === 'comprazo') {
      lista = lista.filter((a) => Boolean(a.prazo));
    } else if (fPrazo === 'semprazo') {
      lista = lista.filter((a) => !a.prazo);
    }

    if (ordem === 'prazo') {
      lista.sort(ordenarPorPrazo);
    } else if (ordem === 'recentes') {
      lista.sort((a, b) => (b.criadaEm || '').localeCompare(a.criadaEm || ''));
    } else if (ordem === 'titulo') {
      lista.sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt-BR'));
    }

    return lista;
  }, [atividades, situacao, fResponsavel, fPrazo, busca, ordem, trilhaDaAtividade]);

  const semAtividades = atividades.length === 0;
  const semConteudos = conteudosDoGrupo(grupoAtivo.id).length === 0;

  return (
    <>
      <PageHeader
        titulo="Atividades"
        subtitulo="Clique numa situação para filtrar."
        acoes={
          <Button as={Link} to="/atividade/nova">
            + Nova atividade
          </Button>
        }
      />

      {!semAtividades && (
        <FiltrosSituacao contagem={contagem} ativa={situacao} aoEscolher={escolherSituacao} />
      )}

      {!semAtividades && (
        <Lateral>
          <PainelFiltros>
            <h2>Filtros</h2>
            <CampoFiltro>
            <Label htmlFor="busca">Buscar</Label>
            <Input
              id="busca"
              type="search"
              placeholder="Título, disciplina ou conteúdo"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            </CampoFiltro>
            <CampoFiltro>
            <Label htmlFor="f-resp">Responsável</Label>
            <Select
              id="f-resp"
              value={fResponsavel}
              onChange={(e) => setFResponsavel(e.target.value)}
            >
              <option value="todos">Todos</option>
              {membros.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nome}
                </option>
              ))}
              <option value="sem">Sem responsável</option>
            </Select>
            </CampoFiltro>
            <CampoFiltro>
            <Label htmlFor="f-prazo">Prazo</Label>
            <Select
              id="f-prazo"
              value={fPrazo}
              onChange={(e) => setFPrazo(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="semana">Próximos 7 dias</option>
              <option value="comprazo">Com prazo definido</option>
              <option value="semprazo">Sem prazo</option>
            </Select>
            </CampoFiltro>
            <CampoFiltro>
            <Label htmlFor="f-ordem">Ordenar por</Label>
            <Select
              id="f-ordem"
              value={ordem}
              onChange={(e) => setOrdem(e.target.value)}
            >
              {ORDENS.map((o) => (
                <option key={o.valor} value={o.valor}>
                  {o.rotulo}
                </option>
              ))}
            </Select>
            </CampoFiltro>
          </PainelFiltros>
        </Lateral>
      )}

      {semAtividades ? (
        <Card>
          {/* T08 — o vazio orienta pela cadeia. Convidar a criar uma
              atividade antes de existir conteúdo só levaria a pessoa a um
              formulário que ela não consegue preencher. */}
          {semConteudos ? (
            <EmptyState
              icone="📚"
              titulo="Comece pelas disciplinas"
              descricao="No Vértice a atividade pertence a um conteúdo, e o conteúdo a uma disciplina. É essa cadeia que permite medir o quanto você avançou, em vez de só contar itens feitos."
            >
              <Button as={Link} to="/disciplinas">
                Cadastrar uma disciplina
              </Button>
            </EmptyState>
          ) : (
            <EmptyState
              icone="🗒️"
              titulo="Nenhuma atividade ainda"
              descricao="As disciplinas e os conteúdos já estão prontos. Agora é pendurar a primeira atividade num deles."
            >
              <Button as={Link} to="/atividade/nova">
                + Nova atividade
              </Button>
            </EmptyState>
          )}
        </Card>
      ) : filtradas.length === 0 ? (
        <Card>
          <EmptyState
            icone="🔍"
            titulo="Nada encontrado"
            descricao="Nenhuma atividade bate com os filtros escolhidos. Tente afrouxar a busca."
          />
        </Card>
      ) : (
        <>
          <Resultado>
            {filtradas.length}{' '}
            {filtradas.length === 1 ? 'atividade encontrada' : 'atividades encontradas'}
          </Resultado>
          <Lista>
            {filtradas.map((atividade) => (
              <AtividadeCard
                key={atividade.id}
                atividade={atividade}
                responsavel={membroPorId[atividade.responsavelId]}
                feriado={feriadoEm(atividade.prazo)}
              />
            ))}
          </Lista>
        </>
      )}
    </>
  );
}
