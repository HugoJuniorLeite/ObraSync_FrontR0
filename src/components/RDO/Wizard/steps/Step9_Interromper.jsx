import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Step9_Interromper({
  Field,
  Label,
  Card,
  BigBtn,
  interromperReasonText,
  setInterromperReasonText,
  confirmarInterromperRetorno,
  updateCurrentField,
  setStep
}) {
  const [erro, setErro] = useState("");

  const handleConfirmar = () => {
    console.log("INTERROMPERASONTEXT", interromperReasonText)
    // validação obrigatória
    if (!interromperReasonText || interromperReasonText.trim() === "") {
      setErro("Por favor, descreva o motivo da interrupção.");
      return;
    }

    setErro("");
    updateCurrentField("tipo", "externo");

    confirmarInterromperRetorno(interromperReasonText); // executa função
    // setStep(2); // volta para Step 1 conforme solicitado
  };

  return (
    <motion.div
      key="s10"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      transition={{ duration: 0.24 }}
    >
      <Field>
        <Label>Motivo da interrupção do retorno</Label>

        <Card>
          <textarea
            value={interromperReasonText}
            onChange={(e) => {
              setInterromperReasonText(e.target.value);
              if (erro) setErro(""); // limpa erro ao digitar
            }}
            placeholder="Descreva o motivo..."
            style={{
              width: "100%",
              minHeight: 100,
              background: "#071827",
              color: "#e5f0ff",
              border: "1px solid #00396b",
              padding: 8,
              borderRadius: 8,
              marginTop: 8,
            }}
          />

          {/* ERRO */}
          {erro && (
            <div style={{ color: "#f87171", marginTop: 8 }}>
              {erro}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>

            {/* CANCELAR */}
            <BigBtn
              onClick={() => {
                    setInterromperReasonText(""); // limpa o texto
                setStep(8); // volta para step anterior
              }}
              style={{ width: "100%" }}
            >
              Cancelar
            </BigBtn>

            {/* CONFIRMAR */}
            <BigBtn
              $primary
              onClick={handleConfirmar}
              style={{ width: "100%" }}
            >
              Confirmar e abrir novo chamado
            </BigBtn>
          </div>
        </Card>
      </Field>
    </motion.div>
  );
}
