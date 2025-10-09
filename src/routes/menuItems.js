// import { FaHome, FaProjectDiagram, FaUser, FaUsers, FaClipboard, FaFilePdf, FaTools, FaUserTie, FaChartLine, FaFolderOpen, FaUserPlus, FaListUl, FaIdBadge } from "react-icons/fa";

// export const menuItems = [
//   {
//     label: "Home",
//     path: "/home",
//     icon: FaHome,
//     occupation: [2, 4, 5],
//   },
//   {
//     label: "Projetos",
//     // path: "/projetos",
//     icon: FaProjectDiagram,
//     occupation: [2, 4, 5],
//       submenu: [
//   {
//     label: "Clientes",
//     path: "/clientes",
//     icon: FaUser,
//     occupation: [2, 4, 5],
//   },
//   {
//     label: "Serviços",
//     path: "/servicos",
//     icon: FaTools,
//     occupation: [2, 4, 5],
//   },
//       ]
//   },
//   {
//     label: "RDO",
//     icon: FaFolderOpen,
//     occupation: [1, 7, 8, 2, 4, 5],
//     submenu: [
//       {
//         label: "Minhas Notas",
//         path: "/minhas-notas",
//         icon: FaClipboard,
//         occupation: [1, 7, 8, 2, 4, 5],
//       },
//       // {
//       //   label: "RDO Form",
//       //   path: "/rdo-form",
//       //   icon: FaFilePdf,
//       //   occupation: [1, 7, 8, 2, 4, 5],
//       // },
//       // {
//       //   label: "RDO Croqui",
//       //   path: "/rdo-croqui",
//       //   icon: FaChartLine,
//       //   occupation: [1, 7, 8, 2, 4, 5],
//       // },
//       // {
//       //   label: "PDF",
//       //   path: "/pdf",
//       //   icon: FaFilePdf,
//       //   occupation: [1, 7, 8, 2, 4, 5],
//       // },
//     ],
//   },
// //   {
// //     label: "RH",
// //     // path: "/rh",
// //     icon: FaUserTie,
// //     occupation: [2, 4, 5],
// //   submenu: [
// //      {
// //     label: "Funcionários",
// //     path: "/funcionarios",
// //     icon: FaUsers,
// //     occupation: [2, 4, 5, 6],
// //   },
// //     {
// //     label: "Ocupações",
// //     path: "/ocupacoes",
// //     icon: FaUserTie,
// //     occupation: [2, 4, 5, 6],
// //   },
// // ]
// //   },

//  {
//   label: "RH",
//   icon: FaUserTie, // símbolo do setor de recursos humanos / liderança
//   occupation: [2, 4, 5],
//   submenu: [
//     {
//       label: "Funcionários",
//       icon: FaUsers, // grupo de pessoas
//       submenu: [
//         {
//           label: "Cadastrar",
//           path: "/funcionarios",
//           icon: FaUserPlus, // adicionar pessoa
//           occupation: [2, 4, 5, 6],
//         },
//         {
//           label: "Listar",
//           path: "/ocupacoes",
//           icon: FaListUl, // lista
//           occupation: [2, 4, 5, 6],
//         },
//       ],
//     },
//     {
//       label: "Ocupações",
//       path: "/ocupacoes",
//       icon: FaIdBadge, // crachá — simboliza cargo/ocupação
//       occupation: [2, 4, 5, 6],
//     },
//   ],
// },

//   {
//     label: "Planner",
//     // path: "/planner",
//     icon: FaChartLine,
//     occupation: [2, 4, 5],
//     submenu: [
//   {
//     label: "Notas",
//     path: "/notas",
//     icon: FaClipboard,
//     occupation: [2, 4, 5, 3],
//   },

//   {
//     label: "Ordens",
//     path: "/ordens",
//     icon: FaClipboard,
//     occupation: [2, 4, 5, 3],
//   },

//     ]
//   },
// ];

import {
  FaHome,
  FaProjectDiagram,
  FaUser,
  FaUsers,
  FaClipboard,
  FaTools,
  FaUserTie,
  FaChartLine,
  FaFolderOpen,
  FaUserPlus,
  FaListUl,
  FaIdBadge,
  FaClipboardCheck,
  FaHardHat,
  FaBoxOpen,
  FaFilePdf
} from "react-icons/fa";

