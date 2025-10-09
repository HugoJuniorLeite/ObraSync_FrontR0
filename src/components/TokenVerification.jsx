import React, { useEffect, useRef, useState } from 'react';
import { InputWraper, RowInput, StyledInputToken, StyledLabel, SubmitButton } from '../layouts/Theme';

export default function TokenVerification({ onSubmit }) {
  const [code, setCode] = useState(Array(6).fill(""));
  const inputsRef = useRef([]);

  console.log(onSubmit)

  const handleChange = (value, index) => {
    if (/^\d$/.test(value) || value === "") {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value !== "" && index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length === 6) {
      onSubmit(fullCode);
    } else {
      alert("Digite os 6 dígitos do token.");
    }
  };

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  return (
    <InputWraper>
      <form onSubmit={handleSubmit}>
        <StyledLabel>Digite o token</StyledLabel>
        <RowInput>
          {code.map((value, index) => (
            <StyledInputToken
              key={index}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={value}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputsRef.current[index] = el)}
            />
          ))}
        </RowInput>
        <SubmitButton>
          Validar código
        </SubmitButton>
      </form>
    </InputWraper>
  );
}