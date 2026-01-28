export function getStepByStatus(jornada) {
  if (!jornada) return 0;

  const {
    inicioExpediente,
    fimExpediente,
    atividadeAtual,
    atividadeAnterior,
  } = jornada;

  if (!inicioExpediente) return 0;

  // 🔥 REGRA-CHAVE: almoço NÃO muda step
  const atividadeParaResolver =
    atividadeAtual === "pausadoParaAlmoco"
      ? atividadeAnterior
      : atividadeAtual;

  if (atividadeParaResolver === "livre") return 1;
  if (atividadeParaResolver === "deslocamento") return 5;
  if (atividadeParaResolver === "atendimento") return 6;
  if (atividadeParaResolver === "atendimentoFinalizado") return 7;
  if (atividadeParaResolver === "retornoBase") return 8;

  if (fimExpediente) return 9;

  return 0;
}
