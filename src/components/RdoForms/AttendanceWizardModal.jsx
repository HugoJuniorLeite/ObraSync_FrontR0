// import { useEffect, useRef, useState } from "react";
// import styled from "styled-components";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   X,
//   ChevronLeft,
//   ChevronRight,
//   Check,
//   Trash2,
//   Plus,
// } from "lucide-react";
// import SignatureCanvas from "react-signature-canvas";

// /* ================== ESTILOS (mantive seu tema premium) ================== */
// const Overlay = styled.div`
//   position: fixed; inset: 0;
//   background: rgba(10, 15, 25, 0.85);
//   display: flex; justify-content: center; align-items: center;
//   z-index: 60;
// `;
// const Content = styled.div`
//   width: min(1000px, 96vw);
//   max-height: 92vh;
//   overflow: auto;
//   background: #1a2d45;
//   border: 1px solid #00396b;
//   border-radius: 14px;
//   padding: 1.2rem 1.2rem 1.6rem;
//   color: #e5f0ff;
//   box-shadow: 0 0 22px rgba(0, 57, 107, 0.45);
//   position: relative;
// `;
// const CloseBtn = styled.button`
//   position: absolute; top: 12px; right: 12px;
//   background: none; border: none; color: #e5f0ff; cursor: pointer;
//   &:hover { color:#f59e0b; }
// `;
// const Title = styled.h2`
//   color: #f59e0b; margin-bottom:.6rem; font-size: 1.35rem; font-weight: 700;
// `;
// const Sub = styled.p`
//   margin-bottom:1rem; color: #a9c3de; font-size: .95rem;
// `;

// const Progress = styled.div`
//   height: 8px; width: 100%; background:#0f243b; border-radius: 999px; overflow: hidden; margin-bottom: 1rem;
// `;
// const ProgressFill = styled.div`
//   height: 100%;
//   width: ${p => p.$pct}%;
//   background: linear-gradient(90deg,#38bdf8,#0ea5e9);
//   transition: width .3s ease;
// `;

// const Row = styled.div`
//   display: grid; gap: .8rem;
//   grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
//   margin-bottom: .8rem;
// `;
// const Field = styled.div`
//   display: flex; flex-direction: column; gap: 6px;
// `;
// const Label = styled.label`
//   font-size: .9rem; color: #94a3b8;
// `;
// const Input = styled.input`
//   padding: 10px 12px; border-radius: 8px; outline: none;
//   border: 1px solid #00396b; background:#10243a; color:#fff;
//   &:focus { box-shadow: 0 0 0 2px #38bdf866; border-color:#38bdf8; }
// `;
// const Textarea = styled.textarea`
//   padding: 10px 12px; border-radius: 8px; outline: none; resize: vertical;
//   border: 1px solid #00396b; background:#10243a; color:#fff;
//   &:focus { box-shadow: 0 0 0 2px #38bdf866; border-color:#38bdf8; }
// `;
// const Select = styled.select`
//   padding: 10px 12px; border-radius: 8px; outline: none;
//   border: 1px solid #00396b; background:#10243a; color:#fff;
//   &:focus { box-shadow:0 0 0 2px #38bdf866; border-color:#38bdf8; }
// `;

// const Card = styled.div`
//   background:#0f243b; border:1px solid #00396b; border-radius:10px;
//   padding: 14px; margin-top: .6rem;
// `;

// const Banner = styled.div`
//   background: linear-gradient(90deg,#0ea5e9,#2563eb);
//   color: white;
//   padding: 10px 12px;
//   border-radius: 10px;
//   display:flex;
//   align-items:center;
//   gap:12px;
//   margin-bottom:12px;
//   box-shadow: 0 6px 18px rgba(13,71,161,0.12);
// `;

// const TimelineItem = styled.div`
//   display:flex;
//   gap:10px;
//   align-items:flex-start;
//   margin-bottom:10px;
//   color:#cfe9ff;
// `;
// const TimeDot = styled.div`
//   width:10px; height:10px; border-radius:999px; background:#38bdf8; margin-top:6px;
// `;

// const Bar = styled.div`
//   display:flex; justify-content: space-between; gap:.6rem; margin-top: 1rem;
//   align-items:center;
// `;
// const Btn = styled.button`
//   display:flex; align-items:center; gap:8px; cursor:pointer;
//   padding:.65rem 1rem; border-radius:10px; font-weight:700;
//   border: 1px solid ${p => p.$primary ? "#38bdf8" : "#00396b"};
//   background: ${p => p.$primary ? "#38bdf8" : "#00396b"};
//   color: ${p => p.$primary ? "#0f172a" : "#e8f2ff"};
//   &:hover { filter: brightness(1.07); }
//   &:disabled { opacity: .5; cursor: not-allowed; }
// `;

// const ImgThumb = styled.div`
//   position: relative;
//   width:90px; height:90px;
//   border-radius:10px; overflow:hidden;
//   border:1px solid #00396b;
//   img { width:100%; height:100%; object-fit:cover; }
//   button {
//     position:absolute; top:-6px; right:-6px;
//     background:#e11d48; border:none; color:white;
//     border-radius:50%; width:22px; height:22px; cursor:pointer;
//   }
// `;

// /* ================== HELPERS ================== */
// const fmt = (d) => d ? new Date(d).toLocaleString("pt-BR") : "—";
// const nowISO = () => new Date().toISOString();

// const getLocation = () =>
//   new Promise((resolve) => {
//     if (!navigator.geolocation) return resolve(null);
//     navigator.geolocation.getCurrentPosition(
//       pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
//       () => resolve(null),
//       { enableHighAccuracy: true }
//     );
//   });

// // haversine distance (meters)
// const haversine = (a, b) => {
//   if (!a || !b || a.lat === "" || b.lat === "") return 0;
//   const toRad = (v) => (v * Math.PI) / 180;
//   const R = 6371000; // meters
//   const dLat = toRad(b.lat - a.lat);
//   const dLon = toRad(b.lng - a.lng);
//   const lat1 = toRad(a.lat);
//   const lat2 = toRad(b.lat);
//   const sinDlat = Math.sin(dLat / 2) ** 2;
//   const sinDlon = Math.sin(dLon / 2) ** 2;
//   const aCalc = sinDlat + Math.cos(lat1) * Math.cos(lat2) * sinDlon;
//   const c = 2 * Math.atan2(Math.sqrt(aCalc), Math.sqrt(1 - aCalc));
//   return R * c;
// };

// /* ================== BASE FIXA (conforme sua escolha A) ================== */
// /* Endereço: Rua Bom Pastor, 975 — Ipiranga, SP
//    Coordenadas adotadas (fonte de CEP/mapa): lat: -23.57647, lng: -46.60864 */
// const BASE_COORDS = { lat: -23.57647, lng: -46.60864 };

// /* ================== COMPONENTE ================== */
// export default function AttendanceWizardModal({ onClose }) {
//   const DRAFT = "atendimentoDraftV4_base";
//   const SAVED = "atendimentosV4_base";

//   const [jornada, setJornada] = useState(() => {
//     const d = localStorage.getItem(DRAFT);
//     if (d) try { return JSON.parse(d); } catch { }
//     return {
//       date: new Date().toISOString().slice(0, 10),
//       inicioExpediente: "",
//       fimExpediente: "",
//       expedienteGps: null,
//       almoco: { inicio: "", fim: "", latInicio: "", lngInicio: "", latFim: "", lngFim: "", justificativa: "" },
//       atendimentos: [],
//       baseLogs: [],
//     };
//   });

//   const [currentAtendimentoIndex, setCurrentAtendimentoIndex] = useState(null);
//   const [mode, setMode] = useState("idle"); // idle | preenchendo | deslocando | emAtendimento | finalizado | retornoDeslocamento | retornoBase | editMode
//   const [fotosTemp, setFotosTemp] = useState([]);
//   const sigRef = useRef(null);

//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [signatureEnabled, setSignatureEnabled] = useState(false);
//   const [saved, setSaved] = useState([]);
//   useEffect(() => {
//     try { setSaved(JSON.parse(localStorage.getItem(SAVED) || "[]")); } catch { }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem(DRAFT, JSON.stringify(jornada));
//   }, [jornada]);

//   /* ===== helpers para criar atendimento ===== */
//   const criarAtendimentoVazio = () => ({
//     id: crypto.randomUUID(),
//     tipo: "externo", // externo | interno
//     ordemTipo: "3", // para externo
//     ordemPrefixo: "100000", // para interno/prefixo exibido
//     ordemNumero: "", // 6 dígitos
//     endereco: { cep: "", rua: "", numero: "", bairro: "", cidade: "", estado: "" },
//     deslocamentoInicio: "",
//     atendimentoInicio: "",
//     finalizadoEm: "",
//     gpsInicio: { lat: "", lng: "" },
//     gpsChegada: { lat: "", lng: "" },
//     fotos: [],
//     notas: ""
//   });

//   /* ===== iniciar novo atendimento: abre o formulário preenchimento ===== */
//   const iniciarPreenchimentoAtendimento = (tipo = "externo") => {
//     // cria atendimento and open filling mode
//     setJornada(j => {
//       const copy = { ...j };
//       const novo = criarAtendimentoVazio();
//       novo.tipo = tipo;
//       if (tipo === "interno") { novo.ordemPrefixo = "100000"; novo.ordemTipo = "100000"; }
//       copy.atendimentos = [...copy.atendimentos, novo];
//       const idx = copy.atendimentos.length - 1;
//       setCurrentAtendimentoIndex(idx);
//       setMode("preenchendo");
//       return copy;
//     });
//   };

//   /* ===== buscar CEP para atendimento atual ===== */
//   const buscarCep = async (cep, idx) => {
//     const c = (cep || "").toString().replace(/\D/g, "");
//     if (c.length !== 8) return;
//     try {
//       const r = await fetch(`https://viacep.com.br/ws/${c}/json/`);
//       const j = await r.json();
//       if (!j.erro) {
//         setJornada(old => {
//           const copy = { ...old };
//           const att = { ...copy.atendimentos[idx] };
//           att.endereco = { ...att.endereco, rua: j.logradouro, bairro: j.bairro, cidade: j.localidade, estado: j.uf, cep: c };
//           copy.atendimentos[idx] = att;
//           return copy;
//         });
//       }
//     } catch { }
//   };

//   const handleFotosTemp = (e) => {
//     const arr = [...e.target.files].map(f => ({ file: f, url: URL.createObjectURL(f) }));
//     setFotosTemp(prev => [...prev, ...arr]);
//     if (currentAtendimentoIndex !== null) {
//       setJornada(j => {
//         const copy = { ...j };
//         const att = { ...copy.atendimentos[currentAtendimentoIndex] };
//         att.fotos = [...att.fotos, ...arr];
//         copy.atendimentos[currentAtendimentoIndex] = att;
//         return copy;
//       });
//     }
//   };
//   const removeFotoTemp = (url) => {
//     setFotosTemp(prev => prev.filter(f => f.url !== url));
//     if (currentAtendimentoIndex !== null) {
//       setJornada(j => {
//         const copy = { ...j };
//         const att = { ...copy.atendimentos[currentAtendimentoIndex] };
//         att.fotos = att.fotos.filter(f => f.url !== url);
//         copy.atendimentos[currentAtendimentoIndex] = att;
//         return copy;
//       });
//     }
//   };

//   /* ===== iniciar deslocamento (coleta hora + gps) ===== */
//   const iniciarDeslocamentoAtendimento = async () => {
//     if (currentAtendimentoIndex === null) return;
//     const att = jornada.atendimentos[currentAtendimentoIndex];
//     if (!att.ordemNumero || !/^\d{6}$/.test(att.ordemNumero)) {
//       alert("Informe o número da OS com 6 dígitos antes de iniciar deslocamento.");
//       return;
//     }
//     const loc = await getLocation();
//     setJornada(j => {
//       const copy = { ...j };
//       const a = { ...copy.atendimentos[currentAtendimentoIndex] };
//       if (!a.deslocamentoInicio) {
//         a.deslocamentoInicio = nowISO();
//         a.gpsInicio = { lat: loc?.lat || "", lng: loc?.lng || "" };
//       }
//       copy.atendimentos[currentAtendimentoIndex] = a;
//       if (!copy.inicioExpediente) copy.inicioExpediente = nowISO();
//       setMode("deslocando");
//       return copy;
//     });
//   };

//   /* ===== iniciar atendimento ===== */
//   const iniciarAtendimento = async () => {
//     if (currentAtendimentoIndex === null) return;
//     const loc = await getLocation();
//     setJornada(j => {
//       const copy = { ...j };
//       const a = { ...copy.atendimentos[currentAtendimentoIndex] };
//       if (!a.atendimentoInicio) {
//         a.atendimentoInicio = nowISO();
//         if (!a.gpsInicio || !a.gpsInicio.lat) a.gpsInicio = { lat: loc?.lat || "", lng: loc?.lng || "" };
//       }
//       copy.atendimentos[currentAtendimentoIndex] = a;
//       setMode("emAtendimento");
//       return copy;
//     });
//   };

//   /* ===== concluir atendimento ===== */
//   const concluirAtendimento = async () => {
//     if (currentAtendimentoIndex === null) return;
//     const loc = await getLocation();
//     setJornada(j => {
//       const copy = { ...j };
//       const a = { ...copy.atendimentos[currentAtendimentoIndex] };
//       a.finalizadoEm = nowISO();
//       a.gpsChegada = { lat: loc?.lat || "", lng: loc?.lng || "" };
//       copy.atendimentos[currentAtendimentoIndex] = a;
//       setMode("finalizado");
//       return copy;
//     });
//   };

//   /* ===== retorno à base: iniciar deslocamento para base ===== */
//   const iniciarDeslocamentoParaBase = async () => {
//     const loc = await getLocation();
//     setJornada(j => {
//       const copy = { ...j };
//       copy.baseLogs = [...copy.baseLogs, { id: crypto.randomUUID(), tipo: "deslocamentoParaBase", time: nowISO(), gps: { lat: loc?.lat || "", lng: loc?.lng || "" } }];
//       setMode("retornoDeslocamento");
//       return copy;
//     });
//   };

//   /* ===== marcar chegada à base ===== */
//   const marcarChegadaBase = async () => {
//     const loc = await getLocation();
//     setJornada(j => {
//       const copy = { ...j };
//       copy.baseLogs = [...copy.baseLogs, { id: crypto.randomUUID(), tipo: "chegadaBase", time: nowISO(), gps: { lat: loc?.lat || "", lng: loc?.lng || "" } }];
//       setMode("idle");
//       setCurrentAtendimentoIndex(null);
//       return copy;
//     });
//   };

//   /* ===== calcular distancia total ===== */
//   const calcularDistanciaTotal = () => {
//     const points = [];
//     jornada.atendimentos.forEach(att => {
//       if (att.gpsInicio && att.gpsInicio.lat) points.push(att.gpsInicio);
//       if (att.gpsChegada && att.gpsChegada.lat) points.push(att.gpsChegada);
//     });
//     jornada.baseLogs.forEach(l => {
//       if (l.gps && l.gps.lat) points.push(l.gps);
//     });
//     let total = 0;
//     for (let i = 1; i < points.length; i++) total += haversine(points[i - 1], points[i]);
//     return Math.round(total);
//   };

