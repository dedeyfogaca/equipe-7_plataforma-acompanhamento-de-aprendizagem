import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { useAuth } from '../context/AuthContext.jsx';
import { useData } from '../context/DataContext.jsx';
import { useFeriados } from '../hooks/useFeriados.js';
import {
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  PageHeader,
  Select,
  Textarea,
} from '../components/ui';
import {
  normalizarPeso,
  PESO,
  PRIORIDADE_OPCOES,
  STATUS,
  STATUS_OPCOES,
} from '../lib/constants.js';
import { anoDaData, ehFimDeSemana } from '../lib/datas.js';
import { semErros, validarAtividade } from '../lib/validacao.js';

// Formulário usado tanto para criar (/atividade/nova) quando para editar
// (/atividade/:id/editar). Quando é nova, vem vazio; quando é edição, vem
// preenchido. A validação é feita em JavaScript puro no envio.

const Formulario = styled(Card).attrs({ as: 'form' })`
  max-width: 640px;
`;

const Linha = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.espaco.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

// Escala do peso: os cinco valores lado a lado, preenchidos até o escolhido,
// como o anel que aparece no cartão. Ciano, pelo mesmo motivo do anel —
// peso é medida, não recompensa.
const EscalaPeso = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.espaco.xs};
`;

const DegrauPeso = styled.button`
  flex: 1;
  max-width: 64px;
  padding: 8px 0;
  font-family: ${({ theme }) => theme.fonte.numero};
  font-size: ${({ theme }) => theme.fonte.tamanho.sm};
  font-weight: ${({ theme }) => theme.fonte.peso.negrito};
  border-radius: ${({ theme }) => theme.raio.md};
  border: 1.5px solid
    ${({ $ativo, theme }) => ($ativo ? theme.cores.primaria : theme.cores.bordaForte)};
  background: ${({ $ativo, theme }) =>
    $ativo ? theme.cores.primariaSuave : 'transparent'};
  color: ${({ $ativo, theme }) =>
    $ativo ? theme.cores.primariaForte : theme.cores.texto};
  transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.cores.primaria};
    color: ${({ theme }) => theme.cores.primariaForte};
  }
`;

const Acoes = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.espaco.sm};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.espaco.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column-reverse;
  }
`;

const estadoInicial = {
  titulo: '',
  descricao: '',
  conteudoId: '',
  prazo: '',
  peso: PESO.PADRAO,
  responsavelId: '',
  status: STATUS.A_FAZER,
  prioridade: '',
};

