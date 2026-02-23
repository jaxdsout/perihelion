import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store";
import "../auth.css";

export default function SignUp() {
  const { signup, loading, error, message, signupSuccess } = useAuthStore();
  const [form, setForm] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    re_password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signup(form);
  };

  if (signupSuccess) {
    return (
      <div className="authPage">
        <div className="authCard">
          <h2>Check Your Email</h2>
          <p className="authSubtitle">
            We sent an activation link to <strong>{form.email}</strong>. Click it to activate your account.
          </p>
          <div className="authLinks">
            <Link to="/login">Back to Sign In</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="authPage">
      <div className="authCard">
        <h2>Create Account</h2>
        <p className="authSubtitle">Get started with Perihelion.</p>

        {message && <div className="authMessage success">{message}</div>}
        {error && <div className="authMessage error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="authName">
            <div className="authField">
              <label htmlFor="first_name">First Name</label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                value={form.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="authField">
              <label htmlFor="last_name">Last Name</label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                value={form.last_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
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
              required
            />
          </div>
          <div className="authField">
            <label htmlFor="re_password">Confirm Password</label>
            <input
              id="re_password"
              name="re_password"
              type="password"
              value={form.re_password}
              onChange={handleChange}
              required
            />
          </div>
          <button className="authBtn" type="submit" disabled={loading}>
            {loading ? "CREATING..." : "CREATE ACCOUNT"}
          </button>
        </form>

        <div className="authLinks">
          <Link to="/login">Already have an account? Sign in</Link>
        </div>
      </div>
    </div>
  );
}
