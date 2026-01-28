export default function StatusBadge({ status }) {
  const map = {
    EXECUTADO: { label: "Executado", color: "green" },
    VALA_PERDIDA: { label: "Vala Perdida", color: "orange" },
    NAO_EXECUTADO: { label: "Não Executado", color: "red" },
  };

  if (!map[status]) return null;

  return (
    <span style={{ color: map[status].color, fontWeight: "bold" }}>
      {map[status].label}
    </span>
  );
}