export default function AtividadeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { grupoAtivo } = useAuth();
  const {
    obterAtividade,
    criarAtividade,
    atualizarAtividade,
    membrosDoGrupo,
    disciplinasDoGrupo,
    conteudosDoGrupo,
    conteudosDaDisciplina,
  } = useData();

  const edicao = Boolean(id);
  const atividadeExistente = edicao ? obterAtividade(id) : null;
  const membros = membrosDoGrupo(grupoAtivo.id);
  const disciplinas = disciplinasDoGrupo(grupoAtivo.id);
  const conteudosDisponiveis = conteudosDoGrupo(grupoAtivo.id);

  // Estado do formulário. No modo edição já começa preenchido.
  const [form, setForm] = useState(() => {
    if (atividadeExistente) {
      return {
        titulo: atividadeExistente.titulo || '',
        descricao: atividadeExistente.descricao || '',
        conteudoId: atividadeExistente.conteudoId || '',
        prazo: atividadeExistente.prazo || '',
        peso: normalizarPeso(atividadeExistente.peso),
        responsavelId: atividadeExistente.responsavelId || '',
        status: atividadeExistente.status || STATUS.A_FAZER,
        prioridade: atividadeExistente.prioridade || '',
      };
    }
    return estadoInicial;
  });
  const [erros, setErros] = useState({});

  // A disciplina não é gravada na atividade: ela só filtra a lista de
  // conteúdos aqui no formulário. Na edição, vem de volta pela cadeia.
  const [disciplinaId, setDisciplinaId] = useState(() => {
    if (!atividadeExistente) return '';
    const conteudo = conteudosDisponiveis.find((c) => c.id === atividadeExistente.conteudoId);
    return conteudo?.disciplinaId || '';
  });

  // Dica de feriado / fim de semana para o prazo escolhido (cruzando BrasilAPI).
  const anos = useMemo(
    () => Array.from(new Set([new Date().getFullYear(), anoDaData(form.prazo)].filter(Boolean))),
    [form.prazo]
  );
  const { feriadoEm } = useFeriados(anos);

  const atualizarCampo = (campo) => (evento) => {
    setForm((atual) => ({ ...atual, [campo]: evento.target.value }));
  };

  const escolherPeso = (valor) => setForm((atual) => ({ ...atual, peso: valor }));

  // Trocar de disciplina invalida o conteúdo escolhido antes.
  const trocarDisciplina = (evento) => {
    setDisciplinaId(evento.target.value);
    setForm((atual) => ({ ...atual, conteudoId: '' }));
  };

  // Edição apontando para uma atividade que não existe (ex.: link velho).
  if (edicao && !atividadeExistente) {
    return (
      <Card>
        <EmptyState
          icone="❓"
          titulo="Atividade não encontrada"
          descricao="Essa atividade não existe mais ou o endereço está errado."
        >
          <Button as={Link} to="/atividades">
            Voltar para as atividades
          </Button>
        </EmptyState>
      </Card>
    );
  }

  // RN13 — sem conteúdo cadastrado não há onde pendurar a atividade.
  if (conteudosDisponiveis.length === 0) {
    return (
      <>
        <PageHeader titulo="Nova atividade" />
        <Card>
          <EmptyState
            icone="📚"
            titulo="Cadastre disciplinas e conteúdos primeiro"
            descricao="Toda atividade pertence a um conteúdo, e o conteúdo a uma disciplina. É essa cadeia que permite medir o progresso."
          >
            <Button as={Link} to="/disciplinas">
              Ir para Disciplinas
            </Button>
          </EmptyState>
        </Card>
      </>
    );
  }

  const aoEnviar = (evento) => {
    evento.preventDefault();
    const novosErros = validarAtividade(form, { membros, conteudos: conteudosDisponiveis });
    setErros(novosErros);
    if (!semErros(novosErros)) return;

    if (edicao) {
      atualizarAtividade(id, form);
      navigate(`/atividade/${id}`);
    } else {
      // Sem grupoId: o grupo da atividade vem do conteúdo escolhido.
      const nova = criarAtividade(form);
      navigate(`/atividade/${nova.id}`);
    }
  };

  // Monta a dica do prazo (só aparece se não houver erro no campo).
  const feriadoNoPrazo = form.prazo ? feriadoEm(form.prazo) : null;
  let dicaPrazo;
  if (feriadoNoPrazo) {
    dicaPrazo = `📅 Esse prazo cai no feriado: ${feriadoNoPrazo.name}.`;
  } else if (ehFimDeSemana(form.prazo)) {
    dicaPrazo = '📅 Esse prazo cai num fim de semana.';
  }

  return (
    <>
      <PageHeader titulo={edicao ? 'Editar atividade' : 'Nova atividade'} />

      <Formulario onSubmit={aoEnviar} noValidate>
        <Field id="titulo" label="Título" obrigatorio erro={erros.titulo}>
          <Input
            id="titulo"
            value={form.titulo}
            onChange={atualizarCampo('titulo')}
            placeholder="Ex.: Escrever a introdução do TCC"
            $erro={Boolean(erros.titulo)}
            autoFocus
          />
        </Field>

        <Field
          id="descricao"
          label="Descrição"
          dica="Opcional. Detalhes do que precisa ser feito."
        >
          <Textarea
            id="descricao"
            value={form.descricao}
            onChange={atualizarCampo('descricao')}
            placeholder="Anote o que for útil para o grupo."
          />
        </Field>

        {/* RN13 — a atividade pertence a exatamente um conteúdo. A disciplina
            aqui só serve para filtrar a lista de conteúdos. */}
        <Linha>
          <Field id="disciplinaId" label="Disciplina" obrigatorio>
            <Select id="disciplinaId" value={disciplinaId} onChange={trocarDisciplina}>
              <option value="">Selecione uma disciplina</option>
              {disciplinas.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nome}
                </option>
              ))}
            </Select>
          </Field>
          <Field
            id="conteudoId"
            label="Conteúdo"
            obrigatorio
            erro={erros.conteudoId}
            dica={!disciplinaId ? 'Escolha a disciplina primeiro.' : undefined}
          >
            <Select
              id="conteudoId"
              value={form.conteudoId}
              onChange={atualizarCampo('conteudoId')}
              disabled={!disciplinaId}
              $erro={Boolean(erros.conteudoId)}
            >
              <option value="">Selecione um conteúdo</option>
              {conteudosDaDisciplina(disciplinaId).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </Select>
          </Field>
        </Linha>

        {/* RN09 — o peso diz quanto a atividade vale no progresso do
            conteúdo. Fica sozinho, longe da prioridade: as duas coisas eram
            confundidas quando ficavam lado a lado. */}
        <Field
          id="peso"
          label="Peso"
          erro={erros.peso}
          dica="Quanto esta atividade pesa no progresso do conteúdo. Não é urgência — isso é a prioridade."
        >
          <EscalaPeso role="radiogroup" aria-label="Peso da atividade">
            {Array.from({ length: PESO.MAXIMO }, (_, i) => i + PESO.MINIMO).map((valor) => (
              <DegrauPeso
                key={valor}
                type="button"
                role="radio"
                aria-checked={form.peso === valor}
                aria-label={`Peso ${valor} de ${PESO.MAXIMO}`}
                $ativo={valor <= form.peso}
                onClick={() => escolherPeso(valor)}
              >
                {valor}
              </DegrauPeso>
            ))}
          </EscalaPeso>
        </Field>

        <Linha>
          <Field
            id="prazo"
            label="Prazo"
            obrigatorio
            erro={erros.prazo}
            dica={dicaPrazo}
          >
            <Input
              id="prazo"
              type="date"
              value={form.prazo}
              onChange={atualizarCampo('prazo')}
              $erro={Boolean(erros.prazo)}
            />
          </Field>
          {/* RN06 — responsável é opcional. Sem ele a atividade existe
              normalmente, só não credita experiência (RN10). */}
          <Field
            id="responsavelId"
            label="Responsável"
            dica={
              membros.length === 0
                ? 'Nenhum membro cadastrado ainda. A atividade pode ficar sem responsável.'
                : 'Opcional. Sem responsável a atividade não credita experiência.'
            }
            erro={erros.responsavelId}
          >
            <Select
              id="responsavelId"
              value={form.responsavelId}
              onChange={atualizarCampo('responsavelId')}
              $erro={Boolean(erros.responsavelId)}
            >
              <option value="">Sem responsável</option>
              {membros.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nome}
                </option>
              ))}
            </Select>
          </Field>
        </Linha>

        <Linha>
          <Field id="status" label="Status">
            <Select id="status" value={form.status} onChange={atualizarCampo('status')}>
              {STATUS_OPCOES.map((o) => (
                <option key={o.valor} value={o.valor}>
                  {o.rotulo}
                </option>
              ))}
            </Select>
          </Field>
          <Field id="prioridade" label="Prioridade" dica="Opcional.">
            <Select
              id="prioridade"
              value={form.prioridade}
              onChange={atualizarCampo('prioridade')}
            >
              <option value="">Sem prioridade</option>
              {PRIORIDADE_OPCOES.map((o) => (
                <option key={o.valor} value={o.valor}>
                  {o.rotulo}
                </option>
              ))}
            </Select>
          </Field>
        </Linha>

        <Acoes>
          <Button
            type="button"
            $variante="secundario"
            onClick={() => navigate(edicao ? `/atividade/${id}` : '/atividades')}
          >
            Cancelar
          </Button>
          <Button type="submit">
            {edicao ? 'Salvar alterações' : 'Criar atividade'}
          </Button>
        </Acoes>
      </Formulario>
    </>
  );
}
