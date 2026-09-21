// Tokens do Design System.
// Há dois temas (escuro e claro) que compartilham espaçamento, fontes e
// breakpoints, mudando só as cores e as sombras. O acento é verde limão
// (#abfe43, a cor da marca Vértice).

// ----- Tokens compartilhados -----
const espaco = {
  xs: '4px',
  sm: '8px',
  md: '14px',
  lg: '18px',
  xl: '28px',
  xxl: '40px',
  xxxl: '60px',
};

const raio = {
  sm: '6px',
  md: '10px',
  lg: '16px',
  full: '999px',
};

// Uma família só em todo o sistema: Manrope. O que separa um título do
// texto é o peso, não a fonte. `display` e `corpo` apontam de propósito
// para a mesma pilha — se um dia divergirem, a decisão de tipografia foi
// quebrada.
const MANROPE =
  "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif";

const fonte = {
  display: MANROPE,
  corpo: MANROPE,
  // JetBrains Mono APENAS para número: peso, experiência, percentual,
  // contagem, data. Rótulo é texto e usa Manrope, mesmo em caixa alta.
  numero: "'JetBrains Mono', ui-monospace, 'SFMono-Regular', 'Courier New', monospace",
  tamanho: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.375rem',
    xxl: '1.75rem',
    xxxl: '2.25rem',
  },
  // Manrope vai de 400 a 800 aqui; é essa variação que dá hierarquia,
  // já que a família é uma só.
  peso: {
    normal: 400,
    medio: 500,
    forte: 600,
    negrito: 700,
    extra: 800,
  },
};

const breakpoints = {
  sm: '480px',
  md: '768px',
  lg: '1024px',
};

const layout = {
  larguraMax: '1080px',
  alturaHeader: '64px',
};

// ----- Tema escuro -----
const coresEscuras = {
  // Marca / ações principais (ciano)
  primaria: '#22d3ee',
  primariaForte: '#0891b2',
  primariaSuave: 'rgba(34, 211, 238, 0.12)',
  primariaBrilho: 'rgba(34, 211, 238, 0.45)',

  // Acento da marca -> verde limão (#abfe43)
  destaque: '#abfe43',
  destaqueForte: '#8fdc1f',
  destaqueSuave: 'rgba(171, 254, 67, 0.16)',
  destaqueBrilho: 'rgba(171, 254, 67, 0.45)',

  // Gamificação (violeta). EXCLUSIVA de experiência, conquistas e anel de
  // peso — nenhum outro papel do sistema usa esta cor. Antes, experiência
  // dividia o verde de "concluída" e nada se distinguia.
  gamificacao: '#a78bfa',
  gamificacaoForte: '#8b5cf6',
  gamificacaoSuave: 'rgba(167, 139, 250, 0.13)',
  gamificacaoTrilha: 'rgba(167, 139, 250, 0.22)',
  gamificacaoBorda: 'rgba(167, 139, 250, 0.32)',

  // Superfícies (escuras)
  fundo: '#0a0e17',
  fundoAlt: '#0e1320',
  superficie: '#121826',
  superficieAlt: '#172033',
  superficieHover: '#1b2438',

  // Texto
  texto: '#e6edf7',
  textoForte: '#ffffff',
  textoSuave: '#8b97ad',
  textoInverso: '#06121b',

  // Linhas e bordas
  borda: '#1f2a40',
  bordaForte: '#2b3a57',

  // Status das atividades
  aFazer: '#94a3b8',
  aFazerSuave: 'rgba(148, 163, 184, 0.14)',
  fazendo: '#fbbf24',
  fazendoSuave: 'rgba(251, 191, 36, 0.14)',
  concluido: '#34d399',
  concluidoSuave: 'rgba(52, 211, 153, 0.14)',

  // Prioridade
  prioridadeBaixa: '#34d399',
  prioridadeMedia: '#fbbf24',
  prioridadeAlta: '#fb7185',

  // Semânticas / setores de prazo (verde / amarelo / vermelho)
  perigo: '#fb7185',
  perigoSuave: 'rgba(251, 113, 133, 0.14)',
  sucesso: '#34d399',
  sucessoSuave: 'rgba(52, 211, 153, 0.14)',
  alerta: '#fbbf24',
  alertaSuave: 'rgba(251, 191, 36, 0.14)',
  info: '#38bdf8',
  infoSuave: 'rgba(56, 189, 248, 0.14)',
};

