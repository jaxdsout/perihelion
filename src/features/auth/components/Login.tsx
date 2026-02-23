import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";
import "../auth.css";

export default function Login() {
  const { login, loading, error, message } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(form);
    if (useAuthStore.getState().isAuthenticated) navigate("/dashboard");
  };

  return (
    <div className="authPage">
      <div className="authCard">
        <h2>Sign In</h2>
        <p className="authSubtitle">Welcome back.</p>

        {message && <div className="authMessage success">{message}</div>}
        {error && <div className="authMessage error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="authField">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>
          <div className="authField">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>
          <button className="authBtn" type="submit" disabled={loading}>
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>

        <div className="authLinks">
          <Link to="/reset-password">Forgot password?</Link>
          <Link to="/signup">Don't have an account? Sign up</Link>
        </div>
      </div>
    </div>
  );
}
