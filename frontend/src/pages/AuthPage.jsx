import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Volume2, LogIn, UserPlus, CheckCircle2, AlertCircle } from "lucide-react";
import { api } from "../services/api";

export function AuthPage() {
  const [activeTab, setActiveTab] = useState("login"); // 'login' | 'register'
  const [emailOrUser, setEmailOrUser] = useState("");
  const [password, setPassword] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const res = await api.login({
        email_or_username: emailOrUser,
        password: password,
      });
      setCurrentUser(res.user);
      setSuccessMsg(`Welcome back, ${res.user.username}!`);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError(err.message || "Login failed. Check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const res = await api.register({
        username: regUsername,
        email: regEmail,
        password: regPassword,
      });
      setSuccessMsg("Account created successfully! You can now log in.");
      setActiveTab("login");
      setEmailOrUser(regEmail);
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // 1-Click Demo Login for College Evaluator convenience
  const handleDemoLogin = async () => {
    setEmailOrUser("student@kongu.edu");
    setPassword("securepassword123");
    setError(null);
    setIsLoading(true);

    try {
      // First try to register demo user if not existing, then login
      await api.register({
        username: "kec_student",
        email: "student@kongu.edu",
        password: "securepassword123",
      }).catch(() => {});

      const res = await api.login({
        email_or_username: "student@kongu.edu",
        password: "securepassword123",
      });
      setCurrentUser(res.user);
      setSuccessMsg(`Logged in as demo user: ${res.user.username}`);
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "75vh" }}>
      <div className="card" style={{ width: "100%", maxWidth: "440px", padding: "32px 28px" }}>
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "14px",
            backgroundColor: "var(--color-primary)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            marginBottom: "12px",
            boxShadow: "0 4px 12px rgba(22, 163, 74, 0.3)"
          }}>
            <Volume2 size={26} />
          </div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800 }}>QuietSpot Account</h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px" }}>
            Kongu Engineering College Study Portal
          </p>
        </div>

        {/* Tab Toggle */}
        <div style={{
          display: "flex",
          backgroundColor: "var(--bg-page)",
          borderRadius: "var(--radius-full)",
          padding: "4px",
          marginBottom: "20px"
        }}>
          <button
            type="button"
            className="btn"
            style={{
              flex: 1,
              borderRadius: "var(--radius-full)",
              fontSize: "0.88rem",
              backgroundColor: activeTab === "login" ? "#ffffff" : "transparent",
              color: activeTab === "login" ? "var(--color-primary)" : "var(--text-secondary)",
              boxShadow: activeTab === "login" ? "var(--shadow-sm)" : "none",
            }}
            onClick={() => { setActiveTab("login"); setError(null); }}
          >
            Sign In
          </button>
          <button
            type="button"
            className="btn"
            style={{
              flex: 1,
              borderRadius: "var(--radius-full)",
              fontSize: "0.88rem",
              backgroundColor: activeTab === "register" ? "#ffffff" : "transparent",
              color: activeTab === "register" ? "var(--color-primary)" : "var(--text-secondary)",
              boxShadow: activeTab === "register" ? "var(--shadow-sm)" : "none",
            }}
            onClick={() => { setActiveTab("register"); setError(null); }}
          >
            Create Account
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div style={{ padding: "12px", backgroundColor: "#fef2f2", color: "#b91c1c", borderRadius: "var(--radius-md)", fontSize: "0.85rem", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div style={{ padding: "12px", backgroundColor: "var(--color-primary-light)", color: "var(--color-primary-dark)", borderRadius: "var(--radius-md)", fontSize: "0.85rem", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <CheckCircle2 size={16} color="var(--color-primary)" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Login Form */}
        {activeTab === "login" ? (
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                Email or Username:
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="student@kongu.edu"
                value={emailOrUser}
                onChange={(e) => setEmailOrUser(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                Password:
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={isLoading} style={{ marginTop: "8px" }}>
              <LogIn size={18} />
              <span>{isLoading ? "Signing in..." : "Sign In"}</span>
            </button>

            {/* Evaluator 1-Click Demo Button */}
            <div style={{ textAlign: "center", marginTop: "12px" }}>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="btn btn-secondary btn-sm"
                style={{ width: "100%", fontSize: "0.82rem" }}
              >
                1-Click Demo Student Sign-In
              </button>
            </div>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                Student Username:
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. arun_kumar"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                College Email:
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="rollno@kongu.edu"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                Password:
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="Minimum 6 characters"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={isLoading} style={{ marginTop: "8px" }}>
              <UserPlus size={18} />
              <span>{isLoading ? "Registering..." : "Create Student Account"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
