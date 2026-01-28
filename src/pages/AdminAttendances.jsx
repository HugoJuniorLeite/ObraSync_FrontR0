import { useEffect, useState } from "react";
import { FormTitle, FormWrapper } from "../layouts/Theme";
import AdminAttendanceFilters from "../components/AdminAttendanceFilters";
import AdminAttendanceTable from "../components/AdminAttendanceTable";
import attendancesApi from "../services/apiAttendances";

export default function AdminAttendances() {
  const [attendances, setAttendances] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    technician: "",
    search: "",
  });



   const fetchAttendances = async () => {
    console.log("fet",filters )
    try {
    const data = await attendancesApi.getAttendances(filters);
      setAttendances(data);
    } catch (error) {
      console.error("Erro ao buscar atendimentos", error);
    }
  };

  useEffect(() => {
    fetchAttendances();
  }, [filters]);

  return (
    <FormWrapper>
      <FormTitle>Sala de Controle Operacional</FormTitle>

      <AdminAttendanceFilters
        filters={filters}
        setFilters={setFilters}
      />

      <AdminAttendanceTable data={attendances} />
    </FormWrapper>
  );
}
