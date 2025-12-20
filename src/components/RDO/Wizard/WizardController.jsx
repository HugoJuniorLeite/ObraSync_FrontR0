import { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
// WizardController.jsx
import React, { useState, useEffect, useRef } from "react";
import { nowISO } from "../helpers/time";
import { getLocation } from "../helpers/location";


// import apiMobileJourney from "../../../services/mobileJourneyApi";
import { saveCurrentJourneyId } from "../../../utils/journeyStore";

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

  const iniciarDeslocamento = async () => {
    const deslocamentoInicio = nowISO();
    const gps = await getLocation();

    // 1️⃣ Monta payload local + backend
    const payload = {
      tipo: current.tipo,
      nota_enviada: current.notaEnviada === "sim",
      ordem_tipo: current.ordemTipo,
      // ordem_prefixo: current.ordemPrefixo,
      ordem_numero: current.ordemNumero,

      deslocamento_inicio: deslocamentoInicio,
      gps_inicio: gps ?? null,
      cep: current.endereco.cep,
      rua: current.endereco.rua,
      numero: current.endereco.numero,
      bairro: current.endereco.bairro,
      cidade: current.endereco.cidade,
      estado: current.endereco.estado,
      lat: current.endereco.lat,
      lng: current.endereco.lng,
      comentario: current.comentario ?? "",
      notas: current.notas ?? "",
    };


    // 2️⃣ Atualiza UI imediatamente (offline first)
    setCurrent((c) => ({
      ...c,
      deslocamentoInicio,
      gpsInicio: gps,
    }));

    setJornada((j) => ({
      ...j,
      atividadeAtual: "deslocamento",
    }));

    // 3️⃣ Envia para backend (com fallback offline)
    const journeyId = jornada.id;
    const resp = await apiMobileJourney.createAttendance(journeyId, payload);

    let attendanceId;

    if (resp.ok) {
      attendanceId = resp.data.id;
    } else {
      // ID OFFLINE gerado localmente
      attendanceId = crypto.randomUUID();
    }

    // 4️⃣ Persistir no localStorage para rota e atendimento ativo
    setJornada((j) => ({
      ...j,
      atendimentoAtivoId: attendanceId,
    }));

    localStorage.setItem("obsync_attendance_active", attendanceId);

    // 5️⃣ Avança para próximo step
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

  const iniciarAtendimento = async () => {
    const inicio = nowISO();

    // 1️⃣ Recuperar ID do atendimento ativo criado no Step 4
    const attendanceId = jornada.atendimentoAtivoId || localStorage.getItem("obsync_attendance_active");

    if (!attendanceId) {
      alert("Erro: atendimento ativo não encontrado.");
      return;
    }

    // 2️⃣ GPS chegada
    let gps = null;
    try {
      gps = await getLocation();
    } catch (e) {
      console.warn("GPS indisponível ao iniciar atendimento");
    }

    // 3️⃣ Atualiza UI imediatamente
    setCurrent((c) => ({
      ...c,
      atendimentoInicio: inicio,
      gpsChegada: gps ?? null,
    }));

    setJornada((j) => ({
      ...j,
      atividadeAtual: "atendimento",
    }));

    // 4️⃣ Monta payload para API
    const payload = {
      atendimento_inicio: inicio,
      gps_chegada: gps ?? null,
    };

    // 5️⃣ Envia ao backend ou salva offline
    try {
      await apiMobileJourney.startService(attendanceId, payload);
    } catch (err) {
      // offline → salvar na fila
      queueRequest(
        `/mobile-attendances/${attendanceId}/start-service`,
        "PATCH",
        payload
      );
    }

    // 6️⃣ Avança step
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


  const finalizarAtendimento = async () => {
    const attendanceId =
      jornada.atendimentoAtivoId ||
      localStorage.getItem("obsync_attendance_active");

    if (!attendanceId) {
      alert("Atendimento não encontrado.");
      return;
    }

    const payload = {
      finalizado_em: nowISO(),
      comentario: current.comentario || null,
      fotos: current.fotos || [],
    };

    try {
      await apiMobileJourney.finishService(attendanceId, payload);
    } catch (err) {
      queueRequest(
        `/mobile-attendances/${attendanceId}/finish`,
        "PATCH",
        payload
      );
    }

    setCurrent((c) => ({
      ...c,
      finalizadoEm: payload.finalizado_em,
    }));

    next(); // Step 7
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

  const onIniciarRetornoBase = async () => {
    // if (jornada.atividadeAtual !== "livre") return;

    const time = nowISO();
    const gps = await getLocation();

    // 1) Marca retorno base rápido localmente
    setJornada((p) => ({
      ...p,
      atividadeAtual: "retornoBase",
      baseLogs: [
        ...p.baseLogs,
        {
          id: crypto.randomUUID(),
          tipo: "deslocamentoParaBase",
          time,
          gps,
          finalizado: false,
           },
      ],
    }));


    await mobileJourneyApi.addBaseLog(jornada.id, {
      tipo: "deslocamentoParaBase",
      time,
      lat: gps?.lat ?? null,
      lng: gps?.lng ?? null,
    });
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

  const marcarChegadaBase = async () => {
    // console.log("aqui")
      // if (jornada.atividadeAtual !== "livre") return;

    const time = nowISO();
    const gps = await getLocation();

    setJornada((j) => ({
      ...j,
      atividadeAtual: "livre",
      baseLogs: [
        ...(j.baseLogs || []),
        {
          id: crypto.randomUUID(),
          tipo: "chegadaBase",
          time,
          gps,
        },
      ],
    }));

    await mobileJourneyApi.addBaseLog(jornada.id, {
      tipo: "chegadaBase",
      time,
      lat: gps?.lat ?? null,
      lng: gps?.lng ?? null,
    });

    window.dispatchEvent(new CustomEvent("start-new-atendimento"));
  };



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

//-------------------------------------------------------------
// INTERROMPER DESLOCAMENTO PARA BASE
//-------------------------------------------------------------

const confirmarInterromperRetorno = async (motivo) => {
  // if (jornada.atividadeAtual !== "retornoBase") return;

  // if (!interromperReasonText?.trim()) {
  //   alert("Informe o motivo da interrupção.");
  //   return;
  // }
console.log("CONFIRMARINTERROMPERRETORNO_MOTIVO",motivo)
  const time = nowISO();
  const gps = await getLocation();

  // 1️⃣ Atualiza estado local
  setJornada((j) => ({
    ...j,
    atividadeAtual: "livre",
    baseLogs: [
      ...(j.baseLogs || []),
      {
        id: crypto.randomUUID(),
        tipo: "retornoInterrompido",
        time,
        gps,
      },
    ],
  }));

  // 2️⃣ Persistir no backend
  await mobileJourneyApi.addBaseLog(jornada.id, {
    tipo: "retornoInterrompido",
    time,
    lat: gps?.lat ?? null,
    lng: gps?.lng ?? null,
    motivo,
  });

  // 3️⃣ Reset e liberação
  // setInterromperReasonText("");
  window.dispatchEvent(new CustomEvent("start-new-atendimento"));
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
