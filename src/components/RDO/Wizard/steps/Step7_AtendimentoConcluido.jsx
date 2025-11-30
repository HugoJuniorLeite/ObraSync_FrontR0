import React from "react";
import { motion } from "framer-motion";
import { Plus, ChevronRight } from "lucide-react";

export default function Step7_AtendimentoConcluido({
  Field,
  Label,
  Card,
  BigBtn,
  current,
  fmt,
  iniciarDeslocamentoParaBase,
  startNewAtendimento,
  next,
  prev,
}) {
  return (
    <motion.div
      key="s7"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      transition={{ duration: 0.24 }}
    >
      <Field>
        <Label>Atendimento concluído</Label>

        <Card style={{ padding: 12, marginTop: 8 }}>
          <div style={{ color: "#9fb4c9", lineHeight: "20px" }}>
            <div>Início: {fmt(current.atendimentoInicio)}</div>
            <div>Fim: {fmt(current.finalizadoEm)}</div>

            <div style={{ marginTop: 6 }}>
              GPS Início:{" "}
              {current.gpsInicio?.lat || "—"},{" "}
              {current.gpsInicio?.lng || "—"}
            </div>

            <div>
              GPS Chegada:{" "}
              {current.gpsChegada?.lat || "—"},{" "}
              {current.gpsChegada?.lng || "—"}
            </div>
          </div>
        </Card>

        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          {/* BOTÃO RETORNAR BASE */}
          <BigBtn
            $primary
            onClick={() => {
              iniciarDeslocamentoParaBase();
              next(); // vai para o Step 8
            }}
          >
            Retornar à base <ChevronRight size={18} />
          </BigBtn>

          {/* BOTÃO NOVO ATENDIMENTO */}
          <BigBtn
            onClick={() => {
              startNewAtendimento();
              next(); // volta para etapa inicial (ou Step 1)
            }}
          >
            <Plus size={16} /> Novo atendimento
          </BigBtn>
        </div>
      </Field>
    </motion.div>
  );
}

// import React from "react";
// import { motion } from "framer-motion";
// import { Plus } from "lucide-react";

// export default function Step7_AtendimentoConcluido({
//   Field,
//   Label,
//   Card,
//   BigBtn,
//   current,
//   fmt,
//   iniciarDeslocamentoParaBase, // callback vindo do WizardController
//   startNewAtendimento,
//   next,
// }) {
//   return (
//     <motion.div
//       key="s7"
//       initial={{ x: 20, opacity: 0 }}
//       animate={{ x: 0, opacity: 1 }}
//       exit={{ x: -20, opacity: 0 }}
//       transition={{ duration: 0.24 }}
//     >
//       <Field>
//         <Label>Atendimento concluído</Label>

//         <Card>
//           <div style={{ color: "#9fb4c9" }}>
//             Início: {fmt(current.atendimentoInicio)} <br />
//             Fim: {fmt(current.finalizadoEm)} <br />
//             GPS Início: {current.gpsInicio?.lat || "—"},
//             {current.gpsInicio?.lng || "—"} <br />
//             GPS Chegada: {current.gpsChegada?.lat || "—"},
//             {current.gpsChegada?.lng || "—"}
//           </div>
//         </Card>

//         <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
//           <BigBtn
//             $primary
//             onClick={() => {
//               iniciarDeslocamentoParaBase(); // apenas chama callback
//               next(); // vai para Step 8
//             }}
//           >
//             Retornar à base
//           </BigBtn>

//           <BigBtn
//             onClick={() => {
//               startNewAtendimento();
//             }}
//           >
//             <Plus size={16} /> Novo atendimento
//           </BigBtn>
//         </div>
//       </Field>
//     </motion.div>
//   );
// }
