// // // import { BrowserRouter, Route, Routes } from "react-router-dom";
// // // import LoginMaster from "../pages/LoginMaster";
// // // import Project from "../pages/Project";
// // // import Home from "../pages/Home";
// // // import RdoFomrExtensionInative from "../components/RdoForms/RdoFomrExtensionInative";
// // // import { FormProvider } from "../components/RdoForms/FormContext";
// // // import GlobalStyle from "../layouts/GlobalStyle";
// // // import { useForm } from "react-hook-form";
// // // import PrincipalPreVgb from "../components/RdoForms/Croqui/PrincipalPreVgb";
// // // import Sidebar from "../components/Sidebar";
// // // import styled from "styled-components";
// // // import RegisterCustomer from "../components/RegisterCustomer";
// // // import RegisterEmployee from "../components/RegisterEmployee";
// // // import CreateOccupation from "../components/CreateOccupation";
// // // import CreateOs from "../components/CreateOs";
// // // import CreateService from "../components/CreateService";
// // // import GetOss from "../components/GetOSs";
// // // import AuthenticatedLayout from "../layouts/AuthenticatedLayout";
// // // import Login from "../pages/Login";
// // // import HomeCopy from "../pages/HomeCopy";
// // // import { useState } from "react";
// // // import Rh from "../pages/Rh";
// // // import Planner from "../pages/Planner.jsx";
// // // import MyService from "../components/MyService.jsx";
// // // import Tecnico from "../pages/Tecnico.jsx";
// // // import Engenheiro from "../pages/Engenheiro.jsx";
// // // import RdoPdf from "../components/RdoForms/RdoPdf.jsx";
// // // // import { Container, Main } from "../layouts/Theme";
// // // // import { LoginMaster } from "../pages/LoginMaster";



// // // const Container = styled.div`
// // //   display: flex;
// // //   height: 100%;
// // //   width:100%;
// // //   background-color: #2c2c2c;
// // //   color: white;
// // // `;

// // // const Main = styled.main`
// // //   flex: 1;
// // //   /* padding: 2.5rem; */
// // //   display: flex;
// // //   flex-direction: flex  ;
// // //   /* gap: 2.5rem; */
// // // `;

// // // export default function AppRoutes() {
// // //   const [role, setRole] = useState("")
// // //   const methods = useForm();
// // //   return (


// // //     <Main>
// // //       <BrowserRouter>
// // //         <GlobalStyle />
// // //         <FormProvider {...methods}>

// // //           {/* <Sidebar></Sidebar> */}
// // //           <Routes>
// // //             <Route path="/" element={<LoginMaster />}
// // //             />
// // //             <Route path="/login" element={<Login />}
// // //             />
// // //             <Route path="/home-copy" element={<HomeCopy />} ></Route>
// // //             <Route path="/rh" element={<Rh />} ></Route>
// // //             <Route path="/engenheiro" element={<Engenheiro />} ></Route>
// // //             <Route path="/tecnico" element={<Tecnico />} ></Route>
// // //             <Route path="/planner" element={<Planner />} ></Route>

// // //             <Route path="//pdf/:id" element={<RdoPdf />} ></Route>
// // //             <Route path="/minhas-notas" element={<MyService />} ></Route>

// // //               <Route path="/rdo-form/:id" element={<RdoFomrExtensionInative />} />
// // //               <Route path="/rdo-croqui" element={<PrincipalPreVgb />} />



// // //             <Route element={<AuthenticatedLayout />}>
// // //               <Route path="/projetos" element={<Project />} ></Route>
// // //               <Route path="/home" element={<Home />} ></Route>
// // //               <Route path="/nota" element={<RdoFomrExtensionInative />} ></Route>
// // //               <Route path="/clientes" element={<RegisterCustomer />} />

// // //               {/* ✅ Adicione aqui as novas rotas do ObraSync */}
// // //               <Route path="/funcionarios" element={<RegisterEmployee />} />
// // //               <Route path="/ocupacoes" element={<CreateOccupation />} />
// // //               <Route path="/notas" element={<CreateOs />} />
// // //               <Route path="/servicos" element={<CreateService />} />
// // //               <Route path="/ordens" element={<GetOss />} />
// // //               <Route path="/configuracoes" element={<div>Configurações</div>} />
// // //             </Route>
// // //           </Routes>
// // //         </FormProvider>
// // //       </BrowserRouter>
// // //     </Main>
// // //   )
// // // }


