// src/components/RDO/GasitaOperacoes/atendimento/AtendimentoForm.jsx
import React from 'react';
import { useRdo } from '../RdoMain';
import { Input, Select, Btn, Card, Row, Label } from '../styles/layout';
import { buscarCep } from '../helpers/cep';
import { getLocation } from '../helpers/location';
import { nowISO } from '../helpers/time';

export default function AtendimentoForm() {
  const { state, dispatch } = useRdo();
  const idx = state.currentIdx;
  if (idx === null) return null;
  const att = state.jornada.atendimentos[idx];
  if (!att) return null;

  const update = (patch) => dispatch({ type: 'UPDATE_ATEND', idx, payload: patch });

  return (
    <Card>
      <Label>Atendimento #{idx+1}</Label>
      <Row>
        <div>
          <Label>Tipo</Label>
          <Select value={att.tipo} onChange={(e)=> update({ tipo: e.target.value })}>
            <option value="externo">Externo</option>
            <option value="interno">Interno</option>
          </Select>
        </div>
        <div>
          <Label>Ordem</Label>
          <div style={{ display:'flex', gap:8 }}>
            {att.tipo === 'interno' ? (
              <>
                <Input value={att.ordemPrefixo} readOnly style={{ width:120 }} />
                <Input value={att.ordemNumero} onChange={e=> update({ ordemNumero: e.target.value.replace(/\D/g,'').slice(0,6) })} placeholder="000000" style={{ width:120 }} />
              </>
            ) : (
              <>
                <Select value={att.ordemTipo} onChange={e=> update({ ordemTipo: e.target.value })} style={{ width:120 }}>
                  <option value="3">3</option>
                  <option value="7">7</option>
                  <option value="100000">100000</option>
                </Select>
                <Input value={att.ordemNumero} onChange={e=> update({ ordemNumero: e.target.value.replace(/\D/g,'').slice(0,6) })} placeholder="000000" style={{ width:120 }} />
              </>
            )}
          </div>
        </div>
        <div>
          <Label>CEP</Label>
          <Input value={att.endereco.cep||''} onChange={e=> update({ endereco: { ...att.endereco, cep: e.target.value.replace(/\D/g,'').slice(0,8) } })} onBlur={async (e)=>{ const res = await buscarCep(e.target.value); if (res) update({ endereco: { ...att.endereco, ...res } }); }} />
        </div>
      </Row>

      <Row>
        <div><Label>Rua</Label><Input value={att.endereco.rua||''} onChange={e=> update({ endereco: { ...att.endereco, rua: e.target.value } })} /></div>
        <div><Label>Número</Label><Input value={att.endereco.numero||''} onChange={e=> update({ endereco: { ...att.endereco, numero: e.target.value } })} /></div>
        <div><Label>Bairro</Label><Input value={att.endereco.bairro||''} onChange={e=> update({ endereco: { ...att.endereco, bairro: e.target.value } })} /></div>
      </Row>

      <Row>
        <div><Label>Cidade</Label><Input value={att.endereco.cidade||''} onChange={e=> update({ endereco: { ...att.endereco, cidade: e.target.value } })} /></div>
        <div><Label>Estado</Label><Input value={att.endereco.estado||''} onChange={e=> update({ endereco: { ...att.endereco, estado: e.target.value } })} /></div>
        <div>
          <Label>Ações</Label>
          <div style={{ display:'flex', gap:8 }}>
            <Btn onClick={async ()=>{
              const loc = await getLocation();
              update({ deslocamentoInicio: nowISO(), gpsInicio: { lat: loc?.lat||'', lng: loc?.lng||'' } });
              dispatch({ type: 'SET_MODE', mode: 'deslocando' });
            }} disabled={!!att.deslocamentoInicio}>Iniciar deslocamento</Btn>

            <Btn onClick={async ()=>{ const loc = await getLocation(); update({ atendimentoInicio: nowISO(), gpsInicio: att.gpsInicio?.lat?att.gpsInicio: { lat: loc?.lat||'', lng: loc?.lng||'' } }); dispatch({ type:'SET_MODE', mode:'emAtendimento' }); }} disabled={!att.deslocamentoInicio || !!att.atendimentoInicio}>Iniciar atendimento</Btn>

            <Btn onClick={async ()=>{ const loc = await getLocation(); update({ finalizadoEm: nowISO(), gpsChegada: { lat: loc?.lat||'', lng: loc?.lng||'' } }); dispatch({ type:'SET_MODE', mode:'finalizado' }); }} disabled={!att.atendimentoInicio || !!att.finalizadoEm}>Concluir atendimento</Btn>
          </div>
        </div>
      </Row>

      <div style={{ marginTop:10 }}>
        <Label>Notas</Label>
        <textarea value={att.notas||''} onChange={e=> update({ notas: e.target.value })} style={{ width:'100%', minHeight:80, background:'transparent', border:'1px solid rgba(255,255,255,0.04)', color:'#fff', padding:8, borderRadius:8 }} />
      </div>
    </Card>
  );
}
