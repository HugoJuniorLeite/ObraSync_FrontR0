// src/components/RDO/helpers/metrics.js
// Cálculos da jornada: tempos, ociosidade, produtividade.

import { calcDurationMs } from "./time";
import { normalizeJornada } from "./normalizeJornada";

export function calcularTotais(jornada) {
  const { atendimentos, baseLogs, almocos } = normalizeJornada(jornada);

  let atendimentoMs = 0;
  let deslocamentoMs = 0;

  atendimentos.forEach((att) => {
    atendimentoMs += calcDurationMs(
      att?.atendimentoInicio,
      att?.finalizadoEm
    );
    deslocamentoMs += calcDurationMs(
      att?.deslocamentoInicio,
      att?.atendimentoInicio
    );
  });

  for (let i = 0; i < baseLogs.length; i += 2) {
    const ini = baseLogs[i];
    const fim = baseLogs[i + 1];

    if (
      ini?.tipo === "deslocamentoParaBase" &&
      fim?.tipo === "chegadaBase"
    ) {
      deslocamentoMs += calcDurationMs(ini.time, fim.time);
    }
  }

  const almocoMs = almocos.reduce(
    (total, a) => total + calcDurationMs(a?.inicio, a?.fim),
    0
  );

  return { atendimentoMs, deslocamentoMs, almocoMs };
}

export function calcularJornadaTotal(jornada) {
  const { inicioExpediente, fimExpediente } = normalizeJornada(jornada);
  return calcDurationMs(inicioExpediente, fimExpediente);
}

export function calcularOciosidade(jornada) {
  const total = calcularJornadaTotal(jornada);
  const { atendimentoMs, deslocamentoMs, almocoMs } =
    calcularTotais(jornada);

  return Math.max(0, total - (atendimentoMs + deslocamentoMs + almocoMs));
}

export function calcularProdutividade(jornada) {
  const total = calcularJornadaTotal(jornada);
  const { atendimentoMs } = calcularTotais(jornada);
  if (!total || total <= 0) return 0;
  return Math.round((atendimentoMs / total) * 100);
}
