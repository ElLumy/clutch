import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const RightPanel = () => {
  const [showMoreSubscriptions, setShowMoreSubscriptions] = useState(false);

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
    <div className="fixed right-0 top-16 w-80 h-[calc(100vh-64px)] bg-[#010101] border-l border-[#0E0E0E] overflow-y-auto z-20">
      <div className="p-6 space-y-8">
        {/* Subscriptions Section */}
        <div>
          <h3 className="text-[#F2F2F2] font-semibold text-lg mb-4">Subscriptions</h3>
          <div className="space-y-3">
            {visibleSubscriptions.map((channel, index) => (
              <div key={index} className="flex items-center space-x-3 group cursor-pointer hover:bg-[#070707] rounded-lg p-2 -m-2 transition-colors duration-150">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#A970FF] to-[#8B5CF6] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {channel.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {channel.isLive && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 border-2 border-[#010101] rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#F2F2F2] text-sm font-medium truncate group-hover:text-[#A970FF] transition-colors duration-150">
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
              className="flex items-center space-x-2 text-[#8A8A8A] hover:text-[#A970FF] transition-colors duration-150 text-sm font-medium mt-3"
            >
              <span>{showMoreSubscriptions ? 'Show less' : 'Show more'}</span>
              {showMoreSubscriptions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>

        {/* Explore Section */}
        <div>
          <h3 className="text-[#F2F2F2] font-semibold text-lg mb-4">Explore</h3>
          <div className="grid grid-cols-2 gap-3">
            {exploreCategories.map((category, index) => (
              <button
                key={index}
                className="flex items-center space-x-3 p-3 bg-[#070707] rounded-lg hover:bg-[#0B0B0B] hover:border-[#A970FF] border border-transparent transition-all duration-150 group"
              >
                <span className="text-lg">{category.icon}</span>
                <span className="text-[#F2F2F2] text-sm font-medium group-hover:text-[#A970FF] transition-colors duration-150">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-[#0E0E0E]">
          <div className="space-y-3 text-xs text-[#8A8A8A]">
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <a href="#" className="hover:text-[#A970FF] transition-colors duration-150">Cookie Notice</a>
              <a href="#" className="hover:text-[#A970FF] transition-colors duration-150">Privacy Notice</a>
              <a href="#" className="hover:text-[#A970FF] transition-colors duration-150">Help</a>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <a href="#" className="hover:text-[#A970FF] transition-colors duration-150">Community Guidelines</a>
              <a href="#" className="hover:text-[#A970FF] transition-colors duration-150">Terms</a>
            </div>
            <p className="text-[#8A8A8A] mt-4">© 2025 CLUTCH</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;