import styled from 'styled-components';

// Cabeçalho padrão de página: título (condensado, em maiúsculas, com um traço
// ciano à esquerda) + subtítulo, e ações à direita.
const Wrap = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.espaco.lg};
  margin-bottom: ${({ theme }) => theme.espaco.xl};
  flex-wrap: wrap;
`;

const Titulo = styled.h1`
  font-size: ${({ theme }) => theme.fonte.tamanho.xxxl};
  font-weight: ${({ theme }) => theme.fonte.peso.extra};
  letter-spacing: -0.03em;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.espaco.md};

  &::before {
    content: '';
    width: 4px;
    align-self: stretch;
    min-height: 1.6em;
    border-radius: ${({ theme }) => theme.raio.full};
    background: linear-gradient(
      ${({ theme }) => theme.cores.primaria},
      ${({ theme }) => theme.cores.destaque}
    );
  }
`;

const Subtitulo = styled.p`
  color: ${({ theme }) => theme.cores.textoSuave};
  margin-top: 6px;
  font-size: ${({ theme }) => theme.fonte.tamanho.sm};
`;

const Acoes = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.espaco.sm};
  flex-wrap: wrap;
`;

export function PageHeader({ titulo, subtitulo, acoes }) {
  return (
    <Wrap>
      <div>
        <Titulo>{titulo}</Titulo>
        {subtitulo && <Subtitulo>{subtitulo}</Subtitulo>}
      </div>
      {acoes && <Acoes>{acoes}</Acoes>}
    </Wrap>
  );
}
