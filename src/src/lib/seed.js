// Dados de exemplo, usados pelo botão "Carregar dados de exemplo" na tela
// de login. Servem para conhecer o sistema sem precisar cadastrar tudo do zero.
// Os prazos são relativos a hoje para sempre parecerem realistas.

import { novoId } from './storage.js';
import { paraISO } from './datas.js';
import { novaSeedAvatar } from './avatar.js';
import { CORES_DISCIPLINA, PERFIL, PRIORIDADE, STATUS } from './constants.js';

function emDias(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return paraISO(d);
}

// Instante completo, para os campos que guardam data e hora (`dataConclusao`).
function emISO(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString();
}

export function gerarDadosExemplo() {
  const agora = new Date().toISOString();
  const grupoId = novoId();

  const grupo = {
    id: grupoId,
    nome: 'Trio do TCC',
    descricao: 'Grupo de exemplo para você conhecer o sistema.',
    criadoEm: agora,
  };

  // RN07 — quem cria o grupo é o organizador; os demais, participantes.
  const ana = { id: novoId(), nome: 'Ana Souza', grupoId, funcao: 'Introdução e revisão', email: 'ana@exemplo.com', avatar: novaSeedAvatar(), perfil: PERFIL.ORGANIZADOR };
  const bruno = { id: novoId(), nome: 'Bruno Lima', grupoId, funcao: 'Desenvolvimento', email: '', avatar: novaSeedAvatar(), perfil: PERFIL.PARTICIPANTE };
  const carla = { id: novoId(), nome: 'Carla Dias', grupoId, funcao: 'Slides e apresentação', email: 'carla@exemplo.com', avatar: novaSeedAvatar(), perfil: PERFIL.PARTICIPANTE };
  const membros = [ana, bruno, carla];

  const disciplinas = [
    { nome: 'TCC', cor: CORES_DISCIPLINA[0].valor },
    { nome: 'Front-End', cor: CORES_DISCIPLINA[1].valor },
    { nome: 'Metodologia', cor: CORES_DISCIPLINA[2].valor },
  ].map(({ nome, cor }) => ({ id: novoId(), nome, cor, grupoId, criadaEm: agora }));

  const [tcc, frontEnd, metodologia] = disciplinas;

  // Conteúdos: a divisão de cada disciplina em assuntos. A `ordem` é a
  // sequência dentro da disciplina, contada do zero.
  const conteudos = [
    { disciplina: tcc, nome: 'Introdução', descricao: 'Contexto, problema e objetivos.' },
    { disciplina: tcc, nome: 'Referencial teórico', descricao: '' },
    { disciplina: tcc, nome: 'Apresentação', descricao: 'Slides e defesa.' },
    { disciplina: frontEnd, nome: 'Prototipação', descricao: 'Wireframes e telas.' },
    { disciplina: frontEnd, nome: 'Componentes', descricao: '' },
    { disciplina: metodologia, nome: 'Normas ABNT', descricao: 'Formatação e citações.' },
  ].reduce((lista, { disciplina, nome, descricao }) => {
    const ordem = lista.filter((c) => c.disciplinaId === disciplina.id).length;
    return [...lista, { id: novoId(), nome, descricao, disciplinaId: disciplina.id, ordem }];
  }, []);

  const [introducao, referencial, apresentacao] = conteudos;
  const prototipacao = conteudos[3];
  const componentes = conteudos[4];
  const normasAbnt = conteudos[5];

  // Atividades: cada uma pertence a um conteúdo (RN13) e carrega um peso de
  // 1 a 5 (RN09). Os pesos variam de propósito — é a razão entre eles que o
  // progresso mede, então um exemplo todo com peso 1 não mostraria nada.
  const atividades = [
    {
      id: novoId(),
      titulo: 'Escrever a introdução do TCC',
      descricao: 'Contextualizar o problema e apresentar os objetivos do trabalho.',
      conteudoId: introducao.id,
      prazo: emDias(-2),
      peso: 5,
      status: STATUS.FAZENDO,
      prioridade: PRIORIDADE.ALTA,
      responsavelId: ana.id,
      criadaEm: agora,
      dataConclusao: null,
    },
    {
      id: novoId(),
      titulo: 'Levantar os artigos de referência',
      descricao: 'Selecionar as fontes que sustentam o referencial.',
      conteudoId: referencial.id,
      prazo: emDias(8),
      peso: 3,
      status: STATUS.A_FAZER,
      prioridade: PRIORIDADE.MEDIA,
      responsavelId: ana.id,
      criadaEm: agora,
      dataConclusao: null,
    },
    {
      id: novoId(),
      titulo: 'Montar protótipo das telas',
      descricao: 'Desenhar os wireframes das telas principais.',
      conteudoId: prototipacao.id,
      prazo: emDias(1),
      peso: 4,
      status: STATUS.A_FAZER,
      prioridade: PRIORIDADE.ALTA,
      responsavelId: bruno.id,
      criadaEm: agora,
      dataConclusao: null,
    },
    {
      id: novoId(),
      titulo: 'Revisar as referências bibliográficas',
      descricao: 'Conferir a formatação das referências no padrão ABNT.',
      conteudoId: normasAbnt.id,
      prazo: emDias(5),
      peso: 2,
      status: STATUS.A_FAZER,
      prioridade: PRIORIDADE.MEDIA,
      // Sem responsável de propósito: RN06 não exige, e RN10 diz que uma
      // atividade assim simplesmente não gera experiência.
      responsavelId: '',
      criadaEm: agora,
      dataConclusao: null,
    },
    {
      id: novoId(),
      titulo: 'Preparar os slides da apresentação',
      descricao: '',
      conteudoId: apresentacao.id,
      prazo: emDias(12),
      peso: 3,
      status: STATUS.A_FAZER,
      prioridade: PRIORIDADE.BAIXA,
      responsavelId: carla.id,
      criadaEm: agora,
      dataConclusao: null,
    },
    {
      id: novoId(),
      titulo: 'Configurar o repositório no GitHub',
      descricao: 'Criar o repositório, escrever o README e fazer o primeiro commit.',
      conteudoId: componentes.id,
      prazo: emDias(-5),
      peso: 1,
      status: STATUS.CONCLUIDO,
      prioridade: PRIORIDADE.MEDIA,
      responsavelId: bruno.id,
      criadaEm: agora,
      dataConclusao: emISO(-5),
    },
  ];

  return { grupo, membros, disciplinas, conteudos, atividades };
}
