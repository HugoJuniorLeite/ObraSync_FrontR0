
// import React, { useState, useEffect, useRef } from "react";
// import {
//   Overlay,
//   Panel,
//   Header,
//   TitleWrap,
//   Title,
//   Sub,
//   CloseBtn,
//   Progress,
//   ProgressFill,
//   Body,
//   TabBar,
//   TabBtn,
//   Card,
//   Label
// } from "../styles/layout";

// import { nowISO } from "../helpers/time";
// import { getLocation } from "../helpers/location";
// import { uuid } from "../helpers/uuid";

// import WizardController from "../Wizard/WizardController";

// import RdoMain from "../timeline/RdoMain";
// import Timeline from "../timeline/Timeline";

// import RdoPreview from "../preview/RdoPreview";
// import JourneyMap from "../mapa/JourneyMap";

// import BasePanel from "../base/BasePanel";
// import { exportJornadaAsPdf } from "../export/exportPDF";

// import HeaderAlmoco from "../almoco/HeaderAlmoco";
// import ModalFinalizarAlmocoEarly from "../almoco/ModalFinalizarAlmocoEarly";
// import ModalSuspenderAlmoco from "../almoco/ModalSuspenderAlmoco";
// import ModalPausarParaAlmoco from "../almoco/ModalPausarParaAlmoco";
// import { Clock, List, FileText, BarChart2 } from "lucide-react";


// // ==============================================
// // TABS
// // ==============================================

// const tabs = [
//   { id: 0, label: "Atend.", icon: List },
//   { id: 1, label: "Timeline", icon: Clock },
//   { id: 2, label: "Painel", icon: BarChart2 },
//   { id: 3, label: "RDO", icon: FileText },
// ];

// // ==============================================
// // COMPONENTE PRINCIPAL
// // ==============================================

// const AttendanceWizardModal = ({ visible, onClose }) => {

//   // ===========================
//   // ESTADOS PRINCIPAIS DA JORNADA
//   // ===========================

//   const loadJornada = () => {
//     try {
//       const saved = localStorage.getItem("jornada_atual");
//       if (saved) return JSON.parse(saved);
//     } catch (e) {}

//     return {
//       id: uuid(),
//       date: new Date().toLocaleDateString("pt-BR"),
//       inicioExpediente: null,
//       fimExpediente: null,
//       atendimentos: [],
//       almoco: {
//         inicio: null,
//         fim: null,
//         gpsInicio: null,
//         gpsFim: null,
//         suspensoEm: null,
//         motivoSuspensao: null,
//         solicitante: null,
//       },
//       atividadeAtual: "livre",
//       atividadeAnterior: null,
//       baseLogs: [],
//       gpsFimExpediente: null,
//     };
//   };

//   const [jornada, setJornada] = useState(loadJornada);

//   // PERSISTE A JORNADA
//   useEffect(() => {
//     localStorage.setItem("jornada_atual", JSON.stringify(jornada));
//   }, [jornada]);

//   const [tab, setTab] = useState(0);

//   // const [jornada, setJornada] = useState(() => ({
//   //   id: uuid(),
//   //   date: new Date().toLocaleDateString("pt-BR"),
//   //   inicioExpediente: null,
//   //   fimExpediente: null,
//   //   atendimentos: [],
//   //   almoco: {
//   //     inicio: null,
//   //     fim: null,
//   //     gpsInicio: null,
//   //     gpsFim: null,
//   //     suspensoEm: null,
//   //     motivoSuspensao: null,
//   //     solicitante: null,
//   //   },
//   //   atividadeAtual: "livre",       // DESLOCAMENTO / ATENDIMENTO / RETORNO / LIVRE
//   //   atividadeAnterior: null,       // usado quando pausa para almoço
//   //   baseLogs: [],
//   //   gpsFimExpediente: null,
//   // }));

//   // const [jornada, setJornada] = useState(loadJornada);


