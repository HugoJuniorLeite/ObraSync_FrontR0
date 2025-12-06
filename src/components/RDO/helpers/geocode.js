
export async function geocodeEndereco(endereco) {
  try {
    if (!endereco) return null;

    const query = `${endereco.rua || ""} ${endereco.numero || ""}, 
                   ${endereco.bairro || ""}, 
                   ${endereco.cidade || ""}, 
                   ${endereco.uf || "SP"}`;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}`;

    const resp = await fetch(url, {
      headers: {
        "User-Agent": "ObraSync/1.0", // obrigatório
      },
    });

    const json = await resp.json();

    if (!json || json.length === 0) {
      console.warn("⚠️ Nominatim não encontrou o endereço:", query);
      return null;
    }

    return {
      lat: parseFloat(json[0].lat),
      lng: parseFloat(json[0].lon),
    };
  } catch (err) {
    console.error("❌ Erro geocodeEndereco:", err);
    return null;
  }
}
