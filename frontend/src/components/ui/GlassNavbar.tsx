import { motion } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import { GlassButton, GlassIconButton } from "./GlassButton";
import { Menu, X, Sun, User, LogOut, LayoutDashboard, Settings } from "lucide-react";
import { useNavbar, NavbarProvider } from "./NavbarContext";
import { useState, useEffect, type ReactNode } from "react";

interface GlassNavbarProps {
  className?: string;
  children?: ReactNode;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  } | null;
  onSignOut?: () => void;
}

export const GlassNavbar = ({ className = "", user, onSignOut }: GlassNavbarProps) => {
  const location = useLocation();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useNavbar();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/profile", label: "Profile", icon: Settings },
  ];

  return (
    <motion.header
      className={`
        fixed top-0 left-0 right-0 z-40 transition-all duration-300
        ${isScrolled ? "bg-bg/80 backdrop-blur-2xl border-b border-border/30 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.3)]" : "bg-transparent"}
        ${className}
      `}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <motion.div
          className="flex h-16 items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.div className="flex items-center gap-8">
            <Link
              to="/dashboard"
              className="flex items-center gap-2"
              aria-label="AI Todo Home"
            >
              <motion.div
                className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 border border-accent/20"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="h-6 w-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </motion.div>
              <motion.span
                className="font-bold text-xl text-text hidden sm:block"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                AI<span className="text-accent">Todo</span>
              </motion.span>
            </Link>

            <motion.div className="hidden md:flex md:items-center md:gap-1" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              {navLinks.map((link, index) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Link
                      to={link.path}
                      onClick={closeMobileMenu}
                      className={`
                        relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200
                        ${isActive
                          ? "text-text bg-bg-elevated border border-border/30"
                          : "text-text-muted hover:text-text hover:bg-bg-elevated"
                        }
                      `}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      <span>{link.label}</span>
                      {isActive && (
                        <motion.span
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-6 bg-accent rounded-full"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 0.2 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          <motion.div className="flex items-center gap-3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <GlassIconButton
              variant="ghost"
              size="md"
              aria-label="Toggle theme"
              className="hidden sm:flex"
            >
              <Sun className="h-5 w-5 text-accent" />
            </GlassIconButton>

            {user ? (
              <motion.div className="flex items-center gap-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <Link
                  to="/profile"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-text-muted hover:text-text hover:bg-bg-elevated transition-colors"
                >
                  <User className="h-5 w-5" aria-hidden="true" />
                  <span className="hidden sm:block font-medium">{user.name}</span>
                </Link>
                <GlassButton
                  variant="ghost"
                  size="sm"
                  leftIcon={<LogOut className="h-4 w-4" />}
                  onClick={onSignOut}
                  className="hidden sm:flex"
                >
                  Sign Out
                </GlassButton>
              </motion.div>
            ) : (
              <motion.div className="flex items-center gap-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <Link to="/signin" onClick={closeMobileMenu}>
                  <GlassButton variant="ghost" size="sm">Sign In</GlassButton>
                </Link>
                <Link to="/signup" onClick={closeMobileMenu}>
                  <GlassButton variant="primary" size="sm">Get Started</GlassButton>
                </Link>
              </motion.div>
            )}

            <GlassIconButton
              variant="ghost"
              size="md"
              aria-label="Toggle menu"
              onClick={toggleMobileMenu}
              className="md:hidden"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </GlassIconButton>
          </motion.div>
        </motion.div>

        <motion.div
          className="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
          animate={{ height: isMobileMenuOpen ? "auto" : 0, opacity: isMobileMenuOpen ? 1 : 0, paddingBottom: isMobileMenuOpen ? "1rem" : 0 }}
          style={{ overflow: "hidden" }}
        >
          <div className="flex flex-col gap-2 pt-2 pb-4 border-t border-border/30">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeMobileMenu}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                    ${isActive
                      ? "text-text bg-bg-elevated border border-border/30"
                      : "text-text-muted hover:text-text hover:bg-bg-elevated"
                    }
                  `}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <div className="flex items-center gap-3 px-4 pt-4 border-t border-border/30">
              {user ? (
                <GlassButton variant="secondary" fullWidth leftIcon={<LogOut className="h-4 w-4" />} onClick={onSignOut}>
                  Sign Out
                </GlassButton>
              ) : (
                <div className="flex flex-col gap-2 w-full">
                  <Link to="/signin" onClick={closeMobileMenu}>
                    <GlassButton variant="ghost" fullWidth>Sign In</GlassButton>
                  </Link>
                  <Link to="/signup" onClick={closeMobileMenu}>
                    <GlassButton variant="primary" fullWidth>Get Started</GlassButton>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </nav>
    </motion.header>
  );
};

export const NavbarWrapper = ({ children, user, onSignOut }: GlassNavbarProps) => {
  return (
    <NavbarProvider>
      <GlassNavbar user={user} onSignOut={onSignOut} />
      <div className="pt-16 min-h-screen">{children}</div>
    </NavbarProvider>
  );
};