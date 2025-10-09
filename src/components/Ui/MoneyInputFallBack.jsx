// // components/MoneyInputFallback.jsx
// import React, { useState } from 'react';
import { ErrorText, StyledInput, StyledLabel } from '../../layouts/Theme';

// import { StyledInput } from "../../layouts/Theme";


// export const MoneyInputFallback = ({ label, name, onValueChange, error }) => {
//   const [displayValue, setDisplayValue] = useState('');

//   const formatarParaReais = (valor) => {
//     const numero = valor.replace(/\D/g, '');
//     if (!numero) return '';
//     return (Number(numero) / 100).toLocaleString('pt-BR', {
//       style: 'currency',
//       currency: 'BRL',
//     });
//   };

//   const handleChange = (e) => {
//     const valorFormatado = formatarParaReais(e.target.value);
//     setDisplayValue(valorFormatado);

//     const valorNumerico = Number(e.target.value.replace(/\D/g, '')) / 100;
//     if (onValueChange) {
//       onValueChange(valorNumerico); // envia o número puro para o pai
//     }
//   };

//   return (
//     <div>
//       {label && <StyledLabel htmlFor={name}>{label}</StyledLabel>}
//       <StyledInput
//         type="text"
//         inputMode="numeric"
//         name={name}
//         value={displayValue}
//         onChange={handleChange}
//         placeholder="R$ 0,00"
//       />
//       {error && <ErrorText >{error.message}</ErrorText>}
//     </div>
//   );
// };


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
