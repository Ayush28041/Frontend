import React, { useState } from 'react';
import { User, Lock, Mail, AlertCircle, EyeOff, Eye, UserPlus } from 'lucide-react';

export default function EnhancedSignupPage({ login = () => {} }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }
    
    // Simple validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Password strength validation
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    // Show loading state
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsLoading(false);
      login();
      // Navigate to home (this would use react-router in a real app)
      // window.location.href = '/home';
      
      // For demo purposes, just show success
      setError('');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-indigo-600 p-6">
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center">
              <UserPlus className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          <h2 className="mt-4 text-center text-2xl font-bold text-white">
            Create Your Account
          </h2>
          <p className="mt-2 text-center text-sm text-indigo-200">
            Join us today and get started
          </p>
        </div>
        
        <div className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="John"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Smith"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="john.smith@example.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showPassword ? 
                      <EyeOff className="h-5 w-5" /> : 
                      <Eye className="h-5 w-5" />
                    }
                  </button>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters long</p>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showConfirmPassword ? 
                      <EyeOff className="h-5 w-5" /> : 
                      <Eye className="h-5 w-5" />
                    }
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </div>
                ) : (
                  "Sign up"
                )}
              </button>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in
              </a>
            </p>
          </div>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign up with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="h-5 w-5 mr-2" fill="#4285F4" viewBox="0 0 64 64">
                  <path d="M32 1.952a30 30 0 0 1 26.047 45L39.65 32.65v-8.492h15.19c.979 2.667 1.502 5.512 1.502 8.473 0 7.4-2.558 13.637-6.959 18.066L32 32.65l-17.383 8.047A30 30 0 0 1 32 1.952z" fill="#4285F4"/>
                  <path d="M9.41 19.043A30 30 0 0 0 2 32.631c0 5.457 1.466 10.57 4.026 14.969L24.35 32.65H9.41v-13.607z" fill="#34A853"/>
                  <path d="M54.61 46.953A30 30 0 0 1 4.026 47.6L24.35 32.65v13.607h15.19c-3.163 5.161-8.786 8.613-15.19 8.613a18.25 18.25 0 0 1-17.384-12.597A30 30 0 0 0 32 62.631c16.595 0 30-13.405 30-30 0-2.962-.433-5.807-1.363-8.473L39.65 39.58V24.159L54.61 46.953z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="h-5 w-5 mr-2" fill="#1877F2" viewBox="0 0 64 64">
                  <path d="M60 32c0-15.464-12.536-28-28-28S4 16.536 4 32c0 13.975 10.262 25.55 23.654 27.653V39.309h-7.122V32h7.122v-6.177c0-7.03 4.188-10.915 10.593-10.915 3.068 0 6.278.548 6.278.548v6.903h-3.537c-3.483 0-4.57 2.16-4.57 4.377V32h7.77l-1.242 7.309h-6.528v20.344C49.738 57.55 60 45.975 60 32z"/>
                </svg>
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}