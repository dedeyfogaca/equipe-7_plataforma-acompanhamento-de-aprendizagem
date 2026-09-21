import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Rota privada via Context: só deixa passar com um grupo na sessão e com a
// pessoa identificada dentro dele. Sem isso, volta para /login (guardando de
// onde ela veio).
//
// A identificação é exigida por causa do RN07: as telas mudam conforme o
// perfil, então entrar sem saber quem é a pessoa não serve.
export function ProtectedRoute() {
  const { autenticado, precisaIdentificar } = useAuth();
  const location = useLocation();

  if (!autenticado || precisaIdentificar) {
    return <Navigate to="/login" replace state={{ de: location.pathname }} />;
  }

  return <Outlet />;
}
