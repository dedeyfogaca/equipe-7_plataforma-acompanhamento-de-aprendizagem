import { useMemo, useState } from 'react';
import styled, { useTheme } from 'styled-components';

import { Card } from './ui/Card.jsx';
import { hojeISO, paraISO } from '../lib/datas.js';

// Calendário do mês, para a coluna de contexto do Painel.
//
// O feriado entra no calendário, e não como bloco separado na lista: num
// calendário a informação útil é "o dia 12 está tomado", e isso se vê na
// grade, não numa relação de datas. Ele pinta o fundo do dia, como no
// protótipo — é mais visível que um ponto e sobra espaço para os prazos.
//
// Os pontos são as entregas, coloridas pela situação da atividade. É o
// cruzamento dos dois que interessa: a entrega que cai em feriado.

const DIAS_DA_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const Caixa = styled(Card)`
  padding: ${({ theme }) => theme.espaco.md};
`;

const Cabecalho = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.espaco.sm};
  margin-bottom: ${({ theme }) => theme.espaco.md};
`;

const Mes = styled.strong`
  font-size: ${({ theme }) => theme.fonte.tamanho.sm};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
  text-transform: capitalize;
`;

const Passo = styled.button`
  width: 26px;
  height: 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.raio.sm};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  background: none;
  color: ${({ theme }) => theme.cores.textoSuave};
  font-size: ${({ theme }) => theme.fonte.tamanho.xs};
  line-height: 1;

  &:hover {
    color: ${({ theme }) => theme.cores.primaria};
    border-color: ${({ theme }) => theme.cores.primaria};
  }
`;

const Grade = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
`;

const Semana = styled.span`
  text-align: center;
  font-size: ${({ theme }) => theme.fonte.tamanho.xs};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
  color: ${({ theme }) => theme.cores.textoSuave};
  padding-bottom: 4px;
`;

const Dia = styled.div`
  position: relative;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  border-radius: 7px;
  font-family: ${({ theme }) => theme.fonte.numero};
  font-size: 11.5px;
  color: ${({ $doMes, theme }) =>
    $doMes ? theme.cores.texto : theme.cores.bordaForte};

  /* Feriado pinta o fundo; hoje vem por cima dele. */
  ${({ $feriado, theme }) =>
    $feriado &&
    `
      background: ${theme.cores.destaqueSuave};
      color: ${theme.cores.destaque};
      font-weight: ${theme.fonte.peso.negrito};
    `}

  ${({ $hoje, theme }) =>
    $hoje &&
    `
      background: ${theme.cores.primaria};
      color: ${theme.cores.textoInverso};
      font-weight: ${theme.fonte.peso.negrito};
    `}
`;

const Pontos = styled.span`
  display: flex;
  gap: 2px;
  height: 4px;
  align-items: center;
`;

// A cor do ponto é a situação da entrega daquele dia.
function corDaSituacao(theme, situacao) {
  return (
    {
      atrasadas: theme.cores.perigo,
      fazendo: theme.cores.fazendo,
      concluidas: theme.cores.concluido,
      afazer: theme.cores.aFazer,
    }[situacao] || theme.cores.aFazer
  );
}

const Ponto = styled.span.attrs({ 'aria-hidden': 'true' })`
  width: 4px;
  height: 4px;
  border-radius: ${({ theme }) => theme.raio.full};
  background: ${({ $situacao, theme }) => corDaSituacao(theme, $situacao)};
`;

const Amostra = styled.span.attrs({ 'aria-hidden': 'true' })`
  width: 7px;
  height: 7px;
  border-radius: ${({ theme }) => theme.raio.full};
  background: ${({ $cor }) => $cor};
`;

const Legenda = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.espaco.md};
  margin-top: ${({ theme }) => theme.espaco.md};
  padding-top: ${({ theme }) => theme.espaco.sm};
  border-top: 1px solid ${({ theme }) => theme.cores.borda};
  font-size: ${({ theme }) => theme.fonte.tamanho.xs};
  color: ${({ theme }) => theme.cores.textoSuave};
`;

const ItemLegenda = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
`;

// Devolve as 6 semanas que cobrem o mês, começando no domingo.
function gradeDoMes(ano, mes) {
  const primeiro = new Date(ano, mes, 1);
  const inicio = new Date(ano, mes, 1 - primeiro.getDay());

  return Array.from({ length: 42 }, (_, i) => {
    const data = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate() + i);
    return { iso: paraISO(data), dia: data.getDate(), doMes: data.getMonth() === mes };
  });
}

export function CalendarioMes({ feriadoEm, prazos = [] }) {
  const { cores } = useTheme();
  const hoje = hojeISO();
  const [referencia, setReferencia] = useState(() => {
    const d = new Date();
    return { ano: d.getFullYear(), mes: d.getMonth() };
  });

  const dias = useMemo(
    () => gradeDoMes(referencia.ano, referencia.mes),
    [referencia.ano, referencia.mes]
  );

  // O que vence em cada dia, com a situação de cada entrega.
  const prazoPorDia = useMemo(() => {
    const mapa = {};
    prazos.forEach((entrega) => {
      if (!entrega.prazo) return;
      (mapa[entrega.prazo] ??= []).push(entrega);
    });
    return mapa;
  }, [prazos]);

  const andar = (passo) =>
    setReferencia(({ ano, mes }) => {
      const d = new Date(ano, mes + passo, 1);
      return { ano: d.getFullYear(), mes: d.getMonth() };
    });

  const nomeDoMes = new Date(referencia.ano, referencia.mes, 1).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <Caixa>
      <Cabecalho>
        <Passo type="button" aria-label="Mês anterior" onClick={() => andar(-1)}>
          ‹
        </Passo>
        <Mes>{nomeDoMes}</Mes>
        <Passo type="button" aria-label="Próximo mês" onClick={() => andar(1)}>
          ›
        </Passo>
      </Cabecalho>

      <Grade role="grid">
        {DIAS_DA_SEMANA.map((letra, i) => (
          <Semana key={`${letra}-${i}`} aria-hidden="true">
            {letra}
          </Semana>
        ))}

        {dias.map(({ iso, dia, doMes }) => {
          const feriado = doMes ? feriadoEm?.(iso) : null;
          const entregas = doMes ? prazoPorDia[iso] ?? [] : [];

          const descricao = [
            feriado ? `Feriado: ${feriado.name}` : null,
            entregas.length
              ? `${entregas.length} ${entregas.length === 1 ? 'entrega' : 'entregas'}: ${entregas
                  .map((e) => e.titulo)
                  .join(', ')}`
              : null,
          ]
            .filter(Boolean)
            .join(' · ');

          return (
            <Dia
              key={iso}
              $doMes={doMes}
              $feriado={Boolean(feriado)}
              $hoje={doMes && iso === hoje}
              title={descricao || undefined}
              aria-label={doMes ? `${dia}${descricao ? ` — ${descricao}` : ''}` : undefined}
            >
              {dia}
              <Pontos>
                {/* No máximo três pontos: além disso vira mancha. */}
                {entregas.slice(0, 3).map((entrega, i) => (
                  <Ponto key={i} $situacao={entrega.situacao} />
                ))}
              </Pontos>
            </Dia>
          );
        })}
      </Grade>

      <Legenda>
        <ItemLegenda>
          <Amostra $cor={cores.aFazer} /> entrega
        </ItemLegenda>
        <ItemLegenda>
          <Amostra $cor={cores.perigo} /> atrasada
        </ItemLegenda>
        <ItemLegenda>
          <Amostra $cor={cores.destaque} /> feriado
        </ItemLegenda>
      </Legenda>
    </Caixa>
  );
}