// // import { BrowserRouter, Route, Routes } from "react-router-dom";
// // import LoginMaster from "../pages/LoginMaster";
// // import Project from "../pages/Project";
// // import Home from "../pages/Home";
// // import { FormProvider } from "../components/RdoForms/FormContext";
// // import GlobalStyle from "../layouts/GlobalStyle";
// // import { useForm } from "react-hook-form";
// // import styled from "styled-components";
// // import RegisterCustomer from "../components/RegisterCustomer";
// // import RegisterEmployee from "../components/RegisterEmployee";
// // import CreateOccupation from "../components/CreateOccupation";
// // import CreateOs from "../components/CreateOs";
// // import CreateService from "../components/CreateService";
// // import GetOss from "../components/GetOSs";
// // import AuthenticatedLayout from "../layouts/AuthenticatedLayout";
// // import Login from "../pages/Login";
// // import Rh from "../pages/Rh";
// // import Planner from "../pages/Planner";
// // import MyService from "../components/MyService";
// // import Tecnico from "../pages/Tecnico";
// // import Engenheiro from "../pages/Engenheiro";
// // import RdoFomrExtensionInative from "../components/RdoForms/RdoFomrExtensionInative";
// // import RdoPdf from "../components/RdoForms/RdoPdf";
// // import PrincipalPreVgb from "../components/RdoForms/Croqui/PrincipalPreVgb";
// // import PrivateRoute from "./PrivateRoute"; // 👈 novo import
// // import HomeCopy from "../pages/HomeCopy";

// // const Main = styled.main`
// //   flex: 1;
// //   display: flex;
// //   flex-direction: flex;
// // `;

// // export default function AppRoutes() {
// //   const methods = useForm();

// //   return (
// //     <Main>
// //       <BrowserRouter>
// //         <GlobalStyle />
// //         <FormProvider {...methods}>
// //           <Routes>
// //             {/* Rotas públicas */}
// //             <Route path="/" element={<LoginMaster />} />
// //             <Route path="/login" element={<Login />} />

// //             {/* Rotas protegidas */}
// //             <Route element={<PrivateRoute />}>
// //               <Route element={<AuthenticatedLayout />}>
// //                 <Route path="/home" element={<Home />} />
// //                 <Route path="/projetos" element={<Project />} />
// //                 <Route path="/clientes" element={<RegisterCustomer />} />
// //                 <Route path="/funcionarios" element={<RegisterEmployee />} />
// //                 <Route path="/ocupacoes" element={<CreateOccupation />} />
// //                 <Route path="/notas" element={<CreateOs />} />
// //                 <Route path="/servicos" element={<CreateService />} />
// //                 <Route path="/ordens" element={<GetOss />} />
// //                 <Route path="/configuracoes" element={<div>Configurações</div>} />
// //                 <Route path="/rh" element={<Rh />} />
// //                 <Route path="/engenheiro" element={<Engenheiro />} />
// //                 <Route path="/tecnico" element={<Tecnico />} />
// //                 <Route path="/planner" element={<Planner />} />
// //                 <Route path="/minhas-notas" element={<MyService />} />
// //                 <Route path="/rdo-form/:id" element={<RdoFomrExtensionInative />} />
// //                 <Route path="/rdo-croqui" element={<PrincipalPreVgb />} />
// //                 <Route path="/pdf/:id" element={<RdoPdf />} />
// //                              <Route path="/home-copy" element={<HomeCopy />} ></Route>

// //               </Route>
// //             </Route>
// //           </Routes>
// //         </FormProvider>
// //       </BrowserRouter>
// //     </Main>
// //   );
// // }


// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import PrivateRoute from "./PrivateRoute";
// import RoleRoute from "./RoleRoute";
// import { FormProvider } from "../components/RdoForms/FormContext";
// import { useForm } from "react-hook-form";
// import styled from "styled-components";
// import GlobalStyle from "../layouts/GlobalStyle";

// // pages e componentes
// import Login from "../pages/Login";
// import LoginMaster from "../pages/LoginMaster";
// import Home from "../pages/Home";
// import Project from "../pages/Project";
// import RegisterCustomer from "../components/RegisterCustomer";
// import RegisterEmployee from "../components/RegisterEmployee";
// import CreateOccupation from "../components/CreateOccupation";
// import CreateOs from "../components/CreateOs";
// import CreateService from "../components/CreateService";
// import GetOss from "../components/GetOSs";
// import AuthenticatedLayout from "../layouts/AuthenticatedLayout";
// import Rh from "../pages/Rh";
// import Planner from "../pages/Planner";
// import MyService from "../components/MyService";
// import Tecnico from "../pages/Tecnico";
// import Engenheiro from "../pages/Engenheiro";
// import RdoFomrExtensionInative from "../components/RdoForms/RdoFomrExtensionInative";
// import RdoPdf from "../components/RdoForms/RdoPdf";
// import PrincipalPreVgb from "../components/RdoForms/Croqui/PrincipalPreVgb";
// import HomeCopy from "../pages/HomeCopy";

