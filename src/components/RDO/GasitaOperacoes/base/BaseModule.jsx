// src/components/RDO/GasitaOperacoes/base/BaseModule.jsx
import React from "react";
import { Card, Label, Btn } from "../styles/layout";
import { useRdo } from "../RdoMain";
import { getLocation } from "../helpers/location";
import { nowISO } from "../helpers/time";

/**
 * Componente simples para retorno à base:
 * - Inicia deslocamento para base (registra horário + gps)
 * - Marca chegada à base (registra horário + gps)
 *
 * Usa baseLogs no state.jornada, onde cada evento tem:
 * { id, tipo: "deslocamentoParaBase"|"chegadaBase", time, gps }
 */

export default function BaseModule() {
  const { state, dispatch } = useRdo();
  const lastBaseLog = state.jornada.baseLogs?.[state.jornada.baseLogs.length - 1];

  const iniciarDeslocamentoParaBase = async () => {
    const loc = await getLocation();
    dispatch({
      type: "SET_FIELD",
      field: "baseLogs",
      value: [...(state.jornada.baseLogs || []), { id: `b-${Date.now()}`, tipo: "deslocamentoParaBase", time: nowISO(), gps: { lat: loc?.lat || "", lng: loc?.lng || "" } }]
    });
    dispatch({ type: "SET_MODE", mode: "retornoDeslocamento" });
  };

  const marcarChegadaBase = async () => {
    const loc = await getLocation();
    dispatch({
      type: "SET_FIELD",
      field: "baseLogs",
      value: [...(state.jornada.baseLogs || []), { id: `b-${Date.now()}`, tipo: "chegadaBase", time: nowISO(), gps: { lat: loc?.lat || "", lng: loc?.lng || "" } }]
    });
    dispatch({ type: "SET_MODE", mode: "idle" });
    dispatch({ type: "SET_IDX", idx: null });
  };

  return (
    <Card>
      <Label>Retorno à Base</Label>

      <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
        <Btn onClick={iniciarDeslocamentoParaBase}>Iniciar deslocamento à base</Btn>
        <Btn onClick={marcarChegadaBase}>Marcar chegada à base</Btn>
      </div>

      {lastBaseLog && (
        <div style={{ marginTop: 10, color: "#9fb4c9" }}>
          Último log: <strong>{lastBaseLog.tipo}</strong> — {lastBaseLog.time}
        </div>
      )}
    </Card>
  );
}
