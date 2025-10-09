// import { useContext, useEffect, useState } from "react";
// import serviceOs from "../services/apiOs";
// import {
//   Container,
//   Title,
//   TableWrapper,
//   Table,
//   Thead,
//   Th,
//   Tbody,
//   Tr,
//   Td,
//   ActionButton,
// } from "../layouts/StyledComponents";
// import {
//   CheckboxContainer,
//   HiddenCheckbox,
//   ModalContent,
//   ModalOverlay,
//   P,
//   StyledCheckbox,
//   SubmitButton,
// } from "../layouts/Theme";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { BillSchema } from "../schemas/BillSchema";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { FormContext } from "./RdoForms/FormContext";

// export default function MyService() {
//   const [bills, setBills] = useState([]);
//   const [selectedBills, setSelectedBills] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const {selectedBill, setSelectedBill} = useContext(FormContext);
//   const navigate = useNavigate();

//   const {
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(BillSchema),
//     defaultValues: {
//       sameAddress: false,
//       selectedOptionTechnician: "",
//       selectedOptionProject: "",
//       programDate: "",
//     },
//   });

//   const programDate = watch("programDate");

//   useEffect(() => {
//     const fetchBills = async () => {
//       try {
//         const response = await serviceOs.getService({ technical_id: 2 });

//         const filtered = response.filter((bill) =>
//           ["despachada", "aceita", "em_deslocamento", "em_atendimento"].includes(bill.status)
//         );

//         setBills(filtered);
//       } catch (error) {
//         console.error("Erro ao buscar contratos:", error);
//       }
//     };
//     fetchBills();
//   }, []);

//   const handleView = (bill) => {
//     setSelectedBill(bill);
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setSelectedBill(null);
//     setShowModal(false);
//   };

//   const toggleSelect = (id) => {
//     if (selectedBills.includes(id)) {
//       setSelectedBills(selectedBills.filter((billId) => billId !== id));
//     } else {
//       setSelectedBills([...selectedBills, id]);
//     }
//   };

//   const toggleSelectAll = () => {
//     if (selectedBills.length === bills.length) {
//       setSelectedBills([]);
//     } else {
//       setSelectedBills(bills.map((bill) => bill.id));
//     }
//   };

//   const handleAccept = async (bill_id, status) => {
//     if (!bill_id || !status) return;

//     try {
//       await serviceOs.changeStatus(bill_id, status);

//       setBills((prevBills) => {
//         const updated = prevBills
//           .map((bill) =>
//             bill.id === bill_id ? { ...bill, status: status.status } : bill
//           )
//           .filter((bill) =>
//             ["despachada", "aceita", "em_deslocamento", "em_atendimento"].includes(bill.status)
//           );

//         // 🔄 sincroniza modal se estiver aberto
//         if (selectedBill && selectedBill.id === bill_id) {
//           setSelectedBill(updated.find((b) => b.id === bill_id) || null);
//         }

//         return updated;
//       });
//     } catch (error) {
//       console.error("Erro ao atualizar nota:", error);
//     }
//   };

//   return (
//     <Container>
//       <Title>Minhas notas de Serviço</Title>

//       <TableWrapper>
//         <Table>
//           <Thead>
//             <Tr>
//               <Th>
//                 <CheckboxContainer>
//                   <HiddenCheckbox
//                     type="checkbox"
//                     checked={selectedBills.length === bills.length && bills.length > 0}
//                     onChange={toggleSelectAll}
//                   />
//                   <StyledCheckbox />
//                 </CheckboxContainer>
//               </Th>
//               <Th>Nota</Th>
//               <Th>Status</Th>
//               <Th>Projeto</Th>
//               <Th>Serviço</Th>
//               <Th>Endereço</Th>
//               <Th>Programado</Th>
//             </Tr>
//           </Thead>
//           <Tbody>
//             {bills.map((bill) => (
//               <Tr key={bill.id}>
//                 <Td>
//                   <CheckboxContainer>
//                     <HiddenCheckbox
//                       checked={selectedBills.includes(bill.id)}
//                       onChange={() => toggleSelect(bill.id)}
//                     />
//                     <StyledCheckbox />
//                   </CheckboxContainer>

//                   <div>
//                     <ActionButton onClick={() => handleView(bill)} className="view">
//                       Ver nota
//                     </ActionButton>

