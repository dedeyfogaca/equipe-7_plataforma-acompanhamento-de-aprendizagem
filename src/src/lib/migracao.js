// Migração dos dados já gravados no navegador.
//
// O sistema saiu com `tarefa` guardando a disciplina como texto livre. O
// modelo alvo é outro: a atividade pertence a um conteúdo, o conteúdo a uma
// disciplina, e a disciplina a um grupo (RN13). Trocar a estrutura sem migrar
// apagaria o que quem já usa o sistema fez.
//
// Roda uma vez só. O marcador de versão gravado é o que impede uma segunda
// passada de duplicar disciplina.

import {
  CHAVES,
  CHAVE_LEGADA_TAREFAS,
  lerColecao,
  lerVersaoDados,
  novoId,
  removerChave,
  salvarColecao,
  salvarVersaoDados,
} from './storage.js';
import { COR_DISCIPLINA_PADRAO, CORES_DISCIPLINA, PERFIL, STATUS } from './constants.js';

// Sobe de 1 em 1 a cada mudança de formato. A migração atual leva do formato
// 0 (tarefa com disciplina de texto) para o 1.
export const VERSAO_DADOS = 1;

// Nome do conteúdo que recebe as atividades que já existiam. A pessoa
// renomeia ou divide depois; o importante é não deixar atividade solta.
const CONTEUDO_PADRAO = 'Geral';

// Atividade sem disciplina escrita precisa de uma mesmo assim, porque não
// existe atividade fora da cadeia. O nome é explícito para a pessoa achar e
// arrumar.
const DISCIPLINA_SEM_NOME = 'Sem disciplina';

function comparavel(texto) {
  return (texto || '').trim().toLowerCase();
}

// A migração roda antes de qualquer tela montar, então não dá para pedir cor
// à pessoa: distribui as da paleta na ordem, repetindo se acabar.
function corPorIndice(indice) {
  return CORES_DISCIPLINA[indice % CORES_DISCIPLINA.length]?.valor ?? COR_DISCIPLINA_PADRAO;
}

/**
 * Converte as tarefas antigas de um grupo, criando as disciplinas e conteúdos
 * que faltarem. Devolve o que foi criado e as atividades já no formato novo.
 */
function migrarGrupo({ grupo, tarefas, disciplinas, conteudos }) {
  const disciplinasNovas = [];
  const conteudosNovos = [];
  const atividades = [];

  // Disciplinas que o grupo já tem, indexadas por nome, para a migração
  // aproveitar em vez de criar uma segunda com o mesmo nome.
  const porNome = new Map();
  disciplinas
    .filter((d) => d.grupoId === grupo.id)
    .forEach((d) => porNome.set(comparavel(d.nome), d));

  const totalExistentes = porNome.size;

  const acharOuCriarDisciplina = (nome) => {
    const chave = comparavel(nome);
    if (porNome.has(chave)) return porNome.get(chave);

    const disciplina = {
      id: novoId(),
      nome: nome.trim(),
      cor: corPorIndice(totalExistentes + disciplinasNovas.length),
      grupoId: grupo.id,
      criadaEm: grupo.criadoEm || new Date().toISOString(),
    };
    porNome.set(chave, disciplina);
    disciplinasNovas.push(disciplina);
    return disciplina;
  };

  // Conteúdo "Geral" de cada disciplina, criado sob demanda.
  const geralPorDisciplina = new Map();
  const acharOuCriarConteudoPadrao = (disciplina) => {
    if (geralPorDisciplina.has(disciplina.id)) {
      return geralPorDisciplina.get(disciplina.id);
    }

    const existente = conteudos.find(
      (c) => c.disciplinaId === disciplina.id && comparavel(c.nome) === comparavel(CONTEUDO_PADRAO)
    );
    if (existente) {
      geralPorDisciplina.set(disciplina.id, existente);
      return existente;
    }

    const irmaos = [...conteudos, ...conteudosNovos].filter(
      (c) => c.disciplinaId === disciplina.id
    );
    const conteudo = {
      id: novoId(),
      nome: CONTEUDO_PADRAO,
      descricao: 'Recebeu as atividades que existiam antes das disciplinas.',
      disciplinaId: disciplina.id,
      ordem: irmaos.length,
    };
    geralPorDisciplina.set(disciplina.id, conteudo);
    conteudosNovos.push(conteudo);
    return conteudo;
  };

  tarefas.forEach((tarefa) => {
    const nomeDisciplina = (tarefa.disciplina || '').trim() || DISCIPLINA_SEM_NOME;
    const disciplina = acharOuCriarDisciplina(nomeDisciplina);
    const conteudo = acharOuCriarConteudoPadrao(disciplina);

    // `disciplina` (texto) e `grupoId` saem: o grupo agora chega pela cadeia
    // conteudo -> disciplina -> grupo, e guardá-lo aqui seria um dado
    // derivado com prazo de validade.
    const { disciplina: _texto, grupoId: _grupoId, ...resto } = tarefa;

    atividades.push({
      ...resto,
      conteudoId: conteudo.id,
      // RN09 — toda atividade tem peso, e quem não tinha vale 1.
      peso: resto.peso ?? 1,
      // Data de conclusão estimada: o formato antigo não guardava quando a
      // atividade foi concluída, e `criadaEm` é o único instante que temos.
      // Daqui para a frente ela é gravada de verdade, na hora da conclusão.
      dataConclusao:
        resto.status === STATUS.CONCLUIDO
          ? resto.dataConclusao || resto.criadaEm || new Date().toISOString()
          : null,
    });
  });

  return { disciplinasNovas, conteudosNovos, atividades };
}

