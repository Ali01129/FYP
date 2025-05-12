import React, { useRef, useState, useEffect } from "react";
import Timeline from "./Timeline";
import useGlobalStore from "../../zustand/store";
import { useNavigate } from 'react-router-dom';
import IconButton from "./IconButton";
import {
  UndoIcon,
  RedoIcon,
  AddIcon,
  SubtractIcon,
  ExpandIcon,
  PlayIcon,
  PauseIcon,
  ResetIcon,
} from "./ControlIcons";

export default function MainContent() {
  const { video,setVideoRef } = useGlobalStore();
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const videoContainerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Format time function
  const formatTime = (time) => {
    if (!time || isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Play video
  const playVideo = () => {
    videoRef.current?.play();
    setIsPlaying(true);
  };

  // Pause video
  const pauseVideo = () => {
    videoRef.current?.pause();
    setIsPlaying(false);
  };

  // Reset video
  const resetVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Undo (Go back 1 sec)
  const undoVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 1);
    }
  };

  // Redo (Go forward 1 sec)
  const redoVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + 1);
    }
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoContainerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    setVideoRef(videoRef); // Store videoRef in Zustand
  }, [setVideoRef]);
  
  // Handle fullscreen change
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  // Update time state
  useEffect(() => {
    const updateTime = () => {
      if (videoRef.current) {
        setCurrentTime(videoRef.current.currentTime);
      }
    };

    const setVideoDuration = () => {
      if (videoRef.current) {
        setDuration(videoRef.current.duration);
      }
    };

    if (videoRef.current) {
      videoRef.current.addEventListener("timeupdate", updateTime);
      videoRef.current.addEventListener("loadedmetadata", setVideoDuration);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("timeupdate", updateTime);
        videoRef.current.removeEventListener("loadedmetadata", setVideoDuration);
      }
    };
  }, []);



  // Toggle Play/Pause with Spacebar
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Space") {
        event.preventDefault(); // Prevents scrolling when spacebar is pressed
        isPlaying ? pauseVideo() : playVideo();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying]);

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = video;
    a.download = 'audalign_processed_video.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    navigate("/Upload");
  };
  

  return (
    <section className="flex flex-col flex-1 max-sm:w-full h-screen">
      <header className="flex justify-between items-center p-4">
        <h1 className="text-base font-semibold text-white">Audalign Project</h1>
        <button className="p-3 text-base font-semibold text-black bg-lime-300 rounded-lg cursor-pointer" onClick={handleDownload}>
          Export
        </button>
      </header>

      {/* Controls Above Video */}
      <div className="flex flex-none">
        <div className="flex justify-between items-center px-6 py-3 border-t border-solid border-gray-500 h-[60px] bg-black w-full">
          <div className="flex gap-4">
            <button onClick={undoVideo}>
              <IconButton icon={UndoIcon} />
            </button>
            <button onClick={redoVideo}>
              <IconButton icon={RedoIcon} />
            </button>
            <button onClick={playVideo}>
              <IconButton icon={PlayIcon} />
            </button>
            <button onClick={pauseVideo}>
              <IconButton icon={PauseIcon} />
            </button>
            <button onClick={resetVideo}>
              <IconButton icon={ResetIcon} />
            </button>
          </div>

          {/* Time Display */}
          <div className="text-sm font-semibold text-white">
            🎥 {formatTime(currentTime)} / {formatTime(duration)}
          </div>

          {/* Fullscreen Button */}
          <div className="flex gap-4">
            <IconButton icon={AddIcon} />
            <IconButton icon={SubtractIcon} />
            <button onClick={toggleFullscreen}>
              <IconButton icon={ExpandIcon} />
            </button>
          </div>
        </div>
      </div>

      {/* Video Below Controls */}
      <div
        ref={videoContainerRef}
        className={`flex flex-col flex-1 items-center justify-center p-4 ${
          isFullscreen ? "w-screen h-screen" : ""
        }`}
      >
        <div
          className={`bg-gray-500 transition-all duration-300 ${
            isFullscreen ? "w-screen h-screen" : "w-[800px] h-[300px] max-md:w-full max-md:h-[250px]"
          }`}
        >
          <video
            ref={videoRef}
            src={video}
            className="w-full h-full object-contain"
            controls={false}
          ></video>
        </div>
      </div>

      <Timeline />
    </section>
  );
}