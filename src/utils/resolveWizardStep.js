import { getStepByStatus } from "./stepByStatus";

/**
 * Resolve o step inicial do wizard com prioridade correta:
 *
 * 1️⃣ Jornada vinda do backend (login em outro dispositivo)
 * 2️⃣ Draft local (offline / continuidade local)
 * 3️⃣ Fallback seguro (step 0)
 */
export function resolveWizardStep({ backendJornada, localDraft }) {

    console.log(backendJornada, "backendJornada")

        console.log(localDraft, "localDraft")
  // 🔥 PRIORIDADE 1 — backend
  if (backendJornada) {
    return getStepByStatus(backendJornada);
  }

  // 🔥 PRIORIDADE 2 — offline draft
  if (localDraft) {
    return getStepByStatus(localDraft);
  }

  // 🔒 fallback seguro
  return 0;
}
