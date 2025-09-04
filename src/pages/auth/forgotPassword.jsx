import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  InputErrorMessage,
  Inputv2,
  LogoAndName,
} from "../../components/components";
import { COLORS, SIZES } from "../../styles/theme";
import { ArrowLeft } from "../../components/icons";
import { api } from "../../services/api";

const ForgotPassword = () => {
  const [resetToken, setResetToken] = useState(null);
  const [hasErrorCode, setHasErrorCode] = useState(false);
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [currentStep, setCurrentStep] = useState(1);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordBlurred, setPasswordBlurred] = useState(false);
  const [confirmPasswordBlurred, setConfirmPasswordBlurred] = useState(false);

  const otpRefs = useRef([]);

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const isFormValid = email.length > 0 && validateEmail(email);
  const isOtpComplete = otp.every((digit) => digit !== "");

  useEffect(() => {
    let timer;
    if (!canResend && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [canResend, countdown]);

  const step1 = async () => {
    setEmailTouched(true);

    if (!validateEmail(email)) return;

    try {
      const body = { email: email.trim() };
      await api.post("/api/auth/forgot-password", body);

      setCurrentStep(2);
      setTimeout(() => otpRefs.current[0]?.focus(), 0);
    } catch (error) {
      console.error("Error sending recovery email:", error);
    }
  };

  const step2 = async () => {
    try {
      const body = { email: email.trim(), code: otp.join("") };
      const res = await api.post("/api/auth/verify-reset-code", body);

      if (res.data.success) {
        setResetToken(res.data.data.resetToken);
        setHasErrorCode(false);
        setErrorMessage("");
        setCurrentStep(3);
      } else {
        setHasErrorCode(true);
        setErrorMessage(res.data.error);
      }
    } catch (error) {
      setHasErrorCode(true);
      setErrorMessage(
        error.response?.data?.error || "Ocorreu um erro, tenta novamente"
      );
    }
  };

  const step3 = async () => {
    if (password.length < 8) {
      setErrorMessage("A password deve ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("As passwords não coincidem.");
      return;
    }

    if (!resetToken) return;

    try {
      const body = { token: resetToken, newPassword: password };
      await api.post("/api/auth/reset-password", body);
      setErrorMessage("");
      setCurrentStep(4);
    } catch (error) {
      setErrorMessage("Erro ao redefinir a password. Tenta novamente.");
    }
  };

  const handleOtpPaste = (e, startIndex) => {
    e.preventDefault();
    const raw = (e.clipboardData || window.clipboardData).getData("text") || "";
    const digits = raw.replace(/\D/g, "");
    if (!digits) return;

    const newOtp = [...otp];
    const toFill = digits.slice(0, 6 - startIndex).split("");
    toFill.forEach((d, i) => (newOtp[startIndex + i] = d));
    setOtp(newOtp);

    const nextIndex = startIndex + toFill.length;
    if (nextIndex < 6) otpRefs.current[nextIndex]?.focus();
    else otpRefs.current[5]?.focus();

    if (hasErrorCode) setHasErrorCode(false);
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (hasErrorCode) setHasErrorCode(false);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpBackspace = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        otpRefs.current[index - 1]?.focus();
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleResendCode = async () => {
    try {
      const res = await api.post("/api/auth/resend-reset-password-code", {
        email,
      });

      if (res.data.success) {
        setOtp(Array(6).fill(""));
        otpRefs.current[0]?.focus();
        setCanResend(false);
        setCountdown(30);
        setErrorMessage("");
        setHasErrorCode(false);
      }
    } catch (err) {
      const apiError = err.response?.data?.error;
      setErrorMessage(apiError || "Insira o código enviado anteriormente.");
      setHasErrorCode(true);
      setCanResend(true);
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
      <div className="flex-1 flex flex-col p-8">
        <div className="flex flex-col justify-between h-full items-center w-full">
          {currentStep === 1 && (
            <div className="w-full max-w-[480px] flex justify-end self-center">
              <div
                className="flex items-center gap-1 text-gray-900 font-regular"
                style={{ fontSize: SIZES.caption }}
              >
                Ainda não tens conta?
                <Link
                  to="/register"
                  className="text-primary font-semibold cursor-pointer"
                  style={{ color: COLORS.primary }}
                >
                  Faz registo
                </Link>
              </div>
            </div>
          )}
          <div className="flex flex-1 items-center justify-center w-full">
            <div className="flex flex-col gap-8 w-full max-w-[480px]">
              <div className="flex flex-col gap-2.5">
                {currentStep === 1 && (
                  <>
                    <h1
                      className="text-gray-900 font-bold"
                      style={{ fontSize: SIZES.h1 }}
                    >
                      Não te lembras da password?
                    </h1>
                    <p
                      className="text-gray-400 font-regular"
                      style={{ fontSize: SIZES.bodyl }}
                    >
                      Não te preocupes, vamos enviar-te as instruções de
                      redefinição da password.
                    </p>
                  </>
                )}
                {currentStep === 2 && (
                  <>
                    <h1
                      className="text-gray-900 font-bold"
                      style={{ fontSize: SIZES.h1 }}
                    >
                      Redefinição da password
                    </h1>
                    <div
                      className="text-gray-400 font-regular"
                      style={{ fontSize: SIZES.bodyl }}
                    >
                      Introduz o código que enviámos para o teu email.
                      <p>É válido por 30 segundos</p>
                    </div>
                  </>
                )}
                {currentStep === 3 && (
                  <>
                    <h1
                      className="text-gray-900 font-bold"
                      style={{ fontSize: SIZES.h1 }}
                    >
                      Define uma nova password
                    </h1>
                    <p
                      className="text-gray-400 font-regular"
                      style={{ fontSize: SIZES.bodyl }}
                    >
                      Tem que ter pelo menos 8 caracteres
                    </p>
                  </>
                )}
              </div>
              {currentStep === 1 && (
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-col gap-2">
                      <p
                        className="text-gray-900 font-medium"
                        style={{ fontSize: SIZES.bodys }}
                      >
                        Email
                      </p>
                      <Inputv2
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => setEmailTouched(true)}
                        touched={emailTouched || email.length > 0}
                      />
                    </div>
                    <div>
                      {!validateEmail(email) && emailTouched && (
                        <InputErrorMessage
                          Message={errorMessage || "Código incorreto."}
                        />
                      )}
                    </div>
                  </div>
                  <button
                    onClick={step1}
                    disabled={!isFormValid}
                    className={`flex items-center justify-center gap-2 rounded-md ${
                      isFormValid ? "cursor-pointer" : "cursor-not-allowed"
                    }`}
                    style={{
                      backgroundColor: isFormValid
                        ? COLORS.primary
                        : COLORS.gray,
                      padding: "14px 24px",
                      transition: "background-color 0.3s",
                    }}
                  >
                    <p
                      className="text-gray-100 font-semibold"
                      style={{ fontSize: SIZES.bodyl }}
                    >
                      Redefinir Password
                    </p>
                  </button>
                  <div className="w-full flex justify-center">
                    <Link to="/login">
                      <p
                        className="flex items-center text-regular text-gray-500"
                        style={{ fontSize: SIZES.caption }}
                      >
                        <ArrowLeft />
                        Retoma o início de sessão
                      </p>
                    </Link>
                  </div>
                </div>
              )}
              {currentStep === 2 && (
                <div className="flex flex-col w-full max-w-[480px] self-center items-center gap-8">
                  <div className="w-full flex flex-col gap-1">
                    <div className="flex justify-between w-full gap-2">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          inputMode="numeric"
                          pattern="\d*"
                          maxLength={1}
                          className={`flex-1 text-center rounded-lg p-4 text-gray-900 font-bold border-[1.5px]
                        ${
                          hasErrorCode
                            ? "border-red-500 focus:border-red-500"
                            : otp[index]
                            ? "border-blue-500 focus:border-blue-500"
                            : "border-gray-300 focus:border-blue-500"
                        } focus:outline-none`}
                          aria-invalid={hasErrorCode}
                          style={{ fontSize: SIZES.display, minWidth: 0 }}
                          value={otp[index] || ""}
                          onChange={(e) => handleOtpChange(e, index)}
                          onKeyDown={(e) => handleOtpBackspace(e, index)}
                          onPaste={(e) => handleOtpPaste(e, index)}
                          ref={(el) => (otpRefs.current[index] = el)}
                        />
                      ))}
                    </div>
                    {hasErrorCode && (
                      <InputErrorMessage
                        Message={errorMessage || "Código incorreto."}
                      />
                    )}
                  </div>
                  <button
                    onClick={step2}
                    disabled={!isOtpComplete}
                    className={`flex items-center justify-center gap-2 rounded-md w-full ${
                      isOtpComplete ? "cursor-pointer" : "cursor-not-allowed"
                    }`}
                    style={{
                      backgroundColor: isOtpComplete
                        ? COLORS.primary
                        : COLORS.gray,
                      padding: "14px 24px",
                      transition: "background-color 0.3s",
                    }}
                  >
                    <p
                      className="text-gray-100 font-semibold"
                      style={{ fontSize: SIZES.bodyl }}
                    >
                      Continuar
                    </p>
                  </button>
                  <p
                    className="flex items-center justify-center text-regular text-gray-900"
                    style={{ fontSize: SIZES.caption, gap: 4 }}
                  >
                    Não recebeste o email?
                    <span
                      className={`cursor-pointer text-blue-500 font-semibold ${
                        !canResend ? "pointer-events-none opacity-50" : ""
                      }`}
                      onClick={canResend ? handleResendCode : undefined}
                    >
                      {!canResend
                        ? `Tente novamente em ${countdown} ${
                            countdown === 1 ? "segundo" : "segundos"
                          }`
                        : "Clica aqui para reenviar"}
                    </span>
                  </p>
                </div>
              )}
              {currentStep === 3 && (
                <div className="flex flex-col w-full max-w-[480px] self-center items-center gap-6">
                  <div className="flex flex-col w-full gap-1">
                    <p
                      className="text-gray-900 font-medium"
                      style={{ fontSize: SIZES.bodys }}
                    >
                      Password
                    </p>
                    <Inputv2
                      keyIcon={false}
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col w-full gap-1">
                    <p
                      className="text-gray-900 font-medium"
                      style={{ fontSize: SIZES.bodys }}
                    >
                      Confirma a password
                    </p>
                    <Inputv2
                      keyIcon={false}
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeHolder="Introduz novamente a tua nova password"
                      success={
                        confirmPassword === password && password.length >= 8
                      }
                    />
                  </div>

                  {errorMessage && <InputErrorMessage Message={errorMessage} />}

                  <button
                    onClick={step3}
                    className={`flex items-center justify-center gap-2 rounded-md w-full cursor-pointer`}
                    style={{
                      backgroundColor: COLORS.primary,
                      padding: "14px 24px",
                      transition: "background-color 0.3s",
                    }}
                  >
                    <p
                      className="text-gray-100 font-semibold"
                      style={{ fontSize: SIZES.bodyl }}
                    >
                      Redefinir Password
                    </p>
                  </button>
                </div>
              )}
              {currentStep === 4 && (
                <div className="flex flex-col w-full max-w-[480px] self-center items-center gap-8">
                  <div className="flex flex-col gap-2">
                    <h1
                      className="text-gray-900 font-bold"
                      style={{ fontSize: SIZES.h1 }}
                    >
                      Password alterada!
                    </h1>
                    <p
                      className="text-gray-400 font-regular"
                      style={{ fontSize: SIZES.bodyl }}
                    >
                      A tua password foi alterada com sucesso, tenta agora fazer
                      login.
                    </p>
                  </div>
                  <button
                    onClick={() => (window.location.href = "/login")}
                    className="flex items-center justify-center gap-2 rounded-md w-full cursor-pointer"
                    style={{
                      backgroundColor: COLORS.primary,
                      padding: "14px 24px",
                      transition: "background-color 0.3s",
                    }}
                  >
                    <p
                      className="text-gray-100 font-semibold"
                      style={{ fontSize: SIZES.bodyl }}
                    >
                      Login
                    </p>
                  </button>
                </div>
              )}
            </div>
          </div>
          {currentStep !== 4 && (
            <div className="w-full max-w-[480px] flex gap-3">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`h-[12px] flex-1 rounded-full transition-all duration-300 ${
                    currentStep === step ? "bg-blue-500" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
