import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

// Dummy payment function
const dummyPayment = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true); // Simulate a successful payment
    }, 1000); // Simulate a 1-second delay
  });
};


const handlePayment = async (offer) => {
  // setIsProcessing(true);
  const token = localStorage.getItem('token');
  const investmentPrinciple = offer.offer_investment_principle;
  const indicator = 'investment'; 
    if (!investmentPrinciple) {
      alert("Your cart is empty. Please add items to your cart.");
      return;
    }
  
    try {
  
      const redirectResponse = await fetch(`http://127.0.0.1:8000/payment/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          payment_amount: parseFloat(investmentPrinciple),
          indicator : indicator, 
        }),
      });
  
      if (!redirectResponse.ok) {
        throw new Error(`Redirect request failed: ${redirectResponse.statusText}`);
      }
  
      if (!redirectResponse.ok) {
        throw new Error(`Redirect request failed: ${redirectResponse.statusText}`);
      }

      const redirectData = await redirectResponse.json();
      
      if (redirectData.url && redirectData.tran_id) {  // UPDATED: Check for both URL & tran_id
        localStorage.setItem("tran_id", redirectData.tran_id);  // UPDATED: Store tran_id for later use
        window.location.href = redirectData.url;
      } else {
        throw new Error("No redirect URL received");
      }

    } catch (error) {
      console.error("Error during payment processing:", error);
      alert(`Payment processing error: ${error.message}`);
    }
};

// Function to delete the offer
const deleteOffer = async (offerId) => {
  try {
    const token = localStorage.getItem('token'); // Get the token for authorization
    const response = await fetch(`http://127.0.0.1:8000/deleteoffer/${offerId}/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      console.log('Offer deleted successfully');
      return true;
    } else {
      console.error('Failed to delete offer');
      return false;
    }
  } catch (error) {
    console.error('Error deleting offer:', error);
    return false;
  }
};

// Function to create a new investment
     const makeInvestment = async (investmentResponse, offerId) => {
          try {
                    const token = localStorage.getItem('token'); 
                        console.log(investmentResponse);
                    if(!token){
                        navigate('/login')
                    }
                    const response = await fetch(`http://127.0.0.1:8000/makeinvestment/${offerId}/`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`, // Include the token in the request
                      },
                      body: JSON.stringify(investmentResponse),
                    });
                    console.log(response);
            
        
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
        
            const data = await response.json();
            return data; // Assuming the backend returns a success status or relevant data
          } catch (error) {
            console.error('Error making investment:', error);
            return false;
          }
        };

// Main AcceptOffer component
const AcceptOffer = () => {
  const { offer_id } = useParams(); // Get the offer_id from the URL
  const { state } = useLocation(); // Access the offer data passed from InvestmentBrowsePage
  const { offer } = state; // Destructure the offer data
  const navigate = useNavigate(); // Hook for navigation
  console.log(offer_id);
  const handleAcceptOffer = async () => {
    // Step 1: Simulate payment
    // const paymentSuccess = await dummyPayment();
    // if (!paymentSuccess) {
    //   alert('Payment failed. Please try again.');
    //   return;
    // }

    // Step 2: Delete the offe

    // Step 3: Create a new investment
    const investmentResponse = {
      offer_id: offer_id,
      principle: offer.offer_investment_principle, // Use data from the offer
      rate: offer.offer_investment_rate, // Use data from the offer
      share_dividing_month: offer.offer_share_dividing_period_month, // Use data from the offer
      duration_month: offer.offer_investment_duration_month, // Use data from the offer
    };

    
    console.log(investmentResponse);
    const investmentSuccess = await makeInvestment(investmentResponse, offer_id);
    if (investmentSuccess) {
      alert('Investment created successfully!');
      const deleteSuccess = await deleteOffer(offer_id);
      handlePayment(offer);

    if (!deleteSuccess) {
      alert('Failed to delete the offer. Please try again.');
      return;
    }
      // navigate('/'); // Navigate to the home page or another appropriate page
    } else {
      alert('Failed to create investment. Please try again.');
    }

    
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Accept Offer</h1>
      <div className="bg-white rounded-md border border-gray-300 p-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Offer Details</h2>
        <div className="text-gray-800">
        <p><strong>Investment Principle:</strong> ${offer.offer_investment_principle}</p>
          <p><strong>Investment Rate:</strong> {offer.offer_investment_rate}%</p>
          <p><strong>Share Dividing Period:</strong> {offer.offer_share_dividing_period_month} months</p>
          <p><strong>Investment Duration:</strong> {offer.offer_investment_duration_month} months</p>
        </div>
      </div>
      <button
        onClick={handleAcceptOffer}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Accept Offer
      </button>
    </div>
  );
};

export default AcceptOffer;