import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import "./auth.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    const result = await login(form.username, form.password);
    setLoading(false);
    if (result.success) {
      navigate("/"); // Redirects straight to your chat window!
    } else {
      setError(result.message || "Invalid credentials");
    }
  };

  return (
    <div className="auth-page">
      {/* Left panel - UPDATED FOR SIGMA AI THEME */}
      <div className="auth-left">
        <div className="auth-brand">
          <div className="brand-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
          <span className="brand-name">Sigma AI</span>
        </div>

        <div className="auth-left-content">
          <h1>Pick up where<br />you left off.</h1>
          <p>Log in to access your chat history, generate new images, and continue exploring ideas.</p>

          <div className="auth-stats">
            <div className="stat">
              <span className="stat-number">{"<"}1s</span>
              <span className="stat-label">Response time</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-number">256-bit</span>
              <span className="stat-label">Encryption</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Availability</span>
            </div>
          </div>
        </div>

        <div className="auth-left-footer">
          <div className="testimonial">
            <p>"Sigma AI completely transformed my workflow. It is incredibly fast and remembers all my project context perfectly."</p>
            <div className="testimonial-author">
              <div className="avatar">KM</div>
             
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - Form logic remains untouched */}
      <div className="auth-right">
        <div className="auth-form-wrap">
          <div className="auth-form-header">
            <h2>Welcome back</h2>
            <p>Sign in to your account</p>
          </div>

          {error && (
            <div className="auth-alert auth-alert-error">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 5v3M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="field-group">
              <label htmlFor="username">Username</label>
              <div className="input-wrap">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M3 15c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="your_username"
                  value={form.username}
                  onChange={handleChange}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrap">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="3" y="8" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M6 8V6a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M1 9s3-5 8-5 8 5 8 5-3 5-8 5-8-5-8-5z" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M2 2l14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M1 9s3-5 8-5 8 5 8 5-3 5-8 5-8-5-8-5z" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner" />
                  Connecting to AI…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account?{" "}
            <Link to="/signup">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;