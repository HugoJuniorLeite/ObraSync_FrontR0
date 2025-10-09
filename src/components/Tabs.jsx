import { useEffect, useState } from "react";
import { Container, ContentBox, TabButton, TabsWrapper, Title } from "./Ui/tabs";
import ContractList from "./ContractList";
import contract from "../services/apiContract";
// import getContracts from "../services/apiContract";
// import {getContracts} from "../services/apiContract"
// import  getContracts  from "../services/apiContract";

const tabs = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Ativos" },
  { value: "startDate", label: "Data Início" },
  { value: "value", label: "Valor" },
];

export default function Tabs({ onChange }) {
  //   const [active, setActive] = useState("all");
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const data = await contract.getContracts();
        setContracts(data);

      } catch (error) {
        console.error("Erro ao buscar contratos:", error);
      }
    };
    fetchContracts();
  }, []);


  //   const handleClick = (value) => {
  //     setActive(value);
  //     onChange?.(value);
  //   };

  return (
    <Container>
      {/* <Title>Filtros</Title>
      <TabsWrapper>
        {tabs.map((tab) => (
          <TabButton
            key={tab.value}
            isActive={active === tab.value}
            onClick={() => handleClick(tab.value)}
          >
            {tab.label}
          </TabButton>
        ))}
      </TabsWrapper> */}

      <ContentBox>
        {/* <p>Conteúdo da aba: <strong>{active}</strong></p> */}
        <ContractList contracts={contracts} ></ContractList>

      </ContentBox>
    </Container>
  );
}
