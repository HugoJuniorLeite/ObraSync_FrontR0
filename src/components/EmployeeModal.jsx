// avaliar

// import { useState } from "react";
// import styled from "styled-components";
// import { X, Edit } from "lucide-react";
// import axios from "axios";


// // import { useState } from "react";
// // import styled from "styled-components";
// // import { X, Edit } from "lucide-react";
// // import axios from "axios";
// import axios from "axios";
// import { useState } from "react";
// import styled from "styled-components";
// import { Input } from "./Ui/Input";
// import { Edit, X } from "lucide-react";
// // import { Input } from "../../layouts/Theme";

// // ====== ESTILOS ======
// const ModalOverlay = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   background: rgba(10, 15, 25, 0.85);
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   z-index: 50;
// `;

// const ModalContent = styled.div`
//   background: #1a2d45;
//   border: 1px solid #00396b;
//   border-radius: 12px;
//   padding: 2rem;
//   width: 90%;
//   max-width: 600px;
//   position: relative;
//   color: #fff;
//   box-shadow: 0 0 20px rgba(0, 57, 107, 0.5);
//   max-height: 90vh;
//   overflow-y: auto;
// `;

// const CloseButton = styled.button`
//   position: absolute;
//   top: 12px;
//   right: 12px;
//   background: none;
//   border: none;
//   color: #f5f5f5;
//   cursor: pointer;
//   transition: 0.3s;
//   &:hover {
//     color: #f59e0b;
//   }
// `;

// const EditButton = styled.button`
//   position: absolute;
//   top: 12px;
//   right: 50px;
//   background: none;
//   border: none;
//   color: #f5f5f5;
//   cursor: pointer;
//   transition: 0.3s;
//   &:hover {
//     color: #22c55e;
//   }
// `;

// const Section = styled.div`
//   background: #0f243b;
//   border: 1px solid #00396b;
//   border-radius: 8px;
//   padding: 1rem;
//   margin-bottom: 1rem;
// `;

// const SectionTitle = styled.h4`
//   color: #f59e0b;
//   margin-bottom: 0.5rem;
//   font-size: 1.1rem;
// `;

// const Field = styled.div`
//   margin-bottom: 0.5rem;
// `;

// const ButtonGroup = styled.div`
//   display: flex;
//   justify-content: flex-end;
//   gap: 0.5rem;
//   margin-top: 1rem;
// `;

// const Button = styled.button`
//   padding: 0.5rem 1rem;
//   border-radius: 8px;
//   border: ${(props) => (props.primary ? "none" : "1px solid #00396b")};
//   background: ${(props) => (props.primary ? "#3b82f6" : "transparent")};
//   color: ${(props) => (props.primary ? "white" : "#f5f5f5")};
//   cursor: pointer;
//   transition: 0.3s;

//   &:hover {
//     background: ${(props) => (props.primary ? "#2563eb" : "#00396b")};
//   }

//   &:disabled {
//     opacity: 0.5;
//     cursor: not-allowed;
//   }
// `;

// // ====== FUNÇÕES DE FORMATAÇÃO ======
// const formatDate = (value) => {
//   if (!value) return "—";
//   const d = new Date(value);
//   return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
// };

// const formatCPF = (cpf) => cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") ?? "—";
// const formatRG = (rg) => rg?.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, "$1.$2.$3-$4") ?? "—";
// const formatCEP = (cep) => cep?.replace(/(\d{5})(\d{3})/, "$1-$2") ?? "—";
// const formatBool = (value) => value ? "Sim" : "Não";
// const formatPhone = (phone) => {
//   if (!phone) return "—";
//   const digits = phone.replace(/\D/g, "");
//   if (digits.length === 11) return `(${digits.slice(0,2)}) ${digits.slice(2,3)} ${digits.slice(3,7)}-${digits.slice(7,11)}`;
//   if (digits.length === 10) return `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6,10)}`;
//   return phone;
// };
// const formatPhones = (phones) => {
//   if (!phones) return "—";
//   if (Array.isArray(phones)) return phones.map(p => formatPhone(p.phoneNumber)).join(", ");
//   if (phones.phoneNumber) return formatPhone(phones.phoneNumber);
//   return "—";
// };

