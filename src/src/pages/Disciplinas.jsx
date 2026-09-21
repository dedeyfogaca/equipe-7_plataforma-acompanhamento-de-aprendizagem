import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { useAuth } from '../context/AuthContext.jsx';
import { useData } from '../context/DataContext.jsx';
import {
  BarraProgresso,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Field,
  Input,
  Label,
  PageHeader,
} from '../components/ui';
import { SomenteOrganizador } from '../components/SomenteOrganizador.jsx';
import { CORES_DISCIPLINA, sugerirCorDisciplina } from '../lib/constants.js';
import { semErros, validarDisciplina } from '../lib/validacao.js';

// T06 — tela de disciplinas.
// A disciplina é o topo da hierarquia do Vértice: disciplina -> conteúdo ->
// atividade. Sem ela não dá para calcular progresso (RN08/RN14), porque é ela
// que agrega os pesos dos conteúdos.
//
// Só o organizador deveria gerenciar disciplinas (RN07), mas `membro.perfil`
// ainda não existe no modelo salvo — a checagem entra junto com a migração.

const Colunas = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: ${({ theme }) => theme.espaco.xl};
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const Formulario = styled(Card).attrs({ as: 'form' })`
  position: sticky;
  top: calc(${({ theme }) => theme.layout.alturaHeader} + ${({ theme }) => theme.espaco.lg});

  h2 {
    font-size: ${({ theme }) => theme.fonte.tamanho.lg};
    margin-bottom: ${({ theme }) => theme.espaco.lg};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    position: static;
  }
`;

const BlocoCor = styled.div`
  margin-bottom: ${({ theme }) => theme.espaco.lg};
`;

const Paleta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.espaco.sm};
`;

const Amostra = styled.button`
  width: 30px;
  height: 30px;
  border-radius: ${({ theme }) => theme.raio.full};
  background: ${({ $cor }) => $cor};
  border: 2px solid transparent;
  box-shadow: 0 0 0 2px ${({ theme }) => theme.cores.superficie},
    0 0 0 3px ${({ $ativa, $cor, theme }) => ($ativa ? $cor : theme.cores.borda)};
  transition: transform 0.15s ease;

  &:hover {
    transform: scale(1.08);
  }
`;

const Lista = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco.md};
`;

// A disciplina é um cartão fechado: cabeçalho, barra e, dentro dele, os
// conteúdos. Ver a estrutura inteira de uma vez é o ponto da tela.
const ItemDisciplina = styled.li`
  background: ${({ theme }) => theme.cores.superficie};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-left: 3px solid ${({ $cor }) => $cor};
  border-radius: 12px;
  overflow: hidden;
`;

const TopoDisciplina = styled.div`
  padding: 15px 18px;
  display: flex;
  align-items: center;
  gap: 14px;
`;

const BarraDisciplina = styled.div`
  padding: 0 18px 14px;
`;

const Conteudos = styled.ul`
  border-top: 1px solid ${({ theme }) => theme.cores.borda};
  background: ${({ theme }) => theme.cores.superficieAlt};
  list-style: none;
`;

const ItemConteudo = styled.li`
  padding: 11px 18px 11px 34px;
  display: flex;
  align-items: center;
  gap: 13px;
  border-bottom: 1px solid ${({ theme }) => theme.cores.borda};

  &:last-child {
    border-bottom: none;
  }
`;

const NomeConteudo = styled.span`
  font-size: 13.5px;
  color: ${({ theme }) => theme.cores.texto};
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const QuantidadeConteudo = styled.span`
  font-size: 11.5px;
  color: ${({ theme }) => theme.cores.textoSuave};
  flex: none;
`;

const MiniBarra = styled.div`
  width: 74px;
  flex: none;
`;

const Ponto = styled.span`
  width: 14px;
  height: 14px;
  border-radius: ${({ theme }) => theme.raio.full};
  background: ${({ $cor }) => $cor};
  flex-shrink: 0;
  margin-top: 4px;
`;

const Info = styled.div`
  flex: 1;
  min-width: 0;
`;

const Nome = styled(Link)`
  display: block;
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
  color: ${({ theme }) => theme.cores.texto};

  &:hover {
    color: ${({ theme }) => theme.cores.primaria};
  }
