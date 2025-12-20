import React, { useState } from "react";
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
  current,
  distanciaAteBase
}) {
  const [loading, setLoading] = useState(false);

  const ultimoRetorno =
    jornada.baseLogs
      ?.filter(i => i.tipo === "deslocamentoParaBase" && !i.finalizado)
      ?.slice(-1)[0];

  const handleConfirmar = async () => {
    console.log("aqui")
    setLoading(true);

    // Executa o marcarChegadaBase em background
    marcarChegadaBase();

    // Apenas efeito visual (UX)
    setTimeout(() => setLoading(false), 1200);
  };

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

      {!current?.pausadoParaAlmoco && (
        <Field style={{ marginTop: 12 }}>
          <Label>Retorno à base em andamento</Label>

          <Card style={{ padding: 12 }}>
            <div style={{ fontWeight: 700 }}>Retorno à base</div>

            <div style={{ color: "#9fb4c9", marginTop: 8 }}>
              Deslocamento iniciado em: {fmt(ultimoRetorno?.time)} <br />
              Distância estimada até a base:{" "}
              {distanciaAteBase
                ? distanciaAteBase()
                  ? (distanciaAteBase() / 1000).toFixed(2) + " km"
                  : "—"
                : "—"}
            </div>
          </Card>

          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <BigBtn
              $primary
              onClick={handleConfirmar}
              style={{
                flex: 1,
                opacity: loading ? 0.6 : 1,
                pointerEvents: loading ? "none" : "auto",
              }}
            >
              {loading ? "Confirmando..." : "Confirmar chegada"}
              <ChevronRight size={18} />
            </BigBtn>

            <BigBtn onClick={abrirInterromperRetorno} style={{ flex: 1 }}>
              Interromper retorno
            </BigBtn>
          </div>
        </Field>
      )}
    </motion.div>
  );
}
