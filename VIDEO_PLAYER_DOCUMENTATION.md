# CLUTCH Video Player System - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture & Components](#architecture--components)
3. [Video Player Features](#video-player-features)
4. [Recent Major Updates](#recent-major-updates)
5. [Authentication Integration](#authentication-integration)
6. [UI/UX Design Specifications](#uiux-design-specifications)
7. [Backend Integration Requirements](#backend-integration-requirements)
8. [API Contracts](#api-contracts)
9. [Database Schema](#database-schema)
10. [File Structure](#file-structure)
11. [Installation & Setup](#installation--setup)
12. [Customization Guide](#customization-guide)
13. [Performance Optimization](#performance-optimization)
14. [Accessibility Features](#accessibility-features)
15. [Testing Strategy](#testing-strategy)
16. [Future Enhancements](#future-enhancements)

---

## Overview

The CLUTCH Video Player System is a comprehensive YouTube-style video streaming interface built specifically for the CLUTCH gaming platform. It features a professional video player with custom controls, engagement system, authentication integration, and a responsive design that maintains the platform's dark minimalist aesthetic.

### Key Features
- **Professional Video Player**: Custom controls with play/pause, volume, seeking, hierarchical settings, and fullscreen
- **Engagement System**: Like/dislike buttons, follow functionality, interactive comment system
- **Authentication Integration**: Seamless login prompts for engagement actions
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Performance Optimized**: Efficient video streaming and minimal resource usage
- **Accessibility Compliant**: WCAG 2.1 AA standards with keyboard navigation
- **Real-time Updates**: Live comment interactions and social metrics

---

## Recent Major Updates

### January 2025 - Critical Bug Fixes & Feature Enhancements

#### Fullscreen Video Controls Enhancement
**Problem Solved**: Browser native video controls were appearing in fullscreen mode
**Solution**: Comprehensive fullscreen implementation with custom control visibility
```jsx
// Enhanced fullscreen functionality
const handleFullscreen = () => {
  const videoContainer = videoRef.current?.parentElement;
  if (videoContainer) {
    if (!document.fullscreenElement) {
      if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen();
      } else if (videoContainer.webkitRequestFullscreen) {
        videoContainer.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }
};

// Video element configuration to hide browser controls
<video
  controls={false}
  controlsList="nodownload nofullscreen noremoteplayback"
  disablePictureInPicture
/>
```

#### Hierarchical Settings Menu System
**Enhancement**: Redesigned settings menu structure for better UX
**Implementation**: Two-level menu system (Settings → Quality/Speed → Options)

```jsx
// Settings Menu Structure
{showSettings && !showQualityMenu && !showSpeedMenu && (
  <div className="settings-main-menu">
    <button onClick={() => setShowQualityMenu(true)}>
      <span>Quality</span>
      <span>{quality}</span>
    </button>
    <button onClick={() => setShowSpeedMenu(true)}>
      <span>Speed</span>
      <span>{playbackRate === 1 ? 'Normal' : `${playbackRate}x`}</span>
    </button>
  </div>
)}

{showQualityMenu && (
  <div className="settings-submenu">
    <div className="submenu-header">
      <button onClick={() => {
        setShowQualityMenu(false);
        setShowSettings(true);
      }}>←</button>
      <span>Quality</span>
    </div>
    {['2160p', '1440p', '1080p', '720p', '480p'].map(q => (
      <button key={q} onClick={() => setQuality(q)}>
        {q}
      </button>
    ))}
  </div>
)}
```

#### Interactive Comment System Enhancement
**New Feature**: Added like/dislike functionality to comments and replies
**Implementation**: Real-time engagement with visual feedback

```jsx
const Comment = ({ comment }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0);
  
  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount(likeCount - 1);
    } else {
      setLiked(true);
      setLikeCount(likeCount + 1);
    }
  };

  return (
    <div className="comment">
      <div className="comment-actions">
        <button 
          onClick={handleLike}
          className={`like-button ${liked ? 'liked' : ''}`}
        >
          <ThumbsUp size={14} className={liked ? 'fill-current' : ''} />
          <span>{likeCount}</span>
        </button>
        <button className="dislike-button">
          <ThumbsDown size={14} />
        </button>
        <button className="reply-button">Reply</button>
      </div>
    </div>
  );
};
```

#### Progress Bar and Time Display Fixes
**Problem Solved**: Progress bar seeking not working, time display stuck at 00:00/00:00
**Solution**: Enhanced event handling and visual progress tracking

```jsx
// Enhanced progress bar with click-to-seek
<div className="progress-container" 
     onClick={(e) => {
       const rect = e.currentTarget.getBoundingClientRect();
       const clickX = e.clientX - rect.left;
       const newTime = (clickX / rect.width) * (duration || 0);
       handleSeek(newTime);
     }}>
  <div className="progress-track">
    <div 
      className="progress-filled" 
      style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
    />
  </div>
  <input
    type="range"
    min="0"
    max={duration || 0}
    value={currentTime}
    onChange={(e) => handleSeek(parseFloat(e.target.value))}
    className="progress-input"
  />
</div>

// Time display with proper formatting
<span className="time-display">
  {formatDuration(currentTime)} / {formatDuration(duration)}
</span>
```

#### Following System Implementation
**Terminology Change**: Updated from "Subscribe/Subscription" to "Follow/Following"
**Enhancement**: Complete social terminology consistency

```jsx
// Updated terminology throughout
const [followed, setFollowed] = useState(false);

const handleFollow = () => {
  if (!user) {
    setAuthPromptType('follow');
    setShowAuthPrompt(true);
    return;
  }
  setFollowed(!followed);
};

// Button implementation
<button onClick={handleFollow}>
  <UserPlus size={18} />
  <span>{followed ? 'Following' : 'Follow'}</span>
</button>

// Author info display
<p className="follower-count">
  {formatViewCount(video.author.followerCount)} followers
</p>
```

#### Unified Sidebar Enhancement
**New Feature**: Single sidebar component for consistent navigation
**Implementation**: Authentication-aware with footer links

```jsx
// Sidebar with authentication awareness
const UnifiedSidebar = () => {
  const [user, setUser] = useState(null);
  
  return (
    <div className="unified-sidebar">
      {/* Following Section */}
      <div>
        <h3>Following</h3>
        {!user ? (
          <div className="auth-prompt">
            <UserPlus size={32} />
            <p>Sign in to see who you follow</p>
            <button onClick={handleAuthAction}>
              <LogIn size={16} />
              <span>Sign In</span>
            </button>
          </div>
        ) : (
          <div className="following-list">
            {following.map(channel => (
              <FollowingItem key={channel.id} channel={channel} />
            ))}
          </div>
        )}
      </div>
      
      {/* Footer Links */}
      <div className="footer-links">
        <h3>More</h3>
        {['About', 'Help Center', 'Creators', 'Terms', 'Community Rules', 'Privacy Notice'].map(link => (
          <button key={link} className="footer-link">
            {link}
          </button>
        ))}
      </div>
    </div>
  );
};
```

#### Professional Icon System
**Enhancement**: Replaced emoji icons with Lucide React icons
**Implementation**: Consistent professional icon system

```jsx
import { 
  Music, Film, Radio, Gamepad2, 
  Newspaper, GraduationCap, Mic, Trophy 
} from 'lucide-react';

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

// Usage in render
{exploreCategories.map(category => {
  const IconComponent = category.icon;
  return (
    <button key={category.name}>
      <IconComponent size={20} />
      <span>{category.name}</span>
    </button>
  );
})}
```

---

## Architecture & Components

### Core Components

#### 1. VideoPlayer.jsx
The main video player component that handles all video playback functionality and user interactions.

```jsx
// Key Features:
- Video playback controls (play, pause, seek, volume, fullscreen)
- Settings menu (quality, speed selection)
- Progress bar with custom styling
- Time display and duration management
- Custom video controls overlay
```

#### 2. SidebarWithAuth.jsx
Enhanced sidebar component that shows authentication prompts for non-logged-in users.

```jsx
// Key Features:
- Collapsible/expandable design
- Authentication-aware subscription display
- Login prompts for non-authenticated users
- Smooth hover animations
- Navigation integration
```

#### 3. Authentication System
Integrated authentication flow that triggers login prompts for engagement actions.

```jsx
// Trigger Points:
- Like/dislike buttons
- Subscribe button
- Comment submission
- Subscription management
```

### Component Hierarchy

```
VideoPlayerPage
├── SidebarWithAuth
│   ├── Navigation Items
│   ├── Subscriptions (Auth-dependent)
│   └── Auth Prompts
├── Header (Existing)
└── VideoPlayer
    ├── Video Element
    ├── Custom Controls
    ├── Video Info Section
    ├── Channel Info
    ├── Engagement Buttons
    ├── Description
    ├── Comment System
    └── Related Videos Sidebar
```

---

## Video Player Features

### 1. Video Controls

#### Play/Pause System
```jsx
const handlePlayPause = () => {
  if (videoRef.current) {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }
};
```

#### Progress Bar
- **Custom Styled**: CLUTCH purple theme with hover effects
- **Precise Seeking**: Click or drag to any position
- **Visual Feedback**: Progress indicator with smooth transitions

#### Volume Control
- **Mute Toggle**: Click to mute/unmute
- **Volume Slider**: Adjust from 0 to 100%
- **Visual Indicators**: Different icons for muted/unmuted states

#### Settings Menu
```jsx
// Quality Options
['2160p', '1440p', '1080p', '720p', '480p']

// Speed Options
[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]
```

#### Fullscreen Support
- **Native API**: Uses browser's fullscreen API
- **Cross-browser**: Compatible with all modern browsers
- **Keyboard Shortcut**: Supports F key for fullscreen toggle

### 2. Engagement System

#### Like/Dislike Buttons
```jsx
const handleLike = () => {
  if (!user) {
    setAuthPromptType('like');
    setShowAuthPrompt(true);
    return;
  }
  // Handle like logic
};
```

#### Subscribe Button
- **Dynamic State**: Shows "Subscribe" or "Subscribed" based on status
- **Auth Required**: Prompts login for non-authenticated users
- **Visual Feedback**: Color and text changes on subscription status

#### Comment System
```jsx
// Authenticated Users
<CommentInput user={user} onSubmit={handleCommentSubmit} />

// Non-authenticated Users
<AuthPrompt message="Join the conversation! Log in to leave a comment." />
```

### 3. Video Information Display

#### Title and Metadata
- **Video Title**: Large, prominent display
- **View Count**: Formatted numbers (1.2M, 456K, etc.)
- **Upload Date**: Relative time format (2 days ago, 1 week ago)

#### Channel Information
- **Avatar**: Circular profile image
- **Channel Name**: Clickable with hover effects
- **Subscriber Count**: Formatted display
- **Subscribe Button**: Integrated with authentication

---

## Authentication Integration

### Authentication Flow

#### 1. Auth State Detection
```jsx
const checkAuthState = async () => {
  try {
    const userData = await dataProvider.auth.getCurrentUser();
    setUser(userData);
  } catch (error) {
    setUser(null);
  }
};
```

#### 2. Protected Actions
All engagement actions check authentication status:

```jsx
// Like/Dislike
if (!user) {
  setAuthPromptType('like');
  setShowAuthPrompt(true);
  return;
}

// Subscribe
if (!user) {
  setAuthPromptType('subscribe');
  setShowAuthPrompt(true);
  return;
}

// Comment
if (!user) {
  // Show comment auth prompt
}
```

#### 3. Auth Prompt Modal
```jsx
const AuthPromptModal = ({ type, onClose }) => {
  const getMessage = () => {
    switch (type) {
      case 'like': return 'like this video';
      case 'dislike': return 'dislike this video';
      case 'subscribe': return 'subscribe to this channel';
      case 'comment': return 'leave a comment';
    }
  };
  // Modal rendering
};
```

### Sidebar Authentication

#### Non-authenticated State
```jsx
// Show authentication prompt in subscriptions section
<div className="text-center p-4">
  <UserPlus size={32} className="mx-auto mb-3 text-[#8A8A8A]" />
  <p>Sign in to see your subscriptions and get personalized recommendations</p>
  <button onClick={() => setShowAuthPrompt(true)}>Sign In</button>
</div>
```

#### Authenticated State
```jsx
// Show user's subscriptions
{mockSubscriptions.map((channel) => (
  <SubscriptionItem key={channel.id} channel={channel} />
))}
```

---

## UI/UX Design Specifications

### Design System Integration

#### Color Palette
```css
/* Primary Colors */
--bg-base: #010101;           /* Main background */
--bg-surface: #070707;        /* Cards and surfaces */
--bg-hover: #0B0B0B;         /* Hover states */

/* Text Colors */
--text-primary: #F2F2F2;      /* Primary text */
--text-secondary: #B9B9B9;    /* Secondary text */
--text-muted: #8A8A8A;        /* Muted text */

/* Accent Colors */
--accent-primary: #2D0F93;    /* Primary purple */
--accent-hover: #3D1FB3;      /* Hover purple */
--accent-light: #4D2FC3;      /* Light purple */
```

#### Typography Scale
```css
/* Video Title */
.video-title {
  font-size: 2rem;           /* 32px */
  font-weight: 700;
  line-height: 1.2;
  color: var(--text-primary);
}

/* Channel Name */
.channel-name {
  font-size: 1.125rem;       /* 18px */
  font-weight: 600;
  color: var(--text-primary);
}

/* Metadata */
.metadata {
  font-size: 0.875rem;       /* 14px */
  font-weight: 500;
  color: var(--text-secondary);
}
```

#### Spacing System
```css
/* Based on 8px grid system */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 48px;
```

### Video Player Controls Styling

#### Progress Bar
```css
/* Custom range input styling */
input[type="range"] {
  -webkit-appearance: none;
  background: transparent;
}

input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #2D0F93;
  border: 2px solid #F2F2F2;
  box-shadow: 0 0 8px rgba(45, 15, 147, 0.4);
}
```

#### Control Buttons
```css
.control-button {
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  color: white;
}

.control-button:hover {
  color: #2D0F93;
  background: rgba(45, 15, 147, 0.1);
}
```

### Responsive Design

#### Breakpoints
```css
/* Mobile */
@media (max-width: 767px) {
  .video-player-page {
    padding-left: 0;
  }
  
  .video-grid {
    grid-template-columns: 1fr;
  }
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  .video-grid {
    grid-template-columns: 1fr;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .video-grid {
    grid-template-columns: 2fr 1fr;
  }
}
```

---

## Backend Integration Guide

### API Endpoints Required

#### 1. Video Data Endpoint
```javascript
GET /api/videos/:videoId
```

**Response Schema:**
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "thumbnailUrl": "string",
  "videoUrl": "string",
  "duration": "number",
  "viewCount": "number",
  "likeCount": "number",
  "dislikeCount": "number",
  "author": {
    "id": "string",
    "username": "string",
    "displayName": "string",
    "subscriberCount": "number",
    "avatarUrl": "string"
  },
  "publishedAt": "string (ISO 8601)",
  "createdAt": "string (ISO 8601)"
}
```

#### 2. Engagement Endpoints
```javascript
// Like/Unlike Video
POST /api/videos/:videoId/like
DELETE /api/videos/:videoId/like

// Subscribe/Unsubscribe to Channel
POST /api/channels/:channelId/subscribe
DELETE /api/channels/:channelId/subscribe

// Get User Subscriptions
GET /api/user/subscriptions
```

#### 3. Comment System Endpoints
```javascript
// Get Comments
GET /api/videos/:videoId/comments?page=1&limit=20

// Post Comment
POST /api/videos/:videoId/comments
{
  "content": "string",
  "parentId": "string (optional for replies)"
}

// Like Comment
POST /api/comments/:commentId/like
DELETE /api/comments/:commentId/like
```

#### 4. Related Videos Endpoint
```javascript
GET /api/videos/:videoId/related?limit=10
```

### Authentication Integration

#### JWT Token Handling
```javascript
// Include in all authenticated requests
const headers = {
  'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
  'Content-Type': 'application/json'
};
```

#### Auth State Management
```javascript
// Check authentication on page load
const checkAuthState = async () => {
  try {
    const response = await fetch('/api/auth/me', { headers });
    if (response.ok) {
      const userData = await response.json();
      setUser(userData);
    }
  } catch (error) {
    setUser(null);
  }
};
```

### Error Handling

#### Video Loading Errors
```javascript
const handleVideoError = (error) => {
  console.error('Video loading error:', error);
  
  // Show user-friendly error message
  setVideoError('This video is currently unavailable. Please try again later.');
  
  // Track error for analytics
  analytics.track('video_error', {
    videoId,
    errorType: error.code,
    timestamp: new Date().toISOString()
  });
};
```

#### API Error Handling
```javascript
const handleApiError = async (response) => {
  if (response.status === 401) {
    // Redirect to login
    window.location.href = '/login';
  } else if (response.status === 404) {
    // Show not found message
    setError('Video not found');
  } else {
    // Generic error
    setError('Something went wrong. Please try again.');
  }
};
```

---

## API Contracts

### Video Player API Integration

#### 1. Video Metadata Contract
```typescript
interface VideoData {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number;           // seconds
  viewCount: number;
  likeCount: number;
  dislikeCount: number;
  author: ChannelData;
  publishedAt: string;        // ISO 8601
  createdAt: string;          // ISO 8601
  tags?: string[];
  category?: string;
  isLive?: boolean;
}

interface ChannelData {
  id: string;
  username: string;
  displayName: string;
  subscriberCount: number;
  avatarUrl: string;
  isVerified?: boolean;
}
```

#### 2. Comment System Contract
```typescript
interface Comment {
  id: string;
  author: {
    id: string;
    username: string;
    avatarUrl: string;
  };
  content: string;
  likeCount: number;
  dislikeCount: number;
  publishedAt: string;
  parentId?: string;          // For replies
  replies?: Comment[];
}

interface CommentCreateRequest {
  content: string;
  parentId?: string;
}
```

#### 3. Engagement Contract
```typescript
interface EngagementData {
  videoId: string;
  userId: string;
  liked: boolean;
  disliked: boolean;
  subscribed: boolean;
  timestamp: string;
}

interface EngagementStats {
  likeCount: number;
  dislikeCount: number;
  commentCount: number;
  shareCount: number;
}
```

### Frontend State Management

#### Redux Store Structure (if using Redux)
```typescript
interface VideoPlayerState {
  currentVideo: VideoData | null;
  comments: Comment[];
  relatedVideos: VideoData[];
  user: UserData | null;
  engagement: {
    liked: boolean;
    disliked: boolean;
    subscribed: boolean;
  };
  playbackState: {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    isMuted: boolean;
    playbackRate: number;
    quality: string;
  };
  ui: {
    showControls: boolean;
    showSettings: boolean;
    showAuthPrompt: boolean;
    authPromptType: string;
  };
}
```

---

## Database Schema

### Video Collection
```javascript
const videoSchema = {
  _id: ObjectId,
  title: String,
  description: String,
  thumbnailUrl: String,
  videoUrl: String,
  duration: Number,              // seconds
  viewCount: Number,
  likeCount: Number,
  dislikeCount: Number,
  authorId: ObjectId,            // Reference to User
  publishedAt: Date,
  createdAt: Date,
  updatedAt: Date,
  tags: [String],
  category: String,
  isLive: Boolean,
  status: String,                // 'draft', 'published', 'private'
  
  // Analytics
  watchTime: Number,             // total watch time in seconds
  engagementRate: Number,        // calculated field
  
  // Video processing
  processingStatus: String,      // 'processing', 'ready', 'failed'
  videoQualities: [{
    quality: String,             // '1080p', '720p', etc.
    url: String,
    fileSize: Number
  }]
};
```

### User Collection
```javascript
const userSchema = {
  _id: ObjectId,
  username: String,
  email: String,
  displayName: String,
  avatarUrl: String,
  subscriberCount: Number,
  isVerified: Boolean,
  
  // Subscriptions
  subscriptions: [ObjectId],     // Array of User IDs
  
  // Engagement history
  likedVideos: [ObjectId],
  dislikedVideos: [ObjectId],
  watchHistory: [{
    videoId: ObjectId,
    watchTime: Number,
    lastWatched: Date
  }],
  
  createdAt: Date,
  updatedAt: Date
};
```

### Comment Collection
```javascript
const commentSchema = {
  _id: ObjectId,
  videoId: ObjectId,
  authorId: ObjectId,
  content: String,
  likeCount: Number,
  dislikeCount: Number,
  parentId: ObjectId,            // For replies, null for top-level
  
  // Moderation
  isHidden: Boolean,
  reportCount: Number,
  
  publishedAt: Date,
  createdAt: Date,
  updatedAt: Date
};
```

### Engagement Collection
```javascript
const engagementSchema = {
  _id: ObjectId,
  userId: ObjectId,
  videoId: ObjectId,
  type: String,                  // 'like', 'dislike', 'view', 'share'
  timestamp: Date,
  
  // Additional data based on type
  metadata: {
    watchTime: Number,           // for 'view' type
    shareDestination: String,    // for 'share' type
  }
};
```

---

## File Structure

### Frontend Structure
```
frontend/src/
├── components/
│   ├── Video/
│   │   ├── VideoPlayer.jsx           # Main video player component
│   │   ├── VideoGrid.jsx             # Video grid for homepage
│   │   └── VideoControls.jsx         # Custom video controls
│   ├── Layout/
│   │   ├── Header.jsx                # Navigation header
│   │   ├── Sidebar.jsx               # Original sidebar
│   │   └── SidebarWithAuth.jsx       # Enhanced sidebar with auth
│   └── Auth/
│       ├── AuthModal.jsx             # Authentication modal
│       └── AuthPrompt.jsx            # Engagement auth prompts
├── hooks/
│   ├── useAuth.js                    # Authentication hook
│   ├── useVideo.js                   # Video player hook
│   └── useEngagement.js              # Engagement actions hook
├── lib/
│   ├── dataProvider.js               # API data provider
│   ├── analytics.js                  # Analytics tracking
│   └── utils.js                      # Utility functions
└── styles/
    ├── App.css                       # Global styles
    └── VideoPlayer.css               # Video player specific styles
```

### Backend Structure (FastAPI)
```
backend/
├── app/
│   ├── models/
│   │   ├── video.py                  # Video data models
│   │   ├── user.py                   # User models
│   │   ├── comment.py                # Comment models
│   │   └── engagement.py             # Engagement models
│   ├── routers/
│   │   ├── videos.py                 # Video endpoints
│   │   ├── users.py                  # User endpoints
│   │   ├── comments.py               # Comment endpoints
│   │   └── engagement.py             # Engagement endpoints
│   ├── services/
│   │   ├── video_service.py          # Video business logic
│   │   ├── auth_service.py           # Authentication logic
│   │   └── analytics_service.py      # Analytics logic
│   └── database/
│       ├── mongodb.py                # Database connection
│       └── collections.py            # Collection definitions
├── tests/
│   ├── test_videos.py
│   ├── test_engagement.py
│   └── test_comments.py
└── requirements.txt
```

---

## Installation & Setup

### Prerequisites
- Node.js 18+
- Python 3.9+
- MongoDB 5.0+
- FFmpeg (for video processing)

### Frontend Setup
```bash
# Install dependencies
cd frontend
yarn install

# Start development server
yarn start

# Build for production
yarn build
```

### Backend Setup
```bash
# Create virtual environment
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Start development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

### Environment Variables

#### Frontend (.env)
```env
REACT_APP_BACKEND_URL=http://localhost:8001
REACT_APP_ANALYTICS_ID=your_analytics_id
REACT_APP_CDN_URL=https://your-cdn.com
```

#### Backend (.env)
```env
MONGO_URL=mongodb://localhost:27017/clutch
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY=your_aws_key
AWS_SECRET_KEY=your_aws_secret
CDN_URL=https://your-cdn.com
```

---

## Customization Guide

### Theme Customization

#### Color Scheme
Modify the CSS custom properties in `App.css`:

```css
:root {
  /* Change primary accent color */
  --accent-primary: #YOUR_COLOR;
  --accent-hover: #YOUR_HOVER_COLOR;
  
  /* Change background colors */
  --bg-base: #YOUR_BG_COLOR;
  --bg-surface: #YOUR_SURFACE_COLOR;
}
```

#### Typography
Update font families and sizes:

```css
/* Change primary font */
body {
  font-family: 'Your Font', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* Adjust typography scale */
.video-title {
  font-size: 2.5rem;  /* Larger titles */
}
```

### Video Player Customization

#### Custom Controls
Add new controls to the video player:

```jsx
// In VideoPlayer.jsx
const CustomControl = () => {
  return (
    <button className="control-button">
      <YourIcon size={20} />
    </button>
  );
};

// Add to controls row
<div className="flex items-center space-x-4">
  <PlayPauseButton />
  <CustomControl />  {/* Your new control */}
  <VolumeControl />
</div>
```

#### Settings Menu Extension
Add custom settings options:

```jsx
// Extend settings menu
const customSettings = [
  { id: 'captions', label: 'Captions', options: ['Off', 'English', 'Spanish'] },
  { id: 'theater', label: 'Theater Mode', type: 'toggle' }
];
```

### Engagement System Customization

#### Custom Engagement Actions
Add new engagement buttons:

```jsx
const CustomEngagementButton = ({ onClick, active }) => {
  return (
    <button
      onClick={onClick}
      className={`engagement-button ${active ? 'active' : ''}`}
    >
      <YourIcon size={18} />
      <span>Custom Action</span>
    </button>
  );
};
```

---

## Performance Optimization

### Video Streaming Optimization

#### Adaptive Bitrate Streaming
```jsx
const videoQualities = [
  { quality: '2160p', bitrate: 25000, url: 'video_4k.mp4' },
  { quality: '1440p', bitrate: 16000, url: 'video_1440p.mp4' },
  { quality: '1080p', bitrate: 8000, url: 'video_1080p.mp4' },
  { quality: '720p', bitrate: 5000, url: 'video_720p.mp4' }
];

// Auto-select quality based on connection
const selectOptimalQuality = (connectionSpeed) => {
  return videoQualities.find(q => q.bitrate <= connectionSpeed) || videoQualities[videoQualities.length - 1];
};
```

#### Progressive Loading
```jsx
// Preload video metadata
<video
  preload="metadata"
  poster={video.thumbnailUrl}
  onLoadedMetadata={handleMetadataLoaded}
>
  <source src={video.videoUrl} type="video/mp4" />
</video>
```

### Component Optimization

#### React.memo for Performance
```jsx
const VideoCard = React.memo(({ video, onClick }) => {
  return (
    <div onClick={() => onClick(video)}>
      {/* Video card content */}
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.video.id === nextProps.video.id;
});
```

#### Lazy Loading
```jsx
const LazyVideoPlayer = lazy(() => import('./VideoPlayer'));

const VideoPlayerPage = () => {
  return (
    <Suspense fallback={<VideoPlayerSkeleton />}>
      <LazyVideoPlayer videoId={videoId} />
    </Suspense>
  );
};
```

### Caching Strategy

#### API Response Caching
```jsx
const videoCache = new Map();

const fetchVideo = async (videoId) => {
  if (videoCache.has(videoId)) {
    return videoCache.get(videoId);
  }
  
  const video = await api.getVideo(videoId);
  videoCache.set(videoId, video);
  
  // Cache for 5 minutes
  setTimeout(() => {
    videoCache.delete(videoId);
  }, 5 * 60 * 1000);
  
  return video;
};
```

---

## Accessibility Features

### Keyboard Navigation

#### Video Controls
```jsx
const handleKeyPress = (e) => {
  switch (e.key) {
    case ' ':
    case 'k':
      e.preventDefault();
      handlePlayPause();
      break;
    case 'f':
      handleFullscreen();
      break;
    case 'm':
      handleMuteToggle();
      break;
    case 'ArrowLeft':
      handleSeek(currentTime - 10);
      break;
    case 'ArrowRight':
      handleSeek(currentTime + 10);
      break;
  }
};

useEffect(() => {
  document.addEventListener('keydown', handleKeyPress);
  return () => document.removeEventListener('keydown', handleKeyPress);
}, [currentTime]);
```

### Screen Reader Support

#### ARIA Labels
```jsx
<button
  aria-label={isPlaying ? 'Pause video' : 'Play video'}
  aria-pressed={isPlaying}
  onClick={handlePlayPause}
>
  {isPlaying ? <Pause /> : <Play />}
</button>

<div
  role="slider"
  aria-valuemin="0"
  aria-valuemax={duration}
  aria-valuenow={currentTime}
  aria-label="Video progress"
>
  <input type="range" /* ... */ />
</div>
```

#### Live Regions
```jsx
const [announcement, setAnnouncement] = useState('');

const announcePlayback = (message) => {
  setAnnouncement(message);
  setTimeout(() => setAnnouncement(''), 1000);
};

return (
  <div>
    <div aria-live="polite" className="sr-only">
      {announcement}
    </div>
    {/* Video player content */}
  </div>
);
```

### Visual Accessibility

#### Focus Indicators
```css
.control-button:focus-visible {
  outline: 2px solid #2D0F93;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(45, 15, 147, 0.2);
}
```

#### High Contrast Support
```css
@media (prefers-contrast: high) {
  .video-controls {
    background: #000000;
    border: 2px solid #FFFFFF;
  }
  
  .control-button {
    background: #FFFFFF;
    color: #000000;
  }
}
```

---

## Testing Strategy

### Unit Tests

#### Video Player Component
```javascript
// VideoPlayer.test.jsx
describe('VideoPlayer', () => {
  test('plays video when play button is clicked', () => {
    render(<VideoPlayer videoId="test-video" />);
    
    const playButton = screen.getByLabelText('Play video');
    fireEvent.click(playButton);
    
    expect(screen.getByLabelText('Pause video')).toBeInTheDocument();
  });
  
  test('shows auth prompt when like is clicked without login', () => {
    render(<VideoPlayer videoId="test-video" />);
    
    const likeButton = screen.getByLabelText('Like video');
    fireEvent.click(likeButton);
    
    expect(screen.getByText('Join CLUTCH to like this video')).toBeInTheDocument();
  });
});
```

### Integration Tests

#### API Integration
```javascript
// videoPlayer.integration.test.js
describe('Video Player API Integration', () => {
  test('loads video data on mount', async () => {
    const mockVideo = { id: '1', title: 'Test Video' };
    jest.spyOn(api, 'getVideo').mockResolvedValue(mockVideo);
    
    render(<VideoPlayer videoId="1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Video')).toBeInTheDocument();
    });
  });
});
```

### End-to-End Tests

#### Playwright Tests
```javascript
// e2e/videoPlayer.spec.js
test('video player functionality', async ({ page }) => {
  await page.goto('/watch?v=test-video');
  
  // Test video loads
  await expect(page.locator('video')).toBeVisible();
  
  // Test play button
  await page.click('[aria-label="Play video"]');
  await expect(page.locator('[aria-label="Pause video"]')).toBeVisible();
  
  // Test auth prompt
  await page.click('[aria-label="Like video"]');
  await expect(page.locator('text=Join CLUTCH to like this video')).toBeVisible();
});
```

---

## Future Enhancements

### Advanced Video Features

#### 1. Live Streaming Support
```jsx
const LivePlayer = ({ streamUrl, isLive }) => {
  const [viewerCount, setViewerCount] = useState(0);
  
  useEffect(() => {
    if (isLive) {
      const ws = new WebSocket('/ws/live-stats');
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setViewerCount(data.viewerCount);
      };
    }
  }, [isLive]);
  
  return (
    <div>
      {isLive && (
        <div className="live-indicator">
          <span className="live-dot"></span>
          LIVE • {viewerCount} watching
        </div>
      )}
      {/* Video player */}
    </div>
  );
};
```

#### 2. Chapter Navigation
```jsx
const ChapterNavigation = ({ chapters, currentTime, onSeek }) => {
  return (
    <div className="chapters-list">
      {chapters.map((chapter, index) => (
        <button
          key={index}
          onClick={() => onSeek(chapter.startTime)}
          className={`chapter-item ${
            currentTime >= chapter.startTime && currentTime < chapter.endTime
              ? 'active' : ''
          }`}
        >
          <img src={chapter.thumbnail} alt={chapter.title} />
          <div>
            <h4>{chapter.title}</h4>
            <span>{formatTime(chapter.startTime)}</span>
          </div>
        </button>
      ))}
    </div>
  );
};
```

#### 3. Video Analytics Dashboard
```jsx
const VideoAnalytics = ({ videoId }) => {
  const [analytics, setAnalytics] = useState(null);
  
  useEffect(() => {
    fetchVideoAnalytics(videoId).then(setAnalytics);
  }, [videoId]);
  
  return (
    <div className="analytics-dashboard">
      <MetricCard title="Total Views" value={analytics?.totalViews} />
      <MetricCard title="Avg. Watch Time" value={analytics?.avgWatchTime} />
      <MetricCard title="Engagement Rate" value={analytics?.engagementRate} />
      
      <WatchTimeChart data={analytics?.watchTimeData} />
      <EngagementChart data={analytics?.engagementData} />
    </div>
  );
};
```

### Social Features

#### 1. Watch Parties
```jsx
const WatchParty = ({ partyId, videoId }) => {
  const [participants, setParticipants] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  
  return (
    <div className="watch-party">
      <VideoPlayer 
        videoId={videoId} 
        syncMode="party"
        partyId={partyId}
      />
      
      <ParticipantsList participants={participants} />
      <ChatWindow messages={chatMessages} />
    </div>
  );
};
```

#### 2. Video Reactions
```jsx
const VideoReactions = ({ videoId }) => {
  const [reactions, setReactions] = useState([]);
  
  const addReaction = (type, timestamp) => {
    setReactions([...reactions, { type, timestamp, id: Date.now() }]);
  };
  
  return (
    <div className="reactions-overlay">
      {reactions.map(reaction => (
        <ReactionEmoji
          key={reaction.id}
          type={reaction.type}
          timestamp={reaction.timestamp}
        />
      ))}
      
      <ReactionPicker onReaction={addReaction} />
    </div>
  );
};
```

### Performance & Scale

#### 1. CDN Integration
```jsx
const getCDNUrl = (videoUrl, quality) => {
  const cdnBase = process.env.REACT_APP_CDN_URL;
  return `${cdnBase}/videos/${videoId}/${quality}.m3u8`;
};
```

#### 2. Progressive Web App Features
```json
// manifest.json
{
  "name": "CLUTCH Video Player",
  "short_name": "CLUTCH",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#010101",
  "theme_color": "#2D0F93",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

---

## Conclusion

The CLUTCH Video Player System provides a comprehensive, professional-grade video streaming experience that integrates seamlessly with the platform's authentication system and design language. With its modular architecture, extensive customization options, and focus on performance and accessibility, it serves as a robust foundation for building advanced video streaming features.

The system is designed to scale with the platform's growth, supporting everything from basic video playback to advanced features like live streaming, watch parties, and detailed analytics. The comprehensive documentation ensures that developers can easily understand, maintain, and extend the system as needed.

---

*Documentation Version: 1.0*  
*Last Updated: January 2025*  
*Created by: CLUTCH Development Team*