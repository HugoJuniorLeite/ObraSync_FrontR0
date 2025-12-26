export const normalizeJornada = (jornada) => ({
  inicioExpediente: jornada?.inicioExpediente ?? null,
  fimExpediente: jornada?.fimExpediente ?? null,

  atendimentos: Array.isArray(jornada?.atendimentos)
    ? jornada.atendimentos
    : [],

  baseLogs: Array.isArray(jornada?.baseLogs)
    ? jornada.baseLogs
    : [],

  almocos: Array.isArray(jornada?.almocos)
    ? jornada.almocos
    : [],
});
