// src/layouts/AuthenticatedLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
// import styled from "styled-components";

// const LayoutContainer = styled.div`
//   display: flex;
//   min-height: 100vh;
//   background-color: #f8fafc;
// `;

// const MainContent = styled.main`
//   flex: 1;
//   padding: 2rem;
//   overflow-y: auto;
// `;

export default function AuthenticatedLayout() {
  return (
    <>
      <Sidebar />
        <Outlet /> {/* Renderiza a página filha aqui */}
   
    </>
  );
}