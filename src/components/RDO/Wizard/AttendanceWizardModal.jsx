
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

import FirstPanel from "../panel/FirstPanel";
import usePanelState from "../panel/usePanelState";
import { salvarJornada } from "../panel/jornadaStorage";

const STORAGE_KEY = "obra_sync_jornada_v1";

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
  // const encerrarExpediente = async () => {
  //   const gps = await getLocation();
  //   setJornada((p) => ({
  //     ...p,
  //     fimExpediente: nowISO(),
  //     gpsFimExpediente: gps,
  //   }));
  //   setSignatureEnabled(true);
  // };

  // const encerrarExpediente = async () => {
  //   const gps = await getLocation();

  //   // 1 — finaliza jornada
  //   const jornadaFinal = {
  //     ...jornada,
  //     fimExpediente: nowISO(),
  //     gpsFimExpediente: gps,
  //     id: uuid(),
  //   };

  //     salvarJornada(jornadaFinal);

  //       // Salva também foto da assinatura
  // const assinatura = sigRef.current?.toDataURL();
  // if (assinatura) jornadaFinal.assinatura = assinatura;
  //   // (futuro) — aqui você enviaria jornadaFinal para o backend

  //   // 2 — salva fim da jornada (opcional)
  //   setJornada(jornadaFinal);

  //   // 3 — limpar TUDO do localStorage
  //   localStorage.removeItem(STORAGE_KEY);
  //   localStorage.removeItem("wizard_step");
  //   localStorage.removeItem("wizard_state");

  //   // 4 — resetar estados da aplicação
  //   setSignatureEnabled(false);
  //   setWizardStep(0);
  //   setTab(0);

  //   // 5 — limpar a jornada atual na memória
  //   setJornada({
  //     id: uuid(),
  //     date: new Date().toLocaleDateString("pt-BR"),
  //     inicioExpediente: null,
  //     fimExpediente: null,
  //     atendimentos: [],
  //     almocos: [],
  //     atividadeAtual: "livre",
  //     atividadeAnterior: null,
  //     baseLogs: [],
  //   });

  //   // 6 — limpar assinatura
  //   sigRef.current?.clear();

  //   alert("Jornada encerrada com sucesso!");
  // };

  const encerrarExpediente = async () => {
  const gps = await getLocation();

  // 1 — captura assinatura ANTES de tudo
  const assinatura = sigRef.current?.toDataURL();

  // 2 — monta a jornada final
  const jornadaFinal = {
    ...jornada,
    fimExpediente: nowISO(),
    gpsFimExpediente: gps,
    id: uuid(),
    assinatura: assinatura || null,
  };

  // 3 — salva a jornada completa (com assinatura)
  salvarJornada(jornadaFinal);

  // 4 — limpa dados temporários do localStorage
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem("wizard_step");
  localStorage.removeItem("wizard_state");

  // 5 — limpa assinatura na tela
  sigRef.current?.clear();
  setSignatureEnabled(false);

  // 6 — reseta os estados da aplicação
  setWizardStep(0);
  setTab(0);

  // 7 — inicia nova jornada "zerada"
  setJornada({
    id: uuid(),
    date: new Date().toLocaleDateString("pt-BR"),
    inicioExpediente: null,
    fimExpediente: null,
    atendimentos: [],
    almocos: [],
    atividadeAtual: "livre",
    atividadeAnterior: null,
    baseLogs: [],
  });

  alert("Jornada encerrada com sucesso!");
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

          {/* {tab === 2 && (
            <>
              <BasePanel
                jornada={jornada}
                onIniciarRetornoBase={onIniciarRetornoBase}
                onConfirmarChegadaBase={onConfirmarChegadaBase}
              />
              <JourneyMap jornada={jornada} />
            </>
          )} */}
{/* {tab === 2 && (
  <FirstPanel
    panelState={panelState}
    getTodasJornadas={getTodasJornadas}
    calcularTotais={calcularTotais}
    calcularJornadaTotal={calcularJornadaTotal}
    calcularDistanciaTotal={calcularDistanciaTotal}
    fmt={fmt}
    msToHuman={msToHuman}
    exportJornadaAsPdf={exportJornadaAsPdf}
    setRdoHistoricoView={setRdoHistoricoView}
  />
)} */}


{tab === 2 && (
  <FirstPanel panelState={panelState}   exportJornadaAsPdf={exportJornadaAsPdf} 
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

                // 👉 Quando abrir o RDO, habilita assinatura
                if (t.id === 3) {
                  if (jornada.inicioExpediente && !jornada.fimExpediente) {
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
