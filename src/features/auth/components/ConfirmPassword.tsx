import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../store";
import "../auth.css";
import { AuthPage } from "@/pages/auth/AuthPage";

export default function ConfirmPassword() {
  const { error, message } = useAuthStore();

  return (
    <AuthPage
      title="New Password"
      subtitle="Choose a new password for your account."
      error={error as string}
      message={message as string}
      form={<ConfirmPasswordForm />}
      links={<ConfirmPasswordLinks />}
    />
  );
}

function ConfirmPasswordForm() {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const { confirmPassword, loading } = useAuthStore();
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
  );
}

function ConfirmPasswordLinks() {
  return (
    <div className="authLinks">
      <Link to="/login">Back to Sign In</Link>
    </div>
  );
}
