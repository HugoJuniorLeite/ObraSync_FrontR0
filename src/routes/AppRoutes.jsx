// import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
// import styled from "styled-components";
// import { useForm } from "react-hook-form";
// import { FormProvider } from "../components/RdoForms/FormContext";
// import GlobalStyle from "../layouts/GlobalStyle";

// // Middlewares
// import PrivateRoute from "./PrivateRoute";
// import RoleRoute from "./RoleRoute";

// // Layout
// import AuthenticatedLayout from "../layouts/AuthenticatedLayout";

// // Páginas públicas
// import Login from "../pages/Login";
// import LoginMaster from "../pages/LoginMaster";

// // Páginas principais
// import Home from "../pages/Home";
// // import HomeCopy from "../pages/Demonstration/HomeCopy";
// import Project from "../pages/Project";

// // Componentes e páginas internas
// import RegisterCustomer from "../components/RegisterCustomer";
// // import RegisterEmployee from "../components/RegisterEmployee";
// // import CreateOccupation from "../components/CreateOccupation";
// import CreateOs from "../components/CreateOs";
// import CreateService from "../components/CreateService";
// import GetOss from "../components/GetOSs";
// // import Rh from "../pages/Demonstration/Rh";
// // import Planner from "../pages/Demonstration/Planner";
// import MyService from "../components/MyService";
// // import Tecnico from "../pages/Demonstration/Tecnico";
// // import Engenheiro from "../pages/Demonstration/Engenheiro";
// import RdoFomrExtensionInative from "../components/RdoForms/RdoFomrExtensionInative";
// import RdoPdf from "../components/RdoForms/RdoPdf";
// import PrincipalPreVgb from "../components/RdoForms/Croqui/PrincipalPreVgb";
// import UnderConstruction from "../pages/UnderConstruction";
// import EmployeeList from "../components/EmployeeList";
// import OccupationList from "../components/OccupationList";
// import GasistaPage from "../pages/RDO/GasistaPage";
// // import AttendanceWizardModal from "../components/RdoForms/AttendanceWizardModal";
// // import RdoMain from "../components/RDO/GasitaOperacoes/RdoMain";
// // import GasistaPage from "../pages/Rdo/GasistaPage";

// // Estilo principal
// const Main = styled.main`
//   flex: 1;
//   display: flex;
// `;
// // Mapeamento de rotas por ocupação
// const roleRoutes = [
//   {
//     allowedRoles: [2, 4, 5],
//     routes: [
//       { path: "/home", element: <Home /> },
//       // { path: "/home-copy", element: <HomeCopy /> },
//       { path: "/comercial/projetos/cadastrar", element: <Project /> },
//       { path: "/comercial/projetos/listar", element: <UnderConstruction featureName="Listar Projetos" /> },
//       { path: "/comercial/clientes/cadastrar", element: <RegisterCustomer /> },
//       { path: "/comercial/clientes/listar", element: <UnderConstruction featureName="Listar Clientes" /> },

//       // { path: "/funcionarios", element: <RegisterEmployee /> },
//       // { path: "/ocupacoes", element: <CreateOccupation /> },
//       // { path: "/notas", element: <CreateOs /> },
//       { path: "/comercial/servicos/cadastrar", element: <CreateService /> },
//       { path: "/comercial/servicos/listar", element: <UnderConstruction featureName="Listar Serviços" /> },
//       // { path: "/ordens", element: <GetOss /> },
//       // { path: "/configuracoes", element: <div>Configurações</div> },
//       // { path: "/rh", element: <Rh /> },
//       // { path: "/engenheiro", element: <Engenheiro /> },
//       // { path: "/tecnico", element: <Tecnico /> },
//       // { path: "/planner", element: <Planner /> },
//       // { path: "/minhas-notas", element: <MyService /> },
//       // { path: "/rdo-form/:id", element: <RdoFomrExtensionInative /> },
//       // { path: "/rdo-croqui", element: <PrincipalPreVgb /> },
//       // { path: "/pdf/:id", element: <RdoPdf /> },
//     ],
//   },
//   {
//     allowedRoles: [1, 7, 8, 2, 4, 5],
//     routes: [
//       { path: "/rdo/minhas-notas", element: <MyService /> },
//       { path: "/rdo-form/:id", element: <RdoFomrExtensionInative /> },
//       { path: "/rdo-croqui", element: <PrincipalPreVgb /> },
//       { path: "/pdf/:id", element: <RdoPdf /> },
//       { path: "/requisicoes/materiais", element: <UnderConstruction featureName="Requisitar Materiais" /> },
//       { path: "/requisicoes/epi", element: <UnderConstruction featureName="Requisitar EPI" /> },
//       { path: "/checklist/arl", element: <UnderConstruction featureName="ARL" /> },
//       { path: "/checklist/frota", element: <UnderConstruction featureName="Check-list Frota" /> },
//       // { path: "/rdo/gasista", element: <AttendanceWizardModal featureName="Gasista" /> },
//       // { path: "/rdo/gasista", element: <RdoMain featureName="Gasista" /> },
//       { path: "/rdo/gasista", element: <GasistaPage /> },

