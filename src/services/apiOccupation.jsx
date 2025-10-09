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



const occupation = { postOccupation, getOccupation, getOccupationById }

export default occupation;