//   const sigRef = useRef(null);
//   const [signatureEnabled, setSignatureEnabled] = useState(false);

//   // ===========================
//   // MODAIS DO ALMOÇO
//   // ===========================

//   const [showSuspenderModal, setShowSuspenderModal] = useState(false);
//   const [showEarlyFinishModal, setShowEarlyFinishModal] = useState(false);
//   const [showPausarParaAlmocoModal, setShowPausarParaAlmocoModal] = useState(false);

//   const [motivoSuspensao, setMotivoSuspensao] = useState("");
//   const [solicitante, setSolicitante] = useState("");

//   // ===========================
//   // CONTROLE DE TABS EXTERNOS
//   // ===========================

//   useEffect(() => {
//     const handler = () => setTab(2);
//     window.addEventListener("go-to-painel", handler);
//     return () => window.removeEventListener("go-to-painel", handler);
//   }, []);

//   // ===========================
//   // PROGRESS BAR
//   // ===========================

//   const progressPct = (() => {
//     let total = 4;
//     let done = 0;

//     if (jornada.inicioExpediente) done++;
//     if (jornada.atendimentos.length > 0) done++;
//     if (jornada.almoco?.inicio && jornada.almoco?.fim) done++;
//     if (jornada.fimExpediente) done++;

//     return (done / total) * 100;
//   })();

//   // ==========================================
//   // REGRAS DE ALMOÇO
//   // ==========================================

//   const atividadeEmAndamento = () => {
//     return (
//       jornada.atividadeAtual === "deslocamento" ||
//       jornada.atividadeAtual === "atendimento" ||
//       jornada.atividadeAtual === "retornoBase"
//     );
//   };

//   // REGRAS DE INÍCIO DE ALMOÇO
//   const tentarIniciarAlmoco = () => {
//     if (!jornada.inicioExpediente) return;

//     if (atividadeEmAndamento()) {
//       setShowPausarParaAlmocoModal(true);
//       return;
//     }

//     iniciarAlmoco();
//   };

// const iniciarAlmoco = async () => {
//   const gps = await getLocation();

//   setJornada(p => ({
//     ...p,
//     almoco: {
//       inicio: nowISO(),
//       fim: null,
//       gpsInicio: gps,
//       gpsFim: null,
//       suspensoEm: null,
//     },
//     atividadeAnterior: p.atividadeAtual,
//     atividadeAtual: "pausadoParaAlmoco",
//   }));

//   // 🔥 AVISA O WIZARD CONTROLLER (SEM ISSO OS STEPS NÃO PARAM)
//   window.dispatchEvent(new CustomEvent("pause-for-lunch", {
//     detail: { stepBefore: null }
//   }));
// };


//   // FINALIZAR ALMOÇO COM VALIDAÇÃO
//   const validarFinalizarAlmoco = () => {
//     const dur = (Date.now() - new Date(jornada.almoco.inicio)) / 60000;

//     if (dur < 50) {
//       setShowEarlyFinishModal(true);
//       return;
//     }

//     finalizarAlmoco();
//   };

//   const finalizarAlmocoEarly = () => {
//     setShowEarlyFinishModal(false);
//     finalizarAlmoco();
//   };

// const finalizarAlmoco = async () => {
//   const gps = await getLocation();

//   setJornada(p => ({
//     ...p,
//     almoco: {
//       ...p.almoco,
//       fim: nowISO(),
//       gpsFim: gps,
//     },
//     atividadeAtual: p.atividadeAnterior || "livre",
//     atividadeAnterior: null,
//   }));

//   // 🔥 AVISA O WIZARD CONTROLLER
//   window.dispatchEvent(new CustomEvent("lunch-finished"));

//   setShowEarlyFinishModal(false);
// };


//   // SUSPENDER ALMOÇO
// const confirmarSuspenderAlmoco = () => {
//   const agora = nowISO();

