import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import "./auth.css";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", username: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const validate = () => {
    if (!form.email || !form.username || !form.password || !form.confirm)
      return "All fields are required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "Enter a valid email address.";
    if (form.username.length < 3)
      return "Username must be at least 3 characters.";
    if (form.password.length < 6)
      return "Password must be at least 6 characters.";
    if (form.password !== form.confirm)
      return "Passwords do not match.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    const result = await signup(form.email, form.username, form.password);
    setLoading(false);

    if (result.success) {
      // ─── INSTANT LOGIN: Send them straight to the main page! ───
      navigate("/"); 
    } else {
      setError(result.message || "Signup failed");
    }
  };

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p) && /[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s; // 0-4
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthClass = ["", "weak", "fair", "good", "strong"][strength];

  return (
    <div className="auth-page">
      {/* Left panel - SIGMA AI THEME */}
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
          <h1>Unlock the power.<br />Shape the future.</h1>
          <p>Join Sigma AI to brainstorm, write code, generate images, and interact with advanced AI seamlessly.</p>

          <div className="auth-perks">
            {[
              { icon: "⚡", title: "Instant Answers", desc: "Get highly accurate responses in milliseconds." },
              { icon: "🎨", title: "Image Generation", desc: "Bring your imagination to life with AI vision." },
              { icon: "🔒", title: "Secure History", desc: "Your past conversations are private and encrypted." },
            ].map((p) => (
              <div className="perk" key={p.title}>
                <span className="perk-icon">{p.icon}</span>
                <div>
                  <strong>{p.title}</strong>
                  <span>{p.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="auth-left-footer">
          <p className="trust-line">Empowering developers and creators worldwide</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-right">
        <div className="auth-form-wrap">
          <div className="auth-form-header">
            <h2>Create your account</h2>
            <p>Start chatting in seconds</p>
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
              <label htmlFor="email">Email address</label>
              <div className="input-wrap">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M2 6l7 5 7-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@email.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
            </div>

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
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label="Toggle password visibility"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M1 9s3-5 8-5 8 5 8 5-3 5-8 5-8-5-8-5z" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>
              </div>
              {form.password && (
                <div className="password-strength">
                  <div className="strength-bars">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`bar ${i <= strength ? strengthClass : ""}`} />
                    ))}
                  </div>
                  <span className={`strength-label ${strengthClass}`}>{strengthLabel}</span>
                </div>
              )}
            </div>

            <div className="field-group">
              <label htmlFor="confirm">Confirm password</label>
              <div className="input-wrap">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4 9l4 4 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <input
                  id="confirm"
                  type="password"
                  name="confirm"
                  placeholder="Repeat your password"
                  value={form.confirm}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner" />
                  Setting up AI…
                </>
              ) : (
                "Create account"
              )}
            </button>

            <p className="auth-terms">
              By creating an account you agree to our{" "}
              <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
            </p>
          </form>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;