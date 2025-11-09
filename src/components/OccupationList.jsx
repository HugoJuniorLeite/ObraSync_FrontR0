import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Eye, Trash2, PlusCircle } from "lucide-react";
import OccupationModal from "./OccupationModal";
import apiOccupation from "../services/apiOccupation";


const Container = styled.div`
  background: #0f172a;
  color: #f5f5f5;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  min-height:100%;
  width:100%;
  
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  /* width:80%; */
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: #38bdf8;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #38bdf8;
  color: #0f172a;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background: #0ea5e9;
  }
`;

const Table = styled.table`
width:100%;
  border-collapse: collapse;
  background: #1e293b;
  border-radius: 8px;
  overflow: hidden;
`;

const Thead = styled.thead`
  background: #334155;
  color: #f5f5f5;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.8rem;
  font-weight: 600;
`;

const Td = styled.td`
  padding: 0.8rem;
  border-bottom: 1px solid #334155;
`;

const Tr = styled.tr`
  &:hover {
    background: #0f172a;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 0.6rem;
`;

const ActionButton = styled.button`
  background: transparent;
  border: none;
  color: #38bdf8;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    color: #0ea5e9;
  }
`;

export const Button = styled.button`
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

export default function OccupationList() {
  const [occupations, setOccupations] = useState([]);
  const [selectedOccupation, setSelectedOccupation] = useState(null);
  const [showModal, setShowModal] = useState(false);

const fetchOccupations = async () => {
  try {
    const response = await apiOccupation.getOccupation();

    console.log("📦 Retorno da API:", response);

    let data = [];

    if (Array.isArray(response)) {
      // Caso o backend retorne direto um array
      data = response;
    } else if (Array.isArray(response.data)) {
      // Caso venha como { data: [...] }
      data = response.data;
    } else if (response.data && Array.isArray(response.data.occupations)) {
      // Caso venha como { data: { occupations: [...] } }
      data = response.data.occupations;
    } else if (Array.isArray(response.occupations)) {
      // Caso venha como { occupations: [...] }
      data = response.occupations;
    }

    setOccupations(data);
  } catch (error) {
    console.error("Erro ao buscar ocupações:", error);
    setOccupations([]);
  }
};



  useEffect(() => {
    fetchOccupations();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta ocupação?")) return;
    try {
      await apiOccupation.deleteOccupationById(id);
      fetchOccupations();
    } catch (error) {
      console.error("Erro ao excluir ocupação:", error);
    }
  };

  const handleOpenModal = (occupation = null) => {
    setSelectedOccupation(occupation);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOccupation(null);
  };

  return (
    <Container>
      <Header>
        <Title>Lista de Ocupações</Title>
        <AddButton onClick={() => handleOpenModal()}>
          <PlusCircle size={18} />
          Nova Ocupação
        </AddButton>
      </Header>

      <Table>
        <Thead>
          <tr>
            <Th>Nome</Th>
            <Th>Descrição</Th>
            <Th>Projeto</Th>
            <Th>Salário Base</Th>
            <Th>Periculosidade</Th>
            <Th>Ações</Th>
          </tr>
        </Thead>
        <tbody>
          {occupations.length > 0 ? (
            occupations.map((occ) => (
              <Tr key={occ.id}>
                <Td>{occ.name}</Td>
                <Td>{occ.description_of_occupation}</Td>
                <Td>{occ.project?.name || "-"}</Td>
                <Td>
                  {occ.salary
                    ? `R$ ${Number(occ.salary).toFixed(2)}`
                    : ","}
                </Td>
                <Td>{occ.dangerousness ? "Sim" : "Não"}</Td>
                <Td>
                  <Actions>
                    <ActionButton onClick={() => handleOpenModal(occ)}>
                      <Eye size={18} />
                    </ActionButton>
                    <ActionButton onClick={() => handleDelete(occ.id)}>
                      <Trash2 size={18} />
                    </ActionButton>
                  </Actions>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan="6" style={{ textAlign: "center", padding: "1rem" }}>
                Nenhuma ocupação cadastrada.
              </Td>
            </Tr>
          )}
        </tbody>
      </Table>

      {showModal && (
        <OccupationModal
          occupation={selectedOccupation}
          onClose={handleCloseModal}
          onSave={fetchOccupations}
        />
      )}
    </Container>
  );
}
