// src/components/RDO/panel/RdoHistoricoPreview.jsx

import React, { useState } from "react";
import { motion } from "framer-motion";
import { fmt } from "../helpers/time";
import { calcularDistanciaTotal } from "../helpers/distance";
import EditarOsModal from "./EditarOsModalRdo";
import { updateLocalJourney } from "../../../utils/journeyStore";

export default function RdoHistoricoPreview({
  panelState,
  jornada,
  exportJornadaAsPdf,
}) {
  // ⬇️ COLOQUE AQUI
  console.log("🔥 DEBUG_JORNADA:", jornada);
  console.log("🔥 DEBUG_ATENDIMENTOS:", jornada?.atendimentos);

  const { setSection, setRdoHistoricoView } = panelState;
  const [theme, setTheme] = useState("dark"); // "dark" | "light"
  const [editarOs, setEditarOs] = useState(null);

  if (!jornada) {
    return (
      <div style={{ padding: 16 }}>
        <button
          onClick={() => setSection("historico")}
          style={{
            marginBottom: 12,
            padding: "8px 14px",
            borderRadius: 8,
            border: "none",
            background: "#0f172a",
            color: "#e5e7eb",
            cursor: "pointer",
          }}
        >
          Voltar
        </button>
        <div>Nenhuma jornada selecionada.</div>
      </div>
    );
  }

  const distanceKm = (calcularDistanciaTotal(jornada) || 0 / 1000).toFixed(2);
  const totalAtend = jornada.atendimentos?.length || 0;

  const handleClose = () => {
    setSection("historico");
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleExportPdf = () => {
    if (exportJornadaAsPdf) {
      exportJornadaAsPdf(jornada);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveOs = (attAtualizado) => {
    const novaJornada = { ...jornada };
    const idx = novaJornada.atendimentos.findIndex(
      (a) => a.id === attAtualizado.id
    );

    if (idx !== -1) {
      novaJornada.atendimentos[idx] = attAtualizado;
    }

    // Atualiza no localStorage (mesmo padrão do monolito)
    // const KEY = "obra_sync_jornadas";
    // const todas = JSON.parse(localStorage.getItem(KEY)) || [];
    // const jIndex = todas.findIndex((j) => j.id === novaJornada.id);
    // if (jIndex !== -1) {
    //   todas[jIndex] = novaJornada;
    //   localStorage.setItem(KEY, JSON.stringify(todas));

    // }

      // ✅ atualização centralizada
  updateLocalJourney(novaJornada.id, {
    atendimentos: novaJornada.atendimentos,
  });

    setRdoHistoricoView(novaJornada);
    setEditarOs(null);
  };

  const isDark = theme === "dark";

  const bg = isDark ? "#020617" : "#f9fafb";
  const cardBg = isDark ? "#02081a" : "#ffffff";
  const textPrimary = isDark ? "#e5e7eb" : "#0f172a";
  const textSecondary = isDark ? "#9ca3af" : "#4b5563";
  const borderColor = isDark ? "#1f2937" : "#e5e7eb";

  return (
    <>
      {editarOs && (
        <EditarOsModal
          atendimento={editarOs}
          onSave={handleSaveOs}
          onClose={() => setEditarOs(null)}
        />
      )}

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          padding: 24,
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          background: "transparent",
        }}
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            width: "100%",
            maxWidth: 720,
            borderRadius: 16,
            padding: 24,
            boxSizing: "border-box",
            background: bg,
            boxShadow:
              "0 24px 60px rgba(15,23,42,0.6), 0 0 0 1px rgba(15,23,42,0.9)",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 16,
            }}
          >
            <button
              onClick={handleToggleTheme}
              style={{
                padding: "6px 14px",
                borderRadius: 999,
                border: "none",
                background: "#0f4c81",
                color: "#e5e7eb",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Tema: {isDark ? "Escuro" : "Claro"}
            </button>

            <button
              onClick={handleClose}
              style={{
                border: "none",
                background: "transparent",
                color: textSecondary,
                fontSize: 18,
                cursor: "pointer",
              }}
              aria-label="Fechar"
            >
              ✕
            </button>
          </div>

          <div style={{ marginBottom: 8, color: textSecondary, fontSize: 14 }}>
            Visualização detalhada da jornada e atendimentos.
          </div>

          <h2
            style={{
              margin: 0,
              marginBottom: 16,
              fontSize: 22,
              fontWeight: 700,
              color: textPrimary,
            }}
          >
            RDO — {jornada.date}
          </h2>

          {/* Ações */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            <button
              onClick={handleExportPdf}
              style={{
                padding: "8px 16px",
                borderRadius: 999,
                border: "none",
                background: "#0b4f8a",
                color: "#f9fafb",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              Exportar PDF
            </button>

            <button
              onClick={handlePrint}
              style={{
                padding: "8px 16px",
                borderRadius: 999,
                border: "none",
                background: "#0b4f8a",
                color: "#f9fafb",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              Imprimir
            </button>
          </div>

          {/* Informações do expediente */}
          <div
            style={{
              background: cardBg,
              borderRadius: 12,
              padding: 16,
              border: `1px solid ${borderColor}`,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                marginBottom: 8,
                fontWeight: 600,
                color: isDark ? "#38bdf8" : "#0f4c81",
              }}
            >
              Informações do expediente
            </div>

            <div style={{ fontSize: 14, color: textPrimary }}>
              <strong>Data:</strong> {jornada.date}
              <br />
              <strong>Início:</strong> {fmt(jornada.inicioExpediente)}
              <br />
              <strong>Fim:</strong> {fmt(jornada.fimExpediente)}
              <br />
              <strong>Total de atendimentos:</strong> {totalAtend}
              <br />
              <strong>Distância total:</strong> {distanceKm} km
            </div>
          </div>

          {/* Atendimentos */}
          <div style={{ marginBottom: 8, color: textPrimary, fontWeight: 600 }}>
            Atendimentos
          </div>

          {totalAtend === 0 && (
            <div style={{ color: textSecondary, fontSize: 14 }}>
              Nenhum atendimento registrado nesta jornada.
            </div>
          )}

          {jornada.atendimentos?.map((att) => (
            <div
              key={att.id}
              style={{
                background: cardBg,
                borderRadius: 12,
                padding: 16,
                border: `1px solid ${borderColor}`,
                marginBottom: 12,
                fontSize: 14,
                color: textPrimary,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <div style={{ fontWeight: 600 }}>
                  Serviço: {att.tipo || "—"}
                  <br />
                  <span style={{ fontWeight: 400 }}>
                    Nota{" "}
                    {att.ordemNumero
                      ? `${att.ordemTipo || ""}-${att.ordemNumero}`
                      : "não informada"}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: textSecondary,
                    textAlign: "right",
                  }}
                >
                  {/* ID: {att.id?.slice(0, 6) || "—"} */}
                    ID: {String(att.id).slice(0, 6)}

                </div>
              </div>

              <div style={{ marginBottom: 6 }}>
                <strong>Início:</strong> {fmt(att.atendimentoInicio)}
                <br />
                <strong>Fim:</strong> {fmt(att.finalizadoEm)}
              </div>

              <div style={{ marginBottom: 8 }}>
                <strong>Endereço:</strong>{" "}
                {att.endereco?.rua || "—"} {att.endereco?.numero || ""}{" "}
                {att.endereco?.bairro
                  ? `- ${att.endereco?.bairro}`
                  : ""}{" "}
                {att.endereco?.cidade ? `- ${att.endereco?.cidade}` : ""}
              </div>

              <button
                onClick={() => setEditarOs(att)}
                style={{
                  marginTop: 4,
                  padding: "6px 14px",
                  borderRadius: 999,
                  border: "none",
                  background: "#0b4f8a",
                  color: "#f9fafb",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                Editar OS
              </button>
            </div>
          ))}
        </motion.div>
      </div>
    </>
  );
}
