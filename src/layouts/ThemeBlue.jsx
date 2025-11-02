import styled, { keyframes } from "styled-components";

  
export const Container = styled.div`
background-color: #0e1a2a; 
color: #f5f5f5; 
min-height: 100vh; 
width: 100vw; 
padding: 1.5rem;
`;

export const Header = styled.div`
display: flex; 
justify-content: space-between; 
align-items: center; 
margin-bottom: 1.5rem;
`;
export const Title = styled.h2`
color: #f59e0b; 
font-size: 1.6rem; 
font-weight: 600;
`;

export const TopIndicators = styled.div`
display: flex; 
gap: 1rem; 
margin-bottom: 
1rem; flex-wrap: wrap;
`;

export const IndicatorCard = styled.div`
background: #1a2d45; 
border: 1px solid #00396b; 
border-radius: 10px; 
padding: 0.8rem 1.2rem; 
min-width: 150px; 
text-align: center; 
font-weight: 500; 
color: #f5f5f5; 
box-shadow: 0 0 10px rgba(0, 57, 107, 0.2); 
span { 
  display: block; 
  color: #f59e0b; 
  font-size: 1.2rem; 
  font-weight: 700; }
  `;

export const SearchBar = styled.div`
display: flex; 
flex-wrap: wrap; 
gap: 1rem; 
margin-bottom: 1.5rem; 
input, select { 
  background: #1a2d45; 
  border: 1px solid #00396b; 
  color: white; 
  border-radius: 8px; 
  padding: 0.6rem 1rem; 
  outline: none; 
  min-width: 200px;
      cursor: pointer; 
        transition: 0.3s; 
    &:hover { 
      background: #004c8a; 
      } 

 } 
 input::placeholder { 
  color: #bbb; 
  } 
  button { 
    background: #00396b; 
    border: none; 
    color: white; 
    padding: 0.6rem 1.2rem; 
    border-radius: 8px; 
    cursor: pointer; 
    display: flex; 
    align-items: center; 
    gap: 0.5rem; 
    transition: 0.3s; 
    &:hover { 
      background: #004c8a; 
      } 
      }`
  ;

export const Grid = styled.div`
display: grid; 
grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
gap: 1rem;
`;

export const Card = styled.div`
background: #1a2d45; 
border: 1px solid #00396b; 
border-radius: 10px; 
padding: 1rem; 
display: flex; 
flex-direction: column; 
gap: 0.4rem; 
transition: all 0.2s ease; 
cursor: pointer; 
&:hover { 
  background: #00396b; 
  border-color: #f59e0b; 
  transform: translateY(-2px); 
  }
  `;

export const Avatar = styled.div`
background-color: ${(props) => props.color || "#f59e0b"};
 color: white; 
 width: 38px; 
 height: 38px; 
 border-radius: 50%; 
 font-weight: bold; 
 display: flex; 
 justify-content: center; 
 align-items: center;
 `;

export const Status = styled.span`
color: ${(props) => props.status === "Ativo" ? "#22c55e"
    : props.status === "Em Férias"
      ? "#facc15" : "#ef4444"}; 
font-weight: 600;
`;

export const Pagination = styled.div`
display: flex; 
justify-content: center; 
gap: 1rem; 
margin-top: 1.5rem; 
button { 
  background: #00396b; 
  border: none; 
  color: white; 
  padding: 0.5rem 1rem; 
  border-radius: 6px; 
  cursor: pointer; 
  transition: 0.2s; 
  &:disabled { 
    opacity: 0.5; 
    cursor: not-allowed; 
    } 
    &:hover:not(:disabled) { 
      background: #004c8a; 
      } 
      }
      `;

export const spin = keyframes`
to { transform: rotate(360deg);
 }
 `;

export const Spinner = styled.div`
display: flex; 
justify-content: center; 
align-items: center; 
margin: 2rem 0; 
svg { animation: ${spin} 1s linear infinite; 
color: #f59e0b; 
}
`;


// ====== ESTILOS MODAL ======


export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(10, 15, 25, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
`;

export const ModalContent = styled.div`
  background: #1a2d45;
  border: 1px solid #00396b;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  position: relative;
  color: #fff;
  box-shadow: 0 0 20px rgba(0, 57, 107, 0.5);
  max-height: 90vh;
  overflow-y: auto;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  color: #f5f5f5;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    color: #f59e0b;
  }
`;

export const EditButton = styled.button`
  position: absolute;
  top: 12px;
  right: 50px;
  background: none;
  border: none;
  color: #f5f5f5;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    color: #22c55e;
  }
`;

export const Section = styled.div`
  background: #0f243b;
  border: 1px solid #00396b;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

export const SectionTitle = styled.h4`
  color: #f59e0b;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
`;

export const Field = styled.div`
  margin-bottom: 0.5rem;

  span {
    font-size: 0.95rem;
    color: #e0e0e0;
    display: block;
    margin-bottom: 2px;
  }

  input, select {
    padding: 0.4rem 0.6rem;
    border-radius: 6px;
    border: 1px solid #00396b;
    background: #1a2d45;
    color: white;
    width: 100%;
    cursor: pointer;
      transition: 0.3s; 
    &:hover { 
      background: #004c8a; 
      } 
  }
  label{
    font-size:14px
    /* display:flex; */
    /* font-size:1rem; */
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
`;

export const Button = styled(({ primary, ...props }) => <button {...props} />)`
 border-radius: 8px; 
    padding: 0.6rem 1.2rem; 
   align-items: center; 
    gap: 0.5rem; 
  border: ${(props) => (props.primary ? "1px solid #00396b" : "1px solid #00396b")};
  background: ${(props) => (props.primary ? "#00396b" : "#00396b")};
  color: ${(props) => (props.primary ? "white" : "#f5f5f5")};
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: ${(props) => (props.primary ? " #004c8a" : " #004c8a")};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;



// 🔹 Subseções internas (CNH, etc.)
export const ModalSection = styled.div`
  background: #112d4e;
  border: 1px solid #00396b;
  border-radius: 8px;
  padding: 0.8rem;
  margin-top: 0.8rem;
`;

export const ModalSectionTitle = styled.h5`
  color: #60a5fa;
  font-size: 1rem;
  margin-bottom: 0.4rem;
  border-bottom: 1px solid #00396b;
  padding-bottom: 0.3rem;
`;

export const ModalField = styled.div`
  margin-bottom: 0.5rem;

  strong {
    color: #f59e0b;
    margin-right: 0.4rem;
  }
 input, select {
    padding: 0.4rem 0.6rem;
    border-radius: 6px;
    border: 1px solid #00396b;
    background: #1a2d45;
    color: white;
    width: 100%;
    cursor: pointer;
      transition: 0.3s; 
    &:hover { 
      background: #004c8a; 
      } 
  }
`;

