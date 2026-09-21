import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { CHAVES, lerColecao, novoId, salvarColecao } from '../lib/storage.js';
import { COR_DISCIPLINA_PADRAO, normalizarPeso, PERFIL, STATUS } from '../lib/constants.js';
import {
  progressoAntesDe as calcularProgressoAntesDe,
  progressoDaDisciplina as calcularProgressoDaDisciplina,
  progressoDoConteudo as calcularProgressoDoConteudo,
} from '../lib/progresso.js';
import {
  rankingDoGrupo as calcularRankingDoGrupo,
  xpDoMembro as calcularXpDoMembro,
} from '../lib/gamificacao.js';

// Guarda as coleções (grupos, membros, disciplinas, conteúdos, atividades) e expõe as operações
// de cadastro/edição/exclusão. Tudo fica em useState e é espelhado no
// LocalStorage por useEffect, então recarregar a página não perde nada.
const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [grupos, setGrupos] = useState(() => lerColecao(CHAVES.grupos));
  const [membros, setMembros] = useState(() => lerColecao(CHAVES.membros));
  const [disciplinas, setDisciplinas] = useState(() => lerColecao(CHAVES.disciplinas));
  const [conteudos, setConteudos] = useState(() => lerColecao(CHAVES.conteudos));
  const [atividades, setAtividades] = useState(() => lerColecao(CHAVES.atividades));

  // Persistência: sempre que a coleção muda, regravamos a chave correspondente.
  useEffect(() => {
    salvarColecao(CHAVES.grupos, grupos);
  }, [grupos]);
  useEffect(() => {
    salvarColecao(CHAVES.membros, membros);
  }, [membros]);
  useEffect(() => {
    salvarColecao(CHAVES.disciplinas, disciplinas);
  }, [disciplinas]);
  useEffect(() => {
    salvarColecao(CHAVES.conteudos, conteudos);
  }, [conteudos]);
  useEffect(() => {
    salvarColecao(CHAVES.atividades, atividades);
  }, [atividades]);

  // ----- Grupos -----
  const criarGrupo = useCallback(({ nome, descricao = '' }) => {
    const grupo = {
      id: novoId(),
      nome: nome.trim(),
      descricao: descricao.trim(),
      criadoEm: new Date().toISOString(),
    };
    setGrupos((atual) => [...atual, grupo]);
    return grupo;
  }, []);

  // RN02 — exclui um grupo e, em cascata, suas disciplinas, os conteúdos
  // dessas disciplinas, as atividades desses conteúdos e os membros. Nem
  // conteúdo nem atividade guardam grupoId: a cascata desce pela cadeia.
  const removerGrupo = useCallback(
    (id) => {
      const idsDisciplinas = new Set(
        disciplinas.filter((d) => d.grupoId === id).map((d) => d.id)
      );
      const idsConteudos = new Set(
        conteudos.filter((c) => idsDisciplinas.has(c.disciplinaId)).map((c) => c.id)
      );

      setGrupos((atual) => atual.filter((g) => g.id !== id));
      setMembros((atual) => atual.filter((m) => m.grupoId !== id));
      setDisciplinas((atual) => atual.filter((d) => !idsDisciplinas.has(d.id)));
      setConteudos((atual) => atual.filter((c) => !idsConteudos.has(c.id)));
      setAtividades((atual) => atual.filter((a) => !idsConteudos.has(a.conteudoId)));
    },
    [disciplinas, conteudos]
  );

  // ----- Membros -----
  const criarMembro = useCallback(
    ({ nome, grupoId, funcao = '', email = '', avatar = '', perfil }) => {
      // RN07 — o primeiro membro do grupo é o organizador; os seguintes
      // entram como participantes. Mesma regra que a migração aplicou aos
      // grupos que já existiam.
      const primeiroDoGrupo = !membros.some((m) => m.grupoId === grupoId);

      const membro = {
        id: novoId(),
        nome: nome.trim(),
        grupoId,
        funcao: funcao.trim(),
        email: email.trim(),
        // Semente do avatar (sorteada no formulário, independente do nome).
        avatar: avatar.trim(),
        perfil: perfil || (primeiroDoGrupo ? PERFIL.ORGANIZADOR : PERFIL.PARTICIPANTE),
      };
      setMembros((atual) => [...atual, membro]);
      return membro;
    },
    [membros]
  );

  const atualizarMembro = useCallback((id, dados) => {
    setMembros((atual) => atual.map((m) => (m.id === id ? { ...m, ...dados } : m)));
  }, []);

  const removerMembro = useCallback((id) => {
    setMembros((atual) => atual.filter((m) => m.id !== id));
    // As atividades que estavam com esse responsável passam a ficar "sem responsável".
    setAtividades((atual) =>
      atual.map((a) => (a.responsavelId === id ? { ...a, responsavelId: '' } : a))
    );
  }, []);

  // ----- Disciplinas (T06) -----
  // Espelha a tabela `disciplina` do modelo lógico: id, id_grupo, nome, cor,
  // data_criacao. A unicidade de (grupo, nome) é checada em validarDisciplina.
  const criarDisciplina = useCallback(({ nome, grupoId, cor = COR_DISCIPLINA_PADRAO }) => {
    const disciplina = {
      id: novoId(),
      nome: (nome || '').trim(),
      cor: cor || COR_DISCIPLINA_PADRAO,
      grupoId,
      criadaEm: new Date().toISOString(),
    };
    setDisciplinas((atual) => [...atual, disciplina]);
    return disciplina;
  }, []);

  const atualizarDisciplina = useCallback((id, dados) => {
    setDisciplinas((atual) => atual.map((d) => (d.id === id ? { ...d, ...dados } : d)));
  }, []);

  // RN02 — excluir a disciplina leva junto seus conteúdos e as atividades
  // deles.
  const removerDisciplina = useCallback(
    (id) => {
      const idsConteudos = new Set(
        conteudos.filter((c) => c.disciplinaId === id).map((c) => c.id)
      );
      setDisciplinas((atual) => atual.filter((d) => d.id !== id));
      setConteudos((atual) => atual.filter((c) => !idsConteudos.has(c.id)));
      setAtividades((atual) => atual.filter((a) => !idsConteudos.has(a.conteudoId)));
    },
    [conteudos]
  );

  const obterDisciplina = useCallback(
    (id) => disciplinas.find((d) => d.id === id) || null,
    [disciplinas]
  );

  // ----- Conteúdos (T07) -----
  // Espelha a tabela `conteudo`: id, id_disciplina, nome, descricao, ordem.
  // Repare que não há grupoId — o grupo chega por disciplina (RN13).
  const criarConteudo = useCallback(
    ({ nome, descricao = '', disciplinaId }) => {
      // A ordem nasce no fim da lista da disciplina.
      const ultimaOrdem = conteudos
        .filter((c) => c.disciplinaId === disciplinaId)
        .reduce((maior, c) => Math.max(maior, c.ordem ?? 0), -1);

      const conteudo = {
        id: novoId(),
        nome: (nome || '').trim(),
        descricao: (descricao || '').trim(),
        disciplinaId,
        ordem: ultimaOrdem + 1,
      };
      setConteudos((atual) => [...atual, conteudo]);
      return conteudo;
    },
    [conteudos]
  );

  const atualizarConteudo = useCallback((id, dados) => {
    setConteudos((atual) => atual.map((c) => (c.id === id ? { ...c, ...dados } : c)));
  }, []);

  // RN13 — não se exclui conteúdo deixando atividade solta: as atividades
  // vinculadas saem junto.
  const removerConteudo = useCallback((id) => {
    setConteudos((atual) => atual.filter((c) => c.id !== id));
    setAtividades((atual) => atual.filter((a) => a.conteudoId !== id));
  }, []);

  const obterConteudo = useCallback(
    (id) => conteudos.find((c) => c.id === id) || null,
    [conteudos]
  );

  // Troca a posição com o vizinho. `ordem` existe para o grupo decidir a
  // sequência do conteúdo dentro da disciplina, que raramente é alfabética.
  const moverConteudo = useCallback((id, direcao) => {
    setConteudos((atual) => {
      const alvo = atual.find((c) => c.id === id);
      if (!alvo) return atual;

      const irmaos = atual
        .filter((c) => c.disciplinaId === alvo.disciplinaId)
        .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));

      const posicao = irmaos.findIndex((c) => c.id === id);
      const vizinho = irmaos[posicao + (direcao === 'cima' ? -1 : 1)];
      if (!vizinho) return atual;

      return atual.map((c) => {
        if (c.id === alvo.id) return { ...c, ordem: vizinho.ordem };
        if (c.id === vizinho.id) return { ...c, ordem: alvo.ordem };
        return c;
      });
    });
  }, []);

  // ----- Atividades -----
  // Espelha a tabela `atividade`. Note que não há grupoId: o grupo chega por
  // conteudo -> disciplina -> grupo (RN13).
  const criarAtividade = useCallback((dados) => {
    const status = dados.status || STATUS.A_FAZER;
    const atividade = {
      id: novoId(),
      titulo: (dados.titulo || '').trim(),
      descricao: (dados.descricao || '').trim(),
      conteudoId: dados.conteudoId,
      prazo: dados.prazo || '',
      // RN09 — peso é inteiro de 1 a 5, e sem peso definido vale 1. O campo
      // no formulário é o T12; aqui o padrão já fica garantido.
      peso: normalizarPeso(dados.peso),
      status,
      prioridade: dados.prioridade || '',
      responsavelId: dados.responsavelId || '',
      criadaEm: new Date().toISOString(),
      dataConclusao: status === STATUS.CONCLUIDO ? new Date().toISOString() : null,
    };
    setAtividades((atual) => [...atual, atividade]);
    return atividade;
  }, []);

  const atualizarAtividade = useCallback((id, dados) => {
    setAtividades((atual) =>
      atual.map((a) => {
        if (a.id !== id) return a;

        const atualizada = { ...a, ...dados };
        if (dados.peso !== undefined) {
          atualizada.peso = normalizarPeso(dados.peso);
        }

        // `dataConclusao` acompanha o status: é gravada quando a atividade
        // passa a concluída e apagada quando deixa de ser. Sem ela não dá
        // para calcular ofensiva depois (RN11).
        const eraConcluida = a.status === STATUS.CONCLUIDO;
        const ficouConcluida = atualizada.status === STATUS.CONCLUIDO;
        if (!eraConcluida && ficouConcluida) {
          atualizada.dataConclusao = new Date().toISOString();
        } else if (eraConcluida && !ficouConcluida) {
          atualizada.dataConclusao = null;
        }

        return atualizada;
      })
    );
  }, []);

  const removerAtividade = useCallback((id) => {
    setAtividades((atual) => atual.filter((a) => a.id !== id));
  }, []);

  const obterAtividade = useCallback((id) => atividades.find((a) => a.id === id) || null, [atividades]);

  // ----- Seletores por grupo (cada grupo só enxerga o que é dele) -----
  const membrosDoGrupo = useCallback(
    (grupoId) => membros.filter((m) => m.grupoId === grupoId),
    [membros]
  );
  const disciplinasDoGrupo = useCallback(
    (grupoId) => disciplinas.filter((d) => d.grupoId === grupoId),
    [disciplinas]
  );
  const conteudosDaDisciplina = useCallback(
    (disciplinaId) =>
      conteudos
        .filter((c) => c.disciplinaId === disciplinaId)
        .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0)),
    [conteudos]
  );
  // RN01 — o conteúdo não guarda grupoId, então o filtro por grupo atravessa
  // a cadeia conteudo -> disciplina -> grupo.
  const conteudosDoGrupo = useCallback(
    (grupoId) => {
      const idsDisciplinas = new Set(
        disciplinas.filter((d) => d.grupoId === grupoId).map((d) => d.id)
      );
      return conteudos.filter((c) => idsDisciplinas.has(c.disciplinaId));
    },
    [conteudos, disciplinas]
  );
  // RN01 — a atividade não guarda grupoId: o filtro por grupo atravessa
  // atividade -> conteudo -> disciplina -> grupo.
  const atividadesDoGrupo = useCallback(
    (grupoId) => {
      const idsDisciplinas = new Set(
        disciplinas.filter((d) => d.grupoId === grupoId).map((d) => d.id)
      );
      const idsConteudos = new Set(
        conteudos.filter((c) => idsDisciplinas.has(c.disciplinaId)).map((c) => c.id)
      );
      return atividades.filter((a) => idsConteudos.has(a.conteudoId));
    },
    [atividades, conteudos, disciplinas]
  );
  const atividadesDoConteudo = useCallback(
    (conteudoId) => atividades.filter((a) => a.conteudoId === conteudoId),
    [atividades]
  );
  const atividadesDaDisciplina = useCallback(
    (disciplinaId) => {
      const idsConteudos = new Set(
        conteudos.filter((c) => c.disciplinaId === disciplinaId).map((c) => c.id)
      );
      return atividades.filter((a) => idsConteudos.has(a.conteudoId));
    },
    [atividades, conteudos]
  );
  // ----- Progresso (T18) -----
  // O cálculo mora em `lib/progresso.js`; aqui só juntamos as atividades que
  // ele precisa. A mesma regra alimenta a lista de disciplinas e o detalhe.
  // Devolvem `null` quando não há atividade — ausente, não zero (RN08).
  const progressoDoConteudo = useCallback(
    (conteudoId) => calcularProgressoDoConteudo(atividades.filter((a) => a.conteudoId === conteudoId)),
    [atividades]
  );

  // RF15 — quanto o conteúdo valia antes desta atividade ser concluída.
  const progressoAntesDe = useCallback(
    (atividade) =>
      calcularProgressoAntesDe(
        atividades.filter((a) => a.conteudoId === atividade?.conteudoId),
        atividade?.id
      ),
    [atividades]
  );

  const progressoDaDisciplina = useCallback(
    (disciplinaId) => {
      const atividadesPorConteudo = conteudos
        .filter((c) => c.disciplinaId === disciplinaId)
        .map((c) => atividades.filter((a) => a.conteudoId === c.id));
      return calcularProgressoDaDisciplina(atividadesPorConteudo);
    },
    [atividades, conteudos]
  );

  // ----- Experiência (T21) -----
  // O cálculo mora em `lib/gamificacao.js`. A experiência é derivada das
  // atividades concluídas, não um contador guardado: é assim que o estorno
  // do RN10 sai de graça e concluir duas vezes não credita em dobro.
  const xpDoMembro = useCallback(
    (membroId) => {
      const membro = membros.find((m) => m.id === membroId);
      if (!membro) return 0;
      return calcularXpDoMembro(membroId, atividadesDoGrupo(membro.grupoId));
    },
    [membros, atividadesDoGrupo]
  );

  const rankingDoGrupo = useCallback(
    (grupoId) =>
      calcularRankingDoGrupo(
        membros.filter((m) => m.grupoId === grupoId),
        atividadesDoGrupo(grupoId)
      ),
    [membros, atividadesDoGrupo]
  );

  // Sobe a cadeia a partir da atividade. Existe aqui, e não em cada tela,
  // para o caminho não ser remontado em quatro lugares diferentes.
  const trilhaDaAtividade = useCallback(
    (atividade) => {
      const conteudo = conteudos.find((c) => c.id === atividade?.conteudoId) || null;
      const disciplina = conteudo
        ? disciplinas.find((d) => d.id === conteudo.disciplinaId) || null
        : null;
      return { conteudo, disciplina };
    },
    [conteudos, disciplinas]
  );

  // Importa um pacote pronto (usado pelos dados de exemplo da tela de login).
  const importarExemplo = useCallback(
    ({ grupo, membros: ms, disciplinas: ds = [], conteudos: cs = [], atividades: ts }) => {
      setGrupos((atual) => [...atual, grupo]);
      setMembros((atual) => [...atual, ...ms]);
      setDisciplinas((atual) => [...atual, ...ds]);
      setConteudos((atual) => [...atual, ...cs]);
      setAtividades((atual) => [...atual, ...ts]);
      return grupo;
    },
    []
  );

  const valor = useMemo(
    () => ({
      grupos,
      membros,
      disciplinas,
      conteudos,
      atividades,
      criarGrupo,
      removerGrupo,
      criarMembro,
      atualizarMembro,
      removerMembro,
      criarDisciplina,
      atualizarDisciplina,
      removerDisciplina,
      obterDisciplina,
      criarConteudo,
      atualizarConteudo,
      removerConteudo,
      obterConteudo,
      moverConteudo,
      criarAtividade,
      atualizarAtividade,
      removerAtividade,
      obterAtividade,
      membrosDoGrupo,
      disciplinasDoGrupo,
      conteudosDaDisciplina,
      conteudosDoGrupo,
      atividadesDoGrupo,
      atividadesDoConteudo,
      atividadesDaDisciplina,
      trilhaDaAtividade,
      progressoDoConteudo,
      progressoDaDisciplina,
      progressoAntesDe,
      xpDoMembro,
      rankingDoGrupo,
      importarExemplo,
    }),
    [
      grupos,
      membros,
      disciplinas,
      conteudos,
      atividades,
      criarGrupo,
      removerGrupo,
      criarMembro,
      atualizarMembro,
      removerMembro,
      criarDisciplina,
      atualizarDisciplina,
      removerDisciplina,
      obterDisciplina,
      criarConteudo,
      atualizarConteudo,
      removerConteudo,
      obterConteudo,
      moverConteudo,
      criarAtividade,
      atualizarAtividade,
      removerAtividade,
      obterAtividade,
      membrosDoGrupo,
      disciplinasDoGrupo,
      conteudosDaDisciplina,
      conteudosDoGrupo,
      atividadesDoGrupo,
      atividadesDoConteudo,
      atividadesDaDisciplina,
      trilhaDaAtividade,
      progressoDoConteudo,
      progressoDaDisciplina,
      progressoAntesDe,
      xpDoMembro,
      rankingDoGrupo,
      importarExemplo,
    ]
  );

  return <DataContext.Provider value={valor}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error('useData precisa ser usado dentro de <DataProvider>.');
  }
  return ctx;
}
