import { ErrorText, StyledInput, StyledLabel } from '../../layouts/Theme';



export const MoneyInputFallback = ({ label, name, value, onChange, error }) => {
  const formatarParaReais = (valor) => {
    const numero = valor.replace(/\D/g, '');
    if (!numero) return '';
    return (Number(numero) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  // Para exibir, formatamos o valor numérico para real (string)
  const displayValue =
    value === undefined || value === null || value === 0
      ? ''
      : formatarParaReais(String(Math.round(value * 100)));

  const handleChange = (e) => {
    const valorNumerico = Number(e.target.value.replace(/\D/g, '')) / 100;
    onChange(valorNumerico);
  };

  return (
    <div>
      {label && <StyledLabel htmlFor={name}>{label}</StyledLabel>}
      <StyledInput
        type="text"
        inputMode="numeric"
        name={name}
        value={displayValue}
        onChange={handleChange}
        placeholder="R$ 0,00"
      />
      {error && <ErrorText>{error.message}</ErrorText>}
    </div>
  );
};
