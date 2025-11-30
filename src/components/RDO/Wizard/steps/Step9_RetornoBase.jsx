// import React from "react";
// import { motion } from "framer-motion";
// import { ChevronRight } from "lucide-react";

// export default function Step9_RetornoBase({
//   Field,
//   Label,
//   Card,
//   BigBtn,
//   jornada,
//   fmt,
//   marcarChegadaBase,
//   abrirInterromperRetorno
// }) {
//   const ultimoRetorno =
//     jornada.baseLogs?.filter(i => i.tipo === "deslocamentoParaBase" && !i.finalizado)?.slice(-1)[0];

//   return (
//     <motion.div
//       key="s9"
//       initial={{ x: 20, opacity: 0 }}
//       animate={{ x: 0, opacity: 1 }}
//       exit={{ x: -20, opacity: 0 }}
//       transition={{ duration: 0.24 }}
//     >
//       <Field style={{ marginTop: 12 }}>
//         <Label>Retorno à base</Label>

//         <Card style={{ padding: 12 }}>
//           <div style={{ fontWeight: 700, marginBottom: 8 }}>
//             Retorno em andamento
//           </div>

//           <div style={{ color: "#9fb4c9" }}>
//             Início do retorno: {fmt(ultimoRetorno?.time)}
//           </div>
//         </Card>

//         {/* BOTÕES */}
//         <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
//           <BigBtn
//             $primary
//             onClick={marcarChegadaBase}
//             style={{ flex: 1 }}
//           >
//             Confirmar chegada <ChevronRight size={18} />
//           </BigBtn>

//           <BigBtn
//             onClick={abrirInterromperRetorno}
//             style={{ flex: 1 }}
//           >
//             Interromper retorno
//           </BigBtn>
//         </div>
//       </Field>
//     </motion.div>
//   );
// }


import React from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export default function Step9_RetornoBase({
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
