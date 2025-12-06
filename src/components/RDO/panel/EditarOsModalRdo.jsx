import React, { useState } from "react";
import { Label, Input, BigBtn } from "../styles/layout";

export default function EditarOsModalRdo({ atendimento, onSave, onClose }) {
  if (!atendimento) return null;

  const [form, setForm] = useState({
    // tipo interno/externo – se não vier do atendimento, assume externo
    tipo: atendimento.tipo || "externo",
    prefixo: atendimento.ordemTipo || "",
    numero: atendimento.ordemNumero || "",
  });

  const isInterno = form.tipo === "interno";
  const isExterno = form.tipo === "externo";

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // mesma lógica de validação do monolito
    if (isExterno && (!form.prefixo || !/^\d{6}$/.test(form.numero))) {
      alert("Informe o prefixo e um número com 6 dígitos.");
      return;
    }

    if (isInterno && !/^\d{6}$/.test(form.numero)) {
      alert("O número da OS deve ter 6 dígitos.");
      return;
    }

    const atualizado = {
      ...atendimento,
      tipo: form.tipo,
      ordemTipo: isInterno ? "100000" : form.prefixo,
      ordemNumero: form.numero,
      notaEnviada: "sim",
    };

    onSave(atualizado);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#ffffff",
          padding: 24,
          borderRadius: 14,
          width: "95%",
          maxWidth: 520,
          boxShadow: "0 18px 40px rgba(15,23,42,0.35)",
        }}
      >
        <h3 style={{ margin: 0, marginBottom: 16 }}>Editar OS</h3>


        {/* CARD DE PREFIXO + NÚMERO (layout do monolito) */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            padding: 20,
            borderRadius: 14,
            boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {/* GRID CAMPOS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            {/* PREFIXO / TIPO */}
            <div>
              <Label>Prefixo / Tipo da OS</Label>

              {/* INTERNO → PREFIXO FIXO */}
              {isInterno && (
                <Input
                  readOnly
                  value="100000"
                  style={{
                    marginTop: 6,
                    background: "#e2e8f0",
                    color: "#0f172a",
                    cursor: "not-allowed",
                  }}
                />
              )}

              {/* EXTERNO → SELECT 3 / 7 / 100000 */}
              {isExterno && (
                <>
                  <select
                    value={form.prefixo}
                    onChange={(e) => update("prefixo", e.target.value)}
                    style={{
                      marginTop: 6,
                      width: "100%",
                      padding: "10px 12px",
                      background: "#f8fafc",
                      border: "1px solid #cbd5e1",
                      borderRadius: 8,
                      color: "#0f172a",
                    }}
                  >
                    <option value="">Selecione...</option>
                    <option value="3">3</option>
                    <option value="7">7</option>
                    <option value="100000">100000</option>
                  </select>

                  {form.prefixo === "" && (
                    <div style={{ color: "#f87171", marginTop: 4 }}>
                      * Escolha um prefixo
                    </div>
                  )}
                </>
              )}
            </div>

            {/* NÚMERO (6 dígitos) */}
            <div>
              <Label>Número (6 dígitos)</Label>
              <Input
                inputMode="numeric"
                value={form.numero}
                onChange={(e) =>
                  update(
                    "numero",
                    e.target.value.replace(/\D/g, "").slice(0, 6)
                  )
                }
                style={{
                  marginTop: 6,
                  background: "#f8fafc",
                  color: "#0f172a",
                }}
              />
            </div>
          </div>

          {/* BOTÕES IGUAIS AO MONOLITO */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              marginTop: 10,
            }}
          >
            <BigBtn onClick={onClose} style={{ flex: 1 }}>
              Cancelar
            </BigBtn>

            <BigBtn $primary onClick={handleSave} style={{ flex: 1 }}>
              Salvar OS
            </BigBtn>
          </div>
        </div>
      </div>
    </div>
  );
}
