import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useAuth } from "../../contexts/auth";
import { CheckBox, Input, LogoAndName } from "../../components/components";
import { MailIcon, ArrowRight, KeyIcon } from "../../components/icons";

import "../../styles/ToBeDefinedStyle.css";

const Login = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [hasErrorEmail, setHasErrorEmail] = useState(false);
  const [hasErrorPassword, setHasErrorPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const invalidEmail =
      email.trim() === "" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const invalidPassword = password.trim() === "";

    setHasErrorEmail(invalidEmail);
    setHasErrorPassword(invalidPassword);

    if (invalidEmail || invalidPassword) return;

    try {
      const body = {
        email: email.trim(),
        password: password.trim(),
      };
      await login(body);
      navigate("/home", { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex flex-col justify-center items-center w-1/2 h-screen max-h-screen">
        <div className="flex min-h-screen bg-white">
  {/* Lado esquerdo */}
  <div className="w-1/2 h-screen p-6">
    <div className="w-full h-full backgroundLogin flex flex-col justify-center px-12">

      <LogoAndName />
      <div className="mt-10">
        <h1 className="text-4xl text-white font-bold leading-snug">
          Unlock Your Learning Potential
        </h1>
        <p className="mt-4 text-lg font-medium text-gray-100 max-w-md">
          Inicia sessão para continuares a tua jornada de crescimento e conhecimento.
        </p>
      </div>
    </div>
  </div>

  {/* Lado direito */}
  <div className="flex flex-col justify-center items-center w-1/2 px-8">
    {/* resto do formulário */}
  </div>
</div>

      </div>

      <div className="flex flex-col justify-center items-center w-1/2 px-8">
        <div className="w-full pl-31_5 pr-30">
          <h2 className="text-4xl font-bold mb-2.5 text-gray-900">
            Bem vindo de volta!
          </h2>
          <p className="text-lg font-normal mb-8 text-gray-400">
            Faz login na tua conta e retoma o teu estudo organizado.
          </p>
          <form>
            <div className="space-y-6">
              <div>
                {Input(
                  "Email",
                  "Introduz o teu email institucional",
                  false,
                  true,
                  null,
                  <MailIcon HasError={hasErrorEmail} />,
                  hasErrorEmail,
                  email.trim === "" ? "Preencha o email" : "Email inválido",
                  email,
                  (e) => {
                    setEmail(e.target.value);
                    if (hasErrorEmail) setHasErrorEmail(false);
                  },
                  false
                )}
              </div>
              <div>
                {Input(
                  "Password",
                  "Enter your password",
                  false,
                  true,
                  null,
                  <KeyIcon HasError={hasErrorPassword} />,
                  hasErrorPassword,
                  password.trim === ""
                    ? "Preencha a password"
                    : "Password incorreta",
                  password,
                  (e) => {
                    setPassword(e.target.value);
                    if (hasErrorPassword) setHasErrorPassword(false);
                  },
                  true
                )}
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center justify-between">
                {CheckBox("Lembra-me", () => setRememberMe(!rememberMe))}
                <Link to="/forgotPassword" className="text-xs text-blue-500">
                  Esqueceste-te da password?
                </Link>
              </div>
              <button
                type="button"
                onClick={handleLogin}
                className="largeButton w-full mt-8"
              >
                Login
                <span className="ml-2 align-middle">
                  <ArrowRight />
                </span>{" "}
              </button>
            </div>
          </form>
          <div className="mt-6 text-center font-normal text-xs text-gray-900">
            Ainda não tens conta?{" "}
            <Link to="/register" className="font-semibold text-blue-500">
              Faz registo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
