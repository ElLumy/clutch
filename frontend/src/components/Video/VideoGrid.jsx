import React, { useState, useEffect, useCallback } from 'react';
import { Play, Clock, Eye } from 'lucide-react';
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
    
    console.log('Video clicked:', video.title);
    // TODO: Navigate to video watch page
  };

  if (loading) {
    return (
      <div className="pt-20 pl-[72px]">
        <div className="max-w-[1680px] mx-auto px-6">
          <VideoGridSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pl-[72px] min-h-screen bg-[#010101]">
      <div className="max-w-[1680px] mx-auto px-6">
        {/* Filter Pills */}
        <div className="mb-6 flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {filterCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleFilterChange(category.id)}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                activeFilter === category.id
                  ? 'bg-[#070707] text-[#F2F2F2] border border-[#F2F2F2] border-opacity-40 shadow-[0_0_12px_rgba(242,242,242,0.06)]'
                  : 'bg-[#070707] text-[#8A8A8A] border border-transparent hover:border-[#F2F2F2] hover:border-opacity-40 hover:text-[#F2F2F2]'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Video Grid */}
        <div className="grid gap-4 mb-8" style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          columnGap: '16px',
          rowGap: '20px'
        }}>
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
              {Array.from({ length: 8 }).map((_, index) => (
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
              className="px-6 py-3 bg-[#070707] text-[#F2F2F2] border border-[#1A1A1A] rounded-lg hover:bg-[#0B0B0B] hover:shadow-[0_0_12px_rgba(242,242,242,0.06)] transition-all duration-150 font-medium"
            >
              Load More Videos
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Video Card Component
const VideoCard = ({ video, onClick, formatDuration, formatViewCount, formatTimeAgo }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer transform hover:scale-[1.02] hover:-translate-y-1 transition-all duration-150 ease-out"
    >
      {/* Thumbnail */}
      <div className="relative bg-[#070707] rounded-xl overflow-hidden mb-3" style={{ aspectRatio: '16/9' }}>
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-[#070707] animate-pulse" />
        )}
        
        {!imageError ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-[#070707] flex items-center justify-center">
            <Play size={32} className="text-[#8A8A8A]" />
          </div>
        )}

        {/* Duration or Live Badge */}
        <div className="absolute bottom-2 right-2">
          {video.isLive ? (
            <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
              LIVE
            </span>
          ) : (
            <span className="px-2 py-1 bg-black bg-opacity-80 text-[#F2F2F2] text-xs font-medium rounded">
              {formatDuration(video.duration)}
            </span>
          )}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-150" />
      </div>

      {/* Video Info */}
      <div className="space-y-2">
        {/* Title */}
        <h3 className="text-[#F2F2F2] font-semibold text-base leading-tight line-clamp-2 group-hover:text-opacity-90 transition-all duration-150">
          {video.title}
        </h3>

        {/* Channel Info */}
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-[#070707] rounded-full flex-shrink-0 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-[#F2F2F2] to-[#8A8A8A] flex items-center justify-center">
              <span className="text-[#070707] text-xs font-bold">
                {video.author.username.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <span className="text-[#8A8A8A] text-sm font-medium truncate">
            {video.author.username}
          </span>
        </div>

        {/* Meta Info */}
        <div className="flex items-center space-x-1 text-[#8A8A8A] text-sm">
          <div className="flex items-center space-x-1">
            <Eye size={14} />
            <span>{formatViewCount(video.viewCount)} views</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-1">
            <Clock size={14} />
            <span>{formatTimeAgo(video.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeleton Components
const VideoGridSkeleton = () => (
  <div className="grid gap-4" style={{
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    columnGap: '16px',
    rowGap: '20px'
  }}>
    {Array.from({ length: 12 }).map((_, index) => (
      <VideoCardSkeleton key={index} />
    ))}
  </div>
);

const VideoCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-[#070707] rounded-xl mb-3" style={{ aspectRatio: '16/9' }} />
    <div className="space-y-2">
      <div className="h-4 bg-[#070707] rounded w-4/5" />
      <div className="h-4 bg-[#070707] rounded w-3/5" />
      <div className="flex items-center space-x-3">
        <div className="w-6 h-6 bg-[#070707] rounded-full" />
        <div className="h-3 bg-[#070707] rounded w-20" />
      </div>
      <div className="h-3 bg-[#070707] rounded w-32" />
    </div>
  </div>
);

export default VideoGrid;