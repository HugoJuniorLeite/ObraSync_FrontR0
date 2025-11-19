// src/components/RDO/GasitaOperacoes/export/exportExcel.js
import * as XLSX from "xlsx";

/**
 * exportJornadaToExcel(jornada)
 * Cada atendimento vira uma linha do Excel.
 */

export function exportJornadaToExcel(jornada) {
  if (!jornada || !jornada.atendimentos) return;

  const rows = jornada.atendimentos.map((a, idx) => ({
    ID: a.id,
    Ordem: a.tipo === "interno"
      ? `${a.ordemPrefixo}-${a.ordemNumero}`
      : `${a.ordemTipo}-${a.ordemNumero}`,
    Tipo: a.tipo,
    Rua: a.endereco.rua,
    Numero: a.endereco.numero,
    Bairro: a.endereco.bairro,
    Cidade: a.endereco.cidade,
    Estado: a.endereco.estado,
    CEP: a.endereco.cep,
    Deslocamento_Inicio: a.deslocamentoInicio,
    Atendimento_Inicio: a.atendimentoInicio,
    Atendimento_Fim: a.finalizadoEm,
    Latitude_Inicio: a.gpsInicio?.lat,
    Longitude_Inicio: a.gpsInicio?.lng,
    Latitude_Fim: a.gpsChegada?.lat,
    Longitude_Fim: a.gpsChegada?.lng,
    Fotos: a.fotos?.length || 0
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Atendimentos");

  XLSX.writeFile(wb, `RDO-${jornada.date}.xlsx`);
}
