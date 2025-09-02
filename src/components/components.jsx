import React, { useEffect, useRef, useState } from "react";

import {
  MailIcon,
  ClosedEye,
  OpenedEye,
  ErrorInfoIcon,
  ArrowRight,
  Logo,
  LockIcon,
  CheckBoxIcon,
  CheckedIcon,
  CircleWithCorrectIcon,
  ArrowDown,
  Laptop,
  ArrowUp,
} from "./icons";

import { COLORS, SIZES } from "../styles/theme";
import "../styles/ToBeDefinedStyle.css";

export const InputErrorMessage = ({ Message }) => (
  <div
    className="flex flex-row p-1 items-center gap-1 text-red-500 text-regular"
    style={{ fontSize: SIZES.caption }}
  >
    <ErrorInfoIcon />
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

export function Input(
  Label,
  Placeholder,
  HasIconRight,
  HasIconLeft,
  IconRight,
  IconLeft,
  HasError,
  ErrorMessageText,
  Value,
  onChange,
  isPassword,
  confirmPasswordCorrect
) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col">
      {Label && (
        <label className="text-sm font-medium text-zinc-900">{Label}</label>
      )}
      <div className="relative mt-1">
        <input
          type={isPassword ? (showPassword ? "text" : "password") : "text"}
          placeholder={Placeholder}
          className={`block w-full py-4 border rounded-md shadow-sm focus:outline-none
                        ${
                          HasError && !isFocused
                            ? "border-red-500"
                            : isFocused
                            ? "border-blue-500"
                            : confirmPasswordCorrect
                            ? "border-green-600"
                            : "border-gray-300"
                        }
                        ${isFocused ? "ring-2 ring-blue-300" : ""}
                        ${HasIconLeft ? "pl-10" : "px-3"}
                        ${HasIconRight || isPassword ? "pr-10" : "px-3"}
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
            onClick={
              !HasIconRight && isPassword ? toggleShowPassword : undefined
            }
            style={{ cursor: isPassword ? "pointer" : "default" }}
          >
            {!HasIconRight && isPassword
              ? React.cloneElement(
                  showPassword ? <OpenedEye /> : <ClosedEye />,
                  { HasError, IsFocused: isFocused }
                )
              : IconRight &&
                React.cloneElement(IconRight, {
                  HasError,
                  IsFocused: isFocused,
                })}
          </span>
        )}
      </div>
      {HasError && <InputErrorMessage Message={ErrorMessageText} />}
    </div>
  );
}

export function CheckBox(Text, onChange) {
  return (
    <div className="flex items-center">
      <input
        onChange={onChange}
        type="checkbox"
        id="checkbox"
        className="mr-2 checkBox"
      />
      <label htmlFor="checkbox" className="text-xs ml-1 text-gray-500">
        {Text}
      </label>
    </div>
  );
}

export function CheckBoxv2() {
  const [checked, setChecked] = useState(false);

  const toggleChecked = () => setChecked((prev) => !prev);

  return (
    <div
      onClick={toggleChecked}
      style={{
        cursor: "pointer",
        position: "relative",
        width: 24,
        height: 24,
      }}
    >
      <CheckBoxIcon
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transition: "opacity 0.3s",
          opacity: checked ? 0 : 1,
        }}
      />
      <CheckedIcon
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transition: "opacity 0.3s",
          opacity: checked ? 1 : 0,
        }}
      />
    </div>
  );
}

export function Steps(Step, TotalSteps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        {Array.from({ length: TotalSteps }, (_, index) => (
          <span
            key={index}
            className={`w-25 h-2.5 rounded-full ${
              index + 1 === Step ? "bg-blue-500" : "bg-gray-300"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
}

export function Inputv2({
  type,
  value,
  onChange,
  error,
  onBlur,
  loginAttempted,
  placeHolder,
  keyIcon,
  success,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const hasError =
  error || 
  (type === "email" && (!emailRegex.test(value) || value.length === 0) && loginAttempted) ||
  (type === "password" && (value.length === 0 || value.length < 8) && loginAttempted);

  const inputType = type === "password" && showPassword ? "text" : type;

  const togglePassword = (e) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
    inputRef.current?.focus();
  };

  const isValid =
    type === "email"
      ? emailRegex.test(value) && value.length > 0
      : type === "password"
      ? value.length >= 8
      : value.length > 0;

  const borderColor = hasError
    ? COLORS.danger
    : success
    ? COLORS.success
    : isValid
    ? COLORS.primary
    : isFocused
    ? COLORS.primary
    : COLORS.gray;

  return (
    <div
      className="flex items-center border rounded-md gap-2"
      style={{
        padding: 16,
        borderWidth: 1.5,
        borderColor: borderColor,
        boxShadow:
          isFocused && !hasError
            ? "0px 2px 6px 0px rgba(59, 130, 246, 0.18)"
            : "none",
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}
    >
      {type === "email" ? (
        <MailIcon
          IsFocused={isFocused && !hasError}
          HasError={hasError}
          IsValid={isValid}
        />
      ) : (
        keyIcon &&
        !success && (
          <LockIcon
            IsFocused={isFocused && !hasError}
            HasError={hasError}
            IsValid={isValid}
          />
        )
      )}
      <input
        ref={inputRef}
        type={inputType}
        onChange={onChange}
        value={value}
        className="flex-1 outline-none text-gray-900 placeholder-gray-400 text-regular"
        style={{ fontSize: SIZES.bodym }}
        placeholder={
          type === "email"
            ? "Introduz o teu email institucional"
            : placeHolder
            ? placeHolder
            : "Introduz a tua password"
        }
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false);
          if (onBlur) onBlur(e);
        }}
      />
      {success ? (
        <CircleWithCorrectIcon />
      ) : (
        type === "password" && (
          <div onMouseDown={togglePassword} className="cursor-pointer">
            {showPassword ? (
              <OpenedEye
                IsFocused={isFocused && !hasError}
                HasError={hasError}
                IsValid={isValid}
              />
            ) : (
              <ClosedEye
                IsFocused={isFocused && !hasError}
                HasError={hasError}
                IsValid={isValid}
              />
            )}
          </div>
        )
      )}
    </div>
  );
}

