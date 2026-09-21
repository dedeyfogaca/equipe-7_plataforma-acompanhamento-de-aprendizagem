import styled from 'styled-components';
import { useTema } from '../context/TemaContext.jsx';

// Botão que alterna entre o modo escuro e o claro. Mostra o ícone do destino
// (sol quando está escuro, lua quando está claro).
const Botao = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: ${({ theme }) => theme.raio.md};
  border: 1px solid ${({ theme }) => theme.cores.bordaForte};
  background: ${({ theme }) => theme.cores.superficieAlt};
  color: ${({ theme }) => theme.cores.texto};
  font-size: 1.1rem;
  line-height: 1;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;

  &:hover {
    border-color: ${({ theme }) => theme.cores.primaria};
    box-shadow: ${({ theme }) => theme.sombra.glowCiano};
    transform: translateY(-1px);
  }
`;

export function BotaoTema({ className }) {
  const { modo, alternarTema } = useTema();
  const destino = modo === 'dark' ? 'claro' : 'escuro';

  return (
    <Botao
      type="button"
      className={className}
      onClick={alternarTema}
      aria-label={`Mudar para o modo ${destino}`}
      title={`Mudar para o modo ${destino}`}
    >
      {modo === 'dark' ? '☀️' : '🌙'}
    </Botao>
  );
}
