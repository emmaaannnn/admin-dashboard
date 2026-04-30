import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAdminSession } from "../../app/providers/AdminSessionProvider";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isHydrated, login, authError } = useAdminSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextPath = location.state?.from?.pathname || "/products";

  if (!isHydrated) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to={nextPath} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await login({ email, password });

    if (!result.success) {
      setError(result.error || "Incorrect email or password.");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    navigate(nextPath, { replace: true });
  };

  return (
    <main className="login-shell">
      <div className="login-shell__glow login-shell__glow--top" aria-hidden="true" />
      <div className="login-shell__glow login-shell__glow--bottom" aria-hidden="true" />

      <section className="login-card">
        <section className="login-panel login-panel--form" aria-label="Admin login form">
          <div className="login-form__heading">
            <div className="login-brand__logo-frame">
              <img src="/0xACElogo.png" alt="0xAce" className="login-brand__logo" />
            </div>
            <h1>Admin login</h1>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <label>
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
                autoComplete="username"
                disabled={isSubmitting}
                required
              />
            </label>

            <label>
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                disabled={isSubmitting}
                required
              />
            </label>

            {error || authError ? <p className="form-error">{error || authError}</p> : null}

            <button
              type="submit"
              className="primary-button login-form__submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </section>
      </section>
    </main>
  );
}

export default LoginPage;