import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "ref"> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, type = "text", placeholder, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {label && <p className="text-blue-300 ml-2 mt-2">{label}</p>}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={`border px-2 py-2 outline-none ${className}`}
          aria-invalid={error ? "true" : "false"}
          {...props}
        />
        {error && <p className="text-red-400 text-sm ml-2" role="alert">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;