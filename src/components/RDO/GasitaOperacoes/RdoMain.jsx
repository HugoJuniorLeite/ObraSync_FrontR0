// src/components/RDO/GasitaOperacoes/RdoMain.jsx
import React, { createContext, useContext, useReducer, useEffect, useMemo, useState } from "react";
import { ThemeProvider } from "styled-components";
import { theme } from "./styles/theme";
import * as L from "./styles/layout";

import AtendimentoForm from "./atendimento/AtendimentoForm";
import AtendimentoList from "./atendimento/AtendimentoList";
import AlmocoModule from "./almoco/AlmocoModule";
import BaseModule from "./base/BaseModule";
import JourneyMap from "./mapa/JourneyMap";
import Timeline from "./timeline/Timeline";
import RdoPreview from "./preview/RdoPreview";
import Dashboard from "./dashboard/Dashboard";

import { uid } from "./helpers/uuid";
import { nowISO, msToHuman, calcDurationMs } from "./helpers/time";
import { getLocation } from "./helpers/location";
import { calcularDistanciaTotal } from "./helpers/distance";
import { exportJornadaToExcel } from "./export/exportExcel"; // optional if present

// Context & hook
const RdoContext = createContext(null);
export const useRdo = () => useContext(RdoContext);

// initial state
const initialState = {
  jornada: {
    date: new Date().toISOString().slice(0, 10),
    inicioExpediente: "",
    fimExpediente: "",
    expedienteGps: null,
    expedienteGpsFim: null,
    technician: "",
    almoco: { inicio: "", fim: "", latInicio: "", lngInicio: "", latFim: "", lngFim: "", justificativa: "" },
    atendimentos: [],
    baseLogs: []
  },
  mode: "idle", // idle | preenchendo | deslocando | emAtendimento | finalizado | retornoDeslocamento
  currentIdx: null
};

