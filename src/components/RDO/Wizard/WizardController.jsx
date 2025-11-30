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
import Step9_RetornoBase from "./steps/Step9_RetornoBase";
import Step10_Interromper from "./steps/Step10_Interromper";

export default function WizardController({ jornada, setJornada, onStepChange }) {

  // -------------------------
  // ESTADO PRINCIPAL
  // -------------------------
  const [step, setStep] = useState(0);

  // SINCRONIZAção COM O MODAL
  useEffect(() => {
    if (typeof onStepChange === "function") {
      onStepChange(step);
    }
  }, [step, onStepChange]);

  const [interromperReasonText, setInterromperReasonText] = useState("");

  const [current, setCurrent] = useState({
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

  // -------------------------
  // EVENTOS DISPARADOS PELO MODAL DO ALMOÇO
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
      const { step } = e.detail || {};
      if (typeof step === "number") {
        setStep(step);
      }
    };

    const startNewAtendimentoEvt = (e) => {
      const { kind } = e.detail || {};
      startNewAtendimento(kind);
    };

    window.addEventListener("pause-for-lunch", pauseForLunch);
    window.addEventListener("lunch-finished", lunchFinished);
    window.addEventListener("goto-step", gotoStep);
    window.addEventListener("start-new-atendimento", startNewAtendimentoEvt);

    return () => {
      window.removeEventListener("pause-for-lunch", pauseForLunch);
      window.removeEventListener("lunch-finished", lunchFinished);
      window.removeEventListener("goto-step", gotoStep);
      window.removeEventListener("start-new-atendimento", startNewAtendimentoEvt);
    };

  }, [step]);

  // -------------------------
  // HELPERS
  // -------------------------
  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => s - 1);

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
  // JORNADA
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
      const idx = logs.findIndex((l) => l.tipo === "deslocamentoParaBase" && !l.finalizado);

      if (idx !== -1) logs[idx].finalizado = true;

      logs.push({
        id: crypto.randomUUID(),
        tipo: "chegadaBase",
        time: nowISO(),
        gps,
      });

      return { ...p, baseLogs: logs };
    });

    window.dispatchEvent(new CustomEvent("start-new-atendimento", { detail: {} }));

    setStep(1);
  };

  const distanciaAteBase = () => {
    if (!current.gpsInicio) return null;
    return (haversine(current.gpsInicio, BASE_COORDS) / 1000).toFixed(2) + " km";
  };

  const startNewAtendimento = () => {
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

    setStep(1);
  };

  const confirmarInterromperRetorno = () => {
    console.log("Motivo:", interromperReasonText);
    setInterromperReasonText("");
    startNewAtendimento();
  };

  const buscarCep = async (cep) => {
    cep = cep.replace(/\D/g, "");
    if (cep.length !== 8) return;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();

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
  // RENDERIZAÇÃO DAS ETAPAS
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
            current,
            fmt,
            onIniciarRetornoBase,
            startNewAtendimento,
            next,
          }}
        />
      )}

      {step === 9 && (
        <Step9_RetornoBase
          {...{
            Field,
            Label,
            Card,
            BigBtn,
            jornada,
            fmt,
            marcarChegadaBase,
            distanciaAteBase,
            abrirInterromperRetorno: () => setStep(10),
            next,
            startNewAtendimento,
          }}
        />
      )}

      {step === 10 && (
        <Step10_Interromper
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
