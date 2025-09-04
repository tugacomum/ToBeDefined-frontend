import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/auth";
import {
  CheckBoxv2,
  InputErrorMessage,
  Inputv2,
  LogoAndName,
} from "../../components/components";
import { ArrowRight } from "../../components/icons";
import { COLORS, SIZES } from "../../styles/theme";

const Login = () => {
  const { login } = useAuth();

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [loginAttempted, setLoginAttempted] = useState(false);

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const isFormValid =
    email.length > 0 && password.length > 7 && validateEmail(email);

  const handleLogin = async () => {
    setLoginAttempted(true);
    setLoginError("");
    let hasError = false;

    if (!email || !validateEmail(email)) hasError = true;
    if (!password) hasError = true;

    if (hasError) return;

    try {
      await login({ email: email.trim(), password: password.trim() });
    } catch (error) {
      setLoginError(error.message);
    }
  };

  return (
    <div className="flex w-full h-screen overflow-hidden">
      <div className="flex-1 p-4">
        <div
          className="w-full h-full rounded-3xl overflow-hidden flex flex-col justify-center"
          style={{
            backgroundImage: `linear-gradient(rgba(59,130,246,0.8), rgba(59,130,246,0.8)), url('/images/auth/backgroundLogin.jpg')`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="flex flex-col gap-8 items-start px-[104px] pr-[62px]">
            <LogoAndName />
            <div className="flex flex-col gap-2">
              <h1
                className="font-bold text-white"
                style={{ fontSize: SIZES.h1 }}
              >
                Unlock Your Learning Potential
              </h1>
              <h3
                className="font-medium text-slate-200"
                style={{ fontSize: SIZES.h3 }}
              >
                Inicia sessão para continuares a tua jornada de crescimento e
                conhecimento.
              </h3>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="flex flex-col gap-8 w-full max-w-[480px]">
          <div className="flex flex-col gap-2.5">
            <h1
              className="text-gray-900 font-bold"
              style={{ fontSize: SIZES.h1 }}
            >
              Bem vindo de volta!
            </h1>
            <p
              className="text-gray-400 font-regular"
              style={{ fontSize: SIZES.bodyl }}
            >
              Faz login na tua conta e retoma o teu estudo organizado.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <div className="flex flex-col gap-2">
                <p
                  className="text-gray-900 font-medium"
                  style={{ fontSize: SIZES.bodys }}
                >
                  Email
                </p>
                <Inputv2
                  keyIcon={true}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  loginAttempted={loginAttempted}
                />
              </div>
              {!validateEmail(email) && loginAttempted && (
                <InputErrorMessage Message="Email inválido." />
              )}
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-col gap-2">
                <p
                  className="text-gray-900 font-medium"
                  style={{ fontSize: SIZES.bodys }}
                >
                  Password
                </p>
                <Inputv2
                  keyIcon={true}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  loginAttempted={loginAttempted}
                  error={!!loginError}
                />
              </div>
              {(loginError || (loginAttempted && password.length === 0)) && (
                <InputErrorMessage
                  Message={
                    loginError
                      ? "Credenciais incorretas."
                      : "A password é obrigatória."
                  }
                />
              )}
              <div className="flex justify-between items-center mt-1">
                <div className="flex items-center gap-1">
                  <CheckBoxv2
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <p
                    className="text-gray-500 font-regular"
                    style={{ fontSize: SIZES.caption }}
                  >
                    Lembra-me
                  </p>
                </div>
                <Link
                  to="/forgotPassword"
                  className="font-regular cursor-pointer"
                  style={{ fontSize: SIZES.caption, color: COLORS.primary }}
                >
                  Não te lembras da password?
                </Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6 text-center">
            <button
              onClick={handleLogin}
              disabled={!isFormValid}
              className={`flex items-center justify-center gap-2 rounded-md ${
                isFormValid ? "cursor-pointer" : "cursor-not-allowed"
              }`}
              style={{
                backgroundColor: isFormValid ? COLORS.primary : COLORS.gray,
                padding: "14px 24px",
                transition: "background-color 0.3s",
              }}
            >
              <p
                className="text-gray-100 font-semibold"
                style={{ fontSize: SIZES.bodyl }}
              >
                Iniciar Sessão
              </p>
              <ArrowRight />
            </button>
            <div
              className="flex justify-center items-center gap-1 text-gray-900 font-regular"
              style={{ fontSize: SIZES.caption }}
            >
              Ainda não tens conta?
              <Link
                to="/register"
                className="text-primary font-semibold cursor-pointer"
                style={{ color: COLORS.primary }}
              >
                Regista-te
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
