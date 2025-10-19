import styled, { keyframes } from "styled-components";
import { useEffect, useState, useMemo } from "react";
import { FileSpreadsheet, X, Loader } from "lucide-react";
import * as XLSX from "xlsx";
import EmployeeModal from "./EmployeeModal";
import contract from "../services/apiContract";
import apiEmployee from "../services/apiEmployee";


// 🔹 Estilos (mantive os seus originais)
const Container = styled.div`
background-color: #0e1a2a; 
color: #f5f5f5; 
min-height: 100vh; 
width: 100vw; 
padding: 1.5rem;
`;

const Header = styled.div`
display: flex; 
justify-content: space-between; 
align-items: center; 
margin-bottom: 1.5rem;
`;
const Title = styled.h2`
color: #f59e0b; 
font-size: 1.6rem; 
font-weight: 600;
`;

const TopIndicators = styled.div`
display: flex; 
gap: 1rem; 
margin-bottom: 
1rem; flex-wrap: wrap;
`;

const IndicatorCard = styled.div`
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

const SearchBar = styled.div`
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

const Grid = styled.div`
display: grid; 
grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
gap: 1rem;
`;

const Card = styled.div`
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

const Avatar = styled.div`
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

const Status = styled.span`
color: ${(props) => props.status === "Ativo" ? "#22c55e"
    : props.status === "Em Férias"
      ? "#facc15" : "#ef4444"}; 
font-weight: 600;
`;

const ModalOverlay = styled.div`
position: fixed; 
top: 0; 
left: 0; 
width: 100%; 
height: 100%; 
background: rgba(10, 15, 25, 0.85); 
display: flex; 
justify-content: center; 
align-items: center; 
z-index: 50;`;

const ModalContent = styled.div`
background: #1a2d45; 
border: 1px solid #00396b; 
border-radius: 12px; 
padding: 2rem; 
width: 90%; 
max-width: 420px; 
position: relative; 
color: #fff; 
box-shadow: 0 0 20px rgba(0, 57, 107, 0.5);
`;

const CloseButton = styled.button`
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

const Pagination = styled.div`
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

const spin = keyframes`
to { transform: rotate(360deg);
 }
 `;

const Spinner = styled.div`
display: flex; 
justify-content: center; 
align-items: center; 
margin: 2rem 0; 
svg { animation: ${spin} 1s linear infinite; 
color: #f59e0b; 
}
`;

// 🔹 Estilo adicional para cards internos do modal
const ModalSection = styled.div`
  background: #0f243b;
  border: 1px solid #00396b;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const ModalSectionTitle = styled.h4`
  color: #f59e0b;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
`;

const ModalField = styled.p`
  margin: 0.2rem 0;
  font-size: 0.95rem;
  strong {
    color: #f5f5f5;
  }
