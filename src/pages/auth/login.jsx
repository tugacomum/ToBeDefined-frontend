import '../../styles/ToBeDefinedStyle.css';
import { useState } from 'react';
import { useAuth } from '../../contexts/auth';
import { useNavigate, Link } from 'react-router-dom';
import { CheckBox, Input, LogoAndName } from '../../components/components';
import { MailIcon, ArrowRight, KeyIcon } from '../../components/icons';

const Login = () => {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [hasErrorEmail, setHasErrorEmail] = useState(false);
    const [hasErrorPassword, setHasErrorPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

const handleLogin = async () => {

  const invalidEmail = email.trim() === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const invalidPassword = password.trim() === '';

  setHasErrorEmail(invalidEmail);
  setHasErrorPassword(invalidPassword);

  if (invalidEmail || invalidPassword) return;

  try {
    const body = {
        email: email.trim(),
        password: password.trim(),
    };
    await login(body);  
    navigate('/home', { replace: true });
  } catch (error) {
    console.error('Login failed:', error);
  }
};

    return (
        <div className="flex min-h-screen bg-white">

            <div className="flex flex-col justify-center items-center w-1/2 h-screen max-h-screen">
                <div className="h-screen w-full p-6">
                    <div className="w-full h-full backgroundLogin place-content-center">
                        <div className="flex flex-col items-start self-stretch pr-15 pl-25 gap-8">
                            <LogoAndName />
                            <div>
                                <h1 className="text-4xl text-gray-100 font-bold">
                                    Unlock Your Learning Potential
                                </h1>
                                <p className="mt-2 text-xl font-medium text-gray-200">
                                    Inicia sessão para continuares a tua jornada de crescimento e conhecimento.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center items-center w-1/2 px-8">
                <div className="w-full pl-31_5 pr-30">
                    <h2 className="text-4xl font-bold mb-2.5 text-gray-900">Bem vindo de volta!</h2>
                    <p className="text-lg font-normal mb-8 text-gray-400">Faz login na tua conta e retoma o teu estudo organizado.</p>
                    <form>
                        <div className="space-y-6">
                            <div>
                                {Input("Email", "Enter your email", false, true, null, <MailIcon HasError={hasErrorEmail} />, hasErrorEmail, email.trim === '' ? "Preencha o email" : "Email inválido", email, e => { setEmail(e.target.value); if (hasErrorEmail) setHasErrorEmail(false) }, false)}
                            </div>
                            <div>
                                {Input("Password", "Enter your password", false, true, null, <KeyIcon HasError={hasErrorPassword} />, hasErrorPassword, password.trim === '' ? "Preencha a password" : "Password incorreta", password, e => { setPassword(e.target.value); if (hasErrorPassword) setHasErrorPassword(false) }, true)}
                            </div>
                        </div>
                        <div className="mt-2">
                            <div className="flex items-center justify-between">
                                {CheckBox("Lembra-me", () => setRememberMe(!rememberMe))}
                                <Link to="/forgotPassword" className="text-xs text-blue-500">Esqueceste-te da password?</Link>
                            </div>
                            <button type="button" onClick={handleLogin} className="largeButton w-full mt-8">Login<span className="ml-2 align-middle"><ArrowRight /></span> </button>
                        </div>
                    </form>
                    <div className="mt-6 text-center font-normal text-xs text-gray-900">
                        Ainda não tens conta? <Link to="/register" className="font-semibold text-blue-500">Faz registo</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
