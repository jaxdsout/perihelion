import Icon from "@/assets/icons/Icon";
import { Outlet } from "react-router-dom";
import { useNavigateDashboard } from "../client-actions";
import "../dashboard.css";

export default function DashboardLayout() {
  const navigate = useNavigateDashboard();
  return (
    <div className="dashboard">
      <div className="dashboardNav">
        <Icon onClick={() => navigate("home")} className="fa-sharp fa-solid fa-house-chimney" />
        <Icon onClick={() => navigate("clients")} className="fa-sharp fa-solid fa-people-group" />
        <Icon onClick={() => navigate("lists")} className="fa-solid fa-list" />
        <Icon onClick={() => navigate("deals")} className="fa-sharp fa-solid fa-handshake" />
        <Icon onClick={() => navigate("search")} className="fa-solid fa-map" />
        <Icon onClick={() => navigate("cards")} className="fa-solid fa-id-badge" />
        <Icon onClick={() => navigate("eSign")} className="fa-solid fa-file-signature" />
        <Icon onClick={() => navigate("calculator")} className="fa-solid fa-calculator" />
      </div>
      <div className="dashboardContent">
        <Outlet />
      </div>
    </div>
  );
}
