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
  atendimento,
  onIniciarRetornoBase,
  startNewAtendimento,
  next,
  prev,
}) {

  console.log(atendimento, "ATENDIMENTOOOOOO")
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
            <div>Início: {fmt(atendimento?.atendimentoInicio)}</div>
            <div>Fim: {fmt(atendimento?.finalizadoEm)}</div>

            <div style={{ marginTop: 6 }}>
              GPS Início:{" "}
              {atendimento?.gpsInicio?.lat || "—"},{" "}
              {atendimento?.gpsInicio?.lng || "—"}
            </div>

            <div>
              GPS Chegada:{" "}
              {atendimento?.gpsChegada?.lat || "—"},{" "}
              {atendimento?.gpsChegada?.lng || "—"}
            </div>
          </div>
        </Card>

        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          {/* BOTÃO RETORNAR BASE */}
          <BigBtn
            $primary
            onClick={() => {
              onIniciarRetornoBase();
              next(); // vai para o Step 8
            }}
          >
            Retornar à base <ChevronRight size={18} />
          </BigBtn>

          {/* BOTÃO NOVO ATENDIMENTO */}
          <BigBtn
            onClick={() => {
              startNewAtendimento(2);
            }}
          >
            <Plus size={16} /> Novo atendimento
          </BigBtn>
        </div>
      </Field>
    </motion.div>
  );
}