//   setJornada(p => ({
//     ...p,
//     almoco: {
//       inicio: null,
//       fim: null,
//       gpsInicio: null,
//       gpsFim: null,
//       suspensoEm: agora,
//       motivoSuspensao,
//       solicitante
//     },
//     atividadeAtual: p.atividadeAnterior || "livre",
//     atividadeAnterior: null
//   }));

//   setMotivoSuspensao("");
//   setSolicitante("");
//   setShowSuspenderModal(false);

//   // Libera os Steps no WizardController
//   window.dispatchEvent(new CustomEvent("lunch-finished"));
// };

// // Pausar atividade e iniciar almoço
// const confirmarPausaParaAlmoco = () => {
//   setJornada(p => ({
//     ...p,
//     atividadeAnterior: p.atividadeAtual,
//     atividadeAtual: "pausadoParaAlmoco",
//   }));

//   iniciarAlmoco();

//   window.dispatchEvent(new CustomEvent("pause-for-lunch", {
//     detail: { stepBefore: null }
//   }));

//   setShowPausarParaAlmocoModal(false);
// };


//   // ===============================================
//   // RETORNO À BASE
//   // ===============================================

//   const onIniciarRetornoBase = async () => {
//     const gps = await getLocation();
//     setJornada((p) => ({
//       ...p,
//       atividadeAtual: "retornoBase",
//       baseLogs: [
//         ...p.baseLogs,
//         {
//           id: uuid(),
//           tipo: "deslocamentoParaBase",
//           time: nowISO(),
//           gps,
//           finalizado: false,
//         },
//       ],
//     }));
//   };

//   const onConfirmarChegadaBase = async () => {
//     if (jornada.atividadeAtual === "pausadoParaAlmoco") {
//       alert("Retorno pausado para almoço. Finalize o almoço antes de continuar.");
//       return;
//     }

//     const gps = await getLocation();

//     setJornada((p) => {
//       const logs = [...(p.baseLogs || [])];

//       const idx = logs.findIndex(
//         l => l.tipo === "deslocamentoParaBase" && !l.finalizado
//       );

//       if (idx !== -1) logs[idx].finalizado = true;

//       logs.push({
//         id: uuid(),
//         tipo: "chegadaBase",
//         time: nowISO(),
//         gps,
//       });

//       return { ...p, baseLogs: logs };
//     });

//     window.dispatchEvent(new CustomEvent("start-new-atendimento"));

//     setTab(0);
//   };

//   // ===============================================
//   // ENCERRAR EXPEDIENTE
//   // ===============================================

//   const encerrarExpediente = async () => {
//     const gps = await getLocation();
//     setJornada((p) => ({
//       ...p,
//       fimExpediente: nowISO(),
//       gpsFimExpediente: gps,
//     }));
//     setSignatureEnabled(true);
//   };

//   const onConfirmEncerrarJornada = () => {
//     if (!signatureEnabled) {
//       alert("Finalize o expediente antes de encerrar a jornada.");
//       return;
//     }
//     alert("Jornada encerrada com sucesso!");
//     onClose?.();
//   };

//   // ===============================================
//   // EXPORTAÇÃO
//   // ===============================================

//   const exportarHistoricoPDF = () => {
//     exportJornadaAsPdf(jornada);
//   };

//   // ===============================================
//   // TABS
//   // ===============================================

//   const renderAtendimentosTab = () => {
//     return (
//       <WizardController
//         jornada={jornada}
//         setJornada={setJornada}
//         iniciarAlmoco={iniciarAlmoco}
//         finalizarAlmoco={finalizarAlmoco}
//         encerrarExpediente={encerrarExpediente}
//       />
//     );
//   };

//   const renderTimelineTab = () => {
//     if (jornada.atendimentos.length === 0) {
//       return (
//         <Card>
//           <Label>Nenhum atendimento registrado ainda.</Label>
//         </Card>
//       );
//     }

//     return (
//       <>
//         <RdoMain jornada={jornada} />
//         <Timeline jornada={jornada} />
//       </>
//     );
//   };

