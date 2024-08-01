// src/components/Input.tsx
import React from "react";
import { UseFormRegister, FieldError } from "react-hook-form";

interface InputProps {
  id: string;
  label: string;
  type: string;
  register: UseFormRegister<any>;
  required?: boolean;
  pattern?: RegExp;
  validationMessage?: string;
  error?: FieldError;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type,
  register,
  required,
  pattern,
  validationMessage,
  error,
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-gray-700">
        {label}
      </label>
      <input
        type={type}
        id={id}
        {...register(id, {
          required: required ? `${label} is required` : false,
          pattern: pattern
            ? { value: pattern, message: validationMessage ?? "" }
            : undefined,
        })}
        className="mt-1 p-2 w-full border rounded-md"
      />
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
};

export default Input;
