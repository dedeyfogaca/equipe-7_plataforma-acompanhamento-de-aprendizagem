/* Componentes compartilhados do protótipo do Vértice.
   Cada tela monta a partir daqui, para nada sair do padrão. */

// ---------------------------------------------------------------- peso
// Anel segmentado: mostra "N de 5" sem depender do tooltip.
function peso(n, dica, cor) {
  const R = 11.5, C = 2 * Math.PI * R, seg = C / 5, gap = 3.2;
  // tokens em vez de cor fixa: o anel acompanha o tema claro e o escuro
  const forte = cor || 'var(--primaria)', txt = cor || 'var(--primariaForte)';
  let anel = '';
  for (let i = 0; i < 5; i++) {
    anel += `<circle cx="13.5" cy="13.5" r="${R}" fill="none"
      stroke="${i < n ? forte : 'var(--bordaForte)'}" stroke-width="2.6"
      stroke-dasharray="${seg - gap} ${C - seg + gap}"
      stroke-dashoffset="${-i * seg}" stroke-linecap="round"/>`;
  }
  // O número vai DENTRO do svg: assim ele fica no centro geométrico do anel
  // em qualquer contexto de layout, sem depender de centralização por CSS.
  return `<div class="dica">
    <div class="p-anel"><svg viewBox="0 0 27 27">
      <g transform="rotate(-90 13.5 13.5)">${anel}</g>
      <text x="13.5" y="13.5" text-anchor="middle" dominant-baseline="central"
        font-family="JB" font-size="11" font-weight="700" fill="${txt}">${n}</text>
    </svg></div>
    ${dica ? `<div class="balao"><b>Peso ${n} de 5</b>${dica}</div>` : ''}
  </div>`;
}

// ---------------------------------------------------------------- navegação
const ICONES = {
  painel: 'M3 12h7V3H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z',
  atividades: 'M9 5h10M9 12h10M9 19h10M4 5h.01M4 12h.01M4 19h.01',
  disciplinas: 'M4 5.5A2.5 2.5 0 016.5 3H19v15H6.5A2.5 2.5 0 004 20.5zM4 5.5V20.5',
  membros: 'M16 20v-1.5a3.5 3.5 0 00-3.5-3.5h-5A3.5 3.5 0 004 18.5V20M10 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7M20 20v-1.5a3.5 3.5 0 00-2.6-3.4M15 4.1a3.5 3.5 0 010 6.8',
  desempenho: 'M5 20V10M12 20V4M19 20v-6',
};

const MENU = [
  ['painel', 'Painel', ''],
  ['atividades', 'Atividades', '24'],
  ['disciplinas', 'Disciplinas', '4'],
  ['membros', 'Membros', '3'],
];

function lateral(ativo) {
  const itens = MENU.map(([id, nome, n]) => `
    <a class="item ${id === ativo ? 'on' : ''}" href="${id}.html">
      <svg class="ic" viewBox="0 0 24 24"><path d="${ICONES[id]}"/></svg>
      ${nome}${n ? `<span class="n">${n}</span>` : ''}
    </a>`).join('');

  return `<aside class="lateral">
    <a class="marca" href="painel.html"><div class="v">V</div><b>VÉRTICE</b></a>
    <div class="grupo"><div class="cap">Trio do TCC</div>${itens}</div>
    <button class="tema" onclick="alternarTema()">
      <svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 109 9 7 7 0 01-9-9z"/></svg>
      <span id="rotuloTema">Tema escuro</span>
    </button>
    <div class="perfil">
      <div class="av">AF</div>
      <div class="txt">
        <div class="nome">Andrey Fogaça</div>
        <div class="papel">Organizador</div>
      </div>
    </div>
  </aside>`;
}

// ---------------------------------------------------------------- cartão
function cartao(a) {
  const dica = `Vale ${a.peso} dos ${a.total} pontos de <span>${a.disciplina}</span>. `
             + `Concluir move a barra em ${a.move}%.`;
  return `<a class="card" data-s="${a.situacao}" href="detalhe.html">
    <div class="pilha">
      <div class="check ${a.situacao === 'concluida' ? 'ok' : ''}"></div>
      ${peso(a.peso, dica)}
    </div>
    <div class="corpo">
      <div class="tit">${a.titulo}</div>
      <div class="trilha">${a.disciplina} <span>›</span> <b>${a.conteudo}</b></div>
    </div>
    <div class="lado">
      <div class="prazo ${a.classePrazo || ''}">${a.prazo}</div>
      <div class="selos">
        <span class="selo ${a.prioridade.toLowerCase()}">${a.prioridade}</span>
        <span class="av" style="background:${a.cor};color:${a.corTexto}">${a.iniciais}</span>
      </div>
    </div>
  </a>`;
}

