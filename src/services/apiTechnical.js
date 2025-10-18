import api from "./api";


async function postTechnical(payload) {
  const response = await api.post('/add-technical', payload);
  return response.data;
}

async function getTechnical() {
  
  const response = await api.get('/get-employee-by-project/:project_id');
  return response.data;
}





const technical = { postTechnical, getTechnical }

export default technical;