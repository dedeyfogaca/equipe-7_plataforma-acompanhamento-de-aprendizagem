import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext.jsx';
import { useData } from '../../context/DataContext.jsx';
import { rotuloPerfil } from '../../lib/constants.js';
import { Avatar } from '../ui/Avatar.jsx';
import { Button } from '../ui/Button.jsx';
import { BotaoTema } from '../BotaoTema.jsx';
import { LogoVertice } from '../LogoVertice.jsx';
import { Rodape } from '../Rodape.jsx';
import { LateralProvider, useRegistrarLateral } from './Lateral.jsx';

// Casca das páginas privadas, em três colunas: 232px | conteúdo | 312px.
//
// A da esquerda navega. A da direita dá contexto — calendário no Painel,
// filtros nas Atividades — e cada página manda o que quiser para lá pelo
// `Lateral`. Conteúdo centralizado com as laterais vazias foi rejeitado, por
// isso a grade ocupa a largura da janela em vez de uma faixa no meio.
//
// Abaixo de 1280px a coluna de contexto desce para debaixo do conteúdo, em
// vez de sumir: são filtros, não enfeite. Abaixo de 1024px a navegação vira
// uma barra no topo com menu.

const Casca = styled.div`
  min-height: 100vh;
  display: grid;
  /* A terceira coluna é 'auto' para colapsar quando a página não manda
     nada para ela: coluna vazia ao lado do conteúdo foi rejeitada. */
  grid-template-columns: 232px minmax(0, 1fr) auto;
  grid-template-areas: 'navegacao conteudo contexto';
  align-items: start;

  @media (max-width: 1279px) {
    grid-template-columns: 232px minmax(0, 1fr);
    grid-template-rows: auto auto;
    grid-template-areas:
      'navegacao conteudo'
      'navegacao contexto';
  }


  /* No celular o conteúdo vem antes do contexto: quem abre "Atividades"
     tem de ver a lista, não a caixa de filtros. As situações, que são o
     filtro principal, já ficam no topo do próprio conteúdo. */
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      'navegacao'
      'conteudo'
      'contexto';
  }
`;

const Rail = styled.div`
  grid-area: navegacao;
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco.xl};
  padding: 22px 0;
  border-right: 1px solid ${({ theme }) => theme.cores.borda};
  background: ${({ theme }) => theme.cores.superficie};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    position: static;
    height: auto;
    gap: ${({ theme }) => theme.espaco.md};
    border-right: none;
    border-bottom: 1px solid ${({ theme }) => theme.cores.borda};
  }
`;

const TopoRail = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.espaco.sm};
  padding: 0 22px;
`;

// O nome do grupo vira legenda da navegação, como no protótipo: você sabe
// de qual grupo é o que está vendo sem procurar.
const Legenda = styled.p`
  font-size: 10px;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.cores.textoSuave};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
  padding: 0 22px;
  margin-bottom: 7px;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: ${({ $aberto }) => ($aberto ? 'block' : 'none')};
  }
`;

const Marca = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.espaco.sm};
  font-family: ${({ theme }) => theme.fonte.display};
  font-weight: ${({ theme }) => theme.fonte.peso.extra};
  font-size: 17px;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.cores.textoForte};
`;

const Logo = styled(LogoVertice)`
  color: ${({ theme }) => theme.cores.destaque};
  filter: drop-shadow(0 0 10px ${({ theme }) => theme.cores.destaqueBrilho});
  flex-shrink: 0;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  padding: 0 14px;

  a {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 9px 10px;
    border-radius: 9px;
    font-weight: ${({ theme }) => theme.fonte.peso.medio};
    font-size: 13.5px;
    color: ${({ theme }) => theme.cores.texto};
    transition: color 0.18s ease, background 0.18s ease;

    &:hover {
      background: ${({ theme }) => theme.cores.superficieHover};
    }

    &.ativo {
      color: ${({ theme }) => theme.cores.primariaForte};
      background: ${({ theme }) => theme.cores.primariaSuave};
      font-weight: ${({ theme }) => theme.fonte.peso.forte};
    }
  }

  /* A contagem fica à direita do item, como no protótipo. */
  .contagem {
    margin-left: auto;
    font-family: ${({ theme }) => theme.fonte.numero};
    font-size: 11.5px;
    color: ${({ theme }) => theme.cores.textoSuave};
    font-weight: ${({ theme }) => theme.fonte.peso.forte};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: ${({ $aberto }) => ($aberto ? 'flex' : 'none')};
  }
`;

const PeRail = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco.md};
  padding: 14px 16px 0;
  border-top: 1px solid ${({ theme }) => theme.cores.borda};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: ${({ $aberto }) => ($aberto ? 'flex' : 'none')};
  }
`;

const GrupoInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.espaco.sm};
  min-width: 0;
`;

