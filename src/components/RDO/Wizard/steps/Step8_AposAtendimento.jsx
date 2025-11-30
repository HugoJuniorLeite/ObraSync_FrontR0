import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, Plus } from "lucide-react";

export default function Step8_AposAtendimento({
  Field,
  Label,
  Card,
  BigBtn,
  current,
  fmt,
  onIniciarRetornoBase,     // ← CORRETO
  startNewAtendimento,
  next,
}) {
  return (
    <motion.div
      key="s8"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      transition={{ duration: 0.24 }}
    >
      <Field>
        <Label>O que deseja fazer agora?</Label>

        <Card style={{ padding: 12, marginTop: 8 }}>
          <div style={{ color: "#9fb4c9" }}>
            Início: {fmt(current.atendimentoInicio)} <br />
            Fim: {fmt(current.finalizadoEm)} <br />
            GPS Início: {current.gpsInicio?.lat || "—"},{" "}
            {current.gpsInicio?.lng || "—"} <br />
            GPS Chegada: {current.gpsChegada?.lat || "—"},{" "}
            {current.gpsChegada?.lng || "—"}
          </div>
        </Card>

        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          
          {/* RETORNAR À BASE */}
          <BigBtn
            $primary
            onClick={() => {
              onIniciarRetornoBase(); // ← FUNÇÃO CORRETA
              next();                 // Step 9
            }}
            style={{ flex: 1 }}
          >
            Retornar à base <ChevronRight size={18} />
          </BigBtn>

          {/* NOVO ATENDIMENTO */}
          <BigBtn
            onClick={() => {
              startNewAtendimento();
              next(); // volta para Step 1
            }}
            style={{ flex: 1 }}
          >
            <Plus size={16} /> Novo atendimento
          </BigBtn>
        </div>
      </Field>
    </motion.div>
  );
}
