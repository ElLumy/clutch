import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Trophy, 
  Users, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp,
  Music,
  Film,
  Radio,
  Gamepad2,
  Newspaper,
  GraduationCap,
  Mic,
  UserPlus,
  LogIn
} from 'lucide-react';
import { dataProvider } from '../../lib/dataProvider';

const UnifiedSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMoreSubscriptions, setShowMoreSubscriptions] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      setLoading(true);
      const userData = await dataProvider.auth.getCurrentUser();
      setUser(userData);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const navigationItems = [
    { id: 'home', icon: Home, label: 'Home', isActive: true },
    { id: 'esports', icon: Trophy, label: 'Esports', isActive: false },
    { id: 'following', icon: Users, label: 'Following', isActive: false, requiresAuth: true }
  ];

  const subscriptions = [
    { name: 'Sfdx Show', viewers: '12.3K', isLive: true },
    { name: 'PlayStation Spain', viewers: '8.7K', isLive: false },
    { name: 'YANPOL', viewers: '15.2K', isLive: true },
    { name: 'Fish Chips', viewers: '4.1K', isLive: false },
    { name: 'MADDY', viewers: '9.8K', isLive: true },
    { name: 'Ibai', viewers: '45.7K', isLive: true },
    { name: 'eric vieyra', viewers: '2.3K', isLive: false }
  ];

  const exploreCategories = [
    { name: 'Music', icon: Music },
    { name: 'Movies', icon: Film },
    { name: 'Live', icon: Radio },
    { name: 'Gaming', icon: Gamepad2 },
    { name: 'News', icon: Newspaper },
    { name: 'Sports', icon: Trophy },
    { name: 'Learning', icon: GraduationCap },
    { name: 'Podcasts', icon: Mic }
  ];

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

  const visibleSubscriptions = showMoreSubscriptions ? subscriptions : subscriptions.slice(0, 4);
  const visibleMockSubscriptions = showMoreSubscriptions ? mockSubscriptions : mockSubscriptions.slice(0, 3);

  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
  };

  const handleAuthAction = () => {
    // Navigate to login/signup page or show modal
    console.log('Navigate to authentication');
  };

  return (
    <div 
      className={`fixed left-0 top-0 h-full bg-[#010101] border-r border-[#0E0E0E] transition-all duration-200 ease-out z-40 overflow-y-auto ${
        isExpanded ? 'w-80' : 'w-[72px]'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Expand/Collapse Toggle */}
      <div className="h-16 flex items-center justify-end px-4 border-b border-[#0E0E0E]">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-lg hover:bg-[#0B0B0B] transition-colors duration-150"
        >
          <ChevronRight 
            size={20} 
            className={`text-[#8A8A8A] transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="py-4">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          
          return (
            <div key={item.id} className="px-3 mb-1">
              <button
                className={`w-full flex items-center rounded-lg transition-all duration-150 ${
                  item.isActive 
                    ? 'bg-[#0B0B0B] text-[#F2F2F2] border-l-2 border-[#2D0F93] shadow-[0_0_12px_rgba(45,15,147,0.3)]' 
                    : 'text-[#8A8A8A] hover:bg-[#0B0B0B] hover:text-[#B9B9B9]'
                }`}
                style={{
                  padding: isExpanded ? '12px 16px' : '12px',
                  justifyContent: isExpanded ? 'flex-start' : 'center'
                }}
              >
                <IconComponent size={24} className="flex-shrink-0" />
                {isExpanded && (
                  <span className="ml-3 text-sm font-medium whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </nav>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-3 space-y-6">
          {/* Following Section */}
          <div>
            <h3 className="text-[#F2F2F2] font-semibold text-base mb-3 px-3">Following</h3>
            
            {loading ? (
              <div className="px-3 py-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-[#0B0B0B] rounded mb-2"></div>
                  <div className="h-4 bg-[#0B0B0B] rounded w-3/4"></div>
                </div>
              </div>
            ) : !user ? (
              /* Authentication Prompt */
              <div className="px-3 py-4 bg-[#070707] rounded-lg border border-[#1A1A1A] text-center">
                <div className="mb-3">
                  <UserPlus size={32} className="mx-auto text-[#8A8A8A] mb-2" />
                  <p className="text-[#B9B9B9] text-sm mb-1">
                    Sign in to see who you follow
                  </p>
                  <p className="text-[#8A8A8A] text-xs">
                    Keep track of channels you love
                  </p>
                </div>
                <button
                  onClick={handleAuthAction}
                  className="flex items-center justify-center space-x-2 w-full bg-[#2D0F93] text-white px-4 py-2 rounded-lg hover:bg-[#3D1FB3] transition-colors duration-200 text-sm font-medium"
                >
                  <LogIn size={16} />
                  <span>Sign In</span>
                </button>
              </div>
            ) : (
              /* User Following */
              <div className="space-y-2">
                {visibleMockFollowing.map((channel, index) => (
                  <div key={channel.id} className="flex items-center space-x-3 group cursor-pointer hover:bg-[#070707] rounded-lg p-2 transition-colors duration-150">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img
                          src={channel.avatarUrl}
                          alt={channel.displayName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {channel.isLive && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#010101]"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#F2F2F2] text-sm font-medium truncate group-hover:text-[#2D0F93] transition-colors duration-150">
                        {channel.displayName}
                      </p>
                      {channel.isLive && (
                        <p className="text-[#8A8A8A] text-xs">Live now</p>
                      )}
                    </div>
                  </div>
                ))}
                
                {mockSubscriptions.length > 3 && (
                  <button
                    onClick={() => setShowMoreSubscriptions(!showMoreSubscriptions)}
                    className="flex items-center justify-center space-x-2 w-full text-[#8A8A8A] hover:text-[#F2F2F2] transition-colors duration-150 py-2 text-sm"
                  >
                    {showMoreSubscriptions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    <span>{showMoreSubscriptions ? 'Show less' : `Show ${mockSubscriptions.length - 3} more`}</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Explore Section */}
          <div>
            <h3 className="text-[#F2F2F2] font-semibold text-base mb-3 px-3">Explore</h3>
            <div className="space-y-2">
              {exploreCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.name}
                    className="flex items-center space-x-3 w-full text-left px-3 py-2 text-[#8A8A8A] hover:bg-[#070707] hover:text-[#F2F2F2] rounded-lg transition-colors duration-150"
                  >
                    <IconComponent size={20} className="flex-shrink-0" />
                    <span className="text-sm font-medium">{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Traditional Subscriptions List (when authenticated) */}
          {user && (
            <div>
              <h3 className="text-[#F2F2F2] font-semibold text-base mb-3 px-3">Following</h3>
              <div className="space-y-2">
                {visibleSubscriptions.map((channel, index) => (
                  <div key={index} className="flex items-center space-x-3 group cursor-pointer hover:bg-[#070707] rounded-lg p-2 transition-colors duration-150">
                    <div className="relative">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#2D0F93] to-[#4D2FC3] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {channel.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      {channel.isLive && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#010101]"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-[#F2F2F2] text-sm font-medium truncate group-hover:text-[#2D0F93] transition-colors duration-150">
                          {channel.name}
                        </p>
                        {channel.isLive && (
                          <span className="text-red-400 text-xs font-medium ml-2">LIVE</span>
                        )}
                      </div>
                      {channel.isLive ? (
                        <p className="text-[#8A8A8A] text-xs">{channel.viewers} viewers</p>
                      ) : (
                        <p className="text-[#8A8A8A] text-xs">Offline</p>
                      )}
                    </div>
                  </div>
                ))}
                
                {subscriptions.length > 4 && (
                  <button
                    onClick={() => setShowMoreSubscriptions(!showMoreSubscriptions)}
                    className="flex items-center justify-center space-x-2 w-full text-[#8A8A8A] hover:text-[#F2F2F2] transition-colors duration-150 py-2 text-sm"
                  >
                    {showMoreSubscriptions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    <span>{showMoreSubscriptions ? 'Show less' : `Show ${subscriptions.length - 4} more`}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UnifiedSidebar;