`;


const formatPhone = (phone) => {
  if (!phone) return "—";
  const digits = phone.replace(/\D/g, ""); // remove qualquer caractere que não seja número

  if (digits.length === 11) {
    // Celular com 9 dígitos
    return `(${digits.slice(0, 2)}) ${digits[2]} ${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  } else if (digits.length === 10) {
    // Fixo sem 9 no início
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6, 10)}`;
  }
  return phone; // Retorna como veio se não bater o padrão
};

// Atualiza a função formatPhones
const formatPhones = (phones) => {
  if (!phones) return "—";
  if (Array.isArray(phones)) return phones.map(p => formatPhone(p.phoneNumber)).join(", ");
  if (phones.phoneNumber) return formatPhone(phones.phoneNumber);
  return "—";
};


// 🌐 Componente principal


export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  // const [filter, setFilter] = useState("Todos");
  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [statusFilter, setStatusFilter] = useState("Todos");
  const [selectedProject, setSelectedProject] = useState("todos");

  const [projects, setProjects] = useState([])

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const [dataProject] = await Promise.all([
          contract.getContracts(),
        ]);

        setProjects(dataProject);

      } catch (error) {
        console.error("Erro ao buscar contratos:", error);
      }
    };
    fetchClients();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      let response;
      if (selectedProject === "todos") {
        response = await apiEmployee.getAllEmployees();
        setCurrentPage(1)
        
      } else {
        response = await apiEmployee.getEmployee(Number(selectedProject));
        setCurrentPage(1)
      }
      // setEmployees(Array.isArray(response) ? response : []);
      setEmployees(Array.isArray(response) ? response.filter(Boolean) : []);
      console.log(response,"response")

    } catch (err) {
      console.error("Erro ao buscar funcionários:", err);
    } finally {
      setLoading(false);
    }
  };



  // 👉 useEffect chama apenas a função reutilizável
  useEffect(() => {
    fetchEmployees();
    console.log(paginated, "paginated")
  }, [selectedProject]);


  // Filtragem e busca
  const filtered = useMemo(() => {
    return employees.filter((emp) => {
      const name = emp?.name?.toLowerCase() || "";
      const status = emp?.active ? "Ativo" : "Inativo";
      const matchesStatus =
        statusFilter === "Todos" || status === statusFilter;
      const matchesSearch = name.includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [employees, statusFilter, search]);



  // Paginação
  const totalPages = Math.max(Math.ceil(filtered.length / itemsPerPage), 1);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Totais
  const totalAtivos = employees.filter((e) => e.active).length;
  const totalFerias = employees.filter((e) => e.statusText === "Em Férias").length;
  const totalInativos = employees.filter((e) => !e.active).length;

  // Exportar Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filtered);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Funcionários");
    XLSX.writeFile(workbook, "Funcionarios_Projeto.xlsx");
  };

  // Avatar color generator
  const getColorFromName = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return `hsl(${hash % 360}, 60%, 45%)`;
  };

  return (
    <Container>
      <Header>
        <Title>Funcionários do Projeto</Title>
        <span>{filtered.length} encontrados</span>
      </Header>

      <TopIndicators>
        <IndicatorCard>Ativos: <span>{totalAtivos}</span></IndicatorCard>
        <IndicatorCard>Férias: <span>{totalFerias}</span></IndicatorCard>
        <IndicatorCard>Inativos: <span>{totalInativos}</span></IndicatorCard>
      </TopIndicators>

      <SearchBar>

        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          <option value="todos">Todos os funcionários</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </select>

        <input
          placeholder="Buscar funcionário..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option>Todos</option>
          <option>Ativo</option>
          <option>Em Férias</option>
          <option>Inativo</option>
        </select>
        <button onClick={exportToExcel}><FileSpreadsheet size={18} /> Exportar</button>
      </SearchBar>

      {loading ? (
        <Spinner><Loader size={40} /></Spinner>
      ) : (
        <>
          <Grid>

            {paginated.filter(Boolean).map((emp) => (
              <Card key={emp.id} onClick={() => setSelectedEmployee(emp)}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Avatar color={getColorFromName(emp.name)}>
                    {emp.name?.charAt(0)?.toUpperCase() || "?"}
                  </Avatar>
                  <strong>{emp.name || "Sem nome"}</strong>
                </div>
              <span>Projeto: {emp.project?.[0]?.project?.name || "—"}</span>
                <span>Função: {emp.occupation_name || "—"}</span>
                <span>Telefone: {formatPhones(emp.phones || emp.phone)}</span>
                <Status status={emp.active === true ? "Ativo" : "Inativo"}>
                  {emp.active === true ? "Ativo" : "Inativo"}
                </Status>
              </Card>
            ))}


          </Grid>

          <Pagination>
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Anterior</button>
            <span>Página {currentPage} de {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Próximo</button>
          </Pagination>
        </>
      )}

      <EmployeeModal
        employee={selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        onUpdate={fetchEmployees} // ✅ refaz toda a lista
      />


    </Container>
  );
}