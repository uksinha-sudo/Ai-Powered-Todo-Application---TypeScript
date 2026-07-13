import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { BACKEND_URL_USER } from "../config";
import { GlassCard, GlassCardContent, GlassCardHeader } from "../components/ui/GlassCard";
import { GlassButton, GlassInput } from "../components/ui";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";

export const SignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string; confirmPassword?: string }>({});

  const validateUsername = (value: string) => {
    if (!value) return "Username is required";
    if (value.length < 3) return "Username must be at least 3 characters";
    if (!/^[a-zA-Z0-9_]+$/.test(value)) return "Username can only contain letters, numbers, and underscores";
    return undefined;
  };

  const validateEmail = (value: string) => {
    if (!value) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address";
    return undefined;
  };

  const validatePassword = (value: string) => {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(value)) return "Password must contain at least one number";
    return undefined;
  };

  const validateConfirmPassword = (value: string) => {
    if (!value) return "Please confirm your password";
    if (value !== password) return "Passwords do not match";
    return undefined;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const usernameError = validateUsername(username);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmError = validateConfirmPassword(confirmPassword);

    if (usernameError || emailError || passwordError || confirmError) {
      setErrors({ username: usernameError, email: emailError, password: passwordError, confirmPassword: confirmError });
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL_USER}/signup`, { username, email, password });
      toast.success(response.data.message || "Account created successfully!");
      navigate("/signin");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Sign up failed");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = password.length === 0 ? 0 : [validatePassword(password) === undefined, password.length >= 12, /[!@#$%^&*]/.test(password)].filter(Boolean).length;

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
          <GlassCardHeader title="Create Account" subtitle="Start managing your tasks today" />
          <GlassCardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <GlassInput
                label="Username"
                type="text"
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={errors.username}
                leftIcon={<User className="h-5 w-5" />}
                autoComplete="username"
                required
              />

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
                autoComplete="new-password"
                required
              />

              {password && (
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  <div className="h-1.5 bg-border rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${(passwordStrength / 4) * 100}%`,
                        background: passwordStrength <= 1
                          ? "linear-gradient(to right, #ef4444, #f87171)"
                          : passwordStrength <= 2
                          ? "linear-gradient(to right, #f59e0b, #fbbf24)"
                          : passwordStrength <= 3
                          ? "linear-gradient(to right, #22c55e, #4ade80)"
                          : "linear-gradient(to right, #3b82f6, #60a5fa)",
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(passwordStrength / 4) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-text-muted">
                    <span className={passwordStrength >= 1 ? "text-success" : ""}>
                      {passwordStrength >= 1 ? "✓" : "○"} 8+ characters
                    </span>
                    <span className={passwordStrength >= 2 ? "text-success" : ""}>
                      {passwordStrength >= 2 ? "✓" : "○"} Uppercase + lowercase
                    </span>
                    <span className={passwordStrength >= 3 ? "text-success" : ""}>
                      {passwordStrength >= 3 ? "✓" : "○"} Number
                    </span>
                    <span className={passwordStrength >= 4 ? "text-success" : ""}>
                      {passwordStrength >= 4 ? "✓" : "○"} Special character
                    </span>
                  </div>
                </motion.div>
              )}

              <GlassInput
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
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
                autoComplete="new-password"
                required
              />

              <GlassButton
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                loading={isLoading}
                rightIcon={<ArrowRight className="h-5 w-5" />}
              >
                Create Account
              </GlassButton>
            </form>

            <motion.p
              className="mt-6 text-center text-text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Already have an account?{" "}
              <Link to="/signin" className="text-accent hover:text-accent-hover font-medium transition-colors">
                Sign in
              </Link>
            </motion.p>
          </GlassCardContent>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

export default SignUp;