//   const renderPainelTab = () => {
//     return (
//       <>
//         <BasePanel
//           jornada={jornada}
//           onIniciarRetornoBase={onIniciarRetornoBase}
//           onConfirmarChegadaBase={onConfirmarChegadaBase}
//         />

//         <JourneyMap jornada={jornada} />

//         <div style={{ marginTop: 12 }}>
//           <button
//             onClick={exportarHistoricoPDF}
//             style={{
//               padding: "10px 12px",
//               width: "100%",
//               background: "#38bdf8",
//               border: "1px solid #38bdf8",
//               color: "#081018",
//               borderRadius: 10,
//             }}
//           >
//             Exportar Histórico em PDF
//           </button>
//         </div>
//       </>
//     );
//   };

//   const renderRdoTab = () => {
//     return (
//       <RdoPreview
//         jornada={jornada}
//         signatureEnabled={signatureEnabled}
//         sigRef={sigRef}
//         onConfirmEncerrarJornada={onConfirmEncerrarJornada}
//       />
//     );
//   };


//   // Carrega jornada salva
// // const loadJornada = () => {
// //   try {
// //     const saved = localStorage.getItem("jornada_atual");
// //     if (saved) return JSON.parse(saved);
// //   } catch (e) {}

// //   return {
// //     id: uuid(),
// //     date: new Date().toLocaleDateString("pt-BR"),
// //     inicioExpediente: null,
// //     fimExpediente: null,
// //     atendimentos: [],
// //     almoco: {
// //       inicio: null,
// //       fim: null,
// //       gpsInicio: null,
// //       gpsFim: null,
// //       suspensoEm: null,
// //       motivoSuspensao: null,
// //       solicitante: null,
// //     },
// //     atividadeAtual: "livre",
// //     atividadeAnterior: null,
// //     baseLogs: [],
// //     gpsFimExpediente: null,
// //   };
// // };


//   // ===============================================
//   // RETURN
//   // ===============================================

// // if (!visible) return (<Overlay style={{ display: visible ? "flex" : "none" }}>)
// if (!visible) return null;


//   return (
//     <Overlay>
//       <Panel
//         initial={{ y: 80, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         exit={{ y: 80, opacity: 0 }}
//       >
//         <Header>
//           <TitleWrap>
//             <Title>RDO - Jornada do Técnico</Title>
//             <Sub>{jornada.date}</Sub>
//           </TitleWrap>

//           {/* <CloseBtn onClick={onClose}>✕</CloseBtn> */}
//         </Header>

//         {/* HEADER ALMOÇO */}
//         {jornada.inicioExpediente && (
//           <HeaderAlmoco
//             almoco={jornada.almoco}
//             atividadeAtual={jornada.atividadeAtual}
//             step={tab}
//             onIniciar={tentarIniciarAlmoco}
//             onSuspender={() => setShowSuspenderModal(true)}
//             onFinalizar={validarFinalizarAlmoco}
//           />
//         )}

//         <Progress>
//           <ProgressFill $pct={progressPct} />
//         </Progress>

//         <Body>
//           {tab === 0 && renderAtendimentosTab()}
//           {tab === 1 && renderTimelineTab()}
//           {tab === 2 && renderPainelTab()}
//           {tab === 3 && renderRdoTab()}
//         </Body>

//         <TabBar>
//           {tabs.map((t) => (
//             <TabBtn
//               key={t.id}
//               $active={t.id === tab}
//               onClick={() => setTab(t.id)}
//             >
//               <t.icon size={18}/>
//               {t.label}
//             </TabBtn>
//           ))}
//         </TabBar>

//         {/* ====== MODAIS ======= */}

//         {showSuspenderModal && (
//           <ModalSuspenderAlmoco
//             motivo={motivoSuspensao}
//             setMotivo={setMotivoSuspensao}
//             solicitante={solicitante}
//             setSolicitante={setSolicitante}
//             onCancel={() => setShowSuspenderModal(false)}
//             onConfirm={confirmarSuspenderAlmoco}
//           />
//         )}

