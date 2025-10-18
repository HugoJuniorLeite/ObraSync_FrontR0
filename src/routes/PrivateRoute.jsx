import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

// export default function PrivateRoute() {
//   const { token } = useContext(AuthContext);
//   return token ? <Outlet /> : <Navigate to="/" replace />;

  // return <Outlet/>
// }


export default function PrivateRoute() {
  const { token, loading } = useContext(AuthContext);

  if (loading) return <p>Carregando...</p>; // evita redirecionamento prematuro
  return token ? <Outlet /> : <Navigate to="/" replace />;
}

