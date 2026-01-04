import { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
// WizardController.jsx
import React, { useState, useEffect, useRef } from "react";
import { nowISO } from "../helpers/time";
import { getLocation } from "../helpers/location";


// import apiMobileJourney from "../../../services/mobileJourneyApi";
import { getAttendancePatchId, getBaseLogPatchId, getCurrentJourneyId, saveCurrentJourneyId, saveDraftJornada } from "../../../utils/journeyStore";

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
import { acquireActionLock, releaseActionLock } from "../../../utils/actionLock";
import { generateUUID } from "../helpers/uuid";

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
    rota: {
    polyline: null,
    distancia: null,
    duracao: null,
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

  const [loadingJornada, setLoadingJornada] = useState(false);
const [loadingAtendimento, setLoadingAtendimento] = useState(false);

console.log("UUID TEST:", generateUUID());

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
  const iniciarJornada = async () => {

      if (loadingJornada) return;

  const lockKey = "iniciar_jornada";
  if (!acquireActionLock(lockKey)) {
    console.warn("🚫 Jornada já iniciada");
    return;
  }

  // 🚨 REGRA DE NEGÓCIO (NUNCA USE LOCK AQUI)
  const existingJourneyId = getCurrentJourneyId();
  if (existingJourneyId) {
    console.warn("🚫 Já existe jornada ativa");
    releaseActionLock(lockKey);
    return;
  }

  setLoadingJornada(true);

  
  try {
    const inicio = nowISO();
    const hoje = inicio.split("T")[0];

    let gps = null;
    try {
      gps = getLocation({ highAccuracy: true });
    } catch {}

    const employeeId = user?.id;
    if (!employeeId) {
      alert("Erro: usuário não identificado.");
      return;
    }

    // 🔹 1️⃣ Backend
    const created = await mobileJourneyApi.startJourney({
      employeeId,
      date: hoje,
      inicioExpediente: inicio,
      gpsInicio: gps ?? null,
    });
    

    // 🔹 2️⃣ Salva ID do backend
    saveCurrentJourneyId(created.id);

    // 🔥 3️⃣ CRIA DRAFT (FONTE DA VERDADE)
    saveDraftJornada({
      id: created.id,
      employee_id: employeeId,
      date: hoje,
      inicioExpediente: inicio,
      gpsInicioExpediente: gps ?? null,

      atendimentos: [],
      almocos: [],
      baseLogs: [],

      atividadeAtual: "livre",
      atividadeAnterior: null,
      activeLunchId: null,
    });

    // 🔹 4️⃣ Atualiza estado React
    setJornada((p) => ({
      ...p,
      id: created.id,
      employee_id: employeeId,
      date: hoje,
      inicioExpediente: inicio,
      gpsInicioExpediente: gps ?? null,
    }));

    next();
  } catch (err) {
    console.error("Erro ao iniciar jornada:", err);
        releaseActionLock(lockKey); // 🔓 só libera em erro

    alert("Falha ao iniciar a jornada. Verifique conexão.");
  }
    finally {
    setLoadingJornada(false);
    releaseActionLock(lockKey); // 🔓 SEMPRE LIBERA
  }
};


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
    gps = getLocation({ highAccuracy: true });
  } catch {
    console.warn("GPS indisponível ao iniciar deslocamento");
  }

  // 🔥 ID SEMPRE LOCAL (offline-first)
  const attendanceId = generateUUID();

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
    gps = getLocation({ highAccuracy: true });
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
    gps = getLocation({ highAccuracy: true });
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


  const onIniciarRetornoBase = async () => {
  const time = nowISO();

  let gps = null;
  try {
    gps = getLocation({ highAccuracy: true });
  } catch {
    console.warn("GPS indisponível ao iniciar retorno para base");
  }

  const baseLogLocalId = generateUUID();

  // 🔒 1️⃣ ESTADO LOCAL PRIMEIRO
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
        sync_status: "pending",
      },
    ],
  }));

  // 🔥 2️⃣ BACKEND = SIDE-EFFECT (CRIAÇÃO)
  const journeyBackendId = getCurrentJourneyId();
  if (!journeyBackendId) return;

  const payload = {
    tipo: "deslocamentoParaBase",
    time,
    lat: gps?.lat ?? null,
    lng: gps?.lng ?? null,
    local_id: baseLogLocalId, // 🔑 chave de reconciliação
  };

  mobileJourneyApi
    .addBaseLog(journeyBackendId, payload)
    .then((resp) => {
      const backendId = resp?.id;
      if (!backendId) return;

      // 🔥 reconcilia backendId
      setJornada((j) => ({
        ...j,
        baseLogs: j.baseLogs.map((b) =>
          b.id === baseLogLocalId
            ? { ...b, backendId, sync_status: "synced" }
            : b
        ),
      }));
    })
    .catch(() => {
      // 🔥 offline → fila
      queueRequest(
        `/mobile-journeys/${journeyBackendId}/base-logs`,
        "POST",
        payload
      );
    });
};


  //------------------------------------
  //MARCAR CHEGADA A BASE
  //--------------------------------------

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
    gps = getLocation({ highAccuracy: true });
  } catch {
    console.warn("GPS indisponível ao marcar chegada à base");
  }

  const baseLogLocalId = generateUUID();

  // 🔒 1️⃣ ESTADO LOCAL PRIMEIRO
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
        sync_status: "pending",
      },
    ],
  }));

  // 🔥 2️⃣ BACKEND = SIDE-EFFECT (CRIAÇÃO)
  const journeyBackendId = getCurrentJourneyId();
  if (!journeyBackendId) return;

  const payload = {
    tipo: "chegadaBase",
    time,
    lat: gps?.lat ?? null,
    lng: gps?.lng ?? null,
    local_id: baseLogLocalId, // 🔑 reconciliação
  };

  mobileJourneyApi
    .addBaseLog(journeyBackendId, payload)
    .then((resp) => {
      const backendId = resp?.id;
      if (!backendId) return;

      // 🔥 reconcilia backendId
      setJornada((j) => ({
        ...j,
        baseLogs: j.baseLogs.map((b) =>
          b.id === baseLogLocalId
            ? { ...b, backendId, sync_status: "synced" }
            : b
        ),
      }));
    })
    .catch(() => {
      // 🔥 offline → fila
      queueRequest(
        `/mobile-journeys/${journeyBackendId}/base-logs`,
        "POST",
        payload
      );
    });

  window.dispatchEvent(
    new CustomEvent("start-new-atendimento")
  );
};
  //-------------------------------------------------------------
  // INTERROMPER DESLOCAMENTO PARA BASE
  //-------------------------------------------------------------


