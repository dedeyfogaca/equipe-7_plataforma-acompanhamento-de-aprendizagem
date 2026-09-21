import { useEffect } from 'react';
import styled from 'styled-components';
import { Button } from './Button.jsx';

// Modal simples (usado para confirmar exclusões). Fecha no Esc e no clique fora.
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 12, 0.75);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.espaco.lg};
  z-index: 50;
`;

const Caixa = styled.div`
  background: ${({ theme }) => theme.cores.superficie};
  border: 1px solid ${({ theme }) => theme.cores.bordaForte};
  border-radius: ${({ theme }) => theme.raio.lg};
  box-shadow: ${({ theme }) => theme.sombra.lg};
  width: 100%;
  max-width: 420px;
  padding: ${({ theme }) => theme.espaco.xl};
`;

const Titulo = styled.h2`
  font-size: ${({ theme }) => theme.fonte.tamanho.xl};
  margin-bottom: ${({ theme }) => theme.espaco.md};
`;

const Conteudo = styled.div`
  color: ${({ theme }) => theme.cores.textoSuave};
  margin-bottom: ${({ theme }) => theme.espaco.xl};
`;

const Acoes = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.espaco.sm};
`;

export function Modal({ aberto, onFechar, titulo, children, acoes }) {
  useEffect(() => {
    if (!aberto) return undefined;
    const aoTeclar = (e) => {
      if (e.key === 'Escape') onFechar?.();
    };
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, [aberto, onFechar]);

  if (!aberto) return null;

  return (
    <Overlay onClick={onFechar}>
      <Caixa role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        {titulo && <Titulo>{titulo}</Titulo>}
        <Conteudo>{children}</Conteudo>
        {acoes && <Acoes>{acoes}</Acoes>}
      </Caixa>
    </Overlay>
  );
}

// Diálogo de confirmação pronto, montado em cima do Modal.
export function ConfirmDialog({
  aberto,
  titulo,
  mensagem,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  perigo = false,
  onConfirmar,
  onCancelar,
}) {
  return (
    <Modal
      aberto={aberto}
      onFechar={onCancelar}
      titulo={titulo}
      acoes={
        <>
          <Button type="button" $variante="secundario" onClick={onCancelar}>
            {textoCancelar}
          </Button>
          <Button
            type="button"
            $variante={perigo ? 'perigo' : 'primario'}
            onClick={onConfirmar}
          >
            {textoConfirmar}
          </Button>
        </>
      }
    >
      {mensagem}
    </Modal>
  );
}
