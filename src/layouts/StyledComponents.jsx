import styled from "styled-components";

export const colors = {
  background: "#2c2c2c", // cinza grafite
  surface: "#3a3a3a", // cinza médio
  input: "#4a4a4a", // cinza escuro
  border: "#666666",
  text: "#f9f9f9", // branco suave
  accent: "#fdb000", // amarelo destaque
  error: "#fdb000",
  gray: "#cccccc"
};

export const Container = styled.div`
  padding: 24px;
  background-color: ${colors.background};
  font-family: Arial, sans-serif;
  min-height: 100vh;
  width: 100%;
  overflow: auto;
`;

export const Title = styled.h1`
  font-size: 23px;
  font-weight: bold;
  margin-bottom: 24px;
  color: ${colors.text};
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
`;

export const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  min-width: 1000px;
`;

export const Thead = styled.thead`
  background-color: ${colors.accent};  
  color: ${colors.text};
`;

export const Th = styled.th`
  padding: 12px 8px;
  text-align: center;
  border: 1px solid ${colors.border};
`;

export const Tbody = styled.tbody``;

export const Tr = styled.tr`
  &:nth-child(even) {
    background-color: ${colors.surface};
  }
  &:nth-child(odd) {
    background-color: ${colors.background};
  }
`;

export const Td = styled.td`
  padding: 12px 8px;
  border: 1px solid ${colors.border};
  text-align: center;
  vertical-align: middle;
  color: ${colors.text};
`;

export const ActionButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin: 0 4px;
  transition: all 0.2s ease;

  &.accept {
    background-color: ${colors.accent};
    color: ${colors.background};

    &:hover {
      background-color: #e6a600;
    }
  }

  &.view {
    background-color: ${colors.surface};
    color: ${colors.text};

    &:hover {
      background-color: #505050;
    }
  }
`;

export const DispatchButton = styled.button`
  /* margin-top:30px; */
  margin-left:6px;
  /* height:60px; */
  margin-bottom: 6.8px;
  background-color: ${colors.accent};
  color: ${colors.background};
  border: none;
  padding: 22.7px 30px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e6a600;
  }
`;
