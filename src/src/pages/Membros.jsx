import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { useAuth } from '../context/AuthContext.jsx';
import { useData } from '../context/DataContext.jsx';
import {
  Avatar,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Field,
  Input,
  Label,
  PageHeader,
  Select,
} from '../components/ui';
import { SomenteOrganizador } from '../components/SomenteOrganizador.jsx';
import { novaSeedAvatar } from '../lib/avatar.js';
import { PERFIL, PERFIL_OPCOES, rotuloPerfil } from '../lib/constants.js';
import { semErros, ultimoOrganizador, validarMembro } from '../lib/validacao.js';

// Tela de membros: onde o grupo cadastra a galera. Precisa existir antes das
// atividades, porque o responsável de uma atividade sai daqui.

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

// Grade de cartões, como no protótipo: a pessoa é a unidade, e o que
// interessa dela (perfil e experiência) cabe num cartão.
const Lista = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 12px;
  list-style: none;
`;

const ItemMembro = styled.li`
  background: ${({ theme }) => theme.cores.superficie};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: 12px;
  padding: 18px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Perfil = styled.span`
  display: inline-block;
  font-size: 10px;
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
  letter-spacing: 0.07em;
  text-transform: uppercase;
  padding: 3px 9px;
  border-radius: ${({ theme }) => theme.raio.full};
  margin-top: 9px;
  background: ${({ $organizador, theme }) =>
    $organizador ? theme.cores.primariaSuave : theme.cores.aFazerSuave};
  color: ${({ $organizador, theme }) =>
    $organizador ? theme.cores.primariaForte : theme.cores.aFazer};
`;

// Experiência e atividades, lado a lado no pé do cartão.
const Numeros = styled.div`
  display: flex;
  width: 100%;
  margin-top: 15px;
  padding-top: 14px;
  border-top: 1px solid ${({ theme }) => theme.cores.borda};

  div {
    flex: 1;
  }

  b {
    display: block;
    font-family: ${({ theme }) => theme.fonte.numero};
    font-size: 16px;
    font-weight: ${({ theme }) => theme.fonte.peso.extra};
    color: ${({ theme }) => theme.cores.gamificacao};
  }

  span {
    font-size: 10px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.cores.textoSuave};
    font-weight: ${({ theme }) => theme.fonte.peso.forte};
  }
`;

const AcoesMembro = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.espaco.xs};
  justify-content: center;
  margin-top: ${({ theme }) => theme.espaco.md};
  flex-wrap: wrap;