//                     {bill.status === "despachada" ? (
//                       <ActionButton
//                         onClick={() => handleAccept(bill.id, { status: "aceita" })}
//                         className="accept"
//                       >
//                         Aceitar
//                       </ActionButton>
//                     ) : (
//                       <ActionButton
//                         onClick={() => handleAccept(bill.id, { status: "devolvida" })}
//                         className="accept"
//                       >
//                         Devolver
//                       </ActionButton>
//                     )}
//                   </div>
//                 </Td>
//                 <Td>{bill.id}</Td>
//                 <Td>{bill.status}</Td>
//                 <Td>{bill.project?.name}</Td>
//                 <Td>{bill.service?.name}</Td>
//                 <Td>
//                   {bill.customer_address?.street}, {bill.customer_address?.number} -{" "}
//                   {bill.customer_address?.neighborhood}, {bill.customer_address?.city}/
//                   {bill.customer_address?.state}
//                 </Td>
//                 <Td>{bill.scheduled_at?.toLocaleString("pt-BR")}</Td>
//               </Tr>
//             ))}
//           </Tbody>
//         </Table>
//       </TableWrapper>

//       {/* Modal fora do map */}
//       <AnimatePresence>
//         {showModal && selectedBill && (
//           <ModalOverlay>
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.9 }}
//               transition={{ duration: 0.2 }}
//             >
//               <ModalContent>
//                 <h2>Nota #{selectedBill.id}</h2>
//                 <P>Status: {selectedBill.status}</P>
//                 <P>Projeto: {selectedBill.project?.name}</P>
//                 <P>Serviço: {selectedBill.service?.name}</P>
//                 <P>
//                   Endereço: {selectedBill.customer_address?.street},{" "}
//                   {selectedBill.customer_address?.number} -{" "}
//                   {selectedBill.customer_address?.neighborhood},{" "}
//                   {selectedBill.customer_address?.city}/{selectedBill.customer_address?.state}
//                 </P>

//                 <SubmitButton onClick={handleCloseModal}>Fechar</SubmitButton>

//                 {selectedBill.status === "despachada" && (
//                   <SubmitButton
//                     onClick={() => handleAccept(selectedBill.id, { status: "aceita" })}
//                   >
//                     aceitar
//                   </SubmitButton>
//                 )}

//                 {selectedBill.status === "aceita" && (
//                   <SubmitButton
//                     onClick={() => handleAccept(selectedBill.id, { status: "em_deslocamento" })}
//                   >
//                     iniciar deslocamento
//                   </SubmitButton>
//                 )}

//                 {selectedBill.status === "em_deslocamento" && (
//                   <SubmitButton
//                     onClick={() => handleAccept(selectedBill.id, { status: "em_atendimento" })}
//                   >
//                     iniciar atendimento
//                   </SubmitButton>
//                 )}

//                 {selectedBill.status === "em_atendimento" && (
//                   <SubmitButton onClick={() => navigate(`/rdo-form`)}>
//                     preencher nota
//                   </SubmitButton>
//                 )}
//               </ModalContent>
//             </motion.div>
//           </ModalOverlay>
//         )}
//       </AnimatePresence>
//     </Container>
//   );
// }



import { useContext, useEffect, useState } from "react";
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
} from "../layouts/StyledComponents";
import {
  CheckboxContainer,
  HiddenCheckbox,
  ModalContent,
  ModalOverlay,
  P,
  StyledCheckbox,
  SubmitButton,
} from "../layouts/Theme";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BillSchema } from "../schemas/BillSchema";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FormContext } from "./RdoForms/FormContext";


import { AuthContext } from "../contexts/AuthContext";

