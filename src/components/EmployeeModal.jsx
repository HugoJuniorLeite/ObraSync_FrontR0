import { useState } from "react";
import styled from "styled-components";
import { X, Edit } from "lucide-react";
import { useEffect } from "react";
import apiEmployee from "../services/apiEmployee";
import contract from "../services/apiContract";
import occupation from "../services/apiOccupation";
import { minLength } from "zod";


// ====== ESTILOS ======
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
  z-index: 50;
`;

const ModalContent = styled.div`
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

const EditButton = styled.button`
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

const Section = styled.div`
  background: #0f243b;
  border: 1px solid #00396b;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h4`
  color: #f59e0b;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
`;

const Field = styled.div`
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

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
`;


const Button = styled(({ primary, ...props }) => <button {...props} />)`
  border: ${(props) => (props.primary ? "none" : "1px solid #00396b")};
  background: ${(props) => (props.primary ? "#3b82f6" : "transparent")};
  color: ${(props) => (props.primary ? "white" : "#f5f5f5")};
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: ${(props) => (props.primary ? "#2563eb" : "#00396b")};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;



// 🔹 Subseções internas (CNH, etc.)
const ModalSection = styled.div`
  background: #112d4e;
  border: 1px solid #00396b;
  border-radius: 8px;
  padding: 0.8rem;
  margin-top: 0.8rem;
`;

const ModalSectionTitle = styled.h5`
  color: #60a5fa;
  font-size: 1rem;
  margin-bottom: 0.4rem;
  border-bottom: 1px solid #00396b;
  padding-bottom: 0.3rem;
`;

