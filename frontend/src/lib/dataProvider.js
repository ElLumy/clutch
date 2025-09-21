// Data provider abstraction - easily swap between mock and real API

const DATA_PROVIDER = process.env.REACT_APP_DATA_PROVIDER || 'mock';

// Mock implementations
import { allMockVideos, mockUser, filterCategories } from './mockData';

const mockAuthClient = {
  async getCurrentUser() {
    // Simulate auth state - 70% chance logged in for demo
    const isLoggedIn = Math.random() > 0.3;
    if (!isLoggedIn) {
      throw new Error('Unauthorized');
    }
    return mockUser;
  },

  async login(email, password) {
    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      access_token: 'mock_access_token_123',
      refresh_token: 'mock_refresh_token_456',
      expires_in: 3600,
      token_type: 'Bearer'
    };
  },

  async register(email, password, username) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      access_token: 'mock_access_token_789',
      refresh_token: 'mock_refresh_token_012', 
      expires_in: 3600,
      token_type: 'Bearer'
    };
  },

  async logout() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { success: true };
  }
};

const mockVideoClient = {
  async getPopularVideos(limit = 24, timeFrame = '7d') {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    const videos = allMockVideos
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, limit);
    return {
      videos,
      pagination: {
        page: 1,
        pageSize: limit,
        total: allMockVideos.length,
        totalPages: Math.ceil(allMockVideos.length / limit)
      }
    };
  },

  async getVideos({ page = 1, pageSize = 24, q = '', sortBy = 'created_at', sortDesc = true } = {}) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    let filteredVideos = allMockVideos;
    
    // Apply search filter
    if (q) {
      const query = q.toLowerCase();
      filteredVideos = filteredVideos.filter(video => 
        video.title.toLowerCase().includes(query) ||
        video.author.username.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    filteredVideos.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'created_at') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      
      if (sortDesc) {
        return bVal > aVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });
    
    // Apply pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const videos = filteredVideos.slice(startIndex, endIndex);
    
    return {
      videos,
      pagination: {
        page,
        pageSize,
        total: filteredVideos.length,
        totalPages: Math.ceil(filteredVideos.length / pageSize)
      }
    };
  },

  async getVideo(id) {
    await new Promise(resolve => setTimeout(resolve, 150));
    const video = allMockVideos.find(v => v.id === id);
    if (!video) {
      throw new Error('Video not found');
    }
    return video;
  },

  async searchVideos(q, page = 1, pageSize = 24) {
    return this.getVideos({ page, pageSize, q });
  },

  async getSearchSuggestions(q) {
    await new Promise(resolve => setTimeout(resolve, 100));
    if (!q || q.length < 2) return [];
    
    const query = q.toLowerCase();
    const suggestions = allMockVideos
      .filter(video => video.title.toLowerCase().includes(query))
      .slice(0, 5)
      .map(video => video.title);
    
    return [...new Set(suggestions)]; // Remove duplicates
  }
};

const mockAnalyticsClient = {
  events: [], // In-memory queue for development visibility

  async trackEvent(type, properties = {}) {
    const event = {
      type,
      properties,
      timestamp: new Date().toISOString(),
      session_id: 'mock_session_123'
    };
    
    this.events.push(event);
    console.log('📊 Analytics Event:', event);
    
    return { success: true };
  },

  async trackBatchEvents(events) {
    const batchEvents = events.map(event => ({
      ...event,
      timestamp: event.timestamp || new Date().toISOString(),
      session_id: 'mock_session_123'
    }));
    
    this.events.push(...batchEvents);
    console.table(batchEvents);
    
    return { success: true };
  },

  getEvents() {
    return this.events;
  }
};

// API client placeholder (will be implemented when switching to real APIs)
const apiClient = {
  auth: {
    getCurrentUser: () => Promise.reject(new Error('API not implemented yet')),
    login: () => Promise.reject(new Error('API not implemented yet')),
    register: () => Promise.reject(new Error('API not implemented yet')),
    logout: () => Promise.reject(new Error('API not implemented yet'))
  },
  videos: {
    getPopularVideos: () => Promise.reject(new Error('API not implemented yet')),
    getVideos: () => Promise.reject(new Error('API not implemented yet')),
    getVideo: () => Promise.reject(new Error('API not implemented yet')),
    searchVideos: () => Promise.reject(new Error('API not implemented yet')),
    getSearchSuggestions: () => Promise.reject(new Error('API not implemented yet'))
  },
  analytics: {
    trackEvent: () => Promise.reject(new Error('API not implemented yet')),
    trackBatchEvents: () => Promise.reject(new Error('API not implemented yet'))
  }
};

// Export the appropriate client based on DATA_PROVIDER
export const dataProvider = DATA_PROVIDER === 'mock' ? {
  auth: mockAuthClient,
  videos: mockVideoClient,
  analytics: mockAnalyticsClient
} : apiClient;

export { filterCategories };