import type { ReactNode } from "react";
import "./authpage.css";

interface AuthPageProps {
  title: string,
  subtitle: string | null,
  error: string,
  message: string,
  form: ReactNode,
  links: ReactNode,
}

export function AuthPage({ title, subtitle, error, message, form, links }: AuthPageProps) {

  return (
    <div className="authPage">
      <div className="authCard">
        <h2>{title}</h2>
        {subtitle && <p className="authSubtitle">{subtitle}</p>}

        {message && <div className="authMessage success">{message}</div>}
        {error && <div className="authMessage error">{error}</div>}

        {form}

        {links}
      </div>
    </div>
  )
}