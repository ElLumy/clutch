import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Settings, 
  Maximize, 
  ThumbsUp, 
  ThumbsDown, 
  Share, 
  UserPlus,
  MessageCircle,
  Clock,
  Eye
} from 'lucide-react';
import { dataProvider } from '../../lib/dataProvider';

const VideoPlayer = ({ videoId }) => {
  // Video player state
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState('1080p');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Video data and engagement state
  const [video, setVideo] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [authPromptType, setAuthPromptType] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    loadVideoData();
    checkAuthState();
  }, [videoId]);

  useEffect(() => {
    const handleTimeUpdate = () => {
      if (videoRef.current) {
        setCurrentTime(videoRef.current.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (videoRef.current) {
        setDuration(videoRef.current.duration);
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      const video = videoRef.current;
      if (video) {
        // Force remove any browser controls
        video.controls = false;
        video.setAttribute('controls', 'false');
        if (document.fullscreenElement) {
          // Hide browser UI in fullscreen
          video.style.outline = 'none';
          video.style.border = 'none';
        }
      }
    };

    const video = videoRef.current;
    if (video) {
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('loadeddata', handleLoadedMetadata);
      video.addEventListener('canplay', handleLoadedMetadata);
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.addEventListener('msfullscreenchange', handleFullscreenChange);
      
      // Ensure video attributes are set
      video.preload = 'metadata';
      
      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('loadeddata', handleLoadedMetadata);
        video.removeEventListener('canplay', handleLoadedMetadata);
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.removeEventListener('msfullscreenchange', handleFullscreenChange);
      };
    }
  }, [video]); // Add video dependency

  const loadVideoData = async () => {
    try {
      // Mock video data - in real app, fetch by videoId
      const mockVideo = {
        id: videoId,
        title: "Hardware Review: Is This Worth It? - RTX 4090 vs RTX 4080 Comparison",
        thumbnailUrl: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // Sample video
        duration: 894,
        viewCount: 234567,
        likeCount: 12400,
        dislikeCount: 890,
        author: {
          id: "user1",
          username: "ProGamer_2024",
          displayName: "Pro Gamer",
          followerCount: 125000,
          avatarUrl: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150"
        },
        description: `🎮 In today's video, we're diving deep into the ultimate graphics card showdown! I've got my hands on both the RTX 4090 and RTX 4080, and we're putting them through their paces in the latest AAA games.

🔥 What we'll cover:
• 4K Gaming Performance Comparison
• Ray Tracing Benchmarks
• Power Consumption Analysis
• Value for Money Discussion
• Which one should YOU buy?

⚡ Timestamps:
0:00 - Introduction
2:15 - Unboxing & First Impressions
5:30 - Gaming Benchmarks Begin
12:45 - Ray Tracing Tests
18:20 - Power & Temperature Analysis
22:10 - Final Verdict

💡 My Setup:
• CPU: Intel i9-13900K
• RAM: 32GB DDR5-6000
• PSU: 1000W 80+ Gold
• Monitor: 4K 144Hz OLED

Thanks for watching! Don't forget to like and follow for more tech content!

#RTX4090 #RTX4080 #Gaming #TechReview #NVIDIA`,
        publishedAt: "2024-01-15T10:30:00Z",
        createdAt: "2024-01-15T10:30:00Z"
      };

      // Mock comments
      const mockComments = [
        {
          id: 1,
          author: {
            username: "GamerElite",
            avatarUrl: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"
          },
          content: "Great comparison! The RTX 4090 is definitely overkill for most people, but if you have the budget, why not? 🔥",
          likeCount: 45,
          publishedAt: "2024-01-15T11:45:00Z",
          replies: []
        },
        {
          id: 2,
          author: {
            username: "TechNinja",
            avatarUrl: "https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=100"
          },
          content: "The power consumption difference is insane! My electricity bill would not be happy with a 4090 😅",
          likeCount: 23,
          publishedAt: "2024-01-15T12:20:00Z",
          replies: [
            {
              id: 21,
              author: {
                username: "ProGamer_2024",
                avatarUrl: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100"
              },
              content: "Haha yeah, it's definitely a power hungry beast! But the performance is worth it if you're doing 4K gaming.",
              likeCount: 12,
              publishedAt: "2024-01-15T13:10:00Z"
            }
          ]
        },
        {
          id: 3,
          author: {
            username: "BudgetGamer",
            avatarUrl: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100"
          },
          content: "Still rocking my GTX 1060 😂 Maybe one day I'll upgrade to something from this decade",
          likeCount: 67,
          publishedAt: "2024-01-15T14:05:00Z",
          replies: []
        }
      ];

      setVideo(mockVideo);
      setComments(mockComments);
    } catch (error) {
      console.error('Error loading video:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAuthState = async () => {
    try {
      const userData = await dataProvider.auth.getCurrentUser();
      setUser(userData);
    } catch (error) {
      setUser(null);
    }
  };

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

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const handleSeek = (newTime) => {
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleFullscreen = () => {
    const videoContainer = videoRef.current?.parentElement;
    if (videoContainer) {
      if (!document.fullscreenElement) {
        if (videoContainer.requestFullscreen) {
          videoContainer.requestFullscreen();
        } else if (videoContainer.webkitRequestFullscreen) {
          videoContainer.webkitRequestFullscreen();
        } else if (videoContainer.msRequestFullscreen) {
          videoContainer.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    }
  };

  const handleLike = () => {
    if (!user) {
      setAuthPromptType('like');
      setShowAuthPrompt(true);
      return;
    }
    
    if (liked) {
      setLiked(false);
    } else {
      setLiked(true);
      if (disliked) setDisliked(false);
    }
  };

  const handleDislike = () => {
    if (!user) {
      setAuthPromptType('dislike');
      setShowAuthPrompt(true);
      return;
    }
    
    if (disliked) {
      setDisliked(false);
    } else {
      setDisliked(true);
      if (liked) setLiked(false);
    }
  };

  const handleFollow = () => {
    if (!user) {
      setAuthPromptType('follow');
      setShowAuthPrompt(true);
      return;
    }
    
    setFollowed(!followed);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;
    
    const comment = {
      id: Date.now(),
      author: {
        username: user.user.username,
        avatarUrl: user.profile.avatar_url
      },
      content: newComment,
      likeCount: 0,
      publishedAt: new Date().toISOString(),
      replies: []
    };
    
    setComments([comment, ...comments]);
    setNewComment('');
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
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

  if (loading) {
    return (
      <div className="pt-20 pl-80 min-h-screen bg-[#010101] flex items-center justify-center">
        <div className="animate-pulse text-[#F2F2F2]">Loading video...</div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="pt-20 pl-80 min-h-screen bg-[#010101] flex items-center justify-center">
        <div className="text-[#F2F2F2]">Video not found</div>
      </div>
    );
  }

  return (
    <div className="pt-20 pl-80 min-h-screen bg-[#010101]">
      <div className="max-w-[1680px] mx-auto px-6 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Video Section */}
          <div className="xl:col-span-2">
            {/* Video Player */}
            <div className="relative bg-[#070707] rounded-xl overflow-hidden mb-6 group">
              <video
                ref={videoRef}
                src={video.videoUrl}
                poster={video.thumbnailUrl}
                className="w-full aspect-video object-cover"
                onClick={handlePlayPause}
                preload="metadata"
                crossOrigin="anonymous"
                controls={false}
                controlsList="nodownload nofullscreen noremoteplayback"
                disablePictureInPicture
                onLoadedMetadata={() => {
                  if (videoRef.current) {
                    setDuration(videoRef.current.duration);
                  }
                }}
                onTimeUpdate={() => {
                  if (videoRef.current) {
                    setCurrentTime(videoRef.current.currentTime);
                  }
                }}
              />
              
              {/* Custom Video Controls - Always visible in fullscreen */}
              <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
                isFullscreen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}>
                {/* Progress Bar */}
                <div className="mb-4 relative">
                  <div className="w-full h-1 bg-[#8A8A8A] bg-opacity-30 rounded-lg relative cursor-pointer"
                       onClick={(e) => {
                         const rect = e.currentTarget.getBoundingClientRect();
                         const clickX = e.clientX - rect.left;
                         const newTime = (clickX / rect.width) * (duration || 0);
                         handleSeek(newTime);
                       }}>
                    {/* Progress Track */}
                    <div 
                      className="h-full bg-[#2D0F93] rounded-lg transition-all duration-100 pointer-events-none" 
                      style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                    />
                  </div>
                  {/* Hidden range input for accessibility */}
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={(e) => handleSeek(parseFloat(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    style={{ margin: 0 }}
                  />
                </div>
                
                {/* Controls Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Play/Pause */}
                    <button
                      onClick={handlePlayPause}
                      className="text-white hover:text-[#2D0F93] transition-colors duration-200 flex items-center justify-center"
                    >
                      {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                    </button>
                    
                    {/* Next Video */}
                    <button className="text-white hover:text-[#2D0F93] transition-colors duration-200 flex items-center justify-center">
                      <SkipForward size={20} />
                    </button>
                    
                    {/* Volume */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleMuteToggle}
                        className="text-white hover:text-[#2D0F93] transition-colors duration-200 flex items-center justify-center"
                      >
                        {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                      </button>
                      <div className="relative w-16 h-1">
                        <div className="w-full h-full bg-[#8A8A8A] bg-opacity-30 rounded-lg">
                          {/* Volume Track */}
                          <div 
                            className="h-full bg-white rounded-lg transition-all duration-100" 
                            style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                          />
                          {/* Volume Handle */}
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={isMuted ? 0 : volume}
                            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                            className="absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Time Display */}
                    <span className="text-white text-sm font-medium">
                      {formatDuration(currentTime)} / {formatDuration(duration)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {/* Settings */}
                    <div className="relative flex items-center justify-center">
                      <button
                        onClick={() => {
                          setShowSettings(!showSettings);
                          setShowQualityMenu(false);
                          setShowSpeedMenu(false);
                        }}
                        className="text-white hover:text-[#2D0F93] transition-colors duration-200 flex items-center justify-center"
                      >
                        <Settings size={20} />
                      </button>
                      
                      {/* Main Settings Menu */}
                      {showSettings && !showQualityMenu && !showSpeedMenu && (
                        <div className="absolute bottom-full right-0 mb-3 bg-[#070707] border border-[#1A1A1A] rounded-lg shadow-xl py-2 z-50 min-w-48 backdrop-blur-sm">
                          <button
                            onClick={() => {
                              setShowQualityMenu(true);
                              setShowSettings(false);
                            }}
                            className="flex items-center justify-between w-full px-4 py-2 text-[#F2F2F2] hover:bg-[#0B0B0B] transition-colors duration-150"
                          >
                            <span className="text-sm font-medium">Quality</span>
                            <span className="text-[#8A8A8A] text-xs">{quality}</span>
                          </button>
                          <button
                            onClick={() => {
                              setShowSpeedMenu(true);
                              setShowSettings(false);
                            }}
                            className="flex items-center justify-between w-full px-4 py-2 text-[#F2F2F2] hover:bg-[#0B0B0B] transition-colors duration-150"
                          >
                            <span className="text-sm font-medium">Speed</span>
                            <span className="text-[#8A8A8A] text-xs">{playbackRate === 1 ? 'Normal' : `${playbackRate}x`}</span>
                          </button>
                        </div>
                      )}

                      {/* Quality Menu */}
                      {showQualityMenu && (
                        <div className="absolute bottom-full right-0 mb-3 bg-[#070707] border border-[#1A1A1A] rounded-lg shadow-xl py-2 z-50 min-w-48 backdrop-blur-sm">
                          <div className="px-4 py-2 border-b border-[#0E0E0E] flex items-center justify-between">
                            <button
                              onClick={() => {
                                setShowQualityMenu(false);
                                setShowSettings(true);
                              }}
                              className="text-[#8A8A8A] hover:text-[#F2F2F2] transition-colors duration-150"
                            >
                              ←
                            </button>
                            <span className="text-[#F2F2F2] font-medium text-sm">Quality</span>
                            <div></div>
                          </div>
                          <div className="py-1">
                            {['2160p', '1440p', '1080p', '720p', '480p'].map((q) => (
                              <button
                                key={q}
                                onClick={() => {
                                  setQuality(q);
                                  setShowQualityMenu(false);
                                  setShowSettings(false);
                                }}
                                className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-150 ${
                                  quality === q ? 'bg-[#2D0F93] text-white' : 'text-[#B9B9B9] hover:text-[#F2F2F2] hover:bg-[#0B0B0B]'
                                }`}
                              >
                                {q}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Speed Menu */}
                      {showSpeedMenu && (
                        <div className="absolute bottom-full right-0 mb-3 bg-[#070707] border border-[#1A1A1A] rounded-lg shadow-xl py-2 z-50 min-w-48 backdrop-blur-sm">
                          <div className="px-4 py-2 border-b border-[#0E0E0E] flex items-center justify-between">
                            <button
                              onClick={() => {
                                setShowSpeedMenu(false);
                                setShowSettings(true);
                              }}
                              className="text-[#8A8A8A] hover:text-[#F2F2F2] transition-colors duration-150"
                            >
                              ←
                            </button>
                            <span className="text-[#F2F2F2] font-medium text-sm">Speed</span>
                            <div></div>
                          </div>
                          <div className="py-1">
                            {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((speed) => (
                              <button
                                key={speed}
                                onClick={() => {
                                  setPlaybackRate(speed);
                                  if (videoRef.current) {
                                    videoRef.current.playbackRate = speed;
                                  }
                                  setShowSpeedMenu(false);
                                  setShowSettings(false);
                                }}
                                className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-150 ${
                                  playbackRate === speed ? 'bg-[#2D0F93] text-white' : 'text-[#B9B9B9] hover:text-[#F2F2F2] hover:bg-[#0B0B0B]'
                                }`}
                              >
                                {speed === 1 ? 'Normal' : `${speed}x`}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Fullscreen */}
                    <button
                      onClick={handleFullscreen}
                      className="text-white hover:text-[#2D0F93] transition-colors duration-200 flex items-center justify-center"
                    >
                      <Maximize size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Video Info */}
            <div className="space-y-6">
              {/* Title and Stats */}
              <div>
                <h1 className="text-[#F2F2F2] text-2xl font-bold mb-3 leading-tight">
                  {video.title}
                </h1>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center space-x-4 text-[#B9B9B9] text-sm">
                    <div className="flex items-center space-x-1">
                      <Eye size={16} />
                      <span>{formatViewCount(video.viewCount)} views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock size={16} />
                      <span>{formatTimeAgo(video.publishedAt)}</span>
                    </div>
                  </div>
                  
                  {/* Engagement Buttons */}
                  <div className="flex items-center space-x-3">
                    {/* Like/Dislike */}
                    <div className="flex items-center bg-[#070707] rounded-full border border-[#1A1A1A] overflow-hidden">
                      <button
                        onClick={handleLike}
                        className={`flex items-center space-x-2 px-4 py-2 transition-colors duration-200 ${
                          liked ? 'text-[#2D0F93] bg-[#2D0F93] bg-opacity-10' : 'text-[#F2F2F2] hover:bg-[#0B0B0B]'
                        }`}
                      >
                        <ThumbsUp size={18} />
                        <span className="text-sm font-medium">{formatViewCount(video.likeCount + (liked ? 1 : 0))}</span>
                      </button>
                      <div className="w-px h-6 bg-[#1A1A1A]"></div>
                      <button
                        onClick={handleDislike}
                        className={`flex items-center space-x-2 px-4 py-2 transition-colors duration-200 ${
                          disliked ? 'text-[#2D0F93] bg-[#2D0F93] bg-opacity-10' : 'text-[#F2F2F2] hover:bg-[#0B0B0B]'
                        }`}
                      >
                        <ThumbsDown size={18} />
                        <span className="text-sm font-medium">{formatViewCount(video.dislikeCount + (disliked ? 1 : 0))}</span>
                      </button>
                    </div>
                    
                    {/* Share Button */}
                    <button className="flex items-center space-x-2 px-4 py-2 bg-[#070707] border border-[#1A1A1A] rounded-full text-[#F2F2F2] hover:bg-[#0B0B0B] hover:border-[#2D0F93] transition-all duration-200">
                      <Share size={18} />
                      <span className="text-sm font-medium">Share</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Channel Info */}
              <div className="flex items-center justify-between p-4 bg-[#070707] rounded-xl border border-[#1A1A1A]">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={video.author.avatarUrl}
                      alt={video.author.displayName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-[#F2F2F2] font-semibold text-lg">
                      {video.author.displayName}
                    </h3>
                    <p className="text-[#8A8A8A] text-sm">
                      {formatViewCount(video.author.followerCount)} followers
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={handleFollow}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                    followed
                      ? 'bg-[#0B0B0B] border border-[#1A1A1A] text-[#F2F2F2] hover:bg-[#070707]'
                      : 'bg-[#2D0F93] text-white hover:bg-[#3D1FB3] hover:shadow-[0_0_20px_rgba(45,15,147,0.4)]'
                  }`}
                >
                  <UserPlus size={18} />
                  <span>{followed ? 'Following' : 'Follow'}</span>
                </button>
              </div>
              
              {/* Description */}
              <div className="bg-[#070707] rounded-xl border border-[#1A1A1A] p-6">
                <h4 className="text-[#F2F2F2] font-semibold mb-4">Description</h4>
                <div className="text-[#B9B9B9] text-sm leading-relaxed whitespace-pre-line">
                  {video.description}
                </div>
              </div>
              
              {/* Comments Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <h4 className="text-[#F2F2F2] font-semibold text-lg">
                    {comments.length} Comments
                  </h4>
                </div>
                
                {/* Comment Input */}
                {user ? (
                  <form onSubmit={handleCommentSubmit} className="space-y-4">
                    <div className="flex space-x-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                        <img
                          src={user.profile.avatar_url}
                          alt={user.profile.display_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a comment..."
                          rows={3}
                          className="w-full bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg px-4 py-3 text-[#F2F2F2] placeholder-[#8A8A8A] focus:border-[#2D0F93] focus:outline-none resize-none transition-colors duration-200"
                        />
                        <div className="flex justify-end mt-3 space-x-3">
                          <button
                            type="button"
                            onClick={() => setNewComment('')}
                            className="px-4 py-2 text-[#8A8A8A] hover:text-[#F2F2F2] transition-colors duration-200"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={!newComment.trim()}
                            className="px-6 py-2 bg-[#2D0F93] text-white rounded-full font-medium hover:bg-[#3D1FB3] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                          >
                            Comment
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-8 bg-[#070707] rounded-xl border border-[#1A1A1A]">
                    <MessageCircle size={48} className="mx-auto mb-4 text-[#8A8A8A]" />
                    <p className="text-[#B9B9B9] mb-4">
                      Join the conversation! Log in to leave a comment.
                    </p>
                    <button
                      onClick={() => {
                        setAuthPromptType('comment');
                        setShowAuthPrompt(true);
                      }}
                      className="px-6 py-3 bg-[#2D0F93] text-white rounded-full font-medium hover:bg-[#3D1FB3] hover:shadow-[0_0_20px_rgba(45,15,147,0.4)] transition-all duration-200"
                    >
                      Sign In to Comment
                    </button>
                  </div>
                )}
                
                {/* Comments List */}
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <Comment key={comment.id} comment={comment} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar - Related Videos */}
          <div className="space-y-6">
            <h3 className="text-[#F2F2F2] font-semibold text-lg">Up Next</h3>
            <div className="space-y-4">
              {/* Related video items would go here */}
              <RelatedVideoItem />
              <RelatedVideoItem />
              <RelatedVideoItem />
              <RelatedVideoItem />
              <RelatedVideoItem />
            </div>
          </div>
        </div>
      </div>
      
      {/* Auth Prompt Modal */}
      {showAuthPrompt && (
        <AuthPromptModal
          type={authPromptType}
          onClose={() => setShowAuthPrompt(false)}
        />
      )}
    </div>
  );
};

// Comment Component
const Comment = ({ comment }) => {
  const [showReplies, setShowReplies] = useState(false);
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
    <div className="space-y-4">
      <div className="flex space-x-4">
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          <img
            src={comment.author.avatarUrl}
            alt={comment.author.username}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-[#F2F2F2] font-medium text-sm">
              @{comment.author.username}
            </span>
            <span className="text-[#8A8A8A] text-xs">
              {new Date(comment.publishedAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-[#B9B9B9] text-sm leading-relaxed mb-3">
            {comment.content}
          </p>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleLike}
              className={`flex items-center space-x-1 transition-colors duration-200 ${
                liked 
                  ? 'text-[#2D0F93]' 
                  : 'text-[#8A8A8A] hover:text-[#2D0F93]'
              }`}
            >
              <ThumbsUp size={14} className={liked ? 'fill-current' : ''} />
              <span className="text-xs">{likeCount}</span>
            </button>
            <button className="flex items-center space-x-1 text-[#8A8A8A] hover:text-[#F2F2F2] transition-colors duration-200">
              <ThumbsDown size={14} />
            </button>
            <button className="text-[#8A8A8A] hover:text-[#F2F2F2] text-xs transition-colors duration-200">
              Reply
            </button>
            {comment.replies && comment.replies.length > 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="text-[#2D0F93] hover:text-[#4D2FC3] text-xs font-medium transition-colors duration-200"
              >
                {showReplies ? 'Hide' : 'Show'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Replies */}
      {showReplies && comment.replies && comment.replies.length > 0 && (
        <div className="ml-14 space-y-4">
          {comment.replies.map((reply) => (
            <Comment key={reply.id} comment={reply} />
          ))}
        </div>
      )}
    </div>
  );
};

// Related Video Item Component
const RelatedVideoItem = () => {
  return (
    <div className="flex space-x-3 p-3 rounded-lg hover:bg-[#070707] transition-colors duration-200 cursor-pointer group">
      <div className="relative flex-shrink-0">
        <div className="w-32 h-18 bg-[#070707] rounded-lg overflow-hidden">
          <img
            src="https://images.pexels.com/photos/735911/pexels-photo-735911.jpeg?auto=compress&cs=tinysrgb&w=200&h=113"
            alt="Related video"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <span className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 rounded">
          8:42
        </span>
      </div>
      <div className="flex-1 space-y-1">
        <h4 className="text-[#F2F2F2] text-sm font-medium line-clamp-2 group-hover:text-[#5A4FCF] transition-colors duration-200">
          Ultimate Gaming Setup Tour 2024 - My Dream Battle Station
        </h4>
        <p className="text-[#8A8A8A] text-xs">
          TechReviewer
        </p>
        <p className="text-[#8A8A8A] text-xs">
          156K views • 2 days ago
        </p>
      </div>
    </div>
  );
};

// Auth Prompt Modal Component
const AuthPromptModal = ({ type, onClose }) => {
  const getMessage = () => {
    switch (type) {
      case 'like':
        return 'like this video';
      case 'dislike':
        return 'dislike this video';
      case 'follow':
        return 'follow this channel';
      case 'comment':
        return 'leave a comment';
      default:
        return 'continue';
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-gradient-to-br from-[#0A0A0A] to-[#070707] rounded-3xl p-8 w-full max-w-md border border-[#2D0F93] border-opacity-20 shadow-[0_0_40px_rgba(45,15,147,0.15)]">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-[#2D0F93] to-[#4D2FC3] rounded-full mx-auto mb-4 flex items-center justify-center shadow-[0_0_20px_rgba(45,15,147,0.3)]">
            <UserPlus className="text-white" size={24} />
          </div>
          <h3 className="text-[#F2F2F2] text-xl font-bold mb-2">
            Join CLUTCH to {getMessage()}
          </h3>
          <p className="text-[#B9B9B9] text-sm">
            Sign up for free and unlock the full CLUTCH experience
          </p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-[#2D0F93] to-[#3D1FB3] text-white rounded-xl font-medium hover:from-[#3D1FB3] hover:to-[#4D2FC3] hover:shadow-[0_0_25px_rgba(45,15,147,0.4)] transform hover:scale-[1.02] transition-all duration-200"
          >
            Sign Up
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 bg-transparent border border-[#2D0F93] text-[#2D0F93] rounded-xl font-medium hover:bg-[#2D0F93] hover:text-white transition-all duration-200"
          >
            Log In
          </button>
        </div>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8A8A8A] hover:text-[#F2F2F2] transition-colors duration-200 text-2xl"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;