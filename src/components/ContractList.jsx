import { ContractCard, ContractDates, ContractPrice, ContractTitle, P } from "../layouts/Theme";

export default function ContractList({ contracts }) {

  if (contracts.length === 0)
    return <P>Nenhum contrato encontrado.</P>;

  return (
    <div>
      {contracts.map((contract, index) => (
        <ContractCard key={index}>
          <ContractTitle>{contract.name}</ContractTitle>
          <ContractDates>
            {formatDate(contract.start_date)} – {formatDate(contract.estimated_end_date
            )}
          </ContractDates>
          <ContractPrice>R$ {contract.estimated_price}</ContractPrice>
        </ContractCard>
      ))}
    </div>
  );
}

function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString("pt-BR");
}
