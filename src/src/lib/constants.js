// Valores fixos do domínio, centralizados para não repetir strings soltas pelo código.

// Status possíveis de uma atividade (os valores guardados batem com o modelo de dados).
export const STATUS = {
  A_FAZER: 'a fazer',
  FAZENDO: 'fazendo',
  CONCLUIDO: 'concluido',
};

export const STATUS_OPCOES = [
  { valor: STATUS.A_FAZER, rotulo: 'A fazer' },
  { valor: STATUS.FAZENDO, rotulo: 'Fazendo' },
  { valor: STATUS.CONCLUIDO, rotulo: 'Concluído' },
];

export function rotuloStatus(valor) {
  return STATUS_OPCOES.find((o) => o.valor === valor)?.rotulo ?? valor;
}

// Prioridade é opcional no modelo, mas deixamos pronta a escala.
export const PRIORIDADE = {
  BAIXA: 'baixa',
  MEDIA: 'media',
  ALTA: 'alta',
};

export const PRIORIDADE_OPCOES = [
  { valor: PRIORIDADE.BAIXA, rotulo: 'Baixa' },
  { valor: PRIORIDADE.MEDIA, rotulo: 'Média' },
  { valor: PRIORIDADE.ALTA, rotulo: 'Alta' },
];

export function rotuloPrioridade(valor) {
  return PRIORIDADE_OPCOES.find((o) => o.valor === valor)?.rotulo ?? valor;
}

// Paleta das disciplinas (RF/RN06 do modelo: `disciplina.cor`).
// A cor é só identidade visual da disciplina — serve para bater o olho e
// reconhecer na lista, no painel e, depois, nos conteúdos.
//
// O violeta da gamificação (#7c3aed / #a78bfa) NÃO entra aqui: aquela cor é
// exclusiva de experiência, conquistas e anel de peso.
// Os valores foram escolhidos para continuar legíveis nos dois temas.
export const CORES_DISCIPLINA = [
  { valor: '#0ea5e9', rotulo: 'Azul' },
  { valor: '#14b8a6', rotulo: 'Turquesa' },
  { valor: '#22c55e', rotulo: 'Verde' },
  { valor: '#eab308', rotulo: 'Amarelo' },
  { valor: '#f97316', rotulo: 'Laranja' },
  { valor: '#ef4444', rotulo: 'Vermelho' },
  { valor: '#ec4899', rotulo: 'Rosa' },
  { valor: '#78716c', rotulo: 'Pedra' },
];

export const COR_DISCIPLINA_PADRAO = CORES_DISCIPLINA[0].valor;

export function corDisciplinaValida(valor) {
  return CORES_DISCIPLINA.some((c) => c.valor === valor);
}

// Sugere uma cor ainda não usada pelo grupo, para duas disciplinas novas não
// nascerem iguais. Se todas já estiverem em uso, volta para a primeira.
export function sugerirCorDisciplina(coresEmUso = []) {
  const livre = CORES_DISCIPLINA.find((c) => !coresEmUso.includes(c.valor));
  return (livre ?? CORES_DISCIPLINA[0]).valor;
}

// RN07 — perfis dentro do grupo. Só o organizador gerencia membros,
// disciplinas e conteúdos e exclui o grupo; o participante cadastra e edita
// atividades. O campo nasce na migração; a checagem em si ainda não é feita.
export const PERFIL = {
  ORGANIZADOR: 'organizador',
  PARTICIPANTE: 'participante',
};

export const PERFIL_OPCOES = [
  { valor: PERFIL.ORGANIZADOR, rotulo: 'Organizador' },
  { valor: PERFIL.PARTICIPANTE, rotulo: 'Participante' },
];

export function rotuloPerfil(valor) {
  return PERFIL_OPCOES.find((o) => o.valor === valor)?.rotulo ?? valor;
}

// RN09 — o peso da atividade é um inteiro de 1 a 5. Sem peso definido, vale 1.
// É a razão entre pesos que dá o progresso (RN08/RN14): peso não é enfeite,
// é o que faz o Vértice medir avanço em vez de contar itens.
export const PESO = {
  MINIMO: 1,
  MAXIMO: 5,
  PADRAO: 1,
};

// Coage qualquer entrada para um peso válido. A validação que avisa a pessoa
// fica em `validacao.js`; aqui é a última linha de defesa do dado gravado.
export function normalizarPeso(valor) {
  const numero = Number.parseInt(valor, 10);
  if (!Number.isFinite(numero)) return PESO.PADRAO;
  return Math.min(PESO.MAXIMO, Math.max(PESO.MINIMO, numero));
}
