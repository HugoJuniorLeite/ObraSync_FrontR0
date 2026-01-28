import styled from "styled-components";

export const TableWrapper = styled.div`
  overflow-x: auto;
  margin-top: 12px;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
`;

export const Thead = styled.thead`
  background: #1f1f1f;
  position: sticky;
  top: 0;
  z-index: 2;
`;

export const Th = styled.th`
  padding: 10px 8px;
  text-align: left;
  border-bottom: 1px solid #333;
  white-space: nowrap;
`;

export const Tr = styled.tr`
  background: ${({ index }) => (index % 2 ? "#2a2a2a" : "#242424")};

  &:hover {
    background: #303030;
  }
`;

export const Td = styled.td`
  padding: 8px;
  vertical-align: middle;
`;

export const Technician = styled.div`
  font-weight: 600;
`;

export const Address = styled.div`
  max-width: 220px;
  white-space: normal;
`;

export const Center = styled.div`
  text-align: center;
`;
