import React from "react";
import { Card, Field, Label, Input, Select, BigBtn } from "../styles/layout";

export default function PanelEnvioDocs({ panelState }) {
  const { setSection } = panelState;

  return (
    <div style={{ padding: 12 }}>
      <BigBtn onClick={() => setSection("home")}>Voltar</BigBtn>

      <h3 style={{ color: "#f59e0b", margin: "10px 0" }}>Envio de Documentos</h3>

      <Card>
        <Field>
          <Label>Categoria</Label>
          <Select defaultValue="">
            <option value="">Selecione...</option>
            <option value="pessoal">Pessoal</option>
            <option value="trabalho">Trabalho</option>
          </Select>
        </Field>

        <Field>
          <Label>Descrição</Label>
          <Input placeholder="Opcional" />
        </Field>

        <Field>
          <Label>Arquivos</Label>
          <Input type="file" multiple />
        </Field>

        <BigBtn $primary>Enviar documentos</BigBtn>
      </Card>
    </div>
  );
}
