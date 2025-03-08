import React, { useEffect, useState, useRef } from "react";
import { CheckCircle } from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";

const PaymentSuccess = () => {
  const [paymentStatus, setPaymentStatus] = useState("processing");
  const cartTotalPrice = localStorage.getItem("cartTotalPrice");
  const authToken = localStorage.getItem("token");
  const cart = localStorage.getItem("cart");
  const cartItems = cart ? JSON.parse(cart) : [];
  const delivery_address = localStorage.getItem("deliveryAddress");
  const tran_id = localStorage.getItem("tran_id");

  // Prevent multiple API calls
  const hasRun = useRef(false);

  useEffect(() => {
    if (!tran_id || localStorage.getItem("paymentProcessed") || hasRun.current) {
      console.log("Payment already processed or tran_id missing.");
      return;
    }
    hasRun.current = true; // ✅ Ensures it only runs once

    const storePaymentInfo = async () => {
      try {
        // Store payment info
        const response = await fetch("http://127.0.0.1:8000/payment/storepaymentinfos/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            payment_amount: cartTotalPrice,
            tran_id: tran_id,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to store payment info");
        }
        
        setPaymentStatus("success");

        // Order data
        const orderData = {
          delivery_address: delivery_address,
          products: cartItems.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
          })),
        };

        // Place the order
        const orderResponse = await fetch("http://127.0.0.1:8000/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(orderData),
        });

        if (!orderResponse.ok) {
          throw new Error("Failed to place order");
        }

        const data = await orderResponse.json();
        console.log("Order Response:", data);

        // Mark as processed to prevent duplicate submission
        localStorage.setItem("paymentProcessed", "true");

        // Clear cart-related data
        localStorage.removeItem("cart");
        localStorage.removeItem("cartTotalPrice");
        localStorage.removeItem("tran_id");

      } catch (error) {
        console.error("Error:", error);
        setPaymentStatus("failed");
      }
    };

    storePaymentInfo();
  }, []); // ✅ Empty dependency array ensures it runs only on mount

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <Navbar />
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
        {paymentStatus === "processing" && (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600">Processing your order...</p>
          </div>
        )}

        {paymentStatus === "success" && (
          <div className="space-y-4">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
            <h1 className="text-2xl font-bold text-green-600">Order Successful!</h1>
            <p className="text-gray-600">Thank you for your purchase.</p>
            <button
              onClick={() => (window.location.href = "/marketplace")}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
            >
              Continue Shopping
            </button>
          </div>
        )}

        {paymentStatus === "failed" && (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-red-600">Order Failed</h1>
            <p className="text-gray-600">There was an issue processing your payment. Please try again.</p>
            <button
              onClick={() => (window.location.href = "/marketplace")}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
            >
              Go Back to Market
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;