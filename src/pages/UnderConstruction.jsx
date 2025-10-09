import styled, { keyframes } from "styled-components";
import { FaTools } from "react-icons/fa";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  align-self:center;
  height: 80vh;
  text-align: center;
  color: #333;
  animation: ${fadeIn} 0.5s ease-out;
  padding-left:150px;
`;

const IconWrapper = styled.div`
  font-size: 5rem;
  color: #f59e0b;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: #555;
`;

export default function UnderConstruction({ featureName = "Esta funcionalidade" }) {
    return (
        <Container>
            <IconWrapper>
                <FaTools />
            </IconWrapper>
            <Title>Em Construção</Title>
            <Description>{featureName} ainda está em desenvolvimento. Volte em breve!</Description>
        </Container>
    );
}
