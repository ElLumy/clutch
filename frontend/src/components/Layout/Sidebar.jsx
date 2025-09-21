import React, { useState } from 'react';
import { Home, Trophy, Users, ChevronRight } from 'lucide-react';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const navigationItems = [
    { id: 'home', icon: Home, label: 'Home', isActive: true },
    { id: 'esports', icon: Trophy, label: 'Esports', isActive: false },
    { id: 'subscriptions', icon: Users, label: 'Subscriptions', isActive: false }
  ];

  return (
    <div 
      className={`fixed left-0 top-0 h-full bg-[#010101] border-r border-[#0E0E0E] transition-all duration-200 ease-out z-40 ${
        isExpanded ? 'w-60' : 'w-[72px]'
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
                    ? 'bg-[#0B0B0B] text-[#F2F2F2] border-l-2 border-[#F2F2F2] shadow-[0_0_12px_rgba(242,242,242,0.1)]' 
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
    </div>
  );
};

export default Sidebar;