export const menuItems = [
  {
    label: "Home",
    path: "/home",
    icon: FaHome,
    occupation: [2, 4, 5],
  },
  // {
  //   label: "Projetos",
  //   icon: FaProjectDiagram,
  //   occupation: [2, 4, 5],
  //   submenu: [
  //     {
  //       label: "Clientes",
  //       path: "/clientes",
  //       icon: FaUser,
  //       occupation: [2, 4, 5],
  //     },
  //     {
  //       label: "Serviços",
  //       path: "/servicos",
  //       icon: FaTools,
  //       occupation: [2, 4, 5],
  //     },
  //   ],
  // },

    {
    label: "Comercial",
    icon: FaFolderOpen, // pasta principal
    occupation: [2, 4, 5],
    submenu: [
      {
        label: "Clientes",
        icon: FaUsers, // subpasta
        occupation: [2, 4, 5],
        submenu: [
          {
            label: "Criar",
            path: "/comercial/clientes/cadastrar",
            icon: FaUserPlus, // item
            occupation: [2, 4, 5],
          },
          {
            label: "Listar",
            path: "/comercial/clientes/listar",
            icon: FaListUl, // item
            occupation: [2, 4, 5],
          },
        ],
      },
      {
        label: "Projetos",
        icon: FaProjectDiagram, // subpasta
        occupation: [2, 4, 5],
        submenu: [
          {
            label: "Criar",
            path: "/comercial/projetos/cadastrar",
            icon: FaUserPlus, // item
            occupation: [2, 4, 5],
          },
          {
            label: "Listar",
            path: "/comercial/projetos/listar",
            icon: FaListUl, // item
            occupation: [2, 4, 5],
          },
        ],
      },
      {
        label: "Serviços",
        icon: FaTools, // subpasta
        occupation: [2, 4, 5],
        submenu: [
          {
            label: "Criar",
            path: "/comercial/servicos/cadastrar",
            icon: FaUserPlus, // item
            occupation: [2, 4, 5],
          },
          {
            label: "Listar",
            path: "/comercial/servicos/listar",
            icon: FaListUl, // item
            occupation: [2, 4, 5],
          },
        ],
      },
    ],
  },
   {
    label: "RDO",
    icon: FaFolderOpen, // pasta principal
    occupation: [1, 7, 8, 2, 4, 5],
    submenu: [
      {
        label: "Minhas Notas",
        path: "/rdo/minhas-notas",
        icon: FaClipboard, // item
        occupation: [1, 7, 8, 2, 4, 5],
      },
    ],
  },
  {
    label: "Requisições",
    icon: FaFolderOpen, // pasta principal
    occupation: [1, 7, 8, 2, 4, 5],
    submenu: [
      {
        label: "Materiais",
        path: "/requisicoes/materiais",
        icon: FaBoxOpen, // item
        occupation: [1, 7, 8, 2, 4, 5],
      },
      {
        label: "EPI",
        path: "/requisicoes/epi",
        icon: FaHardHat, // item
        occupation: [1, 7, 8, 2, 4, 5],
      },
    ],
  },
  {
    label: "Check-list",
    icon: FaFolderOpen, // pasta principal
    occupation: [1, 7, 8, 2, 4, 5],
    submenu: [
      {
        label: "ARL",
        path: "/checklist/arl",
        icon: FaClipboardCheck, // item
        occupation: [1, 7, 8, 2, 4, 5],
      },
      {
        label: "Frota",
        path: "/checklist/frota",
        icon: FaClipboardCheck, // item
        occupation: [1, 7, 8, 2, 4, 5],
      },
    ],
  },
  {
    label: "RH",
    icon: FaUserTie,
    occupation: [2, 4, 5],
    submenu: [
      {
        label: "Funcionários",
        icon: FaUsers,
        occupation: [2, 4, 5, 6],
        submenu: [
          {
            label: "Criar",
            path: "/funcionarios/cadastrar",
            icon: FaUserPlus,
            occupation: [2, 4, 5, 6],
          },
          {
            label: "Listar",
            path: "/funcionarios/listar",
            icon: FaListUl,
            occupation: [2, 4, 5, 6],
          },
        ],
      },
      {
        label: "Ocupações",
        icon: FaIdBadge,
        occupation: [2, 4, 5, 6],
        submenu: [
          {
            label: "Criar",
            path: "/ocupacoes/cadastrar",
            icon: FaUserPlus,
            occupation: [2, 4, 5, 6],
          },
          {
            label: "Listar",
            path: "/ocupacoes/listar",
            icon: FaListUl,
            occupation: [2, 4, 5, 6],
          },
        ],
      },
    ],
  },
  {
    label: "Planner",
    icon: FaChartLine,
    occupation: [2, 4, 5],
    submenu: [
      {
        label: "Notas",
        path: "/notas",
        icon: FaClipboard,
        occupation: [2, 4, 5, 3],
      },
      {
        label: "Ordens",
        path: "/ordens",
        icon: FaClipboard,
        occupation: [2, 4, 5, 3],
      },
      {
        label: "PDF",
        path: "/pdf",
        icon: FaFilePdf,
        occupation: [2, 4, 5, 3],
      },
    ],
  },
];
