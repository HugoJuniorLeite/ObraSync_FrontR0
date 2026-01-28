import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormWrapper,
  InputWraper,
  Logo,
  SubmitButton,
} from "../layouts/Theme";
import { Controller, useForm } from "react-hook-form";
import { LoginSchema } from "../schemas/LoginSchema";
import { useState, useContext } from "react";
import { Input } from "../components/Ui/Input";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../contexts/AuthContext";
import apiMobileJourney from "../services/apiMobileJourney";

import { getHomeRouteByOccupation } from "../utils/redirectByRole";
import { clearDraftJornada, saveDraftJornada } from "../utils/journeyStore";

export default function Login() {
  const { handleLogin, firstLogin, changePassword } =
    useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("firstAccess");
  const navigate = useNavigate();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  // ---------------------------------------------
  // SUBMIT
  // ---------------------------------------------
  const onSubmit = async (data) => {
    const cpf = data.cpfNumber.replace(/\D/g, "");
    setLoading(true);

    try {
      // ------------------------------------------------
      // 1️⃣ PRIMEIRO ACESSO (VERIFICA CPF)
      // ------------------------------------------------
      if (step === "firstAccess") {
        const result = await firstLogin({ cpf });

        alert(result.message);

        if (result.response) {
          setStep("login");
        } else {
          setStep("changePassword");
        }
        return;
      }

      // ------------------------------------------------
      // 2️⃣ LOGIN
      // ------------------------------------------------
      if (step === "login") {
        const result = await handleLogin(cpf, data.password);

        // 🔥 BUSCA JORNADA ATIVA (best effort)
        let backendJornada = null;
        try {
          backendJornada =
            await apiMobileJourney.getActiveJourney();
            console.log(backendJornada, "backendJornada")

        } catch {
          // offline → ignora
        }

        if (backendJornada) {
          saveDraftJornada(backendJornada);
        } else {
          clearDraftJornada();
        }

        // 🚀 REDIRECT FINAL
        const route = getHomeRouteByOccupation(
          result.user.occupation
        );
        navigate(route);
        return;
      }

      // ------------------------------------------------
      // 3️⃣ TROCA DE SENHA
      // ------------------------------------------------
      if (step === "changePassword") {
        const response = await changePassword({
          cpf,
          old_password: data.old_password,
          new_password: data.new_password,
        });

        alert(response.data?.message || "Senha criada com sucesso!");
        setStep("login");
        return;
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------
  // RENDER
  // ---------------------------------------------
  return (
    <FormWrapper>
      <Logo src={logo} alt="logo" />

      <InputWraper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
  name="cpfNumber"
  control={control}
  render={({ field }) => (
    <Input
      {...field}
      type="text"
      label="CPF"
      mask="000.000.000-00"
      placeholder="000.000.000-00"
      name="cpfNumber"
      error={errors.cpfNumber}
      onChange={(e) => {
        const value = e.target.value.replace(/\D/g, "");
        field.onChange(value);
      }}
      onPaste={(e) => {
        e.preventDefault();
        const pasted = e.clipboardData
          .getData("text")
          .replace(/\D/g, "");

        field.onChange(pasted);
      }}
    />
  )}
/>


          {step === "login" && (
            <Input
              type="password"
              label="Senha"
              name="password"
              register={register}
              error={errors.password}
            />
          )}

          {step === "changePassword" && (
            <>
              <Input
                type="password"
                label="Senha antiga (6 primeiros dígitos do CPF)"
                name="old_password"
                register={register}
                error={errors.old_password}
              />
              <Input
                type="password"
                label="Nova senha"
                name="new_password"
                register={register}
                error={errors.new_password}
              />
            </>
          )}

          <SubmitButton type="submit" disabled={loading}>
            {loading
              ? "Carregando..."
              : step === "firstAccess"
              ? "Verificar Acesso"
              : step === "changePassword"
              ? "Criar Senha"
              : "Entrar"}
          </SubmitButton>
        </form>
      </InputWraper>
    </FormWrapper>
  );
}
