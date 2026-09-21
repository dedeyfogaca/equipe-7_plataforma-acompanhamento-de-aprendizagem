import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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
  Textarea,
} from '../components/ui';
import { SomenteOrganizador } from '../components/SomenteOrganizador.jsx';
import { semErros, validarConteudo } from '../lib/validacao.js';

// T07 — conteúdos de uma disciplina (rota /disciplina/:id).
// O conteúdo só existe dentro de uma disciplina (RN13) e a ordem dele é
// decidida ali dentro, então a tela dele é o detalhe da disciplina, não uma
// lista solta de todos os conteúdos do grupo.
//
// É aqui que o progresso vai aparecer depois: o conteúdo é a unidade que
// soma peso de atividades (RN08), e a disciplina agrega esses pesos (RN14).

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

const Cabecalho = styled.header`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.espaco.md};
  margin-bottom: ${({ theme }) => theme.espaco.xs};
`;

const Marcador = styled.span`
  width: 6px;
  align-self: stretch;
  min-height: 2.2rem;
  border-radius: ${({ theme }) => theme.raio.full};
  background: ${({ $cor }) => $cor};
  flex-shrink: 0;
`;

const Titulo = styled.h1`
  font-size: ${({ theme }) => theme.fonte.tamanho.xxxl};
  font-weight: ${({ theme }) => theme.fonte.peso.extra};
  letter-spacing: -0.03em;
`;

const Subtitulo = styled.p`
  color: ${({ theme }) => theme.cores.textoSuave};
  font-size: ${({ theme }) => theme.fonte.tamanho.sm};
`;

// Progresso da disciplina: a soma dos pesos de todos os conteúdos (RN14).
const ProgressoDisciplina = styled.div`
  max-width: 420px;
  margin: ${({ theme }) => theme.espaco.md} 0 ${({ theme }) => theme.espaco.xl};
`;

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

const Lista = styled.ol`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco.md};
  list-style: none;
`;

const ItemConteudo = styled.li`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.espaco.md};
  background: ${({ theme }) => theme.cores.superficie};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: ${({ theme }) => theme.raio.lg};
  padding: ${({ theme }) => theme.espaco.lg};
`;

const Posicao = styled.span`
  font-family: ${({ theme }) => theme.fonte.numero};
  font-size: ${({ theme }) => theme.fonte.tamanho.sm};
  color: ${({ theme }) => theme.cores.textoSuave};
  min-width: 2ch;
  text-align: right;
  padding-top: 2px;
`;

const Info = styled.div`
  flex: 1;
  min-width: 0;

  strong {
    display: block;
  }

  p {
    color: ${({ theme }) => theme.cores.textoSuave};
    font-size: ${({ theme }) => theme.fonte.tamanho.sm};
    margin-top: 2px;
  }
`;

const Acoes = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.espaco.xs};
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const Progresso = styled.div`
  margin-top: ${({ theme }) => theme.espaco.sm};
  max-width: 320px;
`;

