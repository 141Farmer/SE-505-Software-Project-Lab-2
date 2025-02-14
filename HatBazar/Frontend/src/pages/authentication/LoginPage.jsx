import React, { useState } from 'react';
import { Mail, Lock, User, Phone, AlertCircle, Leaf, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Card = ({ children, className = '', onClose }) => (
  <div className={`bg-white rounded-lg shadow-lg p-6 relative ${className}`}>
    {onClose && (
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Close"
      >
        <X className="h-5 w-5 text-gray-500" />
      </button>
    )}
    {children}
  </div>
);
const Input = ({ icon: Icon, ...props }) => (
  <div className="relative">
    {Icon && <Icon className="absolute left-3 top-3 h-4 w-4 text-green-600" />}
    <input
      {...props}
      className={`w-full px-3 py-2 ${Icon ? 'pl-10' : ''} border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors bg-white/50 focus:bg-white`}
    />
  </div>
);

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "w-full px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
    outline: "border border-green-300 bg-white hover:bg-green-50 text-green-700 focus:ring-green-500"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Select = ({ options, value, onChange, placeholder }) => (
  <select
    value={value}
    onChange={onChange}
    className="w-full px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/50 focus:bg-white"
  >
    <option value="">{placeholder}</option>
    {options.map(option => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        // credentials: 'include',        this is used when we allow some selective urls to access
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.access_token) {
          localStorage.setItem('token', data.access_token);
        }

        // Navigate to home page
        navigate('/');
      } else {
        // Handle different types of errors
        if (data.detail) {
          setError(Array.isArray(data.detail) 
            ? data.detail[0]?.msg || 'Login failed'
            : data.detail);
        } else if (typeof data === 'string') {
          setError(data);
        } else {
          setError('Invalid username or password');
        }
      }
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        setError('Unable to connect to the server. Please check if the server is running.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-green-100 to-green-50 p-4">
      <div className="w-full max-w-md">
        <Card 
          className="backdrop-blur-sm bg-white/90"
          onClose={() => navigate('/')}
        >
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <Leaf className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-800">
              Welcome to Green Harvest
            </h2>
            <p className="text-sm text-gray-600 mt-1">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Username</label>
              <Input
                icon={User}
                type="text"
                placeholder="Enter your username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <Input
                icon={Lock}
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <Button type="submit">Login</Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
              </div>

              <Button type="button" variant="outline" className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              <p className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  className="text-green-600 hover:text-green-700 hover:underline font-medium"
                  onClick={() => navigate('/register')}
                >
                  Register here
                </button>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};


export {LoginPage, Card, Input, Button, Select};