// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { ChevronLeft, Check } from "lucide-react";
// import { calcularRotaEndereco } from "../../helpers/rotaDestino";
// import { geocodeEndereco } from "../../helpers/distanciaDestino";

// export default function Step4_DeslocamentoPrep({
//   Field,
//   Label,
//   Card,
//   BigBtn,
//   current,
//   updateCurrentField,   // <-- IMPORTANTE
//   iniciarDeslocamento,
//   next,
//   prev,
// }) {
//   const endereco = current?.endereco || {};
//   const [rota, setRota] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // useEffect(() => {
//   //   async function loadRota() {
//   //     if (!endereco?.rua) return;

//   //     setLoading(true);

//   //     try {
//   //       const r = await calcularRotaEndereco(endereco);
//   //       console.log("📍 ROTA CALCULADA STEP 4:", r);

//   //       // 🔥 Só salva coordenadas do destino se ainda não existe
//   //       if (!endereco.lat && r?.destino?.lat) {
//   //         updateCurrentField("endereco.lat", r.destino.lat);
//   //         updateCurrentField("endereco.lng", r.destino.lng);
//   //       }

//   //       if (r) {
//   //         updateCurrentField("endereco.lat", r.destino.lat);
//   //         updateCurrentField("endereco.lng", r.destino.lng);
//   //         updateCurrentField("rota.geometry", r.geometry);   // 🔥 salva polilinha
//   //       }


//   //       setRota(r);
//   //     } catch (err) {
//   //       console.error("❌ Erro rota Step 4:", err);
//   //       setRota(null);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   }

//   //   loadRota();
//   // }, [
//   //   endereco.cep,
//   //   endereco.numero
//   // ]);

//   useEffect(() => {
//   async function resolveDestino() {
//     if (!endereco?.rua) return;

//     const destino = await geocodeEndereco(endereco);

//     if (destino && !endereco.lat) {
//       updateCurrentField("endereco.lat", destino.lat);
//       updateCurrentField("endereco.lng", destino.lng);
//     }
//   }

//   resolveDestino();
// }, [endereco.cep, endereco.numero]);


//   console.log("Resumo Step 4:", {
//     notaEnviada: current.notaEnviada,
//     ordemTipo: current.ordemTipo,
//     ordemNumero: current.ordemNumero,
//   });

//   return (
//     <motion.div
//       key="s4"
//       initial={{ x: 20, opacity: 0 }}
//       animate={{ x: 0, opacity: 1 }}
//       exit={{ x: -20, opacity: 0 }}
//       transition={{ duration: 0.24 }}
//     >
//       <Field>
//         <Label>Deslocamento</Label>

//         <div style={{ color: "#9fb4c9" }}>
//           Quando iniciar o deslocamento, o sistema registrará hora + GPS.
//         </div>

//         <Card style={{ marginTop: 10 }}>
//           <div style={{ fontWeight: 700 }}>Resumo</div>

//           <div style={{ color: "#9fb4c9", marginTop: 6 }}>
//             Ordem:{" "}
//             {current.notaEnviada === "sim"
//               ? `${current.ordemTipo}-${current.ordemNumero || "—"}`
//               : "Não informada"}
//             <br />
//             Endereço: {endereco.rua || "—"} {endereco.numero || ""} —{" "}
//             {endereco.bairro || ""} — {endereco.cidade || ""}
//           </div>
//         </Card>

//         {loading ? (
//           <div style={{ marginTop: 20, color: "#9fb4c9", textAlign: "center" }}>
//             <div className="loader" />
//             Calculando rota...
//           </div>
//         ) : (
//           <>
//             <div style={{ color: "#9fb4c9", marginTop: 14 }}>
//               Distância real:{" "}
//               {rota ? (rota.distancia / 1000).toFixed(2) + " km" : "—"}
//             </div>

//             <div style={{ color: "#9fb4c9", marginBottom: 14 }}>
//               Tempo estimado:{" "}
//               {rota ? Math.round(rota.duracao / 60) + " min" : "—"}
//             </div>
//           </>
//         )}

//         <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
//           <BigBtn onClick={prev} disabled={loading}>
//             <ChevronLeft size={18} /> Voltar
//           </BigBtn>

//           {/* <BigBtn
//             $primary
//             disabled={loading}
//             onClick={() => {
//               iniciarDeslocamento(); // registra início + GPS do início
//               next();
//             }}
//           >
//             <Check size={18} /> Iniciar deslocamento
//           </BigBtn> */}