// reducer
function reducer(state, action) {
  switch (action.type) {
    case "LOAD":
      return { ...state, jornada: action.payload };
    case "SET_FIELD":
      return { ...state, jornada: { ...state.jornada, [action.field]: action.value } };
    case "SET_MODE":
      return { ...state, mode: action.mode };
    case "SET_IDX":
      return { ...state, currentIdx: action.idx };
    case "PUSH_ATEND": {
      const next = { ...state.jornada, atendimentos: [...state.jornada.atendimentos, action.payload] };
      return { ...state, jornada: next, currentIdx: next.atendimentos.length - 1, mode: "preenchendo" };
    }
    case "UPDATE_ATEND": {
      const arr = state.jornada.atendimentos.slice();
      arr[action.idx] = { ...arr[action.idx], ...action.payload };
      return { ...state, jornada: { ...state.jornada, atendimentos: arr } };
    }
    case "REMOVE_ATEND": {
      const arr = state.jornada.atendimentos.filter((_, i) => i !== action.idx);
      return { ...state, jornada: { ...state.jornada, atendimentos: arr }, currentIdx: null };
    }
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

// Helper: create atendimento default
const createAtendimento = (tipo = "externo") => ({
  id: uid(),
  tipo,
  ordemTipo: tipo === "externo" ? "3" : "100000",
  ordemPrefixo: "100000",
  ordemNumero: "",
  endereco: { cep: "", rua: "", numero: "", bairro: "", cidade: "", estado: "" },
  deslocamentoInicio: "",
  atendimentoInicio: "",
  finalizadoEm: "",
  gpsInicio: {},
  gpsChegada: {},
  fotos: [],
  notas: ""
});

export default function RdoMain() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // UI tabs: 'atendimentos' | 'mapa' | 'dashboard' | 'preview' | 'timeline'
  const [tab, setTab] = useState("atendimentos");

  // load draft
  useEffect(() => {
    try {
      const raw = localStorage.getItem("rdo_draft_v2");
      if (raw) dispatch({ type: "LOAD", payload: JSON.parse(raw) });
    } catch (e) {}
     
  }, []);

  // persist draft
  useEffect(() => {
    localStorage.setItem("rdo_draft_v2", JSON.stringify(state.jornada));
  }, [state.jornada]);

  // Handlers: expediente
  const iniciarExpediente = async () => {
    const loc = await getLocation();
    dispatch({ type: "SET_FIELD", field: "inicioExpediente", value: nowISO() });
    dispatch({ type: "SET_FIELD", field: "expedienteGps", value: loc });
  };

  const finalizarExpediente = async () => {
    const loc = await getLocation();
    dispatch({ type: "SET_FIELD", field: "fimExpediente", value: nowISO() });
    dispatch({ type: "SET_FIELD", field: "expedienteGpsFim", value: loc });
    // ao finalizar expediente abrimos preview para assinatura
    setTab("preview");
  };

  // Atendimentos quick actions
  const novoAtendimento = (tipo = "externo") => dispatch({ type: "PUSH_ATEND", payload: createAtendimento(tipo) });
  const removerAtendimento = (idx) => dispatch({ type: "REMOVE_ATEND", idx });
  const editarAtendimento = (idx) => dispatch({ type: "SET_IDX", idx });

  // Retorno à base helpers (simplificados)
  const iniciarDeslocamentoParaBase = async () => {
    const loc = await getLocation();
    const log = { id: uid(), tipo: "deslocamentoParaBase", time: nowISO(), gps: loc };
    dispatch({ type: "SET_FIELD", field: "baseLogs", value: [...(state.jornada.baseLogs || []), log] });
    dispatch({ type: "SET_MODE", mode: "retornoDeslocamento" });
  };
  const marcarChegadaBase = async () => {
    const loc = await getLocation();
    const log = { id: uid(), tipo: "chegadaBase", time: nowISO(), gps: loc };
    dispatch({ type: "SET_FIELD", field: "baseLogs", value: [...(state.jornada.baseLogs || []), log] });
    dispatch({ type: "SET_MODE", mode: "idle" });
    dispatch({ type: "SET_IDX", idx: null });
  };

  // Totals & timeline
  const totals = useMemo(() => {
    let atendimentoMs = 0;
    let deslocamentoMs = 0;
    (state.jornada.atendimentos || []).forEach((a, idx) => {
      atendimentoMs += calcDurationMs(a.atendimentoInicio, a.finalizadoEm);
      deslocamentoMs += calcDurationMs(a.deslocamentoInicio, a.atendimentoInicio);
      const next = state.jornada.atendimentos?.[idx + 1];
      if (next) deslocamentoMs += calcDurationMs(a.finalizadoEm, next.deslocamentoInicio);
    });
    // base logs pair-wise
    for (let i = 0; i < (state.jornada.baseLogs || []).length; i += 2) {
      const ini = state.jornada.baseLogs[i];
      const fim = state.jornada.baseLogs[i + 1];
      if (ini && fim && ini.tipo === "deslocamentoParaBase" && fim.tipo === "chegadaBase") deslocamentoMs += calcDurationMs(ini.time, fim.time);
    }
    const almocoMs = calcDurationMs(state.jornada.almoco?.inicio, state.jornada.almoco?.fim);
    return { atendimentoMs, deslocamentoMs, almocoMs };
  }, [state.jornada]);

  const jornadaTotalMs = useMemo(() => calcDurationMs(state.jornada.inicioExpediente, state.jornada.fimExpediente), [state.jornada]);
  const ociosidadeMs = useMemo(() => Math.max(0, jornadaTotalMs - (totals.atendimentoMs + totals.deslocamentoMs + totals.almocoMs)), [jornadaTotalMs, totals]);
  const produtividadePct = useMemo(() => (jornadaTotalMs > 0 ? Math.round((totals.atendimentoMs / jornadaTotalMs) * 100) : 0), [jornadaTotalMs, totals]);

  // timeline builder (com almoço como bloco único)
  const timeline = useMemo(() => {
    const ev = [];
    if (state.jornada.inicioExpediente) ev.push({ time: state.jornada.inicioExpediente, label: "Expediente iniciado" });
    state.jornada.atendimentos.forEach((a, i) => {
      if (a.deslocamentoInicio) ev.push({ time: a.deslocamentoInicio, label: `Deslocamento OS ${i + 1}` });
      if (a.atendimentoInicio) ev.push({ time: a.atendimentoInicio, label: `Início atendimento ${i + 1}` });
      if (a.finalizadoEm) ev.push({ time: a.finalizadoEm, label: `Atendimento concluído ${i + 1}` });
    });
    state.jornada.baseLogs?.forEach((b) => {
      ev.push({ time: b.time, label: b.tipo === "chegadaBase" ? "Chegada à base" : "Deslocamento à base" });
    });
    if (state.jornada.almoco?.inicio && state.jornada.almoco?.fim) {
      ev.push({ time: state.jornada.almoco.inicio, label: `Almoço — ${state.jornada.almoco.inicio} → ${state.jornada.almoco.fim}` });
    } else {
      if (state.jornada.almoco?.inicio) ev.push({ time: state.jornada.almoco.inicio, label: "Início almoço" });
      if (state.jornada.almoco?.fim) ev.push({ time: state.jornada.almoco.fim, label: "Fim almoço" });
    }
    if (state.jornada.fimExpediente) ev.push({ time: state.jornada.fimExpediente, label: "Expediente finalizado" });
    return ev.sort((a, b) => new Date(a.time) - new Date(b.time));
  }, [state.jornada]);

  // distance
  const distanciaTotal = useMemo(() => calcularDistanciaTotal(state.jornada), [state.jornada]);

  // UI: tabs content
  function TabsNav() {
    return (
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <L.Btn $primary={tab === "atendimentos"} onClick={() => setTab("atendimentos")}>Atendimentos</L.Btn>
        <L.Btn $primary={tab === "mapa"} onClick={() => setTab("mapa")}>Mapa</L.Btn>
        <L.Btn $primary={tab === "dashboard"} onClick={() => setTab("dashboard")}>Dashboard</L.Btn>
        <L.Btn $primary={tab === "timeline"} onClick={() => setTab("timeline")}>Linha do Tempo</L.Btn>
        <L.Btn $primary={tab === "preview"} onClick={() => setTab("preview")}>Preview / Assinatura</L.Btn>
      </div>
    );
  }

  // Export helpers
  const handleExportExcel = () => {
    try {
      exportJornadaToExcel?.(state.jornada);
    } catch (e) {
      alert("Export Excel falhou: " + e.message);
    }
  };

  // Render
  return (
    <ThemeProvider theme={theme}>
      <RdoContext.Provider value={{ state, dispatch }}>
        <div style={{ padding: 18, maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div>
              <h2 style={{ margin: 0, color: theme.colors.accent }}>RDO — Gasita Operações</h2>
              <div style={{ color: theme.colors.muted }}>Jornada {state.jornada.date}</div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <L.Btn onClick={iniciarExpediente} disabled={!!state.jornada.inicioExpediente}>Iniciar expediente</L.Btn>
              <L.Btn onClick={finalizarExpediente} disabled={!state.jornada.inicioExpediente || !!state.jornada.fimExpediente} $primary>Finalizar expediente</L.Btn>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <L.Card>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div><strong>Técnico:</strong> {state.jornada.technician || "—"}</div>
                  <div style={{ color: theme.colors.muted, marginTop: 6 }}>
                    Início: {state.jornada.inicioExpediente || "—"} • Fim: {state.jornada.fimExpediente || "—"}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div><strong>Distância total:</strong> {(distanciaTotal / 1000).toFixed(2)} km</div>
                  <div><strong>Horas produtivas:</strong> {msToHuman(totals.atendimentoMs)}</div>
                </div>
              </div>
            </L.Card>
          </div>

          <div style={{ marginTop: 12 }}>
            <AlmocoModule />
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <L.Btn onClick={() => novoAtendimento("externo")}>Novo atendimento (externo)</L.Btn>
            <L.Btn onClick={() => novoAtendimento("interno")}>Novo atendimento (interno)</L.Btn>
            <L.Btn onClick={iniciarDeslocamentoParaBase}>Retorno à base</L.Btn>
            <L.Btn onClick={marcarChegadaBase}>Registrar chegada base</L.Btn>
            <L.Btn onClick={handleExportExcel}>Exportar Excel</L.Btn>
          </div>

          <div style={{ marginTop: 14 }}>
            <TabsNav />
            <div>
              {tab === "atendimentos" && (
                <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 12 }}>
                  <div>
                    <AtendimentoList onViewMap={() => setTab("mapa")} />
                  </div>
                  <div>
                    {state.currentIdx !== null ? (
                      <AtendimentoForm />
                    ) : (
                      <L.Card>
                        <div style={{ color: theme.colors.muted }}>Selecione um atendimento para editar ou clique em Novo atendimento.</div>
                      </L.Card>
                    )}
                  </div>
                </div>
              )}

              {tab === "mapa" && (
                <div>
                  <JourneyMap jornada={state.jornada} />
                </div>
              )}

              {tab === "dashboard" && (
                <div>
                  <Dashboard jornada={state.jornada} historico={[state.jornada]} />
                </div>
              )}

              {tab === "timeline" && (
                <div>
                  <Timeline items={timeline} />
                </div>
              )}

              {tab === "preview" && (
                <div>
                  <RdoPreview onClose={() => setTab("atendimentos")} />
                </div>
              )}
            </div>
          </div>
        </div>
      </RdoContext.Provider>
    </ThemeProvider>
  );
}
