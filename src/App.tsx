import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Calculator from "./features/calculator/Calculator"
import Cards from "./features/cards/components/Cards"
import Clients from "./features/clients/components/Clients"
import DashboardHome from "./features/dashboard/components/DashboardHome"
import DashboardLayout from "./features/dashboard/components/DashboardLayout"
import Deals from "./features/deals/components/Deals"
import ESign from "./features/eSign/components/ESign"
import Lists from "./features/lists/components/Lists"

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={''} />
        <Route path="dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="clients" element={<Clients />} />
          <Route path="lists" element={<Lists />} />
          <Route path="deals" element={<Deals />} />
          <Route path="cards" element={<Cards />} />
          <Route path="signing" element={<ESign />} />
          <Route path="calculator" element={<Calculator />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
