import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import polyline from "@mapbox/polyline";


export default function Step5_DeslocamentoAtivo({
  Field,
  Label,
  Card,
  BigBtn,
  current,
  fmt,
  iniciarAtendimento,
  next,
}) {
  const [minutos, setMinutos] = useState(0);
  const [gpsAtual, setGpsAtual] = useState(null);

  const destinoCoords = {
    lat: current.endereco?.lat || null,
    lng: current.endereco?.lng || null,
  };

  // 🔥 Decodifica a polyline da rota real
  const rotaCoords = current.rota?.geometry
    ? polyline.decode(current.rota.geometry).map(([lat, lng]) => ({
        lat,
        lng,
      }))
    : null;

  // Cronômetro
  useEffect(() => {
    if (!current?.deslocamentoInicio) return;

    const timer = setInterval(() => {
      const inicio = new Date(current.deslocamentoInicio).getTime();
      setMinutos(Math.floor((Date.now() - inicio) / 60000));
    }, 1000);

    return () => clearInterval(timer);
  }, [current]);

  // GPS atual
  useEffect(() => {
    const watch = navigator.geolocation.watchPosition(
      (pos) => {
        setGpsAtual({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {},
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watch);
  }, []);

  return (
    <motion.div key="s5" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
      {!current.pausadoParaAlmoco && (
        <Field style={{ marginTop: 12 }}>
          <Label>Deslocamento ativo</Label>

          <div style={{ color: "#9fb4c9", marginBottom: 8 }}>
            Deslocamento iniciado em: {fmt(current.deslocamentoInicio)}
          </div>

          <Card
            style={{
              background: "#2563eb",
              color: "white",
              padding: "8px 12px",
              borderRadius: 6,
              marginBottom: 12,
              fontWeight: 600,
            }}
          >
            🕒 Deslocando há {minutos} min
          </Card>

          {/* 🗺️ MAPA */}
          <div style={{ height: 260, position: "relative", borderRadius: 12, overflow: "hidden" }}>
            {gpsAtual ? (
              <>
                <MapContainer
                  center={[gpsAtual.lat, gpsAtual.lng]}
                  zoom={15}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                  {/* Técnico */}
                  <Marker position={[gpsAtual.lat, gpsAtual.lng]} />

                  {/* Destino */}
                  {destinoCoords.lat && destinoCoords.lng && (
                    <Marker position={[destinoCoords.lat, destinoCoords.lng]} />
                  )}

                  {/* 🔥 Rota REAL desenhada (ruas!) */}
                  {rotaCoords && (
                    <Polyline
                      positions={rotaCoords.map((p) => [p.lat, p.lng])}
                      pathOptions={{ color: "blue", weight: 5 }}
                    />
                  )}

                </MapContainer>

              </>
            ) : (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#9fb4c9",
                }}
              >
                Obtendo localização…
              </div>
            )}
          </div>

          <BigBtn
            $primary
            onClick={iniciarAtendimento}
          >
            Iniciar atendimento <ChevronRight size={18} />
          </BigBtn>
        </Field>
      )}
    </motion.div>
  );
}
