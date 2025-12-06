// src/panel/PanelHome.jsx
import React from "react";
import { Card } from "../styles/layout";
import {
  CalendarDays,
  ClipboardList,
  Package,
  UploadCloud,
} from "lucide-react";

export default function PanelHome({ panelState }) {
  const { setSection } = panelState;

  const menuItems = [
    {
      icon: <CalendarDays size={28} />,
      title: "Escala de Trabalho",
      desc: "Veja seus dias de trabalho, folgas e feriados.",
      section: "escala",
    },
    {
      icon: <ClipboardList size={28} />,
      title: "Meus atendimentos",
      desc: "Consulte jornadas anteriores e RDOs.",
      section: "historico",
    },
    {
      icon: <Package size={28} />,
      title: "Solicitações",
      desc: "Peça EPIs, materiais e outros itens.",
      section: "solicitacoes",
    },
    {
      icon: <UploadCloud size={28} />,
      title: "Envio de documentos",
      desc: "Envie atestados e documentos de trabalho.",
      section: "documentos",
    },
  ];

  return (
    <div style={{ padding: "10px 14px" }}>
      <h3
        style={{
          color: "#f59e0b",
          marginBottom: 14,
          fontSize: "1.1rem",
          fontWeight: 700,
        }}
      >
        Painel do Dia
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        {menuItems.map((item, idx) => (
          <Card
            key={idx}
            style={{
              padding: 16,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              borderColor: "#00396b",
              transition: "0.15s",
            }}
            onClick={() => setSection(item.section)}
          >
            <div style={{ color: "#dbeafe" }}>{item.icon}</div>

            <div style={{ fontWeight: 700, color: "#e5f0ff" }}>
              {item.title}
            </div>

            <div
              style={{
                color: "#9fb4c9",
                fontSize: ".85rem",
                lineHeight: "1.2rem",
              }}
            >
              {item.desc}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
