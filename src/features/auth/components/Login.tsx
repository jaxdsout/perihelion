import { AuthPage } from "@/pages/auth/AuthPage";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../auth.css";
import { useAuthStore } from "../store";

export default function Login() {
  const { error, message } = useAuthStore();
  return (
    <AuthPage
      title="Sign In"
      subtitle="Welcome Back"
      error={error as string}
      message={message as string}
      form={<LoginForm />}
      links={<LoginLinks />}
    />
  );
}

function LoginForm() {
  const { login, loading } = useAuthStore();
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
  )
}

function LoginLinks() {
  return (
    <div className="authLinks">
      <Link to="/reset-password">Forgot password?</Link>
      <Link to="/signup">Don't have an account? Sign up</Link>
    </div>
  )
}
