// src/layouts/AuthenticatedLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function AuthenticatedLayout() {
  return (
    <>
      <Sidebar />
        <Outlet /> {/* Renderiza a página filha aqui */}
   
    </>
  );
}