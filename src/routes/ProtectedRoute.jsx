// src/routes/ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Carregando...</p>;
  // if (!user) return <Navigate to="/login" replace />;

  return children;
}

//deletar se private router funcionar