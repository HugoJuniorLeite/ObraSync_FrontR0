import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Sidebar from "../components/Sidebar";
import ProjectForm from "../components/ProjectForm";
import ProjectList from "../components/ProjectList";
import CreateService from "../components/CreateService";
import RegisterEmployee from "../components/RegisterEmployee";
import CreateOccupation from "../components/CreateOccupation";
import CreateOs from "../components/CreateOs";
import GetOss from "../components/GetOSs";
import MyService from "../components/MyService";

import RdoPdf from "../components/RdoForms/RdoPdf";

import PowerBIContainer from "../components/dashboard/PowerBIContainer";
import Login from "./Login";

// import Projects from "../components/Projects";

const Container = styled.div`
  display: flex;
  height: 100vh;
  width:100%;
  background-color: #2c2c2c;
  color: white;
`;

const Main = styled.main`
  flex: 1;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;





export default function Home() {
  // const [projects, setProjects] = useState([]);

  // useEffect(() => {
  //   async function fetchProjects() {
  //     const response = await fetch("/api/projects");
  //     const data = await response.json();
  //     setProjects(data);
  //   }
  //   fetchProjects();
  // }, []);

  return (
    <Container>

      <Main>

       {/* <Sidebar /> */}
      {/* <Main> */}
        {/* <ProjectForm /> */}
        {/* <ProjectList projects={projects} /> */}


        <PowerBIContainer></PowerBIContainer>
        {/* <Projects></Projects>  */}

{/*

*/}



         {/* <MyService></MyService> */}

 {/* <RdoPdf/>  */}

        {/* <GetOss></GetOss> */}



      </Main>

        {/* <MyService></MyService> */}
      {/* </Main> */}

    </Container>
  );
}