const confirmarInterromperRetorno = async (motivo) => {
  const time = nowISO();

  let gps = null;
  try {
    gps = getLocation({ highAccuracy: true });
  } catch {
    console.warn("GPS indisponível ao interromper retorno para base");
  }

  const baseLogLocalId = generateUUID();

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
        sync_status: "pending",
      },
    ],
  }));

  // 🔥 2️⃣ BACKEND = SIDE-EFFECT (CRIAÇÃO)
  const journeyBackendId = getCurrentJourneyId();
  if (!journeyBackendId) return;

  const payload = {
    tipo: "retornoInterrompido",
    time,
    lat: gps?.lat ?? null,
    lng: gps?.lng ?? null,
    motivo,
    local_id: baseLogLocalId, // 🔑 reconciliação
  };

  mobileJourneyApi
    .addBaseLog(journeyBackendId, payload)
    .then((resp) => {
      const backendId = resp?.id;
      if (!backendId) return;

      // 🔥 reconcilia backendId
      setJornada((j) => ({
        ...j,
        baseLogs: j.baseLogs.map((b) =>
          b.id === baseLogLocalId
            ? { ...b, backendId, sync_status: "synced" }
            : b
        ),
      }));
    })
    .catch(() => {
      // 🔥 offline → fila
      queueRequest(
        `/mobile-journeys/${journeyBackendId}/base-logs`,
        "POST",
        payload
      );
    });

  // 🔹 3️⃣ Libera novo atendimento
  window.dispatchEvent(
    new CustomEvent("start-new-atendimento")
  );
};

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
          {...{ Field, Label, Card, BigBtn, iniciarJornada, loadingJornada }}
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
