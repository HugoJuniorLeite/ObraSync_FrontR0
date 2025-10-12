
import { useState, useContext } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Menu, LogOut } from "lucide-react";
import { AuthContext } from "../contexts/AuthContext";
import { menuItems } from "../routes/menuItems";

const SidebarContainer = styled.aside`
  width: ${(props) => (props.$isOpen ? "200px" : "100px")};
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

const LogoutButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center; /* Centraliza ícone + texto */
  gap: 0.5rem;
  background: none;
  border: none;
  color: #f87171; /* vermelho suave */
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 6px;
  padding: 0.6rem 0.8rem;

  &:hover {
    background-color: #333;
    color: #fca5a5;
  }

  svg {
    transition: color 0.2s ease;
  }

  &:hover svg {
    color: #f59e0b; /* cor de destaque do sidebar */
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
    <SidebarContainer $isOpen={isOpen}>
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
        <LogoutButton onClick={handleLogout}>
          <LogOut size={20} />
          {isOpen && <span>Sair</span>}
        </LogoutButton>
      </Footer>
    </SidebarContainer>
  );
}
