import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { useAuth } from '../context/AuthContext.jsx';
import { useData } from '../context/DataContext.jsx';
import { Avatar, Button, Card, Field, Input } from '../components/ui';
import { BotaoTema } from '../components/BotaoTema.jsx';
import { LogoVertice } from '../components/LogoVertice.jsx';
import { Rodape } from '../components/Rodape.jsx';
import { rotuloPerfil } from '../lib/constants.js';
import { semErros, validarGrupo } from '../lib/validacao.js';
import { gerarDadosExemplo } from '../lib/seed.js';

// Tela de acesso, em dois passos: primeiro o grupo, depois quem você é
// dentro dele. Nenhum dos dois tem senha — são seleções.
//
// Excluir o grupo não mora mais aqui: é do organizador (RN07), e aqui ainda
// não se sabe quem é a pessoa. A ação passou para a tela de Membros.

const Tela = styled.div`
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.cores.fundo};
  background-image: radial-gradient(
      900px 500px at 10% 4%,
      ${({ theme }) =>
        theme.esquema === 'dark' ? 'rgba(34, 211, 238, 0.18)' : 'rgba(8, 145, 178, 0.12)'},
      transparent 55%
    ),
    radial-gradient(
      900px 600px at 92% 96%,
      ${({ theme }) =>
        theme.esquema === 'dark' ? 'rgba(171, 254, 67, 0.16)' : 'rgba(77, 124, 15, 0.12)'},
      transparent 55%
    ),
    linear-gradient(
      ${({ theme }) =>
          theme.esquema === 'dark' ? 'rgba(255, 255, 255, 0.035)' : 'rgba(15, 23, 42, 0.05)'}
        1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      ${({ theme }) =>
          theme.esquema === 'dark' ? 'rgba(255, 255, 255, 0.035)' : 'rgba(15, 23, 42, 0.05)'}
        1px,
      transparent 1px
    );
  background-size: auto, auto, 46px 46px, 46px 46px;
`;

const CantoTema = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.espaco.lg};
  right: ${({ theme }) => theme.espaco.lg};
`;

// Área central que empurra o rodapé para o fim da tela.
const Centro = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.espaco.xl};
`;

const Split = styled.main`
  width: 100%;
  max-width: 960px;
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: ${({ theme }) => theme.espaco.xxxl};
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.espaco.xl};
    max-width: 460px;
  }
`;

// ----- Coluna da marca -----
const Hero = styled.section`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    text-align: center;
  }
`;

const HeroTitulo = styled.h1`
  display: inline-flex;
  align-items: center;
  gap: 0.25em;
  font-family: ${({ theme }) => theme.fonte.display};
  font-weight: ${({ theme }) => theme.fonte.peso.extra};
  font-size: clamp(3rem, 7vw, 4.25rem);
  letter-spacing: -0.04em;
  line-height: 1;
  color: ${({ theme }) => theme.cores.destaque};
`;

// Logo no fim da palavra, escala junto com o tamanho da fonte (em).
const LogoMarca = styled(LogoVertice)`
  width: 0.78em;
  height: 0.78em;
  filter: drop-shadow(0 0 16px ${({ theme }) => theme.cores.destaqueBrilho});
  flex-shrink: 0;
`;

const HeroSub = styled.p`
  margin-top: ${({ theme }) => theme.espaco.lg};
  max-width: 40ch;
  color: ${({ theme }) => theme.cores.textoSuave};
  font-size: ${({ theme }) => theme.fonte.tamanho.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-left: auto;
    margin-right: auto;
  }
`;

// ----- Coluna do acesso -----
const PainelForm = styled(Card)`
  position: relative;
  padding: ${({ theme }) => theme.espaco.xxl};
  box-shadow: ${({ theme }) => theme.sombra.lg};
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.cores.primaria},
      ${({ theme }) => theme.cores.destaque}
    );
  }
`;

const PainelTitulo = styled.h2`
  font-size: ${({ theme }) => theme.fonte.tamanho.xl};
  margin-bottom: ${({ theme }) => theme.espaco.lg};
`;

const RotuloSecao = styled.h3`
  font-size: ${({ theme }) => theme.fonte.tamanho.xs};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.cores.textoSuave};
  margin-bottom: ${({ theme }) => theme.espaco.sm};
`;

const Lista = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco.sm};
`;

const GrupoItem = styled.div`
  display: flex;
  align-items: stretch;
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: ${({ theme }) => theme.raio.md};
  background: ${({ theme }) => theme.cores.superficieAlt};
  overflow: hidden;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;

  &:hover {
    border-color: ${({ theme }) => theme.cores.primaria};
    box-shadow: ${({ theme }) => theme.sombra.glowCiano};
    transform: translateY(-1px);
  }
`;

const EntrarArea = styled.button`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.espaco.md};
  padding: ${({ theme }) => theme.espaco.md};
  background: transparent;
  border: none;
  text-align: left;
  color: inherit;
`;

const InfoGrupo = styled.div`
  flex: 1;
  min-width: 0;

  strong {
    display: block;
  }

  small {
    display: block;
    color: ${({ theme }) => theme.cores.textoSuave};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const Seta = styled.span`
  color: ${({ theme }) => theme.cores.primaria};
  font-size: 1.25rem;
`;

const Divisor = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.espaco.md};
  margin: ${({ theme }) => theme.espaco.lg} 0;
  color: ${({ theme }) => theme.cores.textoSuave};
  font-size: ${({ theme }) => theme.fonte.tamanho.sm};

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.cores.borda};
  }
