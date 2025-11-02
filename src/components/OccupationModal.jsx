import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import contract from "../services/apiContract";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContainer = styled.div`
  background: #1e293b;
  color: #f5f5f5;
  border-radius: 12px;
  width: 600px;
  max-width: 90%;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 1rem;
  color: #38bdf8;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #94a3b8;
`;

const Input = styled.input`
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid #334155;
  background: #0f172a;
  color: #f5f5f5;
  &:disabled {
    background: #1e293b;
    color: #94a3b8;
  }
`;

const Select = styled.select`
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid #334155;
  background: #0f172a;
  color: #f5f5f5;
  &:disabled {
    background: #1e293b;
    color: #94a3b8;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

// const Button = styled.button`
//   background: ${(props) => (props.primary ? "#38bdf8" : "transparent")};
//   color: ${(props) => (props.primary ? "#0f172a" : "#38bdf8")};
//   border: 1px solid #38bdf8;
//   border-radius: 8px;
//   padding: 0.6rem 1.2rem;
//   cursor: pointer;
//   font-weight: 600;
//   transition: 0.2s ease;
//   &:hover {
//     background: ${(props) => (props.primary ? "#0ea5e9" : "#1e293b")};
//   }
// `;

 const Button = styled.button`
  background-color: ${({ $primary }) => ($primary ? "#007bff" : "#ccc")};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

export default function OccupationModal({ occupation, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    project_id: "",
    base_salary: "",
    hazard_pay: false,
  });
  const [projects, setProjects] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (occupation) {
      setFormData({
        name: occupation.name || "",
        description: occupation.description_of_occupation || "",
        project_id: occupation.project_id || "",
        base_salary: occupation.salary || "",
        hazard_pay: occupation.dangerousness|| false,
      });
    }
  }, [occupation]);

  // useEffect(() => {
  //     contract.getContracts()
  //     .then((res) => setProjects(res.data))
  //     .catch((err) => console.error("Erro ao carregar projetos:", err));
  // }, []);


  useEffect(() => {
    const fetchClients = async () => {
      try {
        const [dataProject] = await Promise.all([
          contract.getContracts(),
        ]);

        setProjects(dataProject);

      } catch (error) {
        console.error("Erro ao buscar contratos:", error);
      }
    };
    fetchClients();
  }, []);




  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      if (occupation && occupation.id) {
        await axios.put(`/api/occupations/${occupation.id}`, formData);
      } else {
        await axios.post("/api/occupations", formData);
      }
      onSave?.();
      setIsEditing(false);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar ocupação:", error);
    }
  };

  return (
    <Overlay>
      <ModalContainer>
        <Title>Detalhes da Ocupação</Title>

        <FieldGroup>
          <Label>Nome da Ocupação</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </FieldGroup>

        <FieldGroup>
          <Label>Descrição</Label>
          <Input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </FieldGroup>

        <FieldGroup>
          <Label>Projeto Vinculado</Label>
          <Select
            name="project_id"
            value={formData.project_id}
            onChange={handleChange}
            disabled={!isEditing}
          >
            <option value="">Selecione o Projeto</option>
            {projects.map((proj) => (
              <option key={proj.id} value={proj.id}>
                {proj.name}
              </option>
            ))}
          </Select>
        </FieldGroup>

        <FieldGroup>
          <Label>Salário Base</Label>
          <Input
            type="number"
            name="base_salary"
            value={formData.base_salary}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </FieldGroup>

        <FieldGroup>
          <CheckboxContainer>
            <input
              type="checkbox"
              name="hazard_pay"
              checked={formData.hazard_pay}
              onChange={handleChange}
              disabled={!isEditing}
            />
            <Label>Periculosidade</Label>
          </CheckboxContainer>
        </FieldGroup>

        <ButtonGroup>
          {!isEditing ? (
            <>
              <Button onClick={onClose}>Fechar</Button>
              <Button $primary onClick={() => setIsEditing(true)}>
                Editar
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setIsEditing(false)}>Cancelar</Button>
              <Button $primary onClick={handleSave}>
                Salvar
              </Button>
            </>
          )}
        </ButtonGroup>
      </ModalContainer>
    </Overlay>
  );
}
