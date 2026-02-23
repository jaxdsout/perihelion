import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../auth/store";

export function useNavigateDashboard() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  return (route: string) => {
    switch (route) {
      case "home":       navigate("/dashboard"); break;
      case "clients":    navigate("/dashboard/clients"); break;
      case "lists":      navigate("/dashboard/lists"); break;
      case "deals":      navigate("/dashboard/deals"); break;
      case "search":     navigate("/dashboard/search"); break;
      case "cards":      navigate("/dashboard/cards"); break;
      case "eSign":      navigate("/dashboard/signing"); break;
      case "calculator": navigate("/dashboard/calculator"); break;
      case "logout":     logout(); navigate("/login"); break;
    }
  };
}
