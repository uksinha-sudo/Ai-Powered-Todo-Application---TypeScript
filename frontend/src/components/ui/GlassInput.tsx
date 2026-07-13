import { motion, type HTMLMotionProps } from "motion/react";
import { forwardRef, type ReactNode, type InputHTMLAttributes, type SelectHTMLAttributes, useId } from "react";

interface GlassInputBaseProps extends Omit<HTMLMotionProps<"div">, "children"> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  fullWidth?: boolean;
  className?: string;
  variant?: "default" | "filled" | "outlined" | "glass";
  size?: "sm" | "md" | "lg";
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  autoComplete?: string;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputBaseProps>(
  (
    {
      label,
      type = "text",
      placeholder,
      error,
      helperText,
      leftIcon,
      rightIcon,
      leftElement,
      rightElement,
      fullWidth = true,
      variant = "glass",
      size = "md",
      id: providedId,
      disabled,
      required,
      value,
      onChange,
      autoComplete,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;

    const hasError = Boolean(error);
    const hasLeftElement = leftIcon || leftElement;
    const hasRightElement = rightIcon || rightElement;

    const variantStyle: Record<string, string> = {
      default: "bg-bg-elevated backdrop-blur-sm border border-border focus:border-accent/50 focus:ring-2 focus:ring-accent/20",
      filled: "bg-bg-card/50 backdrop-blur-sm border border-transparent focus:bg-bg-card/80 focus:border-accent/50",
      outlined: "bg-transparent backdrop-blur-sm border border-border hover:border-border-hover focus:border-accent focus:ring-2 focus:ring-accent/20",
      glass: "bg-bg-card/40 backdrop-blur-xl border border-border/30 focus:bg-bg-card/60 focus:border-accent/50 focus:ring-2 focus:ring-accent/20",
    };

    const sizeStyle: Record<string, string> = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-3 text-base",
      lg: "px-5 py-4 text-lg",
    };

    const labelSizeStyle: Record<string, string> = {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    };

    return (
      <motion.div
        className={`flex flex-col gap-1.5 ${fullWidth ? "w-full" : ""}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        {...props}
      >
        {label && (
          <motion.label
            htmlFor={id}
            className={`font-medium text-text-subtle mb-1.5 ${labelSizeStyle[size] ?? labelSizeStyle.md}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {label}
            {required && <span className="text-danger ml-1" aria-hidden="true">*</span>}
          </motion.label>
        )}

        <motion.div
          className={`
            relative flex items-center
            ${hasLeftElement ? "pl-10" : ""}
            ${hasRightElement ? "pr-10" : ""}
          `}
        >
          {hasLeftElement && (
            <motion.div
              className="absolute left-3 flex items-center text-text-muted pointer-events-none"
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {leftElement || leftIcon}
            </motion.div>
          )}

          <motion.input
            ref={ref}
            id={id}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            aria-invalid={hasError ? "true" : "false"}
            aria-describedby={hasError ? errorId : helperText ? helperId : undefined}
            value={value}
            onChange={onChange}
            autoComplete={autoComplete}
            className={`
              w-full bg-transparent text-text placeholder:text-text-muted
              outline-none transition-all duration-200
              disabled:opacity-40 disabled:cursor-not-allowed
              ${variantStyle[variant] ?? variantStyle.glass} ${sizeStyle[size] ?? sizeStyle.md}
              ${hasError ? "border-danger/50 focus:border-danger focus:ring-danger/20" : ""}
            `}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            whileFocus={{ scale: [1, 1.005, 1] }}
            {...props}
          />

          {hasRightElement && (
            <motion.div
              className="absolute right-3 flex items-center text-text-muted"
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {rightElement || rightIcon}
            </motion.div>
          )}

          <motion.div
            className={`
              absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300
              ${hasError ? "bg-danger/5" : "bg-white/5"}
            `}
            animate={{ opacity: hasError ? 1 : 0 }}
          />
        </motion.div>

        {hasError && (
          <motion.p
            id={errorId}
            className="text-danger text-sm flex items-center gap-1"
            role="alert"
            initial={{ opacity: 0, y: -5, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -5, height: 0 }}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </motion.p>
        )}

        {!hasError && helperText && (
          <motion.p
            id={helperId}
            className="text-text-muted text-sm"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {helperText}
          </motion.p>
        )}
      </motion.div>
    );
  }
);

GlassInput.displayName = "GlassInput";

interface GlassTextareaBaseProps {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  variant?: "default" | "filled" | "outlined" | "glass";
  size?: "sm" | "md" | "lg";
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  id?: string;
}

