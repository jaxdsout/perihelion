import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuthStore } from "../store";
import "../auth.css";

export default function Activate() {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const { activate, loading, activateSuccess, activateFail, message, error } = useAuthStore();

  useEffect(() => {
    if (uid && token) activate(uid, token);
  }, [uid, token, activate]);

  return (
    <div className="authPage">
      <div className="authCard">
        <h2>Account Activation</h2>

        {loading && <p className="authSubtitle">Activating your account...</p>}

        {activateSuccess && (
          <>
            {message && <div className="authMessage success">{message}</div>}
            <div className="authLinks">
              <Link to="/login">Go to Sign In</Link>
            </div>
          </>
        )}

        {activateFail && (
          <>
            {error && <div className="authMessage error">{error}</div>}
            <div className="authLinks">
              <Link to="/signup">Create a new account</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
