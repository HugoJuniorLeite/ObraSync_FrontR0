// // // src/components/Sidebar.jsx
// // import { NavLink } from "react-router-dom";
// // import { FaUser, FaFolderOpen, FaCog, FaClipboardList, FaFileInvoice, FaTools } from "react-icons/fa";
// // import styled from "styled-components";

// // const SidebarWrapper = styled.aside`
// //   width: 16rem;
// //   background-color: #1e1e1e;
// //   padding: 1.5rem;
// //   display: flex;
// //   flex-direction: column;
// //   gap: 1.5rem;
// //   height: 100vh;
// //   box-shadow: 2px 0 8px rgba(0, 0, 0, 0.3);
// // `;

// // const Logo = styled.div`
// //   font-size: 1.5rem;
// //   font-weight: bold;
// //   color: #f59e0b;
// //   margin-bottom: 1rem;
// //   padding-bottom: 1rem;
// //   border-bottom: 1px solid #333;
// // `;

// // const NavItem = styled(NavLink)`
// //   display: flex;
// //   align-items: center;
// //   gap: 0.75rem;
// //   color: #d1d5db;
// //   text-decoration: none;
// //   padding: 0.75rem 1rem;
// //   border-radius: 0.5rem;
// //   transition: all 0.2s ease;

// //   &:hover {
// //     color: white;
// //     background-color: #2d2d2d;
// //   }

// //   &.active {
// //     font-weight: bold;
// //     color: white;
// //     background-color: #2d2d2d;

// //     svg {
// //       color: #f59e0b;
// //     }
// //   }
// // `;

// // export default function Sidebar() {
// //   return (
// //     <SidebarWrapper>
// //       <Logo>ObraSync</Logo>
// //       <nav>
// //         <NavItem to="/clientes">
// //           <FaUser /> Clientes
// //         </NavItem>
// //         <NavItem to="/funcionarios">
// //           <FaUser /> Funcionários
// //         </NavItem>
// //         <NavItem to="/projetos">
// //           <FaFolderOpen /> Projetos
// //         </NavItem>
// //         <NavItem to="/servicos">
// //           <FaTools /> Cadastrar Serviço
// //         </NavItem>
// //         <NavItem to="/ocupacoes">
// //           <FaClipboardList /> Cadastrar Ocupação
// //         </NavItem>
// //         <NavItem to="/notas">
// //           <FaFileInvoice /> Emitir OS
// //         </NavItem>
// //         <NavItem to="/ordens">
// //           <FaClipboardList /> Programação
// //         </NavItem>
// //         <NavItem to="/configuracoes">
// //           <FaCog /> Configurações
// //         </NavItem>
// //       </nav>
// //     </SidebarWrapper>
// //   );
// // }


// // import { useContext, useState } from "react";
// // import { Link, useLocation } from "react-router-dom";
// // import { AuthContext } from "../contexts/AuthContext";
// // import { menuItems } from "../routes/menuItems";
// // import styled from "styled-components";

// // const SidebarContainer = styled.aside`
// //   width: 240px;
// //   background-color: #1f1f1f;
// //   color: white;
// //   min-height: 100vh;
// //   padding: 1rem;
// // `;

// // const MenuList = styled.ul`
// //   list-style: none;
// //   padding: 0;
// //   margin: 0;
// // `;

// // const MenuItem = styled.li`
// //   margin: 0.5rem 0;

// //   a {
// //     text-decoration: none;
// //     color: white;
// //     display: flex;
// //     align-items: center;
// //     gap: 0.5rem;
// //     padding: 0.5rem;
// //     border-radius: 4px;

// //     &:hover {
// //       background-color: #333;
// //     }

// //     &.active {
// //       background-color: #444;
// //     }
// //   }
// // `;

// // const SubMenuList = styled.ul`
// //   list-style: none;
// //   padding-left: 1.5rem;
// //   margin: 0.3rem 0;
// // `;

// // export default function Sidebar() {
// //   const { user } = useContext(AuthContext);
// //   const location = useLocation();
// //   const [openMenus, setOpenMenus] = useState({});

// //   if (!user) return null;

// //   const toggleSubMenu = (label) => {
// //     setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
// //   };

// //   const renderMenuItem = (item) => {
// //     const Icon = item.icon;

// //     // verifica se o usuário tem acesso
// //     if (!item.occupation.includes(user.occupation)) return null;

