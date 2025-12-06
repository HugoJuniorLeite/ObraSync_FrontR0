// import React from "react";
// import { motion } from "framer-motion";
// import { ChevronRight } from "lucide-react";

// export default function Step5_DeslocamentoAtivo({
//   Field,
//   Label,
//   Card,
//   BigBtn,
//   current,
//   fmt,
//   distanciaAteBase,
//   iniciarAtendimento,
//   next,
// }) 

// {
//   return (
//     <motion.div
//       key="s5"
//       initial={{ x: 20, opacity: 0 }}
//       animate={{ x: 0, opacity: 1 }}
//       exit={{ x: -20, opacity: 0 }}
//       transition={{ duration: 0.24 }}
//     >
//       {/* 🔥 BLOQUEIO SE PAUSADO PARA ALMOÇO */}
//       {current.pausadoParaAlmoco && (
//         <Card
//           style={{
//             marginTop: 12,
//             padding: 12,
//             borderColor: "#f59e0b",
//             color: "#f59e0b",
//           }}
//         >
//           <strong>Atendimento pausado para almoço</strong>
//           <br />
//           Finalize o almoço para continuar.
//         </Card>
//       )}

//       {/* 🔒 Se está pausado: não mostrar os demais campos */}
//       {!current.pausadoParaAlmoco && (
//         <Field style={{ marginTop: 12 }}>
//           <Label>Deslocamento ativo</Label>

//           <div style={{ color: "#9fb4c9", marginBottom: 8 }}>
//             Deslocamento iniciado em: {fmt(current.deslocamentoInicio)}
//           </div>

//           <div style={{ color: "#9fb4c9", marginBottom: 8 }}>
//             GPS início: {current.gpsInicio?.lat || "—"},{" "}
//             {current.gpsInicio?.lng || "—"}
//           </div>

//           <div style={{ color: "#9fb4c9", marginBottom: 14 }}>
//             Distância estimada até o destino:{" "}
//             {distanciaAteBase()
//               ? (distanciaAteBase() / 1000).toFixed(2) + " km"
//               : "—"}
//           </div>

//           <BigBtn
//             $primary
//             onClick={() => {
//               iniciarAtendimento();
//               next();
//             }}
//           >
//             Iniciar atendimento <ChevronRight size={18} />
//           </BigBtn>
//         </Field>
//       )}
//     </motion.div>
//   );
// }

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { calcularRotaEndereco } from "../../helpers/rotaDestino";

export default function Step5_DeslocamentoAtivo({
  Field,
  Label,
  Card,
  BigBtn,
  current,
  fmt,
  iniciarAtendimento,
  next,
}) {

const [rota, setRota] = useState(null);

useEffect(() => {
  async function loadRota() {
    if (!current?.endereco) return;

    const r = await calcularRotaEndereco(current.endereco);
    setRota(r);
  }

  loadRota();
}, [current]);

  return (
    <motion.div
      key="s5"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      transition={{ duration: 0.24 }}
    >
      {/* 🔥 BLOQUEIO SE PAUSADO PARA ALMOÇO */}
      {current.pausadoParaAlmoco && (
        <Card
          style={{
            marginTop: 12,
            padding: 12,
            borderColor: "#f59e0b",
            color: "#f59e0b",
          }}
        >
          <strong>Atendimento pausado para almoço</strong>
          <br />
          Finalize o almoço para continuar.
        </Card>
      )}

      {/* 🔒 Se está pausado: não mostra os campos */}
      {!current.pausadoParaAlmoco && (
        <Field style={{ marginTop: 12 }}>
          <Label>Deslocamento ativo</Label>

          <div style={{ color: "#9fb4c9", marginBottom: 8 }}>
            Deslocamento iniciado em: {fmt(current.deslocamentoInicio)}
          </div>

          <div style={{ color: "#9fb4c9", marginBottom: 8 }}>
            GPS início: {current.gpsInicio?.lat || "—"},{" "}
            {current.gpsInicio?.lng || "—"}
          </div>

          <div style={{ color: "#9fb4c9", marginBottom: 14 }}>
            Distância real (via ruas):{" "}
            {rota ? (rota.distancia / 1000).toFixed(2) + " km" : "—"}
          </div>

          <div style={{ color: "#9fb4c9", marginBottom: 14 }}>
            Tempo estimado:{" "}
            {rota ? Math.round(rota.duracao / 60) + " min" : "—"}
          </div>


          <BigBtn
            $primary
            onClick={() => {
              iniciarAtendimento();
              next();
            }}
          >
            Iniciar atendimento <ChevronRight size={18} />
          </BigBtn>
        </Field>
      )}
    </motion.div>
  );
}
