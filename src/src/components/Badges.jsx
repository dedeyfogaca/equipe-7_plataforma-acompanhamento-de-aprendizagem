import { Badge } from './ui/Badge.jsx';
import {
  PRIORIDADE,
  STATUS,
  rotuloPrioridade,
  rotuloStatus,
} from '../lib/constants.js';

// Badge de status: aquele "selinho colorido" de a fazer / fazendo / concluído.
const tomPorStatus = {
  [STATUS.A_FAZER]: 'neutro',
  [STATUS.FAZENDO]: 'alerta',
  [STATUS.CONCLUIDO]: 'sucesso',
};

export function StatusBadge({ status }) {
  return <Badge $tom={tomPorStatus[status] || 'neutro'}>{rotuloStatus(status)}</Badge>;
}

// Badge de prioridade (campo opcional da atividade).
const tomPorPrioridade = {
  [PRIORIDADE.BAIXA]: 'sucesso',
  [PRIORIDADE.MEDIA]: 'alerta',
  [PRIORIDADE.ALTA]: 'perigo',
};

export function PrioridadeBadge({ prioridade }) {
  if (!prioridade) return null;
  return (
    <Badge $tom={tomPorPrioridade[prioridade] || 'neutro'}>
      Prioridade {rotuloPrioridade(prioridade).toLowerCase()}
    </Badge>
  );
}
