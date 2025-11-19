// src/components/RDO/GasitaOperacoes/styles/layout.js
import styled from "styled-components";

/* Overlay / content */
export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(4, 8, 12, 0.65);
  z-index: 1200;
`;

export const Content = styled.div`
  width: min(1100px, 96vw);
  max-height: 92vh;
  overflow: auto;
  background: ${(p) => p.theme.colors.bg};
  border-radius: ${(p) => p.theme.radii.lg};
  padding: 20px;
  border: 1px solid ${(p) => p.theme.colors.border};
  color: ${(p) => p.theme.colors.text};
  box-shadow: ${(p) => p.theme.shadow.card};
  position: relative;
`;

/* Header controls */
export const CloseBtn = styled.button`
  position: absolute;
  top: 14px;
  right: 14px;
  background: none;
  border: none;
  color: ${(p) => p.theme.colors.text};
  font-size: 22px;
  cursor: pointer;
  &:hover { color: ${(p) => p.theme.colors.primary}; }
`;

export const Title = styled.h2`
  color: ${(p) => p.theme.colors.primary};
  margin: 0 0 6px 0;
  font-size: 1.45rem;
  font-weight: 700;
`;

export const Sub = styled.p`
  color: ${(p) => p.theme.colors.muted};
  margin: 0 0 14px 0;
  font-size: 0.95rem;
`;

/* Layout building blocks */
export const Card = styled.div`
  background: ${(p) => p.theme.colors.panel};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  padding: 14px;
  margin-bottom: 14px;
  box-shadow: ${(p) => p.theme.shadow.soft};
`;

export const Row = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  margin-bottom: 12px;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.label`
  color: ${(p) => p.theme.colors.muted};
  font-size: 0.92rem;
`;

/* Controls */
export const Input = styled.input`
  padding: 10px 12px;
  border-radius: 8px;
  outline: none;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: #10243a;
  color: ${(p) => p.theme.colors.text};
  &:focus {
    box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.13);
    border-color: ${(p) => p.theme.colors.primary};
  }
`;

export const Textarea = styled.textarea`
  padding: 10px 12px;
  border-radius: 8px;
  outline: none;
  resize: vertical;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: #10243a;
  color: ${(p) => p.theme.colors.text};
  &:focus {
    box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.13);
    border-color: ${(p) => p.theme.colors.primary};
  }
`;

export const Select = styled.select`
  padding: 10px 12px;
  border-radius: 8px;
  outline: none;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: #10243a;
  color: ${(p) => p.theme.colors.text};
  &:focus {
    box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.13);
    border-color: ${(p) => p.theme.colors.primary};
  }
`;

/* Banner */
export const Banner = styled.div`
  background: linear-gradient(90deg, ${(p) => p.theme.colors.primary}, ${(p) => p.theme.colors.primaryDark});
  color: white;
  padding: 10px 12px;
  border-radius: ${(p) => p.theme.radii.md};
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  box-shadow: 0 6px 18px rgba(13, 71, 161, 0.10);
`;

/* Timeline */
export const TimelineItem = styled.div`
  display:flex;
  gap:10px;
  align-items:flex-start;
  margin-bottom:10px;
  color: ${(p) => p.theme.colors.text};
`;
export const TimeDot = styled.div`
  width:10px; height:10px; border-radius:999px;
  background: ${(p) => p.theme.colors.primary};
  margin-top:6px;
`;

/* Buttons - Azul premium, arredondado 10px (conforme solicitado) */
export const Btn = styled.button`
  display:flex;
  align-items:center;
  gap:8px;
  cursor:pointer;
  padding: .65rem 1rem;
  border-radius: ${(p) => p.theme.radii.md};
  font-weight:700;
  border: 1px solid ${(p) => (p.$primary ? p.theme.colors.primary : p.theme.colors.secondary)};
  background: ${(p) => (p.$primary ? p.theme.colors.primary : p.theme.colors.secondary)};
  color: ${(p) => (p.$primary ? "#0f172a" : p.theme.colors.text)};
  transition: filter .12s ease;
  &:hover { filter: brightness(1.07); }
  &:disabled { opacity: .5; cursor: not-allowed; }
`;

/* Thumbnail */
export const ImgThumb = styled.div`
  position: relative;
  width:90px; height:90px;
  border-radius:10px; overflow:hidden;
  border:1px solid ${(p) => p.theme.colors.border};
  img { width:100%; height:100%; object-fit:cover; }
  button {
    position:absolute; top:-6px; right:-6px;
    background:${(p) => p.theme.colors.danger}; border:none; color:white;
    border-radius:50%; width:22px; height:22px; cursor:pointer;
  }
`;

/* Utility bar */
export const Bar = styled.div`
  display:flex; justify-content: space-between; gap:.6rem; margin-top: 1rem; align-items:center;
`;

/* Small responsive helpers */
export const CompactRow = styled.div`
  display:flex; gap:8px; align-items:center; flex-wrap:wrap;
`;

/* Exports done */
