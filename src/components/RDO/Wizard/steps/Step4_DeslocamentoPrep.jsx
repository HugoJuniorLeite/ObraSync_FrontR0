import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Check } from "lucide-react";

export default function Step4_DeslocamentoPrep({
  Field,
  Label,
  Card,
  BigBtn,
  current,
  notaEnviada,
  iniciarDeslocamento,
  next,
  prev,
}) {
  const endereco = current.endereco || {};

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
          Quando iniciar deslocamento, o sistema registrará hora e localização
          automaticamente.
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

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <BigBtn onClick={prev}>
            <ChevronLeft size={18} /> Voltar
          </BigBtn>

          <BigBtn
            $primary
            onClick={() => {
              iniciarDeslocamento();  // registra hora + gps
              next();                 // AVANÇA PARA O STEP 5
            }}
          >
            <Check size={18} /> Iniciar deslocamento
          </BigBtn>

        </div>
      </Field>
    </motion.div>
  );
}
