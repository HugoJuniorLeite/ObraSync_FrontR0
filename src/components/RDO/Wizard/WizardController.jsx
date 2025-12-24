import { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
// WizardController.jsx
import React, { useState, useEffect, useRef } from "react";
import { nowISO } from "../helpers/time";
import { getLocation } from "../helpers/location";


// import apiMobileJourney from "../../../services/mobileJourneyApi";
import { getAttendancePatchId, getBaseLogPatchId, getCurrentJourneyId, saveCurrentJourneyId } from "../../../utils/journeyStore";

import {
  Field,
  Label,
  Card,
  BigBtn,
  Input,
  Select,
} from "../styles/layout";

import { haversine, BASE_COORDS } from "../helpers/distance";

import Step0_IniciarJornada from "./steps/Step0_IniciarJornada";
import Step1_Tipo from "./steps/Step1_Tipo";
import Step2_OS from "./steps/Step2_OS";
import Step3_Endereco from "./steps/Step3_Endereco";
import Step4_DeslocamentoPrep from "./steps/Step4_DeslocamentoPrep";
import Step5_DeslocamentoAtivo from "./steps/Step5_DeslocamentoAtivo";
import Step6_AtendimentoAtivo from "./steps/Step6_AtendimentoAtivo";
import Step7_AtendimentoConcluido from "./steps/Step7_AtendimentoConcluido";
import Step8_AposAtendimento from "./steps/Step8_AposAtendimento";
import Step9_Interromper from "./steps/Step9_Interromper";
import apiMobileJourney from "../../../services/apiMobileJourney";
import { queueRequest } from "../../../utils/offlineQueue";
import mobileJourneyApi from "../../../services/mobileJourneyApi";
import { compressImage } from "../../../utils/compressImage";

const STORAGE_CURRENT = "wizard_current";

// 🔹 Estrutura padrão do current centralizada
const createEmptyCurrent = () => ({
  tipo: "",
  ordemTipo: "",
  ordemNumero: "",
  notaEnviada: null,
  comentario: "",
  fotos: [],
  deslocamentoInicio: null,
  gpsInicio: null,
  atendimentoInicio: null,
  finalizadoEm: null,
  gpsChegada: null,

  pausadoParaAlmoco: false,
  stepAntesAlmoco: null,

  endereco: {
    cep: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    lat: null,
    lng: null,
  },
});


// 🔹 Carrega do localStorage mesclando com default (sem fotos)
const loadCurrent = () => {
  try {
    const saved = localStorage.getItem(STORAGE_CURRENT);
    if (saved) {
      const parsed = JSON.parse(saved);
      const base = createEmptyCurrent();
      return {
        ...base,
        ...parsed,
        endereco: {
          ...base.endereco,
          ...(parsed.endereco || {}),
        },
        // fotos não são persistidas no localStorage para evitar peso
        fotos: [],
      };
    }
  } catch {
    // ignora erro e volta default
  }
  return createEmptyCurrent();
};

export default function WizardController({
  jornada,
  setJornada,
  step,
  setStep,
}) {
  const { user } = useContext(AuthContext);  // ✅ AQUI é o local correto
  const [current, setCurrent] = useState(() => loadCurrent());
  const [interromperReasonText, setInterromperReasonText] = useState("");

  // 🔹 Debounce para salvar no localStorage (sem fotos)
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      const { fotos, ...rest } = current;
      try {
        localStorage.setItem(STORAGE_CURRENT, JSON.stringify(rest));
      } catch (e) {
        console.warn("Erro ao salvar wizard_current:", e);
      }
    }, 300); // 0.3s

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [current]);

  // -------------------------
  // EVENTOS DE ALMOÇO
  // -------------------------
  useEffect(() => {
    const pauseForLunch = (e) => {
      const { stepBefore } = e.detail || {};

      setCurrent((c) => ({
        ...c,
        pausadoParaAlmoco: true,
        stepAntesAlmoco: stepBefore ?? step,
      }));

      setStep(stepBefore ?? step);
    };

    const lunchFinished = () => {
      setCurrent((c) => ({
        ...c,
        pausadoParaAlmoco: false,
        stepAntesAlmoco: null,
      }));
    };

    const gotoStep = (e) => {
      const { step: newStep } = e.detail || {};
      if (typeof newStep === "number") {
        setStep(newStep);
      }
    };

    const startNewAtendimentoEvt = (e) => {
      const { step } = e.detail || {};
      startNewAtendimento(step ?? 1);
    };

    window.addEventListener("pause-for-lunch", pauseForLunch);
    window.addEventListener("lunch-finished", lunchFinished);
    window.addEventListener("goto-step", gotoStep);
    window.addEventListener("start-new-atendimento", startNewAtendimentoEvt);

    return () => {
      window.removeEventListener("pause-for-lunch", pauseForLunch);
      window.removeEventListener("lunch-finished", lunchFinished);
      window.removeEventListener("goto-step", gotoStep);
      window.removeEventListener(
        "start-new-atendimento",
        startNewAtendimentoEvt
      );
    };
  }, [step, setStep]);

  const next = () => setStep(step + 1);
  const prev = () => setStep(step - 1);

  // 🔹 Atualização imutável sem structuredClone
  const updateCurrentField = (path, value) => {
    const keys = path.split(".");
    setCurrent((prev) => {
      const newCurrent = { ...prev };
      let ref = newCurrent;

      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        ref[k] = { ...(ref[k] || {}) };
        ref = ref[k];
      }

      ref[keys[keys.length - 1]] = value;
      return newCurrent;
    });
  };

  // -------------------------
  // AÇÕES JORNADA (GPS em background)
  // -------------------------
  // const iniciarJornada = () => {
  //   // 1) Atualiza estado e step imediatamente
  //   setJornada((p) => ({
  //     ...p,
  //     inicioExpediente: nowISO(),
  //   }));
  //   next();

  //   // 2) GPS em segundo plano
  //   getLocation().then((gps) => {
  //     if (!gps) return;
  //     setJornada((p) => ({
  //       ...p,
  //       gpsInicioExpediente: gps,
  //     }));
  //   });
  // };


  const iniciarJornada = async () => {
    try {
      const inicio = nowISO();
      const hoje = inicio.split("T")[0]; // YYYY-MM-DD

      // 1️⃣ GPS imediato (caso disponível)
      const gps = await getLocation();

      // 2️⃣ Identificar o técnico logado
      // ⚠️ Ajuste essa linha conforme sua auth real!
      // const employeeId =
      //   jornada.employee_id ||
      //   jornada.employeeId ||
      //   JSON.parse(localStorage.getItem("user"))?.id || 
      //   1; // fallback provisório
      const employeeId = user?.id;

      if (!employeeId) {
        alert("Erro: usuário não identificado.");
        return;
      }



      // 3️⃣ Chamar backend para criar a jornada
      const created = await mobileJourneyApi.startJourney({
        employeeId,
        date: hoje,
        inicioExpediente: inicio,
        gpsInicio: gps ?? null,
      });

      // 4️⃣ Guardar ID da jornada atual
      saveCurrentJourneyId(created.id);

      // 5️⃣ Atualizar estado local da jornada
      setJornada((p) => ({
        ...p,
        id: created.id,
        employee_id: employeeId,
        date: hoje,
        inicioExpediente: inicio,
        gpsInicioExpediente: gps ?? null,
      }));

      // 6️⃣ Avançar para o próximo step
      next();
    } catch (err) {
      console.error("Erro ao iniciar jornada:", err);
      alert("Falha ao iniciar a jornada. Verifique conexão.");
    }
  };

  // const iniciarDeslocamento = () => {
  //   const deslocamentoInicio = nowISO();

  //   // 1) Atualiza UI na hora
  //   setCurrent((c) => ({
  //     ...c,
  //     deslocamentoInicio,
  //   }));

  //   setJornada((p) => ({
  //     ...p,
  //     atividadeAtual: "deslocamento",
  //   }));

  //   // 2) GPS depois
  //   getLocation().then((gps) => {
  //     if (!gps) return;
  //     setCurrent((c) => ({
  //       ...c,
  //       gpsInicio: gps,
  //     }));
  //   });
  // };

  // const iniciarDeslocamento = async () => {
  //   const deslocamentoInicio = nowISO();
  //   const gps = await getLocation();

  //   // 1️⃣ Monta payload local + backend
  //   const payload = {
  //     tipo: current.tipo,
  //     nota_enviada: current.notaEnviada === "sim",
  //     ordem_tipo: current.ordemTipo,
  //     // ordem_prefixo: current.ordemPrefixo,
  //     ordem_numero: current.ordemNumero,

  //     deslocamento_inicio: deslocamentoInicio,
  //     gps_inicio: gps ?? null,
  //     cep: current.endereco.cep,
  //     rua: current.endereco.rua,
  //     numero: current.endereco.numero,
  //     bairro: current.endereco.bairro,
  //     cidade: current.endereco.cidade,
  //     estado: current.endereco.estado,
  //     lat: current.endereco.lat,
  //     lng: current.endereco.lng,
  //     comentario: current.comentario ?? "",
  //     notas: current.notas ?? "",
  //   };


  //   // 2️⃣ Atualiza UI imediatamente (offline first)
  //   setCurrent((c) => ({
  //     ...c,
  //     deslocamentoInicio,
  //     gpsInicio: gps,
  //   }));

  //   setJornada((j) => ({
  //     ...j,
  //     atividadeAtual: "deslocamento",
  //   }));

  //   // 3️⃣ Envia para backend (com fallback offline)
  //   const journeyId = jornada.id;
  //   const resp = await apiMobileJourney.createAttendance(journeyId, payload);

  //   let attendanceId;

  //   if (resp.ok) {
  //     attendanceId = resp.data.id;
  //   } else {
  //     // ID OFFLINE gerado localmente
  //     attendanceId = crypto.randomUUID();
  //   }

  //   // 4️⃣ Persistir no localStorage para rota e atendimento ativo
  //   setJornada((j) => ({
  //     ...j,
  //     atendimentoAtivoId: attendanceId,
  //   }));

  //   localStorage.setItem("obsync_attendance_active", attendanceId);

  //   // 5️⃣ Avança para próximo step
  //   next();
  // };


  // const iniciarDeslocamento = async () => {
  //   const deslocamentoInicio = nowISO();
  //   const gps = await getLocation();

  //   const payload = {
  //     tipo: current.tipo,
  //     nota_enviada: current.notaEnviada === "sim",
  //     ordem_tipo: current.ordemTipo,
  //     ordem_numero: current.ordemNumero,

  //     deslocamento_inicio: deslocamentoInicio,
  //     gps_inicio: gps ?? null,

  //     cep: current.endereco.cep,
  //     rua: current.endereco.rua,
  //     numero: current.endereco.numero,
  //     bairro: current.endereco.bairro,
  //     cidade: current.endereco.cidade,
  //     estado: current.endereco.estado,

  //     comentario: current.comentario ?? "",
  //     notas: current.notas ?? "",
  //   };

  //   // UI first (offline-first)
  //   setCurrent((c) => ({
  //     ...c,
  //     deslocamentoInicio,
  //     gpsInicio: gps,
  //   }));

  //   setJornada((j) => ({
  //     ...j,
  //     atividadeAtual: "deslocamento",
  //   }));

  //   const journeyBackendId = getCurrentJourneyId();

  //   if (!journeyBackendId) {
  //     alert("Jornada não sincronizada com o backend.");
  //     return;
  //   }

  //   const resp = await apiMobileJourney.createAttendance(
  //     journeyBackendId,
  //     payload
  //   );

  //   let attendanceId;

  //   if (resp.ok) {
  //     attendanceId = resp.data.id; // 🔥 ID REAL
  //   } else {
  //     attendanceId = crypto.randomUUID(); // offline
  //   }

  //   setJornada((j) => ({
  //     ...j,
  //     atendimentoAtivoId: attendanceId,
  //   }));

  //   localStorage.setItem("obsync_attendance_active", attendanceId);

  //   next();
  // };

  // const iniciarDeslocamento = async () => {
  //   const deslocamentoInicio = nowISO();
  //   const gps = await getLocation();

  //   // 🔹 Payload para backend (mantido)
  //   const payload = {
  //     tipo: current.tipo,
  //     nota_enviada: current.notaEnviada === "sim",
  //     ordem_tipo: current.ordemTipo,
  //     ordem_numero: current.ordemNumero,

  //     deslocamento_inicio: deslocamentoInicio,
  //     gps_inicio: gps ?? null,

  //     cep: current.endereco.cep,
  //     rua: current.endereco.rua,
  //     numero: current.endereco.numero,
  //     bairro: current.endereco.bairro,
  //     cidade: current.endereco.cidade,
  //     estado: current.endereco.estado,

  //     comentario: current.comentario ?? "",
  //     notas: current.notas ?? "",
  //   };

  //   // 🔹 UI first (offline-first)
  //   setCurrent((c) => ({
  //     ...c,
  //     deslocamentoInicio,
  //     gpsInicio: gps,
  //   }));

  //   const journeyBackendId = getCurrentJourneyId();

  //   let attendanceId;

  //   // 🔹 Tentativa de criar no backend (não bloqueante)
  //   if (journeyBackendId) {
  //     try {
  //       const resp = await apiMobileJourney.createAttendance(
  //         journeyBackendId,
  //         payload
  //       );

  //       attendanceId = resp?.ok
  //         ? resp.data.id
  //         : crypto.randomUUID();
  //     } catch {
  //       attendanceId = crypto.randomUUID();
  //     }
  //   } else {
  //     attendanceId = crypto.randomUUID();
  //   }

  //   // 🔹 Atendimento JÁ NASCE na jornada
  //   const novoAtendimento = {
  //     id: attendanceId,

  //     notaEnviada: current.notaEnviada,
  //     ordemTipo: current.ordemTipo,
  //     ordemNumero: current.ordemNumero,

  //     endereco: {
  //       cep: current.endereco.cep,
  //       rua: current.endereco.rua,
  //       numero: current.endereco.numero,
  //       bairro: current.endereco.bairro,
  //       cidade: current.endereco.cidade,
  //       estado: current.endereco.estado,
  //     },

  //     deslocamentoInicio,
  //     deslocamentoFim: null,

  //     atendimentoInicio: null,
  //     atendimentoFim: null,

  //     gpsDeslocamentoInicio: gps ?? null,
  //     gpsDeslocamentoFim: null,
  //     gpsAtendimentoInicio: null,
  //     gpsAtendimentoFim: null,

  //     status: "deslocamento",

  //     comentario: current.comentario ?? "",
  //     notas: current.notas ?? "",
  //   };

  //   // 🔹 Atualização ATÔMICA da jornada
  //   setJornada((j) => ({
  //     ...j,
  //     atividadeAtual: "deslocamento",
  //     atendimentoAtivoId: attendanceId,
  //     atendimentos: [...j.atendimentos, novoAtendimento],
  //   }));

  //   // 🔹 Persistência local do atendimento ativo
  //   localStorage.setItem(
  //     "obsync_attendance_active",
  //     attendanceId
  //   );

  //   next();
  // };


  // const iniciarDeslocamento = async () => {
  //   const deslocamentoInicio = nowISO();

  //   let gps = null;
  //   try {
  //     gps = await getLocation();
  //   } catch {
  //     console.warn("GPS indisponível ao iniciar deslocamento");
  //   }

  //   // 🔥 1️⃣ ID SEMPRE LOCAL (offline-first de verdade)
  //   const attendanceId = crypto.randomUUID();

  //   // 🔹 Atendimento nasce IMEDIATAMENTE na jornada
  //   const novoAtendimento = {
  //     id: attendanceId,
  //     backendId: null, // 🔥 nasce vazio

  //     notaEnviada: current.notaEnviada,
  //     ordemTipo: current.ordemTipo,
  //     ordemNumero: current.ordemNumero,

  //     endereco: {
  //       cep: current.endereco.cep,
  //       rua: current.endereco.rua,
  //       numero: current.endereco.numero,
  //       bairro: current.endereco.bairro,
  //       cidade: current.endereco.cidade,
  //       estado: current.endereco.estado,
  //     },

  //     deslocamentoInicio,
  //     deslocamentoFim: null,

  //     atendimentoInicio: null,
  //     atendimentoFim: null,

  //     gpsDeslocamentoInicio: gps ?? null,
  //     gpsDeslocamentoFim: null,
  //     gpsAtendimentoInicio: null,
  //     gpsAtendimentoFim: null,

  //     status: "deslocamento",

  //     comentario: current.comentario ?? "",
  //     notas: current.notas ?? "",
  //   };

  //   // 🔒 2️⃣ ESTADO LOCAL PRIMEIRO (fonte da verdade)
  //   setJornada((j) => ({
  //     ...j,
  //     atividadeAtual: "deslocamento",
  //     atendimentoAtivoId: attendanceId,
  //     atendimentos: [...j.atendimentos, novoAtendimento],
  //   }));

  //   // 🔒 3️⃣ Persistência local imediata
  //   localStorage.setItem(
  //     "obsync_attendance_active",
  //     attendanceId
  //   );

  //   // 🔹 UI
  //   setCurrent((c) => ({
  //     ...c,
  //     deslocamentoInicio,
  //     gpsInicio: gps,
  //   }));

  //   // 🔹 4️⃣ Backend em background (NUNCA bloqueante)
  //   const journeyBackendId = getCurrentJourneyId();

  //   if (journeyBackendId) {
  //     const payload = {
  //       tipo: current.tipo,
  //       nota_enviada: current.notaEnviada === "sim",
  //       ordem_tipo: current.ordemTipo,
  //       ordem_numero: current.ordemNumero,

  //       deslocamento_inicio: deslocamentoInicio,
  //       gps_inicio: gps ?? null,

  //       cep: current.endereco.cep,
  //       rua: current.endereco.rua,
  //       numero: current.endereco.numero,
  //       bairro: current.endereco.bairro,
  //       cidade: current.endereco.cidade,
  //       estado: current.endereco.estado,

  //       comentario: current.comentario ?? "",
  //       notas: current.notas ?? "",
  //       local_id: attendanceId, // 🔥 chave de reconciliação
  //     };

  //     apiMobileJourney
  //       .createAttendance(journeyBackendId, payload)
  //       .then((resp) => {
  //         if (!resp?.ok) return;

  //         const backendId = resp.data.id;

  //         // 🔥 Atualiza SOMENTE o backendId
  //         setJornada((j) => ({
  //           ...j,
  //           atendimentos: j.atendimentos.map((a) =>
  //             a.id === attendanceId
  //               ? { ...a, backendId }
  //               : a
  //           ),
  //         }));
  //       })
  //       .catch(() => {
  //         queueRequest(
  //           `/mobile-journeys/${journeyBackendId}/attendances`,
  //           "POST",
  //           { ...payload, local_id: attendanceId }
  //         );
  //       });
  //   }

  //   next();
  // };


  const iniciarDeslocamento = async () => {
  // 🔒 Hardening: não permitir dois atendimentos ativos
  if (jornada.atendimentoAtivoId) {
    console.warn("Já existe um atendimento ativo.");
    return;
  }

  const deslocamentoInicio = nowISO();

  // 🔹 GPS é best-effort
  let gps = null;
  try {
    gps = await getLocation();
  } catch {
    console.warn("GPS indisponível ao iniciar deslocamento");
  }

  // 🔥 ID SEMPRE LOCAL (offline-first)
  const attendanceId = crypto.randomUUID();

  // 🔹 Atendimento nasce IMEDIATAMENTE na jornada
  const novoAtendimento = {
    id: attendanceId,
    backendId: null, // 🔥 será preenchido quando sincronizar

    notaEnviada: current.notaEnviada,
    ordemTipo: current.ordemTipo,
    ordemNumero: current.ordemNumero,

    endereco: {
      cep: current.endereco.cep,
      rua: current.endereco.rua,
      numero: current.endereco.numero,
      bairro: current.endereco.bairro,
      cidade: current.endereco.cidade,
      estado: current.endereco.estado,
    },

    deslocamentoInicio,
    deslocamentoFim: null,

    atendimentoInicio: null,
    atendimentoFim: null,

    gpsDeslocamentoInicio: gps ?? null,
    gpsDeslocamentoFim: null,
    gpsAtendimentoInicio: null,
    gpsAtendimentoFim: null,

    status: "deslocamento",

    comentario: current.comentario ?? "",
    notas: current.notas ?? "",
  };

  // 🔒 ESTADO LOCAL PRIMEIRO (fonte da verdade)
  setJornada((j) => ({
    ...j,
    atividadeAtual: "deslocamento",
    atendimentoAtivoId: attendanceId,
    atendimentos: [...(j.atendimentos || []), novoAtendimento],
  }));

  // 🔒 Persistência local imediata
  localStorage.setItem(
    "obsync_attendance_active",
    attendanceId
  );

  // 🔹 Wizard / UI
  setCurrent((c) => ({
    ...c,
    deslocamentoInicio,
    gpsInicio: gps,
  }));

  // 🔹 Backend em background (best-effort)
  const journeyBackendId = getCurrentJourneyId();

  if (journeyBackendId) {
    const payload = {
      tipo: current.tipo,
      nota_enviada: current.notaEnviada === "sim",
      ordem_tipo: current.ordemTipo,
      ordem_numero: current.ordemNumero,

      deslocamento_inicio: deslocamentoInicio,
      gps_inicio: gps ?? null,

      cep: current.endereco.cep,
      rua: current.endereco.rua,
      numero: current.endereco.numero,
      bairro: current.endereco.bairro,
      cidade: current.endereco.cidade,
      estado: current.endereco.estado,

      comentario: current.comentario ?? "",
      notas: current.notas ?? "",

      local_id: attendanceId, // 🔥 chave de reconciliação
    };

    apiMobileJourney
      .createAttendance(journeyBackendId, payload)
      .then((resp) => {
        if (!resp?.ok) return;

        const backendId = resp.data.id;

        // 🔥 Reconciliação do ID sem alterar fluxo
        setJornada((j) => ({
          ...j,
          atendimentos: j.atendimentos.map((a) =>
            a.id === attendanceId
              ? { ...a, backendId }
              : a
          ),
        }));
      })
      .catch(() => {
        queueRequest(
          `/mobile-journeys/${journeyBackendId}/attendances`,
          "POST",
          payload
        );
      });
  }

  // 🔹 Avança fluxo
  next();
};



  //-----------------------------------------------------
  // INICIAR ATENDIMENTO
  //-----------------------------------------------------

  // const iniciarAtendimento = () => {
  //   const inicio = nowISO();

  //   setCurrent((c) => ({
  //     ...c,
  //     atendimentoInicio: inicio,
  //   }));

  //   setJornada((p) => ({
  //     ...p,
  //     atividadeAtual: "atendimento",
  //   }));

  //   getLocation().then((gps) => {
  //     if (!gps) return;
  //     setCurrent((c) => ({
  //       ...c,
  //       gpsChegada: gps,
  //     }));
  //   });
  // };

  // const concluirAtendimento = () => {
  //   const final = nowISO();

  //   setJornada((j) => ({
  //     ...j,
  //     atendimentos: [
  //       ...j.atendimentos,
  //       {
  //         id: crypto.randomUUID(),
  //         ...current,
  //         finalizadoEm: final,
  //       },
  //     ],
  //   }));

  //   setCurrent((c) => ({
  //     ...c,
  //     finalizadoEm: final,
  //   }));

  //   next();
  // };

  // const iniciarAtendimento = async () => {
  //   const inicio = nowISO();

  //   // 1️⃣ Recuperar ID do atendimento ativo criado no Step 4
  //   const attendanceId = jornada.atendimentoAtivoId || localStorage.getItem("obsync_attendance_active");




  //   if (!attendanceId) {
  //     alert("Erro: atendimento ativo não encontrado.");
  //     return;
  //   }

  //   // 2️⃣ GPS chegada
  //   let gps = null;
  //   try {
  //     gps = await getLocation();
  //   } catch (e) {
  //     console.warn("GPS indisponível ao iniciar atendimento");
  //   }

  //   // 3️⃣ Atualiza UI imediatamente
  //   setCurrent((c) => ({
  //     ...c,
  //     atendimentoInicio: inicio,
  //     gpsChegada: gps ?? null,
  //   }));

  //   setJornada((j) => ({
  //     ...j,
  //     atividadeAtual: "atendimento",
  //   }));

  //   // 4️⃣ Monta payload para API
  //   const payload = {
  //     atendimento_inicio: inicio,
  //     gps_chegada: gps ?? null,
  //   };

  //   // 5️⃣ Envia ao backend ou salva offline
  //   try {
  //     await apiMobileJourney.startService(attendanceId, payload);
  //   } catch (err) {
  //     // offline → salvar na fila
  //     queueRequest(
  //       `/mobile-attendances/${attendanceId}/start-service`,
  //       "PATCH",
  //       payload
  //     );
  //   }


  //   // 6️⃣ Avança step
  //   next();
  // };


  //   const iniciarAtendimento = async () => {
  //   const inicio = nowISO();

  //   // 1️⃣ Recuperar ID do atendimento ativo
  //   const attendanceId =
  //     jornada.atendimentoAtivoId ||
  //     localStorage.getItem("obsync_attendance_active");

  //   if (!attendanceId) {
  //     alert("Erro: atendimento ativo não encontrado.");
  //     return;
  //   }

  //   // 2️⃣ GPS de chegada
  //   let gps = null;
  //   try {
  //     gps = await getLocation();
  //   } catch {
  //     console.warn("GPS indisponível ao iniciar atendimento");
  //   }

  //   // 3️⃣ Atualiza CURRENT (wizard)
  //   setCurrent((c) => ({
  //     ...c,
  //     atendimentoInicio: inicio,
  //     gpsChegada: gps ?? null,
  //   }));

  //   // ✅ 4️⃣ ATUALIZA A JORNADA (ESSENCIAL PARA O RDO)
  //   setJornada((j) => ({
  //     ...j,
  //     atividadeAtual: "atendimento",
  //     atendimentos: (j.atendimentos || []).map((a) =>
  //       a.id === attendanceId
  //         ? {
  //             ...a,
  //             atendimentoInicio: inicio,
  //             gpsChegada: gps ?? null,
  //           }
  //         : a
  //     ),
  //   }));

  //   // 5️⃣ Payload backend
  //   const payload = {
  //     atendimento_inicio: inicio,
  //     gps_chegada: gps ?? null,
  //   };

  //   // 6️⃣ Backend (online / offline)
  //   try {
  //     await apiMobileJourney.startService(attendanceId, payload);
  //   } catch {
  //     queueRequest(
  //       `/mobile-attendances/${attendanceId}/start-service`,
  //       "PATCH",
  //       payload
  //     );
  //   }

  //   // 7️⃣ Avança wizard
  //   next();
  // };


  // const iniciarAtendimento = async () => {
  //   const inicio = nowISO();

  //   const attendanceId =
  //     jornada.atendimentoAtivoId ||
  //     localStorage.getItem("obsync_attendance_active");

  //   if (!attendanceId) {
  //     alert("Erro: atendimento ativo não encontrado.");
  //     return;
  //   }

  //   let gps = null;
  //   try {
  //     gps = await getLocation();
  //   } catch {
  //     console.warn("GPS indisponível ao iniciar atendimento");
  //   }

  //   // Wizard (UI)
  //   setCurrent((c) => ({
  //     ...c,
  //     atendimentoInicio: inicio,
  //   }));

  //   // 🔒 Verdade do RDO
  //   setJornada((j) => ({
  //     ...j,
  //     atividadeAtual: "atendimento",
  //     atendimentos: j.atendimentos.map((a) =>
  //       a.id === attendanceId
  //         ? {
  //           ...a,
  //           deslocamentoFim: inicio,
  //           gpsDeslocamentoFim: gps ?? null,
  //           atendimentoInicio: inicio,
  //           gpsAtendimentoInicio: gps ?? null,
  //           status: "em_atendimento",
  //         }
  //         : a
  //     ),
  //   }));

  //   const payload = {
  //     atendimento_inicio: inicio,
  //     gps_chegada: gps ?? null,
  //   };

  //   try {
  //     await apiMobileJourney.startService(attendanceId, payload);
  //   } catch {
  //     queueRequest(
  //       `/mobile-attendances/${attendanceId}/start-service`,
  //       "PATCH",
  //       payload
  //     );
  //   }

  //   next();
  // };

