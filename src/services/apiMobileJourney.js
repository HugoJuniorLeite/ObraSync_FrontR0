  import api from "./api";
  import { queueRequest } from "../utils/offlineQueue";

  console.log(">>> apiMobileJourney carregado:", {
  createAttendance: typeof createAttendance
});


  function mapAttendanceFromApi(att) {
    if (!att) return null;
    return {
      id: att.id,
      tipo: att.tipo,
      ordemTipo: att.ordem_tipo || "",
      ordemPrefixo: att.ordem_prefixo || "",
      ordemNumero: att.ordem_numero || "",
      notaEnviada: att.nota_enviada ? "sim" : "nao",

      deslocamentoInicio: att.deslocamento_inicio || null,
      atendimentoInicio: att.atendimento_inicio || null,
      finalizadoEm: att.finalizado_em || null,

      gpsInicio:
        att.gps_inicio_lat != null && att.gps_inicio_lng != null
          ? { lat: att.gps_inicio_lat, lng: att.gps_inicio_lng }
          : { lat: null, lng: null },

      gpsChegada:
        att.gps_chegada_lat != null && att.gps_chegada_lng != null
          ? { lat: att.gps_chegada_lat, lng: att.gps_chegada_lng }
          : { lat: null, lng: null },

      endereco: {
        cep: att.cep || "",
        rua: att.rua || "",
        numero: att.numero || "",
        bairro: att.bairro || "",
        cidade: att.cidade || "",
        estado: att.estado || "",
      },

      comentario: att.comentario || "",
      notas: att.notas || "",

      rota: (att.rota || []).map((p) => ({
        id: p.id,
        time: p.time,
        lat: p.lat,
        lng: p.lng,
      })),
    };
  }

  function mapJourneyFromApi(j) {
    if (!j) return null;
    return {
      id: j.id,
      date: j.date,
      employeeId: j.employee_id,

      inicioExpediente: j.inicio_expediente || null,
      fimExpediente: j.fim_expediente || null,

      expedienteGps:
        j.expediente_gps_lat != null && j.expediente_gps_lng != null
          ? { lat: j.expediente_gps_lat, lng: j.expediente_gps_lng }
          : null,

      assinatura: j.assinatura || null,

      almocos: (j.lunches || []).map((a) => ({
        id: a.id,
        inicio: a.inicio || null,
        fim: a.fim || null,
        latInicio: a.lat_inicio ?? null,
        lngInicio: a.lng_inicio ?? null,
        latFim: a.lat_fim ?? null,
        lngFim: a.lng_fim ?? null,
        suspensoEm: a.suspenso_em || null,
        latSuspenso: a.lat_suspenso ?? null,
        lngSuspenso: a.lng_suspenso ?? null,
        justificativaSuspensao: a.justificativa_suspensao || "",
        solicitanteSuspensao: a.solicitante_suspensao || "",
      })),

      atendimentos: (j.attendances || []).map(mapAttendanceFromApi),

      baseLogs: (j.base_logs || []).map((b) => ({
        id: b.id,
        tipo: b.tipo,
        time: b.time,
        gps: {
          lat: b.lat ?? null,
          lng: b.lng ?? null,
        },
      })),
    };
  }

  async function postMobileJourney(payload) {
    const response = await api.post("/mobile-journeys", payload);
    return mapJourneyFromApi(response.data);
  }

  async function getMobileJourneys(params) {
    const response = await api.get("/mobile-journeys", { params });
    const arr = Array.isArray(response.data) ? response.data : [];
    return arr.map(mapJourneyFromApi);
  }

  async function getMobileJourneyById(id) {
    const response = await api.get(`/mobile-journeys/${id}`);
    return mapJourneyFromApi(response.data);
  }

  async function putAttendanceOS(attendanceId, payload) {
    const response = await api.put(
      `/mobile-attendances/${attendanceId}/os`,
      payload
    );
    return response.data;
  }


  // Step 4: criar atendimento
  async function createAttendance(journeyId, payload) {
    try {
      const { data } = await api.post(`/mobile-journeys/${journeyId}/attendances`, payload);
      return { ok: true, data };
    } catch (err) {
      // sem rede? cai para fila offline
      if (!err.response) {
        queueRequest(`/mobile-journeys/${journeyId}/attendances`, "POST", payload);
        return { ok: false, offline: true };
      }

      throw err;
    }
  }

// STEP 4 — criar atendimento
// async function createAttendance(journeyId, payload) {
//   const { data } = await api.post(
//     `/mobile-journeys/${journeyId}/attendances`,
//     payload
//   );
//   return data;
// }

  // Step 5 → iniciar atendimento
async function startService(attendanceId, payload) {
  try {
    const { data } = await api.patch(
      `/mobile-attendances/${attendanceId}/start-service`,
      payload
    );
    return data;
  } catch (err) {
    if (!err.response) {
      queueRequest(
        `/mobile-attendances/${attendanceId}/start-service`,
        "PATCH",
        payload
      );
      return { offline: true };
    }
    throw err;
  }
}

// STEP 5 — iniciar atendimento
// async function startService(attendanceId, payload) {
//   const { data } = await api.patch(
//     `/mobile-attendances/${attendanceId}/start-service`,
//     payload
//   );
//   return data;
// }


  // Step 6: criar atendimento

  async function updateAttendance(attendanceId, payload) {
  const { data } = await api.patch(
    `/mobile-attendances/${attendanceId}`,
    payload
  );
  return data;
}

async function finishService(attendanceId, payload) {
  const { data } = await api.patch(
    `/mobile-attendances/${attendanceId}/finish`,
    payload
  );
  return data;
}

// STEP 6 — finalizar atendimento
// async function finishService(attendanceId, payload) {
//   const { data } = await api.patch(
//     `/mobile-attendances/${attendanceId}/finish`,
//     payload
//   );
//   return data;
// }




  const apiMobileJourney = {
    createAttendance,
    postMobileJourney,
    getMobileJourneys,
    getMobileJourneyById,
    putAttendanceOS,
    // updateAttendance,
    finishService,
    startService,
  };

  export default apiMobileJourney;