// src/components/RDO/GasitaOperacoes/base/useBaseLogic.js
import { getLocation } from "../helpers/location";
import { nowISO } from "../helpers/time";

/**
 * Helpers para trabalhar com logs da base (retorno/chegada)
 * retorna funções que dispatcham actions no reducer (SET_FIELD expected)
 */

export const useBaseLogic = (state, dispatch) => {
  const iniciarDeslocamentoParaBase = async () => {
    const loc = await getLocation();
    const evt = { id: `b-${Date.now()}`, tipo: "deslocamentoParaBase", time: nowISO(), gps: { lat: loc?.lat || "", lng: loc?.lng || "" } };
    dispatch({ type: "SET_FIELD", field: "baseLogs", value: [...(state.jornada.baseLogs || []), evt] });
    dispatch({ type: "SET_MODE", mode: "retornoDeslocamento" });
  };

  const marcarChegadaBase = async () => {
    const loc = await getLocation();
    const evt = { id: `b-${Date.now()}`, tipo: "chegadaBase", time: nowISO(), gps: { lat: loc?.lat || "", lng: loc?.lng || "" } };
    dispatch({ type: "SET_FIELD", field: "baseLogs", value: [...(state.jornada.baseLogs || []), evt] });
    dispatch({ type: "SET_MODE", mode: "idle" });
    dispatch({ type: "SET_IDX", idx: null });
  };

  return { iniciarDeslocamentoParaBase, marcarChegadaBase };
};