//   /* ===== distância estimada até a base (a partir da última posição conhecida) ===== */
//   const distanciaAteBase = () => {
//     // prefer last gpsChegada of last atendimento, senão gpsInicio, senão last base log gps
//     const lastAtt = jornada.atendimentos.slice().reverse().find(a => a.gpsChegada?.lat || a.gpsInicio?.lat);
//     let lastPos = null;
//     if (lastAtt) {
//       if (lastAtt.gpsChegada && lastAtt.gpsChegada.lat) lastPos = lastAtt.gpsChegada;
//       else if (lastAtt.gpsInicio && lastAtt.gpsInicio.lat) lastPos = lastAtt.gpsInicio;
//     } else if (jornada.baseLogs.length) {
//       const lastLog = jornada.baseLogs[jornada.baseLogs.length - 1];
//       if (lastLog.gps && lastLog.gps.lat) lastPos = lastLog.gps;
//     }
//     if (!lastPos) return null;
//     const meters = haversine(lastPos, BASE_COORDS);
//     return meters; // meters
//   };

//   const finalizarExpediente = async () => {
//     const loc = await getLocation();
//     setJornada(j => ({ ...j, fimExpediente: nowISO(), expedienteGps: { lat: loc?.lat || "", lng: loc?.lng || "" } }));
//     setSignatureEnabled(true);
//     setPreviewOpen(true);
//   };

//   const editarAtendimento = (idx) => {
//     setCurrentAtendimentoIndex(idx);
//     setMode("editMode");
//     setFotosTemp(jornada.atendimentos[idx].fotos || []);
//   };
//   const salvarEdicaoAtendimento = () => {
//     setMode("idle");
//     setCurrentAtendimentoIndex(null);
//     setFotosTemp([]);
//   };

//   const confirmarEncerrarJornada = () => {
//     const assinatura = sigRef.current?.toDataURL();
//     const registro = { ...jornada, assinatura, id: crypto.randomUUID() };
//     const arr = [...saved, registro];
//     setSaved(arr);
//     localStorage.setItem(SAVED, JSON.stringify(arr));
//     localStorage.removeItem(DRAFT);
//     setJornada({
//       date: new Date().toISOString().slice(0, 10),
//       inicioExpediente: "",
//       fimExpediente: "",
//       expedienteGps: null,
//       almoco: { inicio: "", fim: "", latInicio: "", lngInicio: "", latFim: "", lngFim: "", justificativa: "" },
//       atendimentos: [],
//       baseLogs: [],
//     });
//     setMode("idle");
//     setCurrentAtendimentoIndex(null);
//     setFotosTemp([]);
//     sigRef.current?.clear();
//     setSignatureEnabled(false);
//     setPreviewOpen(false);
//   };

//   const removerAtendimento = (idx) => {
//     setJornada(j => {
//       const copy = { ...j };
//       copy.atendimentos = copy.atendimentos.filter((_, i) => i !== idx);
//       return copy;
//     });
//   };

//   const pct = (() => {
//     const map = { idle: 5, preenchendo: 20, deslocando: 40, emAtendimento: 60, finalizado: 80, retornoDeslocamento: 50, retornoBase: 70, editMode: 50 };
//     return map[mode] || 0;
//   })();

//   const variants = { hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -20 } };

//   /* ===== montar timeline de eventos (cronológico) ===== */
//   const montarTimeline = () => {
//     const events = [];
//     if (jornada.inicioExpediente) events.push({ time: jornada.inicioExpediente, label: "Expediente iniciado", type: "start" });
//     jornada.atendimentos.forEach((a, i) => {
//       if (a.deslocamentoInicio) events.push({ time: a.deslocamentoInicio, label: `Deslocamento para OS ${a.tipo === "interno" ? `${a.ordemPrefixo}-${a.ordemNumero}` : `${a.ordemTipo}-${a.ordemNumero}`}`, type: "desloc" });
//       if (a.atendimentoInicio) events.push({ time: a.atendimentoInicio, label: `Início atendimento ${i + 1}`, type: "startService" });
//       if (a.finalizadoEm) events.push({ time: a.finalizadoEm, label: `Atendimento concluído ${i + 1}`, type: "endService" });
//     });
//     jornada.baseLogs.forEach((l) => {
//       if (l.tipo === "deslocamentoParaBase") events.push({ time: l.time, label: "Deslocamento para base", type: "retBaseStart" });
//       if (l.tipo === "chegadaBase") events.push({ time: l.time, label: "Chegada à base", type: "retBaseEnd" });
//     });
//     // ALMOÇO — exibido como um bloco claro e equivalente às atividades
//     if (jornada.almoco.inicio) {
//       events.push({
//         time: jornada.almoco.inicio,
//         label: `🍽️ Almoço — início às ${fmt(jornada.almoco.inicio)}`,
//         type: "lunchStart"
//       });
//     }

//     if (jornada.almoco.fim) {
//       events.push({
//         time: jornada.almoco.fim,
//         label: `🍽️ Almoço — término às ${fmt(jornada.almoco.fim)}`,
//         type: "lunchEnd"
//       });
//     }


//     if (jornada.fimExpediente) events.push({ time: jornada.fimExpediente, label: "Expediente finalizado", type: "end" });
//     // sort by time
//     return events.sort((a, b) => new Date(a.time) - new Date(b.time));
//   };

//   /* ===== distância em km helper para exibição do banner ===== */
//   const formatKm = (meters) => (meters === null ? "—" : (meters / 1000).toFixed(2) + " km");


//   /* ===== Helpers de duração ===== */
//   const calcDurationMs = (start, end) => {
//     if (!start || !end) return 0;
//     try {
//       return new Date(end) - new Date(start);
//     } catch {
//       return 0;
//     }
//   };

//   const msToHuman = (ms) => {
//     if (ms <= 0) return "0 min";
//     const min = Math.floor(ms / 60000);
//     const h = Math.floor(min / 60);
//     const m = min % 60;
//     if (h > 0) return `${h}h ${m}min`;
//     return `${m}min`;
//   };

//   /* ===== Cálculo completo do dia ===== */
//   const calcularTotais = () => {
//     let atendimentoMs = 0;
//     let deslocamentoMs = 0;

//     jornada.atendimentos.forEach((att) => {
//       // tempo de atendimento
//       atendimentoMs += calcDurationMs(att.atendimentoInicio, att.finalizadoEm);

//       // deslocamento para o atendimento
//       deslocamentoMs += calcDurationMs(att.deslocamentoInicio, att.atendimentoInicio);

//       // deslocamento após o atendimento (até o próximo ponto)
//       if (att.finalizadoEm) {
//         const next = jornada.atendimentos.find(a => new Date(a.deslocamentoInicio) > new Date(att.finalizadoEm));
//         if (next) {
//           deslocamentoMs += calcDurationMs(att.finalizadoEm, next.deslocamentoInicio);
//         }
//       }
//     });

//     // deslocamentos registrados no retorno à base
//     for (let i = 0; i < jornada.baseLogs.length; i += 2) {
//       const ini = jornada.baseLogs[i];
//       const fim = jornada.baseLogs[i + 1];
//       if (ini && fim && ini.tipo === "deslocamentoParaBase" && fim.tipo === "chegadaBase") {
//         deslocamentoMs += calcDurationMs(ini.time, fim.time);
//       }
//     }

//     // almoço
//     const almocoMs = calcDurationMs(jornada.almoco.inicio, jornada.almoco.fim);

//     return {
//       atendimentoMs,
//       deslocamentoMs,
//       almocoMs
//     };
//   };

//   /* ===== TOTAL DA JORNADA ===== */
//   const calcularJornadaTotal = () => {
//     return calcDurationMs(jornada.inicioExpediente, jornada.fimExpediente);
//   };

//   /* ===== OCIOSIDADE ===== */
//   const calcularOciosidade = () => {
//     const total = calcularJornadaTotal();
//     const { atendimentoMs, deslocamentoMs, almocoMs } = calcularTotais();
//     const usado = atendimentoMs + deslocamentoMs + almocoMs;
//     return total - usado;
//   };

//   /* ===== PRODUTIVIDADE ===== */
//   const calcularProdutividade = () => {
//     const total = calcularJornadaTotal();
//     const { atendimentoMs } = calcularTotais();
//     if (total <= 0) return 0;
//     return Math.round((atendimentoMs / total) * 100);
//   };



//   return (
//     <Overlay>
//       <Content>
//         <CloseBtn onClick={onClose}><X size={20} /></CloseBtn>

//         <Title>Novo Atendimento - Jornada</Title>
//         <Sub>Fluxo de atendimento com base fixa, indicador de retorno e timeline do dia.</Sub>

//         {/* BANNER: quando estiver em deslocamento para a base */}
//         {mode === "retornoDeslocamento" && (
//           <Banner>
//             <div style={{ fontWeight: 700 }}>🏁 Retornando à Base</div>
//             <div style={{ color: "#e6f7ff" }}>Deslocamento iniciado: {fmt(jornada.baseLogs[jornada.baseLogs.length - 1]?.time)}</div>
//             <div style={{ marginLeft: "auto", fontWeight: 700 }}>
//               Distância estimada até a base: {formatKm(distanciaAteBase())}
//             </div>
//           </Banner>
//         )}

//         {/* ================= ALMOÇO (sempre visível) ================= */}
//         <Card style={{ marginBottom: "1rem", borderColor: "#2563eb" }}>
//           <Label style={{ fontSize: "1rem", color: "#93c5fd" }}>
//             Registro de Pausa para Almoço
//           </Label>

//           <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.4rem" }}>
//             <Btn
//               $primary
//               onClick={async () => {
//                 const loc = await getLocation();
//                 setJornada(j => ({ ...j, almoco: { ...j.almoco, inicio: nowISO(), latInicio: loc?.lat || "", lngInicio: loc?.lng || "" } }));
//               }}
//               style={{ opacity: jornada.almoco.inicio ? 0.5 : 1 }}
//               disabled={!!jornada.almoco.inicio}
//             >
//               <Check size={18} /> Iniciar Almoço
//             </Btn>

//             <Btn
//               onClick={async () => {
//                 const loc = await getLocation();
//                 setJornada(j => ({ ...j, almoco: { ...j.almoco, fim: nowISO(), latFim: loc?.lat || "", lngFim: loc?.lng || "" } }));
//               }}
//               style={{
//                 background: "#0ea5e9",
//                 borderColor: "#0ea5e9",
//                 opacity: !jornada.almoco.inicio || jornada.almoco.fim ? 0.5 : 1
//               }}
//               disabled={!jornada.almoco.inicio || !!jornada.almoco.fim}
//             >
//               <Check size={18} /> Finalizar Almoço
//             </Btn>
//           </div>

//           {jornada.almoco.inicio && (
//             <div style={{ marginTop: "0.8rem", fontSize: ".9rem" }}>
//               <p>
//                 <strong>Início:</strong> {fmt(jornada.almoco.inicio)}
//                 <br />
//                 <span style={{ color: "#60a5fa" }}>
//                   Local: {jornada.almoco.latInicio}, {jornada.almoco.lngInicio}
//                 </span>
//               </p>

//               {jornada.almoco.fim && (
//                 <p style={{ marginTop: "0.6rem" }}>
//                   <strong>Fim:</strong> {fmt(jornada.almoco.fim)}
//                   <br />
//                   <span style={{ color: "#34d399" }}>
//                     Local: {jornada.almoco.latFim}, {jornada.almoco.lngFim}
//                   </span>
//                 </p>
//               )}
//             </div>
//           )}
//         </Card>

//         <Progress><ProgressFill $pct={pct} /></Progress>

//         <AnimatePresence mode="wait">
//           <motion.div key="main" variants={variants} initial="hidden" animate="visible" exit="exit">
//             {/* area principal: seleção tipo atendimento e preenchimento (mesmo passo) */}
//             <Card>
//               <Label>Iniciar novo atendimento</Label>

//               <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
//                 <Btn onClick={() => iniciarPreenchimentoAtendimento("externo")}>Iniciar atendimento Externo</Btn>
//                 <Btn onClick={() => iniciarPreenchimentoAtendimento("interno")}>Iniciar atendimento Interno</Btn>
//               </div>

//               {/* Formulário do atendimento atual (quando currentAtendimentoIndex != null) */}
//               {currentAtendimentoIndex !== null && (
//                 <div style={{ marginTop: 12 }}>
//                   <Card style={{ background: "#071827" }}>
//                     <Label>Dados do atendimento</Label>
//                     {(() => {
//                       const att = jornada.atendimentos[currentAtendimentoIndex];
//                       if (!att) return null;
//                       return (
//                         <>
//                           <Row>
//                             <Field>
//                               <Label>Tipo</Label>
//                               <div style={{ display: "flex", gap: 8 }}>
//                                 <Select value={att.tipo} onChange={(e) => {
//                                   const val = e.target.value;
//                                   setJornada(j => {
//                                     const copy = { ...j };
//                                     copy.atendimentos[currentAtendimentoIndex].tipo = val;
//                                     if (val === "interno") { copy.atendimentos[currentAtendimentoIndex].ordemPrefixo = "100000"; copy.atendimentos[currentAtendimentoIndex].ordemTipo = "100000"; }
//                                     return copy;
//                                   });
//                                 }}>
//                                   <option value="externo">Externo</option>
//                                   <option value="interno">Interno</option>
//                                 </Select>
//                               </div>
//                             </Field>

//                             {/* ordem / prefixo + numero (6 digitos) */}
//                             <Field>
//                               <Label>Ordem</Label>
//                               <div style={{ display: "flex", gap: 6 }}>
//                                 {att.tipo === "interno" ? (
//                                   <>
//                                     <Input value={att.ordemPrefixo} readOnly style={{ width: 120, textAlign: "center", background: "#0b2132" }} />
//                                     <Input placeholder="000000" value={att.ordemNumero} onChange={(e) => {
//                                       const v = e.target.value.replace(/\D/g, "").slice(0, 6);
//                                       setJornada(j => {
//                                         const copy = { ...j };
//                                         copy.atendimentos[currentAtendimentoIndex].ordemNumero = v;
//                                         return copy;
//                                       });
//                                     }} style={{ width: 120, textAlign: "center" }} />
//                                   </>
//                                 ) : (
//                                   <>
//                                     <Select value={att.ordemTipo} onChange={(e) => {
//                                       const v = e.target.value;
//                                       setJornada(j => {
//                                         const copy = { ...j };
//                                         copy.atendimentos[currentAtendimentoIndex].ordemTipo = v;
//                                         return copy;
//                                       });
//                                     }} style={{ width: 120 }}>
//                                       <option value="3">3</option>
//                                       <option value="7">7</option>
//                                       <option value="100000">100000</option>
//                                     </Select>
//                                     <Input placeholder="000000" value={att.ordemNumero} onChange={(e) => {
//                                       const v = e.target.value.replace(/\D/g, "").slice(0, 6);
//                                       setJornada(j => {
//                                         const copy = { ...j };
//                                         copy.atendimentos[currentAtendimentoIndex].ordemNumero = v;
//                                         return copy;
//                                       });
//                                     }} style={{ width: 120, textAlign: "center" }} />
//                                   </>
//                                 )}
//                               </div>
//                               <div style={{ fontSize: ".85rem", color: "#94a3b8", marginTop: 6 }}>
//                                 Número com 6 dígitos obrigatório para iniciar deslocamento.
//                               </div>
//                             </Field>
//                           </Row>

