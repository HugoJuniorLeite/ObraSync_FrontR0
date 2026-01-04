export async function geocodeNominatim({ rua, numero, bairro, cidade, uf }) {
  const query = [
    rua,
    numero,
    bairro,
    cidade,
    uf,
    "Brasil",
  ]
    .filter(Boolean)
    .join(", ");

  const url =
    "https://nominatim.openstreetmap.org/search?" +
    new URLSearchParams({
      format: "json",
      q: query,
      countrycodes: "br",
      limit: 1,
    });

  const resp = await fetch(url, {
    headers: {
      // 🔥 OBRIGATÓRIO
      "User-Agent": "ObraSync/1.0 (contato@obrasync.com)",
    },
  });

  if (!resp.ok) return null;

  const json = await resp.json();
  if (!json.length) return null;

  return {
    lat: Number(json[0].lat),
    lng: Number(json[0].lon),
  };
}