`;

const RodapeForm = styled.div`
  margin-top: ${({ theme }) => theme.espaco.lg};
  text-align: center;

  button {
    background: none;
    border: none;
    color: ${({ theme }) => theme.cores.primaria};
    font-size: ${({ theme }) => theme.fonte.tamanho.sm};
    font-weight: ${({ theme }) => theme.fonte.peso.medio};
    text-decoration: underline;
    text-underline-offset: 3px;
    transition: color 0.18s ease;
  }
  button:hover {
    color: ${({ theme }) => theme.cores.destaque};
  }
`;

export default function Login() {
  const {
    autenticado,
    precisaIdentificar,
    grupoAtivo,
    membrosDoGrupoAtivo,
    entrar,
    identificar,
    sair,
  } = useAuth();
  const { grupos, membros, criarGrupo, importarExemplo } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const destino = location.state?.de || '/painel';

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [erros, setErros] = useState({});

  // Sessão completa: grupo escolhido e pessoa identificada.
  if (autenticado && !precisaIdentificar) {
    return <Navigate to={destino} replace />;
  }

  const entrarNoGrupo = (id) => {
    // Grupo com gente dentro: a pessoa ainda precisa dizer quem é (RN07).
    // Grupo vazio entra direto — alguém tem que poder cadastrar o primeiro.
    const temMembros = membros.some((m) => m.grupoId === id);
    entrar(id);
    if (!temMembros) navigate(destino, { replace: true });
  };

  const escolherMembro = (id) => {
    identificar(id);
    navigate(destino, { replace: true });
  };

  const aoCriar = (evento) => {
    evento.preventDefault();
    const dados = { nome, descricao };
    const novosErros = validarGrupo(dados);
    setErros(novosErros);
    if (!semErros(novosErros)) return;
    const grupo = criarGrupo(dados);
    entrarNoGrupo(grupo.id);
  };

  const carregarExemplo = () => {
    const pacote = gerarDadosExemplo();
    importarExemplo(pacote);
    entrarNoGrupo(pacote.grupo.id);
  };

  const temGrupos = grupos.length > 0;

  return (
    <Tela>
      <CantoTema>
        <BotaoTema />
      </CantoTema>

      <Centro>
        <Split>
        <Hero>
          <HeroTitulo>
            Vértice
            <LogoMarca />
          </HeroTitulo>
          <HeroSub>Organize as atividades e trabalhos do seu grupo.</HeroSub>
        </Hero>

        {/* Segundo passo: dentro do grupo, quem é você. Sem senha — é
            seleção, como o grupo. Serve ao RN07: o perfil da pessoa decide
            o que ela pode gerenciar. */}
        {precisaIdentificar ? (
          <PainelForm>
            <PainelTitulo>Quem é você?</PainelTitulo>
            <RotuloSecao>Em {grupoAtivo?.nome}</RotuloSecao>
            <Lista>
              {membrosDoGrupoAtivo.map((membro) => (
                <GrupoItem key={membro.id}>
                  <EntrarArea type="button" onClick={() => escolherMembro(membro.id)}>
                    <Avatar seed={membro.avatar} nome={membro.nome} tamanho={40} />
                    <InfoGrupo>
                      <strong>{membro.nome}</strong>
                      <small>{rotuloPerfil(membro.perfil) || membro.funcao}</small>
                    </InfoGrupo>
                    <Seta aria-hidden="true">→</Seta>
                  </EntrarArea>
                </GrupoItem>
              ))}
            </Lista>
            <RodapeForm>
              <button type="button" onClick={sair}>
                Trocar de grupo
              </button>
            </RodapeForm>
          </PainelForm>
        ) : (
        <PainelForm>
          <PainelTitulo>Acesse seu grupo</PainelTitulo>

          {temGrupos && (
            <>
              <RotuloSecao>Entrar com um grupo</RotuloSecao>
              <Lista>
                {grupos.map((grupo) => (
                  <GrupoItem key={grupo.id}>
                    <EntrarArea type="button" onClick={() => entrarNoGrupo(grupo.id)}>
                      <Avatar nome={grupo.nome} tamanho={40} />
                      <InfoGrupo>
                        <strong>{grupo.nome}</strong>
                        <small>{grupo.descricao || 'Grupo de trabalho'}</small>
                      </InfoGrupo>
                      <Seta aria-hidden="true">→</Seta>
                    </EntrarArea>
                  </GrupoItem>
                ))}
              </Lista>
              <Divisor>ou crie um novo</Divisor>
            </>
          )}

          {!temGrupos && <RotuloSecao>Criar um grupo</RotuloSecao>}
          <form onSubmit={aoCriar} noValidate>
            <Field id="nome" label="Nome do grupo" obrigatorio erro={erros.nome}>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex.: Trio do TCC"
                $erro={Boolean(erros.nome)}
                autoComplete="off"
              />
            </Field>
            <Field
              id="descricao"
              label="Descrição (opcional)"
              dica="Uma linha sobre o grupo."
            >
              <Input
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Grupo de Front-End"
                autoComplete="off"
              />
            </Field>
            <Button type="submit" $bloco>
              Criar e entrar
            </Button>
          </form>

          <RodapeForm>
            <button type="button" onClick={carregarExemplo}>
              Carregar dados de exemplo
            </button>
          </RodapeForm>
        </PainelForm>
        )}
        </Split>
      </Centro>

      <Rodape />
    </Tela>
  );
}