export default function MyService() {

  const { user, logout } = useContext(AuthContext);


  const [bills, setBills] = useState([]);
  const [selectedBills, setSelectedBills] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // 👇 Agora usamos o contexto para gerenciar o bill selecionado
  const { selectedBill, setSelectedBill } = useContext(FormContext);

  const navigate = useNavigate();

  const {
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(BillSchema),
    defaultValues: {
      sameAddress: false,
      selectedOptionTechnician: "",
      selectedOptionProject: "",
      programDate: "",
    },
  });

  const programDate = watch("programDate");

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await serviceOs.getService({ technical_id: user?.id });

        const filtered = response.filter((bill) =>
          ["despachada", "aceita", "em_deslocamento", "em_atendimento"].includes(bill.status)
        );
        console.log(user, "id context login")

        setBills(filtered);
      } catch (error) {
        console.error("Erro ao buscar contratos:", error);
      }
    };
    fetchBills();
  }, []);

  const handleView = (bill) => {
    setSelectedBill(bill);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedBill(null);
    setShowModal(false);
  };

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

  const handleAccept = async (bill_id, status) => {
    if (!bill_id || !status) return;

    try {
      await serviceOs.changeStatus(bill_id, status);

      setBills((prevBills) => {
        const updated = prevBills
          .map((bill) =>
            bill.id === bill_id ? { ...bill, status: status.status } : bill
          )
          .filter((bill) =>
            ["despachada", "aceita", "em_deslocamento", "em_atendimento"].includes(bill.status)
          );

        // 🔄 se o modal estiver aberto, sincroniza
        if (selectedBill && selectedBill.id === bill_id) {
          setSelectedBill(updated.find((b) => b.id === bill_id) || null);
        }

        return updated;
      });
    } catch (error) {
      console.error("Erro ao atualizar nota:", error);
    }
  };

  // 👇 Novo: abrir o formulário híbrido já linkado ao contexto
  const handleOpenForm = (bill) => {
    setSelectedBill(bill); // salva no contexto
    setShowModal(false); // fecha modal
    navigate(`/rdo-form/${bill.id}`); // vai pro form
    console.log(bill)
  };

  return (
    <Container>
      <Title>Minhas notas de Serviço</Title>

      <TableWrapper>
        <Table>
          <Thead>
            <Tr>
              <Th>
                {/* <CheckboxContainer>
                  <HiddenCheckbox
                    type="checkbox"
                    checked={selectedBills.length === bills.length && bills.length > 0}
                    onChange={toggleSelectAll}
                  />
                  <StyledCheckbox />
                </CheckboxContainer> */}
                Selecionar
              </Th>
              <Th>Nota</Th>
              <Th>Status</Th>
              <Th>Projeto</Th>
              <Th>Serviço</Th>
              <Th>Endereço</Th>
              <Th>Programado</Th>
            </Tr>
          </Thead>
          <Tbody>
            {bills.map((bill) => (
              <Tr key={bill.id}>
                <Td>
                  {/* <CheckboxContainer>
                    <HiddenCheckbox
                      checked={selectedBills.includes(bill.id)}
                      onChange={() => toggleSelect(bill.id)}
                    />
                    <StyledCheckbox />
                  </CheckboxContainer> */}

                  <div>
                    <ActionButton onClick={() => handleView(bill)} className="view">
                      Ver nota
                    </ActionButton>

                    {bill.status === "despachada" ? (
                      <ActionButton
                        onClick={() => handleAccept(bill.id, { status: "aceita" })}
                        className="accept"
                      >
                        Aceitar
                      </ActionButton>
                    ) : bill.status === "em_atendimento" ? null : (
                      <ActionButton
                        onClick={() => handleAccept(bill.id, { status: "devolvida" })}
                        className="accept"
                      >
                        Devolver
                      </ActionButton>
                    )}

                  </div>
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
                <Td>{bill.scheduled_at?.toLocaleString("pt-BR")}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableWrapper>

      {/* Modal fora do map */}
      <AnimatePresence>
        {showModal && selectedBill && (
          <ModalOverlay>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <ModalContent>
                <h2>Nota #{selectedBill.id}</h2>
                <P>Status: {selectedBill.status}</P>
                <P>Projeto: {selectedBill.project?.name}</P>
                <P>Serviço: {selectedBill.service?.name}</P>
                <P>
                  Endereço: {selectedBill.customer_address?.street},{" "}
                  {selectedBill.customer_address?.number} -{" "}
                  {selectedBill.customer_address?.neighborhood},{" "}
                  {selectedBill.customer_address?.city}/{selectedBill.customer_address?.state}
                </P>

                <SubmitButton onClick={handleCloseModal}>Fechar</SubmitButton>

                {selectedBill.status === "despachada" && (
                  <SubmitButton
                    onClick={() => handleAccept(selectedBill.id, { status: "aceita" })}
                  >
                    aceitar
                  </SubmitButton>
                )}

                {selectedBill.status === "aceita" && (
                  <SubmitButton
                    onClick={() => handleAccept(selectedBill.id, { status: "em_deslocamento" })}
                  >
                    iniciar deslocamento
                  </SubmitButton>
                )}

                {selectedBill.status === "em_deslocamento" && (
                  <SubmitButton
                    onClick={() => handleAccept(selectedBill.id, { status: "em_atendimento" })}
                  >
                    iniciar atendimento
                  </SubmitButton>
                )}

                {selectedBill.status === "em_atendimento" && (
                  <SubmitButton onClick={() => handleOpenForm(selectedBill)}>
                    preencher nota
                  </SubmitButton>
                )}
              </ModalContent>
            </motion.div>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </Container>
  );
}
