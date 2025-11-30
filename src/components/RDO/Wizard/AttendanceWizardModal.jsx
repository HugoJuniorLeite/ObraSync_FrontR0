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
//   Banner,
//   Card,
//   Label,
//   BigBtn,
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

// const tabs = [
//   { id: 0, label: "Atendimentos" },
//   { id: 1, label: "Linha do Tempo" },
//   { id: 2, label: "Painel" },
//   { id: 3, label: "RDO" },
// ];

// const AttendanceWizardModal = ({ visible, onClose }) => {
//   const [tab, setTab] = useState(0);

// const [jornada, setJornada] = useState(() => ({
//   id: uuid(),
//   date: new Date().toLocaleDateString("pt-BR"),
//   inicioExpediente: null,
//   fimExpediente: null,
//   atendimentos: [],
//   almoco: { inicio: null, fim: null, gpsInicio: null, gpsFim: null },

//   atividadeAtual: "livre",       // <-- ADICIONAR
//   atividadeAnterior: null,       // <-- ADICIONAR

//   baseLogs: [],
//   gpsFimExpediente: null,
// }));


//   const sigRef = useRef(null);
//   const [signatureEnabled, setSignatureEnabled] = useState(false);

//   const [showSuspenderModal, setShowSuspenderModal] = useState(false);
// const [showEarlyFinishModal, setShowEarlyFinishModal] = useState(false);
// const [showPausarParaAlmocoModal, setShowPausarParaAlmocoModal] = useState(false);


// const [motivoSuspensao, setMotivoSuspensao] = useState("");
// const [solicitante, setSolicitante] = useState("");


// useEffect(() => {
//   const handler = () => setTab(2); // painel
//   window.addEventListener("go-to-painel", handler);
//   return () => window.removeEventListener("go-to-painel", handler);
// }, []);


//   const progressPct = (() => {
//     let total = 4;
//     let done = 0;

//     if (jornada.inicioExpediente) done++;
//     if (jornada.atendimentos.length > 0) done++;
//     if (jornada.almoco?.inicio && jornada.almoco?.fim) done++;
//     if (jornada.fimExpediente) done++;

//     return (done / total) * 100;
//   })();

//   // useEffect(() => {
//   //   if (visible && !jornada.inicioExpediente) {
//   //     setJornada((p) => ({
//   //       ...p,
//   //       inicioExpediente: nowISO(),
//   //     }));
//   //   }
//   // }, [visible, jornada.inicioExpediente]);

//   // if (!visible) return null;

//   // const iniciarAlmoco = async () => {
//   //   const gps = await getLocation();
//   //   setJornada((p) => ({
//   //     ...p,
//   //     almoco: {
//   //       ...p.almoco,
//   //       inicio: nowISO(),
//   //       gpsInicio: gps,
//   //     },
//   //   }));
//   // };

//   // const finalizarAlmoco = async () => {
//   //   const gps = await getLocation();
//   //   setJornada((p) => ({
//   //     ...p,
//   //     almoco: {
//   //       ...p.almoco,
//   //       fim: nowISO(),
//   //       gpsFim: gps,
//   //     },
//   //   }));
//   // };

// const atividadeEmAndamento = () => {
//   return (
//     jornada.atividadeAtual === "deslocamento" ||
//     jornada.atividadeAtual === "atendimento" ||
//     jornada.atividadeAtual === "retornoBase"
//   );
// };

// const tentarIniciarAlmoco = () => {

//     if (!jornada.inicioExpediente) {
//     // alert("Inicie a jornada antes de iniciar o almoço.");
//     return;
//     }
//   if (atividadeEmAndamento()) {
//     setShowPausarParaAlmocoModal(true);
//     return;
//   }

//   iniciarAlmoco(); // permitido
// };



//   const onIniciarRetornoBase = async () => {
//     const gps = await getLocation();
//     setJornada((p) => ({
//       ...p,
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

// const onConfirmarChegadaBase = async () => {
//   if (jornada.atividadeAtual === "pausadoParaAlmoco") {
//     alert("Retorno pausado para almoço. Finalize o almoço antes de continuar.");
//     return;
//   }

//   const gps = await getLocation();

//   setJornada((p) => {
//     const logs = [...(p.baseLogs || [])];

//     const idx = logs.findIndex(
//       l => l.tipo === "deslocamentoParaBase" && !l.finalizado
//     );

//     if (idx !== -1) logs[idx].finalizado = true;

//     logs.push({
//       id: crypto.randomUUID(),
//       tipo: "chegadaBase",
//       time: nowISO(),
//       gps,
//     });

