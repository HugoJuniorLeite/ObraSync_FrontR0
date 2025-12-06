import React from "react";
import { Card, Field, Label, Select, Input, BigBtn } from "../styles/layout";

export default function PanelSolicitacoes({ panelState }) {
  const { setSection } = panelState;

  return (
    <div style={{ padding: 12 }}>
      <BigBtn onClick={() => setSection("home")}>Voltar</BigBtn>

      <h3 style={{ color: "#f59e0b", margin: "10px 0" }}>Solicitações</h3>

      <Card>
        <Field>
          <Label>Tipo de solicitação</Label>
          <Select defaultValue="">
            <option value="">Selecione...</option>
            <option value="epi">EPI</option>
            <option value="material">Material</option>
            <option value="ferramenta">Ferramenta</option>
            <option value="reembolso">Reembolso</option>
          </Select>
        </Field>

        <Field>
          <Label>Descrição</Label>
          <Input placeholder="Explique o que precisa..." />
        </Field>

        <BigBtn $primary>Enviar</BigBtn>
      </Card>
    </div>
  );
}
