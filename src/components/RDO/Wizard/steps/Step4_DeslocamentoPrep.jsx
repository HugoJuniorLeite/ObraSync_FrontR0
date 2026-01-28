// src/components/RDO/steps/Step4_DeslocamentoPrep.js

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Check } from "lucide-react";
import { calcularRotaEndereco } from "../../helpers/rotaDestino";
import { ensureGpsInicio } from "../../helpers/ensureGpsInicio";

function hashEndereco(endereco) {
  return JSON.stringify({
    rua: endereco.rua?.trim().toLowerCase(),
    numero: String(endereco.numero).trim(),
    cidade: endereco.cidade?.trim().toLowerCase(),
  });
}

export default function Step4_DeslocamentoPrep({
  Field,
  Label,
  Card,
  BigBtn,
  current,
  updateCurrentField,
  iniciarDeslocamento,
  next,
  prev,
}) {
  const endereco = current?.endereco || {};
  const rotaSalva = current?.rota || null;

  const [rota, setRota] = useState(rotaSalva);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadRota() {
      if (!endereco?.rua || !endereco?.numero || !endereco?.cidade) return;

      const hash = hashEndereco(endereco);

      if (rotaSalva?.enderecoHash === hash) {
        setRota(rotaSalva);
        return;
      }

      setLoading(true);

      try {
        // 🔥 GARANTE GPS ÚNICO
        const gpsInicio = await ensureGpsInicio(current, updateCurrentField);
        if (!gpsInicio) {
          console.warn("GPS inicial ainda não disponível");
          return;
        }

        console.log(gpsInicio, "GPSINICIO")
        const r = await calcularRotaEndereco(endereco, gpsInicio);
        if (!r || !active) return;

        const novaRota = {
          distancia: r.distancia,
          duracao: r.duracao,
          polyline: r.polyline,
          destino: r.destino,
          enderecoHash: hash,
        };

        setRota(novaRota);
        updateCurrentField("rota", novaRota);
      } catch (e) {
        console.error("Erro ao calcular rota:", e);
      } finally {
        active && setLoading(false);
      }
    }

    loadRota();
    return () => (active = false);
  }, [
    endereco.rua,
    endereco.numero,
    endereco.bairro,
    endereco.cidade,
    endereco.estado,
  ]);

  return (
    <motion.div key="s4" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
      <Field>
        <Label>Deslocamento</Label>

        <Card style={{ marginTop: 10 }}>
          <div style={{ fontWeight: 700 }}>Resumo</div>
          <div style={{ color: "#9fb4c9", marginTop: 6 }}>
            Endereço: {endereco.rua} {endereco.numero} — {endereco.bairro} — {endereco.cidade}
          </div>
        </Card>

        <div style={{ marginTop: 12, color: "#9fb4c9" }}>
          Distância: {rota ? (rota.distancia / 1000).toFixed(2) + " km" : "—"}
          <br />
          Tempo: {rota ? Math.round(rota.duracao / 60) + " min" : "—"}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <BigBtn onClick={prev} disabled={loading}>
            <ChevronLeft size={18} /> Voltar
          </BigBtn>

          <BigBtn
            $primary
            disabled={!rota || loading}
            onClick={() => {
              iniciarDeslocamento();
              next();
            }}
          >
            <Check size={18} /> Iniciar deslocamento
          </BigBtn>
        </div>
      </Field>
    </motion.div>
  );
}
