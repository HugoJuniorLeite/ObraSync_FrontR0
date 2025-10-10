
export default function PowerBIContainer() {
  return (
    <div style={{ width: "100%", height: "75vh" }}>
      <iframe
        title="Relatório Power BI"
        src="https://app.powerbi.com/view?r=eyJrIjoiZjQ1YjcxYWYtNzQxNC00ZDgyLWJhN2QtODJmMjhjOWNkNDM1IiwidCI6ImNkOTI3Nzg5LWFjYzAtNDVmYS1iNDIzLTIyNGNjZGI2NGIzZCJ9"
        style={{ width: "77vw", height: "480px", border: "none" }}
        allowFullScreen={true}
      />
    </div>
  );
}