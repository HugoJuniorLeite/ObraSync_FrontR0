// src/components/RDO/GasitaOperacoes/mapa/JourneyMap.jsx
import React from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card } from "../styles/layout";
import { BASE_COORDS as DEFAULT_BASE } from "./constants"; // optional: if you create constants
// If you didn't create constants, we'll fallback below

// custom colored icons
const iconFor = (colorUrl) => new L.Icon({
  iconUrl: colorUrl,
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  iconSize: [28, 41],
  iconAnchor: [14, 41]
});

const ICONS = {
  start: iconFor("https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png"),
  end: iconFor("https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png"),
  lunch: iconFor("https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png"),
  base: iconFor("https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png")
};

// fallback base coords (Bom Pastor 975 - Ipiranga) — ajuste se necessário
const BASE = { lat: -23.592226, lng: -46.612177 };

export default function JourneyMap({ jornada, highlightAtendimento = null }) {
  if (!jornada) return <Card>Nenhuma jornada selecionada</Card>;

  // build ordered path: interleave gpsInicio/gpsChegada, baseLogs, and lunch if present
  const path = [];

  (jornada.atendimentos || []).forEach(att => {
    if (att.gpsInicio?.lat) path.push([Number(att.gpsInicio.lat), Number(att.gpsInicio.lng)]);
    if (att.gpsChegada?.lat) path.push([Number(att.gpsChegada.lat), Number(att.gpsChegada.lng)]);
  });

  // include base logs
  (jornada.baseLogs || []).forEach(l => {
    if (l.gps?.lat) path.push([Number(l.gps.lat), Number(l.gps.lng)]);
  });

  // include lunch coords if present
  if (jornada.almoco?.latInicio) path.push([Number(jornada.almoco.latInicio), Number(jornada.almoco.lngInicio)]);
  if (jornada.almoco?.latFim) path.push([Number(jornada.almoco.latFim), Number(jornada.almoco.lngFim)]);

  const center = path.length ? path[0] : [BASE.lat, BASE.lng];

  return (
    <Card>
      <div style={{ height: 380, width: "100%" }}>
        <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {path.length > 1 && (
            <Polyline positions={path} color="#f97316" weight={5} opacity={0.95} />
          )}

          {/* markers for attendimentos */}
          {jornada.atendimentos?.map((att, i) => (
            <React.Fragment key={`m-${i}`}>
              {att.gpsInicio?.lat && (
                <Marker position={[att.gpsInicio.lat, att.gpsInicio.lng]} icon={ICONS.start}>
                  <Popup>
                    <strong>Início atendimento #{i + 1}</strong><br />
                    {att.tipo === "interno" ? `OS ${att.ordemPrefixo}-${att.ordemNumero}` : `OS ${att.ordemTipo}-${att.ordemNumero}`}<br />
                    {att.atendimentoInicio ? new Date(att.atendimentoInicio).toLocaleString("pt-BR") : "—"}
                  </Popup>
                </Marker>
              )}
              {att.gpsChegada?.lat && (
                <Marker position={[att.gpsChegada.lat, att.gpsChegada.lng]} icon={ICONS.end}>
                  <Popup>
                    <strong>Fim atendimento #{i + 1}</strong><br />
                    {att.finalizadoEm ? new Date(att.finalizadoEm).toLocaleString("pt-BR") : "—"}
                  </Popup>
                </Marker>
              )}
            </React.Fragment>
          ))}

          {/* almoço markers */}
          {jornada.almoco?.latInicio && (
            <Marker position={[jornada.almoco.latInicio, jornada.almoco.lngInicio]} icon={ICONS.lunch}>
              <Popup>Início do almoço — {jornada.almoco.inicio}</Popup>
            </Marker>
          )}
          {jornada.almoco?.latFim && (
            <Marker position={[jornada.almoco.latFim, jornada.almoco.lngFim]} icon={ICONS.lunch}>
              <Popup>Fim do almoço — {jornada.almoco.fim}</Popup>
            </Marker>
          )}

          {/* base marker */}
          <Marker position={[BASE.lat, BASE.lng]} icon={ICONS.base}>
            <Popup>Base — Bom Pastor, 975</Popup>
          </Marker>
        </MapContainer>
      </div>
    </Card>
  );
}
