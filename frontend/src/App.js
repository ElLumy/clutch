import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Layout/Sidebar";
import Header from "./components/Layout/Header";
import VideoGrid from "./components/Video/VideoGrid";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#010101]">
      <Sidebar />
      <Header />
      <VideoGrid />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
