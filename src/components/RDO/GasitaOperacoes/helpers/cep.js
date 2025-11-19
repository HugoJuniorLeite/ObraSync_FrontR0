// src/components/RDO/GasitaOperacoes/helpers/cep.js
export const buscarCep = async (cep) => {
  const c = (cep||'').toString().replace(/\D/g,'');
  if (c.length !== 8) return null;
  try {
    const res = await fetch(`https://viacep.com.br/ws/${c}/json/`);
    const j = await res.json();
    if (j.erro) return null;
    return { rua: j.logradouro, bairro: j.bairro, cidade: j.localidade, estado: j.uf, cep: c };
  } catch (e) { return null; }
};