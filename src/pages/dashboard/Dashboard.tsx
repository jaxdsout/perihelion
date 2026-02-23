import Icon from "@/assets/icons/Icon";
import { Outlet } from "react-router-dom";
import { useNavigateDashboard } from "../../features/dashboard/client-actions";
import "./dashboardpage.css";

export default function DashboardLayout() {
  const navigate = useNavigateDashboard();
  return (
    <div className="dashboard">
      <div className="dashboardNav">
        <Icon onClick={() => navigate("home")} className="fa-sharp fa-solid fa-house-chimney" label="Home" />
        <Icon onClick={() => navigate("clients")} className="fa-sharp fa-solid fa-people-group" label="Clients" />
        <Icon onClick={() => navigate("lists")} className="fa-solid fa-list" label="Lists" />
        <Icon onClick={() => navigate("deals")} className="fa-sharp fa-solid fa-handshake" label="Deals" />
        <Icon onClick={() => navigate("search")} className="fa-solid fa-map" label="Property Search" />
        <Icon onClick={() => navigate("cards")} className="fa-solid fa-id-badge" label="Guest Cards" />
        <Icon onClick={() => navigate("eSign")} className="fa-solid fa-file-signature" label="eSign" />
        <Icon onClick={() => navigate("calculator")} className="fa-solid fa-calculator" label="Calculator" />
        <Icon onClick={() => navigate("profile")} className="fa-solid fa-user-astronaut" label="Profile" />
        <Icon onClick={() => navigate("settings")} className="fa-solid fa-gear" label="Settings" />
        <Icon onClick={() => navigate("logout")} className="fa-solid fa-right-from-bracket" label="Logout" />
      </div>
      <div className="dashboardContent">
        <Outlet />
      </div>
    </div>
  );
}
