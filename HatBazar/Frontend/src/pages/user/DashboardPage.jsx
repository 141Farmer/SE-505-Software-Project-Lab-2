import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  LogOut, 
  Trash2,
  ChevronDown,
  Phone,
  Mail,
  Edit,
  Save,
  X
} from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';

const Dashboard = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userInfoCard, setUserInfoCard] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
  
      const response = await fetch('http://127.0.0.1:8000/dashboard/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
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
        setEditedUser(userInfo);
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
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Failed to delete account");
        }

        alert("Account deleted successfully.");
        localStorage.removeItem('token');
        window.location.href = "/";
    } catch (error) {
        console.error("Error deleting account:", error);
        alert("Error: " + error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStartEditing = () => {
    setIsEditing(true);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setEditedUser(userInfoCard);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const validateEmail = (email) => {
    const emailRegex =  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/;
    return emailRegex.test(email);
  };

  const handleSaveChanges = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      if (!validateEmail(editedUser.email)) {
        throw new Error('Invalid email format');
      }

      // Create payload with proper field names for backend
      const payload = {
        username: editedUser.username,
        fullname: editedUser.fullname,
        email: editedUser.email,
        phoneNumber: editedUser.phone // Rename to match backend expectation
      };

      console.log('Update request payload:', payload);

      const response = await fetch('http://127.0.0.1:8000/updateuser/', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      // Try to get response text or JSON
      let responseData;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        responseData = { message: await response.text() };
      }

      console.log('Response status:', response.status);
      console.log('Response data:', responseData);

      if (!response.ok) {
        throw new Error(
          responseData.detail || 
          responseData.message || 
          `Server error (${response.status})`
        );
      }

      setUserInfoCard(editedUser);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage(`Update failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  

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

          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errorMessage}
            </div>
          )}

          <div className="bg-white p-6 rounded-lg shadow-lg border border-green-100">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <img
                  src="do it form backend"
                  alt="Profile"
                  className="w-20 h-20 rounded-full border-2 border-green-600"
                />
                <div>
                  {!isEditing ? (
                    <>
                      <h2 className="text-2xl font-semibold text-green-800">{userInfoCard.fullname}</h2>
                      <p className="text-gray-600">{userInfoCard.username}</p>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                          type="text"
                          name="fullname"
                          value={editedUser.fullname || ''}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 p-2 border"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                          type="text"
                          name="username"
                          value={editedUser.username || ''}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 p-2 border bg-gray-100"
                          readOnly
                        />
                        <span className="text-xs text-gray-500">Username cannot be changed</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {!isEditing ? (
                <button
                  onClick={handleStartEditing}
                  className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors flex items-center"
                >
                  <Edit className="inline-block mr-2 h-4 w-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveChanges}
                    disabled={isSubmitting}
                    className={`${isSubmitting ? 'bg-green-400' : 'bg-green-600'} text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors flex items-center`}
                  >
                    <Save className="inline-block mr-2 h-4 w-4" />
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancelEditing}
                    disabled={isSubmitting}
                    className="bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-600 transition-colors flex items-center"
                  >
                    <X className="inline-block mr-2 h-4 w-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!isEditing ? (
                <>
                  <p className="flex items-center gap-2 text-green-700">
                    <Phone className="h-5 w-5" />
                    Phone: <span className="font-medium">{userInfoCard.phone}</span>
                  </p>
                  <p className="flex items-center gap-2 text-green-700">
                    <Mail className="h-5 w-5" />
                    Email: <span className="font-medium">{userInfoCard.email}</span>
                  </p>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Phone className="h-4 w-4 inline mr-1" /> Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={editedUser.phone || ''}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 p-2 border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Mail className="h-4 w-4 inline mr-1" /> Email
                    </label>
                    <input
                      // type="email"
                      name="email"
                      value={editedUser.email || ''}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 p-2 border"
                    />
                  </div>
                </>
              )}
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