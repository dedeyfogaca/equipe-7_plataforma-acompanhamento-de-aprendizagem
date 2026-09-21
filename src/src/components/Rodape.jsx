import styled from 'styled-components';

// Rodapé do sistema: identificação do trabalho e dos dois integrantes.
// Sem contato pessoal — o repositório da entrega é público.

const Wrap = styled.footer`
  border-top: 1px solid ${({ theme }) => theme.cores.borda};
  padding: ${({ theme }) => theme.espaco.xl} ${({ theme }) => theme.espaco.lg};
`;

const Inner = styled.div`
  max-width: ${({ theme }) => theme.layout.larguraMax};
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco.xs};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    text-align: center;
  }
`;

const Credito = styled.p`
  color: ${({ theme }) => theme.cores.texto};
  font-size: ${({ theme }) => theme.fonte.tamanho.sm};

  strong {
    font-weight: ${({ theme }) => theme.fonte.peso.forte};
  }
`;

const Disciplina = styled.p`
  color: ${({ theme }) => theme.cores.textoSuave};
  font-size: ${({ theme }) => theme.fonte.tamanho.xs};
`;

export function Rodape() {
  return (
    <Wrap>
      <Inner>
        <Credito>
          <strong>Vértice</strong> · Equipe 7 — Andrey Fogaça e Matheus Saraiva Faustin
        </Credito>
        <Disciplina>Imersão Profissional: Projeto de Software · ADSIS4S</Disciplina>
      </Inner>
    </Wrap>
  );
}
