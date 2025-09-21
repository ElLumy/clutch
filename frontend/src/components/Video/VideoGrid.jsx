import React, { useState, useEffect, useCallback } from 'react';
import { Play, Clock, Eye, Heart, MessageCircle } from 'lucide-react';
import { dataProvider, filterCategories } from '../../lib/dataProvider';

const VideoGrid = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // Load initial videos
  useEffect(() => {
    loadVideos(1, activeFilter);
  }, [activeFilter]);

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight * 0.8 &&
        !loadingMore &&
        hasMore
      ) {
        loadMoreVideos();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore, page]);

  const loadVideos = async (pageNum = 1, filter = 'all') => {
    try {
      setLoading(pageNum === 1);
      
      let response;
      if (filter === 'trending' || filter === 'all') {
        response = await dataProvider.videos.getPopularVideos(24);
      } else {
        // For other filters, use regular video fetch (in real app, would filter by category)
        response = await dataProvider.videos.getVideos({ page: pageNum, pageSize: 24 });
      }

      if (pageNum === 1) {
        setVideos(response.videos);
        
        // Track page view
        dataProvider.analytics.trackEvent('page_view', {
          page: '/',
          filter: filter
        });
      } else {
        setVideos(prev => [...prev, ...response.videos]);
      }

      setHasMore(response.pagination.page < response.pagination.totalPages);
      setPage(pageNum);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreVideos = useCallback(() => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      loadVideos(page + 1, activeFilter);
    }
  }, [loadingMore, hasMore, page, activeFilter]);

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    setPage(1);
    setHasMore(true);
  };

  const formatDuration = (seconds) => {
    if (seconds === 0) return 'LIVE';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViewCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}mo ago`;
  };

  const handleVideoClick = (video) => {
    // Track video impression
    dataProvider.analytics.trackEvent('video_view_impression', {
      video_id: video.id,
      video_title: video.title,
      author: video.author.username
    });
    
    // Navigate to video player page
    window.location.href = `/watch?v=${video.id}`;
  };

  if (loading) {
    return (
      <div className="pt-20 pl-80">
        <div className="max-w-[1680px] mx-auto px-6">
          <VideoGridSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pl-80 min-h-screen bg-[#010101]">
      <div className="max-w-[1680px] mx-auto px-6">
        {/* Filter Pills */}
        <div className="mb-8 flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {filterCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleFilterChange(category.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                activeFilter === category.id
                  ? 'bg-[#2D0F93] text-white shadow-[0_0_20px_rgba(45,15,147,0.4)]'
                  : 'bg-[#070707] text-[#8A8A8A] border border-transparent hover:border-[#2D0F93] hover:text-[#5A4FCF]'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Video Grid - 3 videos per row with larger thumbnails */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={() => handleVideoClick(video)}
              formatDuration={formatDuration}
              formatViewCount={formatViewCount}
              formatTimeAgo={formatTimeAgo}
            />
          ))}

          {/* Loading More Skeleton */}
          {loadingMore && (
            <>
              {Array.from({ length: 6 }).map((_, index) => (
                <VideoCardSkeleton key={`skeleton-${index}`} />
              ))}
            </>
          )}
        </div>

        {/* Load More Button (fallback for infinite scroll) */}
        {!loadingMore && hasMore && (
          <div className="text-center pb-8">
            <button
              onClick={loadMoreVideos}
              className="px-6 py-3 bg-[#070707] text-[#F2F2F2] border border-[#1A1A1A] rounded-lg hover:bg-[#2D0F93] hover:border-[#2D0F93] hover:shadow-[0_0_20px_rgba(45,15,147,0.4)] transition-all duration-150 font-medium"
            >
              Load More Videos
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Video Card Component with larger design and hover effects
const VideoCard = ({ video, onClick, formatDuration, formatViewCount, formatTimeAgo }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Generate random engagement numbers for demo
  const likes = Math.floor(Math.random() * 10000) + 500;
  const comments = Math.floor(Math.random() * 500) + 20;

  return (
    <div className="group cursor-pointer">
      {/* Thumbnail - Large with subtle zoom on hover */}
      <div 
        onClick={onClick}
        className="relative bg-[#070707] rounded-xl overflow-hidden mb-4 transition-all duration-300" 
        style={{ aspectRatio: '16/9' }}
      >
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-[#070707] animate-pulse" />
        )}
        
        {!imageError ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-[#070707] flex items-center justify-center">
            <Play size={48} className="text-[#8A8A8A]" />
          </div>
        )}

        {/* Duration or Live Badge */}
        <div className="absolute bottom-3 right-3">
          {video.isLive ? (
            <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-md shadow-lg">
              LIVE
            </span>
          ) : (
            <span className="px-2 py-1 bg-black bg-opacity-80 text-[#F2F2F2] text-sm font-medium rounded">
              {formatDuration(video.duration)}
            </span>
          )}
        </div>

        {/* White Gradient Border on Hover */}
        <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-white group-hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all duration-300 pointer-events-none" />
      </div>

      {/* Video Info */}
      <div className="space-y-3">
        {/* Title */}
        <h3 className="text-[#F2F2F2] font-semibold text-lg leading-tight line-clamp-2 group-hover:text-[#5A4FCF] transition-colors duration-150">
          {video.title}
        </h3>

        {/* Channel Info */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#2D0F93] to-[#4D2FC3] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">
              {video.author.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[#F2F2F2] text-sm font-medium truncate group-hover:text-[#5A4FCF] transition-colors duration-150">
              {video.author.username}
            </p>
            <div className="flex items-center space-x-4 text-[#2D0F93] text-sm mt-1">
              <div className="flex items-center space-x-1">
                <Eye size={14} />
                <span>{formatViewCount(video.viewCount)} views</span>
              </div>
              <div className="flex items-center space-x-1 text-[#8A8A8A]">
                <Heart 
                  size={14} 
                  className="text-[#8A8A8A]" 
                />
                <span>{formatViewCount(likes)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Engagement Row - Only timestamp now */}
        <div className="flex items-center justify-end pt-2">
          <span className="text-[#8A8A8A] text-sm">
            {formatTimeAgo(video.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

// Skeleton Components
const VideoGridSkeleton = () => (
  <div className="grid grid-cols-3 gap-6">
    {Array.from({ length: 9 }).map((_, index) => (
      <VideoCardSkeleton key={index} />
    ))}
  </div>
);

const VideoCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-[#070707] rounded-xl mb-4" style={{ aspectRatio: '16/9' }} />
    <div className="space-y-3">
      <div className="h-5 bg-[#070707] rounded w-4/5" />
      <div className="h-5 bg-[#070707] rounded w-3/5" />
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-[#070707] rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-[#070707] rounded w-24" />
          <div className="h-3 bg-[#070707] rounded w-32" />
        </div>
      </div>
      <div className="flex justify-between items-center pt-2">
        <div className="flex space-x-4">
          <div className="h-4 bg-[#070707] rounded w-12" />
          <div className="h-4 bg-[#070707] rounded w-12" />
        </div>
        <div className="h-3 bg-[#070707] rounded w-16" />
      </div>
    </div>
  </div>
);

export default VideoGrid;