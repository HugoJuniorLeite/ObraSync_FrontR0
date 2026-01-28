// src/layouts/AuthenticatedLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import styled from "styled-components";

const Layout = styled.div`
  display: flex;
  min-height: 100%;
    width: 100%;
`;

const Content = styled.main`
  flex: 1;
 overflow-y: auto;   

`;

export default function AuthenticatedLayout() {
  return (
    <Layout>
      <Sidebar />
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
}
