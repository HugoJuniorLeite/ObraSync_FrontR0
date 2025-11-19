// RdoPreview.jsx (updated)
// Usa previewTheme + previewLayout e captura mapa via JourneyMapSnapshot (static image)
// Cole em src/components/RDO/GasitaOperacoes/preview/RdoPreview.jsx

import React, { useRef, useState, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { previewTheme } from "../styles/previewTheme";
import * as LStyle from "../styles/previewLayout";
// import { PreviewCard, LightBtn } from "../styles/previewLayout"; // but we exported named styled components
import SignatureBlock from "./SignatureBlock";
import JourneyMapSnapshot from "../mapa/JourneyMapSnapshot";
import { useRdo } from "../RdoMain";

/* Note: previewLayout exports PreviewWrapper, PreviewFrame, PreviewSheet, PreviewControls, PreviewCard, DocHeader, DocTitle, DocMeta, Section, LightBtn */
const { PreviewWrapper, PreviewFrame, PreviewSheet, PreviewControls, PreviewCard, DocHeader, DocTitle, DocMeta, Section, LightBtn } = LStyle;

export default function RdoPreview({ onClose }) {
  const { state } = useRdo();
  const previewRef = useRef(null);
  const mapRef = useRef(null);
  const [assinatura, setAssinatura] = useState(null);
  const [mapImg, setMapImg] = useState(null);
  const [generating, setGenerating] = useState(false);

  // generate map snapshot on mount (resolution 800px width)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (mapRef.current?.getSnapshot) {
          const data = await mapRef.current.getSnapshot({ width: 800 });
          if (mounted) setMapImg(data);
        }
      } catch (e) {
        console.warn("map snapshot failed", e);
      }
    })();
    return () => { mounted = false; };
  }, [state.jornada]);

  const exportToPDF = async () => {
    setGenerating(true);
    try {
      // ensure map snapshot is fresh before capture
      if (!mapImg && mapRef.current?.getSnapshot) {
        const data = await mapRef.current.getSnapshot({ width: 800 });
        setMapImg(data);
      }

      // capture the preview sheet element (white content)
      const el = previewRef.current;
      if (!el) return alert("Preview não disponível para exportação.");

      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: null });
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF("portrait", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(img);
      const pdfHeight = (imgProps.height * pageWidth) / imgProps.width;
      pdf.addImage(img, "PNG", 0, 0, pageWidth, pdfHeight);
      pdf.save(`RDO-${state.jornada.date}.pdf`);
    } catch (e) {
      console.error(e);
      alert("Falha ao gerar PDF: " + e.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <ThemeProvider theme={previewTheme}>
      <PreviewWrapper>
        <PreviewFrame>
          <PreviewSheet ref={previewRef} id="rdo-preview-sheet">
            <DocHeader>
              <DocTitle>Relatório Diário de Obra — {state.jornada.date}</DocTitle>
              <DocMeta>
                Técnico: <strong>{state.jornada.technician || "—"}</strong>
                <br />
                Gerado: {new Date().toLocaleString("pt-BR")}
              </DocMeta>
            </DocHeader>

            <Section>
              <PreviewCard style={{ padding: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>Expediente</div>
                    <div style={{ color: previewTheme.colors.muted, marginTop: 6 }}>
                      Início: {state.jornada.inicioExpediente || "—"} • Fim: {state.jornada.fimExpediente || "—"}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 700 }}>Resumo</div>
                    <div style={{ color: previewTheme.colors.muted, marginTop: 6 }}>
                      Atendimentos: {state.jornada.atendimentos.length} • Distância: {calcDistancePreview(state.jornada)} km
                    </div>
                  </div>
                </div>
              </PreviewCard>
            </Section>

            <Section>
              <div style={{ fontWeight: 700, color: previewTheme.colors.title }}>Atendimentos</div>
              <div style={{ marginTop: 8 }}>
                {state.jornada.atendimentos.map((a) => (
                  <div key={a.id} style={{ padding: 10, borderBottom: `1px solid ${previewTheme.colors.panelBorder}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>
                          {a.tipo === "interno" ? `OS ${a.ordemPrefixo}-${a.ordemNumero}` : `OS ${a.ordemTipo}-${a.ordemNumero}`}
                        </div>
                        <div style={{ color: previewTheme.colors.muted }}>{a.endereco.rua || "—"} {a.endereco.numero || ""} — {a.endereco.cidade || ""}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div>Deslocamento: {a.deslocamentoInicio || "—"}</div>
                        <div>Início: {a.atendimentoInicio || "—"}</div>
                        <div>Fim: {a.finalizadoEm || "—"}</div>
                        <div>Fotos: {a.fotos?.length || 0}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section>
              <div style={{ fontWeight: 700, color: previewTheme.colors.title }}>Mapa</div>
              <div style={{ marginTop: 8 }}>
                <div style={{ height: 260, border: `1px solid ${previewTheme.colors.panelBorder}`, borderRadius: 6, overflow: "hidden" }}>
                  {mapImg ? (
                    <img src={mapImg} alt="map snapshot" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: previewTheme.colors.muted }}>
                      Gerando mapa...
                    </div>
                  )}
                </div>
              </div>
            </Section>

            <Section>
              <div style={{ fontWeight: 700, color: previewTheme.colors.title, marginBottom: 8 }}>Assinatura</div>
              {assinatura ? (
                <img src={assinatura} alt="assinatura" style={{ width: 300, border: `1px solid ${previewTheme.colors.panelBorder}`, borderRadius: 6 }} />
              ) : (
                <div style={{ color: previewTheme.colors.muted }}>Assinatura ainda não capturada.</div>
              )}
            </Section>
          </PreviewSheet>
        </PreviewFrame>

        <PreviewControls>
          <PreviewCard>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Ações</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <SignatureBlock onSigned={(img) => setAssinatura(img)} />
              <LightBtn $primary onClick={exportToPDF} disabled={generating}>{generating ? "Gerando..." : "Exportar PDF"}</LightBtn>
              <LightBtn onClick={onClose}>Fechar</LightBtn>
            </div>
          </PreviewCard>

          {/* Hidden map renderer used to create snapshot - invisible to user but mounted */}
          <div style={{ width: 0, height: 0, overflow: "hidden" }}>
            <JourneyMapSnapshot ref={mapRef} jornada={state.jornada} />
          </div>
        </PreviewControls>
      </PreviewWrapper>
    </ThemeProvider>
  );
}

/* small helpers */
function calcDistancePreview(jornada) {
  // compute approximate distance in km
  const pts = [];
  jornada.atendimentos?.forEach(a => {
    if (a.gpsInicio?.lat) pts.push({ lat: Number(a.gpsInicio.lat), lng: Number(a.gpsInicio.lng) });
    if (a.gpsChegada?.lat) pts.push({ lat: Number(a.gpsChegada.lat), lng: Number(a.gpsChegada.lng) });
  });
  if (pts.length < 2) return "0.00";
  let total = 0;
  for (let i = 1; i < pts.length; i++) total += haversine(pts[i-1], pts[i]);
  return (total/1000).toFixed(2);
}
function haversine(a,b) {
  if(!a||!b) return 0;
  const toRad = v => (v*Math.PI)/180;
  const R = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat); const lat2 = toRad(b.lat);
  const sinDlat = Math.sin(dLat/2)**2; const sinDlon = Math.sin(dLon/2)**2;
  const aCalc = sinDlat + Math.cos(lat1)*Math.cos(lat2)*sinDlon;
  const c = 2*Math.atan2(Math.sqrt(aCalc), Math.sqrt(1-aCalc));
  return R * c;
}
