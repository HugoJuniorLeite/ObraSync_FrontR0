// src/components/RDO/panel/FirstPanel.jsx

import React from "react";

import PanelHome from "./PanelHome";
import PanelEscala from "./PanelEscala";
import PanelHistorico from "./PanelHistorico";
import PanelSolicitacoes from "./PanelSolicitacoes";
import PanelEnvioDocs from "./PanelEnvioDocs";
import RdoHistoricoPreview from "./RdoHistoricoPreview";


import { useJourneys } from "./useJourneys";

// IMPORTAÇÕES CORRETAS DOS HELPERS SEPARADOS
import { calcularDistanciaTotal } from "../helpers/distance";
import {
  calcularTotais,
  calcularJornadaTotal
} from "../helpers/metrics";
import { fmt, msToHuman } from "../helpers/time";

export default function FirstPanel({
  panelState,
  exportJornadaAsPdf,
}) {
  const { section, setRdoHistoricoView } = panelState;


  const { getAll: getTodasJornadas } = useJourneys();

  if (section === "escala") {
    return <PanelEscala panelState={panelState} />;
  }

  if (section === "historico") {
    return (
      <PanelHistorico
        panelState={panelState}
        calcularTotais={calcularTotais}
        calcularJornadaTotal={calcularJornadaTotal}
        calcularDistanciaTotal={calcularDistanciaTotal}
        fmt={fmt}
        msToHuman={msToHuman}
        exportJornadaAsPdf={exportJornadaAsPdf}
        setRdoHistoricoView={setRdoHistoricoView}
      />
    );
  }

  if (section === "solicitacoes") {
    return <PanelSolicitacoes panelState={panelState} />;
  }

  if (section === "documentos") {
    return <PanelEnvioDocs panelState={panelState} />;
  }


if (section === "preview_rdo") {
  return (
    <RdoHistoricoPreview
      panelState={panelState}
      jornada={panelState.rdoHistoricoView}
      exportJornadaAsPdf={exportJornadaAsPdf}
    />
  );
}

  return <PanelHome panelState={panelState} />;
}
