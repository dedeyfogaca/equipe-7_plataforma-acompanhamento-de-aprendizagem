import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../components/ui';

// Página 404, que fecha o ciclo das rotas (URL que não existe).
const Tela = styled.main`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: ${({ theme }) => theme.espaco.lg};
  padding: ${({ theme }) => theme.espaco.xl};
`;

const Codigo = styled.h1`
  font-size: 6rem;
  font-weight: ${({ theme }) => theme.fonte.peso.negrito};
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.cores.primaria};
  line-height: 1;
  text-shadow: 0 0 30px ${({ theme }) => theme.cores.primariaBrilho};
`;

const Texto = styled.p`
  color: ${({ theme }) => theme.cores.textoSuave};
  max-width: 420px;
`;

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Tela>
      <Codigo>404</Codigo>
      <h2>Página não encontrada</h2>
      <Texto>
        O endereço que você tentou abrir não existe. Talvez o link esteja errado
        ou a página tenha sido removida.
      </Texto>
      <Button type="button" onClick={() => navigate('/painel')}>
        Voltar ao início
      </Button>
    </Tela>
  );
}
