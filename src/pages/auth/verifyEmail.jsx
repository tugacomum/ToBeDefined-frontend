import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { InputErrorMessage, LogoAndName } from "../../components/components";
import { COLORS, SIZES } from "../../styles/theme";
import { api } from "../../services/api";

const VerifyEmail = () => {
  const [hasErrorCode, setHasErrorCode] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  const { userId } = location.state || {};

  const otpRefs = useRef([]);
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

  const handleResendCode = async () => {
    try {
      const res = await api.post("/api/auth/resend-verification-code", {
        userId,
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
      setErrorMessage(
        err.response?.data?.error || "Insira o código enviado anteriormente."
      );
      setHasErrorCode(true);
      setCanResend(
        err.response?.data?.error !== "Código de verificação ainda não expirou"
      );
    }
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

  const handleVerifyEmail = async () => {
    try {
      const body = { userId, code: otp.join("") };
      const res = await api.post("/api/auth/verify-email", body);

      if (res.data.success) {
        setSuccess(true);
      } else {
        setHasErrorCode(true);
        setErrorMessage(res.data.error);
      }
    } catch (err) {
      setHasErrorCode(true);
      setErrorMessage(
        err.response?.data?.error || "Ocorreu um erro, tenta novamente"
      );
    }
  };

  return (
    <div className="flex w-full h-screen overflow-hidden">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="flex flex-col gap-8 w-full max-w-[480px]">
          <div className="flex flex-col gap-2.5">
            <h1
              className="text-gray-900 font-bold"
              style={{ fontSize: SIZES.h1 }}
            >
              {success ? "A tua conta foi criada!" : "Verificar Email"}
            </h1>
            <div
              className="text-gray-400 font-regular"
              style={{ fontSize: SIZES.bodyl }}
            >
              {success ? (
                <p>Já podes iniciar sessão com as tuas credenciais</p>
              ) : (
                <>
                  Introduz o código que enviámos para o teu email.
                  <p>É válido por 30 segundos</p>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col w-full max-w-[480px] self-center items-center gap-8">
            {!success && (
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
            )}
            <button
              onClick={success ? () => navigate("/login") : handleVerifyEmail}
              disabled={!success && !isOtpComplete}
              className={`flex items-center justify-center gap-2 rounded-md w-full ${
                success || isOtpComplete
                  ? "cursor-pointer"
                  : "cursor-not-allowed"
              }`}
              style={{
                backgroundColor:
                  success || isOtpComplete ? COLORS.primary : COLORS.gray,
                padding: "14px 24px",
                transition: "background-color 0.3s",
              }}
            >
              {!success ? (
                <p
                  className="text-gray-100 font-semibold"
                  style={{ fontSize: SIZES.bodyl }}
                >
                  Continuar
                </p>
              ) : (
                <Link
                  to="/login"
                  className="text-gray-100 font-semibold"
                  style={{ fontSize: SIZES.bodyl }}
                >
                  Iniciar Sessão
                </Link>
              )}
            </button>
            {!success && (
              <p
                className="flex items-center justify-center text-regular text-gray-900"
                style={{ fontSize: SIZES.caption, gap: 4 }}
              >
                Não recebeste o email?{" "}
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
            )}
          </div>
        </div>
      </div>
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
    </div>
  );
};

export default VerifyEmail;