`;

const Contador = styled.span`
  font-size: ${({ theme }) => theme.fonte.tamanho.xs};
  color: ${({ theme }) => theme.cores.textoSuave};
`;

const Acoes = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.espaco.xs};
`;

export default function Disciplinas() {
  const { grupoAtivo } = useAuth();
  const {
    disciplinasDoGrupo,
    conteudosDaDisciplina,
    atividadesDaDisciplina,
    atividadesDoConteudo,
    progressoDaDisciplina,
    progressoDoConteudo,
    criarDisciplina,
    atualizarDisciplina,
    removerDisciplina,
  } = useData();

  const disciplinas = disciplinasDoGrupo(grupoAtivo.id);

  const coresEmUso = disciplinas.map((d) => d.cor);

  const novoForm = () => ({ nome: '', cor: null });

  const [form, setForm] = useState(novoForm);
  const [erros, setErros] = useState({});
  const [editandoId, setEditandoId] = useState(null);
  const [removendo, setRemovendo] = useState(null);

  // `form.cor` nulo quer dizer "escolhe por mim": a sugestão é resolvida aqui,
  // no render, a partir das cores em uso agora. Guardá-la no estado deixaria a
  // sugestão um render atrasada e ela poderia cair numa cor recém-ocupada.
  const cor = form.cor ?? sugerirCorDisciplina(coresEmUso);

  const atualizarCampo = (campo) => (evento) => {
    setForm((atual) => ({ ...atual, [campo]: evento.target.value }));
  };

  const escolherCor = (escolhida) => setForm((atual) => ({ ...atual, cor: escolhida }));

  const resetar = () => {
    setForm(novoForm());
    setErros({});
    setEditandoId(null);
  };

  const aoEnviar = (evento) => {
    evento.preventDefault();
    const novosErros = validarDisciplina({ ...form, cor }, { disciplinas, ignorarId: editandoId });
    setErros(novosErros);
    if (!semErros(novosErros)) return;

    if (editandoId) {
      atualizarDisciplina(editandoId, { nome: form.nome.trim(), cor });
    } else {
      criarDisciplina({ nome: form.nome, cor, grupoId: grupoAtivo.id });
    }
    resetar();
  };

  const iniciarEdicao = (disciplina) => {
    setEditandoId(disciplina.id);
    setErros({});
    setForm({ nome: disciplina.nome || '', cor: disciplina.cor });
  };

  const confirmarRemocao = () => {
    if (removendo) {
      removerDisciplina(removendo.id);
      if (editandoId === removendo.id) resetar();
    }
    setRemovendo(null);
  };

  // RN02 — avisa quantos conteúdos vão junto antes de confirmar.
  const conteudosRemovendo = removendo ? conteudosDaDisciplina(removendo.id).length : 0;
  const mensagemRemocao = !removendo
    ? ''
    : conteudosRemovendo === 0
      ? `${removendo.nome} será removida do grupo.`
      : `${removendo.nome} será removida do grupo, junto com ${conteudosRemovendo} ${
          conteudosRemovendo === 1 ? 'conteúdo' : 'conteúdos'
        } e as atividades ${conteudosRemovendo === 1 ? 'dele' : 'deles'}.`;

  return (
    <>
      <PageHeader
        titulo="Disciplinas"
        subtitulo={`${disciplinas.length} ${
          disciplinas.length === 1 ? 'disciplina cadastrada' : 'disciplinas cadastradas'
        }`}
      />

      <Colunas>
        {/* RN07 — quem gerencia disciplina é o organizador. */}
        <SomenteOrganizador aviso="Só o organizador do grupo cadastra e edita disciplinas.">
        <Formulario onSubmit={aoEnviar} noValidate>
          <h2>{editandoId ? 'Editar disciplina' : 'Nova disciplina'}</h2>

          <Field id="nome" label="Nome" obrigatorio erro={erros.nome}>
            <Input
              id="nome"
              value={form.nome}
              onChange={atualizarCampo('nome')}
              placeholder="Ex.: Banco de Dados"
              $erro={Boolean(erros.nome)}
            />
          </Field>

          <BlocoCor>
            <Label as="span">Cor</Label>
            <Paleta role="radiogroup" aria-label="Cor da disciplina">
              {CORES_DISCIPLINA.map(({ valor, rotulo }) => (
                <Amostra
                  key={valor}
                  type="button"
                  role="radio"
                  aria-checked={cor === valor}
                  aria-label={rotulo}
                  title={rotulo}
                  $cor={valor}
                  $ativa={cor === valor}
                  onClick={() => escolherCor(valor)}
                />
              ))}
            </Paleta>
          </BlocoCor>

          <Acoes>
            <Button type="submit" $bloco>
              {editandoId ? 'Salvar' : 'Cadastrar'}
            </Button>
            {editandoId && (
              <Button type="button" $variante="secundario" onClick={resetar}>
                Cancelar
              </Button>
            )}
          </Acoes>
        </Formulario>
        </SomenteOrganizador>

        <div>
          {disciplinas.length === 0 ? (
            <Card>
              <EmptyState
                icone="📚"
                titulo="Nenhuma disciplina ainda"
                descricao="Cadastre as disciplinas do semestre ao lado. Elas organizam os conteúdos e são a base do cálculo de progresso."
              />
            </Card>
          ) : (
            <Lista>
              {disciplinas.map((disciplina) => {
                const qtd = atividadesDaDisciplina(disciplina.id).length;
                const qtdConteudos = conteudosDaDisciplina(disciplina.id).length;
                return (
                  <ItemDisciplina key={disciplina.id} $cor={disciplina.cor}>
                    <TopoDisciplina>
                    <Ponto $cor={disciplina.cor} aria-hidden="true" />
                    <Info>
                      <Nome to={`/disciplina/${disciplina.id}`}>{disciplina.nome}</Nome>
                      <Contador>
                        {qtdConteudos} {qtdConteudos === 1 ? 'conteúdo' : 'conteúdos'} · {qtd}{' '}
                        {qtd === 1 ? 'atividade' : 'atividades'}
                      </Contador>
                    </Info>
                    <Acoes>
                      <Button as={Link} to={`/disciplina/${disciplina.id}`} $tamanho="sm">
                        Conteúdos
                      </Button>
                      <SomenteOrganizador>
                        <Button
                          type="button"
                          $variante="secundario"
                          $tamanho="sm"
                          onClick={() => iniciarEdicao(disciplina)}
                        >
                          Editar
                        </Button>
                      </SomenteOrganizador>
                      <SomenteOrganizador>
                        <Button
                          type="button"
                          $variante="fantasma"
                          $tamanho="sm"
                          onClick={() => setRemovendo(disciplina)}
                        >
                          Remover
                        </Button>
                      </SomenteOrganizador>
                    </Acoes>
                    </TopoDisciplina>

                    <BarraDisciplina>
                      <BarraProgresso
                        progresso={progressoDaDisciplina(disciplina.id)}
                        meta={false}
                      />
                    </BarraDisciplina>

                    {/* Os conteúdos aparecem aqui dentro: a tela mostra a
                        estrutura inteira, não só a lista de disciplinas. */}
                    {qtdConteudos > 0 && (
                      <Conteudos>
                        {conteudosDaDisciplina(disciplina.id).map((conteudo) => {
                          const doConteudo = atividadesDoConteudo(conteudo.id).length;
                          return (
                            <ItemConteudo key={conteudo.id}>
                              <NomeConteudo>{conteudo.nome}</NomeConteudo>
                              <QuantidadeConteudo>
                                {doConteudo} {doConteudo === 1 ? 'atividade' : 'atividades'}
                              </QuantidadeConteudo>
                              <MiniBarra>
                                <BarraProgresso
                                  progresso={progressoDoConteudo(conteudo.id)}
                                  meta={false}
                                />
                              </MiniBarra>
                            </ItemConteudo>
                          );
                        })}
                      </Conteudos>
                    )}
                  </ItemDisciplina>
                );
              })}
            </Lista>
          )}
        </div>
      </Colunas>

      <ConfirmDialog
        aberto={Boolean(removendo)}
        titulo="Remover disciplina?"
        mensagem={mensagemRemocao}
        textoConfirmar="Remover"
        perigo
        onConfirmar={confirmarRemocao}
        onCancelar={() => setRemovendo(null)}
      />
    </>
  );
}