const Ordenar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const BotaoOrdem = styled.button`
  width: 24px;
  height: 20px;
  line-height: 1;
  font-size: ${({ theme }) => theme.fonte.tamanho.xs};
  color: ${({ theme }) => theme.cores.textoSuave};
  background: none;
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: ${({ theme }) => theme.raio.sm};

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.cores.primaria};
    border-color: ${({ theme }) => theme.cores.primaria};
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

const novoForm = () => ({ nome: '', descricao: '' });

export default function DisciplinaDetalhe() {
  const { id } = useParams();
  const { grupoAtivo } = useAuth();
  const {
    obterDisciplina,
    conteudosDaDisciplina,
    criarConteudo,
    atualizarConteudo,
    removerConteudo,
    moverConteudo,
    progressoDoConteudo,
    progressoDaDisciplina,
  } = useData();

  const disciplina = obterDisciplina(id);

  const [form, setForm] = useState(novoForm);
  const [erros, setErros] = useState({});
  const [editandoId, setEditandoId] = useState(null);
  const [removendo, setRemovendo] = useState(null);

  // RN01 — disciplina de outro grupo é tratada como inexistente: quem está
  // logado não pode enxergá-la nem pelo endereço direto.
  if (!disciplina || disciplina.grupoId !== grupoAtivo.id) {
    return (
      <Card>
        <EmptyState
          icone="❓"
          titulo="Disciplina não encontrada"
          descricao="Essa disciplina não existe mais ou o endereço está errado."
        >
          <Button as={Link} to="/disciplinas">
            Voltar para as disciplinas
          </Button>
        </EmptyState>
      </Card>
    );
  }

  const conteudos = conteudosDaDisciplina(disciplina.id);

  const atualizarCampo = (campo) => (evento) => {
    setForm((atual) => ({ ...atual, [campo]: evento.target.value }));
  };

  const resetar = () => {
    setForm(novoForm());
    setErros({});
    setEditandoId(null);
  };

  const aoEnviar = (evento) => {
    evento.preventDefault();
    const dados = { ...form, disciplinaId: disciplina.id };
    const novosErros = validarConteudo(dados, { conteudos, ignorarId: editandoId });
    setErros(novosErros);
    if (!semErros(novosErros)) return;

    if (editandoId) {
      atualizarConteudo(editandoId, {
        nome: form.nome.trim(),
        descricao: form.descricao.trim(),
      });
    } else {
      criarConteudo(dados);
    }
    resetar();
  };

  const iniciarEdicao = (conteudo) => {
    setEditandoId(conteudo.id);
    setErros({});
    setForm({ nome: conteudo.nome || '', descricao: conteudo.descricao || '' });
  };

  const confirmarRemocao = () => {
    if (removendo) {
      removerConteudo(removendo.id);
      if (editandoId === removendo.id) resetar();
    }
    setRemovendo(null);
  };

  return (
    <>
      <Voltar to="/disciplinas">← Voltar para as disciplinas</Voltar>

      <Cabecalho>
        <Marcador $cor={disciplina.cor} aria-hidden="true" />
        <Titulo>{disciplina.nome}</Titulo>
      </Cabecalho>
      <Subtitulo>
        {conteudos.length} {conteudos.length === 1 ? 'conteúdo' : 'conteúdos'}
      </Subtitulo>

      <ProgressoDisciplina>
        <BarraProgresso progresso={progressoDaDisciplina(disciplina.id)} />
      </ProgressoDisciplina>

      <Colunas>
        {/* RN07 — quem gerencia conteúdo é o organizador. */}
        <SomenteOrganizador aviso="Só o organizador do grupo cadastra e edita conteúdos.">
        <Formulario onSubmit={aoEnviar} noValidate>
          <h2>{editandoId ? 'Editar conteúdo' : 'Novo conteúdo'}</h2>

          <Field id="nome" label="Nome" obrigatorio erro={erros.nome}>
            <Input
              id="nome"
              value={form.nome}
              onChange={atualizarCampo('nome')}
              placeholder="Ex.: Normalização"
              $erro={Boolean(erros.nome)}
            />
          </Field>

          <Field id="descricao" label="Descrição" dica="Opcional.">
            <Textarea
              id="descricao"
              value={form.descricao}
              onChange={atualizarCampo('descricao')}
              placeholder="O que esse conteúdo cobre."
            />
          </Field>

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
          {conteudos.length === 0 ? (
            <Card>
              <EmptyState
                icone="🗂️"
                titulo="Nenhum conteúdo ainda"
                descricao="Divida a disciplina nos assuntos que ela cobre. É o conteúdo que reúne as atividades e soma o peso delas."
              />
            </Card>
          ) : (
            <Lista>
              {conteudos.map((conteudo, indice) => (
                <ItemConteudo key={conteudo.id}>
                  <SomenteOrganizador>
                  <Ordenar>
                    <BotaoOrdem
                      type="button"
                      aria-label={`Mover ${conteudo.nome} para cima`}
                      title="Mover para cima"
                      disabled={indice === 0}
                      onClick={() => moverConteudo(conteudo.id, 'cima')}
                    >
                      ▲
                    </BotaoOrdem>
                    <BotaoOrdem
                      type="button"
                      aria-label={`Mover ${conteudo.nome} para baixo`}
                      title="Mover para baixo"
                      disabled={indice === conteudos.length - 1}
                      onClick={() => moverConteudo(conteudo.id, 'baixo')}
                    >
                      ▼
                    </BotaoOrdem>
                  </Ordenar>
                  </SomenteOrganizador>

                  <Posicao>{indice + 1}</Posicao>

                  <Info>
                    <strong>{conteudo.nome}</strong>
                    {conteudo.descricao && <p>{conteudo.descricao}</p>}
                    <Progresso>
                      <BarraProgresso progresso={progressoDoConteudo(conteudo.id)} meta={false} />
                    </Progresso>
                  </Info>

                  <Acoes>
                    <SomenteOrganizador>
                      <Button
                        type="button"
                        $variante="secundario"
                        $tamanho="sm"
                        onClick={() => iniciarEdicao(conteudo)}
                      >
                        Editar
                      </Button>
                    </SomenteOrganizador>
                    <SomenteOrganizador>
                      <Button
                        type="button"
                        $variante="fantasma"
                        $tamanho="sm"
                        onClick={() => setRemovendo(conteudo)}
                      >
                        Remover
                      </Button>
                    </SomenteOrganizador>
                  </Acoes>
                </ItemConteudo>
              ))}
            </Lista>
          )}
        </div>
      </Colunas>

      <ConfirmDialog
        aberto={Boolean(removendo)}
        titulo="Remover conteúdo?"
        mensagem={`${removendo?.nome} será removido de ${disciplina.nome}. As atividades vinculadas a ele saem junto.`}
        textoConfirmar="Remover"
        perigo
        onConfirmar={confirmarRemocao}
        onCancelar={() => setRemovendo(null)}
      />
    </>
  );
}