export const GlassTextarea = forwardRef<HTMLTextAreaElement, GlassTextareaBaseProps>(
  (
    {
      label,
      placeholder,
      error,
      helperText,
      fullWidth = true,
      variant = "glass",
      size = "md",
      rows = 3,
      id: providedId,
      disabled,
      required,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;

    const hasError = Boolean(error);

    const variantStyle: Record<string, string> = {
      default: "bg-bg-elevated backdrop-blur-sm border border-border focus:border-accent/50 focus:ring-2 focus:ring-accent/20",
      filled: "bg-bg-card/50 backdrop-blur-sm border border-transparent focus:bg-bg-card/80 focus:border-accent/50",
      outlined: "bg-transparent backdrop-blur-sm border border-border hover:border-border-hover focus:border-accent focus:ring-2 focus:ring-accent/20",
      glass: "bg-bg-card/40 backdrop-blur-xl border border-border/30 focus:bg-bg-card/60 focus:border-accent/50 focus:ring-2 focus:ring-accent/20",
    };

    const sizeStyle: Record<string, string> = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-3 text-base",
      lg: "px-5 py-4 text-lg",
    };

    const labelSizeStyle: Record<string, string> = {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    };

    return (
      <motion.div
        className={`flex flex-col gap-1.5 ${fullWidth ? "w-full" : ""}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        {...props}
      >
        {label && (
          <motion.label
            htmlFor={id}
            className={`font-medium text-text-subtle mb-1.5 ${labelSizeStyle[size] ?? labelSizeStyle.md}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {label}
            {required && <span className="text-danger ml-1" aria-hidden="true">*</span>}
          </motion.label>
        )}

        <motion.textarea
          ref={ref}
          id={id}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={rows}
          aria-invalid={hasError ? "true" : "false"}
          aria-describedby={hasError ? errorId : helperText ? helperId : undefined}
          value={value}
          onChange={onChange}
          className={`
            w-full bg-transparent text-text placeholder:text-text-muted resize-none
            outline-none transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${variantStyle[variant] ?? variantStyle.glass} ${sizeStyle[size] ?? sizeStyle.md}
            ${hasError ? "border-danger/50 focus:border-danger focus:ring-danger/20" : ""}
          `}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          whileFocus={{ scale: [1, 1.005, 1] }}
          {...props}
        />

        {hasError && (
          <motion.p
            id={errorId}
            className="text-danger text-sm flex items-center gap-1"
            role="alert"
            initial={{ opacity: 0, y: -5, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -5, height: 0 }}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </motion.p>
        )}

        {!hasError && helperText && (
          <motion.p
            id={helperId}
            className="text-text-muted text-sm"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {helperText}
          </motion.p>
        )}
      </motion.div>
    );
  }
);

GlassTextarea.displayName = "GlassTextarea";

interface GlassSelectBaseProps {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  variant?: "default" | "filled" | "outlined" | "glass";
  size?: "sm" | "md" | "lg";
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  required?: boolean;
  options: { value: string; label: string }[];
  id?: string;
  selectProps?: Omit<SelectHTMLAttributes<HTMLSelectElement>, "ref">;
}

export const GlassSelect = forwardRef<HTMLSelectElement, GlassSelectBaseProps>(
  (
    {
      label,
      placeholder,
      error,
      helperText,
      options,
      fullWidth = true,
      variant = "glass",
      size = "md",
      id: providedId,
      disabled,
      required,
      value,
      onChange,
      selectProps,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;

    const hasError = Boolean(error);

    const variantStyle: Record<string, string> = {
      default: "bg-bg-elevated backdrop-blur-sm border border-border focus:border-accent/50 focus:ring-2 focus:ring-accent/20",
      filled: "bg-bg-card/50 backdrop-blur-sm border border-transparent focus:bg-bg-card/80 focus:border-accent/50",
      outlined: "bg-transparent backdrop-blur-sm border border-border hover:border-border-hover focus:border-accent focus:ring-2 focus:ring-accent/20",
      glass: "bg-bg-card/40 backdrop-blur-xl border border-border/30 focus:bg-bg-card/60 focus:border-accent/50 focus:ring-2 focus:ring-accent/20",
    };

    const sizeStyle: Record<string, string> = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-3 text-base",
      lg: "px-5 py-4 text-lg",
    };

    const labelSizeStyle: Record<string, string> = {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    };

    return (
      <motion.div
        className={`flex flex-col gap-1.5 ${fullWidth ? "w-full" : ""}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        {...props}
      >
        {label && (
          <motion.label
            htmlFor={id}
            className={`font-medium text-text-subtle ${labelSizeStyle[size] ?? labelSizeStyle.md}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {label}
            {required && <span className="text-danger ml-1" aria-hidden="true">*</span>}
          </motion.label>
        )}

        <motion.div className="relative">
          <select
            ref={ref}
            id={id}
            disabled={disabled}
            required={required}
            aria-invalid={hasError ? "true" : "false"}
            aria-describedby={hasError ? errorId : helperText ? helperId : undefined}
            value={value}
            onChange={onChange}
            className={`
              w-full bg-transparent text-text appearance-none
              outline-none transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              pr-10
              ${variantStyle[variant] ?? variantStyle.glass} ${sizeStyle[size] ?? sizeStyle.md}
              ${hasError ? "border-danger/50 focus:border-danger focus:ring-danger/20" : ""}
            `}
            {...selectProps}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <motion.div
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </motion.div>

        {hasError && (
          <motion.p
            id={errorId}
            className="text-danger text-sm flex items-center gap-1"
            role="alert"
            initial={{ opacity: 0, y: -5, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -5, height: 0 }}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </motion.p>
        )}

        {!hasError && helperText && (
          <motion.p
            id={helperId}
            className="text-text-muted text-sm"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {helperText}
          </motion.p>
        )}
      </motion.div>
    );
  }
);

GlassSelect.displayName = "GlassSelect";