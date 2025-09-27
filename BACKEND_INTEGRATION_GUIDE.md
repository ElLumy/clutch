# CLUTCH Platform - Backend Integration Guide

## Table of Contents
1. [Overview](#overview)
2. [Authentication System Requirements](#authentication-system-requirements)
3. [Video Management API](#video-management-api)
4. [User Follow System](#user-follow-system)
5. [Comment System Backend](#comment-system-backend)
6. [Real-time Features](#real-time-features)
7. [File Storage & CDN](#file-storage--cdn)
8. [Database Schema](#database-schema)
9. [API Endpoints Specification](#api-endpoints-specification)
10. [Error Handling](#error-handling)
11. [Security & Validation](#security--validation)
12. [Performance Optimization](#performance-optimization)
13. [Deployment Configuration](#deployment-configuration)

---

## Overview

This document outlines all backend requirements for the CLUTCH video streaming platform, including API endpoints, database schemas, authentication flows, and integration patterns needed to support the frontend features.

### Technology Stack Requirements
- **Framework**: FastAPI (Python) or Node.js/Express
- **Database**: MongoDB with proper indexing
- **Authentication**: JWT tokens with refresh mechanism
- **File Storage**: AWS S3 or similar CDN for video/image storage
- **Real-time**: WebSocket support for live features
- **Video Processing**: FFmpeg integration for video transcoding

---

## Authentication System Requirements

### JWT Token Structure
```json
{
  "access_token": {
    "user_id": "uuid",
    "username": "string",
    "email": "string", 
    "display_name": "string",
    "avatar_url": "string",
    "role": "user|creator|admin",
    "exp": "timestamp",
    "iat": "timestamp"
  },
  "refresh_token": {
    "user_id": "uuid",
    "exp": "timestamp (7 days)",
    "iat": "timestamp"
  }
}
```

### Authentication Endpoints

#### POST `/api/auth/register`
```json
// Request
{
  "username": "string (3-30 chars, alphanumeric + underscore)",
  "email": "string (valid email)",
  "password": "string (8+ chars, 1 uppercase, 1 number)",
  "display_name": "string (optional, 1-50 chars)"
}

// Response
{
  "success": true,
  "message": "Account created successfully",
  "user": {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "display_name": "string",
    "avatar_url": "string (default avatar)",
    "created_at": "ISO timestamp",
    "follower_count": 0,
    "following_count": 0
  },
  "tokens": {
    "access_token": "jwt_string",
    "refresh_token": "jwt_string"
  }
}
```

#### POST `/api/auth/login`
```json
// Request
{
  "login": "string (username or email)",
  "password": "string"
}

// Response (same structure as register)
```

#### POST `/api/auth/refresh`
```json
// Request
{
  "refresh_token": "jwt_string"
}

// Response
{
  "access_token": "new_jwt_string",
  "refresh_token": "new_jwt_string (optional rotation)"
}
```

#### GET `/api/auth/me`
Headers: `Authorization: Bearer <access_token>`
```json
// Response
{
  "user": {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "display_name": "string", 
    "avatar_url": "string",
    "bio": "string",
    "follower_count": "number",
    "following_count": "number",
    "created_at": "ISO timestamp",
    "verified": "boolean"
  },
  "profile": {
    "total_views": "number",
    "total_videos": "number",
    "total_likes_received": "number"
  }
}
```

---

## Video Management API

### Video Model Structure
```json
{
  "id": "uuid",
  "title": "string (1-100 chars)",
  "description": "string (0-5000 chars)",
  "thumbnail_url": "string",
  "video_url": "string",
  "duration": "number (seconds)",
  "view_count": "number",
  "like_count": "number", 
  "dislike_count": "number",
  "comment_count": "number",
  "author": {
    "id": "uuid",
    "username": "string",
    "display_name": "string",
    "avatar_url": "string",
    "follower_count": "number",
    "verified": "boolean"
  },
  "tags": ["array of strings"],
  "category": "string",
  "visibility": "public|unlisted|private",
  "published_at": "ISO timestamp",
  "updated_at": "ISO timestamp",
  "processing_status": "uploaded|processing|ready|error",
  "quality_variants": {
    "2160p": "string (video_url)",
    "1440p": "string (video_url)", 
    "1080p": "string (video_url)",
    "720p": "string (video_url)",
    "480p": "string (video_url)"
  },
  "metrics": {
    "watch_time_minutes": "number",
    "engagement_rate": "number",
    "retention_curve": ["array of percentages"]
  }
}
```

### Video Endpoints

#### GET `/api/videos`
Query Parameters:
- `page`: number (default: 1)
- `limit`: number (default: 20, max: 50)  
- `category`: string (optional)
- `tags`: string (comma-separated, optional)
- `sort`: "latest|popular|trending" (default: latest)

```json
// Response
{
  "videos": [/* array of video objects */],
  "pagination": {
    "current_page": 1,
    "total_pages": 10,
    "total_items": 200,
    "has_next": true,
    "has_prev": false
  }
}
```

#### GET `/api/videos/{video_id}`
```json
// Response: Complete video object with all fields
```

#### POST `/api/videos/{video_id}/view`
Headers: `Authorization: Bearer <token>` (optional)
```json
// Request
{
  "watch_time_seconds": "number (optional)",
  "quality": "string (optional)"
}

// Response
{
  "success": true,
  "new_view_count": "number"
}
```

#### POST `/api/videos/{video_id}/like`
Headers: `Authorization: Bearer <token>` (required)
```json
// Request
{
  "action": "like|dislike|remove"
}

// Response
{
  "success": true,
  "user_action": "liked|disliked|none",
  "like_count": "number",
  "dislike_count": "number"
}
```

---

## User Follow System

### Follow Endpoints

#### POST `/api/users/{user_id}/follow`
Headers: `Authorization: Bearer <token>`
```json
// Response
{
  "success": true,
  "following": true,
  "follower_count": "number"
}
```

#### DELETE `/api/users/{user_id}/follow`
Headers: `Authorization: Bearer <token>`
```json
// Response  
{
  "success": true,
  "following": false,
  "follower_count": "number"
}
```

#### GET `/api/users/{user_id}/followers`
Query Parameters: `page`, `limit`
```json
// Response
{
  "followers": [{
    "id": "uuid",
    "username": "string",
    "display_name": "string", 
    "avatar_url": "string",
    "follower_count": "number",
    "followed_at": "ISO timestamp"
  }],
  "pagination": {/* pagination object */}
}
```

#### GET `/api/users/{user_id}/following`
Same structure as followers endpoint.

#### GET `/api/users/me/following/videos`
Headers: `Authorization: Bearer <token>`
```json
// Response: Videos from followed users
{
  "videos": [/* array of video objects */],
  "pagination": {/* pagination object */}
}
```

---

## Comment System Backend

### Comment Model Structure
```json
{
  "id": "uuid",
  "video_id": "uuid", 
  "user_id": "uuid",
  "parent_comment_id": "uuid (null for top-level)",
  "content": "string (1-1000 chars)",
  "like_count": "number",
  "dislike_count": "number", 
  "reply_count": "number",
  "created_at": "ISO timestamp",
  "updated_at": "ISO timestamp",
  "edited": "boolean",
  "author": {
    "id": "uuid",
    "username": "string", 
    "display_name": "string",
    "avatar_url": "string",
    "verified": "boolean"
  },
  "user_interaction": {
    "liked": "boolean",
    "disliked": "boolean" 
  }
}
```

### Comment Endpoints

#### GET `/api/videos/{video_id}/comments`
Query Parameters:
- `page`: number (default: 1)
- `limit`: number (default: 20)
- `sort`: "newest|oldest|top" (default: newest)

```json
// Response
{
  "comments": [/* array of comment objects */],
  "pagination": {/* pagination object */}
}
```

#### POST `/api/videos/{video_id}/comments`
Headers: `Authorization: Bearer <token>`
```json
// Request
{
  "content": "string (1-1000 chars)",
  "parent_comment_id": "uuid (optional for replies)"
}

// Response: Created comment object
```

#### GET `/api/comments/{comment_id}/replies`
Query Parameters: `page`, `limit`
```json
// Response: Array of reply comments
```

#### POST `/api/comments/{comment_id}/like`  
Headers: `Authorization: Bearer <token>`
```json
// Request
{
  "action": "like|dislike|remove"
}

// Response
{
  "success": true,
  "user_action": "liked|disliked|none",
  "like_count": "number", 
  "dislike_count": "number"
}
```

#### PUT `/api/comments/{comment_id}`
Headers: `Authorization: Bearer <token>`
```json
// Request
{
  "content": "string (1-1000 chars)"
}

// Response: Updated comment object
```

#### DELETE `/api/comments/{comment_id}`
Headers: `Authorization: Bearer <token>`
```json
// Response
{
  "success": true,
  "message": "Comment deleted"
}
```

---

## Real-time Features

### WebSocket Connection
Endpoint: `wss://api.clutch.com/ws`
Headers: `Authorization: Bearer <token>` (optional)

### WebSocket Events

#### Video Live Updates
```json
// Client subscribes to video updates
{
  "type": "subscribe",
  "channel": "video:{video_id}",
  "events": ["view_count", "like_count", "comment_count"]
}

// Server sends updates
{
  "type": "video_update",
  "video_id": "uuid",
  "data": {
    "view_count": "number",
    "like_count": "number", 
    "comment_count": "number"
  }
}
```

#### Live Comments
```json
// New comment notification
{
  "type": "new_comment",
  "video_id": "uuid", 
  "comment": {/* comment object */}
}
```

#### Live Stream Support
```json
// Live stream status
{
  "type": "live_stream",
  "video_id": "uuid",
  "status": "live|offline",
  "viewer_count": "number"
}
```

---

## File Storage & CDN

### Video Upload Flow
1. **Request Upload URL**: `POST /api/upload/video/request`
2. **Direct Upload**: Client uploads to S3/CDN with presigned URL
3. **Processing Webhook**: CDN triggers processing pipeline
4. **Transcode Video**: Multiple quality variants generated
5. **Update Database**: Video status updated to "ready"

### Upload Endpoints

#### POST `/api/upload/video/request`
Headers: `Authorization: Bearer <token>`
```json
// Request
{
  "filename": "string",
  "file_size": "number (bytes)",
  "content_type": "string (video/mp4, etc.)",
  "duration": "number (optional, seconds)"
}

// Response
{
  "upload_url": "string (presigned S3 URL)",
  "video_id": "uuid",
  "expires_at": "ISO timestamp"
}
```

#### POST `/api/upload/thumbnail/request`  
```json
// Similar structure for thumbnail uploads
```

### Video Processing Webhook
Endpoint: `POST /api/webhooks/video-processed`
```json
// Payload from video processing service
{
  "video_id": "uuid",
  "status": "success|error",
  "quality_variants": {
    "2160p": "string (CDN URL)",
    "1440p": "string (CDN URL)",
    "1080p": "string (CDN URL)", 
    "720p": "string (CDN URL)",
    "480p": "string (CDN URL)"
  },
  "duration": "number (seconds)",
  "thumbnail_url": "string",
  "error_message": "string (if status=error)"
}
```

---

## Database Schema

### MongoDB Collections

#### Users Collection
```json
{
  "_id": "ObjectId",
  "id": "uuid (indexed, unique)",
  "username": "string (indexed, unique)",
  "email": "string (indexed, unique)", 
  "display_name": "string",
  "password_hash": "string (bcrypt)",
  "avatar_url": "string",
  "bio": "string",
  "verified": "boolean (default: false)",
  "role": "string (default: 'user')",
  "follower_count": "number (default: 0)",
  "following_count": "number (default: 0)",
  "total_views": "number (default: 0)",
  "total_videos": "number (default: 0)",
  "created_at": "Date",
  "updated_at": "Date",
  "last_login": "Date",
  "email_verified": "boolean (default: false)",
  "settings": {
    "notifications": {
      "email": "boolean",
      "push": "boolean", 
      "comments": "boolean",
      "followers": "boolean"
    },
    "privacy": {
      "profile_visibility": "string (public|followers|private)",
      "show_following": "boolean",
      "show_followers": "boolean"
    }
  }
}
```

#### Videos Collection
```json
{
  "_id": "ObjectId",
  "id": "uuid (indexed, unique)",
  "title": "string (text indexed)",
  "description": "string (text indexed)",
  "thumbnail_url": "string",
  "video_url": "string", 
  "duration": "number",
  "view_count": "number (default: 0)",
  "like_count": "number (default: 0)",
  "dislike_count": "number (default: 0)",
  "comment_count": "number (default: 0)",
  "author_id": "uuid (indexed)",
  "tags": ["array of strings (indexed)"],
  "category": "string (indexed)",
  "visibility": "string (indexed, default: 'public')",
  "published_at": "Date (indexed)",
  "created_at": "Date",
  "updated_at": "Date",
  "processing_status": "string (indexed)",
  "quality_variants": {
    "2160p": "string",
    "1440p": "string",
    "1080p": "string", 
    "720p": "string",
    "480p": "string"
  },
  "metrics": {
    "watch_time_minutes": "number",
    "engagement_rate": "number",
    "retention_curve": ["array"]
  }
}
```

#### Comments Collection
```json
{
  "_id": "ObjectId",
  "id": "uuid (indexed, unique)",
  "video_id": "uuid (indexed)",
  "user_id": "uuid (indexed)", 
  "parent_comment_id": "uuid (indexed, sparse)",
  "content": "string",
  "like_count": "number (default: 0)",
  "dislike_count": "number (default: 0)",
  "reply_count": "number (default: 0)", 
  "created_at": "Date (indexed)",
  "updated_at": "Date",
  "edited": "boolean (default: false)"
}
```

#### Follows Collection
```json
{
  "_id": "ObjectId", 
  "follower_id": "uuid (indexed)",
  "following_id": "uuid (indexed)",
  "created_at": "Date",
  // Compound index on [follower_id, following_id]
  // Compound index on [following_id, created_at] for follower feeds
}
```

#### Likes Collection  
```json
{
  "_id": "ObjectId",
  "user_id": "uuid (indexed)", 
  "target_id": "uuid (indexed)", // video_id or comment_id
  "target_type": "string (video|comment)",
  "action": "string (like|dislike)",
  "created_at": "Date",
  // Compound index on [user_id, target_id, target_type] (unique)
  // Compound index on [target_id, target_type, action]
}
```

### Database Indexes

#### Critical Indexes for Performance
```javascript
// Users
db.users.createIndex({ "id": 1 }, { unique: true })
db.users.createIndex({ "username": 1 }, { unique: true })
db.users.createIndex({ "email": 1 }, { unique: true })

// Videos  
db.videos.createIndex({ "id": 1 }, { unique: true })
db.videos.createIndex({ "author_id": 1, "published_at": -1 })
db.videos.createIndex({ "published_at": -1 }) // For trending
db.videos.createIndex({ "view_count": -1 }) // For popular
db.videos.createIndex({ "tags": 1 })
db.videos.createIndex({ "category": 1, "published_at": -1 })
db.videos.createIndex({ "title": "text", "description": "text" })

// Comments
db.comments.createIndex({ "video_id": 1, "created_at": -1 })
db.comments.createIndex({ "parent_comment_id": 1 }, { sparse: true })
db.comments.createIndex({ "user_id": 1, "created_at": -1 })

// Follows
db.follows.createIndex({ "follower_id": 1, "following_id": 1 }, { unique: true })
db.follows.createIndex({ "following_id": 1, "created_at": -1 })

// Likes
db.likes.createIndex({ "user_id": 1, "target_id": 1, "target_type": 1 }, { unique: true })
db.likes.createIndex({ "target_id": 1, "target_type": 1, "action": 1 })
```

---

## API Endpoints Specification

### Error Response Format
All API endpoints should return consistent error responses:
```json
{
  "success": false,
  "error": {
    "code": "string (ERROR_CODE)",
    "message": "string (human readable)",
    "details": "object (optional additional info)",
    "field_errors": {
      "field_name": ["array of error messages"]
    }
  }
}
```

### Common Error Codes
- `UNAUTHORIZED`: Missing or invalid authentication
- `FORBIDDEN`: Insufficient permissions  
- `NOT_FOUND`: Resource doesn't exist
- `VALIDATION_ERROR`: Request validation failed
- `RATE_LIMITED`: Too many requests
- `SERVER_ERROR`: Internal server error
- `CONFLICT`: Resource already exists

### Rate Limiting
Implement rate limiting for API endpoints:
- **Authentication**: 10 attempts per minute per IP
- **Video Upload**: 5 uploads per hour per user
- **Comments**: 30 comments per hour per user  
- **Likes**: 100 actions per minute per user
- **General API**: 1000 requests per hour per user

---

## Security & Validation

### Input Validation Rules
```python
# Username validation
username_pattern = r'^[a-zA-Z0-9_]{3,30}$'

# Password requirements
password_requirements = {
    'min_length': 8,
    'require_uppercase': True,
    'require_number': True, 
    'require_special': False
}

# Content validation
max_title_length = 100
max_description_length = 5000
max_comment_length = 1000
max_bio_length = 500

# File validation
allowed_video_types = ['video/mp4', 'video/webm', 'video/quicktime']
max_video_size = 2 * 1024 * 1024 * 1024  # 2GB
allowed_image_types = ['image/jpeg', 'image/png', 'image/webp']
max_image_size = 10 * 1024 * 1024  # 10MB
```

### Security Headers
```python
security_headers = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY', 
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
}
```

### JWT Configuration
```python
jwt_config = {
    'algorithm': 'HS256',
    'access_token_expire_minutes': 15,
    'refresh_token_expire_days': 7,
    'secret_key': 'environment_variable', # Must be in environment
    'issuer': 'clutch-platform',
    'audience': 'clutch-users'
}
```

---

## Performance Optimization

### Caching Strategy
```python
cache_config = {
    'video_metadata': '1 hour',  # Video info that rarely changes
    'user_profiles': '30 minutes',  # User profile data
    'follower_counts': '5 minutes',  # Social metrics
    'trending_videos': '15 minutes',  # Trending algorithms
    'video_comments': '2 minutes',  # Comment threads
}
```

### Database Optimization
- Use aggregation pipelines for complex queries
- Implement proper pagination with cursor-based pagination for large datasets
- Use projection to limit returned fields
- Implement database connection pooling
- Set up read replicas for read-heavy operations

### CDN Configuration
- Set appropriate cache headers for video content
- Use progressive download for video streaming
- Implement adaptive bitrate streaming
- Configure global edge locations
- Set up video thumbnail generation

---

## Deployment Configuration

### Environment Variables
```bash
# Database
MONGO_URL=mongodb://localhost:27017/clutch_platform
MONGO_DB_NAME=clutch_platform

# JWT Configuration  
JWT_SECRET_KEY=your_super_secret_key_here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7

# File Storage
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=clutch-platform-videos
AWS_REGION=us-east-1
CDN_BASE_URL=https://cdn.clutch.com

# Redis (for caching and rate limiting)
REDIS_URL=redis://localhost:6379

# Email Service (for verification emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@clutch.com
SMTP_PASSWORD=your_email_password

# Video Processing
VIDEO_PROCESSING_WEBHOOK_SECRET=your_webhook_secret
FFMPEG_PATH=/usr/bin/ffmpeg

# Application
DEBUG=false
CORS_ORIGINS=https://clutch.com,https://www.clutch.com
API_VERSION=v1
```

### Docker Configuration
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
```

### FastAPI Application Structure
```python
# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, videos, users, comments
import os

app = FastAPI(title="CLUTCH Platform API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(videos.router, prefix="/api/videos", tags=["videos"]) 
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(comments.router, prefix="/api/comments", tags=["comments"])

@app.get("/api/")
async def root():
    return {"message": "Hello World"}
```

This comprehensive backend integration guide provides all the necessary information to implement a fully functional backend for the CLUTCH video streaming platform, with proper authentication, video management, social features, and performance optimization.