import api from "./api";


async function postRdo(payload) {
  const response = await api.post('/create-rdo', payload);
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



async function getPdf(id) {
  console.log(id)
  const response = await api.get(`/rdo-by-bill/${id}/pdf`, {
    responseType: 'blob' // <-- importante
  });
  return response.data; // aqui já é Blob
}




const createRdo = { postRdo, getOccupation, getOccupationById, getPdf }

export default createRdo;


