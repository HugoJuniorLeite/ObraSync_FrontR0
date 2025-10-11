
import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { login as apiLogin, firstLogin, changePassword } from "../services/apiLogin";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          id: decoded.userId,
            occupation: decoded.occupation
        });
      } catch (err) {
        console.error("Token inválido:", err);
        logout();
      }
    }
  }, [token]);

    const handleLogin = async (cpf, password) => {
    const result = await apiLogin({ cpf, password });
    const { token } = result;

    // ✅ Já decodifica imediatamente após login
    const decoded = jwtDecode(token);
    const loggedUser = {
      id: decoded.userId,
      occupation: decoded.occupation,
    };

    // Atualiza estados e localStorage
    localStorage.setItem("token", token);
    setToken(token);
    setUser(loggedUser);

    // Retorna tudo que o chamador precisar
    return { token, user: loggedUser };
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        handleLogin,
        logout,
        firstLogin,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
