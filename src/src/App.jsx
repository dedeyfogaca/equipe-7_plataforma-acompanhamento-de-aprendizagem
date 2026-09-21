import { Route, Routes } from 'react-router-dom';

import { ProtectedRoute } from './routes/ProtectedRoute.jsx';
import { PrivateLayout } from './components/layout/PrivateLayout.jsx';

import Login from './pages/Login.jsx';
import Painel from './pages/Painel.jsx';
import Disciplinas from './pages/Disciplinas.jsx';
import DisciplinaDetalhe from './pages/DisciplinaDetalhe.jsx';
import Atividades from './pages/Atividades.jsx';
import AtividadeForm from './pages/AtividadeForm.jsx';
import AtividadeDetalhe from './pages/AtividadeDetalhe.jsx';
import Membros from './pages/Membros.jsx';
import NotFound from './pages/NotFound.jsx';

// Mapa de rotas. As rotas privadas ficam aninhadas dentro de <ProtectedRoute>
// (que checa a sessão) e de <PrivateLayout> (que dá o header + <Outlet />).
export default function App() {
  return (
    <Routes>
      {/* Pública */}
      <Route path="/login" element={<Login />} />

      {/* Privadas: só abrem com um grupo logado */}
      <Route element={<ProtectedRoute />}>
        <Route element={<PrivateLayout />}>
          <Route index element={<Painel />} />
          <Route path="/painel" element={<Painel />} />
          <Route path="/disciplinas" element={<Disciplinas />} />
          <Route path="/disciplina/:id" element={<DisciplinaDetalhe />} />
          <Route path="/atividades" element={<Atividades />} />
          <Route path="/atividade/nova" element={<AtividadeForm />} />
          <Route path="/atividade/:id" element={<AtividadeDetalhe />} />
          <Route path="/atividade/:id/editar" element={<AtividadeForm />} />
          <Route path="/membros" element={<Membros />} />
        </Route>
      </Route>

      {/* Qualquer outra rota cai no 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