//     return { ...p, baseLogs: logs };
//   });

//   // 🔥 RESET DO ATENDIMENTO
//   startNewAtendimento("externo");

//   // 🔥 VOLTA PARA STEP 1
//   setStep(1);
// };

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

//   const exportarHistoricoPDF = () => {
//     exportJornadaAsPdf(jornada);
//   };

//   const changeTab = (id) => {
//     setTab(id);
//   };

//   const iniciarAlmoco = async () => {
//   const gps = await getLocation();
//   setJornada(p => ({
//     ...p,
//     almoco: {
//       inicio: nowISO(),
//       fim: null,
//       gpsInicio: gps
//     }
//   }));
// };

// const confirmarPausaParaAlmoco = async () => {
//   setJornada(p => ({
//     ...p,
//     atividadeAtual: "pausadoParaAlmoco",
//   }));

//   iniciarAlmoco();       // inicia almoço normal
//   setShowPausarParaAlmocoModal(false);
// };


// const validarFinalizarAlmoco = () => {
//   const duracao = (Date.now() - new Date(jornada.almoco.inicio)) / 60000;

//   if (duracao < 50) {
//     setShowEarlyFinishModal(true);
//     return;
//   }

//   finalizarAlmoco();
// };

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

//   setShowEarlyFinishModal(false);
// };


// const finalizarAlmocoEarly = () => {
//   setShowEarlyFinishModal(false);
//   finalizarAlmoco();
// };

// const confirmarSuspenderAlmoco = () => {
//   setJornada(p => ({
//     ...p,
//     almoco: {
//       inicio: null,
//       fim: null,
//       suspensoEm: nowISO(),
//       motivoSuspensao,
//       solicitante
//     }
//   }));

//   setMotivoSuspensao("");
//   setSolicitante("");
//   setShowSuspenderModal(false);
// };



//   // =====================================================
//   // TABS
//   // =====================================================

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

//   // =====================================================
//   // RETURN DO MODAL (AGORA 100% CORRETO E DENTRO DA FUNÇÃO)
//   // =====================================================

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

//           <CloseBtn onClick={onClose}>✕</CloseBtn>
//         </Header>

// {jornada.inicioExpediente && (
//   <HeaderAlmoco
//     almoco={jornada.almoco}
//     atividadeAtual={jornada.atividadeAtual}
//     onIniciar={tentarIniciarAlmoco}
//     onSuspender={() => setShowSuspenderModal(true)}
//     onFinalizar={validarFinalizarAlmoco}
//   />
// )}




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
//               onClick={() => changeTab(t.id)}
//             >
//               {t.label}
//             </TabBtn>
//           ))}
//         </TabBar>

//         {showSuspenderModal && (
//   <ModalSuspenderAlmoco
//     motivo={motivoSuspensao}
//     setMotivo={setMotivoSuspensao}
//     solicitante={solicitante}
//     setSolicitante={setSolicitante}
//     onCancel={() => setShowSuspenderModal(false)}
//     onConfirm={confirmarSuspenderAlmoco}
//   />
// )}

// {showEarlyFinishModal && (
//   <ModalFinalizarAlmocoEarly
//     onCancel={() => setShowEarlyFinishModal(false)}
//     onConfirm={finalizarAlmocoEarly}
//   />
// )}

//       </Panel>
//     </Overlay>
//   );
// };

// export default AttendanceWizardModal;


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
  Label
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


// ==============================================
// TABS
// ==============================================

const tabs = [
  { id: 0, label: "Atendimentos" },
  { id: 1, label: "Linha do Tempo" },
  { id: 2, label: "Painel" },
  { id: 3, label: "RDO" },
];

// ==============================================
// COMPONENTE PRINCIPAL
// ==============================================

