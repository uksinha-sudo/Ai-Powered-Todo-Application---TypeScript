import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { BACKEND_URL_USER } from "../config";
import { GlassCard, GlassCardContent, GlassCardHeader } from "../components/ui/GlassCard";
import { GlassButton, GlassInput } from "../components/ui";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateEmail = (value: string) => {
    if (!value) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address";
    return undefined;
  };

  const validatePassword = (value: string) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return undefined;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL_USER}/signin`, { email, password });
      toast.success(response.data.message || "Welcome back!");
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Sign in failed");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ background: "radial-gradient(ellipse at center, rgba(20,20,20,1) 0%, rgba(10,10,10,1) 100%)" }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/2 -right-1/2 w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl"
          animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-1/2 -left-1/2 w-[400px] h-[400px] rounded-full bg-accent/3 blur-3xl"
          animate={{ scale: [1, 1.02, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.2 }}
      >
        <GlassCard variant="elevated">
          <GlassCardHeader title="Welcome Back" subtitle="Sign in to your account" />
          <GlassCardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <GlassInput
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                leftIcon={<Mail className="h-5 w-5" />}
                autoComplete="email"
                required
              />

              <GlassInput
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                leftIcon={<Lock className="h-5 w-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-text-muted hover:text-text transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                }
                autoComplete="current-password"
                required
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border bg-bg-elevated text-accent focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-bg"
                  />
                  <span className="text-sm text-text-muted">Remember me</span>
                </label>
              </div>

              <GlassButton
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                loading={isLoading}
                rightIcon={<ArrowRight className="h-5 w-5" />}
              >
                Sign In
              </GlassButton>
            </form>

            <motion.div
              className="relative my-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/30" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-bg-card/50 backdrop-blur-sm text-text-muted">Or continue with</span>
              </div>
            </motion.div>

            <motion.p
              className="mt-6 text-center text-text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="text-accent hover:text-accent-hover font-medium transition-colors">
                Create one
              </Link>
            </motion.p>
          </GlassCardContent>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

export default SignIn;