import api from "./api"; // mesmo padrão que você já usa

const getAttendances = async (filters) => {
  const { data } = await api.get("/admin-attendances", {
    params: filters,
  });
  return data;
};


const attendancesApi = {getAttendances}


export default attendancesApi;
