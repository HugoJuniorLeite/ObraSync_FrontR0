import api from "./api";


async function postOccupation(payload) {
  const response = await api.post('/create-occupation', payload);
  return response.data;
}

async function getOccupation() {
  const response = await api.get('/all-occupations');
  return response.data;
}

async function getOccupationById(payload) {
  const response = await api.get(`/occupation-by-id/${payload}`);
  return response.data;
}

async function deleteOccupationById(payload) {
  const response = await api.put(`/delete-occupation/${payload}`);
  return response.data;
}

async function updateOccupationById(id, payload) {
  const response = await api.put(`/update-occupation/${id}`,payload);
  return response.data;
}


const apiOccupation = { postOccupation, getOccupation, getOccupationById, deleteOccupationById, updateOccupationById }

export default apiOccupation;


