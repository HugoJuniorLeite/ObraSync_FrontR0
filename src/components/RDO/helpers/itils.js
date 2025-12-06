// src/components/RDO/helpers/timeline.js
// Monta a timeline da jornada.

export function montarTimeline(jornada = {}) {
  const events = [];

  if (jornada.inicioExpediente)
    events.push({
      time: jornada.inicioExpediente,
      label: "Expediente iniciado",
      type: "start",
    });

  (jornada.atendimentos || []).forEach((att, i) => {
    if (att?.deslocamentoInicio)
      events.push({
        time: att.deslocamentoInicio,
        label: `Deslocamento para OS ${att.ordemTipo || ""}-${att.ordemNumero || ""}`,
        type: "desloc",
      });

    if (att?.atendimentoInicio)
      events.push({
        time: att.atendimentoInicio,
        label: `Início atendimento ${i + 1}`,
        type: "startService",
      });

    if (att?.finalizadoEm)
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

  const almocos = jornada.almocos || (jornada.almoco ? [jornada.almoco] : []);
  almocos.forEach((a) => {
    if (a?.inicio)
      events.push({
        time: a.inicio,
        label: "🍽️ Início do almoço",
        type: "lunchStart",
      });
    if (a?.fim)
      events.push({
        time: a.fim,
        label: "🍽️ Fim do almoço",
        type: "lunchEnd",
      });
  });

  if (jornada.fimExpediente)
    events.push({
      time: jornada.fimExpediente,
      label: "Expediente finalizado",
      type: "end",
    });

  return events.sort((a, b) => new Date(a.time) - new Date(b.time));
}
