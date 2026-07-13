import { motion, type HTMLMotionProps } from "motion/react";
import { forwardRef, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface GlassButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success" | "glass" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
}

const variantStyles: Record<string, string> = {
  primary: "bg-accent text-bg border-none shadow-[0_4px_14px_0_rgba(212,168,67,0.3)] hover:shadow-[0_8px_25px_0_rgba(212,168,67,0.4)] active:shadow-[0_2px_8px_0_rgba(212,168,67,0.3)]",
  secondary: "bg-bg-elevated border border-border text-text hover:bg-bg-card hover:border-border-hover",
  ghost: "bg-transparent text-text-muted hover:bg-bg-elevated hover:text-text",
  danger: "bg-danger/10 border border-danger/20 text-danger hover:bg-danger/20 hover:border-danger/30",
  success: "bg-success/10 border border-success/20 text-success hover:bg-success/20 hover:border-success/30",
  glass: "bg-bg-card/60 backdrop-blur-xl border border-border/30 text-text hover:bg-bg-card/80 hover:border-border/50",
  outline: "bg-transparent border border-border/30 text-text hover:bg-bg-elevated hover:border-border-hover",
};

const sizeStyles: Record<string, string> = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-5 py-2.5 text-base gap-2",
  lg: "px-7 py-3.5 text-lg gap-2.5",
  icon: "p-2.5",
};

const iconSizeStyles: Record<string, string> = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  icon: "w-5 h-5",
};

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = "",
      disabled,
      style,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    const showLeftIcon = leftIcon && !loading;
    const showRightIcon = rightIcon && !loading;

    return (
      <motion.button
        ref={ref}
        className={`
          inline-flex items-center justify-center font-medium rounded-xl border
          transition-all duration-200 ease-out
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg
          disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none
          ${variantStyles[variant] ?? variantStyles.primary}
          ${sizeStyles[size] ?? sizeStyles.md}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
        style={style}
        disabled={isDisabled}
        whileHover={!isDisabled ? { scale: 1.02 } : undefined}
        whileTap={!isDisabled ? { scale: 0.98 } : undefined}
        {...props}
      >
        {loading && (
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.15 }}
          >
            <motion.div
              className={`${iconSizeStyles[size] ?? iconSizeStyles.md} text-current`}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-full h-full" />
            </motion.div>
          </motion.div>
        )}

        {!loading && showLeftIcon && (
          <motion.span
            className={`flex-shrink-0 ${iconSizeStyles[size] ?? iconSizeStyles.md}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {leftIcon}
          </motion.span>
        )}

        {!loading && (
          <motion.span
            className="relative"
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {children}
          </motion.span>
        )}

        {!loading && showRightIcon && (
          <motion.span
            className={`flex-shrink-0 ${iconSizeStyles[size] ?? iconSizeStyles.md}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {rightIcon}
          </motion.span>
        )}
      </motion.button>
    );
  }
);

GlassButton.displayName = "GlassButton";

export interface GlassIconButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode;
  variant?: "ghost" | "primary" | "danger" | "glass";
  size?: "sm" | "md" | "lg";
  className?: string;
  "aria-label": string;
}

const iconButtonVariantStyles: Record<string, string> = {
  ghost: "bg-transparent text-text-muted hover:bg-bg-elevated hover:text-text",
  primary: "bg-accent text-bg hover:bg-accent-hover",
  danger: "bg-danger/10 text-danger hover:bg-danger/20",
  glass: "bg-bg-card/60 backdrop-blur-xl border border-border/30 text-text hover:bg-bg-card/80 hover:border-border/50",
};

const iconButtonSizeStyles: Record<string, string> = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
};

export const GlassIconButton = forwardRef<HTMLButtonElement, GlassIconButtonProps>(
  ({ children, variant = "ghost", size = "md", className = "", "aria-label": ariaLabel, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={`
          inline-flex items-center justify-center rounded-xl border border-transparent
          transition-all duration-200
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg
          ${iconButtonVariantStyles[variant] ?? iconButtonVariantStyles.ghost}
          ${iconButtonSizeStyles[size] ?? iconButtonSizeStyles.md}
          ${className}
        `}
        aria-label={ariaLabel}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

GlassIconButton.displayName = "GlassIconButton";