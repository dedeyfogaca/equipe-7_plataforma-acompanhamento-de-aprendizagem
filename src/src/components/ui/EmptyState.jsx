import styled from 'styled-components';

// Estado vazio reaproveitável (sem atividades, sem membros, filtro sem resultado).
const Wrap = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.espaco.xxxl} ${({ theme }) => theme.espaco.xl};
  color: ${({ theme }) => theme.cores.textoSuave};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.espaco.md};
`;

const Icone = styled.div`
  font-size: 2.5rem;
  line-height: 1;
`;

const Titulo = styled.h3`
  color: ${({ theme }) => theme.cores.texto};
  font-size: ${({ theme }) => theme.fonte.tamanho.lg};
`;

const Descricao = styled.p`
  max-width: 420px;
`;

export function EmptyState({ icone = '📭', titulo, descricao, children }) {
  return (
    <Wrap>
      <Icone aria-hidden="true">{icone}</Icone>
      {titulo && <Titulo>{titulo}</Titulo>}
      {descricao && <Descricao>{descricao}</Descricao>}
      {children}
    </Wrap>
  );
}
