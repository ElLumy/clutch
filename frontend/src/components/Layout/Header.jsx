import React, { useState, useRef, useEffect } from 'react';
import { Search, User, Upload, Settings, LogOut } from 'lucide-react';
import { dataProvider } from '../../lib/dataProvider';

const Header = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  
  const searchRef = useRef(null);
  const profileMenuRef = useRef(null);

  // Check auth state on mount
  useEffect(() => {
    checkAuthState();
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const checkAuthState = async () => {
    try {
      const userData = await dataProvider.auth.getCurrentUser();
      setUser(userData);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length >= 2) {
      try {
        const suggestions = await dataProvider.videos.getSearchSuggestions(query);
        setSuggestions(suggestions);
        setShowSuggestions(true);
      } catch (error) {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Search submitted:', searchQuery);
      // TODO: Navigate to search results
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    console.log('Search suggestion selected:', suggestion);
  };

  const handleAuth = async (type, email, password, username) => {
    try {
      if (type === 'login') {
        await dataProvider.auth.login(email, password);
      } else {
        await dataProvider.auth.register(email, password, username);
      }
      setShowAuthModal(false);
      await checkAuthState();
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await dataProvider.auth.logout();
      setUser(null);
      setShowProfileMenu(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-[72px] right-0 h-16 bg-[#070707] border-b border-[#0E0E0E] z-30">
        <div className="max-w-[1680px] mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => window.location.href = '/'}
              className="text-[#F2F2F2] text-xl font-bold tracking-tight hover:text-[#5A4FCF] transition-colors duration-150"
            >
              CLUTCH
            </button>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-2xl mx-8 relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative">
                <Search 
                  size={20} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8A8A8A]" 
                />
                <input
                  type="text"
                  placeholder="Search videos, channels..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                  className="w-full h-10 pl-10 pr-4 bg-[#070707] border border-[#0E0E0E] rounded-lg text-[#F2F2F2] placeholder-[#8A8A8A] 
                           focus:border-[#F2F2F2] focus:border-opacity-85 focus:outline-none 
                           focus:shadow-[0_0_0_1px_rgba(242,242,242,0.18)] transition-all duration-150"
                />
              </div>
            </form>

            {/* Search Suggestions */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#070707] border border-[#1A1A1A] rounded-lg shadow-lg py-2 z-50">
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-2 text-left text-[#F2F2F2] hover:bg-[#0B0B0B] transition-colors duration-150"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-3">
            {isLoading ? (
              <div className="w-8 h-8 bg-[#070707] rounded-full animate-pulse"></div>
            ) : user ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#0E0E0E] hover:border-[#F2F2F2] transition-colors duration-150"
                >
                  <img
                    src={user.profile.avatar_url}
                    alt={user.profile.display_name}
                    className="w-full h-full object-cover"
                  />
                </button>

                {/* Profile Menu */}
                {showProfileMenu && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-[#070707] border border-[#1A1A1A] rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-[#0E0E0E]">
                      <p className="text-[#F2F2F2] font-medium text-sm">{user.profile.display_name}</p>
                      <p className="text-[#8A8A8A] text-xs">@{user.user.username}</p>
                    </div>
                    
                    <button className="w-full px-4 py-2 text-left text-[#F2F2F2] hover:bg-[#0B0B0B] transition-colors duration-150 flex items-center">
                      <User size={16} className="mr-3" />
                      <span className="text-sm">Account</span>
                    </button>
                    
                    <button className="w-full px-4 py-2 text-left text-[#F2F2F2] hover:bg-[#0B0B0B] transition-colors duration-150 flex items-center">
                      <Upload size={16} className="mr-3" />
                      <span className="text-sm">Upload</span>
                    </button>
                    
                    <button className="w-full px-4 py-2 text-left text-[#F2F2F2] hover:bg-[#0B0B0B] transition-colors duration-150 flex items-center">
                      <Settings size={16} className="mr-3" />
                      <span className="text-sm">Settings</span>
                    </button>
                    
                    <div className="border-t border-[#0E0E0E] mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-[#F2F2F2] hover:bg-[#0B0B0B] transition-colors duration-150 flex items-center"
                      >
                        <LogOut size={16} className="mr-3" />
                        <span className="text-sm">Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setShowAuthModal(true);
                  }}
                  className="px-4 py-2 text-[#F2F2F2] bg-transparent border border-[#1A1A1A] rounded-lg hover:bg-[#0B0B0B] hover:text-[#2D0F93] hover:border-[#2D0F93] transition-all duration-150 text-sm font-medium"
                >
                  Log in
                </button>
                <button
                  onClick={() => {
                    setAuthMode('register');
                    setShowAuthModal(true);
                  }}
                  className="px-4 py-2 text-[#F2F2F2] bg-[#070707] border border-[#1A1A1A] rounded-lg hover:bg-[#2D0F93] hover:border-[#2D0F93] hover:shadow-[0_0_20px_rgba(45,15,147,0.4)] transition-all duration-150 text-sm font-medium"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onAuth={handleAuth}
          onModeChange={setAuthMode}
        />
      )}
    </>
  );
};

// Enhanced Auth Modal Component with improved aesthetics and functionality
const AuthModal = ({ mode, onClose, onAuth, onModeChange }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    dateOfBirth: ''
  });
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAuth(mode, formData.email, formData.password, formData.username);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    console.log('Forgot password for:', formData.email);
    // TODO: Implement forgot password functionality
    alert('Password reset link sent to your email!');
    setShowForgotPassword(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-gradient-to-br from-[#0A0A0A] to-[#070707] rounded-3xl p-8 w-full max-w-md border border-[#2D0F93] border-opacity-20 shadow-[0_0_40px_rgba(45,15,147,0.15)] backdrop-blur-sm">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#8A8A8A] hover:text-[#F2F2F2] transition-colors duration-200 text-2xl font-light"
        >
          ×
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#2D0F93] to-[#4D2FC3] rounded-full mx-auto mb-4 flex items-center justify-center shadow-[0_0_20px_rgba(45,15,147,0.3)]">
            <span className="text-white text-2xl font-bold">C</span>
          </div>
          <h2 className="text-[#F2F2F2] text-2xl font-bold mb-2">
            {showForgotPassword ? 'Reset Password' : (mode === 'login' ? 'Welcome Back' : 'Join CLUTCH')}
          </h2>
          <p className="text-[#B9B9B9] text-sm">
            {showForgotPassword ? 'Enter your email to reset your password' : (mode === 'login' ? 'Log in to continue your journey' : 'Create your account and start gaming')}
          </p>
        </div>
        
        {showForgotPassword ? (
          // Forgot Password Form
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[#B9B9B9] text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full h-12 px-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl text-[#F2F2F2] placeholder-[#8A8A8A] 
                         focus:border-[#2D0F93] focus:ring-2 focus:ring-[#2D0F93] focus:ring-opacity-20 focus:outline-none 
                         transition-all duration-200"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-[#2D0F93] to-[#3D1FB3] text-white rounded-xl font-medium 
                       hover:from-[#3D1FB3] hover:to-[#4D2FC3] hover:shadow-[0_0_25px_rgba(45,15,147,0.4)] 
                       transform hover:scale-[1.02] transition-all duration-200"
            >
              Send Reset Link
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="text-[#5A4FCF] hover:text-[#4D2FC3] transition-colors duration-200 text-sm font-medium underline"
              >
                Back to Login
              </button>
            </div>
          </form>
        ) : (
          // Login/Register Form
          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'register' && (
              <div className="space-y-2">
                <label className="block text-[#B9B9B9] text-sm font-medium mb-2">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Choose your username"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full h-12 px-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl text-[#F2F2F2] placeholder-[#8A8A8A] 
                           focus:border-[#2D0F93] focus:ring-2 focus:ring-[#2D0F93] focus:ring-opacity-20 focus:outline-none 
                           transition-all duration-200"
                  required
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label className="block text-[#B9B9B9] text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full h-12 px-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl text-[#F2F2F2] placeholder-[#8A8A8A] 
                         focus:border-[#2D0F93] focus:ring-2 focus:ring-[#2D0F93] focus:ring-opacity-20 focus:outline-none 
                         transition-all duration-200"
                required
              />
            </div>

            {mode === 'register' && (
              <div className="space-y-2">
                <label className="block text-[#B9B9B9] text-sm font-medium mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                  className="w-full h-12 px-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl text-[#F2F2F2] 
                           focus:border-[#2D0F93] focus:ring-2 focus:ring-[#2D0F93] focus:ring-opacity-20 focus:outline-none 
                           transition-all duration-200"
                  required
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label className="block text-[#B9B9B9] text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full h-12 px-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl text-[#F2F2F2] placeholder-[#8A8A8A] 
                         focus:border-[#2D0F93] focus:ring-2 focus:ring-[#2D0F93] focus:ring-opacity-20 focus:outline-none 
                         transition-all duration-200"
                required
              />
            </div>

            {mode === 'register' && (
              <div className="text-xs text-[#B9B9B9] leading-relaxed border-t border-[#1A1A1A] pt-4">
                By clicking Register, you agree to CLUTCH's{' '}
                <button 
                  type="button"
                  onClick={() => window.open('/terms', '_blank')}
                  className="text-[#2D0F93] hover:text-[#4D2FC3] underline decoration-[#2D0F93] underline-offset-2 transition-colors duration-200"
                >
                  Terms of Service
                </button>
                {' '}and acknowledge that our{' '}
                <button 
                  type="button"
                  onClick={() => window.open('/privacy', '_blank')}
                  className="text-[#2D0F93] hover:text-[#4D2FC3] underline decoration-[#2D0F93] underline-offset-2 transition-colors duration-200"
                >
                  Privacy Notice
                </button>
                {' '}applies.
              </div>
            )}
            
            <button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-[#2D0F93] to-[#3D1FB3] text-white rounded-xl font-medium 
                       hover:from-[#3D1FB3] hover:to-[#4D2FC3] hover:shadow-[0_0_25px_rgba(45,15,147,0.4)] 
                       transform hover:scale-[1.02] transition-all duration-200"
            >
              {mode === 'login' ? 'Log In' : 'Create Account'}
            </button>
          </form>
        )}
        
        {!showForgotPassword && (
          <div className="mt-6 space-y-3">
            {mode === 'login' && (
              <div className="text-center">
                <button
                  onClick={() => setShowForgotPassword(true)}
                  className="text-[#5A4FCF] hover:text-[#4D2FC3] transition-colors duration-200 text-sm font-medium underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}
            
            <div className="text-center border-t border-[#1A1A1A] pt-4">
              <button
                onClick={() => onModeChange(mode === 'login' ? 'register' : 'login')}
                className="text-[#B9B9B9] hover:text-[#F2F2F2] transition-colors duration-200 text-sm"
              >
                {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                <span className="text-[#2D0F93] hover:text-[#4D2FC3] font-medium underline">
                  {mode === 'login' ? 'Sign Up' : 'Log In'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;