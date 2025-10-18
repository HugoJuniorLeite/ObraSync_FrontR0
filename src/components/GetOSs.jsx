import { useEffect, useState } from "react";
import serviceOs from "../services/apiOs";
import {
  Container,
  Title,
  TableWrapper,
  Table,
  Thead,
  Th,
  Tbody,
  Tr,
  Td,
  ActionButton,
  DispatchButton
} from "../layouts/StyledComponents";
import { CheckboxContainer, customSelectStyles, FormTitle, HiddenCheckbox, RowDespech, StyledCheckbox, StyledLabel } from "../layouts/Theme";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BillSchema } from "../schemas/BillSchema";
import contract from "../services/apiContract";
// import employee from "../services/apiEmployee";
import { Input } from "./Ui/Input";
import MyService from "./MyService";
import RdoPdf from "./RdoForms/RdoPdf";
import apiEmployee from "../services/apiEmployee";




export default function GetOss() {
  const [bills, setBills] = useState([]);
  const [selectedBills, setSelectedBills] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [projects, setProjects] = useState([]);
  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(BillSchema),
    defaultValues: {
      sameAddress: false,
      selectedOptionTechnician: "",
      selectedOptionProject: "",
      programDate: ""
    },
  });
  const selectedOptionTechnician = watch("selectedOptionTechnician");
  const selectedOptionProject = watch("selectedOptionProject");
  const programDate = watch("programDate")


  useEffect(() => {

    async function fetchProjects() {
      try {
        const res = await contract.getContracts()
        setProjects(res);
        setValue("selectedOptionProject", "");
        console.log(res, "res")
      } catch (err) {
        console.error("Erro ao buscar serviços:", err.message);
        console.log("aqui")
        setProjects([]);
      }
    }
    fetchProjects();
  }, []);


  useEffect(() => {

    
    const fetchBills = async () => {
      try {
        if (selectedOptionTechnician=="" || selectedOptionProject=="") return
        const response = await serviceOs.getServiceByTechnical(selectedOptionTechnician?.value);
        setBills(response);
        console.log(response, "fetchBills")
      } catch (error) {
        console.error("Erro ao buscar contratos:", error);
      }
    };
    fetchBills();
  }, [selectedOptionTechnician]);




  useEffect(() => {
    async function fetchTechnical() {
      if (selectedOptionProject =="") return

      try {
        const res = await apiEmployee.getEmployee(selectedOptionProject.value)
        setTechnicians(res);
        setValue("selectedOptionTechnician", []);
        console.log(res, "técnico")
      } catch (err) {
        console.error("Erro ao buscar serviços:", err);
        setTechnicians([]);
      }
    }
    fetchTechnical();
  }, [selectedOptionProject]);


  const toggleSelect = (id) => {
    if (selectedBills.includes(id)) {
      setSelectedBills(selectedBills.filter((billId) => billId !== id));
    } else {
      setSelectedBills([...selectedBills, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedBills.length === bills.length) {
      setSelectedBills([]);
    } else {
      setSelectedBills(bills.map((bill) => bill.id));
    }
  };

  const handleDispatch = async () => {
    if (selectedOptionTechnician =="" || programDate =="") return;

    const data = {
      technical_id: selectedOptionTechnician.value,
      scheduled_at: new Date(programDate),
    };

    try {
      for (let billId of selectedBills) {
        await serviceOs.dispachService(billId, data);
        // Atualiza localmente o estado da nota
        setBills((prevBills) =>
          prevBills.map((bill) =>
            bill.id === billId
              ? { ...bill, status: "despachada", technical: selectedOptionTechnician.label, scheduled_at: data.scheduled_at }
              : bill
          )
        );
      }
      // Limpa as notas selecionadas
      setSelectedBills([]);
    } catch (err) {
      console.error("Erro ao despachar OS:", err);
    }
  };


  return (
    <Container>
      <FormTitle>Ordens de Serviço</FormTitle>

      {/* {selectedBills.length > 0 && (
        <DispatchButton onClick={handleDispatch}>
          Despachar ({selectedBills.length})
        </DispatchButton>
      )} */}
  

      <RowDespech>



        <StyledLabel >Projeto</StyledLabel>
        <Controller
          name="selectedOptionProject"
          control={control}
          render={({ field: { onChange, ...rest } }) => (
            <Select
              {...rest}
              onChange={(selected) => {
                console.log("projeto selecionado:", selected); // 🔍 debug
                onChange(selected);
              }}
              options={projects?.map((srv) => ({ value: srv.id, label: srv.name }))}
              placeholder="Selecione o técnico..."
              // isDisabled={!selectedOptionProject}
              styles={customSelectStyles}
            />
          )}
        />

        <StyledLabel >Ténico</StyledLabel>
        <Controller
        
          name="selectedOptionTechnician"
          control={control}
          render={({ field: { onChange, ...rest } }) => (
            <Select
              {...rest}
              onChange={(selected) => {
                console.log("tecnico selecionado:", selected); // 🔍 debug
                onChange(selected);
              }}
              options={technicians?.map((srv) => ({ value: srv.employee.id, label: srv.employee.name }))}
              placeholder="Selecione o técnico..."
              isDisabled={!selectedOptionProject}
              styles={customSelectStyles}
            />
          )}
        />




      </RowDespech>

        <RowDespech>

          <Input
        type="date"
        label="Data da programação"
        name="programDate"
        register={register}
        error={errors.birthDate}
          style={{ width: "150px" }}
      />

        <DispatchButton onClick={handleDispatch}
          // isDisabled={!selectedOptionProject && !selectedOptionTechnician && !programDate}
          >
          Despachar ({selectedBills.length})
        </DispatchButton>
      </RowDespech>

      <TableWrapper>
        <Table>
          <Thead>
            <Tr>
              <Th>
                <CheckboxContainer>
                  <HiddenCheckbox
                    type="checkbox"
                    checked={selectedBills.length === bills.length && bills.length > 0}
                    onChange={toggleSelectAll}
                  />
                  <StyledCheckbox />
                </CheckboxContainer>
              </Th>
              <Th>Nota</Th>
              <Th>Status</Th>
              <Th>Projeto</Th>
              <Th>Serviço</Th>
              <Th>Endereço</Th>
              <Th>Técnico</Th>
              <Th>Programado</Th>
              <Th>Início</Th>
              <Th>Término</Th>
              <Th>Criada em</Th>
              {/* <Th>Ações</Th> */}
            </Tr>
          </Thead>
          <Tbody>
            {bills.map((bill) => (
              <Tr key={bill.id}>
                <Td>
                  <CheckboxContainer>
                    <HiddenCheckbox
                      checked={selectedBills.includes(bill.id)}
                      onChange={() => toggleSelect(bill.id)}
                    />
                    <StyledCheckbox />
                  </CheckboxContainer>
                </Td>
                <Td>{bill.id}</Td>
                <Td>{bill.status}</Td>
                <Td>{bill.project?.name}</Td>
                <Td>{bill.service?.name}</Td>
                <Td>
                  {bill.customer_address?.street}, {bill.customer_address?.number} -{" "}
                  {bill.customer_address?.neighborhood}, {bill.customer_address?.city}/
                  {bill.customer_address?.state}
                </Td>
                <Td>{bill.technical}</Td>
                <Td>{bill.scheduled_at?.toLocaleString("pt-BR")}</Td>
                <Td>{bill.service_started_at?.toLocaleString("pt-BR")}</Td>
                <Td>{bill.service_completed_at?.toLocaleString("pt-BR")}</Td>
                <Td>{new Date(bill.created_at).toLocaleString("pt-BR")}</Td>
                {/* <Td>
                  <ActionButton className="view">Ver</ActionButton>
                  <ActionButton className="accept">Aceitar</ActionButton>
                </Td> */}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableWrapper>

   {/* <RdoPdf/>  */}

    </Container>
  );
}
