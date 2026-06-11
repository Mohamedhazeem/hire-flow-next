// components/FormInput.tsx
import type { UseFormRegisterReturn, FieldError } from "react-hook-form";

interface FormInputProps {
  label: string;
  id: string;
  type?: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
}

export function FormInput({ label, id, error, register, ...props }: FormInputProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-slate-200">
        {label}
      </label>
      <input
        {...props}
        {...register}
        id={id}
        className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg focus:outline-none transition-colors ${
          error
            ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
            : "border-slate-600/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        } text-white placeholder-slate-500`}
      />
      {error && (
        <p className="text-sm text-red-400 flex items-center gap-1">
          <span className="text-red-500">•</span>
          {error.message}
        </p>
      )}
    </div>
  );
}
