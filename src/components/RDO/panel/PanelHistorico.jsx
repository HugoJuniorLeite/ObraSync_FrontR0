import React from "react";
import { Card, Field, Label, Input, BigBtn } from "../styles/layout";
import { useJourneys } from "./useJourneys";

export default function PanelHistorico({
  panelState,
  calcularTotais,
  calcularJornadaTotal,
  calcularDistanciaTotal,
  fmt,
  msToHuman,
  exportJornadaAsPdf,
  setRdoHistoricoView,
}) {
  const {
    historicoDataFiltro,
    setHistoricoDataFiltro,
    setSection,
  } = panelState;

  const { getAll } = useJourneys();

  const jornadas = getAll().sort((a, b) => {
    const da = new Date(a.inicioExpediente || a.date);
    const db = new Date(b.inicioExpediente || b.date);
    return db - da;
  });

  const filtradas = jornadas.filter((j) =>
    historicoDataFiltro ? j.date === historicoDataFiltro : true
  );

  return (
    <div style={{ padding: 12 }}>
      <BigBtn
        onClick={() => setSection("home")}
        style={{
          background: "#020617",
          borderColor: "#1e293b",
          color: "#e5e7eb",
          marginBottom: 10,
        }}
      >
        Voltar
      </BigBtn>

      <h3 style={{ color: "#f59e0b", marginBottom: 12 }}>
        Meus atendimentos
      </h3>

      <Field>
        <Label>Filtrar por data</Label>
        <Input
          type="date"
          value={historicoDataFiltro || ""}
          onChange={(e) => setHistoricoDataFiltro(e.target.value)}
        />
      </Field>

      {filtradas.length === 0 && (
        <div style={{ color: "#94a3b8", marginTop: 8 }}>
          Nenhuma jornada encontrada.
        </div>
      )}

      {filtradas.map((j, idx) => {
        const { atendimentoMs, deslocamentoMs } = calcularTotais(j);
        const jornadaMs = calcularJornadaTotal(j);
        const distKm = (calcularDistanciaTotal(j) / 1000).toFixed(2);

        return (
          <Card key={j.id || idx} style={{ marginTop: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>
              Jornada • {j.date}
            </div>

            <div style={{ color: "#9fb4c9", fontSize: ".85rem" }}>
              Início: {fmt(j.inicioExpediente)} <br />
              Fim: {fmt(j.fimExpediente)} <br />
              Atendimentos: {j.atendimentos?.length || 0}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                marginTop: 10,
              }}
            >
              <div style={{ fontSize: ".85rem" }}>
                <strong>Jornada:</strong> {msToHuman(jornadaMs)}<br />
                <strong>Atendimento:</strong> {msToHuman(atendimentoMs)}<br />
                <strong>Deslocamento:</strong> {msToHuman(deslocamentoMs)}
              </div>

              <div style={{ fontSize: ".85rem" }}>
                <strong>Distância:</strong> {distKm} km<br />
                <strong>Almoços:</strong> {j.almocos?.length || 0}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <BigBtn onClick={() => {
                panelState.setRdoHistoricoView(j)
                panelState.setSection("preview_rdo");
              }} style={{ flex: 1 }}>
                Ver RDO
              </BigBtn>

              <BigBtn onClick={() => exportJornadaAsPdf(j)} style={{ flex: 1 }}>
                Baixar PDF
              </BigBtn>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