//         {showEarlyFinishModal && (
//           <ModalFinalizarAlmocoEarly
//             onCancel={() => setShowEarlyFinishModal(false)}
//             onConfirm={finalizarAlmocoEarly}
//           />
//         )}

//         {showPausarParaAlmocoModal && (
//           <ModalPausarParaAlmoco
//             onCancel={() => setShowPausarParaAlmocoModal(false)}
//             onConfirm={confirmarPausaParaAlmoco}
//           />
//         )}

//       </Panel>
//     </Overlay>
//   );
// };

// export default AttendanceWizardModal;

// AttendanceWizardModal.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Overlay,
  Panel,
  Header,
  TitleWrap,
  Title,
  Sub,
  CloseBtn,
  Progress,
  ProgressFill,
  Body,
  TabBar,
  TabBtn,
  Card,
  Label,
} from "../styles/layout";

import { nowISO } from "../helpers/time";
import { getLocation } from "../helpers/location";
import { uuid } from "../helpers/uuid";

import WizardController from "../Wizard/WizardController";

import RdoMain from "../timeline/RdoMain";
import Timeline from "../timeline/Timeline";

import RdoPreview from "../preview/RdoPreview";
import JourneyMap from "../mapa/JourneyMap";

import BasePanel from "../base/BasePanel";
import { exportJornadaAsPdf } from "../export/exportPDF";

import HeaderAlmoco from "../almoco/HeaderAlmoco";
import ModalFinalizarAlmocoEarly from "../almoco/ModalFinalizarAlmocoEarly";
import ModalSuspenderAlmoco from "../almoco/ModalSuspenderAlmoco";
import ModalPausarParaAlmoco from "../almoco/ModalPausarParaAlmoco";

import { Clock, List, FileText, BarChart2 } from "lucide-react";

const STORAGE_KEY = "obra_sync_jornada_v1";

// ---- Tabs ----
const tabs = [
  { id: 0, label: "Atend.", icon: List },
  { id: 1, label: "Timeline", icon: Clock },
  { id: 2, label: "Painel", icon: BarChart2 },
  { id: 3, label: "RDO", icon: FileText },
];