//                           {/* ENDEREÇO (no mesmo passo) */}
//                           <div style={{ marginTop: 12 }}>
//                             <Label>Endereço do chamado</Label>
//                             <Row>
//                               <Field>
//                                 <Label>CEP</Label>
//                                 <Input value={att.endereco.cep || ""} onChange={(e) => {
//                                   const v = e.target.value.replace(/\D/g, "").slice(0, 8);
//                                   setJornada(j => {
//                                     const copy = { ...j };
//                                     copy.atendimentos[currentAtendimentoIndex].endereco.cep = v;
//                                     return copy;
//                                   });
//                                 }} onBlur={(e) => buscarCep(e.target.value, currentAtendimentoIndex)} placeholder="00000000" />
//                               </Field>
//                               <Field>
//                                 <Label>Rua</Label>
//                                 <Input value={att.endereco.rua || ""} onChange={(e) => {
//                                   const v = e.target.value;
//                                   setJornada(j => {
//                                     const copy = { ...j };
//                                     copy.atendimentos[currentAtendimentoIndex].endereco.rua = v;
//                                     return copy;
//                                   });
//                                 }} />
//                               </Field>
//                               <Field>
//                                 <Label>Número</Label>
//                                 <Input value={att.endereco.numero || ""} onChange={(e) => {
//                                   const v = e.target.value;
//                                   setJornada(j => {
//                                     const copy = { ...j };
//                                     copy.atendimentos[currentAtendimentoIndex].endereco.numero = v;
//                                     return copy;
//                                   });
//                                 }} />
//                               </Field>
//                             </Row>
//                             <Row>
//                               <Field>
//                                 <Label>Bairro</Label>
//                                 <Input value={att.endereco.bairro || ""} onChange={(e) => {
//                                   const v = e.target.value;
//                                   setJornada(j => {
//                                     const copy = { ...j };
//                                     copy.atendimentos[currentAtendimentoIndex].endereco.bairro = v;
//                                     return copy;
//                                   });
//                                 }} />
//                               </Field>
//                               <Field>
//                                 <Label>Cidade</Label>
//                                 <Input value={att.endereco.cidade || ""} onChange={(e) => {
//                                   const v = e.target.value;
//                                   setJornada(j => {
//                                     const copy = { ...j };
//                                     copy.atendimentos[currentAtendimentoIndex].endereco.cidade = v;
//                                     return copy;
//                                   });
//                                 }} />
//                               </Field>
//                               <Field>
//                                 <Label>Estado</Label>
//                                 <Input value={att.endereco.estado || ""} onChange={(e) => {
//                                   const v = e.target.value;
//                                   setJornada(j => {
//                                     const copy = { ...j };
//                                     copy.atendimentos[currentAtendimentoIndex].endereco.estado = v;
//                                     return copy;
//                                   });
//                                 }} />
//                               </Field>
//                             </Row>
//                           </div>

//                           {/* Fotos / notas */}
//                           <div style={{ marginTop: 10 }}>
//                             <Label>Fotos / Notas</Label>
//                             <Input type="file" multiple accept="image/*" onChange={handleFotosTemp} />
//                             <Row style={{ marginTop: 8 }}>
//                               {(att.fotos || []).map(p => (
//                                 <ImgThumb key={p.url}>
//                                   <img src={p.url} />
//                                   <button onClick={() => removeFotoTemp(p.url)}><Trash2 size={14} /></button>
//                                 </ImgThumb>
//                               ))}
//                             </Row>
//                             <div style={{ marginTop: 8 }}>
//                               <Textarea placeholder="Notas do atendimento" value={att.notas || ""} onChange={(e) => {
//                                 const v = e.target.value;
//                                 setJornada(j => {
//                                   const copy = { ...j };
//                                   copy.atendimentos[currentAtendimentoIndex].notas = v;
//                                   return copy;
//                                 });
//                               }} rows={3} />
//                             </div>
//                           </div>

//                           {/* Ações: iniciar deslocamento / iniciar atendimento / concluir atendimento */}
//                           <Bar style={{ marginTop: 12 }}>
//                             <div />
//                             <div style={{ display: "flex", gap: 8 }}>
//                               <Btn onClick={iniciarDeslocamentoAtendimento} disabled={!!att.deslocamentoInicio}><Check size={14} /> Iniciar deslocamento</Btn>
//                               <Btn onClick={iniciarAtendimento} disabled={!att.deslocamentoInicio || !!att.atendimentoInicio}><Check size={14} /> Iniciar atendimento</Btn>
//                               <Btn onClick={concluirAtendimento} disabled={!att.atendimentoInicio || !!att.finalizadoEm}><Check size={14} /> Concluir atendimento</Btn>
//                             </div>
//                           </Bar>

//                           {/* Se finalizado, oferecer retorno ou novo atendimento */}
//                           {att.finalizadoEm && (
//                             <>
//                               {mode !== "retornoDeslocamento" && (
//                                 <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
//                                   <Btn onClick={iniciarDeslocamentoParaBase}>
//                                     Retorno à base (iniciar deslocamento)
//                                   </Btn>
//                                   <Btn onClick={() => iniciarPreenchimentoAtendimento("externo")}>
//                                     Novo atendimento
//                                   </Btn>
//                                 </div>
//                               )}

//                               {/* Se está em deslocamento para a base mostrar card com botão chegada */}
//                               {mode === "retornoDeslocamento" && (
//                                 <Card style={{ marginTop: 12, borderColor: "#2563eb" }}>
//                                   <div style={{ fontSize: ".95rem", marginBottom: 6 }}>
//                                     <strong>Retorno à Base:</strong> deslocamento iniciado em:
//                                     <br />
//                                     {fmt(jornada.baseLogs[jornada.baseLogs.length - 1]?.time)}
//                                   </div>

//                                   <div style={{ marginBottom: 8 }}>
//                                     <div style={{ color: "#a9c3de" }}>Distância estimada até a base: {formatKm(distanciaAteBase())}</div>
//                                   </div>

//                                   <Btn
//                                     $primary
//                                     onClick={marcarChegadaBase}
//                                     style={{ marginTop: 8 }}
//                                   >
//                                     Registrar chegada à base
//                                   </Btn>
//                                 </Card>
//                               )}
//                             </>
//                           )}

//                         </>
//                       );
//                     })()}
//                   </Card>
//                 </div>
//               )}

//             </Card>

//             {/* Lista de atendimentos do dia */}
//             <Card style={{ marginTop: ".8rem" }}>
//               <Label>Atendimentos do dia</Label>
//               <div style={{ marginTop: ".6rem" }}>
//                 {jornada.atendimentos.length === 0 && <div style={{ color: "#94a3b8" }}>Nenhum atendimento registrado ainda.</div>}
//                 {jornada.atendimentos.map((a, idx) => (
//                   <div key={a.id} style={{ padding: "10px 0", borderBottom: "1px dashed #00396b" }}>
//                     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                       <div>
//                         <strong>{a.tipo === "interno" ? `OS ${a.ordemPrefixo}-${a.ordemNumero}` : `OS ${a.ordemTipo}-${a.ordemNumero}`}</strong>
//                         <div style={{ fontSize: ".9rem", color: "#a9c3de" }}>
//                           Desloc: {fmt(a.deslocamentoInicio)} • Início: {fmt(a.atendimentoInicio)} • Finalizado: {fmt(a.finalizadoEm)}
//                         </div>
//                       </div>
//                       <div style={{ display: "flex", gap: ".5rem" }}>
//                         <Btn onClick={() => editarAtendimento(idx)}>Editar</Btn>
//                         <Btn onClick={() => removerAtendimento(idx)}>Remover</Btn>
//                       </div>
//                     </div>
//                     <div style={{ marginTop: ".6rem", fontSize: ".9rem", color: "#94a3b8" }}>
//                       Endereço: {a.endereco.rua || "—"} {a.endereco.numero || ""} — {a.endereco.bairro || ""} — {a.endereco.cidade || ""}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </Card>

//             {/* Footer actions */}
//             <Bar style={{ marginTop: "1rem" }}>
//               <div style={{ display: "flex", gap: ".6rem" }}>
//                 <Btn onClick={() => iniciarPreenchimentoAtendimento("externo")}><Plus size={14} /> Novo atendimento</Btn>
//               </div>

//               <div style={{ display: "flex", gap: ".6rem", alignItems: "center" }}>
//                 <div style={{ color: "#94a3b8", fontSize: ".9rem" }}>Distância estimada total: {(calcularDistanciaTotal() / 1000).toFixed(2)} km</div>
//                 <Btn onClick={finalizarExpediente} $primary>Finalizar expediente</Btn>
//               </div>

//             </Bar>

//             {/* TIMELINE */}
//             <Card style={{ marginTop: 12 }}>
//               <Label>Linha do tempo</Label>
//               <div style={{ marginTop: 10 }}>
//                 {montarTimeline().length === 0 && <div style={{ color: "#94a3b8" }}>Nenhuma atividade registrada ainda.</div>}
//                 {montarTimeline().map((ev, i) => (
//                   <TimelineItem key={i}>
//                     <TimeDot />
//                     <div>
//                       <div style={{ fontWeight: 700 }}>{ev.label}</div>
//                       <div style={{ fontSize: ".9rem", color: "#a9c3de" }}>{fmt(ev.time)}</div>
//                     </div>
//                   </TimelineItem>
//                 ))}
//               </div>

//               {/* Totais do dia */}
//               {(() => {
//                 const { atendimentoMs, deslocamentoMs, almocoMs } = calcularTotais();
//                 return (
//                   <div style={{
//                     background: "#0d2236",
//                     padding: "10px 14px",
//                     borderRadius: "10px",
//                     border: "1px solid #00396b",
//                     color: "#dbeafe",
//                     fontSize: ".9rem",
//                     marginBottom: "10px",
//                     width: "100%"
//                   }}>
//                     <div><strong>Tempo em atendimento:</strong> {msToHuman(atendimentoMs)}</div>
//                     <div><strong>Tempo em Deslocamento:</strong> {msToHuman(deslocamentoMs)}</div>
//                     <div><strong>Tempo em Almoço:</strong> {msToHuman(almocoMs)}</div>
//                   </div>
//                 );
//               })()}

//               {/* PAINEL DO DIA */}
//               {(() => {
//                 const jornadaMs = calcularJornadaTotal();
//                 const { atendimentoMs, deslocamentoMs, almocoMs } = calcularTotais();
//                 const ociosidadeMs = calcularOciosidade();
//                 const produtividade = calcularProdutividade();

//                 return (
//                   <div style={{
//                     background: "#0a1c2d",
//                     padding: "14px",
//                     borderRadius: "12px",
//                     border: "1px solid #004a7c",
//                     color: "#dbeafe",
//                     fontSize: ".95rem",
//                     marginBottom: "18px",
//                     marginTop: "10px",
//                     boxShadow: "0 3px 14px rgba(0,0,0,0.25)"
//                   }}>
//                     <div style={{ fontWeight: "700", color: "#60a5fa", marginBottom: "8px" }}>
//                       📊 Painel do Dia
//                     </div>

//                     <div><strong>Jornada total:</strong> {msToHuman(jornadaMs)}</div>
//                     <div>
//                       <strong>Produtivas (Atendimento):</strong> {msToHuman(atendimentoMs)}
//                       <span style={{ color: "#7dd3fc" }}>  ({produtividade}%)</span>
//                     </div>

//                     <div><strong>Deslocamento:</strong> {msToHuman(deslocamentoMs)}</div>
//                     <div><strong>Almoço:</strong> {msToHuman(almocoMs)}</div>

//                     <div style={{ marginTop: "6px" }}>
//                       <strong>Ociosidade:</strong> {msToHuman(Math.max(ociosidadeMs, 0))}
//                     </div>
//                   </div>
//                 );
//               })()}


//             </Card>

//           </motion.div>
//         </AnimatePresence>

//         {/* Preview modal (igual ao que já tinha), mantendo assinatura */}
//         <AnimatePresence>
//           {previewOpen && (
//             <motion.div key="preview" initial={{ opacity: 0, scale: .98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .98 }} style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 80 }}>
//               <div style={{ width: "min(900px,92vw)", maxHeight: "90vh", overflow: "auto", background: "#081827", border: "1px solid #00396b", borderRadius: 12, padding: 16 }}>
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                   <h3 style={{ color: "#f59e0b" }}>Pré-visualização do RDO - {jornada.date}</h3>
//                   <div style={{ display: "flex", gap: 8 }}>
//                     <Btn onClick={() => setPreviewOpen(false)}>Fechar</Btn>
//                   </div>
//                 </div>

//                 <div style={{ marginTop: 12 }}>
//                   <Card>
//                     <div style={{ display: "flex", justifyContent: "space-between" }}>
//                       <div>
//                         <div><strong>Início expediente:</strong> {fmt(jornada.inicioExpediente)}</div>
//                         <div><strong>Fim expediente:</strong> {fmt(jornada.fimExpediente)}</div>
//                         <div><strong>Distância total:</strong> {(calcularDistanciaTotal() / 1000).toFixed(2)} km</div>
//                       </div>
//                       <div style={{ textAlign: "right" }}>
//                         <div><strong>Almoço:</strong></div>
//                         <div>Início: {fmt(jornada.almoco.inicio)}</div>
//                         <div>Fim: {fmt(jornada.almoco.fim)}</div>
//                       </div>
//                     </div>
//                   </Card>

//                   <Card style={{ marginTop: 12 }}>
//                     <Label>Atendimentos (ordem cronológica)</Label>
//                     <div style={{ marginTop: 8 }}>
//                       {jornada.atendimentos.map((att, i) => (
//                         <div key={att.id} style={{ padding: 8, borderBottom: "1px dashed #00396b" }}>
//                           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                             <div>
//                               <strong>Atendimento {i + 1}</strong>
//                               <div style={{ color: "#a9c3de", fontSize: ".9rem" }}>
//                                 Endereço: {att.endereco.rua || "—"} {att.endereco.numero || ""} — {att.endereco.bairro || ""} — {att.endereco.cidade || ""}
//                               </div>
//                             </div>
//                             <div style={{ display: "flex", gap: 8 }}>
//                               <Btn onClick={() => { editarAtendimento(i); setPreviewOpen(false); }}>Editar</Btn>
//                             </div>
//                           </div>

//                           <div style={{ marginTop: 6, color: "#9fb4d6" }}>
//                             <div>Deslocamento: {fmt(att.deslocamentoInicio)}</div>
//                             <div>Atendimento início: {fmt(att.atendimentoInicio)}</div>
//                             <div>Finalizado: {fmt(att.finalizadoEm)}</div>
//                             <div>GPS início: {att.gpsInicio?.lat},{att.gpsInicio?.lng}</div>
//                             <div>GPS chegada: {att.gpsChegada?.lat},{att.gpsChegada?.lng}</div>
//                             <div>Fotos: {att.fotos?.length || 0}</div>
//                           </div>

//                           {att.fotos && att.fotos.length > 0 && (
//                             <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
//                               {att.fotos.map((f, fi) => (
//                                 <div key={fi} style={{ width: 80, height: 80, borderRadius: 8, overflow: "hidden", border: "1px solid #00396b" }}>
//                                   <img src={f.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//                                 </div>
//                               ))}
//                             </div>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   </Card>

//                   <Card style={{ marginTop: 12 }}>
//                     <Label>Assinatura</Label>
//                     {!signatureEnabled && <div style={{ color: "#94a3b8" }}>Clique em "Finalizar expediente" para habilitar assinatura.</div>}
//                     {signatureEnabled && (
//                       <div>
//                         <SignatureCanvas
//                           ref={sigRef}
//                           penColor="white"
//                           canvasProps={{ width: 600, height: 200, style: { background: "#0f243b", borderRadius: 8, border: "1px solid #00396b" } }}
//                         />
//                         <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
//                           <Btn onClick={() => sigRef.current.clear()}>Limpar assinatura</Btn>
//                           <Btn $primary onClick={confirmarEncerrarJornada}>Confirmar e encerrar jornada</Btn>
//                         </div>
//                       </div>
//                     )}
//                   </Card>

