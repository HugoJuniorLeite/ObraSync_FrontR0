// src/components/RDO/GasitaOperacoes/styles/theme.js
// Tema: Azul Premium Profissional (10% mais escuro)

export const theme = {
  colors: {
    // Base / fundos
    bg: "#162534",          // fundo principal (10% mais escuro)
    panel: "#0d1a28",       // painel / card
    panelLighter: "#112134",
    border: "#00335f",      // borda azul petróleo refinado

    // Ações
    primary: "#38bdf8",     // ciano premium
    primaryDark: "#0ea5e9",
    secondary: "#00396b",   // azul petróleo intenso (botões secundários)

    // Tipografia
    text: "#e5f0ff",
    muted: "#9fb4c9",

    // Estados
    success: "#10b981",
    danger: "#ef4444"
  },

  radii: {
    sm: "6px",
    md: "10px", // botão arredondado conforme pedido
    lg: "14px"
  },

  spacing: {
    pagePadding: 18
  },

  shadow: {
    card: "0 4px 14px rgba(0, 57, 107, 0.25)",
    soft: "0 2px 8px rgba(0, 0, 0, 0.28)"
  },

  // Preview/theme-specific (compatível com Preview claro)
  preview: {
    frameWidth: 6
  }
};
