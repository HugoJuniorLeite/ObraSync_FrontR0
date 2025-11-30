import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Step3_Endereco({
  Field,
  Label,
  Card,
  BigBtn,
  Input,
  current,
  updateCurrentField,
  buscarCep,
  next,
  prev,
}) {
  const endereco = current.endereco || {};

  return (
    <motion.div
      key="s3"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      transition={{ duration: 0.24 }}
    >
      <Field>
        <Label>CEP</Label>
        <Input
          inputMode="numeric"
          placeholder="00000000"
          value={endereco.cep || ""}
          onBlur={(e) => buscarCep(e.target.value)}
          onChange={(e) =>
            updateCurrentField(
              "endereco.cep",
              e.target.value.replace(/\D/g, "").slice(0, 8)
            )
          }
        />
      </Field>

      <Field>
        <Label>Rua / Logradouro</Label>
        <Input
          placeholder="Logradouro"
          value={endereco.rua || ""}
          onChange={(e) =>
            updateCurrentField("endereco.rua", e.target.value)
          }
        />
      </Field>

      <div style={{ display: "flex", gap: 8 }}>
        <Input
          placeholder="Número"
          style={{ flex: 1 }}
          value={endereco.numero || ""}
          onChange={(e) =>
            updateCurrentField("endereco.numero", e.target.value)
          }
        />

        <Input
          placeholder="Bairro"
          style={{ flex: 1 }}
          value={endereco.bairro || ""}
          onChange={(e) =>
            updateCurrentField("endereco.bairro", e.target.value)
          }
        />
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <Input
          placeholder="Cidade"
          style={{ flex: 1 }}
          value={endereco.cidade || ""}
          onChange={(e) =>
            updateCurrentField("endereco.cidade", e.target.value)
          }
        />

        <Input
          placeholder="UF"
          style={{ width: 80 }}
          value={endereco.estado || ""}
          onChange={(e) =>
            updateCurrentField("endereco.estado", e.target.value.toUpperCase())
          }
        />
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <BigBtn onClick={prev}>
          <ChevronLeft size={18} /> Voltar
        </BigBtn>

        <BigBtn
          $primary
          onClick={() => {
            const cep = (endereco.cep || "").replace(/\D/g, "");
            if (!cep || cep.length !== 8 || !endereco.numero) {
              alert("Preencha CEP válido (8 dígitos) e número do endereço.");
              return;
            }
            next(); // avançar para Step 4
          }}
        >
          Próximo <ChevronRight size={18} />
        </BigBtn>
      </div>
    </motion.div>
  );
}
