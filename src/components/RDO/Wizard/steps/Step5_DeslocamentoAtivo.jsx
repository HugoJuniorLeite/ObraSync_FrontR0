import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import { decode } from "@here/flexpolyline";

import { getLocation } from "../../helpers/location";
import { snapToRoute } from "../../helpers/snapToRoute";
import { distanciaRestanteNaRota } from "../../helpers/distance";

/* -------------------------------------------------------
 * 🔁 Centraliza o mapa acompanhando o técnico
 * ----------------------------------------------------- */
function FollowMap({ center }) {
  const map = useMap();

  useEffect(() => {
    if (
      center &&
      Number.isFinite(center.lat) &&
      Number.isFinite(center.lng)
    ) {
      map.setView([center.lat, center.lng], map.getZoom(), {
        animate: true,
      });
    }
  }, [center, map]);

  return null;
}

/* -------------------------------------------------------
 * STEP 5 — DESLOCAMENTO ATIVO
 * ----------------------------------------------------- */
export default function Step5_DeslocamentoAtivo({
  Field,
  Label,
  Card,
  BigBtn,
  atendimento,
  fmt,
  iniciarAtendimento,
}) {
  const [gpsAtual, setGpsAtual] = useState(null);
  const [minutos, setMinutos] = useState(0);

  /* ---------------------------------------------------
   * 🔹 1) Decodifica a rota (FONTE DA VERDADE)
   * ------------------------------------------------- */
  const rotaCoords = useMemo(() => {
    const encoded = atendimento?.rota?.polyline;
    if (!encoded) return null;

    try {
      const decoded = decode(encoded);
      if (!Array.isArray(decoded?.polyline)) return null;

      return decoded.polyline
        .map(([lat, lng]) => ({ lat, lng }))
        .filter(
          (p) =>
            Number.isFinite(p.lat) &&
            Number.isFinite(p.lng)
        );
    } catch (err) {
      console.error("Erro ao decodificar polyline:", err);
      return null;
    }
  }, [atendimento?.rota?.polyline]);

  /* ---------------------------------------------------
   * 🔹 1.1) DESTINO REAL = último ponto da rota
   * ------------------------------------------------- */
  const destino = useMemo(() => {
    if (!rotaCoords || rotaCoords.length === 0) return null;
    return rotaCoords[rotaCoords.length - 1];
  }, [rotaCoords]);

  /* ---------------------------------------------------
   * 🔹 2) GPS do dispositivo (robusto / sem travar fluxo)
   * ------------------------------------------------- */
  useEffect(() => {
    let ativo = true;

    const tick = async () => {
      const pos = await getLocation({
        highAccuracy: true,
        useCache: false,
      });

      if (
        ativo &&
        pos &&
        Number.isFinite(pos.lat) &&
        Number.isFinite(pos.lng)
      ) {
        setGpsAtual(pos);
      }
    };

    tick();
    const id = setInterval(tick, 5000);

    return () => {
      ativo = false;
      clearInterval(id);
    };
  }, []);

  /* ---------------------------------------------------
   * 🔹 3) Cronômetro de deslocamento
   * ------------------------------------------------- */
  useEffect(() => {
    if (!atendimento?.deslocamentoInicio) return;

    const id = setInterval(() => {
      const inicio = new Date(
        atendimento.deslocamentoInicio
      ).getTime();

      setMinutos(
        Math.floor((Date.now() - inicio) / 60000)
      );
    }, 1000);

    return () => clearInterval(id);
  }, [atendimento?.deslocamentoInicio]);

  /* ---------------------------------------------------
   * 🔹 4) GPS VISUAL (snap apenas para UI)
   * ------------------------------------------------- */
  const gpsVisual = useMemo(() => {
    if (!gpsAtual) return null;
    if (!rotaCoords) return gpsAtual;
    return snapToRoute(gpsAtual, rotaCoords);
  }, [gpsAtual, rotaCoords]);

  /* ---------------------------------------------------
   * 🔹 5) DISTÂNCIA RESTANTE REAL (na rota)
   * ------------------------------------------------- */
  const distanciaRestante = useMemo(() => {
    if (!gpsAtual || !rotaCoords) return null;
    return distanciaRestanteNaRota(gpsAtual, rotaCoords);
  }, [gpsAtual, rotaCoords]);

  /* ---------------------------------------------------
   * 🔹 6) ETA simples (30 km/h)
   * ------------------------------------------------- */
  const etaMin = useMemo(() => {
    if (!distanciaRestante) return null;

    const velocidadeMediaMps = 30_000 / 3600;
    return Math.max(
      1,
      Math.round(distanciaRestante / velocidadeMediaMps / 60)
    );
  }, [distanciaRestante]);

  /* ---------------------------------------------------
   * 🔹 RENDER
   * ------------------------------------------------- */
  return (
    <motion.div
      key="s5"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
    >
      <Field style={{ marginTop: 12 }}>
        <Label>Deslocamento ativo</Label>

        <div style={{ color: "#9fb4c9", marginBottom: 6 }}>
          Iniciado em: {fmt(atendimento?.deslocamentoInicio)}
        </div>

        <Card style={{ marginBottom: 10 }}>
          🕒 Em deslocamento há <strong>{minutos} min</strong>
          <br />
          📍 Distância restante:{" "}
          <strong>
            {distanciaRestante != null
              ? (distanciaRestante / 1000).toFixed(2) + " km"
              : "—"}
          </strong>
          <br />
          ⏱️ ETA:{" "}
          <strong>
            {etaMin != null ? `${etaMin} min` : "—"}
          </strong>
        </Card>

        <div
          style={{
            height: 260,
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          {gpsVisual && destino ? (
            <MapContainer
              center={[gpsVisual.lat, gpsVisual.lng]}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              <FollowMap center={gpsVisual} />

              {/* Técnico */}
              <Marker position={[gpsVisual.lat, gpsVisual.lng]} />

              {/* 📍 DESTINO REAL */}
              <Marker position={[destino.lat, destino.lng]} />

              {/* Rota */}
              {rotaCoords && (
                <Polyline
                  positions={rotaCoords.map((p) => [
                    p.lat,
                    p.lng,
                  ])}
                  pathOptions={{
                    color: "#2563eb",
                    weight: 5,
                  }}
                />
              )}
            </MapContainer>
          ) : (
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#9fb4c9",
              }}
            >
              Obtendo localização…
            </div>
          )}
        </div>

        <BigBtn
          $primary
          style={{ marginTop: 12 }}
          onClick={iniciarAtendimento}
        >
          Iniciar atendimento <ChevronRight size={18} />
        </BigBtn>
      </Field>
    </motion.div>
  );
}
