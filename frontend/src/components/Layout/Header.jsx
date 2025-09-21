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
            <h1 className="text-[#F2F2F2] text-xl font-bold tracking-tight">CLUTCH</h1>
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
                  className="px-4 py-2 text-[#F2F2F2] bg-transparent border border-[#1A1A1A] rounded-lg hover:bg-[#0B0B0B] hover:text-[#A970FF] hover:border-[#A970FF] transition-all duration-150 text-sm font-medium"
                >
                  Log in
                </button>
                <button
                  onClick={() => {
                    setAuthMode('register');
                    setShowAuthModal(true);
                  }}
                  className="px-4 py-2 text-[#F2F2F2] bg-[#070707] border border-[#1A1A1A] rounded-lg hover:bg-[#A970FF] hover:border-[#A970FF] hover:shadow-[0_0_12px_rgba(169,112,255,0.3)] transition-all duration-150 text-sm font-medium"
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

// Simple Auth Modal Component
const AuthModal = ({ mode, onClose, onAuth, onModeChange }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAuth(mode, formData.email, formData.password, formData.username);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[#070707] rounded-2xl p-6 w-full max-w-md border border-[#1A1A1A]">
        <h2 className="text-[#F2F2F2] text-xl font-bold mb-6">
          {mode === 'login' ? 'Log in to CLUTCH' : 'Join CLUTCH'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full h-10 px-3 bg-[#0A0A0A] border border-[#0E0E0E] rounded-lg text-[#F2F2F2] placeholder-[#8A8A8A] focus:border-[#F2F2F2] focus:outline-none transition-colors duration-150"
              required
            />
          )}
          
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full h-10 px-3 bg-[#0A0A0A] border border-[#0E0E0E] rounded-lg text-[#F2F2F2] placeholder-[#8A8A8A] focus:border-[#F2F2F2] focus:outline-none transition-colors duration-150"
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full h-10 px-3 bg-[#0A0A0A] border border-[#0E0E0E] rounded-lg text-[#F2F2F2] placeholder-[#8A8A8A] focus:border-[#F2F2F2] focus:outline-none transition-colors duration-150"
            required
          />
          
          <button
            type="submit"
            className="w-full h-10 bg-[#070707] text-[#F2F2F2] border border-[#1A1A1A] rounded-lg hover:bg-[#0B0B0B] hover:shadow-[0_0_12px_rgba(242,242,242,0.06)] transition-all duration-150 font-medium"
          >
            {mode === 'login' ? 'Log in' : 'Register'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <button
            onClick={() => onModeChange(mode === 'login' ? 'register' : 'login')}
            className="text-[#8A8A8A] hover:text-[#F2F2F2] transition-colors duration-150 text-sm"
          >
            {mode === 'login' ? "Don't have an account? Register" : "Already have an account? Log in"}
          </button>
        </div>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8A8A8A] hover:text-[#F2F2F2] transition-colors duration-150"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Header;