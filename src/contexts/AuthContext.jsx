
import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { login as apiLogin, firstLogin, changePassword } from "../services/apiLogin";

export const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem("token") || null);

//   useEffect(() => {
//     console.log(token.occupation,"context")
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         setUser({
//           id: decoded.userId,
//             occupation: decoded.occupation
//         });
//       } catch (err) {
//         console.error("Token inválido:", err);
//         logout();
//       }
//     }
//   }, [token]);

//     const handleLogin = async (cpf, password) => {
//     const result = await apiLogin({ cpf, password });
//     const { token } = result;

//     // ✅ Já decodifica imediatamente após login
//     const decoded = jwtDecode(token);
//     const loggedUser = {
//       id: decoded.userId,
//       occupation: decoded.occupation,
//     };

//     // Atualiza estados e localStorage
//     localStorage.setItem("token", token);
//     setToken(token);
//     setUser(loggedUser);

//     // Retorna tudo que o chamador precisar
//     return { token, user: loggedUser };
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//     setToken(null);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         token,
//         handleLogin,
//         logout,
//         firstLogin,
//         changePassword,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true); // 🚨 novo estado

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          id: decoded.userId,
          occupation: decoded.occupation,
        });
      } catch (err) {
        console.error("Token inválido:", err);
        logout();
      }
    }
    setLoading(false); // ✅ só depois de tentar ler o token
  }, [token]);

  const handleLogin = async (cpf, password) => {
    const result = await apiLogin({ cpf, password });
    const { token } = result;

    const decoded = jwtDecode(token);
    const loggedUser = {
      id: decoded.userId,
      occupation: decoded.occupation,
    };

    localStorage.setItem("token", token);
    setToken(token);
    setUser(loggedUser);

    return { token, user: loggedUser };
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, handleLogin, logout, firstLogin, changePassword, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
