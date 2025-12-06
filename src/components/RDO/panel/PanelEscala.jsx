import React from "react";
import { Card, BigBtn } from "../styles/layout";

export default function PanelEscala({ panelState }) {
  const { setSection } = panelState;

  return (
    <div style={{ padding: 12 }}>
      <BigBtn onClick={() => setSection("home")}>Voltar</BigBtn>

      <h3 style={{ color: "#f59e0b", margin: "10px 0" }}>Escala de Trabalho</h3>

      <Card>
        <div style={{ color: "#9fb4c9" }}>
          Aqui você poderá ver sua escala mensal, folgas e plantões.
        </div>
      </Card>
    </div>
  );
}
