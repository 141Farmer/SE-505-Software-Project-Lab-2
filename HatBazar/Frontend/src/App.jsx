import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/home/LandingPage";
import { LoginPage } from "./pages/authentication/LoginPage";
import RegistrationPage from "./pages/authentication/RegistrationPage";
import Dashboard from "./pages/user/DashboardPage";
import MarketPlace from "./pages/marketplace/MarketplacePage";
import InvestmentPage from "./pages/investment/investmentPage";
import InvestmentCreatePage from "./pages/investment/InvestmentCreatePage";
import InvestmentBrowsePage from "./pages/investment/InvestmentBrowsePage";
import Forum from "./pages/community/Forum";
import ContractSection from "./components/ContractSection";
import { Toaster } from "react-hot-toast";
import Cart from "./pages/marketplace/cart";
// import Checkout from "./pages/marketplace/Checkout"
import DeliveryAddress from "./pages/marketplace/DeliveryAddress";
// import PaymentMethod from "./pages/marketplace/Payment";
// import OrderSummary from "./pages/marketplace/OrderSummary";
// import OrderConfirmation from "./pages/marketplace/OrderConfirmation";
import ConfirmOrder from "./pages/marketplace/ConfirmOrder";


const App = () => {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/marketplace" element={<MarketPlace />} />
        <Route path="/community" element={<Forum />} />
        <Route path="/invest" element={<InvestmentPage />} />
        <Route path="/investcreate" element={<InvestmentCreatePage />} />
        <Route path="/investbrowse" element={<InvestmentBrowsePage />} />
        <Route path="/contract" element={<ContractSection />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/delivery-address" element={<DeliveryAddress />} />
        <Route path="/confirm-order" element={<ConfirmOrder />} />
        {/* <Route path="/payment" element={<PaymentMethod />} /> */}
        {/* <Route path="/order-summary" element={<OrderSummary />} /> */}
        {/* <Route path="/order-confirmation" element={<OrderConfirmation />} /> */}
      </Routes>
    </Router>
    
  );
};

export default App;