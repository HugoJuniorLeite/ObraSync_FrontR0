// src/components/RDO/GasitaOperacoes/almoco/useAlmoco.js
import { getLocation } from '../helpers/location';
import { nowISO } from '../helpers/time';

export const useAlmoco = (state, dispatch) => {
  const iniciar = async () => {
    const loc = await getLocation();
    dispatch({ type:'SET_FIELD', field:'almoco', value: { ...state.jornada.almoco, inicio: nowISO(), latInicio: loc?.lat||'', lngInicio: loc?.lng||'' } });
  };
  const finalizar = async () => {
    const loc = await getLocation();
    dispatch({ type:'SET_FIELD', field:'almoco', value: { ...state.jornada.almoco, fim: nowISO(), latFim: loc?.lat||'', lngFim: loc?.lng||'' } });
  };
  return { iniciar, finalizar };
};
