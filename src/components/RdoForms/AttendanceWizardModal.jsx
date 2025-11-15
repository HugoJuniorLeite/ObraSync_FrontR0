import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  Trash2,
  Plus,
} from "lucide-react";
import SignatureCanvas from "react-signature-canvas";

/* ================== ESTILOS (mantive seu tema premium) ================== */
const Overlay = styled.div`
  position: fixed; inset: 0;
  background: rgba(10, 15, 25, 0.85);
  display: flex; justify-content: center; align-items: center;
  z-index: 60;
`;
const Content = styled.div`
  width: min(1000px, 96vw);
  max-height: 92vh;
  overflow: auto;
  background: #1a2d45;
  border: 1px solid #00396b;
  border-radius: 14px;
  padding: 1.2rem 1.2rem 1.6rem;
  color: #e5f0ff;
  box-shadow: 0 0 22px rgba(0, 57, 107, 0.45);
  position: relative;
`;
const CloseBtn = styled.button`
  position: absolute; top: 12px; right: 12px;
  background: none; border: none; color: #e5f0ff; cursor: pointer;
  &:hover { color:#f59e0b; }
`;
const Title = styled.h2`
  color: #f59e0b; margin-bottom:.6rem; font-size: 1.35rem; font-weight: 700;
`;
const Sub = styled.p`
  margin-bottom:1rem; color: #a9c3de; font-size: .95rem;
`;

const Progress = styled.div`
  height: 8px; width: 100%; background:#0f243b; border-radius: 999px; overflow: hidden; margin-bottom: 1rem;
`;
const ProgressFill = styled.div`
  height: 100%;
  width: ${p => p.$pct}%;
  background: linear-gradient(90deg,#38bdf8,#0ea5e9);
  transition: width .3s ease;
`;

const Row = styled.div`
  display: grid; gap: .8rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  margin-bottom: .8rem;
`;
const Field = styled.div`
  display: flex; flex-direction: column; gap: 6px;
`;
const Label = styled.label`
  font-size: .9rem; color: #94a3b8;
`;
const Input = styled.input`
  padding: 10px 12px; border-radius: 8px; outline: none;
  border: 1px solid #00396b; background:#10243a; color:#fff;
  &:focus { box-shadow: 0 0 0 2px #38bdf866; border-color:#38bdf8; }
`;
const Textarea = styled.textarea`
  padding: 10px 12px; border-radius: 8px; outline: none; resize: vertical;
  border: 1px solid #00396b; background:#10243a; color:#fff;
  &:focus { box-shadow: 0 0 0 2px #38bdf866; border-color:#38bdf8; }
`;
const Select = styled.select`
  padding: 10px 12px; border-radius: 8px; outline: none;
  border: 1px solid #00396b; background:#10243a; color:#fff;
  &:focus { box-shadow:0 0 0 2px #38bdf866; border-color:#38bdf8; }
`;

const Card = styled.div`
  background:#0f243b; border:1px solid #00396b; border-radius:10px;
  padding: 14px; margin-top: .6rem;
`;

const Banner = styled.div`
  background: linear-gradient(90deg,#0ea5e9,#2563eb);
  color: white;
  padding: 10px 12px;
  border-radius: 10px;
  display:flex;
  align-items:center;
  gap:12px;
  margin-bottom:12px;
  box-shadow: 0 6px 18px rgba(13,71,161,0.12);
`;

const TimelineItem = styled.div`
  display:flex;
  gap:10px;
  align-items:flex-start;
  margin-bottom:10px;
  color:#cfe9ff;
`;
const TimeDot = styled.div`
  width:10px; height:10px; border-radius:999px; background:#38bdf8; margin-top:6px;
`;

const Bar = styled.div`
  display:flex; justify-content: space-between; gap:.6rem; margin-top: 1rem;
  align-items:center;
`;
const Btn = styled.button`
  display:flex; align-items:center; gap:8px; cursor:pointer;
  padding:.65rem 1rem; border-radius:10px; font-weight:700;
  border: 1px solid ${p => p.$primary ? "#38bdf8" : "#00396b"};
  background: ${p => p.$primary ? "#38bdf8" : "#00396b"};
  color: ${p => p.$primary ? "#0f172a" : "#e8f2ff"};
  &:hover { filter: brightness(1.07); }
  &:disabled { opacity: .5; cursor: not-allowed; }
`;

const ImgThumb = styled.div`
  position: relative;
  width:90px; height:90px;
  border-radius:10px; overflow:hidden;
  border:1px solid #00396b;
  img { width:100%; height:100%; object-fit:cover; }
  button {
    position:absolute; top:-6px; right:-6px;
    background:#e11d48; border:none; color:white;
    border-radius:50%; width:22px; height:22px; cursor:pointer;
  }
`;

/* ================== HELPERS ================== */
const fmt = (d) => d ? new Date(d).toLocaleString("pt-BR") : "—";
const nowISO = () => new Date().toISOString();

const getLocation = () =>
  new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: true }
    );
  });

// haversine distance (meters)
const haversine = (a, b) => {
  if (!a || !b || a.lat === "" || b.lat === "") return 0;
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371000; // meters
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const sinDlat = Math.sin(dLat / 2) ** 2;
  const sinDlon = Math.sin(dLon / 2) ** 2;
  const aCalc = sinDlat + Math.cos(lat1) * Math.cos(lat2) * sinDlon;
  const c = 2 * Math.atan2(Math.sqrt(aCalc), Math.sqrt(1 - aCalc));
  return R * c;
};

