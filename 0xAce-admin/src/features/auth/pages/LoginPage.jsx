import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAdminSession } from "../../../app/providers/AdminSessionProvider";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAdminSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/products" replace />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const success = login({ email, password });

    if (!success) {
      setError("Incorrect email or password.");
      return;
    }

    const nextPath = location.state?.from?.pathname || "/products";
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
              />
            </label>

            {error ? <p className="form-error">{error}</p> : null}

            <button type="submit" className="primary-button login-form__submit">
              Sign in
            </button>
          </form>
        </section>
      </section>
    </main>
  );
}

export default LoginPage;