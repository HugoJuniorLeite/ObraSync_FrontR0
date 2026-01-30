import StatusBadge from "./StatusBadge";
import {
  TableWrapper,
  StyledTable,
  Thead,
  Th,
  Tr,
  Td,
  Technician,
  Address,
  Center,
} from "../layouts/AttendanceTableStyles";

export default function AdminAttendanceTable({ data }) {


  function formatOnlyDate (value) {

    console.log(value,"DATA")
  if (!value) return "-";

  return new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};


  const formatTime = (value) => {
    if (!value) return "-";
    return new Date(value).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <TableWrapper>
      <StyledTable>
        <Thead>
          <Tr>
            <Th>Data</Th>
            <Th>Técnico</Th>
            <Th>OS</Th>
            <Th>Nota</Th>
            <Th>Cliente</Th>
            <Th>Projeto</Th>
            <Th>Endereço</Th>
            <Th>Início</Th>
            <Th>Fim</Th>
            <Th>Jornada</Th>
            <Th>Dist.</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>

        <tbody>
          {data.map((item, index) => (
            <Tr key={index} index={index}>
              {/* <Td>{formatOnlyDate(item.start)}</Td> */}

              <Td>
                <Technician>{item.technician}</Technician>
              </Td>

              <Td>{item.os || "-"}</Td>

              <Td>{item.note || "-"}</Td>

              <Td>{item.client || "-"}</Td>

              <Td>{item.project || "-"}</Td>

              <Td>
                <Address>{item.address}</Address>
              </Td>

              <Td>{formatTime(item.start)}</Td>

              <Td>{formatTime(item.end)}</Td>

              <Td>{item.journey}</Td>

              <Td>
                <Center>{item.distance}</Center>
              </Td>

              <Td>
                <StatusBadge status={item.status} />
              </Td>
            </Tr>
          ))}
        </tbody>
      </StyledTable>
    </TableWrapper>
  );
}
