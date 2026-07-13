import { motion, type HTMLMotionProps } from "motion/react";
import { forwardRef, type ReactNode } from "react";

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  variant?: "default" | "elevated" | "bordered" | "interactive";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const variantStyles = {
  default: "card",
  elevated: "card-elevated",
  bordered: "card border-border/30",
  interactive: "card card-hover cursor-pointer",
};

const paddingStyles = {
  none: "",
  sm: "p-3 sm:p-4",
  md: "p-4 sm:p-6",
  lg: "p-6 sm:p-8",
  xl: "p-8 sm:p-10",
};

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, variant = "default", padding = "md", className = "", style, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={`${variantStyles[variant]} ${paddingStyles[padding]} rounded-2xl ${className}`}
        style={style}
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export interface GlassCardHeaderProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}

export const GlassCardHeader = forwardRef<HTMLDivElement, GlassCardHeaderProps>(
  ({ children, className = "", title, subtitle, action, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={`flex items-start justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-border/30 ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      {...props}
    >
      <div>
        {title && (
          <motion.h3
            className="text-lg sm:text-xl font-semibold text-text tracking-tight"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {title}
          </motion.h3>
        )}
        {subtitle && (
          <motion.p
            className="mt-1 text-text-subtle text-sm sm:text-base"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
      {action && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {action}
        </motion.div>
      )}
      {children}
    </motion.div>
  )
);

GlassCardHeader.displayName = "GlassCardHeader";

export interface GlassCardContentProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  className?: string;
}

export const GlassCardContent = forwardRef<HTMLDivElement, GlassCardContentProps>(
  ({ children, className = "", ...props }, ref) => (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
      {...props}
    >
      {children}
    </motion.div>
  )
);

GlassCardContent.displayName = "GlassCardContent";

export interface GlassCardFooterProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  className?: string;
  divided?: boolean;
}

export const GlassCardFooter = forwardRef<HTMLDivElement, GlassCardFooterProps>(
  ({ children, className = "", divided = true, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={`flex flex-col sm:flex-row items-start sm:items-center justify-end gap-2 sm:gap-3 mt-4 sm:mt-6 pt-3 sm:pt-4 ${divided ? "border-t border-border/30" : ""} ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  )
);

GlassCardFooter.displayName = "GlassCardFooter";