//     ],
//   },

//  {
//     allowedRoles: [1],
//     routes: [
//       { path: "/rdo/gasista", element: <GasistaPage /> },

//     ],
//   },

//   {
//     allowedRoles: [3, 2, 4, 5],
//     routes: [
//       { path: "/notas", element: <CreateOs /> },
//       { path: "/ordens/Despachar", element: <GetOss /> },
//       { path: "/pdf", element: <UnderConstruction featureName="PDF" /> },
//     ],
//   },
//   {
//     allowedRoles: [6, 2, 4, 5],
//     routes: [
//       // { path: "/funcionarios/cadastrar", element: <RegisterEmployee /> },
//       { path: "/Colaboradores/listar", element: <EmployeeList /> },
//       // { path: "/ocupacoes/cadastrar", element: <CreateOccupation /> },
//       { path: "/ocupacoes/listar", element: <OccupationList /> },

//     ],
//   },
// ];



// export default function AppRoutes() {
//   const methods = useForm();

//   return (
//     <Main>
//       <BrowserRouter>
//         <GlobalStyle />
//         <FormProvider {...methods}>
//           <Routes>
//             {/* Rotas públicas */}
//             <Route path="/login-master" element={<LoginMaster />} />
//             <Route path="/login" element={<Login />} />

//             <Route path="/" element={<Login />} />

//             {/* Rotas protegidas */}
//             <Route element={<PrivateRoute />}>
//               <Route element={<AuthenticatedLayout />}>
//                 {roleRoutes.map((roleGroup, i) => (
//                   <Route key={i} element={<RoleRoute allowedRoles={roleGroup.allowedRoles} />}>
//                     {roleGroup.routes.map((r) => (
//                       <Route key={r.path} path={r.path} element={r.element} />
//                     ))}
//                   </Route>
//                 ))}

//                 {/* Fallback */}
//                 {/* <Route path="*" element={<NotFound />} /> */}

//               </Route>
//             </Route>
//             <Route path="*" element={<Navigate to="/" replace />} />
//           </Routes>
//         </FormProvider>
//       </BrowserRouter>
//     </Main>
//   );
// }

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { FormProvider } from "../components/RdoForms/FormContext";
import GlobalStyle from "../layouts/GlobalStyle";

// Middlewares
import PrivateRoute from "./PrivateRoute";
import RoleRoute from "./RoleRoute";

// Layouts
import AuthenticatedLayout from "../layouts/AuthenticatedLayout";
import GasistaLayout from "../layouts/GasistaLayout";

// Páginas públicas
import Login from "../pages/Login";
import LoginMaster from "../pages/LoginMaster";

// Páginas
import Home from "../pages/Home";
import Project from "../pages/Project";
import UnderConstruction from "../pages/UnderConstruction";

