import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store";
import "../auth.css";
import { AuthPage } from "@/pages/auth/AuthPage";

export default function ResetPassword() {
  const { error, message, resetSuccess } = useAuthStore();

  if (resetSuccess) {
    return (
      <AuthPage
        title="Email Sent"
        subtitle="Check your inbox for a password reset link."
        error=""
        message=""
        form={null}
        links={<ResetPasswordLinks />}
      />
    );
  }

  return (
    <AuthPage
      title="Reset Password"
      subtitle="Enter your email and we'll send a reset link."
      error={error as string}
      message={message as string}
      form={<ResetPasswordForm />}
      links={<ResetPasswordLinks />}
    />
  );
}

function ResetPasswordForm() {
  const { resetPassword, loading } = useAuthStore();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await resetPassword(email);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="authField">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </div>
      <button className="authBtn" type="submit" disabled={loading}>
        {loading ? "SENDING..." : "SEND RESET LINK"}
      </button>
    </form>
  );
}

function ResetPasswordLinks() {
  return (
    <div className="authLinks">
      <Link to="/login">Back to Sign In</Link>
    </div>
  );
}
