// src/components/RDO/helpers/metrics.js
// Cálculos da jornada: tempos, ociosidade, produtividade.

import { calcDurationMs } from "./time";

export function calcularTotais(jornada = {}) {
  let atendimentoMs = 0;
  let deslocamentoMs = 0;
  let almocoMs = 0;

  (jornada.atendimentos || []).forEach((att) => {
    atendimentoMs += calcDurationMs(att?.atendimentoInicio, att?.finalizadoEm);
    deslocamentoMs += calcDurationMs(
      att?.deslocamentoInicio,
      att?.atendimentoInicio
    );
  });

  const logs = jornada.baseLogs || [];
  for (let i = 0; i < logs.length; i += 2) {
    const ini = logs[i];
    const fim = logs[i + 1];
    if (
      ini?.tipo === "deslocamentoParaBase" &&
      fim?.tipo === "chegadaBase"
    ) {
      deslocamentoMs += calcDurationMs(ini.time, fim.time);
    }
  }

  const almocos = jornada.almocos || (jornada.almoco ? [jornada.almoco] : []);
  if (almocos.length > 0) {
    const ultimo = almocos[almocos.length - 1];
    if (ultimo?.inicio && ultimo?.fim) {
      almocoMs = calcDurationMs(ultimo.inicio, ultimo.fim);
    }
  }

  return { atendimentoMs, deslocamentoMs, almocoMs };
}

export function calcularJornadaTotal(jornada = {}) {
  if (!jornada.inicioExpediente || !jornada.fimExpediente) return 0;
  return calcDurationMs(jornada.inicioExpediente, jornada.fimExpediente);
}

export function calcularOciosidade(jornada = {}) {
  const total = calcularJornadaTotal(jornada);
  const { atendimentoMs, deslocamentoMs, almocoMs } = calcularTotais(jornada);
  return Math.max(0, total - (atendimentoMs + deslocamentoMs + almocoMs));
}

export function calcularProdutividade(jornada = {}) {
  const total = calcularJornadaTotal(jornada);
  const { atendimentoMs } = calcularTotais(jornada);
  if (!total || total <= 0) return 0;
  return Math.round((atendimentoMs / total) * 100);
}
