import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store";
import "../auth.css";
import { AuthPage } from "@/pages/auth/AuthPage";

export default function SignUp() {
  const { error, message, signupSuccess } = useAuthStore();
  const [submittedEmail, setSubmittedEmail] = useState("");

  if (signupSuccess) {
    return (
      <AuthPage
        title="Check Your Email"
        subtitle={`We sent an activation link to ${submittedEmail}. Click it to activate your account.`}
        error=""
        message=""
        form={null}
        links={<SignUpSuccessLinks />}
      />
    );
  }

  return (
    <AuthPage
      title="Create Account"
      subtitle="Get started with Perihelion."
      error={error as string}
      message={message as string}
      form={<SignUpForm onSubmittedEmail={setSubmittedEmail} />}
      links={<SignUpLinks />}
    />
  );
}

function SignUpForm({ onSubmittedEmail }: { onSubmittedEmail: (email: string) => void }) {
  const { signup, loading } = useAuthStore();
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
    onSubmittedEmail(form.email);
    await signup(form);
  };

  return (
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
  );
}

function SignUpLinks() {
  return (
    <div className="authLinks">
      <Link to="/login">Already have an account? Sign in</Link>
    </div>
  );
}

function SignUpSuccessLinks() {
  return (
    <div className="authLinks">
      <Link to="/login">Back to Sign In</Link>
    </div>
  );
}
