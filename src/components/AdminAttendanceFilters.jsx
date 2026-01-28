import { InputWraper, RowInputData } from "../layouts/Theme";

export default function AdminAttendanceFilters({ filters, setFilters }) {
  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <InputWraper>
      <RowInputData>
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleChange}
        />

        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleChange}
        />

        <input
          type="text"
          name="technician"
          placeholder="Técnico"
          value={filters.technician}
          onChange={handleChange}
        />

        <input
          type="text"
          name="search"
          placeholder="OS"
          value={filters.search}
          onChange={handleChange}
        />
      </RowInputData>
    </InputWraper>
  );
}
