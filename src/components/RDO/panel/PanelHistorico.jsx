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
}) {
  const { historicoDataFiltro, setHistoricoDataFiltro, setSection } =
    panelState;

  // const { getAll } = useJourneys();
  const { getAll, loading } = useJourneys();

  if (loading) {
    return (
      <div style={{ padding: 12, color: "#94a3b8" }}>
        Carregando jornadas...
      </div>
    );
  }



  // 🔥 Normaliza QUALQUER formato para ISO SEM HORA
  const normalizarData = (j) => {
    const norm = (value) => {
      if (!value) return null;

      // Se já é ISO (2025-12-07 ou 2025-12-07T10:25:00Z)
      if (value.includes("-")) return value;

      // Se vier no formato BR "dd/mm/yyyy" -> converte para ISO sem hora
      if (value.includes("/")) {
        const [dd, mm, yyyy] = value.split(" ")[0].split("/");
        const hora = value.split(" ")[1] || "";
        return `${yyyy}-${mm}-${dd}${hora ? `T${hora}` : ""}`;
      }

      return value;
    };

    return {
      ...j,
      date: norm(j.date),
      inicioExpediente: norm(j.inicioExpediente),
      fimExpediente: norm(j.fimExpediente),
    };
  };


  // 🔥 Sempre gera yyyy-mm-dd
  const toDateKey = (value) => {
    if (!value) return "";

    const base = value.split("T")[0]; // mantém ISO puro YYYY-MM-DD

    // se vier BR
    if (base.includes("/")) {
      const [dd, mm, yyyy] = base.split("/");
      return `${yyyy}-${mm}-${dd}`;
    }

    return base; // ISO
  };


  // 🔥 Converte ISO → BR
  const dataBR = (iso) => {
    if (!iso) return "";
    const [yyyy, mm, dd] = iso.split("-");
    return `${dd}/${mm}/${yyyy}`;
  };

  const parseDate = (j) => {
    const raw = j.inicioExpediente || j.date;

    try {
      return new Date(raw);
    } catch {
      return new Date(0);
    }
  };


  // 🔥 OBRIGATÓRIO: normalizar ANTES de ordenar
  const jornadas = getAll()
    .map(normalizarData)
    .sort((a, b) => parseDate(b) - parseDate(a));

  const filtroISO = toDateKey(historicoDataFiltro);

  const filtradas = jornadas.filter((j) =>
    historicoDataFiltro ? toDateKey(j.date) === filtroISO : true
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

      {filtradas.map((j) => {
        const { atendimentoMs, deslocamentoMs } = calcularTotais(j);
        const jornadaMs = calcularJornadaTotal(j);
        const distKm = (calcularDistanciaTotal(j) / 1000).toFixed(2);

        return (
          <Card key={j.id} style={{ marginTop: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>
              Jornada • {dataBR(j.date)}
            </div>

            {j.sync_status === "pending" && (
              <div style={{ color: "#f59e0b", fontSize: 12 }}>
                ⏳ Não sincronizado
              </div>
            )}

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
                <strong>Jornada:</strong> {msToHuman(jornadaMs)} <br />
                <strong>Atendimento:</strong> {msToHuman(atendimentoMs)} <br />
                <strong>Deslocamento:</strong> {msToHuman(deslocamentoMs)}
              </div>

              <div style={{ fontSize: ".85rem" }}>
                <strong>Distância:</strong> {distKm} km <br />
                <strong>Almoços:</strong> {j.almocos?.length || 0}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <BigBtn
                onClick={() => {
                  panelState.setRdoHistoricoView(j);
                  panelState.setSection("preview_rdo");
                }}
                style={{ flex: 1 }}
              >
                Ver RDO
              </BigBtn>

              <BigBtn
                onClick={() => exportJornadaAsPdf(j)}
                style={{ flex: 1 }}
              >
                Baixar PDF
              </BigBtn>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
