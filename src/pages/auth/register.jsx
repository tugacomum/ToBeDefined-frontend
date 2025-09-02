import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/auth";
import {
  CourseDropdown,
  InputErrorMessage,
  Inputv2,
  LogoAndName,
} from "../../components/components";
import { ArrowRight } from "../../components/icons";
import { COLORS, SIZES } from "../../styles/theme";
import { api } from "../../services/api";

const Register = () => {
  const { register } = useAuth();

  const [coursesByCategory, setCoursesByCategory] = useState([]);

  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [passwordError, setPasswordError] = useState("");
  const [courseError, setCourseError] = useState("");

  const [registerAttempted, setRegisterAttempted] = useState(false);

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const isFormValid =
    email.length > 0 && password.length > 7 && validateEmail(email);

  const handleRegister = async () => {
    setRegisterAttempted(true);
    setPasswordError("");
    setCourseError("");

    if (!selectedCourse) {
      setCourseError("Curso obrigatório");
      return;
    }

    if (!password) {
      setPasswordError("A password é obrigatória");
      return;
    }

    try {
      const res = await register({
        email,
        password,
        courseId: selectedCourse.id,
      });

      if (res?.success && res?.userId) {
        navigate("/verifyEmail", { state: { userId: res.userId } });
      }
    } catch (err) {
      setPasswordError("Credenciais incorretas.");
    }
  };

  useEffect(() => {
    async function fetchCourses() {
      const res = await api.get("/api/course/coursesByType");

      if (res.data.success) {
        const mapping = {
          ctesp: "CTeSP",
          licenciatura: "Licenciaturas",
          mestrado: "Mestrados",
          doutoramento: "Doutoramentos",
        };

        const categories = Object.keys(res.data.data).map((key) => ({
          category: mapping[key] || key,
          courses: res.data.data[key],
        }));

        setCoursesByCategory(categories);
      }
    }
    fetchCourses();
  }, []);

  return (
    <div className="flex w-full h-screen overflow-hidden">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="flex flex-col gap-8 w-full max-w-[480px]">
          <div className="flex flex-col gap-2.5">
            <h1
              className="text-gray-900 font-bold"
              style={{ fontSize: SIZES.h1 }}
            >
              Bem vindo!
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
                  loginAttempted={registerAttempted}
                />
              </div>
              {!validateEmail(email) && registerAttempted && (
                <InputErrorMessage Message="Email inválido." />
              )}
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-col gap-2">
                <p
                  className="text-gray-900 font-medium"
                  style={{ fontSize: SIZES.bodys }}
                >
                  Curso
                </p>
                {coursesByCategory.length > 0 && (
                  <CourseDropdown
                    coursesByCategory={coursesByCategory}
                    key={coursesByCategory.map((cat) => cat.category).join(",")}
                    courseError={courseError}
                    onSelect={(course) => {
                      setSelectedCourse(course);
                      setCourseError("");
                    }}
                  />
                )}
              </div>
              {registerAttempted && courseError && (
                <InputErrorMessage Message={courseError} />
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
                  loginAttempted={registerAttempted}
                  error={!!passwordError}
                />
              </div>
              {registerAttempted && passwordError && (
                <InputErrorMessage Message={passwordError} />
              )}
              <p
                className="text-regular text-gray-400"
                style={{ fontSize: SIZES.small }}
              >
                A password deverá ter no mínimo 8 caracteres
              </p>
            </div>
            <div
              className="flex text-regular text-gray-400 gap-1"
              style={{ fontSize: SIZES.caption }}
            >
              Ao clicares estás a aceitar os{" "}
              <Link
                to="/terms"
                className="text-blue-500 underline decoration-blue-500"
              >
                Termos e Condições
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-6 text-center">
            <button
              onClick={handleRegister}
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
                Criar conta
              </p>
              <ArrowRight />
            </button>
            <div
              className="flex justify-center items-center gap-1 text-gray-900 font-regular"
              style={{ fontSize: SIZES.caption }}
            >
              Já tens conta?
              <Link
                to="/login"
                className="text-primary font-semibold cursor-pointer"
                style={{ color: COLORS.primary }}
              >
                Inicia sessão
              </Link>
            </div>
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

export default Register;
