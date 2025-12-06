import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Step2_OS({
  Field,
  Label,
  Card,
  BigBtn,
  Input,
  Select,
  next,
  prev,
  current,
  updateCurrentField,
}) {
  return (
    <motion.div
      key="s2"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      transition={{ duration: 0.24 }}
    >
      {/* PERGUNTA SOBRE NOTA */}
      <Field>
        <Label>Número da nota foi enviado?</Label>

        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          {/* BOTÃO SIM */}
          <BigBtn
            style={{
              flex: 1,
              background:
                current.notaEnviada === "sim" ? "#38bdf8" : "#0d2234",
              borderColor:
                current.notaEnviada === "sim" ? "#38bdf8" : "#00396b",
            }}
            onClick={() => {
              updateCurrentField("notaEnviada", "sim");

              if (current.tipo === "interno") {
                updateCurrentField("ordemTipo", "100000");
              }
            }}
          >
            Sim
          </BigBtn>

          {/* BOTÃO NÃO */}
          <BigBtn
            style={{
              flex: 1,
              background:
                current.notaEnviada === "nao" ? "#38bdf8" : "#0d2234",
              borderColor:
                current.notaEnviada === "nao" ? "#38bdf8" : "#00396b",
            }}
            onClick={() => {
              updateCurrentField("notaEnviada", "nao");
              updateCurrentField("ordemTipo", "");
              updateCurrentField("ordemNumero", "");
            }}
          >
            Não
          </BigBtn>
        </div>

        {current.notaEnviada == null && (
          <div style={{ color: "#f87171", marginTop: 6 }}>
            * Obrigatório selecionar uma das opções
          </div>
        )}
      </Field>

      {/* SE SIM, MOSTRAR CAMPOS */}
      {current.notaEnviada === "sim" && (
        <>
          {/* PREFIXO */}
          <Field>
            <Label>Prefixo / Tipo da OS</Label>

            {current.tipo === "interno" ? (
              <Input readOnly value="100000" />
            ) : (
              <Select
                value={current.ordemTipo}
                onChange={(e) => updateCurrentField("ordemTipo", e.target.value)}
                style={{
                  borderColor:
                    current.ordemTipo === "" ? "#f87171" : "#00396b",
                }}
              >
                <option value="">Selecione...</option>
                <option value="3">3</option>
                <option value="7">7</option>
                <option value="100000">100000</option>
              </Select>
            )}

            {current.notaEnviada === "sim" &&
              current.tipo !== "interno" &&
              current.ordemTipo === "" && (
                <div style={{ color: "#f87171", marginTop: 4 }}>
                  * Escolha um prefixo
                </div>
              )}
          </Field>

          {/* NÚMERO DA OS */}
          <Field>
            <Label>Número da OS (6 dígitos)</Label>

            <Input
              inputMode="numeric"
              placeholder="000000"
              value={current.ordemNumero}
              onChange={(e) =>
                updateCurrentField(
                  "ordemNumero",
                  e.target.value.replace(/\D/g, "").slice(0, 6)
                )
              }
              style={{
                borderColor:
                  current.ordemNumero?.length !== 6 ? "#f87171" : "#00396b",
              }}
            />

            {current.ordemNumero?.length !== 6 && (
              <div style={{ color: "#f87171", marginTop: 4 }}>
                * Necessário ter exatamente 6 dígitos
              </div>
            )}
          </Field>
        </>
      )}

      {/* BOTÕES */}
      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <BigBtn onClick={prev}>
          <ChevronLeft size={18} /> Voltar
        </BigBtn>

        <BigBtn
          $primary
          onClick={() => {
            if (!current.notaEnviada) {
              alert("Selecione se a nota foi enviada.");
              return;
            }

            if (current.notaEnviada === "sim") {
              if (current.ordemTipo === "") {
                alert("Escolha o prefixo da OS.");
                return;
              }

              if (!/^\d{6}$/.test(current.ordemNumero)) {
                alert("Número da OS deve ter 6 dígitos.");
                return;
              }
            }

            next();
          }}
        >
          Próximo <ChevronRight size={18} />
        </BigBtn>
      </div>
    </motion.div>
  );
}
