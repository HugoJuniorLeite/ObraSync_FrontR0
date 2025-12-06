import React from "react";
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
  addFotos, // ← função passada pelo WizardController
}) {

  // Mensagens de erro
  const [erroComentario, setErroComentario] = React.useState("");
  const [erroFotos, setErroFotos] = React.useState("");
  const [erroSelecao, setErroSelecao] = React.useState("");

  // ============================
  // VALIDAR ANTES DE FINALIZAR
  // ============================
  const validarAntesDeFinalizar = () => {
    let valido = true;

    setErroComentario("");
    setErroFotos("");
    setErroSelecao("");

    const querComentario = current.querComentario;
    const querFotos = current.querFotos;

    if (querComentario == null || querFotos == null) {
      setErroSelecao("Responda todas as perguntas antes de finalizar.");
      valido = false;
    }

    if (querComentario === "sim" && (!current.comentario || current.comentario.trim() === "")) {
      setErroComentario("Por favor, preencha o comentário.");
      valido = false;
    }

    if (querFotos === "sim" && (!current.fotos || current.fotos.length === 0)) {
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
                  background: current.querComentario === "sim" ? "#38bdf8" : "transparent",
                  borderColor: current.querComentario === "sim" ? "#38bdf8" : "#1e3a8a",
                  color: current.querComentario === "sim" ? "#082f49" : "#dbeafe",
                }}
                onClick={() => {
                  updateCurrentField("querComentario", "sim");
                }}
              >
                Sim
              </BigBtn>

              <BigBtn
                style={{
                  flex: 1,
                  background: current.querComentario === "nao" ? "#38bdf8" : "transparent",
                  borderColor: current.querComentario === "nao" ? "#38bdf8" : "#1e3a8a",
                  color: current.querComentario === "nao" ? "#082f49" : "#dbeafe",
                }}
                onClick={() => {
                  updateCurrentField("querComentario", "nao");
                  updateCurrentField("comentario", "");
                }}
              >
                Não
              </BigBtn>
            </div>

            {current.querComentario === "sim" && (
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
                  background: current.querFotos === "sim" ? "#38bdf8" : "transparent",
                  borderColor: current.querFotos === "sim" ? "#38bdf8" : "#1e3a8a",
                  color: current.querFotos === "sim" ? "#082f49" : "#dbeafe",
                }}
                onClick={() => updateCurrentField("querFotos", "sim")}
              >
                Sim
              </BigBtn>

              <BigBtn
                style={{
                  flex: 1,
                  background: current.querFotos === "nao" ? "#38bdf8" : "transparent",
                  borderColor: current.querFotos === "nao" ? "#38bdf8" : "#1e3a8a",
                  color: current.querFotos === "nao" ? "#082f49" : "#dbeafe",
                }}
                onClick={() => {
                  updateCurrentField("querFotos", "nao");
                  updateCurrentField("fotos", []);
                }}
              >
                Não
              </BigBtn>
            </div>

            {/* INPUT DE FOTOS */}
            {current.querFotos === "sim" && (
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
                      onChange={async (e) => {
                        await addFotos(Array.from(e.target.files));
                      }}
                    />
                  </label>
                </div>

                {erroFotos && (
                  <div style={{ color: "#f87171", marginTop: 6 }}>{erroFotos}</div>
                )}

                {/* PREVIEW PERSISTENTE */}
                {current.fotos?.length > 0 && (
                  <div
                    style={{
                      marginTop: 14,
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 10,
                    }}
                  >
                    {current.fotos.map((base64, idx) => (
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
                          src={base64}
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

          {/* BOTÃO FINALIZAR */}
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
