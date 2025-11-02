
import { FormTitle, StyledInput, StyledLabel, StyledSelect, SubmitButton, TextArea } from "../../layouts/Theme";
import { Container, Title } from "../../layouts/StyledComponents";
import styled from "styled-components";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FormContext } from "./FormContext";
import PrincipalPreVgb from "./Croqui/PrincipalPreVgb";
import { useNavigate, useParams } from "react-router-dom";
import { croquisMap } from "../../data/croquisMap";
import JSZip from "jszip";
import { set, get } from "idb-keyval";
import createRdo from "../../services/apiRdo";
import html2canvas from "html2canvas";
import generateCroquiPDF from "../generateCroquiPDF";


const StepContainer = styled.div`
  margin-bottom: 10px;
  margin-top:15px;
  padding: 15px;
  background: linear-gradient(135deg, #2c2c2c, #3a3a3a);
  color: #ffffff;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #f5a400;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Label = styled.label`
  font-weight: bold;
  margin-top: 10px;
  display: block;
`;



const compressImage = (file, maxWidth = 1024, quality = 0.7) =>
  new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = Math.min(1, maxWidth / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => resolve(new File([blob], file.name, { type: file.type })),
        file.type,
        quality
      );
    };
  });


export default function RdoFomrExtensionInative() {
const navigate =useNavigate()

  // const croquiRef = useRef(null);
  const { id } = useParams(); // 🔹 pega ID da rota
  const initialFormData = {
    resultado: "",
    detalhe: "",
    comentario: "",
    valas: [{/* largura: "", comprimento: "", profundidade: "", tipoPiso: "" */ }],
    posicaoRamal: "",
    tipoRamal: "",
    materialRede: "",
    materialRamal: "",
    diametroRede: "",
    diametroRamal: "",
    ramalCortado: "",
    pressaoRede: "",
    endereco: "",
    localCorte: "",
    tipoCapeamento: "",
    fotoCalcadaAntes: null,
    fotoRamalExposto: null,
    fotoRamalCortado: null,
    fotoCroqui: null,
    fotoFrenteImovel: null,
    fotoPlacaRua: null,
    fotoProtecaoMecanica: null,
    fotoTachao: null,
    fotoProvisorio: null,
    componentes: [{}],
    soldas: [{}],
    tachaoRedondo: "",
    protecaoMecanica: "",
    faixaSinalizacao: "",
    valvFluxo: "",
  };

  const {
    formData,
    setFormData,
    loadFormById,
    handleAddItem,
    handleRemoveItem,
    handleFileChangeField,
    // selectedBill,
    loading,
  } = useContext(FormContext);

  const [step, setStep] = useState(0);

  // 🔹 Carregar RDO pelo ID da rota
  useEffect(() => {
    if (id) {
      loadFormById(id, { ...initialFormData, id });
    } else {
      setFormData(initialFormData);
    }
  }, [id, loadFormById, setFormData]);


  // ---------- Carregar
  //  formulário e fotos ----------
  const fileHandler = handleFileChangeField(formData, setFormData);

  useEffect(() => {
    const loadFotosFromDB = async () => {
      const fotosKeys = [
        "fotoCalcadaAntes",
        "fotoRamalExposto",
        "fotoRamalCortado",
        "fotoCroqui",
        "fotoFrenteImovel",
        "fotoPlacaRua",
        "fotoProtecaoMecanica",
        "fotoTachao",
        "fotoProvisorio",
      ];
      const fotosData = {};

      for (const field of fotosKeys) {
        const keyInDB = formData?.[`${field}Key`];
        if (!keyInDB) continue;

        const file = await get(keyInDB);
        if (file) fotosData[field] = URL.createObjectURL(file);
      }

      setFormData((prev) => ({ ...prev, ...fotosData }));
    };

    if (id) loadFormById(id, { ...initialFormData, id });
    else setFormData(initialFormData);

    loadFotosFromDB();
  }, [id, loadFormById, setFormData]);

  // Navegação
  const handleNext = () => { if (step < steps.length - 1) setStep(step + 1); };
  const handlePrev = () => { if (step > 0) setStep(step - 1); };

  const getCroquiKey = (localCorte, tipoRamal, ramalCortado) => {
    if (!localCorte || !tipoRamal) return "principal_geral"; // fallback

    if (ramalCortado === "principal") {
      if (localCorte === "geral") return "principal_geral"; // ou dois cortes
      if (localCorte === "geralExtremidadeRemanescente") return "principal_geralComExtremidadeRemanescente"; // ou dois cortes
      if (localCorte === "preVgb") return "principal_preVgb"; // ou dois cortes
      if (localCorte === "posVgb") return "principal_posVgb"; // ou dois cortes
    }

    if (ramalCortado === "adjacenteEsquerda") {
      if (localCorte === "geral") return "geral_esquerda"; // ou dois cortes
      if (localCorte === "preVgb") return "preVgb_esquerda_doisCortes"; // ou dois cortes
      if (localCorte === "preVgbAdjacente") return "preVgb_esquerda_ramalAdjacente"; // ramal adjacente
      if (localCorte === "posVgb") return "posVgb_esquerda_umCorte"; // um corte
      if (localCorte === "posVgbDoisCortes") return "posVgb_esquerda_doisCortes"; // dois cortes
    }

    if (ramalCortado === "adjacenteDireita") {
      if (localCorte === "geral") return "geral_direita"; // ou dois cortes
      if (localCorte === "preVgb") return "preVgb_direita_doisCortes"; // ou dois cortes
      if (localCorte === "preVgbAdjacente") return "preVgb_direita_ramalAdjacente"; // ramal adjacente
      if (localCorte === "posVgb") return "posVgb_direita_umCorte"; // um corte
      if (localCorte === "posVgbDoisCortes") return "posVgb_direita_doisCortes"; // dois cortes
    }
    return "principal_geral"; // default
  };



const croquiKey = getCroquiKey(
  formData.localCorte,
  formData.tipoRamal,
  formData.ramalCortado
);
const croquiData = croquisMap[croquiKey] || croquisMap["principal_geral"];


  const handleSubmit = async () => {


    try {
      // Campos das fotos que você quer enviar
      const fotosFields = [
        "fotoCalcadaAntes",
        "fotoRamalExposto",
        "fotoRamalCortado",
        "fotoFrenteImovel",
        "fotoPlacaRua",
        "fotoProtecaoMecanica",
        "fotoTachao",
        "fotoProvisorio",
        // Descomente se usar:
        "fotoCroqui",
      ];

      // Recupera os arquivos do IndexedDB
      const fotos = {};
      for (const field of fotosFields) {
        const keyInDB = formData[`${field}Key`];
        if (!keyInDB) continue;
        const file = await get(keyInDB);
        if (file) fotos[field] = file;
      }

      if (Object.keys(fotos).length === 0) {
        alert("Nenhuma foto para enviar!");
        return;
      }

      // ✅ DEBUG: Ver fotos no console
      console.group("📸 Fotos a serem enviadas");
      for (const [field, file] of Object.entries(fotos)) {
        console.log(`📷 ${field}:`, {
          name: file.name,
          size: `${(file.size / 1024).toFixed(2)} KB`,
          type: file.type,
        });

        // Gera URL para visualização
        const url = URL.createObjectURL(file);
        console.log(`🔗 ${field} URL:`, url);

        // Cria imagem para preview no console
        const img = new Image();
        img.src = url;
        img.style = "max-width: 200px; border: 1px solid #ccc; margin: 5px;";
        img.onload = () => {
          console.log(`🖼️ Preview de ${field}:`, img);
          URL.revokeObjectURL(url); // libera memória após carregar
        };
      }
      console.groupEnd();



      // Compacta as fotos (opcional, mas recomendado)
      const fotosCompactadas = {};
      for (const [field, file] of Object.entries(fotos)) {
        try {
          const compressed = await compressImage(file);
          fotosCompactadas[field] = compressed;
        } catch (err) {
          console.warn(`Falha ao comprimir ${field}:`, err);
          fotosCompactadas[field] = file; // mantém original se falhar
        }
      }


      // --- 🔑 Pega a key do croqui ---
      const croquiKey = getCroquiKey(
        formData.localCorte,
        formData.tipoRamal,
        formData.ramalCortado
      );
      const croquiData = croquisMap[croquiKey] || croquisMap["principal_geral"];


      // Cria o objeto RDO (sem as fotos, pois elas vão como campos separados)
      const rdoJson = {
        id: formData.id,
        resultado: formData.resultado,
        detalhe: formData.detalhe,
        comentario: formData.comentario,
        endereco: formData.endereco,
        localCorte: formData.localCorte,
        ramalCortado: formData.ramalCortado,
        tipoRamal: formData.tipoRamal,
        posicaoRamal: formData.posicaoRamal,
        tipoCapeamento: formData.tipoCapeamento,
        materialRamal: formData.materialRamal,
        materialRede: formData.materialRede,
        diametroRamal: formData.diametroRamal,
        diametroRede: formData.diametroRede,
        pressaoRede: formData.pressaoRede,
        valvFluxo: formData.valvFluxo,
        protecaoMecanica: formData.protecaoMecanica,
        tachaoRedondo: formData.tachaoRedondo,
        faixaSinalizacao: formData.faixaSinalizacao,
        valas: formData.valas || [],
        componentes: formData.componentes || [],
        soldas: formData.soldas || [],
        croquis: {
          key: croquiData.namecroqui,
          campos: formData.croquis || []
        }
      };

      console.log(rdoJson, "formData")


      // ✅ Cria FormData
      const formDataEnvio = new FormData();
      formDataEnvio.append("data", JSON.stringify(rdoJson));


    console.log("🔹 Croqui file:", croquiData.file);


      // ✅ Adiciona cada foto como campo individual
      for (const [field, file] of Object.entries(fotosCompactadas)) {
        formDataEnvio.append(field, file); // ex: "fotoCalcadaAntes", file
      }

      // ✅ ENVIA PARA O BACKEND — SEM DEFINIR CONTENT-TYPE!
      const response = await createRdo.postRdo(formDataEnvio);
      console.log(response,"retorno do envio")
   if (!response || !response.message || response.message !== "RDO criado com sucesso!") {
  throw new Error("Erro ao enviar RDO");
}
      
      alert("✅ RDO finalizado e fotos enviadas com sucesso!");
      // Opcional: redirecionar ou resetar form
      navigate(`/pdf/${id}`);
      
    } catch (err) {
      // console.log(response,"retorno do envio")
      console.error("Erro no envio:", err);
      alert("❌ Falha ao enviar RDO ou fotos. Verifique o console.");
    }
  };

  if (loading || !formData) return <div>Carregando RDO...</div>;
  
  // Steps
  // const getSteps = () => {
  //   const stepResultado = {
  //     title: "Resultado",
  //     content: (
  //       <>
  //         <StyledSelect
  //           value={formData.resultado || ""}
  //           onChange={(e) => {
  //             const value = e.target.value;
  //             if (value === "nao_executada") {
  //               // Reseta todos os campos e mantém apenas o resultado
  //               setFormData({ ...initialFormData, resultado: value });
  //             } else {
  //               setFormData({ ...formData, resultado: value, comentario: "", detalhe: "" });
  //             }
  //           }}
  //         >
  //           <option value="">Selecione um resultado</option>
  //           <option value="executada">Executado</option>
  //           <option value="nao_executada">Não Executado</option>
  //         </StyledSelect>

  //         {formData.resultado === "executada" && (
  //           <>
  //             <div>
  //               Resultado
  //             </div>
  //             <StyledSelect
  //               value={formData.detalhe || ""}
  //               onChange={e => setFormData({ ...formData, detalhe: e.target.value })}
  //             >
  //               <option value="">Selecione um detalhe</option>
  //               <option value="executada">Executado</option>
  //               <option value="vala_perdida">Vala perdida</option>
  //             </StyledSelect>
  //           </>
  //         )}

  //         {formData.resultado === "nao_executada" && (
  //           <>
  //             <StyledSelect
  //               value={formData.detalhe || ""}
  //               onChange={e => setFormData({ ...formData, detalhe: e.target.value })}
  //             >
  //               <option value="">Selecione motivo</option>
  //               <option value="cliente_nao_autoriza">Cliente não autoriza</option>
  //               <option value="com_consumo">Com consumo</option>
  //               <option value="impossibilidade_tecnica">Imóvel não localizado</option>
  //             </StyledSelect>

  //             <TextArea
  //               value={formData.comentario}
  //               onChange={e => setFormData({ ...formData, comentario: e.target.value })}
  //               rows={3}
  //               placeholder="Descreva os motivos que impedem a execução da atividade"
  //             />
  //           </>
  //         )}
  //       </>
  //     )
  //   };

  //   if (formData.resultado === "nao_executada") return [stepResultado];

  //   // Executada: todos os steps
  //   return [
  //     stepResultado,
  //     {
  //       title: "Fotos antes da atividade",
  //       content: ["fotoPlacaRua", "fotoFrenteImovel", "fotoCalcadaAntes"].map(f => (
  //         <div key={f}>
  //           <StyledLabel>{f.replace(/([A-Z])/g, " $1")}</StyledLabel>
  //           {formData[f] && <img src={formData[f]} width={100} alt={f} />}
  //           <StyledInput
  //             type="file"
  //             accept="image/*"
  //             capture="camera"
  //             onChange={e => fileHandler(f)(e.target.files[0])}
  //           />
  //         </div>
  //       ))
  //     },
  //     {
  //       title: "Dimensões da Vala",
  //       content: (formData.valas || []).map((v, i) => (
  //         <div key={i} style={{ borderBottom: "1px solid #ccc", marginBottom: "10px" }}>
  //           {["largura", "comprimento", "profundidade"].map(f => (
  //             <div key={f}>
  //               <StyledLabel>{f}</StyledLabel>
  //               <StyledInput value={v[f]} onChange={e => {
  //                 const newValas = [...formData.valas];
  //                 newValas[i][f] = e.target.value;
  //                 setFormData({ ...formData, valas: newValas });
  //               }} />
  //             </div>
  //           ))}
  //           <StyledLabel>Tipo de Piso</StyledLabel>
  //           <StyledSelect value={v.tipoPiso} onChange={e => {
  //             const newValas = [...formData.valas];
  //             newValas[i].tipoPiso = e.target.value;
  //             setFormData({ ...formData, valas: newValas });
  //           }}>
  //             <option value="">Selecione</option>
  //             <option>Bloquete</option>
  //             <option>Cerâmica</option>
  //             <option>Concreto</option>
  //             <option>Outro</option>
  //           </StyledSelect>
  //           <SubmitButton type="button" onClick={() => handleRemoveItem("valas", i)}>- Remover</SubmitButton>
  //         </div>
  //       )).concat(
  //         <SubmitButton key="addVala" type="button" onClick={() => handleAddItem("valas", { largura: "", comprimento: "", profundidade: "", tipoPiso: "" })}>+ Adicionar</SubmitButton>
  //       )
  //     },
  //     {
  //       title: "Material do Ramal",
  //       content: (
  //         <StyledSelect
  //           value={formData.materialRamal}
  //           onChange={(e) => setFormData({ ...formData, materialRamal: e.target.value })}
  //         >
  //           <option value="">Selecione</option>
  //           <option value="Aço">Aço</option>
  //           <option value="PE80">PE80</option>
  //           <option value="PE100">PE100</option>
  //           <option value="Outro">Outro</option>
  //         </StyledSelect>
  //       ),
  //     },
  //     {
  //       title: "Diametro do Ramal",
  //       content: (
  //         <StyledSelect
  //           value={formData.diametroRamal}
  //           onChange={(e) => setFormData({ ...formData, diametroRamal: e.target.value })}
  //         >
  //           <option value="">Selecione</option>
  //           <option value="20mm">20mm</option>
  //           <option value="32mm">32mm</option>
  //           <option value="63mm">63mm</option>
  //           <option value="90mm">90mm</option>
  //           <option value="125mm">125mm</option>
  //           <option value="Outro"> outro</option>
  //         </StyledSelect>
  //       ),
  //     },
  //     {
  //       title: "Ramal Cortado",
  //       content: (
  //         <StyledSelect
  //           value={formData.ramalCortado}
  //           onChange={(e) => setFormData({ ...formData, ramalCortado: e.target.value })}
  //         >
  //           <option value="">Selecione</option>
  //           <option value="principal">Principal</option>
  //           <option value="adjacenteDireita">Adjacente derivado da direira </option>
  //           <option value="adjacenteEsquerda">Adjacente derivado da esquerda</option>
  //         </StyledSelect>
  //       ),
  //     },
  //     {
  //       title: "Tipo do ramal",
  //       content: (
  //         <StyledSelect
  //           value={formData.tipoRamal}
  //           onChange={(e) => setFormData({ ...formData, tipoRamal: e.target.value })}
  //         >
  //           <option value="">Selecione</option>
  //           <option value="mesmoLado">mesmo lado</option>
  //           <option value="ladoOposto">lado oposto</option>
  //         </StyledSelect>
  //       ),
  //     },
  //     {
  //       ...(formData.ramalCortado === "principal"
  //         ? {
  //           title: "Local do corte",
  //           content: (
  //             <StyledSelect
  //               value={formData.localCorte}
  //               onChange={(e) =>
  //                 setFormData({ ...formData, localCorte: e.target.value })
  //               }
  //             >
  //               <option value="">Selecione</option>
  //               <option value="geral">Geral</option>
  //               <option value="geralExtremidadeRemanescente">
  //                 Geral com extremidade remanescente
  //               </option>
  //               <option value="preVgb">Pré VGB</option>
  //               <option value="posVgb">Pós VGB </option>
  //             </StyledSelect>
  //           ),
  //         }
  //         : {

  //           title: "Local do corte",
  //           content: (
  //             <StyledSelect
  //               value={formData.localCorte}
  //               onChange={(e) =>
  //                 setFormData({ ...formData, localCorte: e.target.value })
  //               }
  //             >
  //               <option value="">Selecione</option>
  //               <option value="geral">Geral</option>
  //               <option value="preVgb">Pré VGB (dois cortes)</option>
  //               <option value="preVgbAdjacente">
  //                 Pré VGB no ramal adjacente
  //               </option>
  //               <option value="posVgb">Pós VGB (um corte)</option>
  //               <option value="posVgbDoisCortes">Pós VGB (dois cortes)</option>
  //             </StyledSelect>
  //           ),


  //         })
  //     },
  //     {
  //       title: "Tipo do capeamento",
  //       content: (
  //         <StyledSelect
  //           value={formData.tipoCapeamento}
  //           onChange={(e) => setFormData({ ...formData, tipoCapeamento: e.target.value })}
  //         >
  //           <option value="">Selecione</option>
  //           <option value="flange">Flangeado</option>
  //           <option value="capRosca">Cap Roscado</option>
  //           <option value="capSoldadoAco">Cap Soldado (Aço)</option>
  //           <option value="capSoldadoPE">Cap Soldado (PE)</option>
  //         </StyledSelect>
  //       ),
  //     },
  //     {
  //       title: "Croqui",
  //       content: (() => {
  //         const croquiKey = getCroquiKey(
  //           formData.localCorte,
  //           formData.tipoRamal,
  //           formData.ramalCortado
  //         );
  //         const croquiData = croquisMap[croquiKey] || croquisMap["principal_geral"];

  //         return (
  //           // <div id="croqui-container" ref={croquiRef}>
  //             <PrincipalPreVgb
  //               croquiFields={croquiData.fields}
  //               croquiFile={croquiData.file}
  //               formData={formData}
  //               setFormData={setFormData}
  //               BillId={id}
  //               getCroquiKey={getCroquiKey}
  //             />
  //           // </div>
  //         );
  //       })(),
  //     },
  //     {
  //       title: "Isométrico",
  //       content: (() => {
  //         const croquiKey = getCroquiKey(
  //           formData.localCorte,
  //           formData.tipoRamal,
  //           formData.ramalCortado
  //         );
  //         const croquiData = croquisMap[croquiKey] || croquisMap["principal_geral"];

  //         return (
  //           <div style={{ textAlign: "center" }}>
  //             <img
  //               src={croquiData.fileIsometric}
  //               alt="Croqui Isométrico"
  //               style={{
  //                 maxWidth: "100%",
  //                 border: "1px solid #ccc",
  //                 borderRadius: "8px",
  //               }}
  //             />
  //           </div>
  //         );
  //       })(),
  //     },
  //     {
  //       title: "Fotos durante",
  //       content: ["fotoRamalExposto", "fotoRamalCortado", "fotoProtecaoMecanica", "fotoProvisorio", "fotoTachao"].map(f => (
  //         <div key={f}>
  //           <StyledLabel>{f.replace(/([A-Z])/g, " $1")}</StyledLabel>
  //           {formData[f] && <img src={formData[f]} width={100} alt={f} />}
  //           <StyledInput type="file" accept="image/*" capture="camera" onChange={e => fileHandler(f)(e.target.files[0])} />
  //         </div>
  //       ))
  //     },
  //     {
  //       title: "Posição do Ramal",
  //       content: (
  //         <StyledSelect
  //           value={formData.posicaoRamal}
  //           onChange={(e) => setFormData({ ...formData, posicaoRamal: e.target.value })}
  //         >
  //           <option value="">Selecione</option>
  //           <option value="Entre lotes">Entre lotes</option>
  //           <option value="Esquina direita">Esquina direita</option>
  //           <option value="Esquina esquerda">Esquina esquerda</option>
  //         </StyledSelect>
  //       ),
  //     },
  //     {
  //       title: "Valv. Ex. Fluxo",
  //       content: (
  //         <StyledSelect
  //           value={formData.valvFluxo}
  //           onChange={(e) => setFormData({ ...formData, valvFluxo: e.target.value })}
  //         >
  //           <option value="">Selecione</option>
  //           <option value="false">não</option>
  //           <option value="true">sim</option>
  //         </StyledSelect>
  //       ),
  //     },
  //     {
  //       title: "Material da Rede",
  //       content: (
  //         <StyledSelect
  //           value={formData.materialRede}
  //           onChange={(e) => setFormData({ ...formData, materialRede: e.target.value })}
  //         >
  //           <option value="">Selecione</option>
  //           <option value="Aço">Aço</option>
  //           <option value="PE80">PE80</option>
  //           <option value="PE100">PE100</option>
  //           <option value="Outro">Outro</option>
  //         </StyledSelect>
  //       ),
  //     },
  //     {
  //       title: "Diametro da Rede",
  //       content: (
  //         <StyledSelect
  //           value={formData.diametroRede}
  //           onChange={(e) => setFormData({ ...formData, diametroRede: e.target.value })}
  //         >
  //           <option value="">Selecione</option>
  //           <option value="40mm">40mm</option>
  //           <option value="63mm">63mm</option>
  //           <option value="90mm">90mm</option>
  //           <option value="125mm">125mm</option>
  //           <option value="Outro">Outro</option>
  //         </StyledSelect>
  //       ),
  //     },
  //     {
  //       title: "Pressão da Rede",
  //       content: (
  //         <StyledSelect
  //           value={formData.pressaoRede}
  //           onChange={(e) => setFormData({ ...formData, pressaoRede: e.target.value })}
  //         >
  //           <option value="">Selecione</option>
  //           <option value="250mbar">250mbar</option>
  //           <option value="750mbar">750mbar</option>
  //           <option value="1Bar">1Bar</option>
  //           <option value="4Bar">4Bar</option>
  //           <option value="7bar"> 7bar</option>
  //         </StyledSelect>
  //       ),
  //     },
  //     {
  //       title: "Proteção mecânica",
  //       content: (
  //         <StyledSelect
  //           value={formData.protecaoMecanica}
  //           onChange={(e) => setFormData({ ...formData, protecaoMecanica: e.target.value })}
  //         >
  //           <option value="">Selecione</option>
  //           <option value="false">Não</option>
  //           <option value="true">Sim</option>
  //         </StyledSelect>
  //       ),
  //     },
  //     {
  //       title: "Faixa de sinalização instalada",
  //       content: (
  //         <StyledSelect
  //           value={formData.faixaSinalizacao}
  //           onChange={(e) => setFormData({ ...formData, faixaSinalizacao: e.target.value })}
  //         >
  //           <option value="">Selecione</option>
  //           <option value="false">Não</option>
  //           <option value="true">Sim</option>
  //         </StyledSelect>
  //       ),
  //     },
  //     {
  //       title: "Tachão instalado",
  //       content: (
  //         <StyledSelect
  //           value={formData.tachaoRedondo}
  //           onChange={(e) => setFormData({ ...formData, tachaoRedondo: e.target.value })}
  //         >
  //           <option value="">Selecione</option>
  //           <option value="false">Não</option>
  //           <option value="true">Sim</option>
  //         </StyledSelect>
  //       ),
  //     },
  //     {
  //       title: "Componentes",
  //       content: (formData.componentes || []).map((c, i) => (
  //         <div key={i}>
  //           {["componente", "de", "fabricante", "lote"].map(f => (
  //             <StyledInput key={f} value={c[f] || ""} placeholder={f} onChange={e => {
  //               const newC = [...formData.componentes];
  //               newC[i][f] = e.target.value;
  //               setFormData({ ...formData, componentes: newC });
  //             }} />
  //           ))}
  //           <SubmitButton type="button" onClick={() => handleRemoveItem("componentes", i)}>- Remover</SubmitButton>
  //         </div>
  //       )).concat(
  //         <SubmitButton key="addComp" type="button" onClick={() => handleAddItem("componentes", { componente: "", de: "", fabricante: "", lote: "" })}>+ Adicionar</SubmitButton>
  //       )
  //     },
  //     {
  //       title: "Soldas",
  //       content: (formData.soldas || []).map((s, i) => (
  //         <div key={i}>
  //           {["componente", "numeroSolda", "tempoResfriamento"].map(f => (
  //             <StyledInput key={f} value={s[f] || ""} placeholder={f} onChange={e => {
  //               const newS = [...formData.soldas];
  //               newS[i][f] = e.target.value;
  //               setFormData({ ...formData, soldas: newS });
  //             }} />
  //           ))}
  //           <StyledSelect value={formData.soldas[i].aprovado || ""} onChange={e => {
  //             const newS = [...formData.soldas];
  //             newS[i].aprovado = e.target.value;
  //             setFormData({ ...formData, soldas: newS });
  //           }}>
  //             <option value="">Aprovado?</option>
  //             <option>Sim</option>
  //             <option>Não</option>
  //           </StyledSelect>
  //           <SubmitButton
  //             type="button"
  //             onClick={() => handleRemoveItem("soldas", i)}
  //           >
  //             - Remover
  //           </SubmitButton>
  //         </div>

  //       )).concat(
  //         <SubmitButton key="addSolda" type="button" onClick={() => handleAddItem("soldas", { componente: "", numeroSolda: "", tempoResfriamento: "", aprovado: "" })}>+ Adicionar</SubmitButton>
  //       )
  //     }
  //   ];
  // };



  //trecho novo

const getSteps = () => {
  // Step 1: Resultado
  const stepResultado = {
    title: "Resultado",
    content: (
      <>
        <StyledSelect
          value={formData.resultado || ""}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "nao_executada") {
              setFormData({ ...formData, resultado: value, detalhe: "", comentario: "" });
            } else {
              setFormData({ ...formData, resultado: value, detalhe: "", comentario: "" });
            }
          }}
        >
          <option value="">Selecione um resultado</option>
          <option value="executada">Executado</option>
          <option value="nao_executada">Não Executado</option>
        </StyledSelect>

        {formData.resultado === "executada" && (
          <StyledSelect
            value={formData.detalhe || ""}
            onChange={e => setFormData({ ...formData, detalhe: e.target.value })}
          >
            <option value="">Selecione um detalhe</option>
            <option value="executada">Executado</option>
            <option value="vala_perdida">Vala perdida</option>
          </StyledSelect>
        )}

        {formData.resultado === "nao_executada" && (
          <>
            <StyledSelect
              value={formData.detalhe || ""}
              onChange={e => setFormData({ ...formData, detalhe: e.target.value })}
            >
              <option value="">Selecione motivo</option>
              <option value="cliente_nao_autoriza">Cliente não autoriza</option>
              <option value="com_consumo">Com consumo</option>
              <option value="impossibilidade_tecnica">Imóvel não localizado</option>
            </StyledSelect>

            <TextArea
              value={formData.comentario || ""}
              onChange={e => setFormData({ ...formData, comentario: e.target.value })}
              rows={3}
              placeholder="Descreva os motivos que impedem a execução da atividade"
            />
          </>
        )}
      </>
    )
  };

  // Se o resultado não é executada, retorna apenas este step
  if (formData.resultado === "nao_executada") return [stepResultado];


    if (formData.detalhe === "vala_perdida") {
    return [
      stepResultado,
        // Fotos Antes
    {
      title: "Fotos antes da atividade",
      content: ["fotoPlacaRua", "fotoFrenteImovel", "fotoCalcadaAntes"].map(f => (
        <div key={f}>
          <StyledLabel>{f.replace(/([A-Z])/g, " $1")}</StyledLabel>
          {formData[f] && <img src={formData[f]} width={100} alt={f} />}
          <StyledInput
            type="file"
            accept="image/*"
            capture="camera"
            onChange={e => fileHandler(f)(e.target.files[0])}
          />
        </div>
      ))
    },
      {
        title: "Fotos e Dimensões da Vala",
        content: (
          <>
            {(formData.valas || []).map((v, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                {["largura", "comprimento", "profundidade"].map(f => (
                  <div key={f}>
                    <StyledLabel>{f}</StyledLabel>
                    <StyledInput
                      value={v[f] || ""}
                      onChange={e => {
                        const newValas = [...formData.valas];
                        newValas[i][f] = e.target.value;
                        setFormData({ ...formData, valas: newValas });
                      }}
                    />
                  </div>
                ))}
              </div>
            ))}
          </>
        )
      },
          // Fotos Antes
    {
      title: "Fotos durante a atividade",
      content: ["fotoPlacaRua", "fotoFrenteImovel", "fotoCalcadaAntes"].map(f => (
        <div key={f}>
          <StyledLabel>{f.replace(/([A-Z])/g, " $1")}</StyledLabel>
          {formData[f] && <img src={formData[f]} width={100} alt={f} />}
          <StyledInput
            type="file"
            accept="image/*"
            capture="camera"
            onChange={e => fileHandler(f)(e.target.files[0])}
          />
        </div>
      ))
    },
    ];
  }


  // Steps extras (executada)
  const stepExtras = [
    // Fotos Antes
    {
      title: "Fotos antes da atividade",
      content: ["fotoPlacaRua", "fotoFrenteImovel", "fotoCalcadaAntes"].map(f => (
        <div key={f}>
          <StyledLabel>{f.replace(/([A-Z])/g, " $1")}</StyledLabel>
          {formData[f] && <img src={formData[f]} width={100} alt={f} />}
          <StyledInput
            type="file"
            accept="image/*"
            capture="camera"
            onChange={e => fileHandler(f)(e.target.files[0])}
          />
        </div>
      ))
    },

    // Dimensões da Vala
    {
      title: "Dimensões da Vala",
      content: (formData.valas || []).map((v, i) => (
        <div key={i} style={{ borderBottom: "1px solid #ccc", marginBottom: "10px" }}>
          {["largura", "comprimento", "profundidade"].map(f => (
            <div key={f}>
              <StyledLabel>{f}</StyledLabel>
              <StyledInput
                value={v[f]}
                onChange={e => {
                  const newValas = [...formData.valas];
                  newValas[i][f] = e.target.value;
                  setFormData({ ...formData, valas: newValas });
                }}
              />
            </div>
          ))}
          <StyledLabel>Tipo de Piso</StyledLabel>
          <StyledSelect
            value={v.tipoPiso}
            onChange={e => {
              const newValas = [...formData.valas];
              newValas[i].tipoPiso = e.target.value;
              setFormData({ ...formData, valas: newValas });
            }}
          >
            <option value="">Selecione</option>
            <option>Bloquete</option>
            <option>Cerâmica</option>
            <option>Concreto</option>
            <option>Outro</option>
          </StyledSelect>
          <SubmitButton type="button" onClick={() => handleRemoveItem("valas", i)}>- Remover</SubmitButton>
        </div>
      )).concat(
        <SubmitButton
          key="addVala"
          type="button"
          onClick={() => handleAddItem("valas", { largura: "", comprimento: "", profundidade: "", tipoPiso: "" })}
        >
          + Adicionar
        </SubmitButton>
      )
    },

    // Material do Ramal
    {
      title: "Material do Ramal",
      content: (
        <StyledSelect
          value={formData.materialRamal}
          onChange={(e) => setFormData({ ...formData, materialRamal: e.target.value })}
        >
          <option value="">Selecione</option>
          <option value="Aço">Aço</option>
          <option value="PE80">PE80</option>
          <option value="PE100">PE100</option>
          <option value="Outro">Outro</option>
        </StyledSelect>
      )
    },

    // Diâmetro do Ramal
    {
      title: "Diâmetro do Ramal",
      content: (
        <StyledSelect
          value={formData.diametroRamal}
          onChange={(e) => setFormData({ ...formData, diametroRamal: e.target.value })}
        >
          <option value="">Selecione</option>
          <option value="20mm">20mm</option>
          <option value="32mm">32mm</option>
          <option value="63mm">63mm</option>
          <option value="90mm">90mm</option>
          <option value="125mm">125mm</option>
          <option value="Outro">Outro</option>
        </StyledSelect>
      )
    },

    // Ramal Cortado
     {
        title: "Ramal Cortado",
        content: (
          <StyledSelect
            value={formData.ramalCortado}
            onChange={(e) => setFormData({ ...formData, ramalCortado: e.target.value })}
          >
            <option value="">Selecione</option>
            <option value="principal">Principal</option>
            <option value="adjacenteDireita">Adjacente derivado da direira </option>
            <option value="adjacenteEsquerda">Adjacente derivado da esquerda</option>
          </StyledSelect>
        ),
      },
      {
        title: "Tipo do ramal",
        content: (
          <StyledSelect
            value={formData.tipoRamal}
            onChange={(e) => setFormData({ ...formData, tipoRamal: e.target.value })}
          >
            <option value="">Selecione</option>
            <option value="mesmoLado">mesmo lado</option>
            <option value="ladoOposto">lado oposto</option>
          </StyledSelect>
        ),
      },
      {
        ...(formData.ramalCortado === "principal"
          ? {
            title: "Local do corte",
            content: (
              <StyledSelect
                value={formData.localCorte}
                onChange={(e) =>
                  setFormData({ ...formData, localCorte: e.target.value })
                }
              >
                <option value="">Selecione</option>
                <option value="geral">Geral</option>
                <option value="geralExtremidadeRemanescente">
                  Geral com extremidade remanescente
                </option>
                <option value="preVgb">Pré VGB</option>
                <option value="posVgb">Pós VGB </option>
              </StyledSelect>
            ),
          }
          : {

            title: "Local do corte",
            content: (
              <StyledSelect
                value={formData.localCorte}
                onChange={(e) =>
                  setFormData({ ...formData, localCorte: e.target.value })
                }
              >
                <option value="">Selecione</option>
                <option value="geral">Geral</option>
                <option value="preVgb">Pré VGB (dois cortes)</option>
                <option value="preVgbAdjacente">
                  Pré VGB no ramal adjacente
                </option>
                <option value="posVgb">Pós VGB (um corte)</option>
                <option value="posVgbDoisCortes">Pós VGB (dois cortes)</option>
              </StyledSelect>
            ),


          })
      },

    // Tipo do Capeamento
    {
      title: "Tipo do Capeamento",
      content: (
        <StyledSelect
          value={formData.tipoCapeamento}
          onChange={(e) => setFormData({ ...formData, tipoCapeamento: e.target.value })}
        >
          <option value="">Selecione</option>
          <option value="flange">Flangeado</option>
          <option value="capRosca">Cap Roscado</option>
          <option value="capSoldadoAco">Cap Soldado (Aço)</option>
          <option value="capSoldadoPE">Cap Soldado (PE)</option>
        </StyledSelect>
      )
    },

 {
        title: "Croqui",
        content: (() => {
          const croquiKey = getCroquiKey(
            formData.localCorte,
            formData.tipoRamal,
            formData.ramalCortado
          );
          const croquiData = croquisMap[croquiKey] || croquisMap["principal_geral"];

          return (
            // <div id="croqui-container" ref={croquiRef}>
              <PrincipalPreVgb
                croquiFields={croquiData.fields}
                croquiFile={croquiData.file}
                formData={formData}
                setFormData={setFormData}
                BillId={id}
                getCroquiKey={getCroquiKey}
              />
            // </div>
          );
        })(),
      },
      {
        title: "Isométrico",
        content: (() => {
          const croquiKey = getCroquiKey(
            formData.localCorte,
            formData.tipoRamal,
            formData.ramalCortado
          );
          const croquiData = croquisMap[croquiKey] || croquisMap["principal_geral"];

          return (
            <div style={{ textAlign: "center" }}>
              <img
                src={croquiData.fileIsometric}
                alt="Croqui Isométrico"
                style={{
                  maxWidth: "100%",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
              />
            </div>
          );
        })(),
      },

    // Fotos Durante
    {
      title: "Fotos durante",
      content: ["fotoRamalExposto", "fotoRamalCortado", "fotoProtecaoMecanica", "fotoProvisorio", "fotoTachao"].map(f => (
        <div key={f}>
          <StyledLabel>{f.replace(/([A-Z])/g, " $1")}</StyledLabel>
          {formData[f] && <img src={formData[f]} width={100} alt={f} />}
          <StyledInput type="file" accept="image/*" capture="camera" onChange={e => fileHandler(f)(e.target.files[0])} />
        </div>
      ))
    },

    // Posição do Ramal
    {
      title: "Posição do Ramal",
      content: (
        <StyledSelect
          value={formData.posicaoRamal}
          onChange={(e) => setFormData({ ...formData, posicaoRamal: e.target.value })}
        >
          <option value="">Selecione</option>
          <option value="Entre lotes">Entre lotes</option>
          <option value="Esquina direita">Esquina direita</option>
          <option value="Esquina esquerda">Esquina esquerda</option>
        </StyledSelect>
      )
    },

    // Valv. Ex. Fluxo
    {
      title: "Valv. Ex. Fluxo",
      content: (
        <StyledSelect
          value={formData.valvFluxo}
          onChange={(e) => setFormData({ ...formData, valvFluxo: e.target.value })}
        >
          <option value="">Selecione</option>
          <option value="false">Não</option>
          <option value="true">Sim</option>
        </StyledSelect>
      )
    },

    // Material da Rede
    {
      title: "Material da Rede",
      content: (
        <StyledSelect
          value={formData.materialRede}
          onChange={(e) => setFormData({ ...formData, materialRede: e.target.value })}
        >
          <option value="">Selecione</option>
          <option value="Aço">Aço</option>
          <option value="PE80">PE80</option>
          <option value="PE100">PE100</option>
          <option value="Outro">Outro</option>
        </StyledSelect>
      )
    },

    // Diâmetro da Rede
    {
      title: "Diâmetro da Rede",
      content: (
        <StyledSelect
          value={formData.diametroRede}
          onChange={(e) => setFormData({ ...formData, diametroRede: e.target.value })}
        >
          <option value="">Selecione</option>
          <option value="40mm">40mm</option>
          <option value="63mm">63mm</option>
          <option value="90mm">90mm</option>
          <option value="125mm">125mm</option>
          <option value="Outro">Outro</option>
        </StyledSelect>
      )
    },

    // Pressão da Rede
    {
      title: "Pressão da Rede",
      content: (
        <StyledSelect
          value={formData.pressaoRede}
          onChange={(e) => setFormData({ ...formData, pressaoRede: e.target.value })}
        >
          <option value="">Selecione</option>
          <option value="250mbar">250mbar</option>
          <option value="750mbar">750mbar</option>
          <option value="1Bar">1Bar</option>
          <option value="4Bar">4Bar</option>
          <option value="7bar">7Bar</option>
        </StyledSelect>
      )
    },

    // Proteção mecânica
    {
      title: "Proteção mecânica",
      content: (
        <StyledSelect
          value={formData.protecaoMecanica}
          onChange={(e) => setFormData({ ...formData, protecaoMecanica: e.target.value })}
        >
          <option value="">Selecione</option>
          <option value="false">Não</option>
          <option value="true">Sim</option>
        </StyledSelect>
      )
    },

    // Faixa de sinalização
    {
      title: "Faixa de sinalização instalada",
      content: (
        <StyledSelect
          value={formData.faixaSinalizacao}
          onChange={(e) => setFormData({ ...formData, faixaSinalizacao: e.target.value })}
        >
          <option value="">Selecione</option>
          <option value="false">Não</option>
          <option value="true">Sim</option>
        </StyledSelect>
      )
    },

    // Tachão
    {
      title: "Tachão instalado",
      content: (
        <StyledSelect
          value={formData.tachaoRedondo}
          onChange={(e) => setFormData({ ...formData, tachaoRedondo: e.target.value })}
        >
          <option value="">Selecione</option>
          <option value="false">Não</option>
          <option value="true">Sim</option>
        </StyledSelect>
      )
    },

    // Componentes
    {
      title: "Componentes",
      content: (formData.componentes || []).map((c, i) => (
        <div key={i}>
          {["componente", "de", "fabricante", "lote"].map(f => (
            <StyledInput
              key={f}
              value={c[f] || ""}
              placeholder={f}
              onChange={e => {
                const newC = [...formData.componentes];
                newC[i][f] = e.target.value;
                setFormData({ ...formData, componentes: newC });
              }}
            />
          ))}
          <SubmitButton type="button" onClick={() => handleRemoveItem("componentes", i)}>- Remover</SubmitButton>
        </div>
      )).concat(
        <SubmitButton
          key="addComp"
          type="button"
          onClick={() => handleAddItem("componentes", { componente: "", de: "", fabricante: "", lote: "" })}
        >
          + Adicionar
        </SubmitButton>
      )
    },

    // Soldas
    {
      title: "Soldas",
      content: (formData.soldas || []).map((s, i) => (
        <div key={i}>
          {["componente", "numeroSolda", "tempoResfriamento"].map(f => (
            <StyledInput
              key={f}
              value={s[f] || ""}
              placeholder={f}
              onChange={e => {
                const newS = [...formData.soldas];
                newS[i][f] = e.target.value;
                setFormData({ ...formData, soldas: newS });
              }}
            />
          ))}
          <StyledSelect
            value={formData.soldas[i].aprovado || ""}
            onChange={e => {
              const newS = [...formData.soldas];
              newS[i].aprovado = e.target.value;
              setFormData({ ...formData, soldas: newS });
            }}
          >
            <option value="">Aprovado?</option>
            <option>Sim</option>
            <option>Não</option>
          </StyledSelect>
          <SubmitButton type="button" onClick={() => handleRemoveItem("soldas", i)}>- Remover</SubmitButton>
        </div>
      )).concat(
        <SubmitButton
          key="addSolda"
          type="button"
          onClick={() => handleAddItem("soldas", { componente: "", numeroSolda: "", tempoResfriamento: "", aprovado: "" })}
        >
          + Adicionar
        </SubmitButton>
      )
    }
  ];

  return [stepResultado, ...stepExtras];
};


  //fim do trecho novo

  const steps = getSteps();

  return (
    <Container>
      <FormTitle>RDO</FormTitle>
      {/* <generateCroquiPDF 
  croquiName={croquiData.file}   // ou croquiData.fileIsometric se for PDF isométrico
  formData={formData}            // envia o estado atual do RDO
/> */}

      <StepContainer>
        <Title>{steps[step].title}</Title>
        {steps[step].content}
      </StepContainer>
      <ButtonGroup>
        {step > 0 && <SubmitButton onClick={handlePrev}>Anterior</SubmitButton>}
        {step < steps.length - 1 ? <SubmitButton onClick={handleNext}>Próximo</SubmitButton>
          : <SubmitButton onClick={handleSubmit}>Finalizar</SubmitButton>}
      </ButtonGroup>
      
    </Container>
  );
}