`;

const Info = styled.div`
  min-width: 0;
  width: 100%;

  strong {
    display: block;
    font-size: 15px;
    font-weight: ${({ theme }) => theme.fonte.peso.forte};
    color: ${({ theme }) => theme.cores.textoForte};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  small {
    display: block;
    font-size: 12px;
    color: ${({ theme }) => theme.cores.textoSuave};
    margin-top: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const AcoesItem = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.espaco.xs};
`;

// Excluir o grupo mora aqui, e não na tela de acesso: é ação de
// organizador (RN07), e lá ainda não se sabe quem é a pessoa.
const ZonaDePerigo = styled(Card)`
  margin-top: ${({ theme }) => theme.espaco.xxl};
  border-color: ${({ theme }) => theme.cores.perigo};

  h2 {
    font-size: ${({ theme }) => theme.fonte.tamanho.lg};
    color: ${({ theme }) => theme.cores.perigo};
    margin-bottom: ${({ theme }) => theme.espaco.sm};
  }

  p {
    color: ${({ theme }) => theme.cores.textoSuave};
    font-size: ${({ theme }) => theme.fonte.tamanho.sm};
    margin-bottom: ${({ theme }) => theme.espaco.md};
  }
`;

const CampoAvatar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.espaco.md};
`;

const BlocoAvatar = styled.div`
  margin-bottom: ${({ theme }) => theme.espaco.lg};
`;

// Cada formulário novo já nasce com uma semente de avatar sorteada
// (independente do nome do membro).

export default function Membros() {
  const { grupoAtivo, membroAtivo, identificar, sair } = useAuth();
  const navigate = useNavigate();
  const {
    membrosDoGrupo,
    atividadesDoGrupo,
    rankingDoGrupo,
    criarMembro,
    atualizarMembro,
    removerMembro,
    removerGrupo,
  } = useData();

  const membros = membrosDoGrupo(grupoAtivo.id);
  const atividades = atividadesDoGrupo(grupoAtivo.id);

  // Quantas atividades cada membro é responsável.
  const atividadesPorMembro = useMemo(() => {
    const mapa = {};
    atividades.forEach((a) => {
      if (a.responsavelId) {
        mapa[a.responsavelId] = (mapa[a.responsavelId] || 0) + 1;
      }
    });
    return mapa;
  }, [atividades]);

  // RN10 — a experiência de cada membro, derivada das atividades concluídas.
  const ranking = rankingDoGrupo(grupoAtivo.id);
  const xpPorMembro = Object.fromEntries(ranking.map((l) => [l.membro.id, l.xp]));

  // O primeiro membro do grupo nasce organizador — é ele que vai montar
  // tudo. Os seguintes entram como participantes (RN07).
  const novoForm = () => ({
    nome: '',
    funcao: '',
    email: '',
    avatar: novaSeedAvatar(),
    perfil: membros.length === 0 ? PERFIL.ORGANIZADOR : PERFIL.PARTICIPANTE,
  });

  const [form, setForm] = useState(novoForm);
  const [erros, setErros] = useState({});
  const [editandoId, setEditandoId] = useState(null);
  const [removendo, setRemovendo] = useState(null);
  const [excluindoGrupo, setExcluindoGrupo] = useState(false);

  const excluirGrupo = () => {
    const id = grupoAtivo.id;
    setExcluindoGrupo(false);
    sair();
    removerGrupo(id);
    navigate('/login', { replace: true });
  };

  const atualizarCampo = (campo) => (evento) => {
    setForm((atual) => ({ ...atual, [campo]: evento.target.value }));
  };

  const sortearAvatar = () => {
    setForm((atual) => ({ ...atual, avatar: novaSeedAvatar() }));
  };

  const resetar = () => {
    setForm(novoForm());
    setErros({});
    setEditandoId(null);
  };

  const aoEnviar = (evento) => {
    evento.preventDefault();
    const novosErros = validarMembro(form, { membros, ignorarId: editandoId });
    setErros(novosErros);
    if (!semErros(novosErros)) return;

    if (editandoId) {
      atualizarMembro(editandoId, {
        nome: form.nome.trim(),
        funcao: form.funcao.trim(),
        email: form.email.trim(),
        avatar: form.avatar,
        perfil: form.perfil,
      });
    } else {
      const criado = criarMembro({ ...form, grupoId: grupoAtivo.id });

      // Grupo recém-criado: quem está montando ainda não se identificou,
      // porque não havia ninguém para escolher. O primeiro membro que ela
      // cadastra é ela — mesma suposição que a migração faz. Sem isto a
      // pessoa seria mandada para "quem é você?" no meio da configuração.
      if (!membroAtivo && membros.length === 0) {
        identificar(criado.id);
      }
    }
    resetar();
  };

  const iniciarEdicao = (membro) => {
    setEditandoId(membro.id);
    setErros({});
    setForm({
      nome: membro.nome || '',
      funcao: membro.funcao || '',
      email: membro.email || '',
      // Membros antigos sem semente continuam com o avatar do nome até a
      // pessoa sortear um novo.
      avatar: membro.avatar || membro.nome || novaSeedAvatar(),
      perfil: membro.perfil || PERFIL.PARTICIPANTE,
    });
  };

  const confirmarRemocao = () => {
    if (removendo) {
      removerMembro(removendo.id);
      if (editandoId === removendo.id) resetar();
    }
    setRemovendo(null);
  };

  const qtdAtividadesRemovendo = removendo ? atividadesPorMembro[removendo.id] || 0 : 0;

  return (
    <>
      <PageHeader
        titulo="Membros"
        subtitulo={`${membros.length} ${
          membros.length === 1 ? 'pessoa no grupo' : 'pessoas no grupo'
        }`}
      />

      <Colunas>
        {/* RN07 — quem gerencia membros é o organizador. */}
        <SomenteOrganizador aviso="Só o organizador do grupo cadastra e edita membros.">
        <Formulario onSubmit={aoEnviar} noValidate>
          <h2>{editandoId ? 'Editar membro' : 'Adicionar membro'}</h2>

          <BlocoAvatar>
            <Label as="span">Avatar</Label>
            <CampoAvatar>
              <Avatar seed={form.avatar} nome={form.nome} tamanho={56} />
              <Button
                type="button"
                $variante="secundario"
                $tamanho="sm"
                title="Sortear outro avatar"
                onClick={sortearAvatar}
              >
                🎲 Trocar avatar
              </Button>
            </CampoAvatar>
          </BlocoAvatar>

          <Field id="nome" label="Nome" obrigatorio erro={erros.nome}>
            <Input
              id="nome"
              value={form.nome}
              onChange={atualizarCampo('nome')}
              placeholder="Ex.: Ana Souza"
              $erro={Boolean(erros.nome)}
            />
          </Field>

          <Field id="funcao" label="Função no grupo" dica="Opcional.">
            <Input
              id="funcao"
              value={form.funcao}
              onChange={atualizarCampo('funcao')}
              placeholder="Ex.: responsável pela introdução"
            />
          </Field>

          <Field id="email" label="E-mail" dica="Opcional." erro={erros.email}>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={atualizarCampo('email')}
              placeholder="ana@exemplo.com"
              $erro={Boolean(erros.email)}
            />
          </Field>

          {/* RN07 — o perfil decide quem gerencia membros, disciplinas e
              conteúdos. Participante cadastra e edita atividades. */}
          <Field
            id="perfil"
            label="Perfil"
            erro={erros.perfil}
            dica="O organizador gerencia membros, disciplinas e conteúdos."
          >
            <Select
              id="perfil"
              value={form.perfil}
              onChange={atualizarCampo('perfil')}
              $erro={Boolean(erros.perfil)}
            >
              {PERFIL_OPCOES.map((o) => (
                <option key={o.valor} value={o.valor}>
                  {o.rotulo}
                </option>
              ))}
            </Select>
          </Field>

          <AcoesItem>
            <Button type="submit" $bloco>
              {editandoId ? 'Salvar' : 'Adicionar'}
            </Button>
            {editandoId && (
              <Button type="button" $variante="secundario" onClick={resetar}>
                Cancelar
              </Button>
            )}
          </AcoesItem>
        </Formulario>
        </SomenteOrganizador>

        <div>
          {membros.length === 0 ? (
            <Card>
              <EmptyState
                icone="👥"
                titulo="Nenhum membro ainda"
                descricao="Cadastre as pessoas do grupo no formulário ao lado. Depois elas poderão ser responsáveis pelas atividades."
              />
            </Card>
          ) : (
            <Lista>
              {membros.map((membro) => {
                const qtd = atividadesPorMembro[membro.id] || 0;
                return (
                  <ItemMembro key={membro.id}>
                    <Avatar seed={membro.avatar} nome={membro.nome} tamanho={58} />
                    <Info>
                      <strong>{membro.nome}</strong>
                      {membro.funcao && <small>{membro.funcao}</small>}
                      {membro.email && <small>{membro.email}</small>}
                    </Info>
                    <Perfil $organizador={membro.perfil === PERFIL.ORGANIZADOR}>
                      {rotuloPerfil(membro.perfil)}
                    </Perfil>

                    {/* RN10 — a experiência sai das atividades concluídas. */}
                    <Numeros>
                      <div>
                        <b>{xpPorMembro[membro.id] ?? 0}</b>
                        <span>XP</span>
                      </div>
                      <div>
                        <b>{qtd}</b>
                        <span>{qtd === 1 ? 'atividade' : 'atividades'}</span>
                      </div>
                    </Numeros>

                    <AcoesMembro>
                      <SomenteOrganizador>
                        <Button
                          type="button"
                          $variante="secundario"
                          $tamanho="sm"
                          onClick={() => iniciarEdicao(membro)}
                        >
                          Editar
                        </Button>
                      </SomenteOrganizador>
                      <SomenteOrganizador>
                        <Button
                          type="button"
                          $variante="fantasma"
                          $tamanho="sm"
                          disabled={ultimoOrganizador(membro.id, membros)}
                          title={
                            ultimoOrganizador(membro.id, membros)
                              ? 'O grupo precisa de pelo menos um organizador.'
                              : undefined
                          }
                          onClick={() => setRemovendo(membro)}
                        >
                          Remover
                        </Button>
                      </SomenteOrganizador>
                    </AcoesMembro>
                  </ItemMembro>
                );
              })}
            </Lista>
          )}
        </div>
      </Colunas>

      {/* RN07 + RN02 — só o organizador exclui o grupo, e o grupo leva tudo
          junto. */}
      <SomenteOrganizador>
        <ZonaDePerigo>
          <h2>Excluir o grupo</h2>
          <p>
            O grupo <strong>{grupoAtivo.nome}</strong> sai com todos os seus membros,
            disciplinas, conteúdos e atividades. Não dá para desfazer.
          </p>
          <Button type="button" $variante="perigo" onClick={() => setExcluindoGrupo(true)}>
            Excluir grupo
          </Button>
        </ZonaDePerigo>
      </SomenteOrganizador>

      <ConfirmDialog
        aberto={excluindoGrupo}
        titulo="Confirmar exclusão"
        mensagem={`O grupo "${grupoAtivo.nome}" será excluído com todos os seus membros, disciplinas, conteúdos e atividades. Essa ação não pode ser desfeita.`}
        textoConfirmar="Confirmar exclusão"
        textoCancelar="Cancelar"
        perigo
        onConfirmar={excluirGrupo}
        onCancelar={() => setExcluindoGrupo(false)}
      />

      <ConfirmDialog
        aberto={Boolean(removendo)}
        titulo="Remover membro?"
        mensagem={
          qtdAtividadesRemovendo > 0
            ? `${removendo?.nome} é responsável por ${qtdAtividadesRemovendo} ${
                qtdAtividadesRemovendo === 1 ? 'atividade' : 'atividades'
              }. Ao remover, ${
                qtdAtividadesRemovendo === 1 ? 'ela ficará' : 'elas ficarão'
              } sem responsável.`
            : `${removendo?.nome} será removido do grupo.`
        }
        textoConfirmar="Remover"
        perigo
        onConfirmar={confirmarRemocao}
        onCancelar={() => setRemovendo(null)}
      />
    </>
  );
}
