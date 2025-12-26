
// src/services/processOfflineQueue.js
import { loadDraftJornada, saveDraftJornada } from "../utils/journeyStore";
import { readArray, writeArray } from "../utils/storageSafe";
import api from "./api";

const QUEUE_KEY = "obsync_offline_queue";



export async function processOfflineQueue() {
  const queue = readArray(QUEUE_KEY);
  if (!queue.length) return;

  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];

    try {
      const resp = await api.request({
        url: item.endpoint,
        method: item.method,
        data: item.body,
      });

      // 🔥 RECONCILIAÇÃO DE ALMOÇO
      if (
        item.method === "POST" &&
        item.endpoint.includes("/lunches") &&
        item.body?.local_id &&
        resp?.data?.id
      ) {
        const localId = item.body.local_id;
        const backendId = resp.data.id;

        // 1️⃣ Atualiza DRAFT
        const draft = loadDraftJornada();
        if (draft) {
          saveDraftJornada({
            ...draft,
            almocos: draft.almocos.map((a) =>
              a.id === localId ? { ...a, backendId,  sync_status: "synced" } : a
            ),
          });
        }

        // 2️⃣ Reescreve PATCHs pendentes
        queue.forEach((q) => {
          if (q.endpoint.includes(`/mobile-lunches/${localId}/`)) {
            q.endpoint = q.endpoint.replace(
              localId,
              backendId
            );
          }
        });
      }

      // remove item processado
      queue.splice(i, 1);
      i--;
    } catch {
      // para sync ao primeiro erro
      break;
    }
  }

  writeArray(QUEUE_KEY, queue);
}