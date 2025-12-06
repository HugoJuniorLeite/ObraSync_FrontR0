// WizardController.jsx
import React, { useState, useEffect } from "react";
import { nowISO } from "../helpers/time";
import { getLocation } from "../helpers/location";

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
// import Step9_RetornoBase from "./steps/Step9_RetornoBase";
// import Step10_Interromper from "./steps/Step9_Interromper";
import Step9_Interromper from "./steps/Step9_Interromper";

export default function WizardController({
  jornada,
  setJornada,
  step,
  setStep
}) {
  const STORAGE_CURRENT = "wizard_current";

const loadCurrent = () => {
  try {
    const saved = localStorage.getItem(STORAGE_CURRENT);
    if (saved) return JSON.parse(saved);
  } catch {}
     return {
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
      };
};

const [current, setCurrent] = useState(() => loadCurrent());
const [interromperReasonText, setInterromperReasonText] = useState("");

useEffect(() => {
  localStorage.setItem(STORAGE_CURRENT, JSON.stringify(current));
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

    // const startNewAtendimentoEvt = () => {
    //   startNewAtendimento();
    // };

    const startNewAtendimentoEvt = (e) => {
      const { step } = e.detail || {};
      startNewAtendimento(step ?? 1);
    };


    window.addEventListener("pause-for-lunch", pauseForLunch);
    window.addEventListener("lunch-finished", lunchFinished);
    window.addEventListener("goto-step", gotoStep);
    window.addEventListener("start-new-atendimento", startNewAtendimentoEvt);

    // window.dispatchEvent(new CustomEvent("start-new-atendimento", {
    //   detail: { step: 2 }
      
    // }));

    // window.addEventListener("start-new-atendimento", startNewAtendimentoEvt);

    return () => {
      window.removeEventListener("pause-for-lunch", pauseForLunch);
      window.removeEventListener("lunch-finished", lunchFinished);
      window.removeEventListener("goto-step", gotoStep);
      window.removeEventListener("start-new-atendimento", startNewAtendimentoEvt);
    };
  }, [step, setStep]);

  const next = () => setStep(step + 1);
  const prev = () => setStep(step - 1);

  const updateCurrentField = (path, value) => {
    setCurrent((prev) => {
      const copy = structuredClone(prev);
      const keys = path.split(".");
      let ref = copy;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!ref[keys[i]]) ref[keys[i]] = {};
        ref = ref[keys[i]];
      }
      ref[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  // -------------------------
  // AÇÕES JORNADA
  // -------------------------
  const iniciarJornada = async () => {
    const gps = await getLocation();
    setJornada((p) => ({
      ...p,
      inicioExpediente: nowISO(),
      gpsInicioExpediente: gps,
    }));
    next();
  };

  const iniciarDeslocamento = async () => {
    const gps = await getLocation();
    setCurrent((c) => ({
      ...c,
      deslocamentoInicio: nowISO(),
      gpsInicio: gps,
    }));

    setJornada((p) => ({
      ...p,
      atividadeAtual: "deslocamento",
    }));
  };

  const iniciarAtendimento = async () => {
    const gps = await getLocation();

    setCurrent((c) => ({
      ...c,
      atendimentoInicio: nowISO(),
      gpsChegada: gps,
    }));

    setJornada((p) => ({
      ...p,
      atividadeAtual: "atendimento",
    }));
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

  // Converte File → Base64 para poder persistir no localStorage
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result); // retorna o Base64
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const addFotos = async (files) => {
  const convertidos = [];

  for (const f of files) {
    const base64 = await fileToBase64(f);
    convertidos.push(base64);
  }

  // Atualiza o array de fotos no current (persistido)
  updateCurrentField("fotos", [
    ...(current.fotos || []),
    ...convertidos
  ]);
};



  const onIniciarRetornoBase = async () => {
    const gps = await getLocation();

    setJornada((j) => ({
      ...j,
      atividadeAtual: "retornoBase",
      baseLogs: [
        ...(j.baseLogs || []),
        {
          id: crypto.randomUUID(),
          tipo: "deslocamentoParaBase",
          time: nowISO(),
          gps,
          finalizado: false,
        },
      ],
    }));
  };

const marcarChegadaBase = async () => {
  const gps = await getLocation();

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
      atividadeAtual: "livre",     // 🔥 ESSENCIAL
      atividadeAnterior: null
    };
  });

  window.dispatchEvent(new CustomEvent("start-new-atendimento"));

  setStep(1);
};


  const distanciaAteBase = () => {
    if (!current.gpsInicio) return null;
    return (
      (haversine(current.gpsInicio, BASE_COORDS) / 1000).toFixed(2) + " km"
    );
  };

  const startNewAtendimento = (goToStep = 1) => {
    setCurrent({
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
// try {
// localStorage.removeItem(STORAGE_CURRENT);
// } catch {}

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
      console.log(data, cep)

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
        <Step0_IniciarJornada {...{ Field, Label, Card, BigBtn, iniciarJornada }} />
      )}

      {step === 1 && (
        <Step1_Tipo {...{ Field, Label, Card, BigBtn, current, updateCurrentField, next }} />
      )}

      {step === 2 && (
        <Step2_OS {...{ Field, Label, Card, BigBtn, Input, Select, current, updateCurrentField, next, prev }} />
      )}

      {step === 3 && (
        <Step3_Endereco {...{ Field, Label, Card, BigBtn, Input, current, updateCurrentField, buscarCep, next, prev }} />
      )}

      {step === 4 && (
        <Step4_DeslocamentoPrep {...{ Field, Label, Card, BigBtn, current, iniciarDeslocamento, next, prev }} />
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

      {/* {step === 8 && (
        <Step8_AposAtendimento
          {...{
            Field,
            Label,
            Card,
            BigBtn,
            current,
            fmt,
            onIniciarRetornoBase,
            startNewAtendimento,
            next,
          }}
        />
      )} */}

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
