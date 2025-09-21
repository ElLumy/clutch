# CLUTCH Frontend-Backend Integration Contracts

## Overview
This document defines the API contracts and integration points between the CLUTCH frontend and backend services. The frontend is currently implemented with mock data providers that can be seamlessly swapped to real API endpoints by changing a single environment variable.

## Data Provider Architecture

### Environment Configuration
```bash
REACT_APP_DATA_PROVIDER=mock  # Default for MVP
REACT_APP_DATA_PROVIDER=api   # For production
```

### Provider Interface
Located in `/app/frontend/src/lib/dataProvider.js`

## API Contracts

### 1. Authentication Service

#### Endpoints to Implement:
- `POST /api/auth/login`
- `POST /api/auth/register` 
- `GET /api/users/me`
- `POST /api/auth/logout`

#### Data Models:

**TokenPair Response:**
```typescript
{
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: "Bearer";
}
```

**UserWithProfile Response:**
```typescript
{
  user: {
    id: string;
    username: string;
    email: string;
    created_at: string;
    updated_at: string;
  };
  profile: {
    user_id: string;
    display_name: string;
    avatar_url: string;
    bio: string;
    created_at: string;
    updated_at: string;
  };
}
```

#### Frontend Mock Implementation:
- `getCurrentUser()` - 70% chance returns logged-in user, 30% throws 401
- `login(email, password)` - Returns mock TokenPair after 800ms delay
- `register(email, password, username)` - Returns mock TokenPair after 1000ms delay
- `logout()` - Returns success after 200ms delay

### 2. Video Service

#### Endpoints to Implement:
- `GET /api/analytics/trending?limit=24&timeFrame=7d`
- `GET /api/recommendations/videos?limit=24` (authenticated)
- `GET /api/videos?page=1&pageSize=24&q=search&sortBy=created_at&sortDesc=true`
- `GET /api/videos/{id}`
- `GET /api/v1/videos/search?q=query&page=1&pageSize=24`

#### Data Models:

**Video Model:**
```typescript
{
  id: string;
  title: string;
  status: "published" | "draft" | "private";
  visibility: "public" | "unlisted" | "private";
  author: {
    id: string;
    username: string;
    displayName?: string;
  };
  thumbnailUrl: string;
  duration: number; // seconds, 0 for live streams
  viewCount: number;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  publishedAt?: string; // ISO date
  isLive?: boolean; // optional flag for live content
}
```

**VideoListResponse:**
```typescript
{
  videos: Video[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
```

#### Frontend Mock Implementation:
- 36 mock videos with realistic gaming/esports content
- Supports search filtering by title and author
- Implements pagination with configurable page sizes
- Returns search suggestions based on video titles
- Simulates network delays (150-300ms)

### 3. Analytics Service

#### Endpoints to Implement:
- `POST /api/analytics/events`
- `POST /api/analytics/events/batch`

#### Event Models:

**Analytics Event:**
```typescript
{
  type: "page_view" | "video_view_impression" | "video_click" | "search";
  properties: Record<string, any>;
  timestamp: string;
  session_id: string;
  user_id?: string;
}
```

#### Frontend Mock Implementation:
- In-memory event queue for development visibility
- Console logging of all tracked events
- Event types currently tracked:
  - `page_view` on route changes
  - `video_view_impression` when cards are clicked
  - Search queries and filter changes

## Frontend Implementation Details

### Current Mock Data

1. **Authentication State**: Randomly assigned on page load (70% logged in)
2. **Video Content**: 36+ videos with gaming/esports themes
3. **Search**: Local filtering by title and username
4. **Analytics**: Console-only tracking for development

### Component Architecture

**Layout Components:**
- `Sidebar.jsx` - Collapsible navigation (72px collapsed, 240px expanded)
- `Header.jsx` - Authentication-aware with search and profile menu
- `VideoGrid.jsx` - Responsive grid with infinite scroll

**Key Features Implemented:**
- Dark theme with exact color specifications
- Responsive design (desktop/tablet/mobile breakpoints)
- Hover animations and micro-interactions
- Search with real-time suggestions
- Authentication modal with login/register forms
- Profile menu with user actions
- Infinite scroll with skeleton loading states

### Integration Points

**To Replace Mock Data:**
1. Set `REACT_APP_DATA_PROVIDER=api` in `.env`
2. Implement API client methods in `dataProvider.js`
3. Backend should return exact same data structures as mocks

**Authentication Flow:**
1. Check auth state with `GET /api/users/me` on app load
2. Show login/register buttons if 401 response
3. Show user avatar and profile menu if 200 response
4. Handle token refresh and logout flows

**Video Loading Flow:**
1. Load trending/popular videos on homepage
2. Load personalized recommendations if authenticated
3. Implement search with debounced queries
4. Track analytics events for all user interactions

## Testing Strategy

- Mock implementation allows full frontend testing without backend
- Real API endpoints can be tested by switching environment variable
- All component states (loading, error, empty) are implemented
- Analytics events are tracked and visible in console for verification

## Performance Considerations

- Image lazy loading implemented
- Infinite scroll prevents large initial payloads
- Search suggestions debounced to reduce API calls
- Analytics events can be batched for efficiency
- CSS animations use transform/opacity for 60fps performance