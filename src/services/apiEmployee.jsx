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




const employee = { postEmployee, getEmployee, getAllEmployees }

export default employee;