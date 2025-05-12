import React, { useState, useRef } from "react";

export default function Slider({ value, setValue }) {
  // const [value, setValue] = useState(50); // Default slider value
  const sliderRef = useRef(null);

  const handleDrag = (event) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const newValue = Math.min(Math.max(0, ((event.clientX - rect.left) / rect.width) * 100), 100);
    setValue(newValue);
  };

  return (
    <div className="w-full flex ">
      <div 
        ref={sliderRef}
        className="relative h-1.5 bg-white rounded-lg w-[250px] cursor-pointer"
        onMouseDown={(e) => {
          handleDrag(e);
          document.addEventListener("mousemove", handleDrag);
          document.addEventListener("mouseup", () => {
            document.removeEventListener("mousemove", handleDrag);
          }, { once: true });
        }}
      >
        {/* Filled bar */}
        <div className="h-full bg-lime-300 rounded-lg" style={{ width: `${value}%` }} />

        {/* Draggable Knob - Centered */}
        <div 
          className="absolute top-1/2 w-4 h-4 bg-white rounded-full border border-gray-400 shadow-md cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${value}%` }}
        />
      </div>
    </div>
  );
}