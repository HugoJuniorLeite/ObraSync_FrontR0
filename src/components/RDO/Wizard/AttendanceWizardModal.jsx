// AttendanceWizardModal.jsx
import React, { useState, useEffect, useRef, useContext } from "react";
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

import WizardController from "../Wizard/WizardController";

import RdoMain from "../timeline/RdoMain";
import Timeline from "../timeline/Timeline";

import RdoPreview from "../preview/RdoPreview";

import { exportJornadaAsPdf } from "../export/exportPDF";

import HeaderAlmoco from "../almoco/HeaderAlmoco";
import ModalFinalizarAlmocoEarly from "../almoco/ModalFinalizarAlmocoEarly";
import ModalSuspenderAlmoco from "../almoco/ModalSuspenderAlmoco";
import ModalPausarParaAlmoco from "../almoco/ModalPausarParaAlmoco";

import { Clock, List, FileText, BarChart2, LogOut } from "lucide-react";

import FirstPanel from "../panel/FirstPanel";
import usePanelState from "../panel/usePanelState";
import { salvarJornada } from "../panel/jornadaStorage";
import mobileJourneyApi, { finishJourney } from "../../../services/mobileJourneyApi";
import { queueRequest } from "../../../utils/offlineQueue";
import { clearCurrentJourneyId, clearDraftJornada, getCurrentJourneyId, getLunchPatchId, loadDraftJornada, saveDraftJornada, updateLocalJourney } from "../../../utils/journeyStore";
import { readArray, writeArray } from "../../../utils/storageSafe";
import { acquireActionLock, releaseActionLock } from "../../../utils/actionLock";
import { generateUUID } from "../helpers/uuid";
import { AuthContext } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

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
      id: generateUUID(),
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
  const [loadingEncerrar, setLoadingEncerrar] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();


const handleLogout = () => {
  if (window.confirm("Deseja encerrar a sessão?")) {
    logout();
    navigate("/login");
  }
};

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
    if ((jornada.atendimentos?.length ?? 0) > 0) done++;
    if ((jornada.almocos?.length ?? 0) > 0) done++;
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
  const iniciarAlmoco = async () => {
    const inicio = nowISO();

    let gps = null;
    try {
      gps = getLocation({ highAccuracy: true });
    } catch { }

    const lunchLocalId = generateUUID();

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

  const finalizarAlmocoEarly = async () => {
    setShowEarlyFinishModal(false);
    await finalizarAlmoco();
  };


  const finalizarAlmoco = async () => {
    const fim = nowISO();

    let gps = null;
    try {
      gps = getLocation({ highAccuracy: true });
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

  const confirmarPausaParaAlmoco = () => {
    iniciarAlmoco();
    setShowPausarParaAlmocoModal(false);
  };

  const confirmarSuspenderAlmoco = async () => {
    const agora = nowISO();

    let gps = null;
    try {
      gps = getLocation({ highAccuracy: true });
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


  // // ---- ENCERRAR EXPEDIENTE ----

  const encerrarExpediente = async () => {
    if (loadingEncerrar) return;

    const lockKey = "encerrar_jornada";
    if (!acquireActionLock(lockKey)) {
      console.warn("🚫 Encerramento já em andamento");
      return;
    }

    setLoadingEncerrar(true);

    try {
      const journeyBackendId = getCurrentJourneyId();

      if (!journeyBackendId) {
        alert("Nenhuma jornada ativa para encerrar");
        return;
      }

      const fimExpediente = nowISO();
      const assinatura = sigRef.current?.toDataURL() || null;

      // 🔹 GPS best-effort
      let gps = null;
      try {
        gps = getLocation({ highAccuracy: true });
      } catch { }

      // 🔒 1️⃣ VERDADE LOCAL
      const jornadaFinal = {
        ...jornada,
        fimExpediente,
        gpsFimExpediente: gps,
        assinatura,
        status: "encerrada",
        atividadeAtual: "encerrada",
        sync_status: "pending",
      };

      salvarJornada(jornadaFinal);

      // 🔹 2️⃣ BACKEND = SIDE-EFFECT
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

      alert("Jornada encerrada com sucesso!");

      // 🔥 3️⃣ RESET DA SESSÃO
      clearDraftJornada();
      clearCurrentJourneyId();

      // 🔓 libera lock da jornada anterior
      releaseActionLock("iniciar_jornada");

      // 🔹 4️⃣ RESET UI
      sigRef.current?.clear();
      setSignatureEnabled(false);

      setJornada({
        id: generateUUID(),
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
    } catch (err) {
      console.error("Erro ao encerrar expediente:", err);
      alert("Erro ao encerrar jornada. Tente novamente.");
    } finally {
      setLoadingEncerrar(false);
      releaseActionLock(lockKey); // 🔓 ÚNICO ponto de liberação
    }
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
          <CloseBtn onClick={handleLogout} title="Sair">
            <LogOut size={18} />
          </CloseBtn>

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