// //     if (item.submenu) {
// //       return (
// //         <MenuItem key={item.label}>
// //           <div
// //             style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}
// //             onClick={() => toggleSubMenu(item.label)}
// //           >
// //             {Icon && <Icon />}
// //             {item.label}
// //           </div>
// //           {openMenus[item.label] && (
// //             <SubMenuList>
// //               {item.submenu.map((sub) => {
// //                 if (!sub.occupation.includes(user.occupation)) return null;
// //                 const SubIcon = sub.icon;
// //                 return (
// //                   <li key={sub.label}>
// //                     <Link
// //                       to={sub.path}
// //                       className={location.pathname.startsWith(sub.path) ? "active" : ""}
// //                     >
// //                       {SubIcon && <SubIcon />}
// //                       {sub.label}
// //                     </Link>
// //                   </li>
// //                 );
// //               })}
// //             </SubMenuList>
// //           )}
// //         </MenuItem>
// //       );
// //     }

// //     return (
// //       <MenuItem key={item.label}>
// //         <Link to={item.path} className={location.pathname.startsWith(item.path) ? "active" : ""}>
// //           {Icon && <Icon />}
// //           {item.label}
// //         </Link>
// //       </MenuItem>
// //     );
// //   };

// //   return (
// //     <SidebarContainer>
// //       <MenuList>
// //         {menuItems.map(renderMenuItem)}
// //       </MenuList>
// //     </SidebarContainer>
// //   );
// // }
// import { useState, useContext } from "react";
// import { NavLink, useNavigate, useLocation } from "react-router-dom";
// import styled from "styled-components";
// import { Menu, LogOut } from "lucide-react";
// import { AuthContext } from "../contexts/AuthContext";
// import { menuItems } from "../routes/menuItems";

// const SidebarContainer = styled.aside`
//   width: ${(props) => (props.isOpen ? "280px" : "70px")};
//   background-color: #1f1f1f;
//   color: white;
//   min-height: 100vh;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
//   transition: width 0.3s ease;
// `;

// const TopBar = styled.div`
//   display: flex;
//   align-items: center;
//   color: #f59e0b;
//   justify-content: space-between;
//   padding: 1rem;
//   border-bottom: 1px solid #333;
// `;

// const Logo = styled.h1`
//   font-size: 1.25rem;
//   font-weight: bold;
// `;

// const MenuList = styled.ul`
//   list-style: none;
//   padding: 0;
//   margin: 0;
// `;

// const MenuItem = styled.li`
//   margin: 0.5rem 0;
//     cursor: pointer;

//   a,
//   div {
//     text-decoration: none;
//     color: white;
//     display: flex;
//     align-items: center;
//     gap: 0.5rem;
//     padding: 0.5rem 1rem;
//     border-radius: 4px;
//     cursor: pointer;
//     transition: background 0.2s;

//     &:hover {
//       background-color: #333;
//     }
//   }

//   .active {
//     background-color: #444;
//       svg {
//      color: #f59e0b;
//    }
//   }
// `;

// const SubMenuList = styled.ul`
//   list-style: none;
//   padding-left: 1.5rem;
//   margin: 0.3rem 0;
// `;

// const Footer = styled.div`
//   padding: 1rem;
//   border-top: 1px solid #333;
// `;

// export default function Sidebar() {
//   const [isOpen, setIsOpen] = useState(true);
//   const [openSubmenus, setOpenSubmenus] = useState({});
//   const { logout, user } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleLogout = () => {
//     if (window.confirm("Deseja realmente sair?")) {
//       logout();
//       navigate("/");
//     }
//   };

//   const toggleSubmenu = (label) => {
//     setOpenSubmenus((prev) => ({ ...prev, [label]: !prev[label] }));
//   };

//   const renderMenuItem = (item) => {
//     if (!item.occupation?.includes(user?.occupation)) return null;

//     if (item.submenu) {
//       return (
//         <MenuItem key={item.label}>
//           <div onClick={() => toggleSubmenu(item.label)}>
//             <item.icon size={20} />
//             {isOpen && <span>{item.label}</span>}
//           </div>
//           {openSubmenus[item.label] && (
//             <SubMenuList>
//               {item.submenu.map((sub) => {
//                 if (!sub.occupation?.includes(user?.occupation)) return null;
//                 return (
//                   <li key={sub.path}>
//                     <NavLink
//                       to={sub.path}
//                       className={({ isActive }) => (isActive ? "active" : "")}
//                     >
//                       <sub.icon size={18} />
//                       {isOpen && <span>{sub.label}</span>}
//                     </NavLink>
//                   </li>
//                 );
//               })}
//             </SubMenuList>
//           )}
//         </MenuItem>
//       );
//     }

