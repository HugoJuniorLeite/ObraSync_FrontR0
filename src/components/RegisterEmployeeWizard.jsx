import { useState, useEffect } from "react";
import styled from "styled-components";
import { ChevronRight, ChevronLeft, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FloatingInput from "./Ui/FloatingInput";
import { cpfMask, rgMask, phoneMask } from "../utils/masks";
import apiEmployee from "../services/apiEmployee";
import apiOccupation from "../services/apiOccupation";
import contract from "../services/apiContract";
import AutocompleteSelect from "./Ui/AutocompleteSelect";

/* ===== ESTILOS ===== */

const StepContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const StepTitle = styled.h2`
  color: #38bdf8;
  font-size: 1.4rem;
  text-align: center;
  margin-bottom:1rem;
`;

const ProgressWrapper = styled.div`
  width: 100%;
  height: 8px;
  background: #0f172a;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1.5rem;
`;

const ProgressFill = styled.div`
  height: 8px;
  background: linear-gradient(90deg, #38bdf8, #0ea5e9);
  transition: 0.35s;
  width: ${(props) => props.percent}%;
`;

const ButtonBar = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  display:flex; align-items:center; gap:6px;
  background: ${p => (p.$primary ? "#38bdf8" : "transparent")};
  border: 1px solid #38bdf8;
  color: ${p => (p.$primary ? "#0f172a" : "#38bdf8")};
  padding: .6rem 1.2rem; border-radius:8px; font-weight:600; cursor:pointer;
  transition:.3s;
  &:hover{ background:${p => (p.$primary ? "#0ea5e9" : "#1e293b")}
  }
`;

const variants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.35 } },
    exit: { opacity: 0, x: -30, transition: { duration: 0.3 } }
};


const ReviewSection = styled.div`
  background: #0f172a;
  border: 1px solid #38bdf8;
  border-radius: 8px;
  padding: 1rem 1.2rem;
  margin-bottom: 1.2rem;
  color: #e2e8f0;
`;

const ReviewTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  color: #38bdf8;
  font-weight: 600;
`;

const ReviewRow = styled.p`
  margin: 4px 0;
  font-size: 0.95rem;

  strong {
    color: #94a3b8;
    font-weight: 500;
    margin-right: 4px;
  }
`;


/* ===== COMPONENTE PRINCIPAL ===== */

export default function RegisterEmployeeWizard({ onSave, onClose }) {
    const [step, setStep] = useState(1);
    const [loadingCep, setLoadingCep] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [projects, setProjects] = useState([]);
    const [occupations, setOccupations] = useState([]);



    const [data, setData] = useState({
        name: "",
        birthDate: "",
        cpf: "",
        rg: "",
        phone: "",
        zip_code: "",
        street_name: "",
        number_of_house: "",
        neighborhood: "",
        city: "",
        state: "",
        hasCNH: false,
        cnh: { number: "", category: "", validity: "", firstLicense: "" },
        project_id: "",
        occupation_id: "",
        admissionDate: "",
    });
    const selectedOccupationData = occupations.find(o => String(o.id) === String(data.occupation_id));

    //   useEffect(() => {
    //     const fetchClients = async () => {
    //       try {
    //         const [dataProject, dataOcupation] = await Promise.all([
    //           contract.getContracts(),
    //           apiOccupation.getOccupation()
    //         ]);

    //         setProjects(dataProject);
    //         setOccupations(dataOcupation);
    //         console.log(dataOcupation);
    //       } catch (error) {
    //         console.error("Erro ao buscar contratos e funções:", error);
    //       }
    //     };
    //     fetchClients();
    //   }, []);

    // NOVO


    useEffect(() => {
        async function fetchProjects() {
            try {
                const res = await contract.getContracts();
                setProjects(res);
            } catch (err) {
                console.error("Erro ao buscar projetos:", err.message);
                setProjects([]);
            }
        }
        fetchProjects();
    }, []);

    useEffect(() => {
        async function fetchOccupations() {
            console.log(data.project_id)
            try {
                if (!data.project_id) {
                    setOccupations([]);
                    return;
                }

                const res = await apiOccupation.getOccupation();

                //   const filtered = res.filter(
                //     (o) => Number(o.project_id) === Number(data.project_id)
                //   );
                console.log(res)

                setOccupations(res);
                setData(prev => ({ ...prev, occupation_id: "" }));
            } catch (err) {
                console.error("Erro ao buscar funções:", err);
                setOccupations([]);
            }
        }
        fetchOccupations();
    }, [data.project_id]);




    const validateStep = () => {
        if (step === 1 && (!data.name || !data.birthDate || !data.cpf || !data.rg || !data.phone))
            return setErrorMessage("Preencha todos os campos."), false;

        if (step === 2 && (!data.zip_code || !data.street_name || !data.number_of_house || !data.city || !data.state))
            return setErrorMessage("Complete o endereço."), false;

        if (step === 3 && (!data.project_id || !data.occupation_id))
            return setErrorMessage("Selecione projeto e função."), false;

        if (step === 4 && data.hasCNH && (!data.cnh.number || !data.cnh.category || !data.cnh.validity))
            return setErrorMessage("Preencha os dados da CNH."), false;

        setErrorMessage("");
        return true;
    };

    const handleCep = async (value) => {
        const clean = value.replace(/\D/g, "");
        setData({ ...data, zip_code: clean });

        if (clean.length === 8) {
            setLoadingCep(true);
            const r = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
            const j = await r.json();
            if (!j.erro) {
                setData((p) => ({
                    ...p,
                    street_name: j.logradouro || p.street_name,
                    neighborhood: j.bairro || p.neighborhood,
                    city: j.localidade || p.city,
                    state: j.uf || p.state,
                }));
            }
            setLoadingCep(false);
        }
    };

    const saveEmployee = async () => {

        const payload = {
            name: data.name,
            cpf: data.cpf.replace(/\D/g, ""),
            rg: data.rg.replace(/\D/g, ""),
            date_of_birth: new Date(data.birthDate),
            drivers_license: data.hasCNH,
            admission_date: new Date(data.admissionDate),

            phones: { create: { phoneNumber: data.phone.replace(/\D/g, "") } },
            address: {
                create: {
                    zip_code: data.zip_code,
                    street_name: data.street_name,
                    number_of_house: data.number_of_house,
                    neighborhood: data.neighborhood,
                    city: data.city,
                    state: data.state,
                    country: "Brasil",
                },
            },
            occupation_id: Number(data.occupation_id),
            project_team: { create: { project_id: Number(data.project_id), active: true } },
        };

        if (data.hasCNH) {
            payload.cnhs = {
                create: {
                    number_license: data.cnh.number,
                    category_cnh: data.cnh.category,
                    validity: new Date(data.cnh.validity),
                    first_drivers_license: new Date(data.cnh.firstLicense),
                }
            };
        }

        await apiEmployee.postEmployee(payload);
        onSave?.();
        onClose?.();
    };

    const totalSteps = 5;
    const percent = (step / totalSteps) * 100;

    return (
        <StepContainer>

            <ProgressWrapper><ProgressFill percent={percent} /></ProgressWrapper>

            <AnimatePresence mode="wait">

                {step === 1 && (
                    <motion.div key="1" variants={variants} initial="hidden" animate="visible" exit="exit">
                        <StepTitle>Dados Pessoais</StepTitle>
                        <FloatingInput label="Nome:" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
                        <FloatingInput label="Nascimento:" type="date" value={data.birthDate} onChange={(e) => setData({ ...data, birthDate: e.target.value })} />
                        <FloatingInput label="CPF:" value={data.cpf} onChange={(e) => setData({ ...data, cpf: cpfMask(e.target.value) })} />
                        <FloatingInput label="RG:" value={data.rg} onChange={(e) => setData({ ...data, rg: rgMask(e.target.value) })} />
                        <FloatingInput label="Telefone:" value={data.phone} onChange={(e) => setData({ ...data, phone: phoneMask(e.target.value) })} />
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div key="2" variants={variants} initial="hidden" animate="visible" exit="exit">
                        <StepTitle>Endereço</StepTitle>
                        <FloatingInput label="CEP:" value={data.zip_code} onChange={(e) => handleCep(e.target.value)} />
                        {loadingCep && <p style={{ color: "#38bdf8" }}>Buscando endereço...</p>}
                        <FloatingInput label="Rua:" value={data.street_name} onChange={(e) => setData({ ...data, street_name: e.target.value })} />
                        <FloatingInput label="Número:" value={data.number_of_house} onChange={(e) => setData({ ...data, number_of_house: e.target.value })} />
                        <FloatingInput label="Bairro:" value={data.neighborhood} onChange={(e) => setData({ ...data, neighborhood: e.target.value })} />
                        <FloatingInput label="Cidade:" value={data.city} onChange={(e) => setData({ ...data, city: e.target.value })} />
                        <FloatingInput label="Estado:" value={data.state} onChange={(e) => setData({ ...data, state: e.target.value })} />
                    </motion.div>
                )}


                {step === 3 && (
                    <motion.div key="3" variants={variants} initial="hidden" animate="visible" exit="exit">
                        <StepTitle>Vínculo Corporativo</StepTitle>

                        <FloatingInput label="Data de admissão:" type="date" value={data.admissionDate} onChange={(e) => setData({ ...data, admissionDate: e.target.value })} />


                        <AutocompleteSelect
                            value={projects.find(p => p.id == data.project_id) && {
                                value: data.project_id,
                                label: projects.find(p => p.id == data.project_id)?.name
                            }}
                            placeholder="Selecione o projeto"
                            options={(Array.isArray(projects) ? projects : []).map(p => ({ value: p.id, label: p.name }))}
                            onChange={(project) => setData(prev => ({ ...prev, project_id: project.value, occupation_id: "" }))}
                            strict
                        />

                        <AutocompleteSelect
                            value={occupations.find(o => o.id == data.occupation_id) && {
                                value: data.occupation_id,
                                label: occupations.find(o => o.id == data.occupation_id)?.name
                            }}
                            placeholder="Selecione o cargo"
                            options={(Array.isArray(occupations) ? occupations : []).map(o => ({
                                value: o.id,
                                label: o.name
                            }))}
                            onChange={(occ) => setData(prev => ({ ...prev, occupation_id: occ.value }))}
                            strict
                        />

                        {/* ✅ Card de detalhes da função */}
                        {selectedOccupationData && (
                            <div style={{
                                marginTop: "1rem",
                                padding: "1rem",
                                borderRadius: "8px",
                                background: "#0f172a",
                                border: "1px solid #38bdf8",
                                color: "#e2e8f0"
                            }}>
                                <h4 style={{ marginBottom: "6px", color: "#38bdf8", fontSize: "1.1rem" }}>
                                    {selectedOccupationData.name}
                                </h4>
                                <p><strong>Descrição:</strong> {selectedOccupationData.description_of_occupation || "Sem descrição"}</p>
                                <p><strong>Salário Base:</strong> R$ {Number(selectedOccupationData.salary).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                                <p><strong>Total com Adicionais:</strong> R$ {Number(selectedOccupationData.total_salary).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                                <p><strong>Periculosidade:</strong> {selectedOccupationData.dangerousness ? "Sim" : "Não"}</p>
                            </div>
                        )}
                    </motion.div>
                )}



                {step === 4 && (
                    <motion.div key="4" variants={variants} initial="hidden" animate="visible" exit="exit">
                        <StepTitle>CNH</StepTitle>
                        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <input
                                type="checkbox"
                                checked={data.hasCNH}
                                onChange={() =>
                                    setData(prev => ({
                                        ...prev,
                                        hasCNH: !prev.hasCNH,
                                        cnh: !prev.hasCNH
                                            ? prev.cnh // se está ativando, mantém
                                            : { number: "", category: "", validity: "", firstLicense: "" } // se está desativando, limpa
                                    }))
                                }
                            />
                            Possui CNH?
                        </label>

                        {data.hasCNH && (
                            <>
                                <FloatingInput label="Número:" value={data.cnh.number} onChange={(e) => setData({ ...data, cnh: { ...data.cnh, number: e.target.value } })} />
                                <FloatingInput label="Categoria:" value={data.cnh.category} onChange={(e) => setData({ ...data, cnh: { ...data.cnh, category: e.target.value } })} />
                                <FloatingInput label="Primeira Habilitação:" type="date" value={data.cnh.firstLicense} onChange={(e) => setData({ ...data, cnh: { ...data.cnh, firstLicense: e.target.value } })} />
                                <FloatingInput label="Validade:" type="date" value={data.cnh.validity} onChange={(e) => setData({ ...data, cnh: { ...data.cnh, validity: e.target.value } })} />
                            </>
                        )}
                    </motion.div>
                )}

                {step === 5 && (
                    <motion.div key="5" variants={variants} initial="hidden" animate="visible" exit="exit">
                        <StepTitle>Revisão dos Dados</StepTitle>

                        <ReviewSection>
                            <ReviewTitle>Dados Pessoais</ReviewTitle>
                            <ReviewRow><strong>Nome:</strong> {data.name}</ReviewRow>
                            <ReviewRow><strong>Nascimento:</strong> {data.birthDate}</ReviewRow>
                            <ReviewRow><strong>CPF:</strong> {data.cpf}</ReviewRow>
                            <ReviewRow><strong>RG:</strong> {data.rg}</ReviewRow>
                            <ReviewRow><strong>Telefone:</strong> {data.phone}</ReviewRow>
                        </ReviewSection>

                        <ReviewSection>
                            <ReviewTitle>Endereço</ReviewTitle>
                            <ReviewRow><strong>CEP:</strong> {data.zip_code}</ReviewRow>
                            <ReviewRow><strong>Rua:</strong> {data.street_name}</ReviewRow>
                            <ReviewRow><strong>Número:</strong> {data.number_of_house}</ReviewRow>
                            <ReviewRow><strong>Bairro:</strong> {data.neighborhood}</ReviewRow>
                            <ReviewRow><strong>Cidade:</strong> {data.city} - {data.state}</ReviewRow>
                        </ReviewSection>

                        <ReviewSection>
                            <ReviewTitle>Vínculo Corporativo</ReviewTitle>
                            <ReviewRow><strong>Projeto:</strong> {projects.find(p => p.id == data.project_id)?.name}</ReviewRow>
                            <ReviewRow><strong>Cargo:</strong> {occupations.find(o => o.id == data.occupation_id)?.name}</ReviewRow>
                            <ReviewRow><strong>Data de Admissão:</strong> {data.admissionDate}</ReviewRow>
                            <ReviewRow><strong>Descrição:</strong> {selectedOccupationData.description_of_occupation || "Sem descrição"}</ReviewRow>
                            <ReviewRow><strong>Salário Base:</strong> R$ {Number(selectedOccupationData.salary).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</ReviewRow>
                            <ReviewRow><strong>Total com Adicionais:</strong> R$ {Number(selectedOccupationData.total_salary).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</ReviewRow>
                            <ReviewRow><strong>Periculosidade:</strong> {selectedOccupationData.dangerousness ? "Sim" : "Não"}</ReviewRow>
                        </ReviewSection>

                        {data.hasCNH && (
                            <ReviewSection>
                                <ReviewTitle>CNH</ReviewTitle>
                                <ReviewRow><strong>Número:</strong> {data.cnh.number}</ReviewRow>
                                <ReviewRow><strong>Categoria:</strong> {data.cnh.category}</ReviewRow>
                                <ReviewRow><strong>Primeira Habilitação:</strong> {data.cnh.firstLicense}</ReviewRow>
                                <ReviewRow><strong>Validade:</strong> {data.cnh.validity}</ReviewRow>
                            </ReviewSection>
                        )}
                    </motion.div>
                )}

            </AnimatePresence>

            {errorMessage && <p style={{ color: "#f87171", textAlign: "center" }}>{errorMessage}</p>}

            <ButtonBar>

                {/* Botão Voltar */}
                {step > 1 && (
                    <Button onClick={() => setStep(step - 1)}>
                        <ChevronLeft size={18} /> Voltar
                    </Button>
                )}

                {/* Se ainda não chegou na última etapa → mostra Próximo */}
                {step < 5 && (
                    <Button
                        $primary
                        disabled={step === 3 && (!data.project_id || !data.occupation_id)}
                        onClick={() => validateStep() && setStep(step + 1)}
                    >
                        Próximo <ChevronRight size={18} />
                    </Button>
                )}

                {/* ✅ Se estiver no último passo → mostra Finalizar */}
                {step === 5 && (
                    <Button $primary onClick={saveEmployee}>
                        <Save size={18} /> Finalizar Cadastro
                    </Button>
                )}
            </ButtonBar>


        </StepContainer>
    );
}
