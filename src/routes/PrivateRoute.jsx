import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { getHomeRouteByOccupation } from "../utils/redirectByRole";

export default function PrivateRoute() {
  const { token, user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <p>Carregando...</p>; // ou spinner
  }

  // 🔒 Não autenticado
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // 🎯 CASO CRÍTICO:
  // Usuário logado acessando "/"
  if (location.pathname === "/") {
    const home = getHomeRouteByOccupation(user?.occupation);
    return <Navigate to={home} replace />;
  }

  // ✅ Fluxo normal
  return <Outlet />;
}