//                 </div>

//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* saved journeys */}
//         <Card style={{ marginTop: ".8rem" }}>
//           <Label>Jornadas salvas</Label>
//           {saved.length === 0 && <div style={{ color: "#94a3b8" }}>Nenhuma jornada salva.</div>}
//           {saved.map(j => (
//             <div key={j.id} style={{ padding: "8px 0", borderBottom: "1px dashed #00396b" }}>
//               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                 <div>
//                   <strong>{j.date}</strong>
//                   <div style={{ color: "#a9c3de", fontSize: ".9rem" }}>
//                     Início: {fmt(j.inicioExpediente)} • Fim: {fmt(j.fimExpediente)} • Atendimentos: {j.atendimentos?.length || 0}
//                   </div>
//                 </div>
//                 <div>
//                   <Btn onClick={() => {
//                     setJornada(j);
//                   }}>Carregar</Btn>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </Card>

//       </Content>
//     </Overlay>
//   );
// }

// new

// AttendanceWizardModal.part1.jsx — Parte 1/3
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  Plus,
  Trash2,
  List,
  Clock,
  BarChart2,
  FileText,
} from "lucide-react";
import SignatureCanvas from "react-signature-canvas";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ================== STYLES ================== */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(2,6,23,0.75);
  display:flex;
  justify-content:center;
  align-items:flex-end;
  z-index:1200;
  padding:12px;
`;

const Panel = styled(motion.div)`
  width:100%;
  max-width:520px;
  height:92vh;
  background:#071827;
  border-radius:12px 12px 8px 8px;
  border:1px solid #00396b;
  box-shadow:0 18px 50px rgba(2,6,23,0.6);
  display:flex;
  flex-direction:column;
  overflow:hidden;
`;

const Header = styled.div`
  display:flex;
  gap:12px;
  align-items:center;
  padding:12px 14px;
  border-bottom:1px solid rgba(255,255,255,0.03);
  background:linear-gradient(90deg, rgba(8,24,39,1), rgba(6,18,30,0.9));
`;

const TitleWrap = styled.div` display:flex; flex-direction:column; `;
const Title = styled.div` color:#f59e0b; font-weight:700; font-size:1.05rem; `;
const Sub = styled.div` color:#9fb4c9; font-size:0.85rem; `;
const CloseBtn = styled.button` margin-left:auto; background:none; border:none; color:#e5f0ff; cursor:pointer; `;

const Progress = styled.div` height:8px; width:100%; background:#052033; `;
const ProgressFill = styled.div` height:100%; width:${p => p.$pct}%; background:linear-gradient(90deg,#38bdf8,#0ea5e9); transition: width .22s ease; `;

const Body = styled.div` padding:12px 14px; overflow:auto; flex:1; color:#dbeafe; `;

const TabBar = styled.div`
  display:flex; gap:6px; align-items:center; justify-content:space-around;
  padding:8px 6px; border-top:1px solid rgba(255,255,255,0.03);
  background: linear-gradient(180deg, rgba(4,12,20,0.6), rgba(3,10,18,0.6));
`;
const TabBtn = styled.button`
  flex:1; padding:8px; border-radius:10px; background:transparent; color:#9fb4c9;
  border:none; display:flex; flex-direction:column; gap:4px; align-items:center; font-size:.82rem; cursor:pointer;
`;

/* small reused elements */
const Field = styled.div` margin-bottom:12px; display:flex; flex-direction:column; gap:6px; `;
const Label = styled.label` color:#94a3b8; font-size:0.92rem; `;
const Input = styled.input`
  padding:12px; border-radius:10px; border:1px solid #00396b; background:#071827; color:#e5f0ff;
  &:focus{ outline:none; box-shadow:0 0 0 4px rgba(56,189,248,0.07); border-color:#38bdf8; }
`;
const Select = styled.select`
  padding:12px; border-radius:10px; border:1px solid #00396b; background:#071827; color:#e5f0ff;
  &:focus{ outline:none; box-shadow:0 0 0 4px rgba(56,189,248,0.07); border-color:#38bdf8; }
`;
const BigBtn = styled.button`
  padding:10px 12px; border-radius:12px; font-weight:800; cursor:pointer;
  border:1px solid ${p => p.$primary ? "#38bdf8" : "#00396b"};
  background:${p => p.$primary ? "#38bdf8" : "#00396b"};
  color:${p => p.$primary ? "#081018" : "#e5f0ff"};
  display:inline-flex; align-items:center; gap:8px;
  &:disabled{ opacity:.45; cursor:not-allowed; }
`;
const Card = styled.div` background:#0d2234; border-radius:10px; padding:10px; border:1px solid #00396b; color:#dbeafe; margin-top:10px; `;
const RetornoCard = styled.div`
  margin-top:12px;
  background: linear-gradient(90deg, rgba(2,50,86,0.12), rgba(3,35,75,0.08));
  border:1px solid #2563eb;
  padding:10px;
  border-radius:10px;
  color:#dbeafe;
`;

/* ================== HELPERS ================== */
const nowISO = () => new Date().toISOString();
const fmt = (d) => d ? new Date(d).toLocaleString("pt-BR") : "—";
const STORAGE_KEY = "atendimentoWizardDraft_v3";
const SAVED_KEY = "atendimentos_v3";