const iniciarAtendimento = async () => {
  const inicio = nowISO();

  // 🔹 Recupera atendimento ativo (estado ou persistência)
  const attendanceId =
    jornada.atendimentoAtivoId ||
    localStorage.getItem("obsync_attendance_active");

  if (!attendanceId) {
    alert("Erro: atendimento ativo não encontrado.");
    return;
  }

  // 🔹 GPS é best-effort (nunca bloqueia fluxo)
  let gps = null;
  try {
    gps = await getLocation();
  } catch {
    console.warn("GPS indisponível ao iniciar atendimento");
  }

  // 🔹 Atualiza Wizard / UI
  setCurrent((c) => ({
    ...c,
    atendimentoInicio: inicio,
  }));

  // 🔒 VERDADE DO RDO — transição de estado local
  setJornada((j) => ({
    ...j,
    atividadeAtual: "atendimento",
    atendimentos: j.atendimentos.map((a) =>
      a.id === attendanceId
        ? {
            ...a,

            // fecha deslocamento
            deslocamentoFim: inicio,
            gpsDeslocamentoFim: gps ?? null,

            // abre atendimento
            atendimentoInicio: inicio,
            gpsAtendimentoInicio: gps ?? null,

            status: "em_atendimento",
          }
        : a
    ),
  }));

  // 🔹 Backend = side-effect (usa backendId se existir)
  const patchId = getAttendancePatchId(jornada, attendanceId);

  if (patchId) {
    const payload = {
      atendimento_inicio: inicio,
      gps_chegada: gps ?? null,
    };

    apiMobileJourney
      .startService(patchId, payload)
      .catch(() => {
        queueRequest(
          `/mobile-attendances/${patchId}/start-service`,
          "PATCH",
          payload
        );
      });
  }

  // 🔹 Avança fluxo do wizard
  next();
};


  //   const iniciarAtendimento = async () => {
  //   const attendanceId =
  //     jornada.atendimentoAtivoId ||
  //     localStorage.getItem("obsync_attendance_active");

  //   const inicio = nowISO();
  //   const gps = await getLocation();

  //   setCurrent((c) => ({
  //     ...c,
  //     atendimentoInicio: inicio,
  //     gpsChegada: gps,
  //   }));

  //   setJornada((j) => ({
  //     ...j,
  //     atividadeAtual: "atendimento",
  //   }));

  //   await apiMobileJourney.startService(attendanceId, {
  //     atendimento_inicio: inicio,
  //     gps_chegada: gps,
  //   });

  //   next(); // vai para Step 6
  // };


  //-----------------------------------------------------
  // ATUALIZAR ATENDIMENTO
  //-----------------------------------------------------

  const atualizarAtendimento = async (fields) => {
    const attendanceId =
      jornada.atendimentoAtivoId ||
      localStorage.getItem("obsync_attendance_active");

    if (!attendanceId) return;

    // Atualiza local
    setCurrent((c) => ({ ...c, ...fields }));

    const payload = { ...fields };

    try {
      await apiMobileJourney.updateAttendance(attendanceId, payload);
    } catch (err) {
      queueRequest(
        `/mobile-attendances/${attendanceId}`,
        "PATCH",
        payload
      );
    }
  };

  //-----------------------------------------------------
  // FINALIZAR ATENDIMENTO
  //-----------------------------------------------------
  // const finalizarAtendimento = async () => {
  //   const final = nowISO();

  //   const attendanceId =
  //     jornada.atendimentoAtivoId ||
  //     localStorage.getItem("obsync_attendance_active");

  //   if (!attendanceId) {
  //     alert("Erro: atendimento não encontrado.");
  //     return;
  //   }

  //   // Atualiza local
  //   setCurrent((c) => ({ ...c, finalizadoEm: final }));

  //   const payload = { finalizadoEm: final };

  //   try {
  //     await apiMobileJourney.finishService(attendanceId, payload);
  //   } catch (err) {
  //     queueRequest(
  //       `/mobile-attendances/${attendanceId}/finish`,
  //       "PATCH",
  //       payload
  //     );
  //   }

  //   // Avança para Step 7 (resumo)
  //   next();
  // };


  // const finalizarAtendimento = async () => {
  //   const attendanceId =
  //     jornada.atendimentoAtivoId ||
  //     localStorage.getItem("obsync_attendance_active");

  //   const final = nowISO();

  //   setCurrent((c) => ({
  //     ...c,
  //     finalizadoEm: final,
  //   }));

  //   await apiMobileJourney.finishService(attendanceId, {
  //     finalizado_em: final,
  //     comentario: current.comentario ?? null,
  //     notas: current.notas ?? null,
  //   });

  //   next(); // Step 7
  // };


  // const finalizarAtendimento = async () => {
  //   const attendanceId =
  //     jornada.atendimentoAtivoId ||
  //     localStorage.getItem("obsync_attendance_active");

  //   if (!attendanceId) {
  //     alert("Atendimento não encontrado.");
  //     return;
  //   }

  //   const payload = {
  //     finalizado_em: nowISO(),
  //     comentario: current.comentario || null,
  //     fotos: current.fotos || [],
  //   };

  //   try {
  //     await apiMobileJourney.finishService(attendanceId, payload);
  //   } catch (err) {
  //     queueRequest(
  //       `/mobile-attendances/${attendanceId}/finish`,
  //       "PATCH",
  //       payload
  //     );
  //   }

  //   setCurrent((c) => ({
  //     ...c,
  //     finalizadoEm: payload.finalizado_em,
  //   }));

  //   next(); // Step 7
  // };


  // const finalizarAtendimento = async () => {
  //   const attendanceId =
  //     jornada.atendimentoAtivoId ||
  //     localStorage.getItem("obsync_attendance_active");

  //   if (!attendanceId) {
  //     alert("Atendimento não encontrado.");
  //     return;
  //   }

  //   const fim = nowISO();

  //   let gps = null;
  //   try {
  //     gps = await getLocation();
  //   } catch {
  //     console.warn("GPS indisponível ao finalizar atendimento");
  //   }

  //   const payload = {
  //     finalizado_em: fim,
  //     comentario: current.comentario || null,
  //     fotos: current.fotos || [],
  //     gps_fim: gps ?? null,
  //   };

  //   // 🔒 ATUALIZA A JORNADA (VERDADE DO RDO)
  //   setJornada((j) => ({
  //     ...j,
  //     atividadeAtual: "livre",
  //     atendimentoAtivoId: null,
  //     atendimentos: j.atendimentos.map((a) =>
  //       a.id === attendanceId
  //         ? {
  //           ...a,
  //           atendimentoFim: fim,
  //           gpsAtendimentoFim: gps ?? null,
  //           status: "finalizado",
  //           comentario: payload.comentario,
  //           fotos: payload.fotos,
  //         }
  //         : a
  //     ),
  //   }));

  //   // 🔒 Limpa persistência local
  //   localStorage.removeItem("obsync_attendance_active");

  //   // Wizard (UI)
  //   setCurrent((c) => ({
  //     ...c,
  //     finalizadoEm: fim,
  //   }));

  //   // Backend (best effort)
  //   try {
  //     await apiMobileJourney.finishService(attendanceId, payload);
  //   } catch {
  //     queueRequest(
  //       `/mobile-attendances/${attendanceId}/finish`,
  //       "PATCH",
  //       payload
  //     );
  //   }

  //   next(); // Step 7
  // };


  const finalizarAtendimento = async () => {
  // 🔹 Recupera atendimento ativo (estado ou persistência)
  const attendanceId =
    jornada.atendimentoAtivoId ||
    localStorage.getItem("obsync_attendance_active");

  if (!attendanceId) {
    alert("Atendimento não encontrado.");
    return;
  }

  const fim = nowISO();

  // 🔹 GPS é best-effort
  let gps = null;
  try {
    gps = await getLocation();
  } catch {
    console.warn("GPS indisponível ao finalizar atendimento");
  }

  // 🔹 Wizard / UI
  setCurrent((c) => ({
    ...c,
    finalizadoEm: fim,
  }));

  // 🔒 VERDADE DO RDO — consolidação do atendimento
  setJornada((j) => ({
    ...j,
    atividadeAtual: "livre",
    atendimentoAtivoId: null,
    atendimentos: j.atendimentos.map((a) =>
      a.id === attendanceId
        ? {
            ...a,
            atendimentoFim: fim,
            gpsAtendimentoFim: gps ?? null,
            status: "finalizado",
            comentario: current.comentario ?? null,
            fotos: current.fotos ?? [],
          }
        : a
    ),
  }));

  // 🔒 Limpa persistência local do atendimento ativo
  localStorage.removeItem("obsync_attendance_active");

  // 🔹 Backend = side-effect (usa backendId se existir)
  const patchId = getAttendancePatchId(jornada, attendanceId);

  if (patchId) {
    const payload = {
      finalizado_em: fim,
      comentario: current.comentario ?? null,
      fotos: current.fotos ?? [],
      gps_fim: gps ?? null,
    };

    apiMobileJourney
      .finishService(patchId, payload)
      .catch(() => {
        queueRequest(
          `/mobile-attendances/${patchId}/finish`,
          "PATCH",
          payload
        );
      });
  }

  // 🔹 Avança fluxo do wizard
  next();
};



  // Converte File → Base64
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });


  const addFotos = async (files) => {
    const convertidos = [];

    for (const file of files) {
      const compressed = await compressImage(file);
      const base64 = await fileToBase64(compressed);
      convertidos.push(base64);
    }

    updateCurrentField("fotos", [
      ...(current.fotos || []),
      ...convertidos,
    ]);
  };

  //------------------------------------------------
  //RETORNAR A BASE
  //-------------------------------------------------

  // const onIniciarRetornoBase = () => {
  //   const time = nowISO();

  //   // 1) Marca retorno base rápido
  //   setJornada((j) => ({
  //     ...j,
  //     atividadeAtual: "retornoBase",
  //     baseLogs: [
  //       ...(j.baseLogs || []),
  //       {
  //         id: crypto.randomUUID(),
  //         tipo: "deslocamentoParaBase",
  //         time,
  //         gps: null,
  //         finalizado: false,
  //       },
  //     ],
  //   }));

  //   // 2) GPS em background
  //   getLocation().then((gps) => {
  //     if (!gps) return;
  //     setJornada((j) => {
  //       const logs = [...(j.baseLogs || [])];
  //       const idx = logs.findIndex(
  //         (l) =>
  //           l.tipo === "deslocamentoParaBase" &&
  //           l.time === time &&
  //           !l.finalizado
  //       );
  //       if (idx !== -1) {
  //         logs[idx] = { ...logs[idx], gps };
  //       }
  //       return { ...j, baseLogs: logs };
  //     });
  //   });
  // };

  // const onIniciarRetornoBase = async () => {
  //   // if (jornada.atividadeAtual !== "livre") return;

  //   const time = nowISO();
  //   const gps = await getLocation();

  //   // 1) Marca retorno base rápido localmente
  //   setJornada((p) => ({
  //     ...p,
  //     atividadeAtual: "retornoBase",
  //     baseLogs: [
  //       ...p.baseLogs,
  //       {
  //         id: crypto.randomUUID(),
  //         tipo: "deslocamentoParaBase",
  //         time,
  //         gps,
  //         finalizado: false,
  //          },
  //     ],
  //   }));


  //   await mobileJourneyApi.addBaseLog(jornada.id, {
  //     tipo: "deslocamentoParaBase",
  //     time,
  //     lat: gps?.lat ?? null,
  //     lng: gps?.lng ?? null,
  //   });
  // };


  // const onIniciarRetornoBase = async () => {
  //   const time = nowISO();
  //   const gps = await getLocation();

  //   // 1️⃣ Atualiza UI local (offline-first)
  //   setJornada((p) => ({
  //     ...p,
  //     atividadeAtual: "retornoBase",
  //     baseLogs: [
  //       ...(p.baseLogs || []),
  //       {
  //         id: crypto.randomUUID(),
  //         tipo: "deslocamentoParaBase",
  //         time,
  //         gps,
  //         finalizado: false,
  //       },
  //     ],
  //   }));

  //   // 2️⃣ Backend ID REAL
  //   const journeyBackendId = getCurrentJourneyId();

  //   if (!journeyBackendId) {
  //     console.warn("Jornada ainda não sincronizada com backend");
  //     return;
  //   }

  //   // 3️⃣ Envia para backend (com fallback offline já tratado na API)
  //   await mobileJourneyApi.addBaseLog(journeyBackendId, {
  //     tipo: "deslocamentoParaBase",
  //     time,
  //     lat: gps?.lat ?? null,
  //     lng: gps?.lng ?? null,
  //   });
  // };


  const onIniciarRetornoBase = async () => {
  const time = nowISO();

  let gps = null;
  try {
    gps = await getLocation();
  } catch {
    console.warn("GPS indisponível ao iniciar retorno para base");
  }

  const baseLogLocalId = crypto.randomUUID();

  // 🔒 ESTADO LOCAL PRIMEIRO
  setJornada((j) => ({
    ...j,
    atividadeAtual: "retornoBase",
    baseLogs: [
      ...(j.baseLogs || []),
      {
        id: baseLogLocalId,
        backendId: null,
        tipo: "deslocamentoParaBase",
        time,
        gps,
        finalizado: false,
      },
    ],
  }));

  // 🔹 Backend = side-effect
  const patchId = getBaseLogPatchId(jornada, baseLogLocalId);

  if (patchId) {
    const payload = {
      tipo: "deslocamentoParaBase",
      time,
      lat: gps?.lat ?? null,
      lng: gps?.lng ?? null,
      local_id: baseLogLocalId,
    };

    mobileJourneyApi
      .addBaseLog(patchId, payload)
      .catch(() => {
        queueRequest(
          `/mobile-base-logs/${patchId}`,
          "POST",
          payload
        );
      });
  }
};

  //------------------------------------
  //MARCAR CHEGADA A BASE
  //--------------------------------------

  // const marcarChegadaBase = () => {
  //   // Troca step imediato
  //   setStep(1);

  //   // GPS em background
  //   getLocation().then((gps) => {
  //     setJornada((p) => {
  //       const logs = [...(p.baseLogs || [])];
  //       const idx = logs.findIndex(
  //         (l) => l.tipo === "deslocamentoParaBase" && !l.finalizado
  //       );

  //       if (idx !== -1) logs[idx].finalizado = true;

  //       logs.push({
  //         id: crypto.randomUUID(),
  //         tipo: "chegadaBase",
  //         time: nowISO(),
  //         gps,
  //       });

  //       return {
  //         ...p,
  //         baseLogs: logs,
  //         atividadeAtual: "livre",
  //         atividadeAnterior: null,
  //       };
  //     });

  //     window.dispatchEvent(
  //       new CustomEvent("start-new-atendimento")
  //     );
  //   });
  // };

  //   const marcarChegadaBase = () => {
  //   const time = nowISO();

  //   // 1) Marcar a chegada à base localmente
  //   setJornada((j) => {
  //     const logs = [...(j.baseLogs || [])];
  //     const idx = logs.findIndex(
  //       (l) => l.tipo === "deslocamentoParaBase" && !l.finalizado
  //     );
  //     if (idx !== -1) {
  //       logs[idx].finalizado = true;
  //     }

  //     logs.push({
  //       id: crypto.randomUUID(),
  //       tipo: "chegadaBase",
  //       time,
  //       gps: null, // GPS após chegada
  //     });

  //     return {
  //       ...j,
  //       baseLogs: logs,
  //       atividadeAtual: "livre",
  //     };
  //   });

  //   // 2) Enviar a chegada ao backend
  //   mobileJourneyApi.addBaseLog(jornada.id, {
  //     tipo: "chegadaBase",
  //     time,
  //     gps: null,
  //   });

  //   // 3) Atualiza GPS após chegada
  //   getLocation().then((gps) => {
  //     if (!gps) return;
  //     setJornada((j) => {
  //       const logs = [...(j.baseLogs || [])];
  //       const idx = logs.findIndex(
  //         (l) => l.tipo === "chegadaBase" && !l.finalizado
  //       );
  //       if (idx !== -1) {
  //         logs[idx] = { ...logs[idx], gps };
  //       }
  //       return { ...j, baseLogs: logs };
  //     });

  //     // 4) Enviar GPS ao backend
  //     mobileJourneyApi.addBaseLog(jornada.id, {
  //       tipo: "chegadaBase",
  //       time,
  //       gps,
  //     });
  //   });
  // };

  // const marcarChegadaBase = async () => {
  //   // console.log("aqui")
  //     // if (jornada.atividadeAtual !== "livre") return;

  //   const time = nowISO();
  //   const gps = await getLocation();

  //   setJornada((j) => ({
  //     ...j,
  //     atividadeAtual: "livre",
  //     baseLogs: [
  //       ...(j.baseLogs || []),
  //       {
  //         id: crypto.randomUUID(),
  //         tipo: "chegadaBase",
  //         time,
  //         gps,
  //       },
  //     ],
  //   }));

  //   await mobileJourneyApi.addBaseLog(jornada.id, {
  //     tipo: "chegadaBase",
  //     time,
  //     lat: gps?.lat ?? null,
  //     lng: gps?.lng ?? null,
  //   });

  //   window.dispatchEvent(new CustomEvent("start-new-atendimento"));
  // };

  // const marcarChegadaBase = async () => {
  //   const journeyBackendId = getCurrentJourneyId(); // 🔥 ID REAL DO BACKEND

  //   if (!journeyBackendId) {
  //     console.warn("Jornada ainda não sincronizada");
  //     return;
  //   }

  //   const time = nowISO();
  //   const gps = await getLocation();

  //   setJornada((j) => ({
  //     ...j,
  //     atividadeAtual: "livre",
  //     baseLogs: [
  //       ...(j.baseLogs || []),
  //       {
  //         id: crypto.randomUUID(),
  //         tipo: "chegadaBase",
  //         time,
  //         gps,
  //       },
  //     ],
  //   }));

  //   await mobileJourneyApi.addBaseLog(journeyBackendId, {
  //     tipo: "chegadaBase",
  //     time,
  //     lat: gps?.lat ?? null,
  //     lng: gps?.lng ?? null,
  //   });

  //   window.dispatchEvent(new CustomEvent("start-new-atendimento"));
  // };

  const distanciaAteBase = () => {
    if (!current.gpsInicio) return null;
    return (
      (haversine(current.gpsInicio, BASE_COORDS) / 1000).toFixed(2) +
      " km"
    );
  };

  const startNewAtendimento = (goToStep = 1) => {
    setCurrent(createEmptyCurrent());
    setStep(goToStep);
  };

  const marcarChegadaBase = async () => {
  const time = nowISO();

  let gps = null;
  try {
    gps = await getLocation();
  } catch {
    console.warn("GPS indisponível ao marcar chegada à base");
  }

  const baseLogLocalId = crypto.randomUUID();

  // 🔒 ESTADO LOCAL PRIMEIRO
  setJornada((j) => ({
    ...j,
    atividadeAtual: "livre",
    baseLogs: [
      ...(j.baseLogs || []),
      {
        id: baseLogLocalId,
        backendId: null,
        tipo: "chegadaBase",
        time,
        gps,
      },
    ],
  }));

  // 🔹 Backend = side-effect
  const patchId = getBaseLogPatchId(jornada, baseLogLocalId);

  if (patchId) {
    const payload = {
      tipo: "chegadaBase",
      time,
      lat: gps?.lat ?? null,
      lng: gps?.lng ?? null,
      local_id: baseLogLocalId,
    };

    mobileJourneyApi
      .addBaseLog(patchId, payload)
      .catch(() => {
        queueRequest(
          `/mobile-base-logs/${patchId}`,
          "POST",
          payload
        );
      });
  }

  window.dispatchEvent(
    new CustomEvent("start-new-atendimento")
  );
};

  //-------------------------------------------------------------
  // INTERROMPER DESLOCAMENTO PARA BASE
  //-------------------------------------------------------------

  // const confirmarInterromperRetorno = async (motivo) => {
  //   // if (jornada.atividadeAtual !== "retornoBase") return;

  //   // if (!interromperReasonText?.trim()) {
  //   //   alert("Informe o motivo da interrupção.");
  //   //   return;
  //   // }
  //   console.log("CONFIRMARINTERROMPERRETORNO_MOTIVO", motivo)
  //   const time = nowISO();
  //   const gps = await getLocation();

  //   // 1️⃣ Atualiza estado local
  //   setJornada((j) => ({
  //     ...j,
  //     atividadeAtual: "livre",
  //     baseLogs: [
  //       ...(j.baseLogs || []),
  //       {
  //         id: crypto.randomUUID(),
  //         tipo: "retornoInterrompido",
  //         time,
  //         gps,
  //       },
  //     ],
  //   }));

  //   // 2️⃣ Persistir no backend
  //   await mobileJourneyApi.addBaseLog(jornada.id, {
  //     tipo: "retornoInterrompido",
  //     time,
  //     lat: gps?.lat ?? null,
  //     lng: gps?.lng ?? null,
  //     motivo,
  //   });

  //   // 3️⃣ Reset e liberação
  //   // setInterromperReasonText("");
  //   window.dispatchEvent(new CustomEvent("start-new-atendimento"));
  // };


  const confirmarInterromperRetorno = async (motivo) => {
  const time = nowISO();

  let gps = null;
  try {
    gps = await getLocation();
  } catch {
    console.warn("GPS indisponível ao interromper retorno para base");
  }

  const baseLogLocalId = crypto.randomUUID();

  // 🔒 1️⃣ ESTADO LOCAL PRIMEIRO
  setJornada((j) => ({
    ...j,
    atividadeAtual: "livre",
    baseLogs: [
      ...(j.baseLogs || []),
      {
        id: baseLogLocalId,
        backendId: null,
        tipo: "retornoInterrompido",
        time,
        gps,
        motivo,
      },
    ],
  }));

  // 🔹 2️⃣ Backend = side-effect
  const patchId = getBaseLogPatchId(jornada, baseLogLocalId);

  if (patchId) {
    const payload = {
      tipo: "retornoInterrompido",
      time,
      lat: gps?.lat ?? null,
      lng: gps?.lng ?? null,
      motivo,
      local_id: baseLogLocalId,
    };

    mobileJourneyApi
      .addBaseLog(patchId, payload)
      .catch(() => {
        queueRequest(
          `/mobile-base-logs/${patchId}`,
          "POST",
          payload
        );
      });
  }

  // 🔹 3️⃣ Libera novo atendimento
  window.dispatchEvent(
    new CustomEvent("start-new-atendimento")
  );
};

  // const confirmarInterromperRetorno = () => {
  //   setInterromperReasonText("");
  //   startNewAtendimento();
  // };

  const buscarCep = async (cep) => {
    cep = cep.replace(/\D/g, "");
    if (cep.length !== 8) return;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      console.log(data, cep);

      if (!data.erro) {
        updateCurrentField("endereco.rua", data.logradouro || "");
        updateCurrentField("endereco.bairro", data.bairro || "");
        updateCurrentField("endereco.cidade", data.localidade || "");
        updateCurrentField("endereco.estado", data.uf || "");
      }
    } catch (err) {
      console.log("Erro no CEP", err);
    }
  };

  const fmt = (iso) =>
    iso ? new Date(iso).toLocaleString("pt-BR") : "—";

  // -------------------------
  // RENDERIZAÇÃO DOS STEPS
  // -------------------------
  return (
    <>
      <div style={{ padding: "4px 2px 8px 2px" }}>
        <div style={{ color: "#facc15", fontSize: 12, fontWeight: 600 }}>
          Novo Atendimento — Mobile (Híbrido)
        </div>
        <div style={{ color: "#9fb4c9", fontSize: 12 }}>
          Step {step}/9
        </div>
      </div>

      {step === 0 && (
        <Step0_IniciarJornada
          {...{ Field, Label, Card, BigBtn, iniciarJornada }}
        />
      )}

      {step === 1 && (
        <Step1_Tipo
          {...{
            Field,
            Label,
            Card,
            BigBtn,
            current,
            updateCurrentField,
            next,
          }}
        />
      )}

      {step === 2 && (
        <Step2_OS
          {...{
            Field,
            Label,
            Card,
            BigBtn,
            Input,
            Select,
            current,
            updateCurrentField,
            next,
            prev,
          }}
        />
      )}

      {step === 3 && (
        <Step3_Endereco
          {...{
            Field,
            Label,
            Card,
            BigBtn,
            Input,
            current,
            updateCurrentField,
            buscarCep,
            next,
            prev,
          }}
        />
      )}

      {step === 4 && (
        <Step4_DeslocamentoPrep
          {...{
            Field,
            Label,
            Card,
            BigBtn,
            current,
            iniciarDeslocamento,
            updateCurrentField,
            next,
            prev,
          }}
        />
      )}

      {step === 5 && (
        <Step5_DeslocamentoAtivo
          {...{
            Field,
            Label,
            Card,
            BigBtn,
            current,
            fmt,
            distanciaAteBase,
            iniciarAtendimento,
            next,
          }}
        />
      )}

      {step === 6 && (
        <Step6_AtendimentoAtivo
          {...{
            Field,
            Label,
            Card,
            BigBtn,
            current,
            updateCurrentField,
            finalizarAtendimento,
            atualizarAtendimento,
            next,
            prev,
            addFotos,
          }}
        />
      )}

      {step === 7 && (
        <Step7_AtendimentoConcluido
          {...{
            Field,
            Label,
            Card,
            BigBtn,
            current,
            fmt,
            startNewAtendimento,
            next,
            prev,
            onIniciarRetornoBase,
          }}
        />
      )}

      {step === 8 && (
        <Step8_AposAtendimento
          {...{
            Field,
            Label,
            Card,
            BigBtn,
            jornada,
            fmt,
            marcarChegadaBase,
            distanciaAteBase,
            abrirInterromperRetorno: () => setStep(9),
            next,
            startNewAtendimento,
          }}
        />
      )}

      {step === 9 && (
        <Step9_Interromper
          {...{
            Field,
            Label,
            Card,
            BigBtn,
            interromperReasonText,
            setInterromperReasonText,
            confirmarInterromperRetorno,
            updateCurrentField,
            setStep,
          }}
        />
      )}
    </>
  );
}
