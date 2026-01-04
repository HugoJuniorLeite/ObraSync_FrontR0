import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FormWrapper,
  InputWraper,
  Logo,
  SubmitButton,
} from "../layouts/Theme";

import { LoginSchema } from "../schemas/LoginSchema";
import { Input } from "../components/Ui/Input";
import logo from "../assets/logo.png";

import { AuthContext } from "../contexts/AuthContext";
import { getHomeRouteByOccupation } from "../utils/redirectByRole";

export default function Login() {
  const { handleLogin, firstLogin, changePassword } =
    useContext(AuthContext);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("firstAccess");

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data) => {
    const cleanCpf = data.cpfNumber.replace(/\D/g, "");
    setLoading(true);

    try {
      /* =======================
         🔹 PRIMEIRO ACESSO
      ======================= */
      if (step === "firstAccess") {
        const result = await firstLogin({ cpf: cleanCpf });
        alert(result.message);

        setStep(result.response ? "login" : "changePassword");
        return;
      }

      /* =======================
         🔐 LOGIN
      ======================= */
      if (step === "login") {
        const result = await handleLogin(cleanCpf, data.password);

        // ✅ FONTE ÚNICA DE VERDADE
        const initialRoute = getHomeRouteByOccupation(
          result.user.occupation
        );

        // 🔥 replace evita voltar para rota errada após logout
        navigate(initialRoute, { replace: true });
        return;
      }

      /* =======================
         🔑 TROCA DE SENHA
      ======================= */
      if (step === "changePassword") {
        const response = await changePassword({
          cpf: cleanCpf,
          old_password: data.old_password,
          new_password: data.new_password,
        });

        alert(response.data?.message || "Senha criada com sucesso!");
        setStep("login");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper>
      <Logo src={logo} alt="logo" />

      <InputWraper>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* CPF */}
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
                register={register}
                error={errors.cpfNumber}
              />
            )}
          />

          {/* LOGIN */}
          {step === "login" && (
            <Input
              type="password"
              label="Senha"
              name="password"
              register={register}
              error={errors.password}
            />
          )}

          {/* TROCA DE SENHA */}
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
              : step === "login"
              ? "Entrar"
              : "Criar Senha"}
          </SubmitButton>
        </form>
      </InputWraper>
    </FormWrapper>
  );
}
