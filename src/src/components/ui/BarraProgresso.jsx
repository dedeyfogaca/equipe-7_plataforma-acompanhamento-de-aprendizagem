import styled from 'styled-components';

// Barra de progresso (RN08 / RN14), no desenho do protótipo.
//
// Recebe o resumo que `lib/progresso.js` devolve — nunca calcula nada. Um
// resumo nulo significa "sem atividade": o conteúdo fica fora do cálculo
// (RN08), então a barra diz isso em vez de desenhar 0%, que seria mentira.
//
// A cor é a primária, como no protótipo. O violeta não entra aqui: ele é
// exclusivo da gamificação, e progresso não é gamificação — é medida.

const Wrap = styled.div`
  min-width: 0;
`;

const Linha = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: ${({ theme }) => theme.espaco.sm};
  margin-bottom: 6px;
`;

const Nome = styled.span`
  font-size: 13.5px;
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
  color: ${({ theme }) => theme.cores.texto};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Percentual = styled.strong`
  font-family: ${({ theme }) => theme.fonte.numero};
  font-size: 12.5px;
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
  color: ${({ theme }) => theme.cores.primariaForte};
  flex: none;
`;

const Trilho = styled.div`
  height: 7px;
  border-radius: ${({ theme }) => theme.raio.full};
  background: ${({ theme }) => theme.cores.fundo};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  overflow: hidden;
`;

const Preenchido = styled.div`
  display: block;
  height: 100%;
  width: ${({ $fracao }) => `${$fracao * 100}%`};
  border-radius: ${({ theme }) => theme.raio.full};
  background: ${({ theme }) => theme.cores.primaria};
  transition: width 0.25s ease;
`;

const Meta = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.cores.textoSuave};
  margin-top: 5px;
`;

const SemAtividade = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.cores.textoSuave};
`;

export function BarraProgresso({ progresso, rotulo, meta = true }) {
  // Sem atividade não há progresso a mostrar (RN08).
  if (!progresso) {
    return <SemAtividade>Sem atividades — fora do cálculo</SemAtividade>;
  }

  const { percentual, fracao, pesoConcluido, pesoTotal } = progresso;
  const detalhe = `${pesoConcluido} de ${pesoTotal} pontos de peso`;

  return (
    <Wrap>
      <Linha>
        {rotulo ? <Nome>{rotulo}</Nome> : <span />}
        <Percentual>{percentual}%</Percentual>
      </Linha>
      <Trilho
        role="progressbar"
        aria-valuenow={percentual}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={detalhe}
        title={detalhe}
      >
        <Preenchido $fracao={fracao} />
      </Trilho>
      {meta && <Meta>{detalhe}</Meta>}
    </Wrap>
  );
}
