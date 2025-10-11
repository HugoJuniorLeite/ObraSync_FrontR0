import { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import styled from "styled-components";

// ====== STYLED COMPONENTS ======
const ModalContainer = styled.div`
  padding: 2rem;
  background: #ffffff;
  border-radius: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 550px;
  margin: 2rem auto;
  animation: fadeIn 0.2s ease-in-out;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
`;

const CloseButton = styled.button`
  all: unset;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.2s ease;
  &:hover {
    color: #111827;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 0.25rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  color: #111827;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #2563eb;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease, opacity 0.2s ease;
  
  ${({ variant }) =>
    variant === "cancel"
      ? `
    border: 1px solid #9ca3af;
    color: #374151;
    background: transparent;
    &:hover {
      background: #f3f4f6;
    }
  `
      : `
    background: #2563eb;
    color: #fff;
    border: none;
    &:hover {
      background: #1d4ed8;
    }
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `}
`;

const Message = styled.p`
  text-align: center;
  font-size: 0.875rem;
  color: #4b5563;
  margin-top: 1rem;
`;

// ====== COMPONENTE ======
export default function EmployeeModal({ employee, onUpdate, onClose }) {
  const [formData, setFormData] = useState(employee);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await axios.put(
        `http://localhost:3000/employees/${formData.id}`,
        formData
      );
      onUpdate(response.data);
      setMessage("✅ Atualizado com sucesso!");
      setTimeout(() => {
        setLoading(false);
        onClose();
      }, 800);
    } catch (error) {
      console.error(error);
      setMessage("❌ Erro ao atualizar.");
      setLoading(false);
    }
  };

  return (
    <ModalContainer>
      <Header>
        <Title>Editar Funcionário</Title>
        <CloseButton onClick={onClose}>
          <X size={22} />
        </CloseButton>
      </Header>

      <FormGrid>
        <div>
          <Label>Nome</Label>
          <Input
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label>CPF</Label>
          <Input
            name="cpf"
            value={formData.cpf || ""}
            onChange={handleChange}
          />
        </div>
      </FormGrid>

      <Actions>
        <Button variant="cancel" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </Button>
      </Actions>

      {message && <Message>{message}</Message>}
    </ModalContainer>
  );
}
