import '../../styles/ToBeDefinedStyle.css';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/auth';
import { useNavigate, Link } from 'react-router-dom';
import { Input, LogoAndName, Steps } from '../../components/components';
import { MailIcon, CircleWithCorrectIcon, ArrowLeft } from '../../components/icons';
import { api } from '../../services/api';

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [hasErrorEmail, setHasErrorEmail] = useState(false);
    const [code, setCode] = useState(Array(6).fill(''));
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const sendRecoveryPassword = () => {

        const invalidEmail = email.trim() === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        setHasErrorEmail(invalidEmail);

        if (invalidEmail) return;
        setEmail(email.trim());
        const body = { email: email.trim() };
        api.post('/api/auth/forgot-password', body)
            .then(() => {
                setStep(2);
            })
            .catch((error) => {
                console.error('Error sending recovery email:', error);
            });
    };

    const step2 = () => {
        const isValid = code.every((digit) => /^\d$/.test(digit));
        if (!isValid) return;
        setStep(3);
    }

    //falta rota para reenviar codigo

    const resetPassword = () => {
        const body = { email: email.trim(), code : code.join(''), newPassword};
        api.post('/api/auth/reset-password', body)
            .then(() => {
                console.log('Password reset successful');
                navigate('/login');
            })
            .catch((error) => {
                console.error('Error resetting password:', error);
            });
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

            <div className="flex flex-col justify-between items-center w-1/2 px-8 py-8">

                {step === 1 && (<Step1 email={email} setEmail={setEmail} hasErrorEmail={hasErrorEmail} setHasErrorEmail={setHasErrorEmail} sendRecoveryPassword={sendRecoveryPassword} />)}

                {step === 2 && (<Step2 email={email} code={code} setCode={setCode} onContinue={step2} />)}

                {step === 3 && (<Step3 newPassword={newPassword} setNewPassword={setNewPassword} confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword} onClick={resetPassword} />)}
                <div className="w-full flex justify-center ">
                    {Steps(step, 3)}
                </div>
            </div>

        </div>
    );
}

export default ForgotPassword;

function Step1({ email, setEmail, hasErrorEmail, setHasErrorEmail, sendRecoveryPassword }) {
    return (
        <>
            <div className="w-full  flex justify-end text-xs text-gray-500 gap-1 pl-31_5 pr-30">
                Ainda não tens conta?
                <Link to="/register" className="font-semibold text-blue-500">Faz registo</Link>
            </div>

            <div className="w-full max-w-md flex-1 flex flex-col justify-center">
                <h2 className="text-4xl font-bold mb-2.5 text-gray-900">
                    Esqueceste-te da password?
                </h2>
                <p className="text-lg text-gray-400 mb-8">
                    Não te preocupes, vamos enviar-te as instruções de redefinição da password.
                </p>

                <form className="space-y-8">
                    {Input(
                        "Email",
                        "Introduz o teu email institucional",
                        false,
                        true,
                        null,
                        <MailIcon HasError={hasErrorEmail} />,
                        hasErrorEmail,
                        email.trim() === '' ? "Preencha o email" : "Email inválido",
                        email,
                        (e) => {
                            setEmail(e.target.value);
                            if (hasErrorEmail) setHasErrorEmail(false);
                        },
                        false
                    )}

                    <button type="button" onClick={sendRecoveryPassword} className="w-full largeButton">Redefinir password</button>

                    <div>
                        <Link to="/login" className="flex items-center justify-center gap-1 text-xs font-normal text-gray-500"><ArrowLeft className="w-4 h-4 text-gray-500" />Retoma o início de sessão</Link>
                    </div>
                </form>
            </div>
        </>
    );
}

function Step2({ email, code, setCode, onContinue, resendCode }) {
    const handleChange = (e, idx) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length > 1) return;
        const newCode = [...code];
        newCode[idx] = value;
        setCode(newCode);
        if (value && idx < 5) {
            document.getElementById(`code-input-${idx + 1}`)?.focus();
        }
    };


    return (
        <>
            <div className="w-full flex-1 flex flex-col justify-center pl-31_5 pr-30">
                <h2 className="text-4xl font-bold mb-2.5 text-gray-900">Redefinição da password</h2>
                <p className="text-base text-gray-400 mb-8 mr-2">Enviámos um email para <span className='font-semibold'>{email}</span></p>

                <form className="space-y-8">
                    <div className="flex justify-between gap-2.5 mb-6">
                        {[...Array(6)].map((_, i) => (
                            <input
                                key={i}
                                id={`code-input-${i}`}
                                type="text"
                                maxLength="1"
                                value={code[i]}
                                onChange={e => handleChange(e, i)}
                                className="p-4 text-5xl font-bold text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 w-18 h-26"
                            />
                        ))}
                    </div>

                    <div className="w-full flex justify-center text-xs text-gray-900 gap-1">
                        Não recebeste o email?
                        <button type="text" onClick={resendCode} className="font-semibold text-blue-500">Clica aqui para reenviar</button>
                    </div>

                    <button type="button" onClick={onContinue} className="w-full largeButton">Continuar</button>

                    <div>
                        <Link to="/login" className="flex items-center justify-center gap-1 text-xs font-normal text-gray-500"><ArrowLeft className="w-4 h-4 text-gray-500" />Retoma o início de sessão</Link>
                    </div>
                </form>
            </div>
        </>
    );
}

function Step3({ newPassword, setNewPassword, confirmPassword, setConfirmPassword, onClick }) {
    const [showCheck, setShowCheck] = useState(false);

    useEffect(() => {
        setShowCheck(newPassword !== '' && confirmPassword !== '' && newPassword === confirmPassword && newPassword.length >= 8 );
    }, [newPassword, confirmPassword]);

    return (
        <>
            <div className="w-full flex-1 flex flex-col justify-center pl-31_5 pr-30">
                <h2 className="text-4xl font-bold mb-2.5 text-gray-900">Define uma nova password</h2>
                <p className="text-base text-gray-400 mb-8 mr-2">Tem que ter pelo menos 8 caracteres</p>

                <form className="space-y-8">

                    {Input("Password", "Introduz a tua nova password", false, false, null, null, false, "", newPassword, (e) => setNewPassword(e.target.value), true)}
                    {Input("Confirma a password", "Introduz novamente a tua password", showCheck, false, showCheck ? <CircleWithCorrectIcon /> : null, null, false, "", confirmPassword, (e) => setConfirmPassword(e.target.value), true, showCheck)}

                    <button type="button" disabled={!showCheck} onClick={onClick} className="w-full largeButton">Redefinir password</button>
                </form>
            </div>
        </>
    );
}

