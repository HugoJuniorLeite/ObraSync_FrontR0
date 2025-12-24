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
} from "../styles/layout";

import { nowISO } from "../helpers/time";
import { getLocation } from "../helpers/location";
import { uuid } from "../helpers/uuid";

import WizardController from "../Wizard/WizardController";

import RdoMain from "../timeline/RdoMain";
import Timeline from "../timeline/Timeline";

import RdoPreview from "../preview/RdoPreview";
// import JourneyMap from "../mapa/JourneyMap";
// import BasePanel from "../base/BasePanel";

import { exportJornadaAsPdf } from "../export/exportPDF";

import HeaderAlmoco from "../almoco/HeaderAlmoco";
import ModalFinalizarAlmocoEarly from "../almoco/ModalFinalizarAlmocoEarly";
import ModalSuspenderAlmoco from "../almoco/ModalSuspenderAlmoco";
import ModalPausarParaAlmoco from "../almoco/ModalPausarParaAlmoco";

import { Clock, List, FileText, BarChart2 } from "lucide-react";

import FirstPanel from "../panel/FirstPanel";
import usePanelState from "../panel/usePanelState";
import { salvarJornada } from "../panel/jornadaStorage";
import mobileJourneyApi, { finishJourney } from "../../../services/mobileJourneyApi";
import { queueRequest } from "../../../utils/offlineQueue";
import { clearCurrentJourneyId, clearDraftJornada, getCurrentJourneyId, getLunchPatchId, loadDraftJornada, saveDraftJornada, updateLocalJourney } from "../../../utils/journeyStore";
import { readArray, writeArray } from "../../../utils/storageSafe";

// const STORAGE_KEY = "obra_sync_jornada_v1";
const STORAGE_KEY = "atendimentos_v3";


// ---- Tabs ----
const tabs = [
  { id: 0, label: "Atend.", icon: List },
  { id: 1, label: "Timeline", icon: Clock },
  { id: 2, label: "Painel", icon: BarChart2 },
  { id: 3, label: "RDO", icon: FileText },
];

