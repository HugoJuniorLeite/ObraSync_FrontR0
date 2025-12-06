import { useState } from "react";

export default function usePanelState() {
  const [section, setSection] = useState("home");

  // 🔥 Estado do filtro da lista de atendimentos
  const [historicoDataFiltro, setHistoricoDataFiltro] = useState("");

  // 🔥 Jornada selecionada para visualizar o RDO
  const [rdoHistoricoView, setRdoHistoricoView] = useState(null);

  return {
    section,
    setSection,
    historicoDataFiltro,
    setHistoricoDataFiltro,
    rdoHistoricoView,
    setRdoHistoricoView,
  };
}
