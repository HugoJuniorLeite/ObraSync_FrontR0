import api from "./api";


async function postEmployee(payload) {
  const response = await api.post('/add-employee', payload);
  return response.data;
}

async function getEmployee(payload) {
   if (!payload) return;
  const response = await api.get(`/get-employee-by-project/${payload}`);
  return response.data;
}

async function getAllEmployees () {
  const response = await api.get("/all-employees");
  return response.data;
}

async function putAlterEmployee(employee_id, payload) {
  const response = await api.put(`/alter-employee/${employee_id}`, payload);
  return response.data;
}

async function putInativeEmployee(employee_id) {
  const response = await api.put(`/deactivate-employee/${employee_id}`);
  return response.data;
}

const apiEmployee = { postEmployee, getEmployee, getAllEmployees, putAlterEmployee, putInativeEmployee }

export default apiEmployee;