const AttendanceWizardModal = ({ visible, onClose }) => {

  // ===========================
  // ESTADOS PRINCIPAIS DA JORNADA
  // ===========================

  const [tab, setTab] = useState(0);

  const [jornada, setJornada] = useState(() => ({
    id: uuid(),
    date: new Date().toLocaleDateString("pt-BR"),
    inicioExpediente: null,
    fimExpediente: null,
    atendimentos: [],
    almoco: {
      inicio: null,
      fim: null,
      gpsInicio: null,
      gpsFim: null,
      suspensoEm: null,
      motivoSuspensao: null,
      solicitante: null,
    },
    atividadeAtual: "livre",       // DESLOCAMENTO / ATENDIMENTO / RETORNO / LIVRE
    atividadeAnterior: null,       // usado quando pausa para almoço
    baseLogs: [],
    gpsFimExpediente: null,
  }));

  const sigRef = useRef(null);
  const [signatureEnabled, setSignatureEnabled] = useState(false);

  // ===========================
  // MODAIS DO ALMOÇO
  // ===========================

  const [showSuspenderModal, setShowSuspenderModal] = useState(false);
  const [showEarlyFinishModal, setShowEarlyFinishModal] = useState(false);
  const [showPausarParaAlmocoModal, setShowPausarParaAlmocoModal] = useState(false);

  const [motivoSuspensao, setMotivoSuspensao] = useState("");
  const [solicitante, setSolicitante] = useState("");

  // ===========================
  // CONTROLE DE TABS EXTERNOS
  // ===========================

  useEffect(() => {
    const handler = () => setTab(2);
    window.addEventListener("go-to-painel", handler);
    return () => window.removeEventListener("go-to-painel", handler);
  }, []);

  // ===========================
  // PROGRESS BAR
  // ===========================

  const progressPct = (() => {
    let total = 4;
    let done = 0;

    if (jornada.inicioExpediente) done++;
    if (jornada.atendimentos.length > 0) done++;
    if (jornada.almoco?.inicio && jornada.almoco?.fim) done++;
    if (jornada.fimExpediente) done++;

    return (done / total) * 100;
  })();

  // ==========================================
  // REGRAS DE ALMOÇO
  // ==========================================

  const atividadeEmAndamento = () => {
    return (
      jornada.atividadeAtual === "deslocamento" ||
      jornada.atividadeAtual === "atendimento" ||
      jornada.atividadeAtual === "retornoBase"
    );
  };

  // REGRAS DE INÍCIO DE ALMOÇO
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

  setJornada(p => ({
    ...p,
    almoco: {
      inicio: nowISO(),
      fim: null,
      gpsInicio: gps,
      gpsFim: null,
      suspensoEm: null,
    },
    atividadeAnterior: p.atividadeAtual,
    atividadeAtual: "pausadoParaAlmoco",
  }));

  // 🔥 AVISA O WIZARD CONTROLLER (SEM ISSO OS STEPS NÃO PARAM)
  window.dispatchEvent(new CustomEvent("pause-for-lunch", {
    detail: { stepBefore: null }
  }));
};


  // FINALIZAR ALMOÇO COM VALIDAÇÃO
  const validarFinalizarAlmoco = () => {
    const dur = (Date.now() - new Date(jornada.almoco.inicio)) / 60000;

    if (dur < 50) {
      setShowEarlyFinishModal(true);
      return;
    }

    finalizarAlmoco();
  };

  const finalizarAlmocoEarly = () => {
    setShowEarlyFinishModal(false);
    finalizarAlmoco();
  };

const finalizarAlmoco = async () => {
  const gps = await getLocation();

  setJornada(p => ({
    ...p,
    almoco: {
      ...p.almoco,
      fim: nowISO(),
      gpsFim: gps,
    },
    atividadeAtual: p.atividadeAnterior || "livre",
    atividadeAnterior: null,
  }));

  // 🔥 AVISA O WIZARD CONTROLLER
  window.dispatchEvent(new CustomEvent("lunch-finished"));

  setShowEarlyFinishModal(false);
};


  // SUSPENDER ALMOÇO
const confirmarSuspenderAlmoco = () => {
  const agora = nowISO();

  setJornada(p => ({
    ...p,
    almoco: {
      inicio: null,
      fim: null,
      gpsInicio: null,
      gpsFim: null,
      suspensoEm: agora,
      motivoSuspensao,
      solicitante
    },
    atividadeAtual: p.atividadeAnterior || "livre",
    atividadeAnterior: null
  }));

  setMotivoSuspensao("");
  setSolicitante("");
  setShowSuspenderModal(false);

  // Libera os Steps no WizardController
  window.dispatchEvent(new CustomEvent("lunch-finished"));
};

