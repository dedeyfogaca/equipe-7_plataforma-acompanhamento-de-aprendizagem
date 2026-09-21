// Experiência (RN10).
//
//   xp = peso × 10   ->   creditado ao responsável
//
// Três cláusulas que o cálculo precisa respeitar:
//
//   1. uma única vez por atividade;
//   2. estornada se o status deixar de ser 'concluido';
//   3. atividade sem responsável não gera experiência — e isso é normal,
//      não é erro.
//
// ## Por que a experiência é derivada, e não um contador
//
// O estorno é a parte que costuma faltar: concluir, desmarcar e concluir de
// novo não pode creditar duas vezes. Um contador guardado no membro, somado
// e subtraído a cada transição, é exatamente onde esse bug nasce — basta uma
// transição perdida para o número ficar errado para sempre, sem como saber.
//
// Aqui a experiência é uma projeção sobre as atividades: o registro da
// própria atividade é o que diz se o crédito está de pé. Concluída e com
// responsável, vale; deixou de estar concluída, deixou de valer. Creditar
// duas vezes é impossível, porque a atividade aparece uma vez só no conjunto.
//
// Isso também é o que o modelo de dados permite: a tabela `membro` do modelo
// lógico não tem campo de experiência, e `conquista` e `membro_conquista`
// estão fora do MVP. Guardar um total em algum lugar exigiria inventar
// estrutura que o MySQL não teria.

import { normalizarPeso, STATUS } from './constants.js';

// RN10 — cada ponto de peso vale 10 de experiência.
export const XP_POR_PESO = 10;

/**
 * Experiência que uma atividade credita neste momento.
 * Zero quando ela não está concluída (estorno) ou não tem responsável.
 */
export function xpDaAtividade(atividade) {
  if (!atividade) return 0;
  if (atividade.status !== STATUS.CONCLUIDO) return 0;
  if (!atividade.responsavelId) return 0;
  return normalizarPeso(atividade.peso) * XP_POR_PESO;
}

/**
 * Experiência que a atividade vale quando for concluída, independente do
 * status atual. Serve para a tela dizer quanto está em jogo.
 */
export function xpPotencial(atividade) {
  if (!atividade) return 0;
  return normalizarPeso(atividade.peso) * XP_POR_PESO;
}

/**
 * Experiência acumulada por um membro.
 *
 * @param {string} membroId
 * @param {Array} atividades atividades do grupo
 */
export function xpDoMembro(membroId, atividades = []) {
  if (!membroId) return 0;
  return atividades
    .filter((a) => a.responsavelId === membroId)
    .reduce((soma, a) => soma + xpDaAtividade(a), 0);
}

/**
 * Membros do grupo ordenados por experiência, do maior para o menor.
 * Empate mantém a ordem alfabética, para a lista não dançar a cada conclusão.
 *
 * A posição é compartilhada em caso de empate: dois primeiros lugares são
 * ambos 1, e o seguinte é 3.
 */
export function rankingDoGrupo(membros = [], atividades = []) {
  const linhas = membros
    .map((membro) => {
      const doMembro = atividades.filter((a) => a.responsavelId === membro.id);
      return {
        membro,
        xp: doMembro.reduce((soma, a) => soma + xpDaAtividade(a), 0),
        concluidas: doMembro.filter((a) => a.status === STATUS.CONCLUIDO).length,
      };
    })
    .sort((a, b) => b.xp - a.xp || a.membro.nome.localeCompare(b.membro.nome, 'pt-BR'));

  let posicao = 0;
  let xpAnterior = null;

  return linhas.map((linha, indice) => {
    if (linha.xp !== xpAnterior) {
      posicao = indice + 1;
      xpAnterior = linha.xp;
    }
    return { ...linha, posicao };
  });
}

/**
 * Experiência somada de um grupo inteiro. Atividade sem responsável não
 * entra, como manda o RN10.
 */
export function xpDoGrupo(atividades = []) {
  return atividades.reduce((soma, a) => soma + xpDaAtividade(a), 0);
}
