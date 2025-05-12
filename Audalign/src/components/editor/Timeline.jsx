import React, { useEffect, useRef, useState } from "react";
import useGlobalStore from "../../zustand/store";

const TimelineMarker = ({ time }) => (
  <div className="text-xs text-gray-400">{time}</div>
);

export default function Timeline() {
  const { video, videoRef, loading, setLoading } = useGlobalStore();
  const timelineRef = useRef(null);
  const hiddenVideoRef = useRef(null);
  const pointerRef = useRef(null); // Ref for the pointer to avoid re-renders
  const [frames, setFrames] = useState([]);
  const [videoDuration, setVideoDuration] = useState(0);
  const [frameWidth, setFrameWidth] = useState(50);

  // Capture frames in the background
  const captureFrames = async () => {
    if (!hiddenVideoRef.current) return;

    const video = hiddenVideoRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    setLoading(true);

    await new Promise((resolve) => {
      video.onloadedmetadata = resolve;
    });

    const duration = Math.floor(video.duration);
    setVideoDuration(duration + 1);

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const capturedFrames = [];
    for (let i = 0; i < duration; i++) {
      video.currentTime = i;

      await new Promise((resolve) =>
        video.addEventListener("seeked", resolve, { once: true })
      );

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      capturedFrames.push(canvas.toDataURL("image/png"));
    }

    setFrames(capturedFrames);
    setLoading(false);
  };

  // Load video and capture frames in the background
  useEffect(() => {
    if (video) {
      hiddenVideoRef.current.src = video;
      hiddenVideoRef.current.load();
      captureFrames();
    }
  }, [video]);

  // Smoothly update the playhead position
  useEffect(() => {
    let animationFrameId;

    const updatePointer = () => {
      if (videoRef?.current && videoDuration > 0) {
        const percentage =
          (videoRef.current.currentTime / videoRef.current.duration) * 100;
        
        if (pointerRef.current) {
          pointerRef.current.style.left = `${percentage}%`;
        }
      }
      animationFrameId = requestAnimationFrame(updatePointer);
    };

    animationFrameId = requestAnimationFrame(updatePointer);

    return () => cancelAnimationFrame(animationFrameId);
  }, [videoDuration, videoRef]);

  // Calculate frame width dynamically
  useEffect(() => {
    if (timelineRef.current && videoDuration > 0) {
      const timelineWidth = timelineRef.current.clientWidth;
      setFrameWidth(timelineWidth / videoDuration);
    }
  }, [videoDuration]);

  return (
    <section className="relative p-4 h-[150px] bg-black">
      {/* Hidden video for capturing frames */}
      <video ref={hiddenVideoRef} className="hidden" preload="metadata"></video>

      {/* Show Loading Indicator */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <p className="text-white text-lg">Loading...</p>
        </div>
      )}

      {/* Timeline Markers */}
      <div className="flex justify-between mb-2">
        {[...Array(videoDuration)].map((_, i) => (
          <TimelineMarker key={i} time={`${i}s`} />
        ))}
      </div>

      <div className="relative h-px bg-gray-400" />

      {/* Video Thumbnails */}
      <section className="relative pv-4 h-[100px] bg-black flex items-center">
        <div
          ref={timelineRef}
          className="relative flex items-center w-full overflow-hidden rounded-lg bg-yellow-400"
        >
          <div className="flex p-2 w-full">
            {frames.map((frame, index) => (
              <img
                key={index}
                src={frame}
                alt={`Frame ${index}`}
                className="h-[80px] object-cover mx-0.5"
                style={{ width: `${frameWidth}px` }} // Dynamic width
              />
            ))}
          </div>

          {/* Playhead (Pointer) */}
          <div
            ref={pointerRef}
            className="absolute top-0 bottom-0 w-[5px] bg-white"
          />
        </div>
      </section>
    </section>
  );
}