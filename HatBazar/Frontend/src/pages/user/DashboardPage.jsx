import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  LogOut, 
  Trash2, 
  ChevronDown,
  Phone,
  Mail,
} from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';

const Dashboard = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userInfoCard, setUserInfoCard] = useState(null);

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve the token
      if (!token) {
        throw new Error('No token found');
      }
  
      const response = await fetch('http://127.0.0.1:8000/dashboard/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token in the headers
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      return null;
    }
  };

  useEffect(() => {
    const getUserInfo = async () => {
      const userInfo = await fetchUserInfo();
      if (!userInfo) {
        window.location.href = '/login';
      } else {
        setUserInfoCard(userInfo);
      }
    };
  
    getUserInfo();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
        const response = await fetch("http://127.0.0.1:8000/deleteuser/", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            // credentials: "include", // Include cookies if authentication is based on them
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Failed to delete account");
        }

        alert("Account deleted successfully.");
        // Optionally, redirect to login or home page after deletion
        localStorage.removeItem('token');
        window.location.href = "/";
      } catch (error) {
          console.error("Error deleting account:", error);
          alert("Error: " + error.message);
      }
  }

  if (!userInfoCard) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />

      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <Leaf className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-green-800">User Dashboard</h1>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg border border-green-100">
            <div className="flex items-center gap-4 mb-6">
              <img
                src="do it form backend"
                alt="Profile"
                className="w-20 h-20 rounded-full border-2 border-green-600"
              />
              <div>
                <h2 className="text-2xl font-semibold text-green-800">{userInfoCard.fullname}</h2>
                <p className="text-gray-600">{userInfoCard.username}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p className="flex items-center gap-2 text-green-700">
                <Phone className="h-5 w-5" />
                Phone: <span className="font-medium">{userInfoCard.phone}</span>
              </p>
              <p className="flex items-center gap-2 text-green-700">
                <Mail className="h-5 w-5" />
                Email: <span className="font-medium">{userInfoCard.email}</span>
              </p>
            </div>
          </div>
          <div className="mt-8 flex space-x-4">
              <button
                onClick={handleLogout}
                className="w-full md:w-auto bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors"
              >
                <LogOut className="inline-block mr-2 h-5 w-5" />
                Logout
              </button>
              <button
                onClick={handleDeleteAccount}
                className="w-full md:w-auto bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors"
              >
                <Trash2 className="inline-block mr-2 h-5 w-5" />
                Delete Account
              </button>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;