import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuthStore } from "../store";
import "../auth.css";
import { AuthPage } from "@/pages/auth/AuthPage";

export default function Activate() {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const { activate, loading, activateSuccess, activateFail, message, error } = useAuthStore();

  useEffect(() => {
    if (uid && token) activate(uid, token);
  }, [uid, token, activate]);

  const links = activateSuccess ? (
    <ActivateSuccessLinks />
  ) : activateFail ? (
    <ActivateFailLinks />
  ) : null;

  return (
    <AuthPage
      title="Account Activation"
      subtitle={loading ? "Activating your account..." : null}
      error={activateFail ? (error as string) : ""}
      message={activateSuccess ? (message as string) : ""}
      form={null}
      links={links}
    />
  );
}

function ActivateSuccessLinks() {
  return (
    <div className="authLinks">
      <Link to="/login">Go to Sign In</Link>
    </div>
  );
}

function ActivateFailLinks() {
  return (
    <div className="authLinks">
      <Link to="/signup">Create a new account</Link>
    </div>
  );
}
