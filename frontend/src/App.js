import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UnifiedSidebar from "./components/Layout/UnifiedSidebar";
import Header from "./components/Layout/Header";
import VideoGrid from "./components/Video/VideoGrid";
import VideoPlayer from "./components/Video/VideoPlayer";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#010101]">
      <UnifiedSidebar />
      <Header />
      <VideoGrid />
    </div>
  );
};

const VideoPlayerPage = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const videoId = urlParams.get('v') || '1'; // Get video ID from URL parameter
  
  return (
    <div className="min-h-screen bg-[#010101]">
      <UnifiedSidebar />
      <Header />
      <VideoPlayer videoId={videoId} />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watch" element={<VideoPlayerPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
