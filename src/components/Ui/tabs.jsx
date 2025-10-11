import styled from "styled-components";

export const Container = styled.div`
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 1rem;
  width: 100%;
  margin: 2rem auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

export const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

export const TabsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  background: #f3f4f6;
  padding: 0.25rem;
  border-radius: 8px;
  gap: 0.5rem;
`;

export const TabButton = styled.button`
  all: unset;
  text-align: center;
  padding: 0.5rem;
  border-radius: 6px;
  background-color: ${({ isActive }) => (isActive ? "#ffffff" : "transparent")};
  color: ${({ isActive }) => (isActive ? "#7c3aed" : "#6b7280")};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #7c3aed;
  }
`;

export const ContentBox = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background: gray;
  border-radius: 0.5rem;
  font-size: 1rem;
  color: #374151;
`;
