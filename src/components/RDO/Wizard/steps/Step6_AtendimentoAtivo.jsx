import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Step6_AtendimentoAtivo({
  Field,
  Label,
  Card,
  BigBtn,
  current,
  updateCurrentField,
  concluirAtendimento,
  next,
  prev,
}) {
  const [querComentario, setQuerComentario] = useState(null);
  const [querFotos, setQuerFotos] = useState(null);
  const [fotosPreview, setFotosPreview] = useState([]);

  // Mensagens de erro
  const [erroComentario, setErroComentario] = useState("");
  const [erroFotos, setErroFotos] = useState("");
  const [erroSelecao, setErroSelecao] = useState("");

  // ============================
  // VALIDAR ANTES DE FINALIZAR
  // ============================
  const validarAntesDeFinalizar = () => {
    let valido = true;

    setErroComentario("");
    setErroFotos("");
    setErroSelecao("");

    // OBRIGA responder SIM ou NÃO nas duas perguntas
    if (querComentario === null || querFotos === null) {
      setErroSelecao("Responda todas as perguntas antes de finalizar.");
      valido = false;
    }

    // Se SIM no comentário → obrigatório preencher texto
    if (querComentario === "sim" && (!current.comentario || current.comentario.trim() === "")) {
      setErroComentario("Por favor, preencha o comentário.");
      valido = false;
    }

    // Se SIM nas fotos → obrigatório ter ao menos 1 foto
    if (querFotos === "sim" && fotosPreview.length === 0) {
      setErroFotos("Envie pelo menos uma foto.");
      valido = false;
    }

    return valido;
  };

  const handleFinalizar = () => {
    if (!validarAntesDeFinalizar()) return;

    concluirAtendimento();
    next();
  };

  return (
    <motion.div
      key="s6"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      transition={{ duration: 0.24 }}
    >
      {/* 🔥 BLOQUEIO SE PAUSADO PARA ALMOÇO */}
      {current.pausadoParaAlmoco && (
        <Card style={{ marginTop: 12, padding: 12, borderColor: "#f59e0b" }}>
          <strong style={{ color: "#f59e0b" }}>
            Atendimento pausado para almoço
          </strong>
          <br />
          Finalize o almoço para continuar.
        </Card>
      )}

      {!current.pausadoParaAlmoco && (
        <Field style={{ marginTop: 12 }}>
          <Label>Atendimento</Label>

          {erroSelecao && (
            <div style={{ color: "#f87171", marginBottom: 10 }}>
              {erroSelecao}
            </div>
          )}

          {/* =============================
                PERGUNTA 1 — COMENTÁRIO
          ============================== */}
          <Card style={{ marginTop: 10, padding: 12 }}>
            <strong style={{ color: "#dbeafe" }}>Deseja inserir um comentário?</strong>

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <BigBtn
                style={{
                  flex: 1,
                  background: querComentario === "sim" ? "#38bdf8" : "transparent",
                  borderColor: querComentario === "sim" ? "#38bdf8" : "#1e3a8a",
                  color: querComentario === "sim" ? "#082f49" : "#dbeafe",
                }}
                onClick={() => {
                  setQuerComentario("sim");
                }}
              >
                Sim
              </BigBtn>

              <BigBtn
                style={{
                  flex: 1,
                  background: querComentario === "nao" ? "#38bdf8" : "transparent",
                  borderColor: querComentario === "nao" ? "#38bdf8" : "#1e3a8a",
                  color: querComentario === "nao" ? "#082f49" : "#dbeafe",
                }}
                onClick={() => {
                  setQuerComentario("nao");
                  updateCurrentField("comentario", "");
                }}
              >
                Não
              </BigBtn>
            </div>

            {querComentario === "sim" && (
              <>
                <textarea
                  value={current.comentario || ""}
                  onChange={(e) => updateCurrentField("comentario", e.target.value)}
                  placeholder="Digite seu comentário..."
                  style={{
                    width: "100%",
                    minHeight: 100,
                    marginTop: 14,
                    padding: 12,
                    background: "#0a1a2a",
                    color: "#e5f0ff",
                    border: "1px solid #1e3a8a",
                    borderRadius: 10,
                    fontSize: "1rem",
                  }}
                />

                {erroComentario && (
                  <div style={{ color: "#f87171", marginTop: 6 }}>{erroComentario}</div>
                )}
              </>
            )}
          </Card>

          {/* =============================
                PERGUNTA 2 — FOTOS
          ============================== */}
          <Card style={{ marginTop: 14, padding: 12 }}>
            <strong style={{ color: "#dbeafe" }}>Deseja incluir fotos?</strong>

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <BigBtn
                style={{
                  flex: 1,
                  background: querFotos === "sim" ? "#38bdf8" : "transparent",
                  borderColor: querFotos === "sim" ? "#38bdf8" : "#1e3a8a",
                  color: querFotos === "sim" ? "#082f49" : "#dbeafe",
                }}
                onClick={() => setQuerFotos("sim")}
              >
                Sim
              </BigBtn>

              <BigBtn
                style={{
                  flex: 1,
                  background: querFotos === "nao" ? "#38bdf8" : "transparent",
                  borderColor: querFotos === "nao" ? "#38bdf8" : "#1e3a8a",
                  color: querFotos === "nao" ? "#082f49" : "#dbeafe",
                }}
                onClick={() => {
                  setQuerFotos("nao");
                  updateCurrentField("fotos", []);
                  setFotosPreview([]);
                }}
              >
                Não
              </BigBtn>
            </div>

            {querFotos === "sim" && (
              <>
                <div style={{ marginTop: 16 }}>
                  <label
                    style={{
                      display: "inline-block",
                      background: "#0ea5e9",
                      padding: "10px 16px",
                      borderRadius: 10,
                      color: "#082f49",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Tirar / Selecionar fotos
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      multiple
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        const arr = files.map((f) => ({
                          file: f,
                          url: URL.createObjectURL(f),
                        }));

                        updateCurrentField("fotos", arr);
                        setFotosPreview(arr);
                      }}
                    />
                  </label>
                </div>

                {erroFotos && (
                  <div style={{ color: "#f87171", marginTop: 6 }}>{erroFotos}</div>
                )}

                {fotosPreview.length > 0 && (
                  <div
                    style={{
                      marginTop: 14,
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 10,
                    }}
                  >
                    {fotosPreview.map((f, idx) => (
                      <div
                        key={idx}
                        style={{
                          width: 82,
                          height: 82,
                          borderRadius: 10,
                          overflow: "hidden",
                          border: "1px solid #1e3a8a",
                        }}
                      >
                        <img
                          src={f.url}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </Card>

          {/* =============================
              BOTÃO FINALIZAR
          ============================== */}
          <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
            <BigBtn $primary style={{ width: "100%" }} onClick={handleFinalizar}>
              Finalizar atendimento
            </BigBtn>
          </div>
        </Field>
      )}
    </motion.div>
  );
}
