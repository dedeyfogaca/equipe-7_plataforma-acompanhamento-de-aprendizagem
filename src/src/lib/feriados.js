// Integração com a BrasilAPI (feriados nacionais).
// É essa chamada que cumpre o requisito de Fetch API + JSON.
// Cruzamos os feriados com os prazos das atividades para avisar quando uma
// entrega cai num feriado.
//
// Robustez: cada chamada tem timeout (não trava a tela se a API demorar);
// se a BrasilAPI falhar (fora do ar, bloqueio, lentidão), tentamos uma API
// reserva (Nager.Date); e ainda guardamos em cache para funcionar offline.
//
// BrasilAPI: https://brasilapi.com.br/api/feriados/v1/{ano}
//   -> [{ "date": "2026-01-01", "name": "...", "type": "national" }, ...]
// Nager.Date: https://date.nager.at/api/v3/PublicHolidays/{ano}/BR
//   -> [{ "date": "2026-01-01", "localName": "...", "name": "..." }, ...]

const BRASIL_API = 'https://brasilapi.com.br/api/feriados/v1';
const NAGER_API = 'https://date.nager.at/api/v3/PublicHolidays';
const TIMEOUT_MS = 8000;

// Cache em memória para não refazer a mesma chamada na mesma sessão.
const cacheMemoria = new Map();

async function buscarJSON(url) {
  const controlador = new AbortController();
  const timer = setTimeout(() => controlador.abort(), TIMEOUT_MS);
  try {
    const resposta = await fetch(url, {
      signal: controlador.signal,
      headers: { Accept: 'application/json' },
    });
    if (!resposta.ok) {
      throw new Error(`HTTP ${resposta.status}`);
    }
    return await resposta.json();
  } finally {
    clearTimeout(timer);
  }
}

// Normaliza para o formato { date, name, type } usado no app.
async function daBrasilAPI(ano) {
  const dados = await buscarJSON(`${BRASIL_API}/${ano}`);
  return dados.map((f) => ({ date: f.date, name: f.name, type: f.type || 'national' }));
}

async function doNager(ano) {
  const dados = await buscarJSON(`${NAGER_API}/${ano}/BR`);
  return dados.map((f) => ({
    date: f.date,
    name: f.localName || f.name,
    type: 'national',
  }));
}

export async function buscarFeriados(ano) {
  if (cacheMemoria.has(ano)) {
    return cacheMemoria.get(ano);
  }

  const chaveCache = `feriados:${ano}`;

  try {
    let dados;
    try {
      // 1) Fonte oficial: BrasilAPI.
      dados = await daBrasilAPI(ano);
    } catch {
      // 2) Reserva: Nager.Date (se a BrasilAPI falhar/expirar).
      dados = await doNager(ano);
    }
    cacheMemoria.set(ano, dados);
    try {
      localStorage.setItem(chaveCache, JSON.stringify(dados));
    } catch {
      /* ignora limite de armazenamento */
    }
    return dados;
  } catch (erro) {
    // 3) Plano final: reaproveita o cache salvo para não quebrar a tela.
    try {
      const salvo = localStorage.getItem(chaveCache);
      if (salvo) {
        const dados = JSON.parse(salvo);
        cacheMemoria.set(ano, dados);
        return dados;
      }
    } catch {
      /* sem cache utilizável */
    }
    throw erro;
  }
}
