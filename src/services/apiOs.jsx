import api from "./api";


// async function postContract(payload) {
//   const response = await api.post('/add-project', payload);
//   return response.data;
// }

// async function getContracts() {
//   const response = await api.get('/all-projects');
//   return response.data;
// }


// async function getClients() {
//   const response = await api.get('/all-firms');
//   return response.data;
// }

// async function putClient(payload) {
//   const response = await api.post('/add-firm', payload);
//   return response.data;
// }

async function postService(payload) {
  const response = await api.post('/add-bill', payload);
  return response.data;
}

async function getService(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/get-bills?${params}`);
  return response.data;
}


async function getServiceByTechnical(filters){
  // const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/bill-by-technical/${filters}`);
  return response.data;
}



async function dispachService(bill_id, data) {
    // const params = new URLSearchParams(bill_id).toString();
  const response = await api.put(`dispatch-bill/${bill_id}`, data);
  return response.data;
}

async function changeStatus(bill_id, status) {
  const response = await api.put(`/change-status-bill/${bill_id}`, status);
  return response.data;
}

// postContract, getContracts, getClients, putClient,

const serviceOs = {  postService, getService, getServiceByTechnical, dispachService, changeStatus }

export default serviceOs;