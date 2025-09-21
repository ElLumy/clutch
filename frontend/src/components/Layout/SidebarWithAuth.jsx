import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Compass, 
  Users, 
  Music, 
  Film, 
  Radio, 
  Gamepad2,
  UserPlus,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { dataProvider } from '../../lib/dataProvider';

const SidebarWithAuth = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [user, setUser] = useState(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [subscriptionsExpanded, setSubscriptionsExpanded] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const userData = await dataProvider.auth.getCurrentUser();
      setUser(userData);
    } catch (error) {
      setUser(null);
    }
  };

  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
  };

  const mockSubscriptions = [
    {
      id: 1,
      username: "ProGamer_2024",
      displayName: "Pro Gamer",
      avatarUrl: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100",
      isLive: false,
      subscriberCount: 125000
    },
    {
      id: 2,
      username: "TechReviewer",
      displayName: "Tech Reviewer",
      avatarUrl: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100",
      isLive: true,
      subscriberCount: 89000
    },
    {
      id: 3,
      username: "ESports_Central",
      displayName: "ESports Central",
      avatarUrl: "https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=100",
      isLive: false,
      subscriberCount: 234000
    },
    {
      id: 4,
      username: "GameGuide_Official",
      displayName: "Game Guide Official",
      avatarUrl: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100",
      isLive: false,
      subscriberCount: 67000
    }
  ];

  return (
    <div 
      className={`fixed left-0 top-0 h-full bg-[#010101] border-r border-[#0E0E0E] transition-all duration-200 ease-out z-40 overflow-y-auto ${
        isExpanded ? 'w-80' : 'w-[72px]'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-end px-4 border-b border-[#0E0E0E]">
        {isExpanded && (
          <button className="text-[#8A8A8A] hover:text-[#F2F2F2] transition-colors duration-150">
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="py-4">
        {/* Main Navigation */}
        <div className="space-y-1 px-3">
          <NavItem icon={Home} label="Home" isExpanded={isExpanded} active />
          <NavItem icon={Compass} label="Explore" isExpanded={isExpanded} />
        </div>

        {/* Subscriptions Section */}
        <div className="mt-8">
          {isExpanded && (
            <div className="px-6 mb-4">
              <button
                onClick={() => setSubscriptionsExpanded(!subscriptionsExpanded)}
                className="flex items-center justify-between w-full text-[#F2F2F2] font-medium text-sm hover:text-[#5A4FCF] transition-colors duration-150"
              >
                <span>Subscriptions</span>
                {subscriptionsExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            </div>
          )}

          {/* Subscription Content */}
          {isExpanded && subscriptionsExpanded && (
            <div className="px-3 space-y-1">
              {user ? (
                // Show subscriptions if logged in
                mockSubscriptions.map((channel) => (
                  <SubscriptionItem
                    key={channel.id}
                    channel={channel}
                    isExpanded={isExpanded}
                  />
                ))
              ) : (
                // Show auth prompt if not logged in
                <div className="mx-3 p-4 bg-[#070707] rounded-xl border border-[#1A1A1A] text-center">
                  <UserPlus size={32} className="mx-auto mb-3 text-[#8A8A8A]" />
                  <p className="text-[#B9B9B9] text-sm mb-3 leading-relaxed">
                    Sign in to see your subscriptions and get personalized recommendations
                  </p>
                  <button
                    onClick={() => setShowAuthPrompt(true)}
                    className="w-full py-2 bg-[#2D0F93] text-white rounded-lg font-medium hover:bg-[#3D1FB3] hover:shadow-[0_0_15px_rgba(45,15,147,0.3)] transition-all duration-200 text-sm"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Collapsed subscriptions preview */}
          {!isExpanded && user && (
            <div className="px-3 space-y-1">
              {mockSubscriptions.slice(0, 4).map((channel) => (
                <SubscriptionItem
                  key={channel.id}
                  channel={channel}
                  isExpanded={isExpanded}
                />
              ))}
            </div>
          )}
        </div>

        {/* Explore Section */}
        {isExpanded && (
          <div className="mt-8">
            <div className="px-6 mb-4">
              <h3 className="text-[#F2F2F2] font-medium text-sm">Explore</h3>
            </div>
            <div className="space-y-1 px-3">
              <NavItem icon={Music} label="Music" isExpanded={isExpanded} />
              <NavItem icon={Film} label="Movies" isExpanded={isExpanded} />
              <NavItem icon={Radio} label="Live" isExpanded={isExpanded} />
              <NavItem icon={Gamepad2} label="Gaming" isExpanded={isExpanded} />
            </div>
          </div>
        )}

        {/* Show more link when collapsed */}
        {!isExpanded && (
          <div className="mt-4 px-3">
            <button className="w-full flex items-center justify-center p-3 text-[#8A8A8A] hover:text-[#F2F2F2] hover:bg-[#070707] rounded-lg transition-all duration-150">
              <Users size={20} />
            </button>
          </div>
        )}
      </nav>

      {/* Footer for expanded sidebar */}
      {isExpanded && (
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#010101] to-transparent">
          <div className="text-[#8A8A8A] text-xs space-y-1">
            <p>© 2025 CLUTCH Platform</p>
            <div className="flex flex-wrap gap-2">
              <button className="hover:text-[#F2F2F2] transition-colors duration-150">Terms</button>
              <span>•</span>
              <button className="hover:text-[#F2F2F2] transition-colors duration-150">Privacy</button>
              <span>•</span>
              <button className="hover:text-[#F2F2F2] transition-colors duration-150">Help</button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Prompt Modal */}
      {showAuthPrompt && (
        <AuthPromptOverlay onClose={() => setShowAuthPrompt(false)} />
      )}
    </div>
  );
};

// Navigation Item Component
const NavItem = ({ icon: Icon, label, isExpanded, active = false }) => {
  return (
    <button
      className={`w-full flex items-center p-3 rounded-lg transition-all duration-150 group ${
        active 
          ? 'bg-[#2D0F93] text-white shadow-[0_0_15px_rgba(45,15,147,0.3)]' 
          : 'text-[#8A8A8A] hover:text-[#F2F2F2] hover:bg-[#070707]'
      }`}
    >
      <Icon size={20} className="flex-shrink-0" />
      {isExpanded && (
        <span className="ml-6 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          {label}
        </span>
      )}
      {active && (
        <div className="absolute left-0 w-1 h-6 bg-[#4D2FC3] rounded-r-full"></div>
      )}
    </button>
  );
};

// Subscription Item Component
const SubscriptionItem = ({ channel, isExpanded }) => {
  return (
    <button className="w-full flex items-center p-2 rounded-lg text-[#8A8A8A] hover:text-[#F2F2F2] hover:bg-[#070707] transition-all duration-150 group">
      <div className="relative flex-shrink-0">
        <div className="w-8 h-8 rounded-full overflow-hidden">
          <img
            src={channel.avatarUrl}
            alt={channel.displayName}
            className="w-full h-full object-cover"
          />
        </div>
        {channel.isLive && (
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#010101]"></div>
        )}
      </div>
      {isExpanded && (
        <div className="ml-3 flex-1 text-left opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <p className="text-sm font-medium truncate">
            {channel.displayName}
          </p>
          {channel.isLive && (
            <p className="text-xs text-red-400 font-medium">LIVE</p>
          )}
        </div>
      )}
    </button>
  );
};

// Auth Prompt Overlay Component
const AuthPromptOverlay = ({ onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-gradient-to-br from-[#0A0A0A] to-[#070707] rounded-3xl p-8 w-full max-w-md border border-[#2D0F93] border-opacity-20 shadow-[0_0_40px_rgba(45,15,147,0.15)]">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-[#2D0F93] to-[#4D2FC3] rounded-full mx-auto mb-4 flex items-center justify-center shadow-[0_0_20px_rgba(45,15,147,0.3)]">
            <UserPlus className="text-white" size={24} />
          </div>
          <h3 className="text-[#F2F2F2] text-xl font-bold mb-2">
            Join CLUTCH
          </h3>
          <p className="text-[#B9B9B9] text-sm">
            Sign up to manage your subscriptions and get personalized recommendations
          </p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-[#2D0F93] to-[#3D1FB3] text-white rounded-xl font-medium hover:from-[#3D1FB3] hover:to-[#4D2FC3] hover:shadow-[0_0_25px_rgba(45,15,147,0.4)] transform hover:scale-[1.02] transition-all duration-200"
          >
            Sign Up
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 bg-transparent border border-[#2D0F93] text-[#2D0F93] rounded-xl font-medium hover:bg-[#2D0F93] hover:text-white transition-all duration-200"
          >
            Log In
          </button>
        </div>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8A8A8A] hover:text-[#F2F2F2] transition-colors duration-200 text-2xl"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default SidebarWithAuth;