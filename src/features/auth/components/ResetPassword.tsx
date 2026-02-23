import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store";
import "../auth.css";

export default function ResetPassword() {
  const { resetPassword, loading, error, message, resetSuccess } = useAuthStore();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await resetPassword(email);
  };

  if (resetSuccess) {
    return (
      <div className="authPage">
        <div className="authCard">
          <h2>Email Sent</h2>
          <p className="authSubtitle">Check your inbox for a password reset link.</p>
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
        <h2>Reset Password</h2>
        <p className="authSubtitle">Enter your email and we'll send a reset link.</p>

        {message && <div className="authMessage success">{message}</div>}
        {error && <div className="authMessage error">{error}</div>}

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

        <div className="authLinks">
          <Link to="/login">Back to Sign In</Link>
        </div>
      </div>
    </div>
  );
}
