import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useForm, Controller } from "react-hook-form";
import { set, get } from "idb-keyval"; // persistência
// import { details } from "framer-motion/client";

const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 640px;
  margin: auto;
  aspect-ratio: 16 / 9;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  background: #f8f8f8;
`;

const Background = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
`;

const InputWrapper = styled.div`
  position: absolute;
  display: inline-block;
  transform: translateX(-50%);
`;

const InputField = styled.input`
  border: 1px solid #333;
  background: #fdb000;
  font-size: clamp(8px, 2vw, 14px);
  padding: 0.5vw;
  border-radius: 4px;
  text-align: center;
  transform: ${(props) => (props.rotate ? "rotate(-90deg)" : "none")};
  transform-origin: center;
  /* width: ${(props) => props.width}px; */
    width: ${(props) => props.width || 40}px; /* largura dinâmica */
`;

const SpanMeasure = styled.span`
  position: absolute;
  visibility: hidden;
  white-space: pre;
  font-size: clamp(8px, 2vw, 14px);
  padding: 0.5vw;
  font-family: inherit;
`;

export default function PrincipalPreVgb({ formData, setFormData, BillId, croquiFile, croquiFields }) {
  const { control, setValue, reset, watch } = useForm();
  const [widths, setWidths] = useState({});
  const spansRef = useRef({});

  const fields = croquiFields; // substitui a lista fixa


  const ramalCortado = watch("ramalCortado");
  const localCorte = watch("localCorte");

  const updateWidth = (name, value, placeholder) => {
    if (spansRef.current[name]) {
      spansRef.current[name].textContent = value || placeholder;
      const newWidth = spansRef.current[name].offsetWidth + 4;
      setWidths((prev) => ({ ...prev, [name]: newWidth }));
    }
  };

  // Ajusta largura inicial baseado no placeholder
  useEffect(() => {
    fields.forEach((f) => {
      if (spansRef.current[f.name]) {
        spansRef.current[f.name].textContent = f.label;
        const newWidth = spansRef.current[f.name].offsetWidth + 4;
        setWidths((prev) => ({ ...prev, [f.name]: newWidth }));
      }
    });
  }, []);

  // 1️⃣ Carregar dados salvos ao abrir o croqui
  useEffect(() => {
    (async () => {
      const saved = await get(`croqui-${BillId}`) || {};
      reset(saved); // popula o form com dados salvos
      setFormData((prev) => ({
        ...prev,
        croquis: {
          ...(prev.croquis || {}),
          [BillId]: saved,
        },
      }));
    })();
  }, [BillId, reset, setFormData]);

  // 2️⃣ Resetar croqui se ramalCortado ou localCorte mudarem
  useEffect(() => {
    const croqui = formData.croquis?.[BillId] || {};
    if (
      croqui.ramalCortado !== formData.ramalCortado ||
      croqui.localCorte !== formData.localCorte
    ) {
      const resetCroqui = { ramalCortado: formData.ramalCortado, localCorte: formData.localCorte };
      reset(resetCroqui);
      setFormData((prev) => ({
        ...prev,
        croquis: {
          ...(prev.croquis || {}),
          [BillId]: resetCroqui,
        },
      }));
      set(`croqui-${BillId}`, resetCroqui);
    }
  }, [formData.ramalCortado, formData.localCorte, BillId, reset, setFormData]);

  // 3️⃣ Função para salvar alterações do croqui
  const handleChange = (name, value, placeholder) => {
    // Mantém lógica existente de largura e layout
    updateWidth(name, value, placeholder);

    // Atualiza apenas os dados do croqui para o BillId atual
    const newCroqui = {
      ...((formData.croquis?.[BillId] && { ...formData.croquis[BillId] }) || {}),
      [name]: value,
    };

    // Atualiza o formData global e persiste no IndexedDB
    setFormData((prev) => ({
      ...prev,
      croquis: {
        ...(prev.croquis || {}),
        [BillId]: newCroqui,
      },
    }));

    // Persistência imediata
    set(`croqui-${BillId}`, newCroqui);
  };

  useEffect(() => {
    const resetCroquiForKey = async () => {
      // Recupera os dados salvos
      const saved = await get(`croqui-${BillId}`) || {};

      // Se a chave atual não existir, cria um objeto vazio
      const clonedSaved = { ...saved };

      // Reseta apenas os campos do croqui no formData
      reset(clonedSaved);

      setFormData((prev) => ({
        ...prev,
        croquis: {
          ...(prev.croquis || {}),
          [BillId]: clonedSaved,
        },
      }));

      // Persistência imediata
      set(`croqui-${BillId}`, clonedSaved);
    };

    // Dispara reset apenas quando mudar ramalCortado ou localCorte
    if (formData.ramalCortado && formData.localCorte) {
      resetCroquiForKey();
    }
  }, [ramalCortado, localCorte, BillId, reset]);



  // const updateWidth = (name, value, placeholder) => {
  //   if (spansRef.current[name]) {
  //     spansRef.current[name].textContent = value || placeholder;
  //     const newWidth = spansRef.current[name].offsetWidth + 4;
  //     setWidths((prev) => ({ ...prev, [name]: newWidth }));
  //   }
  // };

  return (

    <Container>

      <Background src={croquiFile} alt="Planta simplificada" />
      {fields.map((f, i) => (
        <Controller
          key={i}
          name={f.name}
          control={control}
          defaultValue={formData.croquis?.[BillId]?.[f.name] || ""}

          render={({ field }) => (
            <InputWrapper style={{ top: f.top, left: f.left }}>
              <InputField
                {...field}
                placeholder={f.label}
                rotate={f.rotate}
                width={Math.max(60, widths[f.name] || f.name.length * 8)}
                onChange={(e) => {
                  field.onChange(e);
                  handleChange(f.name, e.target.value, f.label);
                }}
                type={f.type || "text"}   // se não tiver, vira "text"
                step={f.step || undefined} // só aplica se existir
                min={f.type === "number" ? 0 : undefined} // só aplica no number

              />
              <SpanMeasure ref={(el) => (spansRef.current[f.name] = el)} />
            </InputWrapper>
          )}
        />
      ))}
    </Container>
  );
}
