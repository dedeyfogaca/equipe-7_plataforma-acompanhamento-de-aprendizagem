import { useCallback, useEffect, useMemo, useState } from 'react';
import { buscarFeriados } from '../lib/feriados.js';

// Hook que carrega os feriados de um ou mais anos e expõe um jeito rápido
// de perguntar "tem feriado nesta data?". O useEffect dispara o fetch,
// demonstrando o ciclo de vida (carrega ao montar / quando os anos mudam).
export function useFeriados(anos) {
  const [feriados, setFeriados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  // Transforma a lista de anos numa string estável (evita re-disparar o efeito
  // só porque o array chegou com uma nova referência a cada render).
  const chave = useMemo(() => {
    const unicos = Array.from(new Set((anos || []).filter(Boolean))).sort();
    return unicos.join(',');
  }, [anos]);

  useEffect(() => {
    const lista = chave ? chave.split(',').map(Number) : [];
    if (lista.length === 0) {
      setFeriados([]);
      return;
    }

    let ativo = true;
    setCarregando(true);
    setErro(null);

    Promise.all(lista.map(buscarFeriados))
      .then((resultados) => {
        if (ativo) setFeriados(resultados.flat());
      })
      .catch((e) => {
        if (ativo) setErro(e.message || 'Não foi possível carregar os feriados.');
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    // Limpeza: se o componente desmontar antes da resposta, ignoramos o set.
    return () => {
      ativo = false;
    };
  }, [chave]);

  const mapaPorData = useMemo(() => {
    const mapa = {};
    for (const f of feriados) mapa[f.date] = f;
    return mapa;
  }, [feriados]);

  const feriadoEm = useCallback((iso) => mapaPorData[iso] || null, [mapaPorData]);

  return { feriados, carregando, erro, feriadoEm };
}
