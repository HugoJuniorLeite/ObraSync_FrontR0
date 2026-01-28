// const ORS_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6Ijg1YmVhZGZmNmVkMTNiMDJjZjUwZjBhYWJjMGY0MTAyYjVmMzllMjliYjRiN2UxZTE5YjRkNWIxIiwiaCI6Im11cm11cjY0In0=";

// 🔥 Geocoder OFICIAL OpenRouteService (funciona no FRONTEND)
// export async function geocodeEndereco(endereco) {
//   if (!endereco) return null;

//   const query = [
//     endereco.rua || endereco.logradouro || "",
//     endereco.numero || "",
//     endereco.bairro || "",
//     endereco.cidade || endereco.localidade || "",
//     endereco.uf || "",
//     "Brasil",
//   ]
//     .filter(Boolean)
//     .join(", ");

//   try {
//     const resp = await fetch(
//       `https://api.openrouteservice.org/geocode/search?api_key=${ORS_KEY}&text=${encodeURIComponent(
//         query
//       )}`
//     );

//     if (!resp.ok) {
//       console.warn("Erro no geocoder ORS", resp.status);
//       return null;
//     }

//     const json = await resp.json();

//     if (!json.features || json.features.length === 0) {
//       console.warn("Endereço não encontrado ORS:", query);
//       return null;
//     }

//     const coords = json.features[0].geometry.coordinates; // [lng, lat]

//     return {
//       lat: coords[1],
//       lng: coords[0],
//     };
//   } catch (err) {
//     console.error("Erro geocodeEndereco ORS:", err);
//     return null;
//   }
// }


// helpers/calcularDestino.js

const HERE_KEY = "IGTISK_vgyRrHgYMnfGgZeAFGG8xPwoDfJOb_hYt70A";

export async function geocodeEndereco(endereco) {
  if (!endereco?.rua || !endereco?.cidade) return null;

  const query = [
    endereco.rua,
    endereco.numero,
    endereco.bairro,
    endereco.cidade,
    endereco.estado || "SP",
    "Brasil",
  ]
    .filter(Boolean)
    .join(", ");

  try {
    const resp = await fetch(
      `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(
        query
      )}&apiKey=${HERE_KEY}`
    );

    if (!resp.ok) return null;

    const json = await resp.json();
    const item = json.items?.[0];
    if (!item) return null;

    return {
      lat: item.position.lat,
      lng: item.position.lng,
      label: item.address.label,
    };
  } catch (e) {
    console.error("Erro geocodeEndereco HERE:", e);
    return null;
  }
}