// // ====== COMPONENTE ======
// export default function EmployeeModal({ employee, onUpdate, onClose }) {
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState(employee);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState(null);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     if (name === "phones") {
//       const phonesArray = value.split(",").map(p => ({ phoneNumber: p.trim() })).filter(p => p.phoneNumber);
//       setFormData(prev => ({ ...prev, phones: phonesArray }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
//     }
//   };

//   const handleSave = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.put(`http://localhost:3000/employees/${formData.id}`, formData);
//       setMessage("✅ Atualizado com sucesso!");
//       onUpdate(response.data);
//       setTimeout(() => { setLoading(false); setEditMode(false); onClose(); }, 1000);
//     } catch (error) {
//       console.error(error);
//       setMessage("❌ Erro ao atualizar.");
//       setLoading(false);
//     }
//   };

//   return (
//     <ModalOverlay onClick={onClose}>
//       <ModalContent onClick={(e) => e.stopPropagation()}>
//         <CloseButton onClick={onClose}><X size={22} /></CloseButton>
//         {!editMode && <EditButton onClick={() => setEditMode(true)}><Edit size={22} /></EditButton>}

//         <h2 style={{ color: "#f59e0b", marginBottom: "1rem" }}>{employee.name}</h2>

//         {/* Dados Pessoais */}
//         <Section>
//           <SectionTitle>Dados Pessoais</SectionTitle>
//           {editMode ? (
//             <>
//               <Input label="Data de Aniversário" type="date" value={formData.date_of_birth?.slice(0,10) || ""} onChange={handleChange} name="date_of_birth" />
//               <Input label="RG" value={formData.rg || ""} onChange={handleChange} name="rg" />
//               <Input label="CPF" value={formData.cpf || ""} onChange={handleChange} name="cpf" />
//               <Input label="CNH" type="checkbox" checked={formData.drivers_license || false} onChange={handleChange} name="drivers_license" />
//             </>
//           ) : (
//             <>
//               <Field><span>Data de Aniversário: {formatDate(employee.date_of_birth)}</span></Field>
//               <Field><span>RG: {formatRG(employee.rg)}</span></Field>
//               <Field><span>CPF: {formatCPF(employee.cpf)}</span></Field>
//               <Field><span>CNH: {formatBool(employee.drivers_license)}</span></Field>
//             </>
//           )}
//         </Section>

//         {/* Dados Corporativos */}
//         <Section>
//           <SectionTitle>Dados Corporativos</SectionTitle>
//           {editMode ? (
//             <>
//               <Input label="Data de Admissão" type="date" value={formData.admission_date?.slice(0,10) || ""} onChange={handleChange} name="admission_date" />
//               <Input label="Ativo" type="checkbox" checked={formData.active || false} onChange={handleChange} name="active" />
//               <Input label="Função" value={formData.occupation_name || ""} onChange={handleChange} name="occupation_name" />
//               <Input label="Descrição da Função" value={formData.description_occupation || ""} onChange={handleChange} name="description_occupation" />
//               <Input label="Salário" type="number" value={formData.salary || ""} onChange={handleChange} name="salary" />
//               <Input label="Recebe Periculosidade" type="checkbox" checked={formData.dangerousness || false} onChange={handleChange} name="dangerousness" />
//             </>
//           ) : (
//             <>
//               <Field><span>Data de Admissão: {formatDate(employee.admission_date)}</span></Field>
//               <Field><span>Ativo: {formatBool(employee.active)}</span></Field>
//               <Field><span>Função: {employee.occupation_name}</span></Field>
//               <Field><span>Descrição da Função: {employee.description_occupation}</span></Field>
//               <Field><span>Salário: {employee.salary ? `R$ ${employee.salary.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "—"}</span></Field>
//               <Field><span>Recebe Periculosidade: {formatBool(employee.dangerousness)}</span></Field>
//             </>
//           )}
//         </Section>

//         {/* Endereço */}
//         <Section>
//           <SectionTitle>Endereço</SectionTitle>
//           {editMode ? (
//             <>
//               <Input label="Rua" value={formData.street_name || ""} onChange={handleChange} name="street_name" />
//               <Input label="Número" value={formData.number_of_house || ""} onChange={handleChange} name="number_of_house" />
//               <Input label="Bairro" value={formData.neighborhood || ""} onChange={handleChange} name="neighborhood" />
//               <Input label="Cidade" value={formData.city || ""} onChange={handleChange} name="city" />
//               <Input label="Estado" value={formData.state || ""} onChange={handleChange} name="state" />
//               <Input label="CEP"    value={formData.zip_code || ""} onChange={handleChange} name="zip_code" />
//             </>
//           ) : (
//             <Field>
//               <span>Endereço: {employee.street_name} {employee.number_of_house}, {employee.neighborhood}, {employee.city}, {employee.state}, {formatCEP(employee.zip_code)}</span>
//             </Field>
//           )}
//         </Section>

//         {/* Contatos */}
//         <Section>
//           <SectionTitle>Contatos</SectionTitle>
//           {editMode ? (
//             <Input
//               label="Telefones"
//               value={Array.isArray(formData.phones) ? formData.phones.map(p => p.phoneNumber).join(", ") : ""}
//               onChange={handleChange}
//               name="phones"
//             />
//           ) : (
//             <Field><span>Telefones: {formatPhones(employee.phones)}</span></Field>
//           )}
//         </Section>

//         {/* Botões */}
//         {editMode && (
//           <ButtonGroup>
//             <Button onClick={() => setEditMode(false)}>Cancelar</Button>
//             <Button primary onClick={handleSave} disabled={loading}>{loading ? "Salvando..." : "Salvar"}</Button>
//           </ButtonGroup>
//         )}

//         {message && <p style={{ textAlign: "center", marginTop: "0.5rem" }}>{message}</p>}
//       </ModalContent>
//     </ModalOverlay>
//   );
// }





import { useState } from "react";
import styled from "styled-components";
import { X, Edit } from "lucide-react";
import axios from "axios";

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

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 8px;
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




import { useEffect } from "react";


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
  if (!phones) return "—";
  if (Array.isArray(phones)) return phones.map(p => formatPhone(p.phoneNumber)).join(", ");
  if (phones.phoneNumber) return formatPhone(phones.phoneNumber);
  return "—";
};

