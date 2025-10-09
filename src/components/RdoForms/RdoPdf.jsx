import { useState } from "react";
import createRdo from "../../services/apiRdo";
import { Container, FormWrapper, InputWraper, SubmitButton } from "../../layouts/Theme";
import { useParams } from "react-router-dom";


export default function RdoPdf() {

  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const gerarPdf = async () => {
    if (loading) return; // evita múltiplos popups
    setLoading(true);

    try {
      const blob = await createRdo.getPdf(id);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper>
      <InputWraper>
        <SubmitButton onClick={gerarPdf}>
          {loading ? "Gerando PDF..." : "Abrir PDF"}
        </SubmitButton>
      </InputWraper>

    </FormWrapper>
  );
}