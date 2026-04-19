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
      setError("Use the mock admin credentials configured below.");
      return;
    }

    const nextPath = location.state?.from?.pathname || "/products";
    navigate(nextPath, { replace: true });
  };

  return (
    <main className="login-shell">
      <section className="login-panel login-panel--brand">
        <div className="login-brand__logo-frame">
          <img src="/0xACElogo.png" alt="0xAce" className="login-brand__logo" />
        </div>
        <p className="eyebrow">Atelier admin</p>
        <h1>Inventory control for the 0xAce studio.</h1>
        <p className="page-copy">
          This login stays separate from the shared admin shell so the route structure remains easy to reason about when real auth is introduced.
        </p>
      </section>

      <section className="login-panel login-panel--form">
        <div>
          <p className="section-kicker">Admin Login</p>
          <h2>Sign in</h2>
          <p className="page-copy">
            Use the mock credentials for now. Supabase auth can replace this later without touching the feature folders.
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Admin email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@0xace.store"
              autoComplete="username"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter admin password"
              autoComplete="current-password"
            />
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <div className="login-credentials">
            <span>Mock email: admin@0xace.store</span>
            <span>Mock password: atelier-admin</span>
          </div>

          <button type="submit" className="primary-button">
            Enter admin workspace
          </button>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;