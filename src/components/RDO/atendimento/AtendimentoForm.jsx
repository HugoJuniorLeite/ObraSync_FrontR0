// import React, { useState } from "react";
// import { Card, Field, Label, Input, Select, Textarea } from "../styles/layout";

// const AtendimentoForm = ({ initialData, onSave, onCancel }) => {
//   const [form, setForm] = useState(
//     initialData || {
//       id: crypto.randomUUID(),
//       notaEnviada: "nao",
//       ordemTipo: "",
//       ordemNumero: "",
//       descricao: "",
//       endereco: {
//         cep: "",
//         rua: "",
//         numero: "",
//         bairro: "",
//         cidade: "",
//         estado: "",
//       },
//       fotos: [],
//     }
//   );

//   const onChange = (field, value) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//   };

//   const onChangeAddress = (field, value) => {
//     setForm((prev) => ({
//       ...prev,
//       endereco: { ...prev.endereco, [field]: value },
//     }));
//   };

//   const handleSubmit = () => {
//     onSave(form);
//   };

//   return (
//     <Card>
//       <Field>
//         <Label>Nota enviada?</Label>
//         <Select
//           value={form.notaEnviada}
//           onChange={(e) => onChange("notaEnviada", e.target.value)}
//         >
//           <option value="nao">Não</option>
//           <option value="sim">Sim</option>
//         </Select>
//       </Field>

//       {form.notaEnviada === "sim" && (
//         <>
//           <Field>
//             <Label>Tipo</Label>
//             <Input
//               value={form.ordemTipo}
//               onChange={(e) => onChange("ordemTipo", e.target.value)}
//             />
//           </Field>
//           <Field>
//             <Label>Número</Label>
//             <Input
//               value={form.ordemNumero}
//               onChange={(e) => onChange("ordemNumero", e.target.value)}
//             />
//           </Field>
//         </>
//       )}

//       <Field>
//         <Label>Descrição</Label>
//         <Textarea
//           value={form.descricao}
//           onChange={(e) => onChange("descricao", e.target.value)}
//         />
//       </Field>

//       <Field>
//         <Label>CEP</Label>
//         <Input
//           value={form.endereco.cep}
//           onChange={(e) => onChangeAddress("cep", e.target.value)}
//         />
//       </Field>

//       <Field>
//         <Label>Rua</Label>
//         <Input
//           value={form.endereco.rua}
//           onChange={(e) => onChangeAddress("rua", e.target.value)}
//         />
//       </Field>

//       <Field>
//         <Label>Número</Label>
//         <Input
//           value={form.endereco.numero}
//           onChange={(e) => onChangeAddress("numero", e.target.value)}
//         />
//       </Field>

//       <Field>
//         <Label>Bairro</Label>
//         <Input
//           value={form.endereco.bairro}
//           onChange={(e) => onChangeAddress("bairro", e.target.value)}
//         />
//       </Field>

//       <Field>
//         <Label>Cidade</Label>
//         <Input
//           value={form.endereco.cidade}
//           onChange={(e) => onChangeAddress("cidade", e.target.value)}
//         />
//       </Field>

//       <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
//         <button
//           onClick={handleSubmit}
//           style={{
//             padding: "10px 12px",
//             border: "1px solid #38bdf8",
//             background: "#38bdf8",
//             borderRadius: 10,
//             color: "#081018",
//           }}
//         >
//           Salvar
//         </button>
//         <button
//           onClick={onCancel}
//           style={{
//             padding: "10px 12px",
//             borderRadius: 10,
//             border: "1px solid #00396b",
//             background: "#00396b",
//             color: "#dbeafe",
//           }}
//         >
//           Cancelar
//         </button>
//       </div>
//     </Card>
//   );
// };

// export default AtendimentoForm;

