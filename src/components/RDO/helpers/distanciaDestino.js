const ORS_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjQ4NGEzZDJkZTJlMzRmODVhYmRiYzRiMGFhNWQ1NjhhIiwiaCI6Im11cm11cjY0In0=";

// 🔥 Geocoder OFICIAL OpenRouteService (funciona no FRONTEND)
export async function geocodeEndereco(endereco) {
  if (!endereco) return null;

  const query = [
    endereco.rua || endereco.logradouro || "",
    endereco.numero || "",
    endereco.bairro || "",
    endereco.cidade || endereco.localidade || "",
    endereco.uf || "",
    "Brasil",
  ]
    .filter(Boolean)
    .join(", ");

  try {
    const resp = await fetch(
      `https://api.openrouteservice.org/geocode/search?api_key=${ORS_KEY}&text=${encodeURIComponent(
        query
      )}`
    );

    if (!resp.ok) {
      console.warn("Erro no geocoder ORS", resp.status);
      return null;
    }

    const json = await resp.json();

    if (!json.features || json.features.length === 0) {
      console.warn("Endereço não encontrado ORS:", query);
      return null;
    }

    const coords = json.features[0].geometry.coordinates; // [lng, lat]

    return {
      lat: coords[1],
      lng: coords[0],
    };
  } catch (err) {
    console.error("Erro geocodeEndereco ORS:", err);
    return null;
  }
}
