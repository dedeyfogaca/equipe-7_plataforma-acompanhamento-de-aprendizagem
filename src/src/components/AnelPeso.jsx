import styled from 'styled-components';

import { PESO, normalizarPeso } from '../lib/constants.js';

// T24 — anel de peso, nas medidas do protótipo.
//
// O peso (1 a 5) é o que faz o Vértice medir avanço em vez de contar itens:
// o progresso é a razão entre peso concluído e peso total (RN08/RN14).
// Por isso ele aparece sozinho, à esquerda do cartão e sob o check — ao lado
// da prioridade os dois eram confundidos.
//
// O número vai DENTRO do svg, como no protótipo: assim ele fica no centro
// geométrico do anel em qualquer contexto de layout, sem depender de
// centralização por CSS.
//
// A cor é a primária (ciano), não o violeta da gamificação. Peso é a medida
// da atividade, não recompensa. E como todo cartão da lista tem um anel,
// pintá-los de violeta espalharia a cor pela tela inteira e mataria o
// destaque que ela existe para dar: o violeta só funciona porque é raro.

const TAMANHO = 27;
const CENTRO = TAMANHO / 2;
const RAIO = 11.5;
const PERIMETRO = 2 * Math.PI * RAIO;
const SEGMENTO = PERIMETRO / PESO.MAXIMO;
const FOLGA = 3.2;

const Wrap = styled.span`
  display: block;
  width: ${TAMANHO}px;
  height: ${TAMANHO}px;
  flex: none;
  cursor: help;

  svg {
    width: 100%;
    height: 100%;
    display: block;
  }
`;

const Segmento = styled.circle`
  stroke: ${({ $cheio, theme }) =>
    $cheio ? theme.cores.primaria : theme.cores.bordaForte};
`;

const Numero = styled.text`
  fill: ${({ theme }) => theme.cores.primariaForte};
  font-family: ${({ theme }) => theme.fonte.numero};
`;

export function AnelPeso({ peso }) {
  const valor = normalizarPeso(peso);
  const segmentos = Array.from({ length: PESO.MAXIMO }, (_, i) => i);

  return (
    <Wrap
      title={`Peso ${valor} de ${PESO.MAXIMO}`}
      aria-label={`Peso ${valor} de ${PESO.MAXIMO}`}
      role="img"
    >
      <svg viewBox={`0 0 ${TAMANHO} ${TAMANHO}`}>
        {/* Começa no topo e anda no sentido horário. */}
        <g transform={`rotate(-90 ${CENTRO} ${CENTRO})`}>
          {segmentos.map((indice) => (
            <Segmento
              key={indice}
              cx={CENTRO}
              cy={CENTRO}
              r={RAIO}
              fill="none"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeDasharray={`${SEGMENTO - FOLGA} ${PERIMETRO - SEGMENTO + FOLGA}`}
              strokeDashoffset={-indice * SEGMENTO}
              $cheio={indice < valor}
            />
          ))}
        </g>
        <Numero
          x={CENTRO}
          y={CENTRO}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="11"
          fontWeight="700"
        >
          {valor}
        </Numero>
      </svg>
    </Wrap>
  );
}
