// import React from "react";
// import { motion } from "framer-motion";
// import { ChevronRight, Plus } from "lucide-react";

// export default function Step8_AposAtendimento({
//   Field,
//   Label,
//   Card,
//   BigBtn,
//   current,
//   fmt,
//   onIniciarRetornoBase,     // ← CORRETO
//   startNewAtendimento,
//   next,
// }) {
//   return (
//     <motion.div
//       key="s8"
//       initial={{ x: 20, opacity: 0 }}
//       animate={{ x: 0, opacity: 1 }}
//       exit={{ x: -20, opacity: 0 }}
//       transition={{ duration: 0.24 }}
//     >
//       <Field>
//         <Label>O que deseja fazer agora?</Label>

//         <Card style={{ padding: 12, marginTop: 8 }}>
//           <div style={{ color: "#9fb4c9" }}>
//             Início: {fmt(current.atendimentoInicio)} <br />
//             Fim: {fmt(current.finalizadoEm)} <br />
//             GPS Início: {current.gpsInicio?.lat || "—"},{" "}
//             {current.gpsInicio?.lng || "—"} <br />
//             GPS Chegada: {current.gpsChegada?.lat || "—"},{" "}
//             {current.gpsChegada?.lng || "—"}
//           </div>
//         </Card>

//         <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          
//           {/* RETORNAR À BASE */}
//           <BigBtn
//             $primary
//             onClick={() => {
//               onIniciarRetornoBase(); // ← FUNÇÃO CORRETA
//               next();                 // Step 9
//             }}
//             style={{ flex: 1 }}
//           >
//             Retornar à base <ChevronRight size={18} />
//           </BigBtn>

//           {/* NOVO ATENDIMENTO */}
//           <BigBtn
//             onClick={() => {
//               startNewAtendimento();
//               next(); // volta para Step 1
//             }}
//             style={{ flex: 1 }}
//           >
//             <Plus size={16} /> Novo atendimento
//           </BigBtn>
//         </div>
//       </Field>
//     </motion.div>
//   );
// }


import React from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export default function  Step8_AposAtendimento({
  Field,
  Label,
  Card,
  BigBtn,
  jornada,
  fmt,
  marcarChegadaBase,
  abrirInterromperRetorno,

  // 🔥 adicionados para reproduzir o comportamento do monolito
  current,
  distanciaAteBase
}) {
  const ultimoRetorno =
    jornada.baseLogs
      ?.filter(i => i.tipo === "deslocamentoParaBase" && !i.finalizado)
      ?.slice(-1)[0];

  return (
    <motion.div
      key="s9"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      transition={{ duration: 0.24 }}
    >

      {/* 🔥 BLOQUEIO SE PAUSADO PARA ALMOÇO */}
      {current?.pausadoParaAlmoco && (
        <Card style={{ marginTop: 12, padding: 12, borderColor: "#f59e0b" }}>
          <strong style={{ color: "#f59e0b" }}>
            Retorno à base pausado para almoço
          </strong>
          <br />
          Finalize o almoço para continuar.
        </Card>
      )}

      {/* Quando pausado → não renderiza o restante */}
      {!current?.pausadoParaAlmoco && (
        <Field style={{ marginTop: 12 }}>
          <Label>Retorno à base em andamento</Label>

          <Card style={{ padding: 12 }}>
            <div style={{ fontWeight: 700 }}>Retorno à base</div>

            <div style={{ color: "#9fb4c9", marginTop: 8 }}>
              Deslocamento iniciado em:{" "}
              {fmt(ultimoRetorno?.time)}

              <br />

              Distância estimada até a base:{" "}
              {distanciaAteBase
                ? distanciaAteBase()
                  ? (distanciaAteBase() / 1000).toFixed(2) + " km"
                  : "—"
                : "—"}
            </div>
          </Card>

          {/* BOTÕES */}
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <BigBtn
              $primary
              onClick={marcarChegadaBase}
              style={{ flex: 1 }}
            >
              Confirmar chegada <ChevronRight size={18} />
            </BigBtn>

            <BigBtn
              onClick={abrirInterromperRetorno}
              style={{ flex: 1 }}
            >
              Interromper retorno
            </BigBtn>
          </div>
        </Field>
      )}
    </motion.div>
  );
}