// ---------------------------------------------------------------- filtros
function filtros(ativo) {
  const S = [
    ['afazer', 8, 'A fazer'], ['fazendo', 3, 'Fazendo'],
    ['concluida', 11, 'Concluídas'], ['atrasada', 2, 'Atrasadas'],
  ];
  return `<div class="filtros">${S.map(([id, q, r]) => `
    <div class="fil ${id === ativo ? 'on' : ''}" data-s="${id}">
      <div class="q num">${q}</div><div class="r">${r}</div>
    </div>`).join('')}</div>`;
}

// ---------------------------------------------------------------- calendário
function calendario() {
  const PRIMEIRO = 2, NO_MES = 30, HOJE = 17;
  const FERIADOS = [7];
  const PRAZOS = { 11: 'c', 15: 'c', 18: 'f', 19: 'a', 22: 'f', 25: 'f', 28: 't', 30: 't' };
  let h = '';
  for (let i = 0; i < PRIMEIRO; i++) h += `<div class="dia fora">${31 - PRIMEIRO + i}</div>`;
  for (let d = 1; d <= NO_MES; d++) {
    const cls = ['dia'];
    if (d === HOJE) cls.push('hoje');
    else if (FERIADOS.includes(d)) cls.push('feriado');
    const p = PRAZOS[d] ? `<span class="pt ${PRAZOS[d]}"></span>` : '';
    h += `<div class="${cls.join(' ')}">${d}<div class="pts">${p}</div></div>`;
  }
  const resto = (7 - ((PRIMEIRO + NO_MES) % 7)) % 7;
  for (let i = 1; i <= resto; i++) h += `<div class="dia fora">${i}</div>`;

  return `<div class="cal">
    <div class="mes"><b>Setembro 2026</b><div class="setas"><span>‹</span><span>›</span></div></div>
    <div class="semana"><i>D</i><i>S</i><i>T</i><i>Q</i><i>Q</i><i>S</i><i>S</i></div>
    <div class="dias">${h}</div>
    <div class="legcal">
      <span><i style="background:var(--fazendo)"></i>Prazo</span>
      <span><i style="background:var(--perigo)"></i>Atrasada</span>
      <span><i style="background:var(--destaque)"></i>Feriado</span>
    </div>
  </div>`;
}

// ---------------------------------------------------------------- barra
function barra(nome, pct, meta, cor) {
  return `<div class="prog">
    <div class="l"><span class="nome">${nome}</span><span class="pct num">${pct}%</span></div>
    <div class="trilho"><i class="${cor || ''}" style="width:${pct}%"></i></div>
    ${meta ? `<div class="meta">${meta}</div>` : ''}
  </div>`;
}

// ---------------------------------------------------------------- montagem
function montar(tela, centro, direita) {
  document.body.innerHTML =
    `<div class="app">${lateral(tela)}<main class="centro">${centro}</main>` +
    (direita ? `<aside class="direita">${direita}</aside>` : '') + `</div>`;
  atualizaRotuloTema();
}


// ---------------------------------------------------------------- tema (RF08)
// A escolha vale para a sessão inteira do protótipo.
function alternarTema() {
  const raiz = document.documentElement;
  const escuro = raiz.dataset.tema === 'escuro';
  raiz.dataset.tema = escuro ? 'claro' : 'escuro';
  try { sessionStorage.setItem('tema', raiz.dataset.tema); } catch (e) {}
  atualizaRotuloTema();
}

function atualizaRotuloTema() {
  const r = document.getElementById('rotuloTema');
  if (r) r.textContent = document.documentElement.dataset.tema === 'escuro'
    ? 'Tema claro' : 'Tema escuro';
}

// restaura a escolha antes de pintar, para não piscar
(function () {
  try {
    const t = sessionStorage.getItem('tema');
    if (t) document.documentElement.dataset.tema = t;
  } catch (e) {}
})();
