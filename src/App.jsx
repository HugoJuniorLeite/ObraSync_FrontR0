// import AppRoutes from "./routes/AppRoutes"


// function App() {


//   return (
//     <AppRoutes>
//     </AppRoutes>
//   )
// }

// export default App


import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
