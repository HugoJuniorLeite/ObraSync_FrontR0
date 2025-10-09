import api from "./api";


async function postContract(payload) {
  const response = await api.post('/add-project', payload);
  return response.data;
}

async function getContracts() {
  const response = await api.get('/all-projects');
  return response.data;
}


async function getClients() {
  const response = await api.get('/all-firms');
  return response.data;
}

async function putClient(payload) {
  const response = await api.post('/add-firm', payload);
  return response.data;
}

async function postService(payload) {
  const response = await api.post('/add-service', payload);
  return response.data;
}

async function getService(payload) {
  const response = await api.get(`/service-by-project/${payload}`);
  return response.data;
}



const contract = { postContract, getContracts, getClients, putClient, postService, getService }

export default contract;