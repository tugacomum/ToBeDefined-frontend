import '../styles/ToBeDefinedStyle.css';
import {MailIcon, ClosedEye, OpenedEye, ErrorInfoIcon, ArrowRight, Logo, CircleWithCorrectIcon} from './icons';
import React, { useState } from 'react';

const InputErrorMessage = ({ Message }) => (
    <div className="flex items-center mt-1 bg-red-50 text-red-600 text-sm rounded px-2 py-1">
        <span className="mr-2">
            <ErrorInfoIcon />
        </span>
        {Message}
    </div>
);

export function LogoAndName() {
    return (
        <div className="flex items-center justify-center gap-2 pt-1.5 pb-1.5">
            <Logo className="w-12 h-12" />
            <span className="text-4xl font-bold text-gray-100">ToBeDefined</span>
        </div>
    );
}

export function Input (Label, Placeholder, HasIconRight, HasIconLeft, IconRight, IconLeft, HasError, ErrorMessageText, Value, onChange, isPassword, confirmPasswordCorrect) {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex flex-col">
            {Label && <label className="text-sm font-medium text-zinc-900">{Label}</label>}
            <div className="relative mt-1">
                <input
                    type={isPassword ? (showPassword ? "text" : "password") : "text"}
                    placeholder={Placeholder}
                    className={`block w-full py-4 border rounded-md shadow-sm focus:outline-none
                        ${HasError && !isFocused? 'border-red-500' : isFocused ? 'border-blue-500' : confirmPasswordCorrect? 'border-green-600' : 'border-gray-300'}
                        ${isFocused ? 'ring-2 ring-blue-300' : ''}
                        ${HasIconLeft ? 'pl-10' : 'px-3'}
                        ${(HasIconRight || isPassword) ? 'pr-10' : 'px-3'}
                    `}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={onChange}
                    value={Value}
                />
                {HasIconLeft && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                        {React.cloneElement(IconLeft, { HasError, IsFocused: isFocused })}
                    </span>
                )}
                {(HasIconRight || isPassword) && (
                    <span
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        onClick={!HasIconRight && isPassword ? toggleShowPassword : undefined}
                        style={{ cursor: isPassword ? 'pointer' : 'default' }}
                    >
                        {!HasIconRight && isPassword
                            ? React.cloneElement(showPassword ? <OpenedEye /> : <ClosedEye />, { HasError, IsFocused: isFocused })
                            : IconRight && React.cloneElement(IconRight, { HasError, IsFocused: isFocused })}
                    </span>
                )}
            </div>
            {HasError && (
                <InputErrorMessage Message = {ErrorMessageText}/>
            )}
        </div>
    );
}

export function CheckBox  (Text, onChange)  {
    return (
        <div className="flex items-center">
            <input onChange={onChange} type="checkbox" id="checkbox" className="mr-2 checkBox" />
            <label htmlFor="checkbox" className="text-xs ml-1 text-gray-500">{Text}</label>
        </div>
)}

export function Steps (Step, TotalSteps) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
                {Array.from({ length: TotalSteps }, (_, index) => (
                    <span key={index} className={`w-25 h-2.5 rounded-full ${index + 1 === Step ? 'bg-blue-500' : 'bg-gray-300'}`}></span>
                ))}
            </div>
        </div>
    );
}

{/* apenas para teste de componentes */}

const Components = () => {
    const error = true;
    const [password, setPassword] = useState('');
    return (
        <div className="p-4"> 
            <h2 className="text-2xl font-bold mb-4">Components</h2>
            <div className="space-y-4">
                {input("Password", "Enter your password", false, true, null, <MailIcon HasError={error} />, error, "Invalid password", password, e => setPassword(e.target.value), true)}
            </div>
            <button className='SmallButton'>sdfsdf <span className="ml-2 align-middle"><ArrowRight /></span></button>
            {checkBox("Lembra-me", () => console.log("Checkbox toggled"))}
        </div>

        
    );
};


export default Components;