/* ================== BASE FIXA (conforme sua escolha A) ================== */
/* Endereço: Rua Bom Pastor, 975 — Ipiranga, SP
   Coordenadas adotadas (fonte de CEP/mapa): lat: -23.57647, lng: -46.60864 */
const BASE_COORDS = { lat: -23.57647, lng: -46.60864 };

/* ================== COMPONENTE ================== */
export default function AttendanceWizardModal({ onClose }) {
  const DRAFT = "atendimentoDraftV4_base";
  const SAVED = "atendimentosV4_base";

  const [jornada, setJornada] = useState(() => {
    const d = localStorage.getItem(DRAFT);
    if (d) try { return JSON.parse(d); } catch { }
    return {
      date: new Date().toISOString().slice(0, 10),
      inicioExpediente: "",
      fimExpediente: "",
      expedienteGps: null,
      almoco: { inicio: "", fim: "", latInicio: "", lngInicio: "", latFim: "", lngFim: "", justificativa: "" },
      atendimentos: [],
      baseLogs: [],
    };
  });

  const [currentAtendimentoIndex, setCurrentAtendimentoIndex] = useState(null);
  const [mode, setMode] = useState("idle"); // idle | preenchendo | deslocando | emAtendimento | finalizado | retornoDeslocamento | retornoBase | editMode
  const [fotosTemp, setFotosTemp] = useState([]);
  const sigRef = useRef(null);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [signatureEnabled, setSignatureEnabled] = useState(false);
  const [saved, setSaved] = useState([]);
  useEffect(() => {
    try { setSaved(JSON.parse(localStorage.getItem(SAVED) || "[]")); } catch { }
  }, []);

  useEffect(() => {
    localStorage.setItem(DRAFT, JSON.stringify(jornada));
  }, [jornada]);

  /* ===== helpers para criar atendimento ===== */
  const criarAtendimentoVazio = () => ({
    id: crypto.randomUUID(),
    tipo: "externo", // externo | interno
    ordemTipo: "3", // para externo
    ordemPrefixo: "100000", // para interno/prefixo exibido
    ordemNumero: "", // 6 dígitos
    endereco: { cep: "", rua: "", numero: "", bairro: "", cidade: "", estado: "" },
    deslocamentoInicio: "",
    atendimentoInicio: "",
    finalizadoEm: "",
    gpsInicio: { lat: "", lng: "" },
    gpsChegada: { lat: "", lng: "" },
    fotos: [],
    notas: ""
  });

  /* ===== iniciar novo atendimento: abre o formulário preenchimento ===== */
  const iniciarPreenchimentoAtendimento = (tipo = "externo") => {
    // cria atendimento and open filling mode
    setJornada(j => {
      const copy = { ...j };
      const novo = criarAtendimentoVazio();
      novo.tipo = tipo;
      if (tipo === "interno") { novo.ordemPrefixo = "100000"; novo.ordemTipo = "100000"; }
      copy.atendimentos = [...copy.atendimentos, novo];
      const idx = copy.atendimentos.length - 1;
      setCurrentAtendimentoIndex(idx);
      setMode("preenchendo");
      return copy;
    });
  };

  /* ===== buscar CEP para atendimento atual ===== */
  const buscarCep = async (cep, idx) => {
    const c = (cep || "").toString().replace(/\D/g, "");
    if (c.length !== 8) return;
    try {
      const r = await fetch(`https://viacep.com.br/ws/${c}/json/`);
      const j = await r.json();
      if (!j.erro) {
        setJornada(old => {
          const copy = { ...old };
          const att = { ...copy.atendimentos[idx] };
          att.endereco = { ...att.endereco, rua: j.logradouro, bairro: j.bairro, cidade: j.localidade, estado: j.uf, cep: c };
          copy.atendimentos[idx] = att;
          return copy;
        });
      }
    } catch { }
  };

  const handleFotosTemp = (e) => {
    const arr = [...e.target.files].map(f => ({ file: f, url: URL.createObjectURL(f) }));
    setFotosTemp(prev => [...prev, ...arr]);
    if (currentAtendimentoIndex !== null) {
      setJornada(j => {
        const copy = { ...j };
        const att = { ...copy.atendimentos[currentAtendimentoIndex] };
        att.fotos = [...att.fotos, ...arr];
        copy.atendimentos[currentAtendimentoIndex] = att;
        return copy;
      });
    }
  };
  const removeFotoTemp = (url) => {
    setFotosTemp(prev => prev.filter(f => f.url !== url));
    if (currentAtendimentoIndex !== null) {
      setJornada(j => {
        const copy = { ...j };
        const att = { ...copy.atendimentos[currentAtendimentoIndex] };
        att.fotos = att.fotos.filter(f => f.url !== url);
        copy.atendimentos[currentAtendimentoIndex] = att;
        return copy;
      });
    }
  };

  /* ===== iniciar deslocamento (coleta hora + gps) ===== */
  const iniciarDeslocamentoAtendimento = async () => {
    if (currentAtendimentoIndex === null) return;
    const att = jornada.atendimentos[currentAtendimentoIndex];
    if (!att.ordemNumero || !/^\d{6}$/.test(att.ordemNumero)) {
      alert("Informe o número da OS com 6 dígitos antes de iniciar deslocamento.");
      return;
    }
    const loc = await getLocation();
    setJornada(j => {
      const copy = { ...j };
      const a = { ...copy.atendimentos[currentAtendimentoIndex] };
      if (!a.deslocamentoInicio) {
        a.deslocamentoInicio = nowISO();
        a.gpsInicio = { lat: loc?.lat || "", lng: loc?.lng || "" };
      }
      copy.atendimentos[currentAtendimentoIndex] = a;
      if (!copy.inicioExpediente) copy.inicioExpediente = nowISO();
      setMode("deslocando");
      return copy;
    });
  };

  /* ===== iniciar atendimento ===== */
  const iniciarAtendimento = async () => {
    if (currentAtendimentoIndex === null) return;
    const loc = await getLocation();
    setJornada(j => {
      const copy = { ...j };
      const a = { ...copy.atendimentos[currentAtendimentoIndex] };
      if (!a.atendimentoInicio) {
        a.atendimentoInicio = nowISO();
        if (!a.gpsInicio || !a.gpsInicio.lat) a.gpsInicio = { lat: loc?.lat || "", lng: loc?.lng || "" };
      }
      copy.atendimentos[currentAtendimentoIndex] = a;
      setMode("emAtendimento");
      return copy;
    });
  };

  /* ===== concluir atendimento ===== */
  const concluirAtendimento = async () => {
    if (currentAtendimentoIndex === null) return;
    const loc = await getLocation();
    setJornada(j => {
      const copy = { ...j };
      const a = { ...copy.atendimentos[currentAtendimentoIndex] };
      a.finalizadoEm = nowISO();
      a.gpsChegada = { lat: loc?.lat || "", lng: loc?.lng || "" };
      copy.atendimentos[currentAtendimentoIndex] = a;
      setMode("finalizado");
      return copy;
    });
  };

  /* ===== retorno à base: iniciar deslocamento para base ===== */
  const iniciarDeslocamentoParaBase = async () => {
    const loc = await getLocation();
    setJornada(j => {
      const copy = { ...j };
      copy.baseLogs = [...copy.baseLogs, { id: crypto.randomUUID(), tipo: "deslocamentoParaBase", time: nowISO(), gps: { lat: loc?.lat || "", lng: loc?.lng || "" } }];
      setMode("retornoDeslocamento");
      return copy;
    });
  };

  /* ===== marcar chegada à base ===== */
  const marcarChegadaBase = async () => {
    const loc = await getLocation();
    setJornada(j => {
      const copy = { ...j };
      copy.baseLogs = [...copy.baseLogs, { id: crypto.randomUUID(), tipo: "chegadaBase", time: nowISO(), gps: { lat: loc?.lat || "", lng: loc?.lng || "" } }];
      setMode("idle");
      setCurrentAtendimentoIndex(null);
      return copy;
    });
  };

  /* ===== calcular distancia total ===== */
  const calcularDistanciaTotal = () => {
    const points = [];
    jornada.atendimentos.forEach(att => {
      if (att.gpsInicio && att.gpsInicio.lat) points.push(att.gpsInicio);
      if (att.gpsChegada && att.gpsChegada.lat) points.push(att.gpsChegada);
    });
    jornada.baseLogs.forEach(l => {
      if (l.gps && l.gps.lat) points.push(l.gps);
    });
    let total = 0;
    for (let i = 1; i < points.length; i++) total += haversine(points[i - 1], points[i]);
    return Math.round(total);
  };

  /* ===== distância estimada até a base (a partir da última posição conhecida) ===== */
  const distanciaAteBase = () => {
    // prefer last gpsChegada of last atendimento, senão gpsInicio, senão last base log gps
    const lastAtt = jornada.atendimentos.slice().reverse().find(a => a.gpsChegada?.lat || a.gpsInicio?.lat);
    let lastPos = null;
    if (lastAtt) {
      if (lastAtt.gpsChegada && lastAtt.gpsChegada.lat) lastPos = lastAtt.gpsChegada;
      else if (lastAtt.gpsInicio && lastAtt.gpsInicio.lat) lastPos = lastAtt.gpsInicio;
    } else if (jornada.baseLogs.length) {
      const lastLog = jornada.baseLogs[jornada.baseLogs.length - 1];
      if (lastLog.gps && lastLog.gps.lat) lastPos = lastLog.gps;
    }
    if (!lastPos) return null;
    const meters = haversine(lastPos, BASE_COORDS);
    return meters; // meters
  };

  const finalizarExpediente = async () => {
    const loc = await getLocation();
    setJornada(j => ({ ...j, fimExpediente: nowISO(), expedienteGps: { lat: loc?.lat || "", lng: loc?.lng || "" } }));
    setSignatureEnabled(true);
    setPreviewOpen(true);
  };

  const editarAtendimento = (idx) => {
    setCurrentAtendimentoIndex(idx);
    setMode("editMode");
    setFotosTemp(jornada.atendimentos[idx].fotos || []);
  };
  const salvarEdicaoAtendimento = () => {
    setMode("idle");
    setCurrentAtendimentoIndex(null);
    setFotosTemp([]);
  };

  const confirmarEncerrarJornada = () => {
    const assinatura = sigRef.current?.toDataURL();
    const registro = { ...jornada, assinatura, id: crypto.randomUUID() };
    const arr = [...saved, registro];
    setSaved(arr);
    localStorage.setItem(SAVED, JSON.stringify(arr));
    localStorage.removeItem(DRAFT);
    setJornada({
      date: new Date().toISOString().slice(0, 10),
      inicioExpediente: "",
      fimExpediente: "",
      expedienteGps: null,
      almoco: { inicio: "", fim: "", latInicio: "", lngInicio: "", latFim: "", lngFim: "", justificativa: "" },
      atendimentos: [],
      baseLogs: [],
    });
    setMode("idle");
    setCurrentAtendimentoIndex(null);
    setFotosTemp([]);
    sigRef.current?.clear();
    setSignatureEnabled(false);
    setPreviewOpen(false);
  };

  const removerAtendimento = (idx) => {
    setJornada(j => {
      const copy = { ...j };
      copy.atendimentos = copy.atendimentos.filter((_, i) => i !== idx);
      return copy;
    });
  };

  const pct = (() => {
    const map = { idle: 5, preenchendo: 20, deslocando: 40, emAtendimento: 60, finalizado: 80, retornoDeslocamento: 50, retornoBase: 70, editMode: 50 };
    return map[mode] || 0;
  })();

  const variants = { hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -20 } };

  /* ===== montar timeline de eventos (cronológico) ===== */
  const montarTimeline = () => {
    const events = [];
    if (jornada.inicioExpediente) events.push({ time: jornada.inicioExpediente, label: "Expediente iniciado", type: "start" });
    jornada.atendimentos.forEach((a, i) => {
      if (a.deslocamentoInicio) events.push({ time: a.deslocamentoInicio, label: `Deslocamento para OS ${a.tipo === "interno" ? `${a.ordemPrefixo}-${a.ordemNumero}` : `${a.ordemTipo}-${a.ordemNumero}`}`, type: "desloc" });
      if (a.atendimentoInicio) events.push({ time: a.atendimentoInicio, label: `Início atendimento ${i + 1}`, type: "startService" });
      if (a.finalizadoEm) events.push({ time: a.finalizadoEm, label: `Atendimento concluído ${i + 1}`, type: "endService" });
    });
    jornada.baseLogs.forEach((l) => {
      if (l.tipo === "deslocamentoParaBase") events.push({ time: l.time, label: "Deslocamento para base", type: "retBaseStart" });
      if (l.tipo === "chegadaBase") events.push({ time: l.time, label: "Chegada à base", type: "retBaseEnd" });
    });
    // ALMOÇO — exibido como um bloco claro e equivalente às atividades
    if (jornada.almoco.inicio) {
      events.push({
        time: jornada.almoco.inicio,
        label: `🍽️ Almoço — início às ${fmt(jornada.almoco.inicio)}`,
        type: "lunchStart"
      });
    }

    if (jornada.almoco.fim) {
      events.push({
        time: jornada.almoco.fim,
        label: `🍽️ Almoço — término às ${fmt(jornada.almoco.fim)}`,
        type: "lunchEnd"
      });
    }


    if (jornada.fimExpediente) events.push({ time: jornada.fimExpediente, label: "Expediente finalizado", type: "end" });
    // sort by time
    return events.sort((a, b) => new Date(a.time) - new Date(b.time));
  };

  /* ===== distância em km helper para exibição do banner ===== */
  const formatKm = (meters) => (meters === null ? "—" : (meters / 1000).toFixed(2) + " km");


  /* ===== Helpers de duração ===== */
  const calcDurationMs = (start, end) => {
    if (!start || !end) return 0;
    try {
      return new Date(end) - new Date(start);
    } catch {
      return 0;
    }
  };

  const msToHuman = (ms) => {
    if (ms <= 0) return "0 min";
    const min = Math.floor(ms / 60000);
    const h = Math.floor(min / 60);
    const m = min % 60;
    if (h > 0) return `${h}h ${m}min`;
    return `${m}min`;
  };

  /* ===== Cálculo completo do dia ===== */
  const calcularTotais = () => {
    let atendimentoMs = 0;
    let deslocamentoMs = 0;

    jornada.atendimentos.forEach((att) => {
      // tempo de atendimento
      atendimentoMs += calcDurationMs(att.atendimentoInicio, att.finalizadoEm);

      // deslocamento para o atendimento
      deslocamentoMs += calcDurationMs(att.deslocamentoInicio, att.atendimentoInicio);

      // deslocamento após o atendimento (até o próximo ponto)
      if (att.finalizadoEm) {
        const next = jornada.atendimentos.find(a => new Date(a.deslocamentoInicio) > new Date(att.finalizadoEm));
        if (next) {
          deslocamentoMs += calcDurationMs(att.finalizadoEm, next.deslocamentoInicio);
        }
      }
    });

    // deslocamentos registrados no retorno à base
    for (let i = 0; i < jornada.baseLogs.length; i += 2) {
      const ini = jornada.baseLogs[i];
      const fim = jornada.baseLogs[i + 1];
      if (ini && fim && ini.tipo === "deslocamentoParaBase" && fim.tipo === "chegadaBase") {
        deslocamentoMs += calcDurationMs(ini.time, fim.time);
      }
    }

    // almoço
    const almocoMs = calcDurationMs(jornada.almoco.inicio, jornada.almoco.fim);

    return {
      atendimentoMs,
      deslocamentoMs,
      almocoMs
    };
  };

  /* ===== TOTAL DA JORNADA ===== */
  const calcularJornadaTotal = () => {
    return calcDurationMs(jornada.inicioExpediente, jornada.fimExpediente);
  };

  /* ===== OCIOSIDADE ===== */
  const calcularOciosidade = () => {
    const total = calcularJornadaTotal();
    const { atendimentoMs, deslocamentoMs, almocoMs } = calcularTotais();
    const usado = atendimentoMs + deslocamentoMs + almocoMs;
    return total - usado;
  };

  /* ===== PRODUTIVIDADE ===== */
  const calcularProdutividade = () => {
    const total = calcularJornadaTotal();
    const { atendimentoMs } = calcularTotais();
    if (total <= 0) return 0;
    return Math.round((atendimentoMs / total) * 100);
  };



  return (
    <Overlay>
      <Content>
        <CloseBtn onClick={onClose}><X size={20} /></CloseBtn>

        <Title>Novo Atendimento - Jornada</Title>
        <Sub>Fluxo de atendimento com base fixa, indicador de retorno e timeline do dia.</Sub>

        {/* BANNER: quando estiver em deslocamento para a base */}
        {mode === "retornoDeslocamento" && (
          <Banner>
            <div style={{ fontWeight: 700 }}>🏁 Retornando à Base</div>
            <div style={{ color: "#e6f7ff" }}>Deslocamento iniciado: {fmt(jornada.baseLogs[jornada.baseLogs.length - 1]?.time)}</div>
            <div style={{ marginLeft: "auto", fontWeight: 700 }}>
              Distância estimada até a base: {formatKm(distanciaAteBase())}
            </div>
          </Banner>
        )}

        {/* ================= ALMOÇO (sempre visível) ================= */}
        <Card style={{ marginBottom: "1rem", borderColor: "#2563eb" }}>
          <Label style={{ fontSize: "1rem", color: "#93c5fd" }}>
            Registro de Pausa para Almoço
          </Label>

          <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.4rem" }}>
            <Btn
              $primary
              onClick={async () => {
                const loc = await getLocation();
                setJornada(j => ({ ...j, almoco: { ...j.almoco, inicio: nowISO(), latInicio: loc?.lat || "", lngInicio: loc?.lng || "" } }));
              }}
              style={{ opacity: jornada.almoco.inicio ? 0.5 : 1 }}
              disabled={!!jornada.almoco.inicio}
            >
              <Check size={18} /> Iniciar Almoço
            </Btn>

            <Btn
              onClick={async () => {
                const loc = await getLocation();
                setJornada(j => ({ ...j, almoco: { ...j.almoco, fim: nowISO(), latFim: loc?.lat || "", lngFim: loc?.lng || "" } }));
              }}
              style={{
                background: "#0ea5e9",
                borderColor: "#0ea5e9",
                opacity: !jornada.almoco.inicio || jornada.almoco.fim ? 0.5 : 1
              }}
              disabled={!jornada.almoco.inicio || !!jornada.almoco.fim}
            >
              <Check size={18} /> Finalizar Almoço
            </Btn>
          </div>

          {jornada.almoco.inicio && (
            <div style={{ marginTop: "0.8rem", fontSize: ".9rem" }}>
              <p>
                <strong>Início:</strong> {fmt(jornada.almoco.inicio)}
                <br />
                <span style={{ color: "#60a5fa" }}>
                  Local: {jornada.almoco.latInicio}, {jornada.almoco.lngInicio}
                </span>
              </p>

              {jornada.almoco.fim && (
                <p style={{ marginTop: "0.6rem" }}>
                  <strong>Fim:</strong> {fmt(jornada.almoco.fim)}
                  <br />
                  <span style={{ color: "#34d399" }}>
                    Local: {jornada.almoco.latFim}, {jornada.almoco.lngFim}
                  </span>
                </p>
              )}
            </div>
          )}
        </Card>

        <Progress><ProgressFill $pct={pct} /></Progress>

        <AnimatePresence mode="wait">
          <motion.div key="main" variants={variants} initial="hidden" animate="visible" exit="exit">
            {/* area principal: seleção tipo atendimento e preenchimento (mesmo passo) */}
            <Card>
              <Label>Iniciar novo atendimento</Label>

              <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                <Btn onClick={() => iniciarPreenchimentoAtendimento("externo")}>Iniciar atendimento Externo</Btn>
                <Btn onClick={() => iniciarPreenchimentoAtendimento("interno")}>Iniciar atendimento Interno</Btn>
              </div>

              {/* Formulário do atendimento atual (quando currentAtendimentoIndex != null) */}
              {currentAtendimentoIndex !== null && (
                <div style={{ marginTop: 12 }}>
                  <Card style={{ background: "#071827" }}>
                    <Label>Dados do atendimento</Label>
                    {(() => {
                      const att = jornada.atendimentos[currentAtendimentoIndex];
                      if (!att) return null;
                      return (
                        <>
                          <Row>
                            <Field>
                              <Label>Tipo</Label>
                              <div style={{ display: "flex", gap: 8 }}>
                                <Select value={att.tipo} onChange={(e) => {
                                  const val = e.target.value;
                                  setJornada(j => {
                                    const copy = { ...j };
                                    copy.atendimentos[currentAtendimentoIndex].tipo = val;
                                    if (val === "interno") { copy.atendimentos[currentAtendimentoIndex].ordemPrefixo = "100000"; copy.atendimentos[currentAtendimentoIndex].ordemTipo = "100000"; }
                                    return copy;
                                  });
                                }}>
                                  <option value="externo">Externo</option>
                                  <option value="interno">Interno</option>
                                </Select>
                              </div>
                            </Field>

                            {/* ordem / prefixo + numero (6 digitos) */}
                            <Field>
                              <Label>Ordem</Label>
                              <div style={{ display: "flex", gap: 6 }}>
                                {att.tipo === "interno" ? (
                                  <>
                                    <Input value={att.ordemPrefixo} readOnly style={{ width: 120, textAlign: "center", background: "#0b2132" }} />
                                    <Input placeholder="000000" value={att.ordemNumero} onChange={(e) => {
                                      const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                                      setJornada(j => {
                                        const copy = { ...j };
                                        copy.atendimentos[currentAtendimentoIndex].ordemNumero = v;
                                        return copy;
                                      });
                                    }} style={{ width: 120, textAlign: "center" }} />
                                  </>
                                ) : (
                                  <>
                                    <Select value={att.ordemTipo} onChange={(e) => {
                                      const v = e.target.value;
                                      setJornada(j => {
                                        const copy = { ...j };
                                        copy.atendimentos[currentAtendimentoIndex].ordemTipo = v;
                                        return copy;
                                      });
                                    }} style={{ width: 120 }}>
                                      <option value="3">3</option>
                                      <option value="7">7</option>
                                      <option value="100000">100000</option>
                                    </Select>
                                    <Input placeholder="000000" value={att.ordemNumero} onChange={(e) => {
                                      const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                                      setJornada(j => {
                                        const copy = { ...j };
                                        copy.atendimentos[currentAtendimentoIndex].ordemNumero = v;
                                        return copy;
                                      });
                                    }} style={{ width: 120, textAlign: "center" }} />
                                  </>
                                )}
                              </div>
                              <div style={{ fontSize: ".85rem", color: "#94a3b8", marginTop: 6 }}>
                                Número com 6 dígitos obrigatório para iniciar deslocamento.
                              </div>
                            </Field>
                          </Row>

                          {/* ENDEREÇO (no mesmo passo) */}
                          <div style={{ marginTop: 12 }}>
                            <Label>Endereço do chamado</Label>
                            <Row>
                              <Field>
                                <Label>CEP</Label>
                                <Input value={att.endereco.cep || ""} onChange={(e) => {
                                  const v = e.target.value.replace(/\D/g, "").slice(0, 8);
                                  setJornada(j => {
                                    const copy = { ...j };
                                    copy.atendimentos[currentAtendimentoIndex].endereco.cep = v;
                                    return copy;
                                  });
                                }} onBlur={(e) => buscarCep(e.target.value, currentAtendimentoIndex)} placeholder="00000000" />
                              </Field>
                              <Field>
                                <Label>Rua</Label>
                                <Input value={att.endereco.rua || ""} onChange={(e) => {
                                  const v = e.target.value;
                                  setJornada(j => {
                                    const copy = { ...j };
                                    copy.atendimentos[currentAtendimentoIndex].endereco.rua = v;
                                    return copy;
                                  });
                                }} />
                              </Field>
                              <Field>
                                <Label>Número</Label>
                                <Input value={att.endereco.numero || ""} onChange={(e) => {
                                  const v = e.target.value;
                                  setJornada(j => {
                                    const copy = { ...j };
                                    copy.atendimentos[currentAtendimentoIndex].endereco.numero = v;
                                    return copy;
                                  });
                                }} />
                              </Field>
                            </Row>
                            <Row>
                              <Field>
                                <Label>Bairro</Label>
                                <Input value={att.endereco.bairro || ""} onChange={(e) => {
                                  const v = e.target.value;
                                  setJornada(j => {
                                    const copy = { ...j };
                                    copy.atendimentos[currentAtendimentoIndex].endereco.bairro = v;
                                    return copy;
                                  });
                                }} />
                              </Field>
                              <Field>
                                <Label>Cidade</Label>
                                <Input value={att.endereco.cidade || ""} onChange={(e) => {
                                  const v = e.target.value;
                                  setJornada(j => {
                                    const copy = { ...j };
                                    copy.atendimentos[currentAtendimentoIndex].endereco.cidade = v;
                                    return copy;
                                  });
                                }} />
                              </Field>
                              <Field>
                                <Label>Estado</Label>
                                <Input value={att.endereco.estado || ""} onChange={(e) => {
                                  const v = e.target.value;
                                  setJornada(j => {
                                    const copy = { ...j };
                                    copy.atendimentos[currentAtendimentoIndex].endereco.estado = v;
                                    return copy;
                                  });
                                }} />
                              </Field>
                            </Row>
                          </div>

                          {/* Fotos / notas */}
                          <div style={{ marginTop: 10 }}>
                            <Label>Fotos / Notas</Label>
                            <Input type="file" multiple accept="image/*" onChange={handleFotosTemp} />
                            <Row style={{ marginTop: 8 }}>
                              {(att.fotos || []).map(p => (
                                <ImgThumb key={p.url}>
                                  <img src={p.url} />
                                  <button onClick={() => removeFotoTemp(p.url)}><Trash2 size={14} /></button>
                                </ImgThumb>
                              ))}
                            </Row>
                            <div style={{ marginTop: 8 }}>
                              <Textarea placeholder="Notas do atendimento" value={att.notas || ""} onChange={(e) => {
                                const v = e.target.value;
                                setJornada(j => {
                                  const copy = { ...j };
                                  copy.atendimentos[currentAtendimentoIndex].notas = v;
                                  return copy;
                                });
                              }} rows={3} />
                            </div>
                          </div>

                          {/* Ações: iniciar deslocamento / iniciar atendimento / concluir atendimento */}
                          <Bar style={{ marginTop: 12 }}>
                            <div />
                            <div style={{ display: "flex", gap: 8 }}>
                              <Btn onClick={iniciarDeslocamentoAtendimento} disabled={!!att.deslocamentoInicio}><Check size={14} /> Iniciar deslocamento</Btn>
                              <Btn onClick={iniciarAtendimento} disabled={!att.deslocamentoInicio || !!att.atendimentoInicio}><Check size={14} /> Iniciar atendimento</Btn>
                              <Btn onClick={concluirAtendimento} disabled={!att.atendimentoInicio || !!att.finalizadoEm}><Check size={14} /> Concluir atendimento</Btn>
                            </div>
                          </Bar>

                          {/* Se finalizado, oferecer retorno ou novo atendimento */}
                          {att.finalizadoEm && (
                            <>
                              {mode !== "retornoDeslocamento" && (
                                <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                                  <Btn onClick={iniciarDeslocamentoParaBase}>
                                    Retorno à base (iniciar deslocamento)
                                  </Btn>
                                  <Btn onClick={() => iniciarPreenchimentoAtendimento("externo")}>
                                    Novo atendimento
                                  </Btn>
                                </div>
                              )}

                              {/* Se está em deslocamento para a base mostrar card com botão chegada */}
                              {mode === "retornoDeslocamento" && (
                                <Card style={{ marginTop: 12, borderColor: "#2563eb" }}>
                                  <div style={{ fontSize: ".95rem", marginBottom: 6 }}>
                                    <strong>Retorno à Base:</strong> deslocamento iniciado em:
                                    <br />
                                    {fmt(jornada.baseLogs[jornada.baseLogs.length - 1]?.time)}
                                  </div>

                                  <div style={{ marginBottom: 8 }}>
                                    <div style={{ color: "#a9c3de" }}>Distância estimada até a base: {formatKm(distanciaAteBase())}</div>
                                  </div>

                                  <Btn
                                    $primary
                                    onClick={marcarChegadaBase}
                                    style={{ marginTop: 8 }}
                                  >
                                    Registrar chegada à base
                                  </Btn>
                                </Card>
                              )}
                            </>
                          )}

                        </>
                      );
                    })()}
                  </Card>
                </div>
              )}

            </Card>

            {/* Lista de atendimentos do dia */}
            <Card style={{ marginTop: ".8rem" }}>
              <Label>Atendimentos do dia</Label>
              <div style={{ marginTop: ".6rem" }}>
                {jornada.atendimentos.length === 0 && <div style={{ color: "#94a3b8" }}>Nenhum atendimento registrado ainda.</div>}
                {jornada.atendimentos.map((a, idx) => (
                  <div key={a.id} style={{ padding: "10px 0", borderBottom: "1px dashed #00396b" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <strong>{a.tipo === "interno" ? `OS ${a.ordemPrefixo}-${a.ordemNumero}` : `OS ${a.ordemTipo}-${a.ordemNumero}`}</strong>
                        <div style={{ fontSize: ".9rem", color: "#a9c3de" }}>
                          Desloc: {fmt(a.deslocamentoInicio)} • Início: {fmt(a.atendimentoInicio)} • Finalizado: {fmt(a.finalizadoEm)}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: ".5rem" }}>
                        <Btn onClick={() => editarAtendimento(idx)}>Editar</Btn>
                        <Btn onClick={() => removerAtendimento(idx)}>Remover</Btn>
                      </div>
                    </div>
                    <div style={{ marginTop: ".6rem", fontSize: ".9rem", color: "#94a3b8" }}>
                      Endereço: {a.endereco.rua || "—"} {a.endereco.numero || ""} — {a.endereco.bairro || ""} — {a.endereco.cidade || ""}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Footer actions */}
            <Bar style={{ marginTop: "1rem" }}>
              <div style={{ display: "flex", gap: ".6rem" }}>
                <Btn onClick={() => iniciarPreenchimentoAtendimento("externo")}><Plus size={14} /> Novo atendimento</Btn>
              </div>

              <div style={{ display: "flex", gap: ".6rem", alignItems: "center" }}>
                <div style={{ color: "#94a3b8", fontSize: ".9rem" }}>Distância estimada total: {(calcularDistanciaTotal() / 1000).toFixed(2)} km</div>
                <Btn onClick={finalizarExpediente} $primary>Finalizar expediente</Btn>
              </div>

            </Bar>

            {/* TIMELINE */}
            <Card style={{ marginTop: 12 }}>
              <Label>Linha do tempo</Label>
              <div style={{ marginTop: 10 }}>
                {montarTimeline().length === 0 && <div style={{ color: "#94a3b8" }}>Nenhuma atividade registrada ainda.</div>}
                {montarTimeline().map((ev, i) => (
                  <TimelineItem key={i}>
                    <TimeDot />
                    <div>
                      <div style={{ fontWeight: 700 }}>{ev.label}</div>
                      <div style={{ fontSize: ".9rem", color: "#a9c3de" }}>{fmt(ev.time)}</div>
                    </div>
                  </TimelineItem>
                ))}
              </div>

              {/* Totais do dia */}
              {(() => {
                const { atendimentoMs, deslocamentoMs, almocoMs } = calcularTotais();
                return (
                  <div style={{
                    background: "#0d2236",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid #00396b",
                    color: "#dbeafe",
                    fontSize: ".9rem",
                    marginBottom: "10px",
                    width: "100%"
                  }}>
                    <div><strong>Tempo em atendimento:</strong> {msToHuman(atendimentoMs)}</div>
                    <div><strong>Tempo em Deslocamento:</strong> {msToHuman(deslocamentoMs)}</div>
                    <div><strong>Tempo em Almoço:</strong> {msToHuman(almocoMs)}</div>
                  </div>
                );
              })()}

              {/* PAINEL DO DIA */}
              {(() => {
                const jornadaMs = calcularJornadaTotal();
                const { atendimentoMs, deslocamentoMs, almocoMs } = calcularTotais();
                const ociosidadeMs = calcularOciosidade();
                const produtividade = calcularProdutividade();

                return (
                  <div style={{
                    background: "#0a1c2d",
                    padding: "14px",
                    borderRadius: "12px",
                    border: "1px solid #004a7c",
                    color: "#dbeafe",
                    fontSize: ".95rem",
                    marginBottom: "18px",
                    marginTop: "10px",
                    boxShadow: "0 3px 14px rgba(0,0,0,0.25)"
                  }}>
                    <div style={{ fontWeight: "700", color: "#60a5fa", marginBottom: "8px" }}>
                      📊 Painel do Dia
                    </div>

                    <div><strong>Jornada total:</strong> {msToHuman(jornadaMs)}</div>
                    <div>
                      <strong>Produtivas (Atendimento):</strong> {msToHuman(atendimentoMs)}
                      <span style={{ color: "#7dd3fc" }}>  ({produtividade}%)</span>
                    </div>

                    <div><strong>Deslocamento:</strong> {msToHuman(deslocamentoMs)}</div>
                    <div><strong>Almoço:</strong> {msToHuman(almocoMs)}</div>

                    <div style={{ marginTop: "6px" }}>
                      <strong>Ociosidade:</strong> {msToHuman(Math.max(ociosidadeMs, 0))}
                    </div>
                  </div>
                );
              })()}


            </Card>

          </motion.div>
        </AnimatePresence>

        {/* Preview modal (igual ao que já tinha), mantendo assinatura */}
        <AnimatePresence>
          {previewOpen && (
            <motion.div key="preview" initial={{ opacity: 0, scale: .98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .98 }} style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 80 }}>
              <div style={{ width: "min(900px,92vw)", maxHeight: "90vh", overflow: "auto", background: "#081827", border: "1px solid #00396b", borderRadius: 12, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ color: "#f59e0b" }}>Pré-visualização do RDO - {jornada.date}</h3>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn onClick={() => setPreviewOpen(false)}>Fechar</Btn>
                  </div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <Card>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div>
                        <div><strong>Início expediente:</strong> {fmt(jornada.inicioExpediente)}</div>
                        <div><strong>Fim expediente:</strong> {fmt(jornada.fimExpediente)}</div>
                        <div><strong>Distância total:</strong> {(calcularDistanciaTotal() / 1000).toFixed(2)} km</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div><strong>Almoço:</strong></div>
                        <div>Início: {fmt(jornada.almoco.inicio)}</div>
                        <div>Fim: {fmt(jornada.almoco.fim)}</div>
                      </div>
                    </div>
                  </Card>

                  <Card style={{ marginTop: 12 }}>
                    <Label>Atendimentos (ordem cronológica)</Label>
                    <div style={{ marginTop: 8 }}>
                      {jornada.atendimentos.map((att, i) => (
                        <div key={att.id} style={{ padding: 8, borderBottom: "1px dashed #00396b" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                              <strong>Atendimento {i + 1}</strong>
                              <div style={{ color: "#a9c3de", fontSize: ".9rem" }}>
                                Endereço: {att.endereco.rua || "—"} {att.endereco.numero || ""} — {att.endereco.bairro || ""} — {att.endereco.cidade || ""}
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                              <Btn onClick={() => { editarAtendimento(i); setPreviewOpen(false); }}>Editar</Btn>
                            </div>
                          </div>

                          <div style={{ marginTop: 6, color: "#9fb4d6" }}>
                            <div>Deslocamento: {fmt(att.deslocamentoInicio)}</div>
                            <div>Atendimento início: {fmt(att.atendimentoInicio)}</div>
                            <div>Finalizado: {fmt(att.finalizadoEm)}</div>
                            <div>GPS início: {att.gpsInicio?.lat},{att.gpsInicio?.lng}</div>
                            <div>GPS chegada: {att.gpsChegada?.lat},{att.gpsChegada?.lng}</div>
                            <div>Fotos: {att.fotos?.length || 0}</div>
                          </div>

                          {att.fotos && att.fotos.length > 0 && (
                            <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
                              {att.fotos.map((f, fi) => (
                                <div key={fi} style={{ width: 80, height: 80, borderRadius: 8, overflow: "hidden", border: "1px solid #00396b" }}>
                                  <img src={f.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card style={{ marginTop: 12 }}>
                    <Label>Assinatura</Label>
                    {!signatureEnabled && <div style={{ color: "#94a3b8" }}>Clique em "Finalizar expediente" para habilitar assinatura.</div>}
                    {signatureEnabled && (
                      <div>
                        <SignatureCanvas
                          ref={sigRef}
                          penColor="white"
                          canvasProps={{ width: 600, height: 200, style: { background: "#0f243b", borderRadius: 8, border: "1px solid #00396b" } }}
                        />
                        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                          <Btn onClick={() => sigRef.current.clear()}>Limpar assinatura</Btn>
                          <Btn $primary onClick={confirmarEncerrarJornada}>Confirmar e encerrar jornada</Btn>
                        </div>
                      </div>
                    )}
                  </Card>

                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* saved journeys */}
        <Card style={{ marginTop: ".8rem" }}>
          <Label>Jornadas salvas</Label>
          {saved.length === 0 && <div style={{ color: "#94a3b8" }}>Nenhuma jornada salva.</div>}
          {saved.map(j => (
            <div key={j.id} style={{ padding: "8px 0", borderBottom: "1px dashed #00396b" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <strong>{j.date}</strong>
                  <div style={{ color: "#a9c3de", fontSize: ".9rem" }}>
                    Início: {fmt(j.inicioExpediente)} • Fim: {fmt(j.fimExpediente)} • Atendimentos: {j.atendimentos?.length || 0}
                  </div>
                </div>
                <div>
                  <Btn onClick={() => {
                    setJornada(j);
                  }}>Carregar</Btn>
                </div>
              </div>
            </div>
          ))}
        </Card>

      </Content>
    </Overlay>
  );
}
