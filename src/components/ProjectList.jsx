import React from "react";
import styled from "styled-components";

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Button = styled.button`
  background-color: #1e1e1e;
  color: white;
  border: 1px solid #4b5563;
  padding: 0.5rem 1rem;
  border-radius: 4px;

  &.active {
    background-color: #f59e0b;
    color: black;
    border: none;
  }
`;

const ProjectCard = styled.div`
  background-color: #1e1e1e;
  padding: 1rem;
  border-radius: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProjectInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProjectTitle = styled.div`
  font-weight: 600;
`;

const ProjectDates = styled.div`
  font-size: 0.875rem;
  color: #9ca3af;
`;

const ProjectValue = styled.div`
  color: #f59e0b;
  font-weight: bold;
`;

export default function ProjectList({ projects }) {
  return (
    <Section>
      <h2 style={{ fontSize: "1.25rem", fontWeight: "600" }}>Projetos</h2>
      <FilterGroup>
        <Button className="active">Todos</Button>
        <Button>Ativos</Button>
        <Button>Clientes</Button>
        <Button>Data</Button>
      </FilterGroup>

      {projects.map((project) => (
        <ProjectCard key={project.id}>
          <ProjectInfo>
            <ProjectTitle>{project.title}</ProjectTitle>
            <ProjectDates>{project.startDate} - {project.endDate}</ProjectDates>
          </ProjectInfo>
          <ProjectValue>R$ {project.value.toLocaleString()}</ProjectValue>
        </ProjectCard>
      ))}
    </Section>
  );
}
