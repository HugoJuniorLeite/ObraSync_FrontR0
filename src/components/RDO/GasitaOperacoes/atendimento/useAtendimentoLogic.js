// src/components/RDO/GasitaOperacoes/atendimento/useAtendimentoLogic.js
import { getLocation } from '../helpers/location';
import { nowISO } from '../helpers/time';

export const useAtendimentoLogic = (state, dispatch) => {
  const startDeslocamento = async (idx) => {
    const loc = await getLocation();
    dispatch({ type:'UPDATE_ATEND', idx, payload: { deslocamentoInicio: nowISO(), gpsInicio: { lat: loc?.lat||'', lng: loc?.lng||'' } } });
    dispatch({ type:'SET_MODE', mode:'deslocando' });
  };

  const startAtendimento = async (idx) => {
    const loc = await getLocation();
    dispatch({ type:'UPDATE_ATEND', idx, payload: { atendimentoInicio: nowISO(), gpsInicio: state.jornada.atendimentos[idx].gpsInicio?.lat ? state.jornada.atendimentos[idx].gpsInicio : { lat: loc?.lat||'', lng: loc?.lng||'' } } });
    dispatch({ type:'SET_MODE', mode:'emAtendimento' });
  };

  const concluirAtendimento = async (idx) => {
    const loc = await getLocation();
    dispatch({ type:'UPDATE_ATEND', idx, payload: { finalizadoEm: nowISO(), gpsChegada: { lat: loc?.lat||'', lng: loc?.lng||'' } } });
    dispatch({ type:'SET_MODE', mode:'finalizado' });
  };

  return { startDeslocamento, startAtendimento, concluirAtendimento };
};
