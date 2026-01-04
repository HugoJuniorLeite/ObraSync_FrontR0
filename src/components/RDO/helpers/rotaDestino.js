// src/components/RDO/helpers/rotaDestino.js

import { geocodeEndereco } from "./distanciaDestino";

// import { geocodeEndereco } from "./geocode";

// import { geocodeEndereco } from "./distanciaDestino";



// const ORS_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6Ijg1YmVhZGZmNmVkMTNiMDJjZjUwZjBhYWJjMGY0MTAyYjVmMzllMjliYjRiN2UxZTE5YjRkNWIxIiwiaCI6Im11cm11cjY0In0="; // 🔥 100% gratuito em https://openrouteservice.org/

// export async function calcularRotaEndereco(endereco) {
//   try {
//     // 1) Coordenada atual
//     const pos = await new Promise((resolve) => {
//       navigator.geolocation.getCurrentPosition(
//         (p) =>
//           resolve({
//             lat: p.coords.latitude,
//             lng: p.coords.longitude,
//           }),
//         () => resolve(null),
//         { enableHighAccuracy: true }
//       );
//     });

//     if (!pos) return null;

//     // 2) Coordenada destino via geocoding
//     const destino = await geocodeEndereco(endereco);
//     console.log(destino,"endereço destino")
//     console.log(endereco,"recebido por props")
//     if (!destino) return null;

//     // 3) Chamar API de rotas
//     const body = {
//       coordinates: [
//         [pos.lng, pos.lat],
//         [destino.lng, destino.lat],
//       ],
//     };

//     const resp = await fetch(
//       "https://api.openrouteservice.org/v2/directions/driving-car",
//       {
//         method: "POST",
//         headers: {
//           Authorization: ORS_KEY,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(body),
//       }
//     );

//     if (!resp.ok) return null;

//     const json = await resp.json();

//     const route = json.routes?.[0];
//     if (!route) return null;

//  return {
//   distancia: route.summary.distance,
//   duracao: route.summary.duration,
//   geometry: route.geometry,
//   destino: { lat: destino.lat, lng: destino.lng }
// };

//   } catch (e) {
//     console.error("Erro calcularRotaEndereco:", e);
//     return null;
//   }
// }


// helpers/rotaDestino.js

// import { geocodeEndereco } from "./calcularDestino";

const HERE_KEY = "IGTISK_vgyRrHgYMnfGgZeAFGG8xPwoDfJOb_hYt70A"

export async function calcularRotaEndereco(endereco) {
  try {
    // 🔹 1) GPS ATUAL (precisa ser user gesture)
    const origem = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (p) =>
          resolve({
            lat: p.coords.latitude,
            lng: p.coords.longitude,
          }),
        reject,
        { enableHighAccuracy: true }
      );
    });

    // 🔹 2) DESTINO 
    const destino = await geocodeEndereco(endereco);
    if (!destino) return null;

    // 🔹 3) ROTEAMENTO HERE
    const params = new URLSearchParams({
      transportMode: "car",
      origin: `${origem.lat},${origem.lng}`,
      destination: `${destino.lat},${destino.lng}`,
      return: "summary,polyline",
      apiKey: HERE_KEY,
    });

    const resp = await fetch(
      `https://router.hereapi.com/v8/routes?${params}`
    );

    if (!resp.ok) return null;

    const json = await resp.json();
    const section = json.routes?.[0]?.sections?.[0];
    if (!section) return null;

    return {
      distancia: section.summary.length,   // metros
      duracao: section.summary.duration,   // segundos
      polyline: section.polyline,
      destino,
    };
  } catch (e) {
    console.error("Erro calcularRotaEndereco HERE:", e);
    return null;
  }
}
