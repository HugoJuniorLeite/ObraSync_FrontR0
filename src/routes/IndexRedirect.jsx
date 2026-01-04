// src/routes/IndexRedirect.jsx

import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { getHomeRouteByOccupation } from "../utils/redirectByRole";

export default function IndexRedirect() {
  const { token, user, loading } = useContext(AuthContext);

  if (loading) return <p>Carregando...</p>;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const home = getHomeRouteByOccupation(user?.occupation);
  return <Navigate to={home} replace />;
}
