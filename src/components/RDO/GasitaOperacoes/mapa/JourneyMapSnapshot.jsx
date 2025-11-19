// JourneyMapSnapshot.jsx
// Gera um snapshot (dataURL) do mapa Leaflet para inserir no preview/PDF.
// Cole em: src/components/RDO/GasitaOperacoes/mapa/JourneyMapSnapshot.jsx

import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import leafletImage from "leaflet-image"; // npm i leaflet-image

// fallback icon fix for Vite bundling (optional)
try {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).href,
    iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
    shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).href,
  });
} catch (e) {
  // ignore in non-bundled contexts
}

/*
  Componente expõe via ref: getSnapshot({ width }) => Promise<string (dataURL)>
  Uso:
    const ref = useRef();
    await ref.current.getSnapshot({ width:800 });
*/

const JourneyMapSnapshot = forwardRef(({ jornada, baseCoords = { lat: -23.592226, lng: -46.612177 }, zoom = 12 }, ref) => {
  const mapRef = useRef(null);
  const [center, setCenter] = useState([baseCoords.lat, baseCoords.lng]);

  // build polyline points from jornada
  const points = [];
  (jornada?.atendimentos || []).forEach((a) => {
    if (a.gpsInicio?.lat && a.gpsInicio?.lng) points.push([Number(a.gpsInicio.lat), Number(a.gpsInicio.lng)]);
    if (a.gpsChegada?.lat && a.gpsChegada?.lng) points.push([Number(a.gpsChegada.lat), Number(a.gpsChegada.lng)]);
  });

  useEffect(() => {
    if (points.length > 0) setCenter(points[0]);
  }, [jornada]);

  // expose getSnapshot via ref
  useImperativeHandle(ref, () => ({
    getSnapshot: ({ width = 800, height = 450 } = {}) => {
      return new Promise((resolve, reject) => {
        const map = mapRef.current;
        if (!map) return resolve(null);

        // leaflet-image expects a leaflet map instance (not react ref)
        try {
          leafletImage(map, function (err, canvas) {
            if (err) return reject(err);
            // scale canvas to requested width while preserving aspect ratio
            const ratio = width / canvas.width;
            const targetCanvas = document.createElement("canvas");
            targetCanvas.width = width;
            targetCanvas.height = Math.round(canvas.height * ratio);
            const ctx = targetCanvas.getContext("2d");
            ctx.drawImage(canvas, 0, 0, targetCanvas.width, targetCanvas.height);
            const dataURL = targetCanvas.toDataURL("image/png");
            resolve(dataURL);
          });
        } catch (e) {
          // fallback: try to get leaflet map tile container as image (less reliable)
          console.error("leaflet-image failed", e);
          resolve(null);
        }
      });
    }
  }));

  return (
    // render a visible map but small; it will be captured by leaflet-image
    <div style={{ width: 800, height: 400 }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ width: "100%", height: "100%" }}
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
        attributionControl={false}
        zoomControl={true}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {points.length > 0 && <Polyline positions={points} color="#38bdf8" weight={4} />}
        {points.map((p, i) => <Marker key={i} position={p} />)}
        {/* base marker */}
        <Marker position={[baseCoords.lat, baseCoords.lng]} />
      </MapContainer>
    </div>
  );
});

export default JourneyMapSnapshot;