/**
 * Executa a migração se ela ainda não rodou. Chamada uma vez, antes de a
 * aplicação montar. Devolve um resumo do que mudou (útil em teste e no log).
 */
export function migrarDados() {
  if (lerVersaoDados() >= VERSAO_DADOS) {
    return { migrou: false, motivo: 'ja-migrado' };
  }

  const grupos = lerColecao(CHAVES.grupos);
  const membros = lerColecao(CHAVES.membros);
  const disciplinas = lerColecao(CHAVES.disciplinas);
  const conteudos = lerColecao(CHAVES.conteudos);
  const tarefasAntigas = lerColecao(CHAVE_LEGADA_TAREFAS);

  // Não há tarefa no formato antigo: não existe nada para converter.
  // Dois casos caem aqui — instalação nova, e dados que JÁ foram migrados mas
  // perderam o marcador de versão (limpeza parcial do armazenamento, outro
  // perfil do navegador, falha silenciosa na gravação da versão).
  // Nos dois, seguir adiante gravaria `atividades` com a lista vazia montada
  // abaixo e apagaria tudo o que a pessoa tem.
  if (tarefasAntigas.length === 0) {
    salvarVersaoDados(VERSAO_DADOS);
    return { migrou: false, motivo: 'sem-tarefas-antigas' };
  }

  const disciplinasFinais = [...disciplinas];
  const conteudosFinais = [...conteudos];
  const atividadesFinais = [];

  // Segunda linha de defesa: a migração ACRESCENTA ao que já existe, em vez
  // de gravar por cima. Mesmo que uma guarda falhe um dia, o pior caso passa
  // a ser dado duplicado — que se vê e se conserta — e não dado apagado.
  const atividadesExistentes = lerColecao(CHAVES.atividades);

  grupos.forEach((grupo) => {
    const tarefasDoGrupo = tarefasAntigas.filter((t) => t.grupoId === grupo.id);
    if (tarefasDoGrupo.length === 0) return;

    const resultado = migrarGrupo({
      grupo,
      tarefas: tarefasDoGrupo,
      disciplinas: disciplinasFinais,
      conteudos: conteudosFinais,
    });

    disciplinasFinais.push(...resultado.disciplinasNovas);
    conteudosFinais.push(...resultado.conteudosNovos);
    atividadesFinais.push(...resultado.atividades);
  });

  // RN07 — o primeiro membro cadastrado no grupo vira organizador; os demais,
  // participantes. Quem já tem perfil gravado fica como está.
  const membrosFinais = membros.map((membro) => {
    if (membro.perfil) return membro;
    const primeiro = membros.find((m) => m.grupoId === membro.grupoId);
    return {
      ...membro,
      perfil: primeiro?.id === membro.id ? PERFIL.ORGANIZADOR : PERFIL.PARTICIPANTE,
    };
  });

  salvarColecao(CHAVES.membros, membrosFinais);
  salvarColecao(CHAVES.disciplinas, disciplinasFinais);
  salvarColecao(CHAVES.conteudos, conteudosFinais);
  // Junta por id: a atividade carrega o id da tarefa que a originou, então
  // reconverter a mesma tarefa duas vezes produziria duas linhas com o mesmo
  // id — e id repetido quebra chave de lista e faz `find` devolver só a
  // primeira. Indexar por id mantém a proteção do acréscimo e ainda deixa a
  // migração idempotente.
  const porId = new Map(
    [...atividadesExistentes, ...atividadesFinais].map((a) => [a.id, a])
  );
  salvarColecao(CHAVES.atividades, [...porId.values()]);

  // Tarefa antiga cujo grupo não existe mais. O `removerGrupo` antigo fazia
  // cascata, então órfã não deveria existir — mas se existir, ela não tem
  // onde morar no modelo novo, que exige a cadeia até o grupo.
  //
  // Em vez de sumir em silêncio, ela fica: a chave antiga só é apagada
  // quando tudo foi convertido. O que não coube continua no disco, e o
  // retorno diz quantas são.
  const orfas = tarefasAntigas.filter((t) => !grupos.some((g) => g.id === t.grupoId));

  if (orfas.length === 0) {
    // A chave antiga sai só depois de a nova estar gravada.
    removerChave(CHAVE_LEGADA_TAREFAS);
  }

  salvarVersaoDados(VERSAO_DADOS);

  return {
    migrou: true,
    atividades: atividadesFinais.length,
    disciplinasCriadas: disciplinasFinais.length - disciplinas.length,
    conteudosCriados: conteudosFinais.length - conteudos.length,
    orfas: orfas.length,
  };
}