// const Main = styled.main`
//   flex: 1;
//   display: flex;
// `;

// export default function AppRoutes() {
//   const methods = useForm();

//   return (
//     <Main>
//       <BrowserRouter>
//         <GlobalStyle />
//         <FormProvider {...methods}>
//           <Routes>
//             {/* Rotas públicas */}
//             <Route path="/" element={<LoginMaster />} />
//             <Route path="/login" element={<Login />} />

//             {/* Rotas protegidas */}
//             <Route element={<PrivateRoute />}>
//               <Route element={<AuthenticatedLayout />}>

//                 {/* Acesso total: occupation 2,4,5 */}
//                 <Route element={<RoleRoute allowedRoles={[2, 4, 5]} />}>
//                   <Route path="/home" element={<Home />} />
//                   <Route path="/projetos" element={<Project />} />
//                   <Route path="/clientes" element={<RegisterCustomer />} />
//                   <Route path="/funcionarios" element={<RegisterEmployee />} />
//                   <Route path="/ocupacoes" element={<CreateOccupation />} />
//                   <Route path="/notas" element={<CreateOs />} />
//                   <Route path="/servicos" element={<CreateService />} />
//                   <Route path="/ordens" element={<GetOss />} />
//                   <Route path="/configuracoes" element={<div>Configurações</div>} />
//                   <Route path="/rh" element={<Rh />} />
//                   <Route path="/engenheiro" element={<Engenheiro />} />
//                   <Route path="/tecnico" element={<Tecnico />} />
//                   <Route path="/planner" element={<Planner />} />
//                   <Route path="/minhas-notas" element={<MyService />} />
//                   <Route path="/rdo-form/:id" element={<RdoFomrExtensionInative />} />
//                   <Route path="/rdo-croqui" element={<PrincipalPreVgb />} />
//                   <Route path="/pdf/:id" element={<RdoPdf />} />
//                   <Route path="/home-copy" element={<HomeCopy />} />
//                 </Route>

//                 {/* Occupation 1,7,8 → acesso notas e RDO */}
//                 <Route element={<RoleRoute allowedRoles={[1, 7, 8]} />}>
//                   <Route path="/minhas-notas" element={<MyService />} />
//                   <Route path="/rdo-form/:id" element={<RdoFomrExtensionInative />} />
//                   <Route path="/rdo-croqui" element={<PrincipalPreVgb />} />
//                   <Route path="/pdf/:id" element={<RdoPdf />} />
//                 </Route>

//                 {/* Occupation 3 → notas e ordens */}
//                 <Route element={<RoleRoute allowedRoles={[3]} />}>
//                   <Route path="/notas" element={<CreateOs />} />
//                   <Route path="/ordens" element={<GetOss />} />
//                 </Route>

//                 {/* Occupation 6 → funcionarios e ocupações */}
//                 <Route element={<RoleRoute allowedRoles={[6]} />}>
//                   <Route path="/funcionarios" element={<RegisterEmployee />} />
//                   <Route path="/ocupacoes" element={<CreateOccupation />} />
//                 </Route>

//                 {/* Fallback */}
//                 <Route path="*" element={<NotFound />} />
//               </Route>
//             </Route>
//           </Routes>
//         </FormProvider>
//       </BrowserRouter>
//     </Main>
//   );
// }



