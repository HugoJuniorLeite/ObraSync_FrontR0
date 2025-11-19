// src/components/RDO/GasitaOperacoes/almoco/AlmocoModule.jsx
import React from 'react';
import { Btn, Card, Label } from '../styles/layout';
import { useRdo } from '../RdoMain';
import { getLocation } from '../helpers/location';
import { nowISO } from '../helpers/time';

export default function AlmocoModule(){
  const { state, dispatch } = useRdo();
  const alm = state.jornada.almoco || {};

  const iniciar = async () => {
    const loc = await getLocation();
    dispatch({ type:'SET_FIELD', field: 'almoco', value: { ...alm, inicio: nowISO(), latInicio: loc?.lat||'', lngInicio: loc?.lng||'' } });
  };
  const finalizar = async () => {
    const loc = await getLocation();
    dispatch({ type:'SET_FIELD', field: 'almoco', value: { ...alm, fim: nowISO(), latFim: loc?.lat||'', lngFim: loc?.lng||'' } });
  };

  return (
    <Card>
      <Label>Pausa para Almoço</Label>
      <div style={{ display:'flex', gap:8, marginTop:8 }}>
        <Btn onClick={iniciar} disabled={!!alm.inicio}>Iniciar almoço</Btn>
        <Btn onClick={finalizar} disabled={!alm.inicio || !!alm.fim}>Finalizar almoço</Btn>
      </div>

      {alm.inicio && (
        <div style={{ marginTop:8 }}>
          <div><strong>Início:</strong> {alm.inicio}</div>
          {alm.fim && <div><strong>Fim:</strong> {alm.fim}</div>}
        </div>
      )}
    </Card>
  );
}
