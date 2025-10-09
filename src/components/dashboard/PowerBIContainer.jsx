
export default function PowerBIContainer() {
  return (
    <div style={{ width: "100%", height: "75vh" }}>
      <iframe
        title="Relatório Power BI"
        src="https://app.powerbi.com/view?r=eyJrIjoiYzZiNzVjMjgtZjMwOC00OTdjLTljM2ItNWRmMWY4NGViOTY5IiwidCI6ImJkZjMzNTc0LTFiMzUtNDA1Mi05MTg3LTA1MjZmY2M2YTUxZSJ9" 
        style={{ width: "77vw", height: "480px", border: "none" }}
        allowFullScreen={true}
      />
    </div>
  );
}