//           <BigBtn
//             $primary
//             disabled={loading}
//             onClick={async () => {
//               setLoading(true);

//               try {
//                 const r = await calcularRotaEndereco(endereco);
//                 console.log("📍 ROTA FINAL:", r);

//                 if (r) {
//                   updateCurrentField("endereco.lat", r.destino.lat);
//                   updateCurrentField("endereco.lng", r.destino.lng);
//                   updateCurrentField("rota.geometry", r.geometry);
//                   setRota(r);
//                 }

//                 iniciarDeslocamento(); // registra início + GPS
//                 next();
//               } catch (e) {
//                 console.error("Erro ao iniciar deslocamento:", e);
//               } finally {
//                 setLoading(false);
//               }
//             }}
//           >
//             <Check size={18} /> Iniciar deslocamento
//           </BigBtn>

//         </div>
//       </Field>

//       <style>{`
//         .loader {
//           width: 22px;
//           height: 22px;
//           border-radius: 50%;
//           border: 3px solid #4ea3ff22;
//           border-top-color: #4ea3ff;
//           animation: spin .8s linear infinite;
//           margin: 0 auto 6px auto;
//         }
//         @keyframes spin {
//           to { transform: rotate(360deg); }
//         }
//       `}</style>
//     </motion.div>
//   );
// }


import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Check } from "lucide-react";
import { calcularRotaEndereco } from "../../helpers/rotaDestino";



function hashEndereco(endereco) {
  return [
    endereco.cep,
    endereco.rua,
    endereco.numero,
    endereco.bairro,
    endereco.cidade,
    endereco.estado,
  ]
    .filter(Boolean)
    .join("|")
    .toLowerCase();
}

export default function Step4_DeslocamentoPrep({
  Field,
  Label,
  Card,
  BigBtn,
  current,
  updateCurrentField,
  iniciarDeslocamento,
  next,
  prev,
}) {
  const endereco = current?.endereco || {};
  const rotaSalva = current?.rota || null;

  const [rota, setRota] = useState(rotaSalva);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadRota() {
      // ❌ endereço incompleto
      if (!endereco?.rua || !endereco?.numero || !endereco?.cidade) return;

      const enderecoAtualHash = hashEndereco(endereco);

      // ✅ rota válida e endereço não mudou → NÃO recalcula
      if (
        rotaSalva?.distancia &&
        rotaSalva?.enderecoHash === enderecoAtualHash
      ) {
        setRota(rotaSalva);
        return;
      }

      setLoading(true);

      try {
        const r = await calcularRotaEndereco(endereco);
        if (!r || !active) return;

        const novaRota = {
          distancia: r.distancia,
          duracao: r.duracao,
          polyline: r.polyline,
          enderecoHash: enderecoAtualHash,
        };

        setRota(novaRota);

        updateCurrentField("endereco.lat", r.destino.lat);
        updateCurrentField("endereco.lng", r.destino.lng);
        updateCurrentField("rota", novaRota);
      } catch (e) {
        console.error("Erro ao calcular rota:", e);
      } finally {
        active && setLoading(false);
      }
    }

    loadRota();
    return () => (active = false);
  }, [
    endereco.cep,
    endereco.rua,
    endereco.numero,
    endereco.bairro,
    endereco.cidade,
    endereco.estado,
  ]);

  return (
    <motion.div
      key="s4"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
    >
      <Field>
        <Label>Deslocamento</Label>

        <Card style={{ marginTop: 10 }}>
          <div style={{ fontWeight: 700 }}>Resumo</div>
          <div style={{ color: "#9fb4c9", marginTop: 6 }}>
            Endereço: {endereco.rua} {endereco.numero} —{" "}
            {endereco.bairro} — {endereco.cidade}
          </div>
        </Card>

        <div style={{ marginTop: 12, color: "#9fb4c9" }}>
          Distância:{" "}
          {rota ? (rota.distancia / 1000).toFixed(2) + " km" : "—"}
          <br />
          Tempo: {rota ? Math.round(rota.duracao / 60) + " min" : "—"}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <BigBtn onClick={prev} disabled={loading}>
            <ChevronLeft size={18} /> Voltar
          </BigBtn>

          <BigBtn
            $primary
            disabled={loading || !rota}
            onClick={() => {
              iniciarDeslocamento();
              next();
            }}
          >
            <Check size={18} /> Iniciar deslocamento
          </BigBtn>
        </div>
      </Field>
    </motion.div>
  );
}
