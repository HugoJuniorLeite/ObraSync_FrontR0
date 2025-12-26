import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function Step0_IniciarJornada({
  Field,
  Label,
  Card,
  BigBtn,
  iniciarJornada,
  loadingJornada,
}) {
  return (
    <motion.div
      key="s0"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Field>
        <Label>Jornada de Trabalho</Label>

        <Card>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>
            Você ainda não iniciou a jornada.
          </div>

          <div style={{ color: "#9fb4c9", marginBottom: 10 }}>
            Ao iniciar a jornada, o sistema registrará data, hora e localização.
          </div>

          <BigBtn $primary onClick={iniciarJornada}   disabled={loadingJornada}
>
            <Check size={18} />   {loadingJornada ? "Iniciando..." : "Iniciar Jornada"}

          </BigBtn>
        </Card>
      </Field>
    </motion.div>
  );
}
