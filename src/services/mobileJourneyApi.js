// src/services/mobileJourneyApi.js
import api from "./api";

/**
 * Inicia uma jornada (início de expediente)
 * body esperado pelo backend:
 * {
 *   date: "2025-12-07",
 *   employee_id: 123,
 *   inicio_expediente: "2025-12-07T10:00:00Z",
 *   gps_inicio: { lat, lng }
 * }
 */
export async function startJourney({
  employeeId,
  date,
  inicioExpediente,
  gpsInicio,
}) {
  const payload = {
    date, // já vem "YYYY-MM-DD" do front
    employee_id: employeeId,
    inicio_expediente: inicioExpediente ?? null,
    gps_inicio: gpsInicio ?? null,
  };

  const { data } = await api.post("/mobile-journeys/start", payload);
  return data; // retorna a jornada criada (com id)
}

/**
 * Finaliza a jornada (fim de expediente + assinatura + gps final)
 * PATCH /mobile-journeys/:id/finish
 */
export async function finishJourney(journeyId, {
  fimExpediente,
  gpsFim,
  assinatura,
}) {
  const payload = {
    fim_expediente: fimExpediente ?? null,
    gps_fim: gpsFim ?? null,
    assinatura: assinatura ?? null,
  };

  const { data } = await api.patch(
    `/mobile-journeys/${journeyId}/finish`,
    payload
  );
  return data;
}

/**
 * Cria um atendimento dentro da jornada
 * journey_id vem do backend (id da jornada)
 *
 * attendance (front) pode estar assim:
 * {
 *   tipo,
 *   ordemTipo,
 *   ordemPrefixo,
 *   ordemNumero,
 *   deslocamentoInicio,
 *   atendimentoInicio,
 *   finalizadoEm,
 *   gpsInicio: { lat, lng },
 *   gpsChegada: { lat, lng },
 *   endereco: { cep, rua, numero, bairro, cidade, estado },
 *   comentario,
 *   notas
 * }
 */
export async function addAttendance(journeyId, attendance) {
  const payload = {
    tipo: attendance.tipo,
    ordem_tipo: attendance.ordemTipo ?? null,
    ordem_prefixo: attendance.ordemPrefixo ?? null,
    ordem_numero: attendance.ordemNumero ?? null,

    deslocamento_inicio: attendance.deslocamentoInicio ?? null,
    atendimento_inicio: attendance.atendimentoInicio ?? null,
    finalizado_em: attendance.finalizadoEm ?? null,

    gps_inicio_lat: attendance.gpsInicio?.lat ?? null,
    gps_inicio_lng: attendance.gpsInicio?.lng ?? null,
    gps_chegada_lat: attendance.gpsChegada?.lat ?? null,
    gps_chegada_lng: attendance.gpsChegada?.lng ?? null,

    cep: attendance.endereco?.cep ?? null,
    rua: attendance.endereco?.rua ?? null,
    numero: attendance.endereco?.numero ?? null,
    bairro: attendance.endereco?.bairro ?? null,
    cidade: attendance.endereco?.cidade ?? null,
    estado: attendance.endereco?.estado ?? null,

    comentario: attendance.comentario ?? null,
    notas: attendance.notas ?? null,
  };

  const { data } = await api.post(
    `/mobile-journeys/${journeyId}/attendances`,
    payload
  );
  return data; // retorna attendance com id gerado no backend
}

/**
 * Adiciona um ponto de rota àquele atendimento
 * point:
 * {
 *   time: "2025-12-07T10:15:00Z",
 *   lat: -23.6,
 *   lng: -46.4
 * }
 */
export async function addRoutePoint(attendanceId, point) {
  const payload = {
    time: point.time,
    lat: point.lat,
    lng: point.lng,
  };

  const { data } = await api.post(
    `/mobile-attendances/${attendanceId}/route-point`,
    payload
  );
  return data;
}

/**
 * Registra um almoço
 * lunch:
 * {
 *   inicio,
 *   fim,
 *   latInicio,
 *   lngInicio,
 *   latFim,
 *   lngFim,
 *   suspensoEm,
 *   latSuspenso,
 *   lngSuspenso,
 *   justificativaSuspensao,
 *   solicitanteSuspensao
 * }
 */
export async function addLunch(journeyId, lunch) {
  const payload = {
    inicio: lunch.inicio ?? null,
    fim: lunch.fim ?? null,
    lat_inicio: lunch.latInicio ?? null,
    lng_inicio: lunch.lngInicio ?? null,
    lat_fim: lunch.latFim ?? null,
    lng_fim: lunch.lngFim ?? null,
    suspenso_em: lunch.suspensoEm ?? null,
    lat_suspenso: lunch.latSuspenso ?? null,
    lng_suspenso: lunch.lngSuspenso ?? null,
    justificativa_suspensao: lunch.justificativaSuspensao ?? null,
    solicitante_suspensao: lunch.solicitanteSuspensao ?? null,
  };

  const { data } = await api.post(
    `/mobile-journeys/${journeyId}/lunches`,
    payload
  );
  return data;
}

/**
 * Registra um log de base (saída/chegada)
 * log:
 * {
 *   tipo: "deslocamentoParaBase" | "chegadaBase" | "saida_base" | "chegada_base",
 *   time,
 *   gps: { lat, lng }
 * }
 */
export async function addBaseLog(journeyId, log) {

  const payload = {
    tipo: log.tipo,
    time: log.time,
    lat: log.lat ?? null,
    lng: log.lng ?? null,
    motivo: log.motivo ?? null,
  };

  console.log("PAYLOAD API", payload)

  const { data } = await api.post(
    `/mobile-journeys/${journeyId}/base-logs`,payload);
  return data;
}

/**
 * Lista jornadas
 * filters: { employeeId?, date? }
 * - date no formato "YYYY-MM-DD"
 */
export async function listJourneys({ employeeId, date } = {}) {
  const params = {};
  if (employeeId) params.employee_id = employeeId;
  if (date) params.date = date;

  const { data } = await api.get("/mobile-journeys", { params });
  return data; // por enquanto retorna no formato do backend
}

/**
 * Busca jornada por ID
 */
export async function getJourneyById(id) {
  const { data } = await api.get(`/mobile-journeys/${id}`);
  return data;
}

/**
 * (Opcional) exporta tudo em um objeto para importar fácil
 */
const mobileJourneyApi = {
  startJourney,
  finishJourney,
  addAttendance,
  addRoutePoint,
  addLunch,
  addBaseLog,
  listJourneys,
  getJourneyById,
};

export default mobileJourneyApi;
