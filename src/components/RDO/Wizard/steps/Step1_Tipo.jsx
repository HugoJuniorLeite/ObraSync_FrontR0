import React from "react";
import { motion } from "framer-motion";

export default function Step1_Tipo({
  Field,
  Label,
  Card,
  BigBtn,
  next,
  prev,
  updateCurrentField,
}) {
  return (
    <motion.div
      key="s1"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      transition={{ duration: 0.24 }}
    >
      <Field>
        <Label>Tipo de atendimento</Label>

        <div style={{ display: "flex", gap: 8 }}>
          <BigBtn
            style={{ flex: 1 }}
            onClick={() => {
              updateCurrentField("tipo", "externo");
              next();
            }}
          >
            Externo
          </BigBtn>

          <BigBtn
            style={{ flex: 1 }}
            onClick={() => {
              updateCurrentField("tipo", "interno");
              next();
            }}
          >
            Interno
          </BigBtn>
        </div>

        <div style={{ color: "#9fb4c9", marginTop: 8 }}>
          Toque no tipo para iniciar — o próximo passo pede identificação da OS.
        </div>
      </Field>
    </motion.div>
  );
}