export const CourseDropdown = ({
  coursesByCategory,
  onSelect,
  courseError,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCategories = coursesByCategory
    .map((cat) => {
      const matchCategory = cat.category
        .toLowerCase()
        .includes(query.toLowerCase());

      return {
        category: cat.category,
        courses: matchCategory
          ? cat.courses
          : cat.courses.filter((c) =>
              c.title.toLowerCase().includes(query.toLowerCase())
            ),
      };
    })
    .filter(
      (cat) =>
        cat.courses.length > 0 ||
        cat.category.toLowerCase().includes(query.toLowerCase())
    );

  const iconColor = courseError
    ? "text-red-500"
    : isOpen || selected
    ? "text-blue-500"
    : "text-gray-500";

  const borderColor = courseError
    ? "red"
    : isOpen || selected
    ? COLORS.primary
    : COLORS.gray;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className={`flex items-center border rounded-md cursor-pointer`}
        style={{
          borderWidth: 1.5,
          transition: "border-color 0.3s, box-shadow 0.3s",
          borderColor,
        }}
      >
        <Laptop
          className={`ml-4 ${
            courseError
              ? "text-red-500"
              : isOpen || selected
              ? "text-blue-500"
              : "text-gray-500"
          }`}
        />
        {!isOpen ? (
          <span
            className={`flex-1 ${
              !selected ? "text-gray-400" : "text-gray-900"
            } select-none`}
            style={{
              fontSize: SIZES.bodym,
              padding: 16,
              paddingLeft: 8,
            }}
            onClick={() => setIsOpen(true)}
          >
            {selected ? selected.title : "Escolhe o teu curso"}
          </span>
        ) : (
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-900"
            style={{
              fontSize: SIZES.bodym,
              padding: 16,
              paddingLeft: 8,
            }}
          />
        )}
        {isOpen ? (
          <ArrowUp
            className={`mr-4 cursor-pointer ${iconColor}`}
            onClick={() => setIsOpen(false)}
          />
        ) : (
          <ArrowDown
            className={`mr-4 cursor-pointer ${iconColor}`}
            onClick={() => setIsOpen(true)}
          />
        )}
      </div>
      {isOpen && (
        <ul
          className={`absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg max-h-48 overflow-y-auto custom-scrollbar`}
          style={{ borderWidth: 1.5, padding: "16px 8px", borderColor }}
        >
          {filteredCategories.map((cat, index) => (
            <li
              key={cat.category}
              className={`flex flex-col gap-2 ${index !== 0 ? "mt-2" : ""}`}
            >
              <div
                className="font-semibold text-gray-900"
                style={{ fontSize: SIZES.caption, padding: "0 4px" }}
              >
                {cat.category}
              </div>
              <div className="flex flex-col gap-2">
                {cat.courses.map((course) => {
                  const isSelected = selected?.id === course.id;
                  return (
                    <div
                      key={course.id}
                      className={`cursor-pointer text-regular ${
                        isSelected
                          ? "bg-blue-100 text-gray-500"
                          : "hover:bg-gray-100 text-gray-500"
                      }`}
                      style={{
                        fontSize: SIZES.bodys,
                        padding: "4px 8px",
                        borderRadius: 6,
                      }}
                      onClick={() => {
                        setSelected(course);
                        setQuery("");
                        setIsOpen(false);
                        onSelect(course);
                      }}
                    >
                      {course.title}
                    </div>
                  );
                })}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

{
  /* apenas para teste de componentes */
}

const Components = () => {
  const error = true;
  const [password, setPassword] = useState("");
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Components</h2>
      <div className="space-y-4">
        {input(
          "Password",
          "Enter your password",
          false,
          true,
          null,
          <MailIcon HasError={error} />,
          error,
          "Invalid password",
          password,
          (e) => setPassword(e.target.value),
          true
        )}
      </div>
      <button className="SmallButton">
        sdfsdf{" "}
        <span className="ml-2 align-middle">
          <ArrowRight />
        </span>
      </button>
      {checkBox("Lembra-me", () => {})}
    </div>
  );
};

export default Components;
