// src/components/RDO/steps/Step5_DeslocamentoAtivo.jsx

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import { decode } from "@here/flexpolyline";
import { getLocation } from "../../helpers/location";
import { snapToRoute } from "../../helpers/snapToRoute";
import { calcularETA } from "../../helpers/eta";

// import { snapToRoute } from "../../helpers/snapToRoute";
// import { calcularETA } from "../../helpers/eta";

// 🔁 Centraliza mapa conforme deslocamento
// 🔁 Centraliza o mapa seguindo o técnico (SAFE)
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

export default function Step5_DeslocamentoAtivo({
  Field,
  Label,
  Card,
  BigBtn,
  current,
  fmt,
  iniciarAtendimento,
}) {
  const [gpsAtual, setGpsAtual] = useState(null);
  const [minutos, setMinutos] = useState(0);

  const destino = current?.endereco;
  console.log(destino, "destino")

  // 🔹 Decodifica polyline HERE (BLINDADO)
  const rotaCoords = useMemo(() => {
    const encoded = current?.rota?.polyline;
    if (!encoded) return null;

    try {
      const decoded = decode(encoded);

      // ✅ FORMATO REAL QUE SEU LOG MOSTROU
      if (!Array.isArray(decoded?.polyline)) {
        console.warn("Formato inesperado de polyline:", decoded);
        return null;
      }

      return decoded.polyline
        .map(([lat, lng]) => ({
          lat,
          lng,
        }))
        .filter(
          (p) =>
            Number.isFinite(p.lat) &&
            Number.isFinite(p.lng)
        );
    } catch (e) {
      console.error("Erro ao decodificar polyline HERE:", e);
      return null;
    }
  }, [current?.rota?.polyline]);




  console.log("rotaCoords:", rotaCoords);


  // 🔹 GPS do dispositivo (ZERO API)
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
      console.log(tick, "tick")
    };

    tick();
    const id = setInterval(tick, 5000);

    return () => {
      ativo = false;
      clearInterval(id);
    };
  }, []);

  // 🔹 Cronômetro de deslocamento
  useEffect(() => {
    if (!current?.deslocamentoInicio) return;

    const id = setInterval(() => {
      const ini = new Date(current.deslocamentoInicio).getTime();
      setMinutos(Math.floor((Date.now() - ini) / 60000));
    }, 1000);

    return () => clearInterval(id);
  }, [current?.deslocamentoInicio]);

  // 🔹 GPS visual (snap na rota – VISUAL ONLY)
  const gpsVisual = useMemo(() => {
    if (!gpsAtual) return null;
    if (!rotaCoords) return gpsAtual;
    return snapToRoute(gpsAtual, rotaCoords);
  }, [gpsAtual, rotaCoords]);

  // 🔹 ETA dinâmico (ZERO API)
  const eta = useMemo(() => {
    if (
      !gpsVisual ||
      !Number.isFinite(destino?.lat) ||
      !Number.isFinite(destino?.lng)
    )
      return null;

    return calcularETA(gpsVisual, destino);
  }, [gpsVisual, destino]);

  return (
    <motion.div
      key="s5"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
    >
      <Field style={{ marginTop: 12 }}>
        <Label>Deslocamento ativo</Label>

        <div style={{ color: "#9fb4c9", marginBottom: 6 }}>
          Iniciado em: {fmt(current.deslocamentoInicio)}
        </div>

        <Card style={{ marginBottom: 10 }}>
          🕒 Em deslocamento há <strong>{minutos} min</strong>
          <br />
          📍 Distância restante:{" "}
          <strong>
            {eta ? (eta.distancia / 1000).toFixed(2) + " km" : "—"}
          </strong>
          <br />
          ⏱️ ETA: <strong>{eta ? `${eta.minutos} min` : "—"}</strong>
        </Card>

        <div style={{ height: 260, borderRadius: 12, overflow: "hidden" }}>
          {gpsVisual ? (
            <MapContainer
              center={[gpsVisual.lat, gpsVisual.lng]}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              <FollowMap center={gpsVisual} />

              {/* Técnico */}
              <Marker position={[gpsVisual.lat, gpsVisual.lng]} />

              {/* Destino */}
              {Number.isFinite(destino?.lat) &&
                Number.isFinite(destino?.lng) && (
                  <Marker position={[destino.lat, destino.lng]} />
                )}

              {/* Rota HERE */}
              {rotaCoords && (
                <Polyline
                  positions={rotaCoords.map((p) => [p.lat, p.lng])}
                  pathOptions={{ color: "#2563eb", weight: 5 }}
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