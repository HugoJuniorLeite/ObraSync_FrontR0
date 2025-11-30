import { calcDurationMs, fmt } from "./time";
import { haversine, BASE_COORDS } from "./distance";

export const calcularDistanciaTotal = (jornada) => {
  const points = [];

  jornada.atendimentos.forEach((att) => {
    if (att.gpsInicio?.lat) points.push(att.gpsInicio);
    if (att.gpsChegada?.lat) points.push(att.gpsChegada);
  });

  (jornada.baseLogs || []).forEach((log) => {
    if (log.gps?.lat) points.push(log.gps);
  });

  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += haversine(points[i - 1], points[i]);
  }

  return Math.round(total);
};

export const calcularTotais = (jornada) => {
  let atendimentoMs = 0;
  let deslocamentoMs = 0;

  jornada.atendimentos.forEach((att) => {
    atendimentoMs += calcDurationMs(
      att.atendimentoInicio,
      att.finalizadoEm
    );
    deslocamentoMs += calcDurationMs(
      att.deslocamentoInicio,
      att.atendimentoInicio
    );
  });

  for (let i = 0; i < jornada.baseLogs.length; i += 2) {
    const ini = jornada.baseLogs[i];
    const fim = jornada.baseLogs[i + 1];
    if (
      ini &&
      fim &&
      ini.tipo === "deslocamentoParaBase" &&
      fim.tipo === "chegadaBase"
    ) {
      deslocamentoMs += calcDurationMs(ini.time, fim.time);
    }
  }

  const almocoMs = calcDurationMs(
    jornada.almoco?.inicio,
    jornada.almoco?.fim
  );

  return { atendimentoMs, deslocamentoMs, almocoMs };
};

export const calcularJornadaTotal = (jornada) =>
  calcDurationMs(jornada.inicioExpediente, jornada.fimExpediente);

export const calcularOciosidade = (jornada) => {
  const total = calcularJornadaTotal(jornada);
  const { atendimentoMs, deslocamentoMs, almocoMs } =
    calcularTotais(jornada);
  return total - (atendimentoMs + deslocamentoMs + almocoMs);
};

export const calcularProdutividade = (jornada) => {
  const total = calcularJornadaTotal(jornada);
  const { atendimentoMs } = calcularTotais(jornada);
  if (total <= 0) return 0;
  return Math.round((atendimentoMs / total) * 100);
};

export const montarTimeline = (jornada) => {
  const events = [];

  if (jornada.inicioExpediente)
    events.push({
      time: jornada.inicioExpediente,
      label: "Expediente iniciado",
      type: "start",
    });

  jornada.atendimentos.forEach((att, i) => {
    if (att.deslocamentoInicio)
      events.push({
        time: att.deslocamentoInicio,
        label: `Deslocamento para OS ${att.ordemTipo || ""}-${att.ordemNumero || ""}`,
        type: "desloc",
      });

    if (att.atendimentoInicio)
      events.push({
        time: att.atendimentoInicio,
        label: `Início atendimento ${i + 1}`,
        type: "startService",
      });

    if (att.finalizadoEm)
      events.push({
        time: att.finalizadoEm,
        label: `Atendimento concluído ${i + 1}`,
        type: "endService",
      });
  });

  (jornada.baseLogs || []).forEach((log) => {
    if (log.tipo === "deslocamentoParaBase")
      events.push({
        time: log.time,
        label: "Deslocamento para base",
        type: "retBaseStart",
      });

    if (log.tipo === "chegadaBase")
      events.push({
        time: log.time,
        label: "Chegada à base",
        type: "retBaseEnd",
      });
  });

  if (jornada.almoco?.inicio)
    events.push({
      time: jornada.almoco.inicio,
      label: `🍽️ Almoço — início às ${fmt(jornada.almoco.inicio)}`,
      type: "lunchStart",
    });

  if (jornada.almoco?.fim)
    events.push({
      time: jornada.almoco.fim,
      label: `🍽️ Almoço — término às ${fmt(jornada.almoco.fim)}`,
      type: "lunchEnd",
    });

  if (jornada.fimExpediente)
    events.push({
      time: jornada.fimExpediente,
      label: "Expediente finalizado",
      type: "end",
    });

  return events.sort((a, b) => new Date(a.time) - new Date(b.time));
};