// Componentes
import RegisterCustomer from "../components/RegisterCustomer";
import CreateService from "../components/CreateService";
import MyService from "../components/MyService";
import CreateOs from "../components/CreateOs";
import GetOss from "../components/GetOSs";
import RdoFomrExtensionInative from "../components/RdoForms/RdoFomrExtensionInative";
import RdoPdf from "../components/RdoForms/RdoPdf";
import PrincipalPreVgb from "../components/RdoForms/Croqui/PrincipalPreVgb";
import EmployeeList from "../components/EmployeeList";
import OccupationList from "../components/OccupationList";

// Gasista
import GasistaPage from "../pages/RDO/GasistaPage";
import IndexRedirect from "./IndexRedirect";

// Layout base
const Main = styled.main`
  flex: 1;
  display: flex;
`;

export default function AppRoutes() {
  const methods = useForm();

  return (
    <Main>
      <BrowserRouter>
        <GlobalStyle />
        <FormProvider {...methods}>
          <Routes>

            {/* 🌐 ROTA RAIZ */}
            <Route path="/" element={<IndexRedirect />} />


            {/* ===================== */}
            {/* 🌐 ROTAS PÚBLICAS */}
            {/* ===================== */}
            <Route path="/login" element={<Login />} />
            <Route path="/login-master" element={<LoginMaster />} />


            {/* ===================== */}
            {/* 🔒 ROTAS PROTEGIDAS */}
            {/* ===================== */}
            <Route element={<PrivateRoute />}>

              {/* ===================== */}
              {/* 🧱 FLUXO PADRÃO (COM SIDEBAR) */}
              {/* ===================== */}
              <Route element={<AuthenticatedLayout />}>
                <Route element={<RoleRoute allowedRoles={[2, 4, 5]} />}>
                  <Route path="/home" element={<Home />} />
                  <Route path="/comercial/projetos/cadastrar" element={<Project />} />
                  <Route path="/comercial/projetos/listar" element={<UnderConstruction featureName="Listar Projetos" />} />
                  <Route path="/comercial/clientes/cadastrar" element={<RegisterCustomer />} />
                  <Route path="/comercial/clientes/listar" element={<UnderConstruction featureName="Listar Clientes" />} />
                  <Route path="/comercial/servicos/cadastrar" element={<CreateService />} />
                  <Route path="/comercial/servicos/listar" element={<UnderConstruction featureName="Listar Serviços" />} />
                </Route>

                <Route element={<RoleRoute allowedRoles={[7, 8, 2, 4, 5]} />}>
                  <Route path="/rdo/minhas-notas" element={<MyService />} />
                  <Route path="/rdo-form/:id" element={<RdoFomrExtensionInative />} />
                  <Route path="/rdo-croqui" element={<PrincipalPreVgb />} />
                  <Route path="/pdf/:id" element={<RdoPdf />} />
                  <Route path="/requisicoes/materiais" element={<UnderConstruction featureName="Requisitar Materiais" />} />
                  <Route path="/requisicoes/epi" element={<UnderConstruction featureName="Requisitar EPI" />} />
                  <Route path="/checklist/arl" element={<UnderConstruction featureName="ARL" />} />
                  <Route path="/checklist/frota" element={<UnderConstruction featureName="Check-list Frota" />} />
                </Route>

                <Route element={<RoleRoute allowedRoles={[3, 2, 4, 5]} />}>
                  <Route path="/notas" element={<CreateOs />} />
                  <Route path="/ordens/Despachar" element={<GetOss />} />
                </Route>

                <Route element={<RoleRoute allowedRoles={[6, 2, 4, 5]} />}>
                  <Route path="/Colaboradores/listar" element={<EmployeeList />} />
                  <Route path="/ocupacoes/listar" element={<OccupationList />} />
                </Route>
              </Route>

              {/* ===================== */}
              {/* 🚧 FLUXO GASISTA (FULLSCREEN) */}
              {/* ===================== */}
              <Route element={<RoleRoute allowedRoles={[1]} />}>
                <Route element={<GasistaLayout />}>
                  <Route path="/rdo/gasista" element={<GasistaPage />} />
                </Route>
              </Route>

            </Route>

            {/* ===================== */}
            {/* 🔁 FALLBACK */}
            {/* ===================== */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </FormProvider>
      </BrowserRouter>
    </Main>
  );
}
