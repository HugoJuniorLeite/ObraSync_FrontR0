// import React from "react";
// import { Card } from "../styles/layout";
// import FotoUploader from "./FotoUploader";
// import { nowISO } from "../helpers/time";
// import { getLocation } from "../helpers/location";

// const AtendimentoSteps = ({ atendimento, onUpdate, onFinish }) => {
//   const set = (field, value) =>
//     onUpdate({ ...atendimento, [field]: value });

//   const startDesloc = async () => {
//     const gps = await getLocation();
//     set("deslocamentoInicio", nowISO());
//     set("gpsInicio", gps);
//   };

//   const startAt = async () => {
//     const gps = await getLocation();
//     set("atendimentoInicio", nowISO());
//     set("gpsChegada", gps);
//   };

//   const finish = () => {
//     set("finalizadoEm", nowISO());
//     onFinish();
//   };

//   const addFotos = (f) =>
//     set("fotos", [...(atendimento.fotos || []), ...f]);

//   const removeFoto = (id) =>
//     set(
//       "fotos",
//       (atendimento.fotos || []).filter((x) => x.id !== id)
//     );

//   return (
//     <Card style={{ marginTop: 12 }}>
//       <h3 style={{ color: "#e5f0ff", marginBottom: 10 }}>
//         Fluxo do Atendimento
//       </h3>

//       {!atendimento.deslocamentoInicio && (
//         <button
//           onClick={startDesloc}
//           style={{
//             padding: "10px 12px",
//             width: "100%",
//             background: "#38bdf8",
//             color: "#081018",
//             borderRadius: 10,
//             border: "1px solid #38bdf8",
//           }}
//         >
//           Iniciar deslocamento
//         </button>
//       )}

//       {atendimento.deslocamentoInicio &&
//         !atendimento.atendimentoInicio && (
//           <button
//             onClick={startAt}
//             style={{
//               padding: "10px 12px",
//               width: "100%",
//               background: "#0ea5e9",
//               color: "white",
//               borderRadius: 10,
//               border: "1px solid #0ea5e9",
//               marginTop: 8,
//             }}
//           >
//             Iniciar atendimento
//           </button>
//         )}

//       {atendimento.atendimentoInicio &&
//         !atendimento.finalizadoEm && (
//           <>
//             <FotoUploader
//               fotos={atendimento.fotos || []}
//               onAdd={addFotos}
//               onRemove={removeFoto}
//             />
//             <button
//               onClick={finish}
//               style={{
//                 padding: "10px 12px",
//                 width: "100%",
//                 background: "#14b8a6",
//                 color: "white",
//                 borderRadius: 10,
//                 border: "1px solid #14b8a6",
//                 marginTop: 12,
//               }}
//             >
//               Finalizar atendimento
//             </button>
//           </>
//         )}
//     </Card>
//   );
// };

// export default AtendimentoSteps;

