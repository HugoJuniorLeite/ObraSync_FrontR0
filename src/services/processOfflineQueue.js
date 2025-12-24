// import api from "./api";
// import { getQueue, clearProcessed } from "../utils/offlineQueue";

// export async function processOfflineQueue() {
//   const queue = getQueue();
//   const done = [];

//   for (let i = 0; i < queue.length; i++) {
//     const { endpoint, method, body } = queue[i];
//     try {
//       await api({ url: endpoint, method, data: body });
//       done.push(i);
//     } catch {
//       break; // para se a rede cair de novo
//     }
//   }

//   clearProcessed(done);
// }

//---------------------------------------------------------------------
//versão 2
//---------------------------------------------------------------------

// src/services/processOfflineQueue.js
import { loadDraftJornada, saveDraftJornada } from "../utils/journeyStore";
import { readArray, writeArray } from "../utils/storageSafe";
import api from "./api";
// import { readArray, writeArray } from "../utils/storageSafe";

// const QUEUE_KEY = "obsync_offline_queue";

// export async function processOfflineQueue() {
//   const queue = readArray(QUEUE_KEY);

//   if (!queue.length) return;

//   const processedIndexes = [];

//   for (let i = 0; i < queue.length; i++) {
//     const item = queue[i];

//     try {
//       await api.request({
//         url: item.endpoint,
//         method: item.method,
//         data: item.body,
//       });

//       processedIndexes.push(i);
//     } catch (err) {
//       break;
//     }
//   }

//   if (processedIndexes.length) {
//     const remaining = queue.filter(
//       (_, i) => !processedIndexes.includes(i)
//     );

//     writeArray(QUEUE_KEY, remaining);
//   }
// }

// const QUEUE_KEY = "obsync_offline_queue";
// const CURRENT_JOURNEY_KEY = "obsync_current_journey";

// export async function processOfflineQueue() {
//   const queue = readArray(QUEUE_KEY);
//   if (!queue.length) return;

//   for (let i = 0; i < queue.length; i++) {
//     const item = queue[i];

//     try {
//       // 🔹 Executa request da fila
//       const resp = await api.request({
//         url: item.endpoint,
//         method: item.method,
//         data: item.body,
//       });

//       // 🔥 ================================
//       // 🔥 RECONCILIAÇÃO DE ALMOÇO (CRÍTICA)
//       // 🔥 ================================
//       if (
//         item.method === "POST" &&
//         item.endpoint.includes("/lunches") &&
//         item.body?.local_id &&
//         resp?.data?.id
//       ) {
//         const localId = item.body.local_id;
//         const backendId = resp.data.id;

//         // 1️⃣ Lê jornada atual (array → objeto)
//         const jornadas = readArray(CURRENT_JOURNEY_KEY);
//         const jornada = jornadas?.[0];

//         if (jornada?.almocos?.length) {
//           const jornadaAtualizada = {
//             ...jornada,
//             almocos: jornada.almocos.map((a) =>
//               a.id === localId ? { ...a, backendId } : a
//             ),
//           };

//           // 2️⃣ Salva jornada atualizada
//           writeArray(CURRENT_JOURNEY_KEY, [jornadaAtualizada]);
//         }

//         // 3️⃣ Reescreve PATCHs pendentes na fila
//         queue.forEach((q) => {
//           if (q.endpoint.includes(`/mobile-lunches/${localId}/`)) {
//             q.endpoint = q.endpoint.replace(localId, backendId);
//           }
//         });
//       }

//       // 🔹 Remove item processado da fila
//       queue.splice(i, 1);
//       i--; // ajusta índice após remoção
//     } catch (err) {
//       console.warn(
//         "Falha ao processar fila offline, interrompendo sync",
//         err
//       );
//       break; // ⛔ interrompe para tentar novamente depois
//     }
//   }

//   // 🔹 Persiste fila restante
//   writeArray(QUEUE_KEY, queue);
// }




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