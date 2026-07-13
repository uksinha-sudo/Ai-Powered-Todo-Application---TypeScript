import { useEffect, useState, useCallback } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { BACKEND_URL_USER } from "../config";
import { GlassCard, GlassCardContent, GlassCardHeader } from "../components/ui/GlassCard";
import { GlassButton, GlassInput } from "../components/ui";
import { User, Mail, LogOut, ArrowLeft, Settings, Shield, Bell, CheckCircle, Key, Eye, EyeOff, Lock } from "lucide-react";

interface ProfileInfo {
  username: string;
  email: string;
  _id: string;
}

export const Profile = () => {
  const navigate = useNavigate();
  const [info, setInfo] = useState<ProfileInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications">("profile");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchUserInfo = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    try {
      const response = await axios.get(`${BACKEND_URL_USER}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInfo(response.data.user);
      setUsername(response.data.user.username);
      setEmail(response.data.user.email);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to load profile");
      } else {
        toast.error("An unexpected error occurred");
      }
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/signin");
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      localStorage.removeItem("token");
      toast.info("Logged out successfully");
      navigate("/signin");
    } catch {
      toast.error("Failed to sign out");
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleSaveProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const newErrors: Record<string, string> = {};
    if (!username.trim()) newErrors.username = "Username is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email format";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    try {
      await axios.put(
        `${BACKEND_URL_USER}/profile`,
        { username: username.trim(), email: email.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Profile updated successfully");
      fetchUserInfo();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to update profile");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const newErrors: Record<string, string> = {};
    if (!currentPassword) newErrors.currentPassword = "Current password is required";
    if (!newPassword) newErrors.newPassword = "New password is required";
    else {
      if (newPassword.length < 8) newErrors.newPassword = "Password must be at least 8 characters";
      if (!/[A-Z]/.test(newPassword)) newErrors.newPassword = "Must contain uppercase letter";
      if (!/[a-z]/.test(newPassword)) newErrors.newPassword = "Must contain lowercase letter";
      if (!/[0-9]/.test(newPassword)) newErrors.newPassword = "Must contain a number";
    }
    if (newPassword !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    try {
      await axios.put(
        `${BACKEND_URL_USER}/password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to change password");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchUserInfo();
    };
    loadData();
  }, [fetchUserInfo]);

  if (isLoading) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ background: "radial-gradient(ellipse at center, rgba(20,20,20,1) 0%, rgba(10,10,10,1) 100%)" }}
      >
        <motion.div
          className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    );
  }

  if (!info) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ background: "radial-gradient(ellipse at center, rgba(20,20,20,1) 0%, rgba(10,10,10,1) 100%)" }}
      >
        <p className="text-text-muted">Please sign in to view your profile</p>
      </motion.div>
    );
  }

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "security" as const, label: "Security", icon: Shield },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
  ];

  return (
    <motion.div
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ background: "radial-gradient(ellipse at center, rgba(20,20,20,1) 0%, rgba(10,10,10,1) 100%)" }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -right-1/4 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl"
          animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 -left-1/4 w-[300px] h-[300px] rounded-full bg-accent/3 blur-3xl"
          animate={{ scale: [1, 1.02, 1], opacity: [0.08, 0.12, 0.08] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <main className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-elevated/50 backdrop-blur-sm border border-border hover:bg-bg-elevated/80 hover:border-border-hover text-text-muted hover:text-text transition-all duration-200"
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline font-medium">Back to Dashboard</span>
            </motion.button>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="lg:col-span-1 space-y-6">
              <GlassCard variant="elevated" padding="xl">
                <div className="flex flex-col items-center text-center">
                  <motion.div
                    className="relative w-28 h-28 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-6 shadow-[0_8px_30px_-8px_rgba(212,168,67,0.3)]"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                  >
                    <User className="w-14 h-14 text-accent" />
                  </motion.div>

                  <motion.h1
                    className="text-2xl font-bold text-text mb-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {info.username}
                  </motion.h1>

                  <motion.p
                    className="text-text-muted"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {info.email}
                  </motion.p>

                  <motion.div
                    className="mt-6 flex items-center gap-2 px-4 py-2 rounded-full bg-bg-elevated/50 backdrop-blur-sm border border-border/30"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success/50 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                    </span>
                    <span className="text-sm font-medium text-text">Active</span>
                  </motion.div>
                </div>
              </GlassCard>

              <GlassCard variant="bordered" padding="lg">
                <h3 className="font-semibold text-text flex items-center gap-2 mb-4">
                  <Settings className="h-5 w-5 text-accent" />
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <GlassButton
                    variant="secondary"
                    fullWidth
                    leftIcon={<Settings className="h-4 w-4" />}
                    onClick={() => setActiveTab("security")}
                  >
                    Change Password
                  </GlassButton>
                  <GlassButton
                    variant="secondary"
                    fullWidth
                    leftIcon={<Bell className="h-4 w-4" />}
                    onClick={() => setActiveTab("notifications")}
                  >
                    Notification Settings
                  </GlassButton>
                  <GlassButton
                    variant="danger"
                    fullWidth
                    leftIcon={<LogOut className="h-4 w-4" />}
                    onClick={handleSignOut}
                    loading={isSigningOut}
                  >
                    Sign Out
                  </GlassButton>
                </div>
              </GlassCard>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <motion.div
                className="flex gap-2 border-b border-border/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex items-center gap-2 px-4 py-3 rounded-t-xl font-medium transition-all duration-200
                        ${isActive
                          ? "text-text bg-bg-card border-b-2 border-accent"
                          : "text-text-muted hover:text-text hover:bg-bg-elevated/50"
                        }
                      `}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </motion.div>

              {activeTab === "profile" && (
                <GlassCard variant="elevated" padding="lg">
                  <GlassCardHeader title="Profile Information" subtitle="Update your account details" />
                  <GlassCardContent>
                    <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }} className="space-y-6">
                      <GlassInput
                        label="Username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        error={errors.username}
                        leftIcon={<User className="h-5 w-5" />}
                        required
                      />
                      <GlassInput
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={errors.email}
                        leftIcon={<Mail className="h-5 w-5" />}
                        required
                      />
                      <GlassButton
                        type="submit"
                        variant="primary"
                        rightIcon={<CheckCircle className="h-4 w-4" />}
                        loading={isSaving}
                      >
                        Save Changes
                      </GlassButton>
                    </form>
                  </GlassCardContent>
                </GlassCard>
              )}

              {activeTab === "security" && (
                <GlassCard variant="elevated" padding="lg">
                  <GlassCardHeader title="Change Password" subtitle="Update your password to keep your account secure" />
                  <GlassCardContent>
                    <form onSubmit={(e) => { e.preventDefault(); handleChangePassword(); }} className="space-y-6">
                      <GlassInput
                        label="Current Password"
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        error={errors.currentPassword}
                        leftIcon={<Lock className="h-5 w-5" />}
                        rightIcon={
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="text-text-muted hover:text-text transition-colors"
                            aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                          >
                            {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        }
                        required
                      />
                      <GlassInput
                        label="New Password"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        error={errors.newPassword}
                        leftIcon={<Key className="h-5 w-5" />}
                        rightIcon={
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="text-text-muted hover:text-text transition-colors"
                            aria-label={showNewPassword ? "Hide password" : "Show password"}
                          >
                            {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        }
                        required
                      />
                      <GlassInput
                        label="Confirm New Password"
                        type={showNewPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={errors.confirmPassword}
                        leftIcon={<Key className="h-5 w-5" />}
                        required
                      />
                      <GlassButton
                        type="submit"
                        variant="primary"
                        rightIcon={<CheckCircle className="h-4 w-4" />}
                        loading={isSaving}
                      >
                        Update Password
                      </GlassButton>
                    </form>
                  </GlassCardContent>
                </GlassCard>
              )}

              {activeTab === "notifications" && (
                <GlassCard variant="elevated" padding="lg">
                  <GlassCardHeader title="Notification Preferences" subtitle="Manage how you receive notifications" />
                  <GlassCardContent>
                    <div className="space-y-4">
                      {[
                        { id: "email-tasks", label: "Task Reminders", description: "Get email reminders for upcoming tasks" },
                        { id: "email-comments", label: "Comments", description: "Notify me when someone comments on my tasks" },
                        { id: "email-weekly", label: "Weekly Digest", description: "Receive a weekly summary of your progress" },
                        { id: "push-tasks", label: "Push Notifications", description: "Receive browser notifications for tasks" },
                      ].map((item) => (
                        <motion.div
                          key={item.id}
                          className="flex items-center justify-between p-4 rounded-xl bg-bg-card border border-border/30"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <div className="flex-1">
                            <p className="font-medium text-text">{item.label}</p>
                            <p className="text-sm text-text-muted">{item.description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              defaultChecked={["email-tasks", "email-weekly"].includes(item.id)}
                            />
                            <div className="w-11 h-6 bg-border peer-focus:ring-4 peer-focus:ring-accent/30 peer-checked:bg-accent rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-bg after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text after:border after:border-border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent" />
                          </label>
                        </motion.div>
                      ))}
                    </div>
                  </GlassCardContent>
                </GlassCard>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </motion.div>
  );
};

export default Profile;