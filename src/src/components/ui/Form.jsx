import styled, { css } from 'styled-components';

// Peças de formulário do Design System: input, textarea, select, label,
// mensagem de erro e dica. O componente <Field> junta tudo (label + campo +
// erro). No tema escuro, os campos têm fundo afundado e o foco acende um
// anel ciano.

const baseCampo = css`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.cores.bordaForte};
  border-radius: ${({ theme }) => theme.raio.md};
  background: ${({ theme }) => theme.cores.fundoAlt};
  color: ${({ theme }) => theme.cores.texto};
  transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;

  &::placeholder {
    color: ${({ theme }) => theme.cores.textoSuave};
  }

  &:hover:not(:disabled):not(:focus) {
    border-color: ${({ theme }) => theme.cores.primariaForte};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.cores.primaria};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.cores.primariaSuave},
      0 0 18px ${({ theme }) => theme.cores.primariaSuave};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${({ $erro, theme }) =>
    $erro &&
    css`
      border-color: ${theme.cores.perigo};
      &:focus {
        border-color: ${theme.cores.perigo};
        box-shadow: 0 0 0 3px ${theme.cores.perigoSuave};
      }
    `}
`;

export const Input = styled.input`
  ${baseCampo}
`;

export const Textarea = styled.textarea`
  ${baseCampo}
  min-height: 96px;
  resize: vertical;
`;

export const Select = styled.select`
  ${baseCampo}
  appearance: auto;
`;

export const Label = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.fonte.tamanho.xs};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.cores.textoSuave};
  margin-bottom: 6px;
`;

const Obrigatorio = styled.span`
  color: ${({ theme }) => theme.cores.destaque};
`;

export const MensagemErro = styled.p`
  margin-top: 6px;
  font-size: ${({ theme }) => theme.fonte.tamanho.xs};
  color: ${({ theme }) => theme.cores.perigo};
`;

export const Dica = styled.p`
  margin-top: 6px;
  font-size: ${({ theme }) => theme.fonte.tamanho.xs};
  color: ${({ theme }) => theme.cores.textoSuave};
`;

const Grupo = styled.div`
  margin-bottom: ${({ theme }) => theme.espaco.lg};
`;

// Junta rótulo + campo (passado como children) + erro/dica.
export function Field({ id, label, erro, dica, obrigatorio = false, children }) {
  return (
    <Grupo>
      {label && (
        <Label htmlFor={id}>
          {label}
          {obrigatorio && <Obrigatorio> *</Obrigatorio>}
        </Label>
      )}
      {children}
      {erro ? (
        <MensagemErro role="alert">{erro}</MensagemErro>
      ) : dica ? (
        <Dica>{dica}</Dica>
      ) : null}
    </Grupo>
  );
}