const Identidade = styled.div`
  min-width: 0;

  strong {
    display: block;
    font-size: 13px;
    font-weight: ${({ theme }) => theme.fonte.peso.forte};
    color: ${({ theme }) => theme.cores.textoForte};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  small {
    font-size: 11px;
    color: ${({ theme }) => theme.cores.textoSuave};
  }
`;

const AcoesRail = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.espaco.sm};
`;

const Menu = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  color: ${({ theme }) => theme.cores.texto};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: block;
  }
`;

const Principal = styled.div`
  grid-area: conteudo;
  min-width: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    min-height: 0;
  }
`;

const Conteudo = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.espaco.xl} ${({ theme }) => theme.espaco.xl}
    ${({ theme }) => theme.espaco.xxxl};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.espaco.lg};
  }
`;

// A caixa de contexto. Fica vazia quando a página não manda nada, e nesse
// caso não ocupa espaço visual.
const Contexto = styled.aside`
  grid-area: contexto;
  width: 312px;
  background: ${({ theme }) => theme.cores.superficie};
  border-left: 1px solid ${({ theme }) => theme.cores.borda};
  position: sticky;
  top: 0;
  max-height: 100vh;
  overflow-y: auto;
  padding: ${({ theme }) => theme.espaco.xl} ${({ theme }) => theme.espaco.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco.lg};

  &:empty {
    width: 0;
    padding: 0;
  }

  @media (max-width: 1279px) {
    position: static;
    width: auto;
    max-height: none;
    padding: 0 ${({ theme }) => theme.espaco.xl} ${({ theme }) => theme.espaco.xl};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 ${({ theme }) => theme.espaco.lg} ${({ theme }) => theme.espaco.lg};
  }
`;

function classeAtiva({ isActive }) {
  return isActive ? 'ativo' : undefined;
}

function Corpo() {
  const { grupoAtivo, membroAtivo, sair } = useAuth();
  const { atividadesDoGrupo, disciplinasDoGrupo, membrosDoGrupo } = useData();
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  const registrarLateral = useRegistrarLateral();

  const aoSair = () => {
    sair();
    navigate('/login');
  };

  // As contagens ao lado de cada item, como no protótipo.
  const contagens = {
    atividades: atividadesDoGrupo(grupoAtivo.id).length,
    disciplinas: disciplinasDoGrupo(grupoAtivo.id).length,
    membros: membrosDoGrupo(grupoAtivo.id).length,
  };

  return (
    <Casca>
      <Rail>
        <TopoRail>
          <Marca>
            <Logo size={28} />
            Vértice
          </Marca>
          <Menu
            type="button"
            aria-label="Abrir menu"
            aria-expanded={menuAberto}
            onClick={() => setMenuAberto((aberto) => !aberto)}
          >
            ☰
          </Menu>
        </TopoRail>

        <Legenda $aberto={menuAberto}>{grupoAtivo?.nome}</Legenda>

        {/* Fecha o menu ao clicar em qualquer link (o clique borbulha). */}
        <Nav $aberto={menuAberto} onClick={() => setMenuAberto(false)}>
          <NavLink to="/painel" className={classeAtiva}>
            Painel
          </NavLink>
          <NavLink to="/disciplinas" className={classeAtiva}>
            Disciplinas
            <span className="contagem">{contagens.disciplinas}</span>
          </NavLink>
          <NavLink to="/atividades" className={classeAtiva}>
            Atividades
            <span className="contagem">{contagens.atividades}</span>
          </NavLink>
          <NavLink to="/membros" className={classeAtiva}>
            Membros
            <span className="contagem">{contagens.membros}</span>
          </NavLink>
        </Nav>

        <PeRail $aberto={menuAberto}>
          {/* Quem está usando, e com qual perfil (RN07). */}
          <GrupoInfo>
            <Avatar
              seed={membroAtivo?.avatar}
              nome={membroAtivo?.nome || grupoAtivo?.nome}
              tamanho={32}
            />
            <Identidade>
              <strong>{membroAtivo?.nome || grupoAtivo?.nome}</strong>
              <small>
                {membroAtivo ? rotuloPerfil(membroAtivo.perfil) : 'Montando o grupo'}
              </small>
            </Identidade>
          </GrupoInfo>
          <AcoesRail>
            <BotaoTema />
            <Button $variante="secundario" $tamanho="sm" onClick={aoSair}>
              Sair
            </Button>
          </AcoesRail>
        </PeRail>
      </Rail>

      <Principal>
        <Conteudo>
          <Outlet />
        </Conteudo>
        <Rodape />
      </Principal>

      <Contexto ref={registrarLateral} />
    </Casca>
  );
}

export function PrivateLayout() {
  return (
    <LateralProvider>
      <Corpo />
    </LateralProvider>
  );
}
