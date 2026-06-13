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
      <label htmlFor={id} className="block text-sm font-medium text-text-heading">
        {label}
      </label>
      <input
        {...props}
        {...register}
        id={id}
        className={`w-full px-4 py-3 bg-input-bg border rounded-lg focus:outline-none transition-colors ${
          error
            ? "border-error/50 focus:border-error focus:ring-2 focus:ring-error/20"
            : "border-border-subtle focus:border-input-focus focus:ring-2 focus:ring-brand/20"
        } text-text-body placeholder-text-muted`}
      />
      {error && (
        <p className="text-sm text-error flex items-center gap-1">
          <span className="text-error">•</span>
          {error.message}
        </p>
      )}
    </div>
  );
}
