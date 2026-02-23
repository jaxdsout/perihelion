import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../store";
import "../auth.css";

export default function ConfirmPassword() {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const { confirmPassword, loading, error, message } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ new_password: "", re_new_password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid || !token) return;
    await confirmPassword(uid, token, form.new_password, form.re_new_password);
    if (!useAuthStore.getState().error) {
      setTimeout(() => navigate("/login"), 1500);
    }
  };

  return (
    <div className="authPage">
      <div className="authCard">
        <h2>New Password</h2>
        <p className="authSubtitle">Choose a new password for your account.</p>

        {message && <div className="authMessage success">{message}</div>}
        {error && <div className="authMessage error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="authField">
            <label htmlFor="new_password">New Password</label>
            <input
              id="new_password"
              name="new_password"
              type="password"
              value={form.new_password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="authField">
            <label htmlFor="re_new_password">Confirm New Password</label>
            <input
              id="re_new_password"
              name="re_new_password"
              type="password"
              value={form.re_new_password}
              onChange={handleChange}
              required
            />
          </div>
          <button className="authBtn" type="submit" disabled={loading}>
            {loading ? "UPDATING..." : "UPDATE PASSWORD"}
          </button>
        </form>

        <div className="authLinks">
          <Link to="/login">Back to Sign In</Link>
        </div>
      </div>
    </div>
  );
}