import { BrowserRouter, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { FormProvider } from "../components/RdoForms/FormContext";
import GlobalStyle from "../layouts/GlobalStyle";

// Middlewares
import PrivateRoute from "./PrivateRoute";
import RoleRoute from "./RoleRoute";

// Layout
import AuthenticatedLayout from "../layouts/AuthenticatedLayout";

// Páginas públicas
import Login from "../pages/Login";
import LoginMaster from "../pages/LoginMaster";

// Páginas principais
import Home from "../pages/Home";
import HomeCopy from "../pages/HomeCopy";
import Project from "../pages/Project";

// Componentes e páginas internas
import RegisterCustomer from "../components/RegisterCustomer";
import RegisterEmployee from "../components/RegisterEmployee";
import CreateOccupation from "../components/CreateOccupation";
import CreateOs from "../components/CreateOs";
import CreateService from "../components/CreateService";
import GetOss from "../components/GetOSs";
import Rh from "../pages/Rh";
import Planner from "../pages/Planner";
import MyService from "../components/MyService";
import Tecnico from "../pages/Tecnico";
import Engenheiro from "../pages/Engenheiro";
import RdoFomrExtensionInative from "../components/RdoForms/RdoFomrExtensionInative";
import RdoPdf from "../components/RdoForms/RdoPdf";
import PrincipalPreVgb from "../components/RdoForms/Croqui/PrincipalPreVgb";
import UnderConstruction from "../pages/UnderConstruction";
// import UnderConstruction from "../pages/UnderConstruction";
// import NotFound from "../pages/NotFound"; // ✅ Crie se ainda não existir

// Estilo principal
const Main = styled.main`
  flex: 1;
  display: flex;
`;
// Mapeamento de rotas por ocupação
const roleRoutes = [
  {
    allowedRoles: [2, 4, 5],
    routes: [
      { path: "/home", element: <Home /> },
      { path: "/home-copy", element: <HomeCopy /> },
      { path: "/comercial/projetos/cadastrar", element: <Project /> },
      { path: "/comercial/projetos/listar", element: <UnderConstruction featureName="Listar Projetos" /> },
      { path: "/comercial/clientes/cadastrar", element: <RegisterCustomer /> },
      { path: "/comercial/clientes/listar", element: <UnderConstruction featureName="Listar Clientes" /> },

      // { path: "/funcionarios", element: <RegisterEmployee /> },
      // { path: "/ocupacoes", element: <CreateOccupation /> },
      // { path: "/notas", element: <CreateOs /> },
      { path: "/comercial/servicos/cadastrar", element: <CreateService /> },
      { path: "/comercial/servicos/listar", element: <UnderConstruction featureName="Listar Serviços" /> },
      // { path: "/ordens", element: <GetOss /> },
      { path: "/configuracoes", element: <div>Configurações</div> },
      { path: "/rh", element: <Rh /> },
      { path: "/engenheiro", element: <Engenheiro /> },
      { path: "/tecnico", element: <Tecnico /> },
      { path: "/planner", element: <Planner /> },
      // { path: "/minhas-notas", element: <MyService /> },
      // { path: "/rdo-form/:id", element: <RdoFomrExtensionInative /> },
      // { path: "/rdo-croqui", element: <PrincipalPreVgb /> },
      // { path: "/pdf/:id", element: <RdoPdf /> },
    ],
  },
  {
    allowedRoles: [1, 7, 8, 2, 4, 5],
    routes: [
      { path: "/rdo/minhas-notas", element: <MyService /> },
      { path: "/rdo-form/:id", element: <RdoFomrExtensionInative /> },
      { path: "/rdo-croqui", element: <PrincipalPreVgb /> },
      { path: "/pdf/:id", element: <RdoPdf /> },
      { path: "/requisicoes/materiais", element: <UnderConstruction featureName="Requisitar Materiais" /> },
      { path: "/requisicoes/epi", element: <UnderConstruction featureName="Requisitar EPI" /> },
      { path: "/checklist/arl", element: <UnderConstruction featureName="ARL" /> },
      { path: "/checklist/frota", element: <UnderConstruction featureName="Check-list Frota" /> },


    ],
  },
  {
    allowedRoles: [3, 2, 4, 5],
    routes: [
      { path: "/notas", element: <CreateOs /> },
      { path: "/ordens", element: <GetOss /> },
      { path: "/pdf", element: <UnderConstruction featureName="PDF" /> },
    ],
  },
  {
    allowedRoles: [6, 2, 4, 5],
    routes: [
      { path: "/funcionarios/cadastrar", element: <RegisterEmployee /> },
      { path: "/funcionarios/listar", element: <UnderConstruction featureName="Listar Funcionários" /> },
      { path: "/ocupacoes/cadastrar", element: <CreateOccupation /> },
      { path: "/ocupacoes/listar", element: <UnderConstruction featureName="Listar Ocupações" />},

    ],
  },
];



export default function AppRoutes() {
  const methods = useForm();

  return (
    <Main>
      <BrowserRouter>
        <GlobalStyle />
        <FormProvider {...methods}>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/login-master" element={<LoginMaster />} />
            <Route path="/" element={<Login />} />

            {/* Rotas protegidas */}
            <Route element={<PrivateRoute />}>
              <Route element={<AuthenticatedLayout />}>
                {roleRoutes.map((roleGroup, i) => (
                  <Route key={i} element={<RoleRoute allowedRoles={roleGroup.allowedRoles} />}>
                    {roleGroup.routes.map((r) => (
                      <Route key={r.path} path={r.path} element={r.element} />
                    ))}
                  </Route>
                ))}

                {/* Fallback */}
                {/* <Route path="*" element={<NotFound />} /> */}
              </Route>
            </Route>
          </Routes>
        </FormProvider>
      </BrowserRouter>
    </Main>
  );
}