const AttendanceWizardModal = ({ visible, onClose }) => {
  const panelState = usePanelState();

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
    } catch (err) { }

    return {
      id: uuid(),
      // date: new Date().toLocaleDateString("pt-BR"),
      date: new Date().toISOString().split("T")[0],
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
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(jornada));
    } catch (e) {
      console.warn("Erro ao salvar jornada:", e);
    }
  }, [jornada]);

  const sigRef = useRef(null);
  const [signatureEnabled, setSignatureEnabled] = useState(false);
  const [tab, setTab] = useState(0);

  // ----------------------------------------
  // MODAIS DO ALMOÇO
  // ----------------------------------------
  const [showSuspenderModal, setShowSuspenderModal] = useState(false);
  const [showEarlyFinishModal, setShowEarlyFinishModal] = useState(false);
  const [showPausarParaAlmocoModal, setShowPausarParaAlmocoModal] =
    useState(false);

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

  // ------- LÓGICA DE ALMOÇO -------
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

  //-----------------------------------------------------------------
  //INICIAR ALMOCO
  //---------------------------------------------------------------=

  // const iniciarAlmoco = async () => {
  //   const inicio = nowISO();
  //   const gps = await getLocation();

  //   // 1) Atualiza jornada imediatamente (sem depender do GPS ainda)
  //   setJornada((p) => ({
  //     ...p,
  //     almocos: [
  //       ...p.almocos,
  //       {
  //         id: uuid(),
  //         inicio,
  //         fim: null,
  //         latInicio: null,
  //         lngInicio: null,
  //         suspensoEm: null,
  //         solicitanteSuspensao: null,
  //         justificativaSuspensao: null,
  //       },
  //     ],
  //     atividadeAnterior: p.atividadeAtual,
  //     atividadeAtual: "pausadoParaAlmoco",
  //   }));

  //   await mobileJourneyApi.addLunch(jornada.id, {
  //     inicio,
  //     lat_inicio: gps?.lat ?? null,
  //     lng_inicio: gps?.lng ?? null,
  //   });

  //   // 2) Dispara evento para o Wizard pausar
  //   window.dispatchEvent(
  //     new CustomEvent("pause-for-lunch", { detail: { stepBefore: wizardStep } })
  //   );

  //   // // 3) GPS em background
  //   // getLocation().then((gps) => {
  //   //   if (!gps) return;
  //   //   setJornada((p) => {
  //   //     const almocos = [...p.almocos];
  //   //     const idx = almocos.length - 1;
  //   //     if (idx >= 0) {
  //   //       almocos[idx] = {
  //   //         ...almocos[idx],
  //   //         latInicio: gps.lat,
  //   //         lngInicio: gps.lng,
  //   //       };
  //   //     }
  //   //     return { ...p, almocos };
  //   //   });
  //   // });
  // };

  //   const iniciarAlmoco = async () => {
  //   const inicio = nowISO();
  //   const gps = await getLocation();

  //   const created = await mobileJourneyApi.addLunch(jornada.id, {
  //     inicio,
  //     lat_inicio: gps?.lat,
  //     lng_inicio: gps?.lng,
  //   });

  //   setJornada((p) => ({
  //     ...p,
  //     almocos: [
  //       ...p.almocos,
  //       {
  //         id: created.id, // ✅ ID REAL DO BANCO
  //         inicio,
  //         fim: null,
  //         latInicio: gps?.lat ?? null,
  //         lngInicio: gps?.lng ?? null,
  //       },
  //     ],
  //     activeLunchId: created.id, // 🔥 ESSENCIAL
  //     atividadeAnterior: p.atividadeAtual,
  //     atividadeAtual: "pausadoParaAlmoco",
  //   }));

  //   window.dispatchEvent(
  //     new CustomEvent("pause-for-lunch", { detail: { stepBefore: wizardStep } })
  //   );
  // };


  const iniciarAlmoco = async () => {
    const inicio = nowISO();

    let gps = null;
    try {
      gps = await getLocation();
    } catch { }

    const lunchLocalId = crypto.randomUUID();

    // 🔒 1️⃣ UI IMEDIATA
    setJornada((j) => ({
      ...j,
      almocos: [
        ...(j.almocos || []),
        {
          id: lunchLocalId,
          backendId: null,
          inicio,
          fim: null,
          gpsInicio: gps,
          gpsFim: null,
          suspensoEm: null,
          justificativaSuspensao: null,
          solicitanteSuspensao: null,
          sync_status: "pending",
        },
      ],
      activeLunchId: lunchLocalId,
      atividadeAnterior: j.atividadeAtual,
      atividadeAtual: "pausadoParaAlmoco",
    }));

    // 🔥 2️⃣ GARANTE EXISTÊNCIA DO DRAFT
    let draft = loadDraftJornada();

    if (!draft) {
      draft = {
        almocos: [],
        atendimentos: [],
        baseLogs: [],
        atividadeAtual: "pausadoParaAlmoco",
        atividadeAnterior: jornada.atividadeAtual,
        activeLunchId: lunchLocalId,
      };
    }

    saveDraftJornada({
      ...draft,
      almocos: [
        ...(draft.almocos || []),
        {
          id: lunchLocalId,
          backendId: null,
          inicio,
          fim: null,
          gpsInicio: gps,
          gpsFim: null,
        },
      ],
      activeLunchId: lunchLocalId,
    });

    // 🔹 3️⃣ BACKEND
    const journeyBackendId = getCurrentJourneyId();
    if (!journeyBackendId) return;

    const payload = {
      inicio,
      lat_inicio: gps?.lat ?? null,
      lng_inicio: gps?.lng ?? null,
      local_id: lunchLocalId,
    };

    try {
      const resp = await mobileJourneyApi.addLunch(
        journeyBackendId,
        payload
      );

      // 🔥 backend retorna OBJETO direto
      const backendId = resp?.id;

      if (!backendId) {
        console.error("Backend não retornou ID do almoço", resp);
        return;
      }

      // 🔥 4️⃣ SALVA backendId NO DRAFT
      const draftAtualizado = loadDraftJornada();
      if (draftAtualizado) {
        saveDraftJornada({
          ...draftAtualizado,
          almocos: draftAtualizado.almocos.map((a) =>
            a.id === lunchLocalId
              ? { ...a, backendId, sync_status: "synced" }
              : a
          ),
        });
      }

      // 🔄 5️⃣ REFLETE NO REACT
      setJornada((j) => ({
        ...j,
        almocos: j.almocos.map((a) =>
          a.id === lunchLocalId
            ? { ...a, backendId, sync_status: "synced" }
            : a
        ),
      }));
    } catch {
      // offline → fila
      queueRequest(
        `/mobile-journeys/${journeyBackendId}/lunches`,
        "POST",
        payload
      );
    }

    window.dispatchEvent(
      new CustomEvent("pause-for-lunch", {
        detail: { stepBefore: wizardStep },
      })
    );
  };


  //------------------------------------------------------------------
  //FINALIZAR ALMOCO
  //------------------------------------------------------------------


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

  // const finalizarAlmoco = async () => {
  //   const fim = nowISO();
  //   const gps = await getLocation();


  //   // 1) Atualiza jornada rapidamente
  //   setJornada((p) => {
  //     const almocos = [...p.almocos];
  //     const idx = almocos.length - 1;

  //     if (idx >= 0) {
  //       const almocoAntigo = almocos[idx];
  //       almocos[idx] = {
  //         ...almocoAntigo,
  //         fim,
  //       };
  //     }

  //     return {
  //       ...p,
  //       almocos,
  //       atividadeAtual: p.atividadeAnterior || "livre",
  //       atividadeAnterior: null,
  //     };
  //   });

  //   await mobileJourneyApi.finishLunch(jornada.id, {
  //     fim,
  //     lat_fim: gps?.lat ?? null,
  //     lng_fim: gps?.lng ?? null,
  //   });


  //   // 2) Notifica que almoço acabou
  //   window.dispatchEvent(new CustomEvent("lunch-finished"));

  //   // 3) GPS em background (latFim / lngFim)
  //   // getLocation().then((gps) => {
  //   //   if (!gps) return;
  //   //   setJornada((p) => {
  //   //     const almocos = [...p.almocos];
  //   //     const idx = almocos.length - 1;
  //   //     if (idx >= 0) {
  //   //       const almocoAntigo = almocos[idx];
  //   //       almocos[idx] = {
  //   //         ...almocoAntigo,
  //   //         latFim: gps.lat ?? almocoAntigo.latFim ?? null,
  //   //         lngFim: gps.lng ?? almocoAntigo.lngFim ?? null,
  //   //       };
  //   //     }
  //   //     return { ...p, almocos };
  //   //   });
  //   // });
  // };

  //   const finalizarAlmoco = async () => {
  //   const fim = nowISO();
  //   const gps = await getLocation();
  //   const lunchId = jornada.activeLunchId;

  //   if (!lunchId) return;

  //   await mobileJourneyApi.finishLunch(lunchId, {
  //     fim,
  //     lat_fim: gps?.lat,
  //     lng_fim: gps?.lng,
  //   });

  //   setJornada((p) => ({
  //     ...p,
  //     almocos: p.almocos.map((a) =>
  //       a.id === lunchId ? { ...a, fim } : a
  //     ),
  //     activeLunchId: null,
  //     atividadeAtual: p.atividadeAnterior || "livre",
  //     atividadeAnterior: null,
  //   }));

  //   window.dispatchEvent(new CustomEvent("lunch-finished"));
  // };


  const finalizarAlmocoEarly = async () => {
    setShowEarlyFinishModal(false);
    await finalizarAlmoco();
  };


  const finalizarAlmoco = async () => {
    const fim = nowISO();

    let gps = null;
    try {
      gps = await getLocation();
    } catch {
      console.warn("GPS indisponível ao finalizar almoço");
    }

    const lunchId = jornada.activeLunchId;
    if (!lunchId) return;

    // 🔒 ESTADO LOCAL PRIMEIRO
    setJornada((j) => ({
      ...j,
      almocos: j.almocos.map((a) =>
        a.id === lunchId
          ? {
            ...a,
            fim,
            gpsFim: gps,
            sync_status: "pending",
          }
          : a
      ),
      activeLunchId: null,
      atividadeAtual: j.atividadeAnterior || "livre",
      atividadeAnterior: null,
    }));

    // 🔹 Backend = side-effect
    const patchId = getLunchPatchId(jornada, lunchId);

    if (patchId) {
      const payload = {
        fim,
        lat_fim: gps?.lat ?? null,
        lng_fim: gps?.lng ?? null,
      };

      mobileJourneyApi
        .finishLunch(patchId, payload)
        .then(() => {
          setJornada((j) => ({
            ...j,
            almocos: j.almocos.map((a) =>
              a.id === lunchId
                ? { ...a, sync_status: "synced" }
                : a
            ),
          }));
        })
        .catch(() => {
          queueRequest(
            `/mobile-lunches/${patchId}/finish`,
            "PATCH",
            payload
          );
        });
    }



    window.dispatchEvent(new CustomEvent("lunch-finished"));
  };


  //----------------------------------------------------------------
  //SUSPENDER ALMOÇO
  //---------------------------------------------------------------

  // const confirmarSuspenderAlmoco = async () => {
  //   const agora = nowISO();
  //   const gps = await getLocation();


  //   setJornada((p) => {
  //     const almocos = [...p.almocos];
  //     const idx = almocos.length - 1;

  //     if (idx >= 0) {
  //       almocos[idx].suspensoEm = agora;
  //       almocos[idx].justificativaSuspensao = motivoSuspensao;
  //       almocos[idx].solicitanteSuspensao = solicitante;
  //     }

  //     return {
  //       ...p,
  //       almocos,
  //       atividadeAtual: p.atividadeAnterior || "livre",
  //       atividadeAnterior: null,
  //     };
  //   });

  //   await mobileJourneyApi.suspendLunch(jornada.id, {
  //     suspenso_em: agora,
  //     lat_suspenso: gps?.lat ?? null,
  //     lng_suspenso: gps?.lng ?? null,
  //     justificativa_suspensao: motivoSuspensao,
  //     solicitante_suspensao: solicitante,
  //   });


  //   setMotivoSuspensao("");
  //   setSolicitante("");
  //   setShowSuspenderModal(false);

  //   window.dispatchEvent(new CustomEvent("lunch-finished"));
  // };

  const confirmarPausaParaAlmoco = () => {
    iniciarAlmoco();
    setShowPausarParaAlmocoModal(false);
  };

  // const confirmarSuspenderAlmoco = async () => {
  //   const agora = nowISO();
  //   const gps = await getLocation();
  //   const lunchId = jornada.activeLunchId;

  //   if (!lunchId) return;

  //   await mobileJourneyApi.suspendLunch(lunchId, {
  //     suspenso_em: agora,
  //     lat_suspenso: gps?.lat,
  //     lng_suspenso: gps?.lng,
  //     justificativa_suspensao: motivoSuspensao,
  //     solicitante_suspensao: solicitante,
  //   });

  //   setJornada((p) => ({
  //     ...p,
  //     almocos: p.almocos.map((a) =>
  //       a.id === lunchId
  //         ? {
  //             ...a,
  //             suspensoEm: agora,
  //             justificativaSuspensao: motivoSuspensao,
  //             solicitanteSuspensao: solicitante,
  //           }
  //         : a
  //     ),
  //     activeLunchId: null,
  //     atividadeAtual: p.atividadeAnterior || "livre",
  //     atividadeAnterior: null,
  //   }));

  //   setMotivoSuspensao("");
  //   setSolicitante("");
  //   setShowSuspenderModal(false);

  //   window.dispatchEvent(new CustomEvent("lunch-finished"));
  // };
  const confirmarSuspenderAlmoco = async () => {
    const agora = nowISO();

    let gps = null;
    try {
      gps = await getLocation();
    } catch { }

    const lunchId = jornada.activeLunchId;
    if (!lunchId) return;

    // 🔥 LÊ DO DRAFT (FONTE DA VERDADE)
    const draft = loadDraftJornada();
    const lunch = draft?.almocos?.find(
      (a) => a.id === lunchId
    );

    if (!lunch?.backendId) {
      alert(
        "Aguardando sincronização do almoço com o servidor. Tente novamente em alguns segundos."
      );
      return;
    }

    // 🔒 UI
    setJornada((j) => ({
      ...j,
      almocos: j.almocos.map((a) =>
        a.id === lunchId
          ? {
            ...a,
            suspensoEm: agora,
            justificativaSuspensao: motivoSuspensao,
            solicitanteSuspensao: solicitante,
            sync_status: "pending",

          }
          : a
      ),
      activeLunchId: null,
      atividadeAtual: j.atividadeAnterior || "livre",
      atividadeAnterior: null,
    }));

    const payload = {
      suspenso_em: agora,
      lat_suspenso: gps?.lat ?? null,
      lng_suspenso: gps?.lng ?? null,
      justificativa_suspensao: motivoSuspensao,
      solicitante_suspensao: solicitante,
    };

    // ✅ AGORA SIM O BACKEND RECEBE
    await mobileJourneyApi.suspendLunch(
      lunch.backendId,
      payload
    )
    .then(() => {
    setJornada((j) => ({
      ...j,
      almocos: j.almocos.map((a) =>
        a.id === lunchId
          ? { ...a, sync_status: "synced" }
          : a
      ),
    }));
  })
      .catch(() => {
      // 🔥 offline / erro → fila
      queueRequest(
        `/mobile-lunches/${lunch.backendId}/suspend`,
        "PATCH",
        payload
      );
    });

    setMotivoSuspensao("");
    setSolicitante("");
    setShowSuspenderModal(false);

    window.dispatchEvent(new CustomEvent("lunch-finished"));
  };


  // // ---- Retorno à base ----
  // const onIniciarRetornoBase = () => {
  //   const time = nowISO();

  //   // 1) Marca retorno base rápido
  //   setJornada((p) => ({
  //     ...p,
  //     atividadeAtual: "retornoBase",
  //     baseLogs: [
  //       ...p.baseLogs,
  //       {
  //         id: uuid(),
  //         tipo: "deslocamentoParaBase",
  //         time,
  //         gps: null,
  //         finalizado: false,
  //       },
  //     ],
  //   }));

  //   // 2) GPS depois
  //   getLocation().then((gps) => {
  //     if (!gps) return;
  //     setJornada((p) => {
  //       const logs = [...p.baseLogs];
  //       const idx = logs.findIndex(
  //         (l) =>
  //           l.tipo === "deslocamentoParaBase" &&
  //           l.time === time &&
  //           !l.finalizado
  //       );
  //       if (idx !== -1) {
  //         logs[idx] = { ...logs[idx], gps };
  //       }
  //       return { ...p, baseLogs: logs };
  //     });
  //   });
  // };



  // const onConfirmarChegadaBase = () => {
  //   if (jornada.atividadeAtual === "pausadoParaAlmoco") {
  //     alert("Finalize o almoço antes de retornar.");
  //     return;
  //   }

  //   const time = nowISO();

  //   // 1) Atualiza estado imediatamente
  //   setJornada((p) => {
  //     const logs = [...p.baseLogs];
  //     const idx = logs.findIndex(
  //       (l) => l.tipo === "deslocamentoParaBase" && !l.finalizado
  //     );
  //     if (idx !== -1) logs[idx].finalizado = true;

  //     logs.push({
  //       id: uuid(),
  //       tipo: "chegadaBase",
  //       time,
  //       gps: null,
  //     });

  //     return { ...p, baseLogs: logs };
  //   });

  //   window.dispatchEvent(new CustomEvent("start-new-atendimento"));
  //   setWizardStep(1);
  //   setTab(0);

  //   // 2) GPS em background
  //   getLocation().then((gps) => {
  //     if (!gps) return;
  //     setJornada((p) => {
  //       const logs = [...p.baseLogs];
  //       const idx = logs.findIndex(
  //         (l) => l.tipo === "chegadaBase" && l.time === time
  //       );
  //       if (idx !== -1) {
  //         logs[idx] = { ...logs[idx], gps };
  //       }
  //       return { ...p, baseLogs: logs };
  //     });
  //   });
  // };

  // Encerrar expediente (rápido)
  // const encerrarExpediente = () => {
  //   // 1 — captura assinatura antes de qualquer coisa
  //   const assinatura = sigRef.current?.toDataURL();

  //   // 2 — monta jornada final sem depender do GPS ainda
  //   const jornadaFinalBase = {
  //     ...jornada,
  //     fimExpediente: nowISO(),
  //     id: uuid(),
  //     assinatura: assinatura || null,
  //   };

  //   // 3 — salva jornada com os dados que já temos
  //   salvarJornada(jornadaFinalBase);

  //   // 4 — limpa localStorage
  //   localStorage.removeItem(STORAGE_KEY);
  //   localStorage.removeItem("wizard_step");
  //   localStorage.removeItem("wizard_state");

  //   // 5 — limpa assinatura visual
  //   sigRef.current?.clear();
  //   setSignatureEnabled(false);

  //   // 6 — reseta estados da aplicação
  //   setWizardStep(0);
  //   setTab(0);
  //   setJornada({
  //     id: uuid(),
  //     // date: new Date().toLocaleDateString("pt-BR"),
  //     date: new Date().toISOString().split("T")[0],
  //     inicioExpediente: null,
  //     fimExpediente: null,
  //     atendimentos: [],
  //     almocos: [],
  //     atividadeAtual: "livre",
  //     atividadeAnterior: null,
  //     baseLogs: [],
  //   });

  //   alert("Jornada encerrada com sucesso!");

  //   // 7 — pega GPS em background e atualiza jornada salva
  //   getLocation().then((gps) => {
  //     const jornadaComGps = {
  //       ...jornadaFinalBase,
  //       gpsFimExpediente: gps || null,
  //     };
  //     salvarJornada(jornadaComGps);
  //   });
  // };


  //   const encerrarExpediente = async () => {
  //     const assinatura = sigRef.current?.toDataURL();

  //     // 1️⃣ monta jornada final SEM LIMPAR NADA AINDA
  //     const jornadaFinalBase = {
  //       ...jornada,
  //       fimExpediente: nowISO(),
  //       assinatura: assinatura || null,
  //     };

  //     // 2️⃣ pega GPS (pode demorar, mas não tem problema!)
  //     let gps = null;
  //     try {
  //       gps = await getLocation();
  //     } catch { }

  //     // 3️⃣ gera versão final
  //     const jornadaFinal = {
  //       ...jornadaFinalBase,
  //       gpsFimExpediente: gps || null,
  //     };

  //     // 4️⃣ SALVA IMEDIATAMENTE
  //     // salvarJornada(jornadaFinal);

  //    // 4️⃣Rev SALVA IMEDIATAMENTE
  //     salvarJornada({
  //   ...jornadaFinal,
  //   sync_status: "pending",
  // });

  //   // 5️⃣ 🔥 POST/PATCH NA API
  //   try {
  //         const backendId = getCurrentJourneyId();

  //     await finishJourney(backendId, {
  //       fimExpediente: jornadaFinalBase.fimExpediente,
  //       gpsFim: gps,
  //       assinatura,
  //     });

  //       updateLocalJourney(backendId, {
  //     sync_status: "synced",
  //     synced_at: new Date().toISOString(),
  //   });

  //   } catch (err) {
  //     console.error("Erro ao finalizar jornada na API:", err);
  //     const backendId = getCurrentJourneyId();

  //     // 🔥 NOVO — fila offline
  //     queueRequest(
  //       `/mobile-journeys/${backendId}/finish`,
  //       "PATCH",
  //       {
  //         fimExpediente: jornadaFinalBase.fimExpediente,
  //         gpsFim: gps,
  //         assinatura,
  //       }
  //     );
  //   }

  //     alert("Jornada encerrada com sucesso!");

  //     // 5️⃣ AGORA sim limpa storages — DEPOIS de salvar
  //     localStorage.removeItem(STORAGE_KEY);
  //     localStorage.removeItem("wizard_step");
  //     localStorage.removeItem("wizard_state");

  //     // 6️⃣ limpa UI
  //     sigRef.current?.clear();
  //     setSignatureEnabled(false);

  //     // 7️⃣ gera nova jornada limpa
  //     setJornada({
  //       id: uuid(),
  //       date: new Date().toISOString().split("T")[0],
  //       inicioExpediente: null,
  //       fimExpediente: null,
  //       atendimentos: [],
  //       almocos: [],
  //       atividadeAtual: "livre",
  //       atividadeAnterior: null,
  //       baseLogs: [],
  //     });

  //     setWizardStep(0);
  //     setTab(0);
  //   };


  // const encerrarExpediente = async () => {
  //   // 🔒 1️⃣ GERA EVENTO LOCAL DE ENCERRAMENTO
  //   const fimExpediente = nowISO();
  //   const assinatura = sigRef.current?.toDataURL() || null;

  //   let gps = null;
  //   try {
  //     gps = await getLocation();
  //   } catch {
  //     console.warn("GPS indisponível ao encerrar expediente");
  //   }

  //   // 🔒 2️⃣ JORNADA FINAL (VERDADE LOCAL)
  //   const jornadaFinal = {
  //     ...jornada,
  //     fimExpediente,
  //     gpsFimExpediente: gps,
  //     assinatura,
  //     sync_status: "pending", // 🔥 padrão offline-first
  //   };

  //   // 🔒 3️⃣ SALVA LOCAL IMEDIATAMENTE (NUNCA DEPENDE DE BACKEND)
  //   salvarJornada(jornadaFinal);

  //   // 🔹 4️⃣ BACKEND = SIDE-EFFECT
  //   const journeyBackendId = getCurrentJourneyId();

  //   if (journeyBackendId) {
  //     const payload = {
  //       fimExpediente,
  //       gpsFim: gps,
  //       assinatura,
  //     };

  //     finishJourney(journeyBackendId, payload)
  //       .then(() => {
  //         updateLocalJourney(journeyBackendId, {
  //           sync_status: "synced",
  //           synced_at: new Date().toISOString(),
  //         });
  //       })
  //       .catch(() => {
  //         queueRequest(
  //           `/mobile-journeys/${journeyBackendId}/finish`,
  //           "PATCH",
  //           payload
  //         );
  //       });
  //   }

  //   // 🔔 5️⃣ FEEDBACK AO USUÁRIO
  //   alert("Jornada encerrada com sucesso!");

  //   // 🔒 6️⃣ LIMPA STORAGE APÓS PERSISTÊNCIA LOCAL
  //   localStorage.removeItem(STORAGE_KEY);
  //   localStorage.removeItem("wizard_step");
  //   localStorage.removeItem("wizard_state");

  //   // 🔹 7️⃣ LIMPA UI
  //   sigRef.current?.clear();
  //   setSignatureEnabled(false);

  //   // 🔹 8️⃣ INICIA NOVA JORNADA LIMPA
  //   setJornada({
  //     id: uuid(),
  //     date: new Date().toISOString().split("T")[0],
  //     inicioExpediente: null,
  //     fimExpediente: null,
  //     gpsFimExpediente: null,
  //     atendimentos: [],
  //     almocos: [],
  //     atividadeAtual: "livre",
  //     atividadeAnterior: null,
  //     baseLogs: [],
  //     sync_status: "draft",
  //   });

  //   setWizardStep(0);
  //   setTab(0);
  // };


  const encerrarExpediente = async () => {
  const fimExpediente = nowISO();
  const assinatura = sigRef.current?.toDataURL() || null;

  let gps = null;
  try {
    gps = await getLocation();
  } catch {}

  // 🔒 1️⃣ VERDADE LOCAL
  const jornadaFinal = {
    ...jornada,
    fimExpediente,
    gpsFimExpediente: gps,
    assinatura,
    sync_status: "pending",
  };

  // 🔒 2️⃣ SALVA LOCAL
  salvarJornada(jornadaFinal);

  // 🔹 3️⃣ BACKEND = SIDE-EFFECT
  const journeyBackendId = getCurrentJourneyId();

  if (journeyBackendId) {
    const payload = {
      fimExpediente,
      gpsFim: {
        lat: gps?.lat ?? null,
        lng: gps?.lng ?? null,
      },
      assinatura,
    };

    finishJourney(journeyBackendId, payload)
      .then(() => {
        updateLocalJourney(journeyBackendId, {
          sync_status: "synced",
          synced_at: new Date().toISOString(),
        });
      })
      .catch(() => {
        queueRequest(
          `/mobile-journeys/${journeyBackendId}/finish`,
          "PATCH",
          payload
        );
      });
  }

  alert("Jornada encerrada com sucesso!");

  // 🔥 4️⃣ LIMPA FONTES DE VERDADE
  clearDraftJornada();
  clearCurrentJourneyId();

  // 🔹 5️⃣ LIMPA UI
  sigRef.current?.clear();
  setSignatureEnabled(false);

  setJornada({
    id: uuid(),
    date: new Date().toISOString().split("T")[0],
    inicioExpediente: null,
    fimExpediente: null,
    gpsFimExpediente: null,
    atendimentos: [],
    almocos: [],
    atividadeAtual: "livre",
    atividadeAnterior: null,
    baseLogs: [],
    sync_status: "draft",
  });

  setWizardStep(0);
  setTab(0);
};


  // const encerrarExpediente = async () => {
  //   const assinatura = sigRef.current?.toDataURL();

  //   const fimExpediente = nowISO();

  //   // 1️⃣ Atualiza jornada (NÃO LIMPA!)
  //   setJornada((j) => ({
  //     ...j,
  //     fimExpediente,
  //     assinatura: assinatura || null,
  //   }));

  //   // 2️⃣ Salva local (offline-first)
  //   salvarJornada({
  //     ...jornada,
  //     fimExpediente,
  //     assinatura,
  //     sync_status: "pending",
  //   });

  //   // 3️⃣ Backend
  //   try {
  //     const backendId = getCurrentJourneyId();

  //     if (backendId) {
  //       await finishJourney(backendId, {
  //         fimExpediente,
  //         assinatura,
  //       });

  //       updateLocalJourney(jornada.id, {
  //         sync_status: "synced",
  //         synced_at: new Date().toISOString(),
  //       });
  //     }
  //   } catch (err) {
  //     queueRequest(
  //       `/mobile-journeys/${getCurrentJourneyId()}/finish`,
  //       "PATCH",
  //       { fimExpediente, assinatura }
  //     );
  //   }

  //   alert("Jornada encerrada com sucesso!");
  // };



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

        <Progress>
          <ProgressFill $pct={progressPct} />
        </Progress>

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
            <FirstPanel
              panelState={panelState}
              exportJornadaAsPdf={exportJornadaAsPdf}
            />
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
            <TabBtn
              key={t.id}
              $active={t.id === tab}
              onClick={() => {
                setTab(t.id);

                if (t.id === 3) {
                  if (
                    jornada.inicioExpediente &&
                    !jornada.fimExpediente
                  ) {
                    setSignatureEnabled(true);
                  }
                }
              }}
            >
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
