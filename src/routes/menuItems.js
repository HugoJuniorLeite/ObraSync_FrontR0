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
  FaFilePdf,
  FaTruckLoading,
  FaEye,
  FaPaperPlane,
  FaTasks,
  FaFileInvoice,
  FaPlusSquare,
  FaFileAlt
} from "react-icons/fa";

export const menuItems = [
  {
    label: "Home",
    path: "/home",
    icon: FaHome,
    occupation: [9, 2, 4, 5],
  },
  {
    label: "Comercial",
    icon: FaFolderOpen, // pasta principal
    occupation: [9, 2, 4, 5],
    submenu: [
      {
        label: "Clientes",
        icon: FaUsers, // subpasta
        occupation: [9, 2, 4, 5],
        submenu: [
          {
            label: "Criar",
            path: "/comercial/clientes/cadastrar",
            icon: FaUserPlus, // item
            occupation: [9, 2, 4, 5],
          },
          {
            label: "Listar",
            path: "/comercial/clientes/listar",
            icon: FaListUl, // item
            occupation: [9, 2, 4, 5],
          },
        ],
      },
      {
        label: "Projetos",
        icon: FaProjectDiagram, // subpasta
        occupation: [9, 2, 4, 5],
        submenu: [
          {
            label: "Criar",
            path: "/comercial/projetos/cadastrar",
            icon: FaUserPlus, // item
            occupation: [9, 2, 4, 5],
          },
          {
            label: "Listar",
            path: "/comercial/projetos/listar",
            icon: FaListUl, // item
            occupation: [9, 2, 4, 5],
          },
        ],
      },
      {
        label: "Serviços",
        icon: FaTools, // subpasta
        occupation: [9, 2, 4, 5],
        submenu: [
          {
            label: "Criar",
            path: "/comercial/servicos/cadastrar",
            icon: FaUserPlus, // item
            occupation: [9, 2, 4, 5],
          },
          {
            label: "Listar",
            path: "/comercial/servicos/listar",
            icon: FaListUl, // item
            occupation: [9, 2, 4, 5],
          },
        ],
      },
    ],
  },
  {
    label: "RDO",
    icon: FaFolderOpen, // pasta principal
    occupation: [9, 1, 7, 8, 2, 4, 5],
    submenu: [
      {
        label: "Minhas Notas",
        path: "/rdo/minhas-notas",
        icon: FaClipboard, // item
        occupation: [9, 1, 7, 8, 2, 4, 5],
      },
         {
        label: "Gasista",
        path: "/rdo/gasista",
        icon: FaClipboard, // item
        occupation: [9, 1, 7, 8, 2, 4, 5],
      },
    ],
  },
  {
    label: "Requisições",
    icon: FaFolderOpen, // pasta principal
    occupation: [9, 1, 7, 8, 2, 4, 5],
    submenu: [
      {
        label: "Materiais",
        path: "/requisicoes/materiais",
        icon: FaBoxOpen, // item
        occupation: [9, 1, 7, 8, 2, 4, 5],
      },
      {
        label: "EPI",
        path: "/requisicoes/epi",
        icon: FaHardHat, // item
        occupation: [9, 1, 7, 8, 2, 4, 5],
      },
    ],
  },
  {
    label: "Check-list",
    icon: FaFolderOpen, // pasta principal
    occupation: [9, 1, 7, 8, 2, 4, 5],
    submenu: [
      {
        label: "ARL",
        path: "/checklist/arl",
        icon: FaClipboardCheck, // item
        occupation: [9, 1, 7, 8, 2, 4, 5],
      },
      {
        label: "Frota",
        path: "/checklist/frota",
        icon: FaClipboardCheck, // item
        occupation: [9, 1, 7, 8, 2, 4, 5],
      },
    ],
  },
  {
    label: "RH",
    icon: FaUserTie,
    occupation: [8, 9, 2, 4, 5],
    submenu: [
      {
        label: "Funcionários",
        path: "/funcionarios/listar",
        icon: FaUsers,
        occupation: [8, 9, 2, 4, 5, 6],
        // submenu: [
        //   {
        //     label: "Criar",
        //     path: "/funcionarios/cadastrar",
        //     icon: FaUserPlus,
        //     occupation: [8, 9, 2, 4, 5, 6],
        //   },
        //   {
        //     label: "Listar",
        //     path: "/funcionarios/listar",
        //     icon: FaListUl,
        //     occupation: [9, 2, 4, 5, 6],
        //   },
        // ],
      },
      {
        label: "Ocupações",
        path: "/ocupacoes/listar",
        icon: FaIdBadge,
        occupation: [9, 2, 4, 5, 6],
        //   submenu: [
        //     {
        //       label: "Criar",
        //       path: "/ocupacoes/cadastrar",
        //       icon: FaUserPlus,
        //       occupation: [9, 2, 4, 5, 6],
        //     },
        //     {
        //       label: "Listar",
        //       path: "/ocupacoes/listar",
        //       icon: FaListUl,
        //       occupation: [9, 2, 4, 5, 6],
        //     },
        //   ],
      },
    ],
  },
  {
    label: "Planner",
    icon: FaChartLine,
    occupation: [9, 2, 4, 5],
    submenu: [

      {
        label: "Ordens",
        icon: FaClipboard,
        occupation: [9, 4, 5, 3],
        submenu: [
          {
            label: "Criar nota",
            path: "/notas",
            icon: FaFileAlt,
            occupation: [9, 2, 4, 5, 3],
          },
          {
            label: "Programar",
            path: "/ordens/Despachar",
            icon: FaTasks, // ícone de envio/logística
            occupation: [9, 4, 5, 3],
          },
          {
            label: "Acompanhar",
            path: "/ordens/Acompanhar",
            icon: FaChartLine, // ícone de visualização/monitoramento
            occupation: [9, 4, 5, 3],
          },
        ],
      },
      {
        label: "PDF",
        path: "/pdf",
        icon: FaFilePdf,
        occupation: [9, 2, 4, 5, 3],
      },
    ],
  },
];
