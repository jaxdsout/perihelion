import { createRoot } from 'react-dom/client';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./globals/index.css";

import Activate from "./features/auth/components/Activate";
import ConfirmPassword from "./features/auth/components/ConfirmPassword";
import Login from "./features/auth/components/Login";
import ResetPassword from "./features/auth/components/ResetPassword";
import SignUp from "./features/auth/components/SignUp";
import Landing from "./features/landing/Landing";

import Calculator from "./features/calculator/Calculator";
import Cards from "./features/cards/Cards";
import ClientList from "./features/clientlist/ClientList";
import Clients from "./features/clients/Clients";
import DashboardHome from "./features/dashboard/components/Home";
import DashboardLayout from "./features/dashboard/components/Layout";
import Deals from "./features/deals/components/Deals";
import ESign from "./features/eSign/ESign";
import Lists from "./features/lists/Lists";
import Properties from "./features/properties/Properties";

createRoot(document.getElementById('root')!).render(
  <Router>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/reset-password/confirm/:uid/:token" element={<ConfirmPassword />} />
      <Route path="/verify/:uid/:token" element={<Activate />} />

      <Route path="/list/:uuid" element={<ClientList />} />

      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="clients" element={<Clients />} />
        <Route path="lists" element={<Lists />} />
        <Route path="deals" element={<Deals />} />
        <Route path="cards" element={<Cards />} />
        <Route path="search" element={<Properties />} />
        <Route path="signing" element={<ESign />} />
        <Route path="calculator" element={<Calculator />} />
      </Route>
    </Routes>
  </Router>
)
