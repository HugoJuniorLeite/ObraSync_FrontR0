// src/components/RDO/GasitaOperacoes/atendimento/AtendimentoList.jsx
import React from 'react';
import { useRdo } from '../RdoMain';
import { Card, Btn } from '../styles/layout';

export default function AtendimentoList({ onViewMap }) {
  const { state, dispatch } = useRdo();
  return (
    <Card>
      <div style={{ fontWeight:700 }}>Atendimentos</div>
      <div style={{ marginTop:8 }}>
        {state.jornada.atendimentos.length === 0 && <div style={{ color:'#9fb4c9' }}>Nenhum atendimento</div>}
        {state.jornada.atendimentos.map((a, idx) => (
          <div key={a.id} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px dashed rgba(255,255,255,0.04)'}}>
            <div>
              <strong>{a.tipo === 'interno' ? `OS ${a.ordemPrefixo}-${a.ordemNumero}` : `OS ${a.ordemTipo}-${a.ordemNumero}`}</strong>
              <div style={{ color:'#9fb4c9' }}>{a.endereco.rua || '—'} {a.endereco.numero || ''} — {a.endereco.cidade || ''}</div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <Btn onClick={() => { dispatch({ type:'SET_IDX', idx }); dispatch({ type:'SET_MODE', mode:'editMode' }); }}>Editar</Btn>
              <Btn onClick={() => { dispatch({ type:'REMOVE_ATEND', idx }); }}>Remover</Btn>
              <Btn onClick={() => onViewMap({ atendimento: a, idx })}>Ver trajeto no mapa</Btn>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
