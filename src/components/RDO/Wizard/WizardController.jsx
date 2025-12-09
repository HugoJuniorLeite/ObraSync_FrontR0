import { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext"; 
// WizardController.jsx
import React, { useState, useEffect, useRef } from "react";
import { nowISO } from "../helpers/time";
import { getLocation } from "../helpers/location";


import mobileJourneyApi from "../../../services/mobileJourneyApi";
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

  const iniciarDeslocamento = () => {
    const deslocamentoInicio = nowISO();

    // 1) Atualiza UI na hora
    setCurrent((c) => ({
      ...c,
      deslocamentoInicio,
    }));

    setJornada((p) => ({
      ...p,
      atividadeAtual: "deslocamento",
    }));

    // 2) GPS depois
    getLocation().then((gps) => {
      if (!gps) return;
      setCurrent((c) => ({
        ...c,
        gpsInicio: gps,
      }));
    });
  };

  const iniciarAtendimento = () => {
    const inicio = nowISO();

    setCurrent((c) => ({
      ...c,
      atendimentoInicio: inicio,
    }));

    setJornada((p) => ({
      ...p,
      atividadeAtual: "atendimento",
    }));

    getLocation().then((gps) => {
      if (!gps) return;
      setCurrent((c) => ({
        ...c,
        gpsChegada: gps,
      }));
    });
  };

  const concluirAtendimento = () => {
    const final = nowISO();

    setJornada((j) => ({
      ...j,
      atendimentos: [
        ...j.atendimentos,
        {
          id: crypto.randomUUID(),
          ...current,
          finalizadoEm: final,
        },
      ],
    }));

    setCurrent((c) => ({
      ...c,
      finalizadoEm: final,
    }));

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

    for (const f of files) {
      const base64 = await fileToBase64(f);
      convertidos.push(base64);
    }

    updateCurrentField("fotos", [
      ...(current.fotos || []),
      ...convertidos,
    ]);
  };

  const onIniciarRetornoBase = () => {
    const time = nowISO();

    // 1) Marca retorno base rápido
    setJornada((j) => ({
      ...j,
      atividadeAtual: "retornoBase",
      baseLogs: [
        ...(j.baseLogs || []),
        {
          id: crypto.randomUUID(),
          tipo: "deslocamentoParaBase",
          time,
          gps: null,
          finalizado: false,
        },
      ],
    }));

    // 2) GPS em background
    getLocation().then((gps) => {
      if (!gps) return;
      setJornada((j) => {
        const logs = [...(j.baseLogs || [])];
        const idx = logs.findIndex(
          (l) =>
            l.tipo === "deslocamentoParaBase" &&
            l.time === time &&
            !l.finalizado
        );
        if (idx !== -1) {
          logs[idx] = { ...logs[idx], gps };
        }
        return { ...j, baseLogs: logs };
      });
    });
  };

  const marcarChegadaBase = () => {
    // Troca step imediato
    setStep(1);

    // GPS em background
    getLocation().then((gps) => {
      setJornada((p) => {
        const logs = [...(p.baseLogs || [])];
        const idx = logs.findIndex(
          (l) => l.tipo === "deslocamentoParaBase" && !l.finalizado
        );

        if (idx !== -1) logs[idx].finalizado = true;

        logs.push({
          id: crypto.randomUUID(),
          tipo: "chegadaBase",
          time: nowISO(),
          gps,
        });

        return {
          ...p,
          baseLogs: logs,
          atividadeAtual: "livre",
          atividadeAnterior: null,
        };
      });

      window.dispatchEvent(
        new CustomEvent("start-new-atendimento")
      );
    });
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

  const confirmarInterromperRetorno = () => {
    setInterromperReasonText("");
    startNewAtendimento();
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
            concluirAtendimento,
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
