// src/utils/attendanceWizardUtils.js

// Data/hora básica
export const nowISO = () => new Date().toISOString();

export const fmt = (d) =>
  d ? new Date(d).toLocaleString("pt-BR") : "—";

// Duração entre duas datas em ms
export const calcDuration = (a, b) => {
  if (!a || !b) return 0;
  try {
    return new Date(b) - new Date(a);
  } catch {
    return 0;
  }
};

// Converte ms em string "Xh Ymin"
export const msToHuman = (ms) => {
  if (!ms || ms <= 0) return "0 min";
  const totalMin = Math.floor(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h > 0 ? `${h}h ${m}min` : `${m}min`;
};

// Duração genérica para exibir
export const formatDuracao = (ms) => {
  if (!ms || ms < 1) return "—";
  const m = Math.floor(ms / 60000);
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return h > 0 ? `${h}h ${mm}min` : `${mm} min`;
};

// Tempo total de almoço (aceita almocos[])
export const calcularDuracaoAlmocoTotal = (almocos = []) => {
  return almocos.reduce((tot, al) => {
    if (al.inicio && al.fim) {
      tot += new Date(al.fim) - new Date(al.inicio);
    }
    return tot;
  }, 0);
};

/**
 * Calcula tempos de atendimento / deslocamento para a jornada atual
 * jornada: { atendimentos[], baseLogs[] }
 */
export const calcularTotais = (jornada) => {
  if (!jornada) return { atendimentoMs: 0, deslocamentoMs: 0 };

  let atendimentoMs = 0;
  let deslocamentoMs = 0;

  (jornada.atendimentos || []).forEach((a, i) => {
    atendimentoMs += calcDuration(a.atendimentoInicio, a.finalizadoEm);
    deslocamentoMs += calcDuration(a.deslocamentoInicio, a.atendimentoInicio);

    const next = jornada.atendimentos[i + 1];
    if (next && a.finalizadoEm && next.deslocamentoInicio) {
      deslocamentoMs += calcDuration(a.finalizadoEm, next.deslocamentoInicio);
    }
  });

  const logs = jornada.baseLogs || [];
  for (let i = 0; i < logs.length; i += 2) {
    const ini = logs[i];
    const fim = logs[i + 1];
    if (
      ini &&
      fim &&
      ini.tipo === "deslocamentoParaBase" &&
      fim.tipo === "chegadaBase"
    ) {
      deslocamentoMs += calcDuration(ini.time, fim.time);
    }
  }

  return { atendimentoMs, deslocamentoMs };
};

// Jornada total em ms
export const calcularJornadaTotal = (jornada) =>
  jornada ? calcDuration(jornada.inicioExpediente, jornada.fimExpediente) : 0;

// Ociosidade (ms)
export const calcularOciosidade = (jornada) => {
  if (!jornada) return 0;
  const total = calcularJornadaTotal(jornada);
  const { atendimentoMs, deslocamentoMs } = calcularTotais(jornada);
  const almocoMs = calcularDuracaoAlmocoTotal(jornada.almocos || []);
  const usado = atendimentoMs + deslocamentoMs + almocoMs;
  return total - usado;
};

// Produtividade em %
export const calcularProdutividade = (jornada) => {
  const total = calcularJornadaTotal(jornada);
  if (total <= 0) return 0;
  const { atendimentoMs } = calcularTotais(jornada);
  return Math.round((atendimentoMs / total) * 100);
};

/**
 * Versões "De" (para histórico / jornadas arbitrárias)
 */
export const calcularTotaisDe = (jor) => calcularTotais(jor);

export const calcularJornadaTotalDe = (jor) =>
  jor ? calcDuration(jor.inicioExpediente, jor.fimExpediente) : 0;