const getLocation = () => new Promise((resolve) => {
  if (!navigator.geolocation) return resolve(null);
  navigator.geolocation.getCurrentPosition(
    pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
    () => resolve(null),
    { enableHighAccuracy: true, timeout: 10000 }
  );
});
const haversine = (a, b) => {
  if (!a || !b || !a.lat || !b.lat) return 0;
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371000;
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
const BASE_COORDS = { lat: -23.57647, lng: -46.60864 };

/* ================== COMPONENT (PARTE 1) ================== */
export default function AttendanceWizardModal({ onClose }) {
  // tabs: 0 = Wizard, 1 = Timeline, 2 = Painel, 3 = RDO/Preview
  const [tab, setTab] = useState(0);

  // explicit steps (we will go 1..9 per your spec)
  const [step, setStep] = useState(0); // 0 = pre-check (start jornada) ; 1..9 are real steps
  const [animKey, setAnimKey] = useState(0);

  // jornada & persisted data
  const [jornada, setJornada] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch { }
    return {
      date: new Date().toISOString().slice(0, 10),
      inicioExpediente: "",
      fimExpediente: "",
      expedienteGps: null,
      almocos: [

      ],
      atendimentos: [],
      baseLogs: [],
    };
  });

  // estado do modal almoço =======================

  const [suspenderAlmocoOpen, setSuspenderAlmocoOpen] = useState(false);
  const [suspenderJustificativa, setSuspenderJustificativa] = useState("");
  const [suspenderSolicitante, setSuspenderSolicitante] = useState("");


  const [confirmAlmocoEarlyOpen, setConfirmAlmocoEarlyOpen] = useState(false);
  const [tempoAlmocoAtual, setTempoAlmocoAtual] = useState(0);


  const [notaEnviada, setNotaEnviada] = useState(null); // null, "sim", "nao"
  // const [prefixoNota, setPrefixoNota] = useState("");
  // const [numeroNota, setNumeroNota] = useState("");

  const [confirmPauseForLunchOpen, setConfirmPauseForLunchOpen] = useState(false);

  // função de suspender almoço 

  const confirmarSuspensaoAlmoco = async () => {
    if (!suspenderJustificativa.trim() || !suspenderSolicitante.trim()) {
      alert("Preencha justificativa e nome do solicitante.");
      return;
    }

    const loc = await getLocation();

    setJornada(j => {
      const almocos = [...j.almocos];
      const ultimo = almocos[almocos.length - 1];

      if (!ultimo) return j;

      // marca suspensão
      ultimo.suspensoEm = nowISO();
      ultimo.latSuspenso = loc?.lat || "";
      ultimo.lngSuspenso = loc?.lng || "";
      ultimo.justificativaSuspensao = suspenderJustificativa;
      ultimo.solicitanteSuspensao = suspenderSolicitante;

      // GARANTE que o almoço é encerrado
      ultimo.fim = ultimo.fim || nowISO();

      return { ...j, almocos };

    });

    setSuspenderAlmocoOpen(false);
    setSuspenderJustificativa("");
    setSuspenderSolicitante("");

    startNewAtendimento("externo");
    setStep(1);
  };



  // current atendimento being filled in wizard
  const [current, setCurrent] = useState(() => ({
    id: null,
    tipo: "externo",
    ordemTipo: "3",
    ordemPrefixo: "100000",
    ordemNumero: "",
    endereco: { cep: "", rua: "", numero: "", bairro: "", cidade: "", estado: "" },
    deslocamentoInicio: "",
    atendimentoInicio: "",
    finalizadoEm: "",
    gpsInicio: { lat: "", lng: "" },
    gpsChegada: { lat: "", lng: "" },
    fotos: [],
    notas: ""
  }));


  const ultimoAlmoco = jornada.almocos[jornada.almocos.length - 1];
  const almocoEmCurso = ultimoAlmoco && !ultimoAlmoco.fim;


  // small UI / storage
  const [fotosPreview, setFotosPreview] = useState([]);
  const [savedJourneys, setSavedJourneys] = useState([]);
  const sigRef = useRef(null);
  const [signatureEnabled, setSignatureEnabled] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  // interrupt retorno UI (used later)
  const [interromperReasonOpen, setInterromperReasonOpen] = useState(false);
  const [interromperReasonText, setInterromperReasonText] = useState("");

  useEffect(() => {
    try { setSavedJourneys(JSON.parse(localStorage.getItem(SAVED_KEY) || "[]")); } catch { }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jornada));
  }, [jornada]);

  // progress pct mapping (for progress bar)
  const pct = (() => {
    const map = { 0: 0, 1: 6, 2: 26, 3: 46, 4: 73, 5: 82, 6: 88, 7: 95, 9: 99 };
    return map[step] ?? 0;
  })();

  /* ========== Helpers: criar novo atendimento e inicia fluxo ========== */
  const newAtendimentoTemplate = (tipo = "externo") => ({
    id: crypto.randomUUID(),
    tipo,
    pausadoParaAlmoco: false,
    stepAntesAlmoco: null,
    ordemTipo: tipo === "externo" ? "" : "100000",
    ordemPrefixo: "",
    ordemNumero: "",
    endereco: { cep: "", rua: "", numero: "", bairro: "", cidade: "", estado: "" },
    deslocamentoInicio: "",
    atendimentoInicio: "",
    finalizadoEm: "",
    gpsInicio: { lat: "", lng: "" },
    gpsChegada: { lat: "", lng: "" },
    fotos: [],
    notas: ""
  });

  const startNewAtendimento = (tipo = "externo") => {
    const att = newAtendimentoTemplate(tipo);

    setNotaEnviada(null);   // << RESET TOTAL
    setCurrent(att);
    setFotosPreview([]);
    setStep(1);
    setAnimKey(k => k + 1);
  };


  // if component mounted and jornada already started -> go to step 1, else pre-check (0)
  // useEffect(() => {
  //   if (jornada.inicioExpediente) {
  //     // jornada already started, go to step 1 (Tipo)
  //     startNewAtendimento("externo");
  //   } else {
  //     // show pre-check to allow "Iniciar Jornada" first
  //     setStep(0);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // // ============New useffect acima ================
  // useEffect(() => {
  //   if (!jornada.inicioExpediente) {
  //     setStep(0);
  //     return;
  //   }



  //   // Só inicia novo atendimento se não existir um em aberto
  //   const existeEmAberto =
  //     current && !current.finalizadoEm && !current.deslocamentoInicio;

  //   if (!existeEmAberto && jornada.atendimentos.length > 0) {
  //     startNewAtendimento("externo");
  //   }
  // }, []);

  useEffect(() => {
    if (!jornada.inicioExpediente) {
      // Ainda não iniciou a jornada → sempre exibir Step 0
      setStep(0);
      return;
    }

    // Jornada já iniciada → abrir Step 1 (tipo)
    if (jornada.inicioExpediente && step === 0) {
      startNewAtendimento("externo");
      setStep(1);
    }
  }, [jornada.inicioExpediente]);


  /* ========== Hepers duração almoço ========== */
  const duracaoAlmocoMs = (al) => {
    if (!al.inicio || !al.fim) return 0;
    return new Date(al.fim) - new Date(al.inicio);
  };

  const MIN_ALMOCO_MS = 50 * 60 * 1000; // 50 minutos


  /* ========== CEP lookup (viacep) ========== */
  const buscarCep = async (cep) => {
    const c = (cep || "").toString().replace(/\D/g, "");
    if (c.length !== 8) return;
    try {
      const r = await fetch(`https://viacep.com.br/ws/${c}/json/`);
      const j = await r.json();
      if (!j.erro) {
        setCurrent(cur => ({ ...cur, endereco: { ...cur.endereco, rua: j.logradouro || "", bairro: j.bairro || "", cidade: j.localidade || "", estado: j.uf || "", cep: c } }));
      }
    } catch (e) { /* ignore */ }
  };

  /* ========== Fotos handling ========== */
  const handleFotos = (e) => {
    const arr = [...e.target.files].map(f => ({ file: f, url: URL.createObjectURL(f) }));
    setFotosPreview(prev => [...prev, ...arr]);
    setCurrent(cur => ({ ...cur, fotos: [...(cur.fotos || []), ...arr] }));
  };
  const removeFoto = (url) => {
    setFotosPreview(prev => prev.filter(p => p.url !== url));
    setCurrent(cur => ({ ...cur, fotos: (cur.fotos || []).filter(p => p.url !== url) }));
  };

  /* ========== Iniciar Jornada (novo) ========== */
  const iniciarJornada = async () => {
    const loc = await getLocation();
    setJornada(j => ({
      ...j,
      inicioExpediente: nowISO(),
      expedienteGps: { lat: loc?.lat || "", lng: loc?.lng || "" }
    }));

    // Agora passo para Step 1
    startNewAtendimento("externo");
    setStep(1);
  };

  // ====================BLOQUEIA INICIAR DUAS JORNADAS NO MESMO DIA =================
  //   const iniciarJornada = async () => {
  //   const hoje = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  //   // Carrega jornadas finalizadas
  //   let stored = [];
  //   try {
  //     stored = JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
  //   } catch {}

  //   // Verifica se já existe jornada do mesmo dia
  //   const existeJornadaHoje = stored.some(j => j.date === hoje);

  //   if (existeJornadaHoje) {
  //     alert("Você já finalizou uma jornada neste dia. Não é permitido iniciar outra.");
  //     return;
  //   }

  //   // Verifica se jornada atual já está iniciada mas não finalizada (fail-safe)
  //   if (jornada.inicioExpediente && !jornada.fimExpediente) {
  //     alert("Você já possui uma jornada em andamento. Finalize antes de iniciar outra.");
  //     return;
  //   }

  //   // Agora pode iniciar
  //   const loc = await getLocation();
  //   setJornada(j => ({
  //     ...j,
  //     inicioExpediente: nowISO(),
  //     expedienteGps: { lat: loc?.lat || "", lng: loc?.lng || "" }
  //   }));

  //   startNewAtendimento("externo");
  //   setStep(1);
  // };


  /* ================== PARTE 2 — Fluxo de passos (Steps 1..9) ================== */

  /* ====== Core flow: deslocamento / atendimento / concluir ====== */
  const iniciarDeslocamento = async () => {

    if (current.pausadoParaAlmoco) {
      alert("Atendimento pausado para almoço. Finalize o almoço para continuar.");
      return;
    }

    // Só valida OS se a nota foi informada (SIM)
    if (notaEnviada === "sim") {
      if (!/^\d{6}$/.test(current.ordemNumero)) {
        alert("Informe o número da OS com 6 dígitos antes de iniciar deslocamento.");
        setStep(2);
        return;
      }
    }

    const loc = await getLocation();

    setCurrent(cur => {
      if (!cur.deslocamentoInicio) {
        const updated = {
          ...cur,
          deslocamentoInicio: nowISO(),
          gpsInicio: { lat: loc?.lat || "", lng: loc?.lng || "" }
        };
        setJornada(j => ({ ...j, inicioExpediente: j.inicioExpediente || nowISO() }));
        return updated;
      }
      return cur;
    });

    setStep(5);
  };



  const iniciarAtendimento = async () => {
    if (current.pausadoParaAlmoco) {
      alert("Atendimento pausado para almoço. Finalize o almoço para continuar.");
      return;
    }

    const loc = await getLocation();
    setCurrent(cur => {
      if (!cur.atendimentoInicio) {
        const gpsStart =
          cur.gpsInicio && cur.gpsInicio.lat
            ? cur.gpsInicio
            : { lat: loc?.lat || "", lng: loc?.lng || "" };

        return {
          ...cur,
          atendimentoInicio: nowISO(),
          gpsInicio: gpsStart,
        };
      }
      return cur;
    });

    // Step 6 – atendimento ativo
    setStep(6);
  };

  const concluirAtendimento = async () => {
    if (current.pausadoParaAlmoco) {
      alert("Atendimento pausado para almoço. Finalize o almoço para continuar.");
      return;
    }

    const loc = await getLocation();

    setCurrent(cur => {
      // Se já existe finalizadoEm → NÃO salva novamente
      if (cur.finalizadoEm) return cur;

      const atualizado = {
        ...cur,
        finalizadoEm: nowISO(),
        gpsChegada: { lat: loc?.lat || "", lng: loc?.lng || "" },
      };

      // Agora sim: grava somente UMA vez
      setJornada(j => {
        // Garante que não exista atendimento com esse id
        const jaExiste = j.atendimentos.some(a => a.id === atualizado.id);
        if (jaExiste) return j;

        return {
          ...j,
          atendimentos: [...j.atendimentos, atualizado],
        };
      });

      return atualizado;
    });

    setStep(7);
  };


  /* ====== Step 7: Ações pós atendimento ====== */
  const voltarAoInicioDoWizard = () => {
    startNewAtendimento("externo");
    setStep(1);
  };

  /* ====== Step 8/9: Retorno à base ====== */
  const iniciarDeslocamentoParaBase = async () => {
    if (current.pausadoParaAlmoco) {
      alert("Atendimento pausado para almoço. Finalize o almoço para continuar.");
      return;
    }

    const loc = await getLocation();
    setJornada(j => ({
      ...j,
      baseLogs: [
        ...(j.baseLogs || []),
        {
          id: crypto.randomUUID(),
          tipo: "deslocamentoParaBase",
          time: nowISO(),
          gps: { lat: loc?.lat || "", lng: loc?.lng || "" },
        },
      ],
    }));

    // Step 9
    setStep(9);
  };

  const marcarChegadaBase = async () => {
    if (current.pausadoParaAlmoco) {
      alert("Atendimento pausado para almoço. Finalize o almoço para continuar.");
      return;
    }

    const loc = await getLocation();
    setJornada(j => ({
      ...j,
      baseLogs: [
        ...(j.baseLogs || []),
        {
          id: crypto.randomUUID(),
          tipo: "chegadaBase",
          time: nowISO(),
          gps: { lat: loc?.lat || "", lng: loc?.lng || "" },
        },
      ],
    }));

    // Reset atendimento e volta ao Step 1, mas jornada continua ativa
    startNewAtendimento("externo");

    // IMPORTANTÍSSIMO
    // Step após chegada → volta para Step 1
    setStep(1);
  };

  /* ====== Interromper Retorno ====== */
  const abrirInterromperRetorno = () => {
    setInterromperReasonOpen(true);
    setInterromperReasonText("");
  };

  const confirmarInterromperRetorno = () => {
    if (!interromperReasonText.trim()) {
      alert("Descreva o motivo da interrupção.");
      return;
    }

    // Registra interrupção no baseLogs
    setJornada(j => ({
      ...j,
      baseLogs: [
        ...(j.baseLogs || []),
        {
          id: crypto.randomUUID(),
          tipo: "interrompeuRetorno",
          time: nowISO(),
          motivo: interromperReasonText,
        },
      ],
    }));

    // Fecha modal e abre novo chamado
    setInterromperReasonOpen(false);
    setInterromperReasonText("");

    startNewAtendimento("externo");

    // Step 1 (novo chamado)
    setStep(1);
  };

  /* ================== Distance ================== */
  const distanciaAteBase = () => {
    const lastAtt = jornada.atendimentos
      .slice()
      .reverse()
      .find(a => a.gpsChegada?.lat || a.gpsInicio?.lat);

    let pos = null;

    if (lastAtt) {
      pos = lastAtt.gpsChegada?.lat ? lastAtt.gpsChegada : lastAtt.gpsInicio;
    } else if (jornada.baseLogs?.length) {
      pos = jornada.baseLogs[jornada.baseLogs.length - 1].gps;
    }

    if (!pos) return null;
    return Math.round(haversine(pos, BASE_COORDS));
  };

  /* ================== Finalizar expediente (opção C) ==================
     ⬇ SOMENTE depois que o técnico chegou à base!
     – aparece no Step 9 apenas APÓS chegada
     – também aparece na aba RDO (Parte 3)
  ===================================================================== */

  const encerrarExpediente = async () => {
    const loc = await getLocation();

    setJornada(j => ({
      ...j,
      fimExpediente: nowISO(),
      expedienteGpsFim: { lat: loc?.lat || "", lng: loc?.lng || "" },
    }));

    // Abrir preview no RDO com assinatura
    setSignatureEnabled(true);
    setPreviewOpen(true);
    setTab(3); // abre aba RDO
  };

  /* ================== Steps UI ================== */

  /* Helper para atualizar campos do atendimento */
  const updateCurrentField = (path, value) => {
    if (path.includes(".")) {
      const [obj, key] = path.split(".");
      setCurrent(c => ({ ...c, [obj]: { ...c[obj], [key]: value } }));
    } else {
      setCurrent(c => ({ ...c, [path]: value }));
    }
  };

  const gerarAssinaturaPreta = () => {
    const original = sigRef.current.toDataURL("image/png");

    return new Promise((resolve) => {
      const img = new Image();
      img.src = original;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        // Desenha a imagem original
        ctx.drawImage(img, 0, 0);

        // Pega pixel por pixel
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Converte tudo que NÃO é transparente em preto
        for (let i = 0; i < data.length; i += 4) {
          const alpha = data[i + 3];

          if (alpha > 0) {
            data[i] = 0;     // R
            data[i + 1] = 0; // G
            data[i + 2] = 0; // B
            data[i + 3] = 255; // 100% opaco
          }
        }

        ctx.putImageData(imageData, 0, 0);

        resolve(canvas.toDataURL("image/png"));
      };
    });
  };


  // ================== EXPORT PDF ==================== */

  // IMPORTANTE: certifique-se de ter importado essas libs no topo:
  // import jsPDF from "jspdf";
  // import autoTable from "jspdf-autotable";

  // const exportPreviewAsPdf = async () => {
  //   try {
  //     const pdf = new jsPDF({
  //       orientation: "portrait",
  //       unit: "pt",
  //       format: "a4",
  //     });

  //     const margin = 40;
  //     let y = margin;

  //     /* -------------------------------------------
  //      *  CABEÇALHO
  //      * ------------------------------------------- */
  //     pdf.setFont("Helvetica", "bold");
  //     pdf.setFontSize(18);
  //     pdf.text("RDO - Relatório Diário de Operações", margin, y);
  //     y += 28;

  //     pdf.setFontSize(12);
  //     pdf.setFont("Helvetica", "normal");
  //     pdf.text(`Data: ${jornada.date}`, margin, y);
  //     y += 18;

  //     pdf.text(`Início expediente: ${fmt(jornada.inicioExpediente)}`, margin, y);
  //     y += 16;
  //     pdf.text(`Fim expediente: ${fmt(jornada.fimExpediente)}`, margin, y);
  //     y += 16;

  //     const dist = (calcularDistanciaTotal() / 1000).toFixed(2);
  //     pdf.text(`Distância total: ${dist} km`, margin, y);
  //     y += 26;

  //     pdf.line(margin, y, 555, y);
  //     y += 20;

  //     /* -------------------------------------------
  //      *  TABELA DE ATENDIMENTOS
  //      * ------------------------------------------- */
  //     pdf.setFont("Helvetica", "bold");
  //     pdf.setFontSize(14);
  //     pdf.text("Atendimentos", margin, y);
  //     y += 20;

  //     if (jornada.atendimentos.length === 0) {
  //       pdf.setFont("Helvetica", "normal");
  //       pdf.text("Nenhum atendimento registrado.", margin, y);
  //       y += 30;
  //     } else {
  //       autoTable(pdf, {
  //         startY: y,
  //         margin: { left: margin },
  //         headStyles: { fillColor: [30, 60, 110] },
  //         head: [["OS", "Início", "Fim", "Endereço"]],
  //         body: jornada.atendimentos.map((att) => [
  //           `OS ${att.ordemTipo}-${att.ordemNumero}`,
  //           fmt(att.atendimentoInicio),
  //           fmt(att.finalizadoEm),
  //           `${att.endereco?.rua || ""} ${att.endereco?.numero || ""} - ${att.endereco?.bairro || ""
  //           } - ${att.endereco?.cidade || ""}`,
  //         ]),
  //       });

  //       y = pdf.lastAutoTable.finalY + 30;
  //     }

  //     /* -------------------------------------------
  //      *  FOTOS
  //      * ------------------------------------------- */
  //     pdf.setFont("Helvetica", "bold");
  //     pdf.setFontSize(14);
  //     pdf.text("Fotos dos Atendimentos", margin, y);
  //     y += 20;

  //     if (
  //       !jornada.atendimentos.some(
  //         (att) => att.fotos && att.fotos.length > 0
  //       )
  //     ) {
  //       pdf.setFont("Helvetica", "normal");
  //       pdf.text("Nenhuma foto registrada.", margin, y);
  //       y += 30;
  //     } else {
  //       for (const att of jornada.atendimentos) {
  //         if (!att.fotos || att.fotos.length === 0) continue;

  //         pdf.setFont("Helvetica", "bold");
  //         pdf.text(
  //           `OS ${att.ordemTipo}-${att.ordemNumero}`,
  //           margin,
  //           y
  //         );
  //         y += 16;

  //         let x = margin;

  //         for (const f of att.fotos) {
  //           if (y > 750) {
  //             pdf.addPage();
  //             y = margin;
  //           }

  //           const img = f.url;
  //           pdf.addImage(img, "JPEG", x, y, 90, 90);

  //           x += 100;
  //           if (x > 450) {
  //             x = margin;
  //             y += 100;
  //           }
  //         }

  //         y += 110;
  //       }
  //     }

  //     /* -------------------------------------------
  //      *  ASSINATURA
  //      * ------------------------------------------- */
  //     const pageHeight = pdf.internal.pageSize.getHeight();

  //     // verifica se cabe a assinatura na página atual (120px + margem)
  //     if (y + 160 > pageHeight - margin) {
  //       pdf.addPage();
  //       y = margin;
  //     }

  //     pdf.setFont("Helvetica", "bold");
  //     pdf.setFontSize(14);
  //     pdf.text("Assinatura do Técnico", margin, y);
  //     y += 20;

  //     if (!signatureEnabled) {
  //       pdf.setFont("Helvetica", "normal");
  //       pdf.text("Não assinada.", margin, y);
  //     } else {
  //       const assinatura = sigRef.current.toDataURL("image/png");
  //       pdf.addImage(assinatura, "PNG", margin, y, 200, 120);
  //     }

  //     /* -------------------------------------------
  //      *  SALVAR PDF
  //      * ------------------------------------------- */
  //     pdf.save(`RDO_${jornada.date}.pdf`);

  //     alert("PDF gerado com sucesso!");
  //   } catch (err) {
  //     console.error("Erro ao gerar PDF:", err);
  //     alert("Erro ao gerar PDF.");
  //   }
  // };

  /* ===================New Expoert PDF antigo acima =============== */

  const exportPreviewAsPdf = async () => {
    try {
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });

      const margin = 40;
      const pageHeight = pdf.internal.pageSize.getHeight();
      let y = margin;

      const addSpace = (heightNeeded = 40) => {
        if (y + heightNeeded > pageHeight - margin) {
          pdf.addPage();
          y = margin;
        }
      };

      /* ===================== CABEÇALHO ===================== */
      pdf.setFont("Helvetica", "bold");
      pdf.setFontSize(18);
      pdf.text("RDO - Relatório Diário de Operações", margin, y);
      y += 26;

      pdf.setFontSize(12);
      pdf.setFont("Helvetica", "normal");
      const headerLines = [
        `Data: ${jornada.date}`,
        `Início expediente: ${fmt(jornada.inicioExpediente)}`,
        `Fim expediente: ${fmt(jornada.fimExpediente)}`,
        `Distância total: ${(calcularDistanciaTotal() / 1000).toFixed(2)} km`,
      ];

      headerLines.forEach(line => {
        addSpace(20);
        pdf.text(line, margin, y);
        y += 16;
      });

      addSpace(20);
      pdf.line(margin, y, 555, y);
      y += 20;

      /* ===================== RESUMO DE TEMPOS ===================== */
      addSpace(30);
      pdf.setFont("Helvetica", "bold");
      pdf.setFontSize(14);
      pdf.text("Resumo de Tempos", margin, y);
      y += 20;

      const { atendimentoMs, deslocamentoMs } = calcularTotais();
      const jornadaMs = calcularJornadaTotal();
      const almocoMs = jornada.almocos.reduce((tot, al) => {
        if (al.inicio && al.fim) tot += new Date(al.fim) - new Date(al.inicio);
        return tot;
      }, 0);

      pdf.setFont("Helvetica", "normal");
      pdf.setFontSize(12);

      pdf.text(`Tempo de atendimento: ${msToHuman(atendimentoMs)}`, margin, y);
      y += 16;

      pdf.text(`Tempo de deslocamento: ${msToHuman(deslocamentoMs)}`, margin, y);
      y += 16;

      pdf.text(`Tempo de almoço: ${msToHuman(almocoMs)}`, margin, y);
      y += 16;

      pdf.text(`Jornada total: ${msToHuman(jornadaMs)}`, margin, y);
      y += 26;

      pdf.line(margin, y, 555, y);
      y += 20;


      /* -------------------------------------------
 *  PAUSA PARA ALMOÇO
 * ------------------------------------------- */
      pdf.setFont("Helvetica", "bold");
      pdf.setFontSize(14);
      pdf.text("Pausa para Almoço", margin, y);
      y += 20;

      pdf.setFont("Helvetica", "normal");
      pdf.setFontSize(12);

      if (!jornada.almocos.length) {
        pdf.text("Nenhuma pausa registrada.", margin, y);
        y += 20;
      } else {
        jornada.almocos.forEach((al, i) => {
          pdf.text(`Almoço ${i + 1}`, margin, y);
          y += 16;

          if (al.inicio) {
            pdf.text(`Início: ${fmt(al.inicio)}`, margin, y);
            y += 16;
          }

          if (al.fim) {
            pdf.text(`Fim: ${fmt(al.fim)}`, margin, y);
            y += 16;
          }

          if (al.suspensoEm) {
            pdf.text(`Suspenso: ${fmt(al.suspensoEm)}`, margin, y);
            y += 16;
            pdf.text(`Solicitante: ${al.solicitanteSuspensao}`, margin, y);
            y += 16;
            pdf.text(`Justificativa: ${al.justificativaSuspensao}`, margin, y);
            y += 16;
          }

          y += 10;
        });
      }

      pdf.line(margin, y, 555, y);
      y += 20;

      /* ===================== TABELA DE ATENDIMENTOS ===================== */
      pdf.setFont("Helvetica", "bold");
      pdf.setFontSize(14);
      pdf.text("Atendimentos", margin, y);
      y += 20;

      if (jornada.atendimentos.length === 0) {
        pdf.setFont("Helvetica", "normal");
        pdf.text("Nenhum atendimento registrado.", margin, y);
        y += 20;
      } else {
        autoTable(pdf, {
          startY: y,
          margin: { left: margin },
          headStyles: { fillColor: [30, 60, 110] },
          head: [["OS", "Início", "Fim", "Endereço"]],
          body: jornada.atendimentos.map((att) => [
            att.notaEnviada === "sim"
              ? `OS ${att.ordemTipo}-${att.ordemNumero}`
              : "Não informada",
            fmt(att.atendimentoInicio),
            fmt(att.finalizadoEm),
            `${att.endereco?.rua || ""} ${att.endereco?.numero || ""} - ${att.endereco?.bairro || ""
            } - ${att.endereco?.cidade || ""}`,
          ]),
        });

        y = pdf.lastAutoTable.finalY + 20;
      }

      // if (jornada.almoco.suspensoEm) {
      //   pdf.text(`Almoço suspenso: ${fmt(jornada.almoco.suspensoEm)}`, margin, y);
      //   y += 16;
      //   pdf.text(`GPS: ${jornada.almoco.latSuspenso}, ${jornada.almoco.lngSuspenso}`, margin, y);
      //   y += 16;
      //   pdf.text(`Solicitante: ${jornada.almoco.solicitanteSuspensao}`, margin, y);
      //   y += 16;
      //   pdf.text(`Justificativa: ${jornada.almoco.justificativaSuspensao}`, margin, y);
      //   y += 30;
      // }


      /* ===================== FOTOS — OTIMIZADAS ===================== */
      pdf.setFont("Helvetica", "bold");
      pdf.setFontSize(14);
      pdf.text("Fotos dos Atendimentos", margin, y);
      y += 20;

      const FOTO_SIZE = 90; // tamanho otimizado
      const GAP = 12;
      const MAX_X = 555 - FOTO_SIZE;

      let x = margin;

      for (const att of jornada.atendimentos) {
        if (!att.fotos || att.fotos.length === 0) continue;

        addSpace(30);
        pdf.setFont("Helvetica", "bold");
        pdf.text(
          att.notaEnviada === "sim"
            ? `OS ${att.ordemTipo}-${att.ordemNumero}`
            : "Não informada",
          margin,
          y
        );
        y += 16;

        for (const f of att.fotos) {
          addSpace(FOTO_SIZE + GAP);

          pdf.addImage(f.url, "JPEG", x, y, FOTO_SIZE, FOTO_SIZE);

          x += FOTO_SIZE + GAP;
          if (x > MAX_X) {
            x = margin;
            y += FOTO_SIZE + GAP;
          }
        }

        x = margin;
        y += FOTO_SIZE + GAP;
      }

      /* ===================== ASSINATURA — OTIMIZADA ===================== */
      const assinaturaNeeded = 160;

      addSpace(assinaturaNeeded);

      pdf.setFont("Helvetica", "bold");
      pdf.setFontSize(14);
      pdf.text("Assinatura do Técnico", margin, y);
      y += 20;

      pdf.setLineWidth(0.3);

      if (!signatureEnabled) {
        pdf.setFont("Helvetica", "normal");
        pdf.text("Não assinada.", margin, y);
      } else {
        const assinatura = await gerarAssinaturaPreta();
        // Linha abaixo da assinatura (opcional)
        pdf.line(margin, y + 130, margin + 200, y + 130);
        pdf.addImage(assinatura, "PNG", margin, y, 200, 120);

        y += 130;

      }

      /* ===================== SALVAR ===================== */
      pdf.save(`RDO_${jornada.date}.pdf`);
      alert("PDF otimizado gerado com sucesso!");

    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      alert("Erro ao gerar PDF.");
    }
  };


  /* ================== STEP SCREENS ================== */

  const Step0_IniciarJornada = (
    <motion.div
      key="s0"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Field>
        <Label>Jornada de Trabalho</Label>
        <Card>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>
            Você ainda não iniciou a jornada.
          </div>
          <div style={{ color: "#9fb4c9", marginBottom: 10 }}>
            Ao iniciar a jornada, o sistema registrará data, hora e localização.
          </div>

          <BigBtn $primary onClick={iniciarJornada}>
            <Check size={18} /> Iniciar Jornada de Trabalho
          </BigBtn>
        </Card>
      </Field>
    </motion.div>
  );

  /* ================== Step 1: Tipo ================== */
  const Step1_Tipo = (
    <motion.div
      key="s1"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      transition={{ duration: 0.24 }}
    >
      <Field>
        <Label>Tipo de atendimento</Label>
        <div style={{ display: "flex", gap: 8 }}>
          <BigBtn
            style={{ flex: 1 }}
            onClick={() => {
              updateCurrentField("tipo", "externo");
              setStep(2);
            }}
          >
            Externo
          </BigBtn>

          <BigBtn
            style={{ flex: 1 }}
            onClick={() => {
              updateCurrentField("tipo", "interno");
              setStep(2);
            }}
          >
            Interno
          </BigBtn>
        </div>

        <div style={{ color: "#9fb4c9", marginTop: 8 }}>
          Toque no tipo para iniciar — o próximo passo pede identificação da OS.
        </div>
      </Field>
    </motion.div>
  );
  /* ================== Step 2: Identificação OS ================== */
  const Step2_OS = (
    <motion.div
      key="s2"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      transition={{ duration: 0.24 }}
    >
      {/* ------------------- PERGUNTA SOBRE NOTA ------------------- */}
      <Field>
        <Label>Número da nota foi enviado?</Label>

        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          {/* -------- BOTÃO SIM -------- */}
          <BigBtn
            style={{
              flex: 1,
              background: notaEnviada === "sim" ? "#38bdf8" : "#0d2234",
              borderColor: notaEnviada === "sim" ? "#38bdf8" : "#00396b",
            }}
            onClick={() => {
              setNotaEnviada("sim");
              // NÃO limpar nada aqui — usuário poderá preencher os campos abaixo
            }}
          >
            Sim
          </BigBtn>

          {/* -------- BOTÃO NÃO -------- */}
          <BigBtn
            style={{
              flex: 1,
              background: notaEnviada === "nao" ? "#38bdf8" : "#0d2234",
              borderColor: notaEnviada === "nao" ? "#38bdf8" : "#00396b",
            }}
            onClick={() => {
              setNotaEnviada("nao");

              // 🔥 AQUI: limpamos automaticamente os campos da OS
              setCurrent((c) => ({
                ...c,
                ordemTipo: "",
                ordemPrefixo: "",
                ordemNumero: "",
              }));
            }}
          >
            Não
          </BigBtn>
        </div>

        {notaEnviada === null && (
          <div style={{ color: "#f87171", marginTop: 6, fontWeight: 600 }}>
            * Obrigatório selecionar uma das opções
          </div>
        )}
      </Field>

      {/* ------------------- CAMPOS SE (SIM) ------------------- */}
      {notaEnviada === "sim" && (
        <>
          <Field>
            <Label>Prefixo / Tipo da OS</Label>

            <Select
              value={current.ordemTipo}
              onChange={(e) => updateCurrentField("ordemTipo", e.target.value)}
              style={{
                borderColor:
                  current.ordemTipo === "" ? "#f87171" : "#00396b",
              }}
            >
              <option value="">Selecione...</option>
              <option value="3">3</option>
              <option value="7">7</option>
              <option value="100000">100000</option>
            </Select>

            {current.ordemTipo === "" && (
              <div style={{ color: "#f87171", marginTop: 4 }}>
                * Escolha um prefixo
              </div>
            )}
          </Field>

          <Field>
            <Label>Número da OS (6 dígitos)</Label>

            <Input
              inputMode="numeric"
              placeholder="000000"
              value={current.ordemNumero}
              onChange={(e) =>
                updateCurrentField(
                  "ordemNumero",
                  e.target.value.replace(/\D/g, "").slice(0, 6)
                )
              }
              style={{
                borderColor:
                  current.ordemNumero.length !== 6 ? "#f87171" : "#00396b",
              }}
            />

            {current.ordemNumero.length !== 6 && (
              <div style={{ color: "#f87171", marginTop: 4 }}>
                * Necessário ter exatamente 6 dígitos
              </div>
            )}
          </Field>
        </>
      )}

      {/* ------------------- BOTÕES ------------------- */}
      <div style={{ display: "flex", gap: 8 }}>
        <BigBtn onClick={() => setStep(1)}>
          <ChevronLeft size={18} /> Voltar
        </BigBtn>

        <BigBtn
          $primary
          onClick={() => {
            // Precisa selecionar SIM ou NÃO
            if (notaEnviada === null) {
              alert("Selecione se a nota foi enviada (Sim ou Não).");
              return;
            }

            // Se SIM, validar prefixo + número
            if (notaEnviada === "sim") {
              if (current.ordemTipo === "") {
                alert("Escolha o prefixo da OS.");
                return;
              }

              if (!/^\d{6}$/.test(current.ordemNumero)) {
                alert("Preencha o número da OS com 6 dígitos.");
                return;
              }
            }

            // Salvar no atendimento
            setCurrent((c) => ({ ...c, notaEnviada }));

            setStep(3);
          }}
        >
          Próximo <ChevronRight size={18} />
        </BigBtn>
      </div>
    </motion.div>
  );



  /* ================== Step 3: Endereço ================== */
  const Step3_Endereco = (
    <motion.div
      key="s3"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      transition={{ duration: 0.24 }}
    >
      <Field>
        <Label>CEP</Label>
        <Input
          inputMode="numeric"
          placeholder="00000000"
          value={current.endereco.cep || ""}
          onBlur={(e) => buscarCep(e.target.value)}
          onChange={(e) =>
            updateCurrentField(
              "endereco.cep",
              e.target.value.replace(/\D/g, "").slice(0, 8)
            )
          }
        />
      </Field>

      <Field>
        <Label>Rua / Logradouro</Label>
        <Input
          placeholder="Logradouro"
          value={current.endereco.rua || ""}
          onChange={(e) => updateCurrentField("endereco.rua", e.target.value)}
        />
      </Field>

      <div style={{ display: "flex", gap: 8 }}>
        <Input
          placeholder="Número"
          style={{ flex: 1 }}
          value={current.endereco.numero || ""}
          onChange={(e) => updateCurrentField("endereco.numero", e.target.value)}
        />

        <Input
          placeholder="Bairro"
          style={{ flex: 1 }}
          value={current.endereco.bairro || ""}
          onChange={(e) => updateCurrentField("endereco.bairro", e.target.value)}
        />
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <Input
          placeholder="Cidade"
          style={{ flex: 1 }}
          value={current.endereco.cidade || ""}
          onChange={(e) => updateCurrentField("endereco.cidade", e.target.value)}
        />

        <Input
          placeholder="UF"
          style={{ width: 80 }}
          value={current.endereco.estado || ""}
          onChange={(e) => updateCurrentField("endereco.estado", e.target.value)}
        />
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <BigBtn onClick={() => setStep(2)}>
          <ChevronLeft size={18} /> Voltar
        </BigBtn>

        <BigBtn
          $primary
          onClick={() => {
            const cep = (current.endereco.cep || "")
              .toString()
              .replace(/\D/g, "");

            if (!cep || cep.length !== 8 || !current.endereco.numero) {
              alert("Preencha CEP válido (8 dígitos) e número do endereço.");
              return;
            }

            setStep(4);
          }}
        >
          Próximo <ChevronRight size={18} />
        </BigBtn>
      </div>
    </motion.div>
  );

  /* ================== Step 4: Preparar Início Deslocamento ================== */
  const Step4_DeslocamentoPrep = (
    <motion.div
      key="s4"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      transition={{ duration: 0.24 }}
    >
      <Field>
        <Label>Deslocamento</Label>

        <div style={{ color: "#9fb4c9" }}>
          Quando iniciar deslocamento o sistema registrará hora e localização
          automaticamente.
        </div>

        <Card style={{ marginTop: 10 }}>
          <div style={{ fontWeight: 700 }}>Resumo</div>

          <div style={{ color: "#9fb4c9", marginTop: 6 }}>
            Ordem: {notaEnviada ? `${current.ordemTipo}-${current.ordemNumero || "—"}` : "Não informada"} <br />
            Endereço: {current.endereco.rua || "—"} {current.endereco.numero || ""} —{" "}
            {current.endereco.bairro || ""} — {current.endereco.cidade || ""}
          </div>
        </Card>

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <BigBtn onClick={() => setStep(3)}>
            <ChevronLeft size={18} /> Voltar
          </BigBtn>

          <BigBtn $primary onClick={iniciarDeslocamento}>
            <Check size={18} /> Iniciar deslocamento
          </BigBtn>
        </div>
      </Field>
    </motion.div>
  );

  /* ================== Step 5: Após iniciar deslocamento ================== */
  const Step5_DeslocamentoAtivo = (
    <motion.div
      key="s5"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      transition={{ duration: 0.24 }}
    >
      {/* 🔥 BLOQUEIO DE DESLOCAMENTO SE PAUSADO PARA ALMOÇO */}
      {current.pausadoParaAlmoco && (
        <Card style={{ marginTop: 12, padding: 12, borderColor: "#f59e0b" }}>
          <strong style={{ color: "#f59e0b" }}>
            Atendimento pausado para almoço
          </strong>
          <br />
          Finalize o almoço para continuar.
        </Card>
      )}

      {/* Se está pausado → não renderiza o restante do Step 5 */}
      {current.pausadoParaAlmoco ? null : (
        <Field>
          <Label>Deslocamento ativo</Label>

          <div style={{ color: "#9fb4c9", marginBottom: 8 }}>
            Deslocamento iniciado em: {fmt(current.deslocamentoInicio)}
          </div>

          <div style={{ color: "#9fb4c9", marginBottom: 8 }}>
            GPS início: {current.gpsInicio?.lat || "—"},{" "}
            {current.gpsInicio?.lng || "—"}
          </div>

          <div style={{ color: "#9fb4c9", marginBottom: 14 }}>
            Distância estimada até a base:{" "}
            {distanciaAteBase()
              ? (distanciaAteBase() / 1000).toFixed(2) + " km"
              : "—"}
          </div>

          <BigBtn
            $primary
            onClick={() => {
              iniciarAtendimento();
            }}
          >
            Iniciar atendimento
          </BigBtn>
        </Field>
      )}
    </motion.div>
  );


  /* ================== Step 6: Atendimento em andamento ================== */
  const Step6_AtendimentoAtivo = (
    <motion.div
      key="s6"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      transition={{ duration: 0.24 }}
    >
      {/* 🔥 BLOQUEIO SE ESTIVER PAUSADO PARA ALMOÇO */}
      {current.pausadoParaAlmoco && (
        <Card style={{ marginTop: 12, padding: 12, borderColor: "#f59e0b" }}>
          <strong style={{ color: "#f59e0b" }}>
            Atendimento pausado para almoço
          </strong>
          <br />
          Finalize o almoço para continuar.
        </Card>
      )}

      {/* Se está pausado → não renderiza o restante do Step 6 */}
      {current.pausadoParaAlmoco ? null : (
        <Field>
          <Label>Atendimento</Label>

          <div style={{ color: "#9fb4c9" }}>
            Use os botões para finalizar o atendimento.
          </div>

          <Card style={{ marginTop: 10 }}>
            <div style={{ fontWeight: 700 }}>Status</div>
            <div style={{ marginTop: 6, color: "#9fb4c9" }}>
              Deslocamento: {fmt(current.deslocamentoInicio)} <br />
              Início atendimento: {fmt(current.atendimentoInicio)} <br />
              Finalizado: {fmt(current.finalizadoEm)}
            </div>
          </Card>

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <BigBtn $primary onClick={concluirAtendimento}>
              Finalizar atendimento
            </BigBtn>
          </div>
        </Field>
      )}
    </motion.div>
  );


  /* ================== Step 7: Atendimento concluído ================== */
  const Step7_AtendimentoConcluido = (
    <motion.div
      key="s7"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      transition={{ duration: 0.24 }}
    >
      <Field>
        <Label>Atendimento concluído</Label>

        <div style={{ color: "#9fb4c9" }}>
          Início: {fmt(current.atendimentoInicio)} <br />
          Fim: {fmt(current.finalizadoEm)} <br />
          GPS Início: {current.gpsInicio?.lat || "—"},{current.gpsInicio?.lng || "—"}
          <br />
          GPS Chegada: {current.gpsChegada?.lat || "—"},{current.gpsChegada?.lng || "—"}
          <br />
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <BigBtn onClick={iniciarDeslocamentoParaBase}>
            Retornar à base
          </BigBtn>

          <BigBtn
            onClick={() => {
              startNewAtendimento("externo");
              setStep(1);
            }}
          >
            <Plus size={16} /> Novo atendimento
          </BigBtn>
        </div>
      </Field>
    </motion.div>
  );

  /* ================== Step 8: Escolher ação após atendimento ================== */
  const Step8_AposAtendimento = (
    <motion.div
      key="s8"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      transition={{ duration: 0.24 }}
    >
      <Field>
        <Label>Atendimento concluído</Label>

        <Card>
          <div style={{ color: "#9fb4c9" }}>
            Início: {fmt(current.atendimentoInicio)} <br />
            Fim: {fmt(current.finalizadoEm)} <br />
            GPS Início: {current.gpsInicio?.lat || "—"}, {current.gpsInicio?.lng || "—"} <br />
            GPS Chegada: {current.gpsChegada?.lat || "—"}, {current.gpsChegada?.lng || "—"}
          </div>
        </Card>

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <BigBtn $primary onClick={iniciarDeslocamentoParaBase}>
            Retornar à base
          </BigBtn>

          <BigBtn onClick={() => { startNewAtendimento("externo"); setStep(1); }}>
            <Plus size={16} /> Novo atendimento
          </BigBtn>
        </div>
      </Field>
    </motion.div>
  );
  /* ================== Step 9: Retorno à base ================== */
  const Step9_RetornoBase = (
    <motion.div
      key="s9"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      transition={{ duration: 0.24 }}
    >


      {/* 🔥 BLOQUEIO SE PAUSADO PARA ALMOÇO */}
      {current.pausadoParaAlmoco && (
        <Card style={{ marginTop: 12, padding: 12, borderColor: "#f59e0b" }}>
          <strong style={{ color: "#f59e0b" }}>
            Retorno à base pausado para almoço
          </strong>
          <br />
          Finalize o almoço para continuar.
        </Card>
      )}

      {/* Quando pausado → não renderiza resto do conteúdo */}
      {current.pausadoParaAlmoco ? null : (
        <Field>
          <Label>Retorno à base em andamento</Label>

          <Card>
            <div style={{ fontWeight: 700 }}>Retorno à base</div>
            <div style={{ color: "#9fb4c9", marginTop: 8 }}>
              Deslocamento iniciado em:{" "}
              {fmt(jornada.baseLogs[jornada.baseLogs.length - 1]?.time)} <br />
              Distância estimada até a base:{" "}
              {distanciaAteBase()
                ? (distanciaAteBase() / 1000).toFixed(2) + " km"
                : "—"}
            </div>
          </Card>

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <BigBtn $primary onClick={marcarChegadaBase}>
              Confirmar chegada à base
            </BigBtn>

            <BigBtn
              onClick={() => {
                setInterromperReasonOpen(true);
                setStep(10);
              }}
            >
              Interromper deslocamento (novo chamado)
            </BigBtn>
          </div>
        </Field>
      )}
    </motion.div>
  );

  /* ================== Step 10: Interromper retorno (motivo) ================== */
  const Step10_Interromper = (
    <motion.div
      key="s10"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      transition={{ duration: 0.24 }}
    >
      <Field>
        <Label>Motivo da interrupção do retorno</Label>

        <Card>
          <textarea
            value={interromperReasonText}
            onChange={(e) => setInterromperReasonText(e.target.value)}
            placeholder="Descreva o motivo..."
            style={{
              width: "100%",
              minHeight: 100,
              background: "#071827",
              color: "#e5f0ff",
              border: "1px solid #00396b",
              padding: 8,
              borderRadius: 8,
              marginTop: 8,
            }}
          />

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <BigBtn onClick={() => { setInterromperReasonText(""); setStep(9); }}>
              Voltar
            </BigBtn>

            <BigBtn $primary onClick={confirmarInterromperRetorno}>
              Confirmar e abrir novo chamado
            </BigBtn>
          </div>
        </Card>
      </Field>
    </motion.div>
  );


  /* ================== PARTE 3 — Timeline, Painel, RDO, Encerrar Expediênte ================== */

  /* ========== Timeline ========== */
  const montarTimeline = () => {
    const events = [];



    if (jornada.inicioExpediente)
      events.push({
        time: jornada.inicioExpediente,
        label: "Expediente iniciado",
      });

    // ---------- ALMOÇOS (nova estrutura) ----------
    if (jornada.almocos && Array.isArray(jornada.almocos)) {
      jornada.almocos.forEach((al, index) => {
        if (al.inicio) {
          events.push({
            time: al.inicio,
            label: `Início do almoço ${index + 1}`,
          });
        }

        if (al.fim) {
          events.push({
            time: al.fim,
            label: `Fim do almoço ${index + 1}`,
          });
        }

        if (al.suspensoEm) {
          events.push({
            time: al.suspensoEm,
            label: `Almoço suspenso — ${al.solicitanteSuspensao}`,
          });
        }

        // duração do almoço no timeline
        if (al.inicio && al.fim) {
          const dur = new Date(al.fim) - new Date(al.inicio);
          const min = Math.round(dur / 60000);

          events.push({
            time: al.fim,
            label: `Almoço concluído — duração: ${min} min`
          });
        }

      });
    }




    jornada.atendimentos.forEach((a, i) => {
      if (a.deslocamentoInicio)
        events.push({
          time: a.deslocamentoInicio,
          label: `Deslocamento — OS ${a.ordemTipo}-${a.ordemNumero}`,
        });

      if (a.atendimentoInicio)
        events.push({
          time: a.atendimentoInicio,
          label: `Início atendimento ${i + 1}`,
        });

      if (a.notaEnviada === "nao") {
        events.push({
          time: a.atendimentoInicio,
          label: `Numero de nota não informado na solicitação`,
        });
      }

      if (a.notaEnviada === "sim") {
        events.push({
          time: a.atendimentoInicio,
          label: `OS informada: ${a.ordemTipo}-${a.ordemNumero}`,
        });
      }


      if (a.finalizadoEm)
        events.push({
          time: a.finalizadoEm,
          label: `Atendimento concluído ${i + 1}`,
        });
    });

    jornada.baseLogs.forEach((l) => {
      if (l.tipo === "deslocamentoParaBase")
        events.push({ time: l.time, label: "Deslocamento para base" });

      if (l.tipo === "chegadaBase")
        events.push({ time: l.time, label: "Chegada à base" });

      if (l.tipo === "interrompeuRetorno")
        events.push({
          time: l.time,
          label: `Interrupção do retorno: ${l.motivo}`,
        });
    });

    if (jornada.fimExpediente)
      events.push({
        time: jornada.fimExpediente,
        label: "Expediente encerrado",
      });

    return events.sort((a, b) => new Date(a.time) - new Date(b.time));
  };

  const TimelineView = (
    <div style={{ padding: 12 }}>
      <h3 style={{ color: "#f59e0b", marginBottom: 12 }}>Linha do Tempo</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {montarTimeline().length === 0 && (
          <div style={{ color: "#94a3b8" }}>Nenhuma atividade registrada.</div>
        )}

        {montarTimeline().map((ev, i) => (
          <div
            key={i}
            style={{ display: "flex", gap: 10, alignItems: "center" }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 8,
                background: "#071827",
                border: "1px solid #00396b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                color: "#7dd3fc",
              }}
            >
              {new Date(ev.time).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>

            <div
              style={{
                background: "#0d2234",
                padding: 10,
                borderRadius: 8,
                border: "1px solid #00396b",
                flex: 1,
              }}
            >
              <div style={{ fontWeight: 700, color: "#dbeafe" }}>
                {ev.label}
              </div>
              <div style={{ color: "#9fb4c9", fontSize: ".85rem", marginTop: 4 }}>
                {fmt(ev.time)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* ========== Painel do dia (KPIs) ========== */
  const calcDuration = (a, b) => {
    if (!a || !b) return 0;
    return new Date(b) - new Date(a);
  };

  const msToHuman = (ms) => {
    if (!ms || ms <= 0) return "0 min";
    const totalMin = Math.floor(ms / 60000);
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return h > 0 ? `${h}h ${m}min` : `${m}min`;
  };

  // ===================== Calculo duração almoço =============== 

  const calcularDuracaoAlmoco = () => {
    const ultimo = jornada.almocos[jornada.almocos.length - 1];
    if (!ultimo?.inicio || !ultimo?.fim) return 0;
    return new Date(ultimo.fim) - new Date(ultimo.inicio);
  };


  const formatDuracao = (ms) => {
    if (!ms || ms < 1) return "—";
    const m = Math.floor(ms / 60000);
    const h = Math.floor(m / 60);
    const mm = m % 60;
    return h > 0 ? `${h}h ${mm}min` : `${mm} min`;
  };


  const calcularTotais = () => {
    let atendimentoMs = 0;
    let deslocamentoMs = 0;

    jornada.atendimentos.forEach((a, i) => {
      atendimentoMs += calcDuration(a.atendimentoInicio, a.finalizadoEm);
      deslocamentoMs += calcDuration(a.deslocamentoInicio, a.atendimentoInicio);

      const next = jornada.atendimentos[i + 1];
      if (next && a.finalizadoEm && next.deslocamentoInicio) {
        deslocamentoMs += calcDuration(a.finalizadoEm, next.deslocamentoInicio);
      }
    });

    for (let i = 0; i < jornada.baseLogs.length; i += 2) {
      const ini = jornada.baseLogs[i];
      const fim = jornada.baseLogs[i + 1];

      if (
        ini &&
        fim &&
        ini.tipo === "deslocamentoParaBase" &&
        fim.tipo === "chegadaBase"
      ) {
        deslocamentoMs += calcDuration(ini.time, fim.time);
      }
    }

    return { atendimentoMs, deslocamentoMs };
  };

  const calcularJornadaTotal = () =>
    calcDuration(jornada.inicioExpediente, jornada.fimExpediente);

  const calcularProdutividade = () => {
    const total = calcularJornadaTotal();
    const { atendimentoMs } = calcularTotais();

    if (total <= 0) return 0;

    return Math.round((atendimentoMs / total) * 100);
  };

  const calcularDistanciaTotal = () => {
    const points = [];

    jornada.atendimentos.forEach((a) => {
      if (a.gpsInicio?.lat) points.push(a.gpsInicio);
      if (a.gpsChegada?.lat) points.push(a.gpsChegada);
    });

    jornada.baseLogs.forEach((b) => {
      if (b.gps?.lat) points.push(b.gps);
    });

    if (points.length < 2) return 0;

    let tot = 0;
    for (let i = 1; i < points.length; i++)
      tot += haversine(points[i - 1], points[i]);

    return Math.round(tot);
  };

  const PainelView = (() => {
    const { atendimentoMs, deslocamentoMs } = calcularTotais();
    const jornadaMs = calcularJornadaTotal();

    return (
      <div style={{ padding: 12 }}>
        <h3 style={{ color: "#f59e0b", marginBottom: 12 }}>Painel do Dia</h3>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
        >
          <Card>
            <strong>Jornada</strong>
            <div style={{ color: "#7dd3fc", marginTop: 6 }}>
              {msToHuman(jornadaMs)}
            </div>
          </Card>

          <Card>
            <strong>Atendimento</strong>
            <div style={{ color: "#7dd3fc", marginTop: 6 }}>
              {msToHuman(atendimentoMs)}{" "}
              <small style={{ color: "#9fb4c9" }}>
                ({calcularProdutividade()}%)
              </small>
            </div>
          </Card>

          <Card>
            <strong>Deslocamento</strong>
            <div style={{ color: "#7dd3fc", marginTop: 6 }}>
              {msToHuman(deslocamentoMs)}
            </div>
          </Card>

          <Card>
            <strong>Distância total</strong>
            <div style={{ color: "#7dd3fc", marginTop: 6 }}>
              {(calcularDistanciaTotal() / 1000).toFixed(2)} km
            </div>
          </Card>
        </div>
      </div>
    );
  })();

  /* ========== RDO / Preview + Assinatura ========== */
  const confirmarEncerrarJornada = () => {
    const assinatura = sigRef.current?.toDataURL();

    const registro = {
      ...jornada,
      assinatura,
      id: crypto.randomUUID(),
    };

    const arr = [...savedJourneys, registro];
    localStorage.setItem(SAVED_KEY, JSON.stringify(arr));
    setSavedJourneys(arr);

    localStorage.removeItem(STORAGE_KEY);

    // Reset total
    setJornada({
      date: new Date().toISOString().slice(0, 10),
      inicioExpediente: "",
      fimExpediente: "",
      expedienteGps: null,
      expedienteGpsFim: null,
      almocos: [],
      atendimentos: [],
      baseLogs: [],
    });

    startNewAtendimento("externo");

    sigRef.current?.clear();
    setSignatureEnabled(false);
    setPreviewOpen(false);

    // volta para Step 0 = iniciar jornada
    setStep(0);
    setTab(0);

    alert("Expediente encerrado e registrado com sucesso.");
  };

  const iniciarAlmoco = async () => {
    const loc = await getLocation();

    setJornada(j => ({
      ...j,
      almocos: [
        ...j.almocos,
        {
          id: crypto.randomUUID(),
          inicio: nowISO(),
          fim: "",
          latInicio: loc?.lat || "",
          lngInicio: loc?.lng || "",
          latFim: "",
          lngFim: "",
          suspensoEm: "",
          justificativaSuspensao: "",
          solicitanteSuspensao: ""
        }
      ]
    }));
  };

  const finalizarAlmoco = async () => {

    if (current.pausadoParaAlmoco) {
      const voltar = current.stepAntesAlmoco || 5; // fallback
      setCurrent(c => ({
        ...c,
        pausadoParaAlmoco: false,
        stepAntesAlmoco: null
      }));
      setStep(voltar);
    }

    const loc = await getLocation();

    setJornada(j => {
      const almocos = [...j.almocos];
      const ultimo = almocos[almocos.length - 1];

      if (!ultimo || ultimo.fim || ultimo.suspensoEm) return j;

      // finaliza almoço
      ultimo.fim = nowISO();
      ultimo.latFim = loc?.lat || "";
      ultimo.lngFim = loc?.lng || "";

      // calcula duração
      const duracao = duracaoAlmocoMs(ultimo);

      // registra flag (para RDO)
      ultimo.almoçoInvalido = duracao < MIN_ALMOCO_MS;

      return { ...j, almocos };
    });
  };



  const RDOView = (
    <div style={{ padding: 12 }}>
      <h3 style={{ color: "#f59e0b", marginBottom: 12 }}>
        RDO / Pré-visualização
      </h3>

      <Card>
        <strong>Data:</strong> {jornada.date}
        <br />
        <strong>Início expediente:</strong> {fmt(jornada.inicioExpediente)}
        <br />
        <strong>Fim expediente:</strong> {fmt(jornada.fimExpediente)}
        <br />
        <strong>Distância total:</strong>{" "}
        {(calcularDistanciaTotal() / 1000).toFixed(2)} km
      </Card>

      {/* ================= ALMOÇO NO RDO ================= */}
      {jornada.almocos.length > 0 && (
        <Card style={{ marginTop: 12 }}>
          <strong>Registro de Almoço</strong>
          <br />

          {jornada.almocos.map((al, i) => (
            <Card key={al.id} style={{ marginTop: 12 }}>
              <strong>Almoço {i + 1}</strong><br />

              {al.inicio && (
                <>
                  <strong>Início:</strong> {fmt(al.inicio)}<br />
                  <span style={{ color: "#60a5fa" }}>
                    GPS: {al.latInicio}, {al.lngInicio}
                  </span><br />
                </>
              )}

              {al.fim && (
                <>
                  <strong>Fim:</strong> {fmt(al.fim)}<br />
                  <span style={{ color: "#34d399" }}>
                    GPS: {al.latFim}, {al.lngFim}
                  </span><br />
                </>
              )}

              {al.suspensoEm && (
                <>
                  <br />
                  <strong>Suspenso em:</strong> {fmt(al.suspensoEm)}<br />
                  <strong>Solicitante:</strong> {al.solicitanteSuspensao}<br />
                  <strong>Justificativa:</strong> {al.justificativaSuspensao}
                </>
              )}

              {/* ⚠ ALERTA DE ALMOÇO INVÁLIDO (MENOS DE 50 MIN) */}
              {al.almoçoInvalido && (
                <div style={{ color: "#f87171", marginTop: 6, fontWeight: "bold" }}>
                  ⚠ Almoço abaixo do tempo mínimo (50 min)
                </div>
              )}

              {/* duração do almoço */}
              {al.inicio && al.fim && (
                <div style={{ marginTop: 6, color: "#60a5fa" }}>
                  <strong>Duração:</strong> {formatDuracao(new Date(al.fim) - new Date(al.inicio))}
                </div>
              )}


            </Card>
          ))}


        </Card>
      )}



      <div style={{ marginTop: 12 }}>
        <h4 style={{ color: "#dbeafe" }}>Atendimentos</h4>

        {jornada.atendimentos.length === 0 && (
          <div style={{ color: "#94a3b8" }}>Nenhum atendimento registrado.</div>
        )}

        {jornada.atendimentos.map((att) => (
          <Card
            key={att.id}
            style={{ marginTop: 8, border: "1px solid #00396b" }}
          >
            <strong>OS / Nota</strong><br />

            {att.notaEnviada === "sim" ? (
              <span>
                {att.ordemTipo}-{att.ordemNumero}
              </span>
            ) : (
              <span style={{ color: "#fbbf24" }}>
                Numero de nota não informado na solicitação
              </span>
            )}

            <br />
            {att.endereco?.rua || "—"} {att.endereco?.numero || ""} —{" "}
            {att.endereco?.bairro || ""} — {att.endereco?.cidade || ""}

            <div style={{ marginTop: 10 }}>
              {att.fotos?.length > 0 && (
                <div
                  style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
                >
                  {att.fotos.map((f, i) => (
                    <div
                      key={i}
                      style={{
                        width: 76,
                        height: 76,
                        borderRadius: 8,
                        overflow: "hidden",
                        border: "1px solid #00396b",
                      }}
                    >
                      <img
                        src={f.url}
                        alt="foto"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div style={{ marginTop: 14 }}>
        <h4 style={{ color: "#dbeafe" }}>Assinatura</h4>

        {!signatureEnabled && (
          <div style={{ color: "#94a3b8" }}>
            Clique no botão "Encerrar Expediente" (visível apenas após chegada à
            base) para habilitar a assinatura.
          </div>
        )}

        {signatureEnabled && (
          <>
            <div
              style={{
                background: "#071827",
                border: "1px solid #00396b",
                borderRadius: 8,
                padding: 8,
              }}
            >
              <SignatureCanvas
                ref={sigRef}
                penColor="white"
                canvasProps={{
                  width: 440,
                  height: 160,
                  style: { background: "#071827", borderRadius: 6 },
                }}
              />
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <BigBtn onClick={() => sigRef.current.clear()}>Limpar</BigBtn>

              <BigBtn onClick={exportPreviewAsPdf}>Gerar PDF</BigBtn>

              <BigBtn $primary onClick={confirmarEncerrarJornada}>
                Confirmar e encerrar jornada
              </BigBtn>
            </div>
          </>
        )}
      </div>

      {/* Botão Encerrar expediente visível também na aba RDO */}
      {jornada.baseLogs.some((l) => l.tipo === "chegadaBase") &&
        !jornada.fimExpediente && (
          <div style={{ marginTop: 18 }}>
            <BigBtn $primary onClick={encerrarExpediente}>
              Encerrar Expediente
            </BigBtn>
          </div>
        )}
    </div>
  );






  /* ========== Render principal ========== */
  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <Panel
        key={animKey}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ duration: 0.22 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Header>
          <TitleWrap>
            <Title>Novo Atendimento — Mobile (Híbrido)</Title>
            <Sub>
              {tab === 0
                ? `Step ${step}/9`
                : tab === 1
                  ? "Timeline"
                  : tab === 2
                    ? "Painel"
                    : "RDO"}
            </Sub>
          </TitleWrap>

          {/* <CloseBtn onClick={() => onClose?.()}>
            <X size={20} />
          </CloseBtn> */}
        </Header>

        {tab === 0 && (
          <Progress>
            <ProgressFill $pct={pct} />
          </Progress>
        )}

        {/* ====== BARRA FIXA DE ALMOÇO ====== */}
        {step !== 0 && (
          <div
            style={{
              padding: "10px 14px",
              background: "#0d2234",
              borderBottom: "1px solid #00396b",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >


            {/* =========== CONTROLES DE ALMOÇO =========== */}
            {(() => {
              const ultimo = jornada.almocos[jornada.almocos.length - 1];

              const existeAlmocoValido = jornada.almocos.some(a => {
                if (!a.fim) return false;
                return duracaoAlmocoMs(a) >= MIN_ALMOCO_MS;
              });

              const emCurso = ultimo && ultimo.inicio && !ultimo.fim && !ultimo.suspensoEm;
              const podeIniciarAlmoco = !emCurso && !existeAlmocoValido;

              return (
                <>
                  {podeIniciarAlmoco && (
                    <BigBtn
                      $primary
                      onClick={() => {
                        if (step === 5 || step === 6 || step === 7 || step === 9 || step === 10) {
                          // deslocamento ativo ou atendimento ativo
                          setConfirmPauseForLunchOpen(true);
                          return;
                        }
                        iniciarAlmoco();
                      }}
                    >
                      Iniciar Almoço
                    </BigBtn>
                  )}

                  {emCurso && (
                    <div style={{ display: "flex", gap: 8 }}>
                      <BigBtn
                        style={{ flex: 1, background: "#0ea5e9", borderColor: "#0ea5e9" }}
                        onClick={async () => {
                          const ultimo = jornada.almocos[jornada.almocos.length - 1];
                          if (!ultimo?.inicio) return;

                          const diff = Date.now() - new Date(ultimo.inicio).getTime();
                          setTempoAlmocoAtual(diff);

                          if (diff < MIN_ALMOCO_MS) {
                            setConfirmAlmocoEarlyOpen(true); // << ABRE O MODAL
                          } else {
                            finalizarAlmoco();
                          }
                        }}
                      >
                        Finalizar Almoço
                      </BigBtn>

                      <BigBtn
                        style={{
                          flex: 1,
                          background: "#fbbf24",
                          borderColor: "#f59e0b",
                          color: "#082f49",
                        }}
                        onClick={() => setSuspenderAlmocoOpen(true)}
                      >
                        Suspender Almoço
                      </BigBtn>
                    </div>
                  )}
                </>
              );
            })()}

          </div>
        )}


        {/* MODAL SUSPENDER ALMOÇO */}
        {
          suspenderAlmocoOpen && (
            <Overlay onClick={(e) => e.target === e.currentTarget && setSuspenderAlmocoOpen(false)}>
              <Panel
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: .22 }}
              >
                <Body>

                  <h3 style={{ color: "#f59e0b" }}>Suspender Almoço</h3>

                  <Field>
                    <Label>Nome do solicitante</Label>
                    <Input
                      value={suspenderSolicitante}
                      onChange={e => setSuspenderSolicitante(e.target.value)}
                      placeholder="Quem solicitou o atendimento?"
                    />
                  </Field>

                  <Field>
                    <Label>Justificativa</Label>
                    <textarea
                      value={suspenderJustificativa}
                      onChange={e => setSuspenderJustificativa(e.target.value)}
                      placeholder="Descreva o motivo..."
                      style={{
                        width: "100%",
                        minHeight: 80,
                        background: "#071827",
                        color: "#e5f0ff",
                        border: "1px solid #00396b",
                        padding: 8,
                        borderRadius: 8
                      }}
                    />
                  </Field>

                  <div style={{ display: "flex", gap: 10 }}>
                    <BigBtn onClick={() => setSuspenderAlmocoOpen(false)}>Cancelar</BigBtn>
                    <BigBtn $primary onClick={confirmarSuspensaoAlmoco}>Confirmar</BigBtn>
                  </div>

                </Body>
              </Panel>
            </Overlay>
          )
        }


        {confirmAlmocoEarlyOpen && (
          <Overlay onClick={(e) => e.target === e.currentTarget && setConfirmAlmocoEarlyOpen(false)}>
            <Panel
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: .22 }}
            >
              <Body>

                <h3 style={{ color: "#f59e0b", marginBottom: 10 }}>
                  Finalizar almoço antes dos 50 minutos?
                </h3>

                <div style={{ color: "#cbd5e1", marginBottom: 12 }}>
                  O tempo mínimo recomendado é <strong>50 minutos</strong>.<br />
                  Você registrou apenas{" "}
                  <strong>{Math.round(tempoAlmocoAtual / 60000)} min</strong>.
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <BigBtn onClick={() => setConfirmAlmocoEarlyOpen(false)}>
                    Cancelar
                  </BigBtn>

                  <BigBtn
                    $primary
                    onClick={() => {
                      // fecha modal antes de tudo
                      setConfirmAlmocoEarlyOpen(false);

                      // usa callback da atualização de estado para garantir render correto
                      setJornada(j => {
                        const almocos = [...j.almocos];
                        const ultimo = almocos[almocos.length - 1];
                        if (ultimo) {
                          ultimo.almoçoInvalido = true;
                          ultimo.fim = nowISO(); // <- garantir que o fim seja registrado aqui
                        }
                        return { ...j, almocos };
                      });

                      // garante que o fluxo do almoço encerra normalmente
                      finalizarAlmoco();
                    }}
                  >
                    Finalizar mesmo assim
                  </BigBtn>
                </div>

              </Body>
            </Panel>
          </Overlay>
        )}

        {/* MODAL Pausa ALMOÇO */}

        {confirmPauseForLunchOpen && (
          <Overlay onClick={(e) => e.target === e.currentTarget && setConfirmPauseForLunchOpen(false)}>
            <Panel initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <Body>
                <h3 style={{ color: "#f59e0b" }}>Pausar atendimento para almoço?</h3>

                <div style={{ color: "#cbd5e1", marginTop: 8, marginBottom: 16 }}>
                  O atendimento atual será pausado e será iniciado um registro de almoço.
                  Você só poderá continuar o atendimento quando finalizar o almoço.
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <BigBtn onClick={() => setConfirmPauseForLunchOpen(false)}>
                    Cancelar
                  </BigBtn>

                  <BigBtn
                    $primary
                    onClick={() => {
                      setConfirmPauseForLunchOpen(false);

                      // marca pausa
                      setCurrent(c => ({
                        ...c,
                        pausadoParaAlmoco: true,
                        stepAntesAlmoco: step
                      }));

                      iniciarAlmoco(); // usa seu método atual

                      // força para a área do almoço
                      setStep(step); // mantém step igual até o fim do almoço
                    }}
                  >
                    Pausar e iniciar almoço
                  </BigBtn>
                </div>
              </Body>
            </Panel>
          </Overlay>
        )}


        <Body>

          {tab === 0 && (
            <AnimatePresence mode="wait">
              {step === 0 && Step0_IniciarJornada}
              {step === 1 && Step1_Tipo}
              {step === 2 && Step2_OS}
              {step === 3 && Step3_Endereco}
              {step === 4 && Step4_DeslocamentoPrep}
              {step === 5 && Step5_DeslocamentoAtivo}
              {step === 6 && Step6_AtendimentoAtivo}
              {step === 7 && Step7_AtendimentoConcluido}
              {step === 8 && Step8_AposAtendimento}
              {step === 9 && Step9_RetornoBase}
              {step === 10 && Step10_Interromper}
            </AnimatePresence>
          )}


          {tab === 1 && TimelineView}
          {tab === 2 && PainelView}
          {tab === 3 && RDOView}
        </Body>

        <TabBar>
          <TabBtn
            onClick={() => setTab(0)}
            style={{ color: tab === 0 ? "#e6f7ff" : undefined }}
          >
            <List size={18} />
            Atend.
          </TabBtn>

          <TabBtn
            onClick={() => setTab(1)}
            style={{ color: tab === 1 ? "#e6f7ff" : undefined }}
          >
            <Clock size={18} />
            Timeline
          </TabBtn>

          <TabBtn
            onClick={() => setTab(2)}
            style={{ color: tab === 2 ? "#e6f7ff" : undefined }}
          >
            <BarChart2 size={18} />
            Painel
          </TabBtn>

          <TabBtn
            onClick={() => setTab(3)}
            style={{ color: tab === 3 ? "#e6f7ff" : undefined }}
          >
            <FileText size={18} />
            RDO
          </TabBtn>
        </TabBar>
      </Panel>
    </Overlay>
  );
}

/* ========= FIM DO ARQUIVO (Parte 3/3) ========= */
