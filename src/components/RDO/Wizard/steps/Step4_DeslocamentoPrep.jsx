import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Check } from "lucide-react";
import { calcularRotaEndereco } from "../../helpers/rotaDestino";

export default function Step4_DeslocamentoPrep({
  Field,
  Label,
  Card,
  BigBtn,
  current,
  notaEnviada,
  updateCurrentField,   // <-- IMPORTANTE
  iniciarDeslocamento,
  next,
  prev,
}) {
  const endereco = current?.endereco || {};
  const [rota, setRota] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadRota() {
      if (!endereco?.rua) return;

      setLoading(true);

      try {
        const r = await calcularRotaEndereco(endereco);
        console.log("📍 ROTA CALCULADA STEP 4:", r);

        // 🔥 Só salva coordenadas do destino se ainda não existe
        if (!endereco.lat && r?.destino?.lat) {
          updateCurrentField("endereco.lat", r.destino.lat);
          updateCurrentField("endereco.lng", r.destino.lng);
        }

        if (r) {
          updateCurrentField("endereco.lat", r.destino.lat);
          updateCurrentField("endereco.lng", r.destino.lng);
          updateCurrentField("rota.geometry", r.geometry);   // 🔥 salva polilinha
        }


        setRota(r);
      } catch (err) {
        console.error("❌ Erro rota Step 4:", err);
        setRota(null);
      } finally {
        setLoading(false);
      }
    }

    loadRota();
  }, [
    endereco.cep,
    endereco.numero
  ]);


  return (
    <motion.div
      key="s4"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      transition={{ duration: 0.24 }}
    >
      <Field>
        <Label>Deslocamento</Label>

        <div style={{ color: "#9fb4c9" }}>
          Quando iniciar o deslocamento, o sistema registrará hora + GPS.
        </div>

        <Card style={{ marginTop: 10 }}>
          <div style={{ fontWeight: 700 }}>Resumo</div>

          <div style={{ color: "#9fb4c9", marginTop: 6 }}>
            Ordem:{" "}
            {notaEnviada
              ? `${current.ordemTipo}-${current.ordemNumero || "—"}`
              : "Não informada"}
            <br />
            Endereço: {endereco.rua || "—"} {endereco.numero || ""} —{" "}
            {endereco.bairro || ""} — {endereco.cidade || ""}
          </div>
        </Card>

        {loading ? (
          <div style={{ marginTop: 20, color: "#9fb4c9", textAlign: "center" }}>
            <div className="loader" />
            Calculando rota...
          </div>
        ) : (
          <>
            <div style={{ color: "#9fb4c9", marginTop: 14 }}>
              Distância real:{" "}
              {rota ? (rota.distancia / 1000).toFixed(2) + " km" : "—"}
            </div>

            <div style={{ color: "#9fb4c9", marginBottom: 14 }}>
              Tempo estimado:{" "}
              {rota ? Math.round(rota.duracao / 60) + " min" : "—"}
            </div>
          </>
        )}

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <BigBtn onClick={prev} disabled={loading}>
            <ChevronLeft size={18} /> Voltar
          </BigBtn>

          <BigBtn
            $primary
            disabled={loading}
            onClick={() => {
              iniciarDeslocamento(); // registra início + GPS do início
              next();
            }}
          >
            <Check size={18} /> Iniciar deslocamento
          </BigBtn>
        </div>
      </Field>

      <style>{`
        .loader {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 3px solid #4ea3ff22;
          border-top-color: #4ea3ff;
          animation: spin .8s linear infinite;
          margin: 0 auto 6px auto;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
}