//     return (
//       <MenuItem key={item.path}>
//         <NavLink
//           to={item.path}
//           className={({ isActive }) => (isActive ? "active" : "")}
//         >
//           <item.icon size={20} />
//           {isOpen && <span>{item.label}</span>}
//         </NavLink>
//       </MenuItem>
//     );
//   };

//   return (
//     <SidebarContainer isOpen={isOpen}>
//       {/* TOPO */}
//       <div>
//         <TopBar>
//           <button onClick={() => setIsOpen(!isOpen)}>
//             <Menu size={22}/>
//           </button>
//           {isOpen && <Logo>ObraSync</Logo>}
//         </TopBar>

//         {/* MENU */}
//         <MenuList>{menuItems.map(renderMenuItem)}</MenuList>
//       </div>

//       {/* RODAPÉ */}
//       <Footer>
//         <button
//           onClick={handleLogout}
//           className="flex items-center gap-3 text-red-400 hover:text-red-300 transition w-full"
//         >
//           <LogOut size={20}/>
//           {isOpen && <span>Sair</span>}
//         </button>
//       </Footer>
//     </SidebarContainer>
//   );
// }

import { useState, useContext } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Menu, LogOut } from "lucide-react";
import { AuthContext } from "../contexts/AuthContext";
import { menuItems } from "../routes/menuItems";

const SidebarContainer = styled.aside`
  width: ${(props) => (props.isOpen ? "200px" : "70px")};
  background-color: #1f1f1f;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: width 0.3s ease;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  color: #f59e0b;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #333;
`;

const Logo = styled.h1`
  font-size: 1.25rem;
  font-weight: bold;
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MenuItem = styled.li`
  margin: 0.5rem 0;
  cursor: pointer;

  a,
  div {
    text-decoration: none;
    color: white;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background-color: #333;
    }
  }

  .active {
    background-color: #444;

    svg {
      color: #f59e0b;
    }
  }
`;

const SubMenuList = styled.ul`
  list-style: none;
  padding-left: 1.5rem;
  margin: 0.3rem 0;
`;

const Footer = styled.div`
  padding: 1rem;
  border-top: 1px solid #333;
`;

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [openSubmenus, setOpenSubmenus] = useState({});
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm("Deseja realmente sair?")) {
      logout();
      navigate("/");
    }
  };

  const toggleSubmenu = (label) => {
    setOpenSubmenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  // Função recursiva para renderizar subníveis
  const renderMenuItem = (item, level = 0) => {
    if (!item.occupation?.includes(user?.occupation)) return null;

    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isOpenSubmenu = openSubmenus[item.label];
    const paddingLeft = `${0.1 + level * 0.5}rem`; // recuo proporcional ao nível

    return (
      <MenuItem key={item.label}>
        {hasSubmenu ? (
          <>
            <div onClick={() => toggleSubmenu(item.label)} style={{ paddingLeft }}>
              <item.icon size={20 - level * 2} />
              {isOpen && <span>{item.label}</span>}
            </div>

            {isOpenSubmenu && (
              <SubMenuList>
                {item.submenu.map((sub) => renderMenuItem(sub, level + 1))}
              </SubMenuList>
            )}
          </>
        ) : (
          <NavLink
            to={item.path}
            className={({ isActive }) => (isActive ? "active" : "")}
            style={{ paddingLeft }}
          >
            <item.icon size={20 - level * 2} />
            {isOpen && <span>{item.label}</span>}
          </NavLink>
        )}
      </MenuItem>
    );
  };

  return (
    <SidebarContainer isOpen={isOpen}>
      {/* TOPO */}
      <div>
        <TopBar>
          <button onClick={() => setIsOpen(!isOpen)}>
            <Menu size={22} />
          </button>
          {isOpen && <Logo>ObraSync</Logo>}
        </TopBar>

        {/* MENU */}
        <MenuList>{menuItems.map((item) => renderMenuItem(item))}</MenuList>
      </div>

      {/* RODAPÉ */}
      <Footer>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-400 hover:text-red-300 transition w-full"
        >
          <LogOut size={20} />
          {isOpen && <span>Sair</span>}
        </button>
      </Footer>
    </SidebarContainer>
  );
}