// Pausar atividade e iniciar almoço
const confirmarPausaParaAlmoco = () => {
  setJornada(p => ({
    ...p,
    atividadeAnterior: p.atividadeAtual,
    atividadeAtual: "pausadoParaAlmoco",
  }));

  iniciarAlmoco();

  window.dispatchEvent(new CustomEvent("pause-for-lunch", {
    detail: { stepBefore: null }
  }));

  setShowPausarParaAlmocoModal(false);
};


  // ===============================================
  // RETORNO À BASE
  // ===============================================

  const onIniciarRetornoBase = async () => {
    const gps = await getLocation();
    setJornada((p) => ({
      ...p,
      atividadeAtual: "retornoBase",
      baseLogs: [
        ...p.baseLogs,
        {
          id: uuid(),
          tipo: "deslocamentoParaBase",
          time: nowISO(),
          gps,
          finalizado: false,
        },
      ],
    }));
  };

  const onConfirmarChegadaBase = async () => {
    if (jornada.atividadeAtual === "pausadoParaAlmoco") {
      alert("Retorno pausado para almoço. Finalize o almoço antes de continuar.");
      return;
    }

    const gps = await getLocation();

    setJornada((p) => {
      const logs = [...(p.baseLogs || [])];

      const idx = logs.findIndex(
        l => l.tipo === "deslocamentoParaBase" && !l.finalizado
      );

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

    setTab(0);
  };

  // ===============================================
  // ENCERRAR EXPEDIENTE
  // ===============================================

  const encerrarExpediente = async () => {
    const gps = await getLocation();
    setJornada((p) => ({
      ...p,
      fimExpediente: nowISO(),
      gpsFimExpediente: gps,
    }));
    setSignatureEnabled(true);
  };

  const onConfirmEncerrarJornada = () => {
    if (!signatureEnabled) {
      alert("Finalize o expediente antes de encerrar a jornada.");
      return;
    }
    alert("Jornada encerrada com sucesso!");
    onClose?.();
  };

  // ===============================================
  // EXPORTAÇÃO
  // ===============================================

  const exportarHistoricoPDF = () => {
    exportJornadaAsPdf(jornada);
  };

  // ===============================================
  // TABS
  // ===============================================

  const renderAtendimentosTab = () => {
    return (
      <WizardController
        jornada={jornada}
        setJornada={setJornada}
        iniciarAlmoco={iniciarAlmoco}
        finalizarAlmoco={finalizarAlmoco}
        encerrarExpediente={encerrarExpediente}
      />
    );
  };

  const renderTimelineTab = () => {
    if (jornada.atendimentos.length === 0) {
      return (
        <Card>
          <Label>Nenhum atendimento registrado ainda.</Label>
        </Card>
      );
    }

    return (
      <>
        <RdoMain jornada={jornada} />
        <Timeline jornada={jornada} />
      </>
    );
  };

  const renderPainelTab = () => {
    return (
      <>
        <BasePanel
          jornada={jornada}
          onIniciarRetornoBase={onIniciarRetornoBase}
          onConfirmarChegadaBase={onConfirmarChegadaBase}
        />

        <JourneyMap jornada={jornada} />

        <div style={{ marginTop: 12 }}>
          <button
            onClick={exportarHistoricoPDF}
            style={{
              padding: "10px 12px",
              width: "100%",
              background: "#38bdf8",
              border: "1px solid #38bdf8",
              color: "#081018",
              borderRadius: 10,
            }}
          >
            Exportar Histórico em PDF
          </button>
        </div>
      </>
    );
  };

  const renderRdoTab = () => {
    return (
      <RdoPreview
        jornada={jornada}
        signatureEnabled={signatureEnabled}
        sigRef={sigRef}
        onConfirmEncerrarJornada={onConfirmEncerrarJornada}
      />
    );
  };

  // ===============================================
  // RETURN
  // ===============================================

  if (!visible) return null;

  return (
    <Overlay>
      <Panel
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
      >
        <Header>
          <TitleWrap>
            <Title>RDO - Jornada do Técnico</Title>
            <Sub>{jornada.date}</Sub>
          </TitleWrap>

          <CloseBtn onClick={onClose}>✕</CloseBtn>
        </Header>

        {/* HEADER ALMOÇO */}
        {jornada.inicioExpediente && (
          <HeaderAlmoco
            almoco={jornada.almoco}
            atividadeAtual={jornada.atividadeAtual}
            step={tab}
            onIniciar={tentarIniciarAlmoco}
            onSuspender={() => setShowSuspenderModal(true)}
            onFinalizar={validarFinalizarAlmoco}
          />
        )}

        <Progress>
          <ProgressFill $pct={progressPct} />
        </Progress>

        <Body>
          {tab === 0 && renderAtendimentosTab()}
          {tab === 1 && renderTimelineTab()}
          {tab === 2 && renderPainelTab()}
          {tab === 3 && renderRdoTab()}
        </Body>

        <TabBar>
          {tabs.map((t) => (
            <TabBtn
              key={t.id}
              $active={t.id === tab}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </TabBtn>
          ))}
        </TabBar>

        {/* ====== MODAIS ======= */}

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
