// src/components/RDO/helpers/rotaDestino.js

import { geocodeEndereco } from "./distanciaDestino";

const ORS_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjQ4NGEzZDJkZTJlMzRmODVhYmRiYzRiMGFhNWQ1NjhhIiwiaCI6Im11cm11cjY0In0="; // 🔥 100% gratuito em https://openrouteservice.org/

export async function calcularRotaEndereco(endereco) {
  try {
    // 1) Coordenada atual
    const pos = await new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (p) =>
          resolve({
            lat: p.coords.latitude,
            lng: p.coords.longitude,
          }),
        () => resolve(null),
        { enableHighAccuracy: true }
      );
    });

    if (!pos) return null;

    // 2) Coordenada destino via geocoding
    const destino = await geocodeEndereco(endereco);
    console.log(destino,"endereço destino")
    console.log(endereco,"recebido por props")
    if (!destino) return null;

    // 3) Chamar API de rotas
    const body = {
      coordinates: [
        [pos.lng, pos.lat],
        [destino.lng, destino.lat],
      ],
    };

    const resp = await fetch(
      "https://api.openrouteservice.org/v2/directions/driving-car",
      {
        method: "POST",
        headers: {
          Authorization: ORS_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!resp.ok) return null;

    const json = await resp.json();

    const route = json.routes?.[0];
    if (!route) return null;

    return {
      distancia: route.summary.distance, // metros
      duracao: route.summary.duration,   // segundos
      geometry: route.geometry,          // polyline para mapa
    };
  } catch (e) {
    console.error("Erro calcularRotaEndereco:", e);
    return null;
  }
}