// ====== COMPONENTE ======
export default function EmployeeModal({ employee, onUpdate, onClose }) {
  const [editMode, setEditMode] = useState(false);
  // const [formData, setFormData] = useState({});
  const [formData, setFormData] = useState(employee || {});

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);



  useEffect(() => {
    setFormData(employee);
    setEditMode(false); // opcional: sempre volta para visualização ao reabrir
  }, [employee]);


  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   if (name === "phones") {
  //     const phonesArray = value.split(",").map(p => ({ phoneNumber: p.trim() })).filter(p => p.phoneNumber);
  //     setFormData(prev => ({ ...prev, phones: phonesArray }));
  //   } else {
  //     setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  //   }
  // };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await axios.put(`http://localhost:3000/employees/${formData.id}`, formData);
      setMessage("✅ Atualizado com sucesso!");
      onUpdate(response.data);
      setTimeout(() => { setLoading(false); setEditMode(false); onClose(); }, 1000);
    } catch (error) {
      console.error(error);
      setMessage("❌ Erro ao atualizar.");
      setLoading(false);
    }
  };

  // const handleCnhChange = (index, field, value) => {
  //   setFormData((prev) => {
  //     const updatedCnh = [...(prev.cnh || [])];
  //     updatedCnh[index] = { ...updatedCnh[index], [field]: value };
  //     return { ...prev, cnh: updatedCnh };
  //   });
  // };


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

        <h2 style={{ color: "#f59e0b", marginBottom: "1rem" }}>{employee.name}</h2>

        {/* Dados Pessoais */}
        <Section>
          <SectionTitle>Dados Pessoais</SectionTitle>
          <Field>{editMode ? <label>Data de Aniversário: <input type="date" name="date_of_birth" value={formData.date_of_birth?.slice(0, 10) || ""} onChange={handleChange} /> </label> : <span>Data de Aniversário: {formatDate(employee.date_of_birth)}</span>}</Field>
          <Field>{editMode ? <label>RG: <input name="rg" value={formatRG(formData.rg) || ""} onChange={handleChange} /> </label> : <span>RG: {formatRG(employee.rg)}</span>}</Field>
          <Field>{editMode ? <label>CPF: <input name="cpf" value={formatCPF(formData.cpf) || ""} onChange={handleChange} /> </label> : <span>CPF: {formatCPF(employee.cpf)}</span>}</Field>
          <Field>{editMode ? <label>CNH: <input type="checkbox" name="drivers_license" checked={formData.drivers_license || false} onChange={handleChange} /> </label> : <span>CNH: {formatBool(employee.drivers_license)}</span>}</Field>


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

        </Section>

        {/* Dados Corporativos */}
        <Section>
          <SectionTitle>Dados Corporativos</SectionTitle>
          <Field>{editMode ? <label>Data de Admissão: <input type="date" name="admission_date" value={formData.admission_date?.slice(0, 10) || ""} onChange={handleChange} /> </label> : <span>Data de Admissão: {formatDate(employee.admission_date)}</span>}</Field>
          <Field>{editMode ? <label>Ativo: <input type="checkbox" name="active" checked={formData.active || false} onChange={handleChange} /> </label> : <span>Ativo: {formatBool(employee.active)}</span>}</Field>
          <Field>{editMode ? <label>Função: <input name="occupation_name" value={formData.occupation_name || ""} onChange={handleChange} /> </label> : <span>Função: {employee.occupation_name}</span>}</Field>
          <Field>{editMode ? <label>Descrição da Função: <input name="description_occupation" value={formData.description_occupation || ""} onChange={handleChange} /> </label> : <span>Descrição da Função: {employee.description_occupation}</span>}</Field>
          <Field>{editMode ? <label>Salário: <input type="number" name="salary" value={formData.salary || ""} onChange={handleChange} /> </label> : <span>Salário: {employee.salary ? `R$ ${employee.salary.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "—"}</span>}</Field>
          <Field>{editMode ? <label>Recebe Periculosidade: <input type="checkbox" name="dangerousness" checked={formData.dangerousness || false} onChange={handleChange} /> </label> : <span>Recebe Periculosidade: {formatBool(employee.dangerousness)}</span>}</Field>
        </Section>

        {/* Endereço */}
        <Section>
          <SectionTitle>Endereço</SectionTitle>
          {editMode ? (
            <>
              <Field><label>Endereço: <input name="street_name" value={formData.street_name || ""} onChange={handleChange} placeholder="Rua" /></label></Field>
              <Field><label>Numeral: <input name="number_of_house" value={formData.number_of_house || ""} onChange={handleChange} placeholder="Número" /></label></Field>
              <Field><label>Bairro: <input name="neighborhood" value={formData.neighborhood || ""} onChange={handleChange} placeholder="Bairro" /></label></Field>
              <Field><label>Cidade: <input name="city" value={formData.city || ""} onChange={handleChange} placeholder="Cidade" /></label></Field>
              <Field><label>Estado: <input name="state" value={formData.state || ""} onChange={handleChange} placeholder="Estado" /></label></Field>
              <Field><label>Cep: <input name="zip_code" value={formatCEP(formData.zip_code) || ""} onChange={handleChange} placeholder="CEP" /></label></Field>

            </>
          ) : (
            <>
              <Field><span>Endereço: {employee.street_name} {employee.number_of_house}, {employee.neighborhood}, {employee.city}, {employee.state}, {formatCEP(employee.zip_code)}</span></Field>
              {/* <Field><span>Bairro: {employee.neighborhood}</span></Field>
              <Field><span>Cidade: {employee.city} - {employee.state}, CEP: {formatCEP(employee.zip_code)}</span></Field> */}
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
                  name="phones"
                  value={
                    Array.isArray(formData.phones)
                      ? formData.phones.map(p => formatPhone(p.phoneNumber)).join(", ")
                      : ""
                  }
                  onChange={handleChange}
                  placeholder="Digite o telefone"
                  maxLength={11}
                />
              </label>) : (
              <span>Telefones: {formatPhones(employee.phones)}</span>
            )}
          </Field>
        </Section>

        {/* Botões */}
        {editMode && (
          <ButtonGroup>
            <Button onClick={() => {
              setFormData(employee || {}); // reseta dados ao cancelar
              setEditMode(false);
            }}>Cancelar</Button>

            <Button primary onClick={handleSave} disabled={loading}>{loading ? "Salvando..." : "Salvar"}</Button>
          </ButtonGroup>
        )}

        {message && <p style={{ textAlign: "center", marginTop: "0.5rem" }}>{message}</p>}

      </ModalContent>
    </ModalOverlay>
  );
}
