// Avatares via DiceBear, no estilo "Croodles Neutral".
// O avatar de um membro vem de uma semente ALEATÓRIA salva no cadastro (campo
// `avatar`), não do nome: se a pessoa não gostar, é só sortear outra semente.
// Grupos e dados antigos sem semente usam o nome como reserva.

const ESTILO = 'croodles-neutral';

// Fundos pastéis padrão da DiceBear (a cor é escolhida pela semente), para os
// traços do doodle ficarem visíveis também no tema escuro.
const FUNDOS = 'b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf';

export function urlAvatar(seed, { tamanho = 96 } = {}) {
  const semente = encodeURIComponent((seed || 'membro').trim().toLowerCase() || 'membro');
  return `https://api.dicebear.com/9.x/${ESTILO}/svg?seed=${semente}&size=${tamanho}&backgroundColor=${FUNDOS}`;
}

// Sorteia uma semente nova (curta e aleatória) para o avatar.
export function novaSeedAvatar() {
  return Math.random().toString(36).slice(2, 10);
}

// Iniciais para o fallback (ex.: "Ana Souza" -> "AS").
export function iniciais(nome) {
  if (!nome) return '?';
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return '?';
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}
