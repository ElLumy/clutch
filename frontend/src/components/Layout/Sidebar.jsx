import React, { useState } from 'react';
import { Home, Trophy, Users, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMoreSubscriptions, setShowMoreSubscriptions] = useState(false);

  const navigationItems = [
    { id: 'home', icon: Home, label: 'Home', isActive: true },
    { id: 'esports', icon: Trophy, label: 'Esports', isActive: false },
    { id: 'subscriptions', icon: Users, label: 'Subscriptions', isActive: false }
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
    { name: 'Music', icon: '🎵' },
    { name: 'Movies', icon: '🎬' },
    { name: 'Live', icon: '🔴' },
    { name: 'Gaming', icon: '🎮' },
    { name: 'News', icon: '📰' },
    { name: 'Sports', icon: '⚽' },
    { name: 'Learning', icon: '📚' },
    { name: 'Podcasts', icon: '🎙️' }
  ];

  const visibleSubscriptions = showMoreSubscriptions ? subscriptions : subscriptions.slice(0, 4);

  return (
    <div 
      className={`fixed left-0 top-0 h-full bg-[#010101] border-r border-[#0E0E0E] transition-all duration-200 ease-out z-40 overflow-y-auto ${
        isExpanded ? 'w-80' : 'w-[72px]'
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
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
          {/* Subscriptions Section */}
          <div>
            <h3 className="text-[#F2F2F2] font-semibold text-base mb-3 px-3">Subscriptions</h3>
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
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 border-2 border-[#010101] rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#F2F2F2] text-sm font-medium truncate group-hover:text-[#5A4FCF] transition-colors duration-150">
                      {channel.name}
                    </p>
                    <p className="text-[#8A8A8A] text-xs">
                      {channel.isLive ? `${channel.viewers} watching` : 'Offline'}
                    </p>
                  </div>
                </div>
              ))}
              
              <button
                onClick={() => setShowMoreSubscriptions(!showMoreSubscriptions)}
                className="flex items-center space-x-2 text-[#8A8A8A] hover:text-[#2D0F93] transition-colors duration-150 text-sm font-medium mt-2 px-2"
              >
                <span>{showMoreSubscriptions ? 'Show less' : 'Show more'}</span>
                {showMoreSubscriptions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          </div>

          {/* Explore Section */}
          <div>
            <h3 className="text-[#F2F2F2] font-semibold text-base mb-3 px-3">Explore</h3>
            <div className="space-y-2">
              {exploreCategories.map((category, index) => (
                <button
                  key={index}
                  className="w-full flex items-center space-x-3 p-2 bg-transparent rounded-lg hover:bg-[#070707] hover:border-[#2D0F93] border border-transparent transition-all duration-150 group"
                >
                  <span className="text-base">{category.icon}</span>
                  <span className="text-[#F2F2F2] text-sm font-medium group-hover:text-[#5A4FCF] transition-colors duration-150">
                    {category.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-[#0E0E0E] px-3">
            <div className="space-y-2 text-xs text-[#8A8A8A]">
              <div className="flex flex-col space-y-1">
                <a href="#" className="hover:text-[#2D0F93] transition-colors duration-150">Cookie Notice</a>
                <a href="#" className="hover:text-[#2D0F93] transition-colors duration-150">Privacy Notice</a>
                <a href="#" className="hover:text-[#2D0F93] transition-colors duration-150">Help</a>
                <a href="#" className="hover:text-[#2D0F93] transition-colors duration-150">Community Guidelines</a>
                <a href="#" className="hover:text-[#2D0F93] transition-colors duration-150">Terms</a>
              </div>
              <p className="text-[#8A8A8A] pt-3 border-t border-[#0E0E0E]">© 2025 CLUTCH</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;