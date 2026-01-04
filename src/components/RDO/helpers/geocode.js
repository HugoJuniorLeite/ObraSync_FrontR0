import { geocodeNominatim } from "./geocodeNominatim";

// 🔥 PRIORIDADE: CEP > ENDEREÇO
export async function geocodeEndereco(endereco) {
  try {
    if (!endereco) return null;

    // 🔹 1️⃣ Normalização
    const rua = endereco.rua || endereco.logradouro || "";
    const numero = endereco.numero || "";
    const bairro = endereco.bairro || "";
    const cidade = endereco.cidade || endereco.localidade || "";
    const uf = endereco.uf || endereco.estado || "SP";
    const cep = endereco.cep?.replace(/\D/g, "");

    // 🔹 2️⃣ Se tiver CEP → ViaCEP primeiro (mais preciso)
    if (cep && cep.length === 8) {
      const viaCepResp = await fetch(
        `https://viacep.com.br/ws/${cep}/json/`
      );
      const viaCep = await viaCepResp.json();

      if (!viaCep.erro) {
        return await geocodeNominatim({
          rua: viaCep.logradouro,
          numero,
          bairro: viaCep.bairro,
          cidade: viaCep.localidade,
          uf: viaCep.uf,
        });
      }
    }

    // 🔹 3️⃣ Fallback → endereço manual
    if (!rua && !cidade) return null;

    return await geocodeNominatim({
      rua,
      numero,
      bairro,
      cidade,
      uf,
    });
  } catch (e) {
    console.error("Erro geocodeEndereco:", e);
    return null;
  }
}