const AttendanceWizardModal = ({ visible, onClose }) => {

  // -------------------------
  // PERSISTÊNCIA DO STEP GLOBAL
  // -------------------------
  const [wizardStep, setWizardStep] = useState(() => {
    const saved = localStorage.getItem("wizard_step");
    return saved ? Number(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem("wizard_step", wizardStep);
  }, [wizardStep]);

  // -------------------------
  // CARREGA A JORNADA SALVA
  // -------------------------
  const loadJornada = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (err) {}

    return {
      id: uuid(),
      date: new Date().toLocaleDateString("pt-BR"),
      inicioExpediente: null,
      fimExpediente: null,
      atendimentos: [],
      almocos: [],
      atividadeAtual: "livre",
      atividadeAnterior: null,
      baseLogs: [],
    };
  };

  const [jornada, setJornada] = useState(loadJornada);

  // Salvar jornada quando mudar
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jornada));
  }, [jornada]);

  const sigRef = useRef(null);
  const [signatureEnabled, setSignatureEnabled] = useState(false);

  const [tab, setTab] = useState(0);

  // ----------------------------------------
  // MODAIS DO ALMOÇO
  // ----------------------------------------
  const [showSuspenderModal, setShowSuspenderModal] = useState(false);
  const [showEarlyFinishModal, setShowEarlyFinishModal] = useState(false);
  const [showPausarParaAlmocoModal, setShowPausarParaAlmocoModal] = useState(false);

  const [motivoSuspensao, setMotivoSuspensao] = useState("");
  const [solicitante, setSolicitante] = useState("");

  // ----------------------------------------
  // PROGRESS BAR
  // ----------------------------------------
  const progressPct = (() => {
    let total = 4;
    let done = 0;

    if (jornada.inicioExpediente) done++;
    if (jornada.atendimentos.length > 0) done++;
    if (jornada.almocos.length > 0) done++;
    if (jornada.fimExpediente) done++;

    return (done / total) * 100;
  })();

  // ------- LÓGICA DE ALMOÇO (IDÊNTICA AO SEU MONOLITO) -------
  const atividadeEmAndamento = () => {
    return (
      jornada.atividadeAtual === "deslocamento" ||
      jornada.atividadeAtual === "atendimento" ||
      jornada.atividadeAtual === "retornoBase"
    );
  };

  const tentarIniciarAlmoco = () => {
    if (!jornada.inicioExpediente) return;
    if (atividadeEmAndamento()) {
      setShowPausarParaAlmocoModal(true);
      return;
    }
    iniciarAlmoco();
  };

  const iniciarAlmoco = async () => {
    const gps = await getLocation();
    const inicio = nowISO();

    setJornada((p) => ({
      ...p,
      almocos: [
        ...p.almocos,
        {
          id: uuid(),
          inicio,
          fim: null,
          latInicio: gps?.lat,
          lngInicio: gps?.lng,
          suspensoEm: null,
          solicitanteSuspensao: null,
          justificativaSuspensao: null,
        },
      ],
      atividadeAnterior: p.atividadeAtual,
      atividadeAtual: "pausadoParaAlmoco",
    }));

    window.dispatchEvent(
      new CustomEvent("pause-for-lunch", { detail: { stepBefore: wizardStep } })
    );
  };

  const validarFinalizarAlmoco = () => {
    const ultimo = jornada.almocos[jornada.almocos.length - 1];
    if (!ultimo) return;

    const dur = (Date.now() - new Date(ultimo.inicio)) / 60000;
    if (dur < 50) {
      setShowEarlyFinishModal(true);
      return;
    }

    finalizarAlmoco();
  };

  const finalizarAlmoco = async () => {
    const gps = await getLocation();
    const fim = nowISO();

    setJornada((p) => {
      const almocos = [...p.almocos];
      const idx = almocos.length - 1;
      almocos[idx] = { ...almocos[idx], fim, latFim: gps.lat, lngFim: gps.lng };

      return {
        ...p,
        almocos,
        atividadeAtual: p.atividadeAnterior || "livre",
        atividadeAnterior: null,
      };
    });

    window.dispatchEvent(new CustomEvent("lunch-finished"));
  };

  const finalizarAlmocoEarly = () => {
    setShowEarlyFinishModal(false);
    finalizarAlmoco();
  };

  const confirmarSuspenderAlmoco = () => {
    const agora = nowISO();

    setJornada((p) => {
      const almocos = [...p.almocos];
      const idx = almocos.length - 1;

      if (idx >= 0) {
        almocos[idx].suspensoEm = agora;
        almocos[idx].justificativaSuspensao = motivoSuspensao;
        almocos[idx].solicitanteSuspensao = solicitante;
      }

      return {
        ...p,
        almocos,
        atividadeAtual: p.atividadeAnterior || "livre",
        atividadeAnterior: null,
      };
    });

    setMotivoSuspensao("");
    setSolicitante("");
    setShowSuspenderModal(false);

    window.dispatchEvent(new CustomEvent("lunch-finished"));
  };

  const confirmarPausaParaAlmoco = () => {
    iniciarAlmoco();
    setShowPausarParaAlmocoModal(false);
  };

  // ---- Retorno à base ----
  const onIniciarRetornoBase = async () => {
    const gps = await getLocation();
    setJornada((p) => ({
      ...p,
      atividadeAtual: "retornoBase",
      baseLogs: [
        ...p.baseLogs,
        { id: uuid(), tipo: "deslocamentoParaBase", time: nowISO(), gps, finalizado: false },
      ],
    }));
  };

  const onConfirmarChegadaBase = async () => {
    if (jornada.atividadeAtual === "pausadoParaAlmoco") {
      alert("Finalize o almoço antes de retornar.");
      return;
    }

    const gps = await getLocation();
    setJornada((p) => {
      const logs = [...p.baseLogs];
      const idx = logs.findIndex((l) => l.tipo === "deslocamentoParaBase" && !l.finalizado);
      if (idx !== -1) logs[idx].finalizado = true;

      logs.push({
        id: uuid(),
        tipo: "chegadaBase",
        time: nowISO(),
        gps,
      });

      return { ...p, baseLogs: logs };
    });

    window.dispatchEvent(new CustomEvent("start-new-atendimento"));
    setWizardStep(1);
    setTab(0);
  };

  // Encerrar expediente
  const encerrarExpediente = async () => {
    const gps = await getLocation();
    setJornada((p) => ({
      ...p,
      fimExpediente: nowISO(),
      gpsFimExpediente: gps,
    }));
    setSignatureEnabled(true);
  };

  const ultimoAlmoco =
  jornada.almocos?.[jornada.almocos.length - 1] || {
    inicio: null,
    fim: null,
    suspensoEm: null,
  };

  if (!visible) return null;

  return (
    <Overlay>
      <Panel>
        <Header>
          <TitleWrap>
            <Title>RDO - Jornada</Title>
            <Sub>{jornada.date}</Sub>
          </TitleWrap>
          <CloseBtn onClick={onClose}>✕</CloseBtn>
        </Header>

        {jornada.inicioExpediente && (
   <HeaderAlmoco
  almoco={ultimoAlmoco}
  atividadeAtual={jornada.atividadeAtual}
  step={wizardStep}
  onIniciar={tentarIniciarAlmoco}
  onSuspender={() => setShowSuspenderModal(true)}
  onFinalizar={validarFinalizarAlmoco}
/>

        )}

        <Progress><ProgressFill $pct={progressPct} /></Progress>

        <Body>
          {tab === 0 && (
            <WizardController
              jornada={jornada}
              setJornada={setJornada}
              step={wizardStep}
              setStep={setWizardStep}
            />
          )}

          {tab === 1 && (
            <>
              <RdoMain jornada={jornada} />
              <Timeline jornada={jornada} />
            </>
          )}

          {tab === 2 && (
            <>
              <BasePanel
                jornada={jornada}
                onIniciarRetornoBase={onIniciarRetornoBase}
                onConfirmarChegadaBase={onConfirmarChegadaBase}
              />
              <JourneyMap jornada={jornada} />
            </>
          )}

          {tab === 3 && (
            <RdoPreview
              jornada={jornada}
              signatureEnabled={signatureEnabled}
              sigRef={sigRef}
              onConfirmEncerrarJornada={encerrarExpediente}
            />
          )}
        </Body>

        <TabBar>
          {tabs.map((t) => (
            <TabBtn key={t.id} $active={t.id === tab} onClick={() => setTab(t.id)}>
              <t.icon size={18} />
              {t.label}
            </TabBtn>
          ))}
        </TabBar>

        {/* MODAIS */}
        {showSuspenderModal && (
          <ModalSuspenderAlmoco
            motivo={motivoSuspensao}
            setMotivo={setMotivoSuspensao}
            solicitante={solicitante}
            setSolicitante={setSolicitante}
            onCancel={() => setShowSuspenderModal(false)}
            onConfirm={confirmarSuspenderAlmoco}
          />
        )}

        {showEarlyFinishModal && (
          <ModalFinalizarAlmocoEarly
            onCancel={() => setShowEarlyFinishModal(false)}
            onConfirm={finalizarAlmocoEarly}
          />
        )}

        {showPausarParaAlmocoModal && (
          <ModalPausarParaAlmoco
            onCancel={() => setShowPausarParaAlmocoModal(false)}
            onConfirm={confirmarPausaParaAlmoco}
          />
        )}
      </Panel>
    </Overlay>
  );
};

export default AttendanceWizardModal;