const sombraEscura = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.4)',
  md: '0 6px 18px rgba(0, 0, 0, 0.45)',
  lg: '0 18px 48px rgba(0, 0, 0, 0.55)',
  glowCiano: '0 0 0 1px rgba(34, 211, 238, 0.5), 0 10px 30px rgba(34, 211, 238, 0.22)',
  glowDestaque: '0 0 0 1px rgba(171, 254, 67, 0.5), 0 10px 30px rgba(171, 254, 67, 0.22)',
};

// ----- Tema claro -----
const coresClaras = {
  primaria: '#0891b2',
  primariaForte: '#0e7490',
  primariaSuave: 'rgba(8, 145, 178, 0.12)',
  primariaBrilho: 'rgba(8, 145, 178, 0.35)',

  // Verde limão mais fechado, para contrastar no fundo claro
  destaque: '#4d7c0f',
  destaqueForte: '#3f6212',
  destaqueSuave: 'rgba(77, 124, 15, 0.14)',
  destaqueBrilho: 'rgba(77, 124, 15, 0.35)',

  // Gamificação (violeta), exclusiva — ver comentário no tema escuro.
  gamificacao: '#7c3aed',
  gamificacaoForte: '#6d28d9',
  gamificacaoSuave: 'rgba(124, 58, 237, 0.09)',
  gamificacaoTrilha: 'rgba(124, 58, 237, 0.18)',
  gamificacaoBorda: 'rgba(124, 58, 237, 0.28)',

  fundo: '#f4f6fb',
  fundoAlt: '#eaeef6',
  superficie: '#ffffff',
  superficieAlt: '#f5f7fc',
  superficieHover: '#eef2f9',

  texto: '#1a2233',
  textoForte: '#0b1220',
  textoSuave: '#5b6678',
  textoInverso: '#ffffff',

  borda: '#e2e6ef',
  bordaForte: '#cdd4e1',

  aFazer: '#64748b',
  aFazerSuave: 'rgba(100, 116, 139, 0.12)',
  fazendo: '#d97706',
  fazendoSuave: 'rgba(217, 119, 6, 0.12)',
  concluido: '#16a34a',
  concluidoSuave: 'rgba(22, 163, 74, 0.12)',

  prioridadeBaixa: '#16a34a',
  prioridadeMedia: '#d97706',
  prioridadeAlta: '#dc2626',

  perigo: '#dc2626',
  perigoSuave: 'rgba(220, 38, 38, 0.10)',
  sucesso: '#16a34a',
  sucessoSuave: 'rgba(22, 163, 74, 0.12)',
  alerta: '#d97706',
  alertaSuave: 'rgba(217, 119, 6, 0.12)',
  info: '#2563eb',
  infoSuave: 'rgba(37, 99, 235, 0.12)',
};

const sombraClara = {
  sm: '0 1px 2px rgba(15, 23, 42, 0.06)',
  md: '0 6px 18px rgba(15, 23, 42, 0.10)',
  lg: '0 18px 48px rgba(15, 23, 42, 0.16)',
  glowCiano: '0 0 0 1px rgba(8, 145, 178, 0.4), 0 10px 24px rgba(8, 145, 178, 0.16)',
  glowDestaque: '0 0 0 1px rgba(77, 124, 15, 0.4), 0 10px 24px rgba(77, 124, 15, 0.16)',
};

export const temaEscuro = {
  esquema: 'dark',
  cores: coresEscuras,
  sombra: sombraEscura,
  espaco,
  raio,
  fonte,
  breakpoints,
  layout,
};

export const temaClaro = {
  esquema: 'light',
  cores: coresClaras,
  sombra: sombraClara,
  espaco,
  raio,
  fonte,
  breakpoints,
  layout,
};

// Alias retrocompatível (tema padrão = escuro).
export const theme = temaEscuro;
