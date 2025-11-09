import styled from "styled-components";
import { X } from "lucide-react";
import RegisterEmployeeWizard from "./RegisterEmployeeWizard";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(10, 15, 25, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContainer = styled.div`
  background: #1e293b;
  border-radius: 14px;
  padding: 2rem;
  width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  color: white;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: #38bdf8;
  transition: 0.3s;
  &:hover {
    color: #0ea5e9;
  }
`;

export default function RegisterEmployeeModal({ onClose, onSave }) {
  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}><X size={22} /></CloseButton>
        <RegisterEmployeeWizard onSave={onSave} onClose={onClose} />
      </ModalContainer>
    </Overlay>
    
  );
}
