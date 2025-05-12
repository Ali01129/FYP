import React, { useRef, useState, useEffect } from 'react';
import MenuButton from '../components/MenuButton';
import { useLocation } from "react-router-dom";
import { FaPlay, FaPause, FaRedo, FaStop } from 'react-icons/fa';

const ResultPage = () => {
  const location = useLocation();
  const { videoFile } = location.state || {};

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);  // State to hold current time of the video

  useEffect(() => {
    // Reset the video on initial load if needed
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [videoFile]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && isPlaying) {
        setCurrentTime(videoRef.current.currentTime);
      }
    }, 1000);

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [isPlaying]);

  const playVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resetVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
      setIsPlaying(false);
      setCurrentTime(0); // Reset the displayed time to 00:00
    }
  };

  // Format time in mm:ss
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="min-h-screen bg-black relative flex flex-col items-center justify-center">
      {/* MENU Button */}
      <div className="absolute top-5 left-5">
        <MenuButton />
      </div>

      {/* Video Container */}
      <div className="relative bg-[#D3B8A5] rounded-lg overflow-hidden w-[90%] max-w-4xl aspect-video">
        <video
          ref={videoRef}
          src={videoFile} // Use the uploaded video URL here
          className="w-full h-full object-cover"
          controls={false} // Disable native controls for custom buttons
        ></video>

        {/* Side Controls */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-white rounded-lg flex flex-col space-y-2 p-2">
          <button onClick={playVideo} className="p-2 hover:bg-gray-100 rounded">
            <FaPlay size={24} />
          </button>
          <button onClick={pauseVideo} className="p-2 hover:bg-gray-100 rounded">
            <FaPause size={24} />
          </button>
          <button onClick={resetVideo} className="p-2 hover:bg-gray-100 rounded">
            <FaRedo size={24} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded">
            <FaStop size={24} />
          </button>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="mt-4 bg-white p-3 rounded-lg w-[90%] max-w-4xl flex items-center justify-center space-x-4">
        <span className="text-sm">{formatTime(currentTime)}</span>
        <button onClick={playVideo} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
          <FaPlay size={24} />
        </button>
        <button onClick={pauseVideo} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
          <FaPause size={24} />
        </button>
        <button onClick={resetVideo} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
          <FaRedo size={24} />
        </button>
      </div>

      {/* Sliders */}
      <div className="mt-4 w-[90%] max-w-4xl flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-lime-300 text-sm mr-10">Speed</span>
          <input type="range" className="w-full h-2 bg-lime-300 rounded-lg appearance-none" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lime-300 text-sm mr-6">Intensity</span>
          <input type="range" className="w-full h-2 bg-lime-300 rounded-lg appearance-none" />
        </div>
      </div>
    </div>
  );
};

export default ResultPage;