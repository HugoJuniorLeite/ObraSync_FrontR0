// previewLayout.js (iOS Light Minimal - Preview specific layout)
// import this only inside RdoPreview.jsx via ThemeProvider + styled components usage

import styled from "styled-components";

/* Frame wrapper (moldura azul fina) */
export const PreviewWrapper = styled.div`
  display:flex;
  gap:16px;
  align-items:flex-start;
`;

/* Blue frame around the content */
export const PreviewFrame = styled.div`
  background: ${(p) => p.theme.colors.frame || "#00396b"};
  padding: ${(p) => (p.theme.preview?.frameWidth || 6)}px;
  border-radius: ${(p) => p.theme.radii.md || "10px"};
  box-shadow: 0 6px 18px rgba(0,57,107,0.08);
`;

/* White sheet inside the blue frame */
export const PreviewSheet = styled.div`
  width: 800px; /* A4-like width in px (adjustable) */
  background: ${(p) => p.theme.colors.bg || "#ffffff"};
  color: ${(p) => p.theme.colors.text || "#0f172a"};
  border-radius: ${(p) => p.theme.radii.sm || "6px"};
  padding: ${(p) => (p.theme.spacing?.pagePadding || 18)}px;
  box-sizing: border-box;
`;

/* Right-side control column */
export const PreviewControls = styled.div`
  min-width: 220px;
  display:flex;
  flex-direction:column;
  gap:12px;
`;

/* Card (light) for preview */
export const PreviewCard = styled.div`
  background: ${(p) => p.theme.colors.panel || "#f9fafb"};
  border: 1px solid ${(p) => p.theme.colors.panelBorder || "#d0d7e2"};
  border-radius: ${(p) => p.theme.radii.sm || "6px"};
  padding: 12px;
  box-shadow: 0 2px 6px rgba(16,24,40,0.04);
`;

/* Title and metadata */
export const DocHeader = styled.div`
  display:flex; justify-content:space-between; align-items:center; gap:12px;
  margin-bottom: 12px;
`;
export const DocTitle = styled.h3`
  margin:0; color: ${(p) => p.theme.colors.title || "#00396b"}; font-size:1.05rem;
`;
export const DocMeta = styled.div`
  color: ${(p) => p.theme.colors.muted || "#475569"}; font-size:0.9rem;
`;

/* Section */
export const Section = styled.div`
  margin-top: 12px;
`;

/* Small button (light) used inside preview controls */
export const LightBtn = styled.button`
  padding: 8px 12px;
  border-radius: ${(p) => p.theme.radii.btn || "8px"};
  border: 1px solid ${(p) => p.theme.colors.primary || "#38bdf8"};
  background: ${(p) => (p.$primary ? p.theme.colors.primary : "transparent")};
  color: ${(p) => (p.$primary ? "#081018" : p.theme.colors.title || "#00396b")};
  font-weight: 700;
  cursor: pointer;
  &:hover { filter: brightness(1.05); }
`;
