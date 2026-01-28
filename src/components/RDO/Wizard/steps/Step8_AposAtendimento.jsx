
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { calcularETA } from "../../helpers/eta";
import { BASE_COORDS } from "../../helpers/distance";

export default function Step8_AposAtendimento({
  Field,
  Label,
  Card,
  BigBtn,
  jornada,
  fmt,
  marcarChegadaBase,
  abrirInterromperRetorno,

  // 🔥 adicionados para reproduzir o comportamento do monolito
  current,
  distanciaAteBase
}) {

  const ultimoAtendimento =
    jornada.atendimentos?.slice(-1)[0];

  const origemRetorno = ultimoAtendimento?.gpsFim;


  const ultimoRetorno =
    jornada.baseLogs
      ?.filter(i => i.tipo === "deslocamentoParaBase" && !i.finalizado)
      ?.slice(-1)[0];


  const etaBase = useMemo(() => {
    if (
      !origemRetorno ||
      !Number.isFinite(origemRetorno.lat) ||
      !Number.isFinite(origemRetorno.lng)
    )
      return null;

    return calcularETA(origemRetorno, BASE_COORDS);
  }, [origemRetorno]);


  return (
    <motion.div
      key="s9"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      transition={{ duration: 0.24 }}
    >

      {/* 🔥 BLOQUEIO SE PAUSADO PARA ALMOÇO */}
      {current?.pausadoParaAlmoco && (
        <Card style={{ marginTop: 12, padding: 12, borderColor: "#f59e0b" }}>
          <strong style={{ color: "#f59e0b" }}>
            Retorno à base pausado para almoço
          </strong>
          <br />
          Finalize o almoço para continuar.
        </Card>
      )}

      {/* Quando pausado → não renderiza o restante */}
      {!current?.pausadoParaAlmoco && (
        <Field style={{ marginTop: 12 }}>
          <Label>Retorno à base em andamento</Label>

          <Card style={{ padding: 12 }}>
            <div style={{ fontWeight: 700 }}>Retorno à base</div>

            <div style={{ color: "#9fb4c9", marginTop: 8 }}>
              Deslocamento iniciado em:{" "}
              {fmt(ultimoRetorno?.time)}

              <br />

              Distância estimada até a base:{" "}
              <strong>
                {etaBase
                  ? (etaBase.distancia / 1000).toFixed(2) + " km"
                  : "—"}
              </strong>

            </div>
          </Card>

          {/* BOTÕES */}
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <BigBtn
              $primary
              onClick={marcarChegadaBase}
              style={{ flex: 1 }}
            >
              Confirmar chegada <ChevronRight size={18} />
            </BigBtn>

            <BigBtn
              onClick={abrirInterromperRetorno}
              style={{ flex: 1 }}
            >
              Interromper retorno
            </BigBtn>
          </div>
        </Field>
      )}
    </motion.div>
  );
}
