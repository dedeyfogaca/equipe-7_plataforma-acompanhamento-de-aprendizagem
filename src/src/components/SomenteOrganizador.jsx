import styled from 'styled-components';

import { useAuth } from '../context/AuthContext.jsx';

// RN07 — só o organizador exclui o grupo e gerencia membros, disciplinas e
// conteúdos. O participante cadastra e edita atividades.
//
// A checagem mora aqui para não virar um `if` repetido em cada tela. Quando
// a pessoa não pode, o controle some; passando `aviso`, aparece uma linha
// explicando o motivo, porque um botão que simplesmente desaparece deixa
// quem olha achando que o sistema quebrou.
//
// Isto é regra de organização do grupo, não segurança: o sistema não tem
// servidor nem senha, e quem quiser burlar troca o próprio perfil. O que a
// regra evita é a bagunça acidental, que é o problema real de um trabalho
// em grupo.

const Aviso = styled.p`
  font-size: ${({ theme }) => theme.fonte.tamanho.sm};
  color: ${({ theme }) => theme.cores.textoSuave};
  padding: ${({ theme }) => theme.espaco.md};
  border: 1px dashed ${({ theme }) => theme.cores.borda};
  border-radius: ${({ theme }) => theme.raio.md};
`;

export function SomenteOrganizador({ children, aviso }) {
  const { ehOrganizador } = useAuth();

  if (ehOrganizador) return children;
  return aviso ? <Aviso>{aviso}</Aviso> : null;
}
