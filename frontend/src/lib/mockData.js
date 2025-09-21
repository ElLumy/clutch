// Mock data for CLUTCH platform - matches API contracts exactly

export const mockVideos = [
  {
    id: "1",
    title: "Epic Gaming Montage - Best Plays 2024",
    status: "published",
    visibility: "public",
    author: {
      id: "user1",
      username: "ProGamer_2024",
      displayName: "Pro Gamer"
    },
    thumbnailUrl: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400&h=225",
    duration: 485,
    viewCount: 125400,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    publishedAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "2", 
    title: "How to Master Advanced Techniques in 10 Minutes",
    status: "published",
    visibility: "public",
    author: {
      id: "user2",
      username: "TechMaster_Pro",
      displayName: "Tech Master"
    },
    thumbnailUrl: "https://images.pexels.com/photos/735911/pexels-photo-735911.jpeg?auto=compress&cs=tinysrgb&w=400&h=225",
    duration: 612,
    viewCount: 89300,
    createdAt: "2024-01-14T15:45:00Z",
    updatedAt: "2024-01-14T15:45:00Z",
    publishedAt: "2024-01-14T15:45:00Z"
  },
  {
    id: "3",
    title: "LIVE: Championship Finals - Don't Miss Out!",
    status: "published", 
    visibility: "public",
    author: {
      id: "user3",
      username: "ESports_Central",
      displayName: "ESports Central"
    },
    thumbnailUrl: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=400&h=225",
    duration: 0, // Live stream
    viewCount: 234500,
    createdAt: "2024-01-16T20:00:00Z",
    updatedAt: "2024-01-16T20:00:00Z",
    publishedAt: "2024-01-16T20:00:00Z",
    isLive: true
  },
  {
    id: "4",
    title: "Beginner's Guide to Competitive Gaming",
    status: "published",
    visibility: "public", 
    author: {
      id: "user4",
      username: "GameGuide_Official",
      displayName: "Game Guide Official"
    },
    thumbnailUrl: "https://images.pexels.com/photos/1337247/pexels-photo-1337247.jpeg?auto=compress&cs=tinysrgb&w=400&h=225",
    duration: 892,
    viewCount: 56700,
    createdAt: "2024-01-13T12:20:00Z",
    updatedAt: "2024-01-13T12:20:00Z",
    publishedAt: "2024-01-13T12:20:00Z"
  },
  {
    id: "5",
    title: "Insane Clutch Moments That Will Blow Your Mind",
    status: "published",
    visibility: "public",
    author: {
      id: "user5", 
      username: "ClutchMoments",
      displayName: "Clutch Moments"
    },
    thumbnailUrl: "https://images.pexels.com/photos/275033/pexels-photo-275033.jpeg?auto=compress&cs=tinysrgb&w=400&h=225",
    duration: 367,
    viewCount: 178900,
    createdAt: "2024-01-12T18:15:00Z",
    updatedAt: "2024-01-12T18:15:00Z", 
    publishedAt: "2024-01-12T18:15:00Z"
  },
  {
    id: "6",
    title: "Breaking Down the Meta: What Changed This Patch",
    status: "published",
    visibility: "public",
    author: {
      id: "user6",
      username: "MetaAnalysis",
      displayName: "Meta Analysis"
    },
    thumbnailUrl: "https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg?auto=compress&cs=tinysrgb&w=400&h=225",
    duration: 756,
    viewCount: 92400,
    createdAt: "2024-01-11T14:30:00Z",
    updatedAt: "2024-01-11T14:30:00Z",
    publishedAt: "2024-01-11T14:30:00Z"
  }
];

// Generate more mock videos to fill the grid
const generateMoreVideos = () => {
  const titles = [
    "Ultimate Gaming Setup Tour 2024",
    "React Like a Pro: Advanced Strategies", 
    "The Psychology of Winning",
    "Hardware Review: Is This Worth It?",
    "Community Highlights - January Edition",
    "Speed Run World Record Attempt",
    "Behind the Scenes: Tournament Prep",
    "Coaching Session: Improve Your Game",
    "New Update Changes Everything",
    "Fan Art Showcase and Reactions"
  ];
  
  const usernames = [
    "StreamerElite", "GamingLegend", "CompetitiveEdge", "ProPlayer_Official",
    "ContentCreator_Pro", "ESportsAnalyst", "GameReviewer", "ClutchGaming",
    "TournamentCaster", "CommunitySpotlight"
  ];

  const thumbnails = [
    "https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=400&h=225",
    "https://images.pexels.com/photos/159613/ghettoblaster-radio-recorder-boombox-159613.jpeg?auto=compress&cs=tinysrgb&w=400&h=225",
    "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=400&h=225",
    "https://images.pexels.com/photos/290595/pexels-photo-290595.jpeg?auto=compress&cs=tinysrgb&w=400&h=225"
  ];

  const additionalVideos = [];
  for (let i = 7; i <= 36; i++) {
    const titleIndex = (i - 7) % titles.length;
    const usernameIndex = (i - 7) % usernames.length;
    const thumbnailIndex = (i - 7) % thumbnails.length;
    
    additionalVideos.push({
      id: i.toString(),
      title: titles[titleIndex],
      status: "published",
      visibility: "public",
      author: {
        id: `user${i}`,
        username: usernames[usernameIndex],
        displayName: usernames[usernameIndex].replace('_', ' ')
      },
      thumbnailUrl: thumbnails[thumbnailIndex],
      duration: Math.floor(Math.random() * 900) + 120, // 2-17 minutes
      viewCount: Math.floor(Math.random() * 500000) + 1000,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    });
  }
  
  return additionalVideos;
};

export const allMockVideos = [...mockVideos, ...generateMoreVideos()];

export const mockUser = {
  user: {
    id: "current_user_1",
    username: "clutch_player_2024", 
    email: "player@clutch.com",
    created_at: "2023-12-01T10:00:00Z",
    updated_at: "2024-01-16T14:30:00Z"
  },
  profile: {
    user_id: "current_user_1",
    display_name: "Clutch Player",
    avatar_url: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
    bio: "Gaming enthusiast and content creator",
    created_at: "2023-12-01T10:00:00Z", 
    updated_at: "2024-01-10T16:20:00Z"
  }
};

export const filterCategories = [
  { id: "all", label: "All", count: allMockVideos.length },
  { id: "trending", label: "Trending", count: 12 },
  { id: "gaming", label: "Gaming", count: 24 },
  { id: "esports", label: "Esports", count: 8 },
  { id: "tutorials", label: "Tutorials", count: 6 },
  { id: "live", label: "Live", count: 3 }
];