const ModalField = styled.div`
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

// ====== FUNÇÕES DE FORMATAÇÃO ======
const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

const formatCPF = (cpf) => cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") ?? "—";
const formatRG = (rg) => rg?.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, "$1.$2.$3-$4") ?? "—";
const formatCEP = (cep) => cep?.replace(/(\d{5})(\d{3})/, "$1-$2") ?? "—";
const formatBool = (value) => value === true ? "Sim" : "Não";
const formatPhone = (phone) => {
  if (!phone) return "—";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11) return `(${digits.slice(0, 2)}) ${digits[2]} ${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  if (digits.length === 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6, 10)}`;
  return phone;
};

const formatPhones = (phones) => {
  if (!phones) return "";
  if (Array.isArray(phones)) return phones.map(p => formatPhone(p.phoneNumber)).join(", ");
  if (phones.phoneNumber) return formatPhone(phones.phoneNumber);
  return "";
};

// ====== COMPONENTE ======
export default function EmployeeModal({ employee, onUpdate, onClose }) {
  const [editMode, setEditMode] = useState(false);
  // const [formData, setFormData] = useState({});
  const [formData, setFormData] = useState(employee || {});

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [selectedOptionProject, setSelectedOptionProject] = useState("");
  const [selectedOptionOccupation, setSelectedOptionOccupation] = useState("");

  const [projects, setProjects] = useState([]);
  const [occupations, setOccupations] = useState([]);
  const [availableOccupations, setAvailableOccupations] = useState([]); // ocupações filtradas

  useEffect(() => {
    if (employee) {
      setFormData(employee);
      setEditMode(false);

      const projectId = employee.project?.[0]?.project?.id;
      const occupationId = employee.occupation_id;

      if (projectId) {
        setSelectedOptionProject(projectId);
      }

      if (occupationId) {
        setSelectedOptionOccupation(occupationId);
      }
    }
  }, [employee]);


  useEffect(() => {
    if (formData.project_id && occupations.length > 0) {
      const filtered = occupations.filter(
        (occ) => occ.project_id === Number(formData.project_id)
      );
      setAvailableOccupations(filtered);
    }
  }, [formData.project_id, occupations]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dataProject, dataOccupation] = await Promise.all([
          contract.getContracts(),
          occupation.getOccupation()
        ]);
        setProjects(dataProject);
        setOccupations(dataOccupation);
        console.log(dataProject, "dataProject")
        console.log(dataOccupation, "dataOccupation")
        console.log(employee, "employee")
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
    fetchData();
  }, []);


  async function buscarCep(cep) {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setFormData((prev) => ({
          ...prev,
          street_name: data.logradouro || prev.street_name,
          neighborhood: data.bairro || prev.neighborhood,
          city: data.localidade || prev.city,
          state: data.uf || prev.state,
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error.message);
    }
  }



  const handleCepChange = (e) => {
    const cep = e.target.value.replace(/\D/g, ""); // remove não numéricos

    setFormData((prev) => ({
      ...prev,
      zip_code: cep,
    }));

    if (cep.length === 8) {
      buscarCep(cep);
    }
  };




  const handleProjectChange = (projectId) => {
    setSelectedOptionProject(projectId);

    setFormData((prev) => ({
      ...prev,
      project_id: projectId,
      occupation_id: "",
      occupation_name: "",
      description_occupation: "",
      salary: "",
      dangerousness: false
    }));
  };

  if (!employee || Object.keys(employee).length === 0) {
    return null; // não renderiza nada até ter dados
  }

  const handleSave = async () => {
    try {
      const payload = {
        name: formData.name,
        cpf: formData.cpf,
        rg: formData.rg,
        drivers_license: formData.drivers_license,
        occupation_id: formData?.occupation_id || employee.occupation_id,
        date_of_birth: formData.date_of_birth,
        admission_date: formData.admission_date,
        active: formData.active,

        salary: formData.salary || 0,
        hazard_pay: formData.hazard_pay || false,
        occupation_description: formData.occupation_description || "",

        phones: {
          create: {
            phoneNumber: formData.phones?.[0]?.phoneNumber || "",
          },
        },
        address: {
          create: {
            zip_code: formData.zip_code || "",
            street_name: formData.street_name || "",
            number_of_house: formData.number_of_house || "",
            neighborhood: formData.neighborhood || "",
            city: formData.city || "",
            state: formData.state || "",
            country: formData.country || "",
          },
        },

        cnh: formData.cnh?.length > 0
          ? {
            create: formData.cnh.map(c => ({
              category_cnh: c.category_cnh || "",
              number_license: c.number_license || "",
              validity: c.validity || "",
              first_drivers_license: c.first_drivers_license || "",
            }))
          }
          : undefined,

        project_team: formData.project_id
          ? {
            create: {
              project_id: formData.project_id,
              active: formData.active ?? true,
            },
          }
          : undefined,
      };

      console.log(payload, "payload")

      setLoading(true);


      if (employee.active != formData.active) {
        const inative = await apiEmployee.putInativeEmployee(formData.id)
      }


      const updatedEmployee = await apiEmployee.putAlterEmployee(formData.id, payload);

      if (onUpdate) onUpdate(updatedEmployee);
      setEditMode(false);
      onClose();
    } catch (error) {
      console.error("❌ Erro ao atualizar funcionário:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "phones") {
      const phonesArray = value
        .split(",")
        .map((p) => ({ phoneNumber: p.trim() }))
        .filter((p) => p.phoneNumber);
      setFormData((prev) => ({ ...prev, phones: phonesArray }));
    }
    else if (name === "drivers_license") {
      // 🔹 Se desmarcar CNH, limpa os dados da CNH
      if (!checked) {
        setFormData((prev) => ({
          ...prev,
          drivers_license: false,
          cnh: [], // limpa todas as habilitações
        }));
      } else {
        // Marca que possui CNH, se ainda não houver, cria uma entrada padrão
        setFormData((prev) => ({
          ...prev,
          drivers_license: true,
          cnh: prev.cnh?.length ? prev.cnh : [
            {
              number_license: "",
              category_cnh: "",
              first_drivers_license: "",
              validity: "",
            },
          ],
        }));
      }
    }
    else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleCnhChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedCnh = [...(prev.cnh || [])];
      updatedCnh[index] = { ...updatedCnh[index], [field]: value };
      return { ...prev, cnh: updatedCnh };
    });
  };


  const handleOccupationChange = (occupationId) => {
    const selected = occupations.find((occ) => occ.id === Number(occupationId));
    if (!selected) return;

    console.log(selected, "selected")
    setSelectedOptionOccupation(selected.id);

    setFormData((prev) => ({
      ...prev,
      occupation_id: selected.id,
      occupation_name: selected.name,
      occupation_description: selected.description_of_occupation || "",
      salary: selected.salary || "",
      total_salary: selected.total_salary || "",
      dangerousness: selected.dangerousness || false,
    }));
  };



  if (!employee || !employee.name) {
    return (
      <ModalOverlay onClick={onClose}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <CloseButton onClick={onClose}><X size={22} /></CloseButton>
          <p>Carregando dados do funcionário...</p>
        </ModalContent>
      </ModalOverlay>
    );
  }


  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}><X size={22} /></CloseButton>
        {!editMode && <EditButton
          onClick={() => {
            setFormData(employee || {}); // reseta dados
            setEditMode(true);
          }}
        >
          <Edit size={22} />
        </EditButton>}


        <h2 style={{ color: "#f59e0b", marginBottom: "1rem" }}>
          {employee?.name || "Funcionário não encontrado"}
        </h2>

        {/* Dados Pessoais */}
        <Section>
          <SectionTitle>Dados Pessoais</SectionTitle>
          <Field>{editMode ? <label>Data de Aniversário: <input type="date" name="date_of_birth" value={formData.date_of_birth?.slice(0, 10) || ""} onChange={handleChange} /> </label> : <span>Data de Aniversário: {formatDate(employee.date_of_birth)}</span>}</Field>
          <Field>{editMode ? <label>RG: <input minLength={9} maxLength={13} name="rg" value={formatRG(formData.rg) || ""} onChange={handleChange} /> </label> : <span>RG: {formatRG(employee.rg)}</span>}</Field>
          <Field>{editMode ? <label>CPF: <input name="cpf" value={formatCPF(formData.cpf) || ""} minLength={9} maxLength={14} onChange={handleChange} /> </label> : <span>CPF: {formatCPF(employee.cpf)}</span>}</Field>
     <Field>
  {editMode ? (
    <label>
      CNH:
      <select
        name="drivers_license"
        value={formData.drivers_license ? "true" : "false"}
        onChange={(e) => {
          const hasLicense = e.target.value === "true";
          setFormData((prev) => ({
            ...prev,
            drivers_license: hasLicense,
            cnh: hasLicense
              ? prev.cnh?.length
                ? prev.cnh
                : [
                    {
                      number_license: "",
                      category_cnh: "",
                      first_drivers_license: "",
                      validity: "",
                    },
                  ]
              : [], // 🔹 limpa os dados da CNH se "Não"
          }));
        }}
      >
        <option value="true">Sim</option>
        <option value="false">Não</option>
      </select>
    </label>
  ) : (
    <span>CNH: {formatBool(employee.drivers_license)}</span>
  )}
</Field>

{/* 🔹 Só renderiza os campos se o usuário tiver CNH */}
{formData.drivers_license && (
  <>
    {!editMode ? (
      // 🔹 Modo visualização
      <>
        {employee.cnh?.length > 0 ? (
          employee.cnh.map((cnh, index) => (
            <ModalSection key={index}>
              <ModalSectionTitle>CNH {cnh.category_cnh}</ModalSectionTitle>
              <ModalField><strong>Número:</strong> {cnh.number_license}</ModalField>
              <ModalField><strong>Categoria:</strong> {cnh.category_cnh}</ModalField>
              <ModalField><strong>Primeira Habilitação:</strong> {formatDate(cnh.first_drivers_license)}</ModalField>
              <ModalField><strong>Validade:</strong> {formatDate(cnh.validity)}</ModalField>
            </ModalSection>
          ))
        ) : (
          <ModalField>Sem CNH cadastrada</ModalField>
        )}
      </>
    ) : (
      // ✏️ Modo edição
      <>
        {formData.cnh?.length > 0 ? (
          formData.cnh.map((cnh, index) => (
            <ModalSection key={index}>
              <ModalSectionTitle>CNH {cnh.category_cnh}</ModalSectionTitle>

              <ModalField>
                <strong>Número:</strong>
                <input
                  type="text"
                  value={cnh.number_license}
                  onChange={(e) => handleCnhChange(index, "number_license", e.target.value)}
                />
              </ModalField>

              <ModalField>
                <strong>Categoria:</strong>
                <select
                  value={cnh.category_cnh}
                  onChange={(e) => handleCnhChange(index, "category_cnh", e.target.value)}
                >
                  <option value="">Selecione</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="AB">AB</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                </select>
              </ModalField>

              <ModalField>
                <strong>Primeira Habilitação:</strong>
                <input
                  type="date"
                  value={cnh.first_drivers_license?.split("T")[0] || ""}
                  onChange={(e) => handleCnhChange(index, "first_drivers_license", e.target.value)}
                />
              </ModalField>

              <ModalField>
                <strong>Validade:</strong>
                <input
                  type="date"
                  value={cnh.validity?.split("T")[0] || ""}
                  onChange={(e) => handleCnhChange(index, "validity", e.target.value)}
                />
              </ModalField>
            </ModalSection>
          ))
        ) : (
          <ModalField>Sem CNH cadastrada</ModalField>
        )}
      </>
    )}
  </>
)}


        </Section>

        {/* Dados Corporativos */}
        <Section>
          <SectionTitle>Dados Corporativos</SectionTitle>
          <Field>{editMode ? <label>Data de Admissão: <input type="date" name="admission_date" value={formData.admission_date?.slice(0, 10) || ""} onChange={handleChange} /> </label> : <span>Data de Admissão: {formatDate(employee.admission_date)}</span>}</Field>
          <Field>  {editMode ? (
            <label>
              Ativo:
              <select
                name="active"
                value={formData.active ? "true" : "false"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    active: e.target.value === "true",
                  })
                }
              >
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            </label>
          ) : (<span>Ativo: {formatBool(employee.active)}</span>)}</Field>
          <Field>
            {editMode ? (
              <label>
                Projeto:
                <select
                  value={selectedOptionProject}
                  onChange={(e) => handleProjectChange(e.target.value)}
                >
                  <option value={employee.project?.[0]?.project?.id}>{employee.project?.[0]?.project?.name}</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </label>
            ) : (
              <span>Projeto: {employee.project?.[0]?.project?.name || "—"}</span>
            )}
          </Field>

          <Field>
            {editMode ? (
              <label>
                Função:
                <select
                  value={formData.occupation_id || ""}
                  onChange={(e) => handleOccupationChange(e.target.value)}
                >
                  <option value={employee.occupation_id}>{employee.occupation_name}</option>
                  {availableOccupations.length > 0
                    ? availableOccupations.map((occ) => (
                      <option key={occ.id} value={occ.id}>
                        {occ.name}
                      </option>
                    ))
                    : occupations.map((occ) => (
                      <option key={occ.id} value={occ.id}>
                        {occ.name}
                      </option>
                    ))}
                </select>
              </label>
            ) : (
              <span>Função: {employee.occupation_name || "—"}</span>
            )}
          </Field>


          <Field>
            {editMode ? (
              <label>
                Descrição da Função:
                <input
                  name="occupation_description"
                  value={formData.occupation_description || ""}
                  onChange={handleChange}
                  readOnly
                  disabled={true}
                />
              </label>
            ) : (
              <span>Descrição da Função: {employee.occupation_description || "—"}</span>
            )}
          </Field>

          <Field>
            {editMode ? (
              <label>
                Salário:
                <input
                  type="number"
                  name="salary"
                  value={formData.salary || ""}
                  onChange={handleChange}
                  readOnly
                  disabled={true}

                />
              </label>
            ) : (
              <span>Salário: {employee.salary ? `R$ ${employee.salary.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "—"}</span>
            )}
          </Field>

          <Field>
            {editMode ? (
              <label>
                Recebe Periculosidade:
                <select
                  name="hazard_pay"
                  value={formData.dangerousness ? "true" : "false"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dangerousness: e.target.value === "true",
                    }))
                  }
                  disabled={true}
                  readOnly
                >
                  <option value="true">Sim</option>
                  <option value="false">Não</option>
                </select>
              </label>
            ) : (
              <span>Recebe Periculosidade: {formatBool(employee.dangerousness)}</span>
            )}
          </Field>

        </Section>

        {/* Endereço */}
        <Section>
          <SectionTitle>Endereço</SectionTitle>
          {editMode ? (
            <>
              <Field>


                <Field>
                  <label>
                    CEP:
                    <input
                      name="zip_code"
                      value={formatCEP(formData.zip_code) || ""}
                      onChange={handleCepChange}
                      placeholder="CEP"
                    />
                  </label>
                </Field>

                <Field>
                  <label>
                    Numero:
                    <input
                      name="number_of_house"
                      value={formData.number_of_house || ""}
                      onChange={handleChange}
                      placeholder="Número"
                    />
                  </label>
                </Field>


                <label>
                  Endereço:
                  <input
                    name="street_name"
                    value={formData.street_name || ""}
                    onChange={handleChange}
                    placeholder="Rua"
                  />
                </label>
              </Field>



              <Field>
                <label>
                  Bairro:
                  <input
                    name="neighborhood"
                    value={formData.neighborhood || ""}
                    onChange={handleChange}
                    placeholder="Bairro"
                  />
                </label>
              </Field>

              <Field>
                <label>
                  Cidade:
                  <input
                    name="city"
                    value={formData.city || ""}
                    onChange={handleChange}
                    placeholder="Cidade"
                  />
                </label>
              </Field>

              <Field>
                <label>
                  Estado:
                  <input
                    name="state"
                    value={formData.state || ""}
                    onChange={handleChange}
                    placeholder="Estado"
                  />
                </label>
              </Field>

            </>
          ) : (
            <>
              <Field><span>Endereço: {employee.street_name} {employee.number_of_house}, {employee.neighborhood}, {employee.city}, {employee.state}, {formatCEP(employee.zip_code)}</span></Field>

            </>
          )}
        </Section>

        {/* Contatos */}
        <Section>
          <SectionTitle>Contatos</SectionTitle>
          <Field>
            {editMode ? (
              <label>Telefone:
                <input
                  maxLength={17}
                  name="phone"
                  value={formData?.phones?.[0]?.phoneNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phones: [{ ...formData.phones?.[0], phoneNumber: e.target.value }]
                    })
                  }
                />
              </label>) : (
              <span>Telefones: {formatPhones(formData.phones)}</span>
            )}
          </Field>
        </Section>

        {/* Botões */}
        {editMode && (
          <ButtonGroup>
            <Button onClick={() => {
              setFormData(employee || {}); // reseta dados ao cancelar
              setEditMode(false);
            }}
              disabled={loading}
            >Cancelar</Button>

            <Button primary onClick={handleSave} disabled={loading}>{loading ? "Salvando..." : "Salvar"}</Button>
          </ButtonGroup>
        )}

        {message && <p style={{ textAlign: "center", marginTop: "0.5rem" }}>{message}</p>}

      </ModalContent>
    </ModalOverlay>
  );
}
