import React, { useState } from "react";
import TabGroup from "./TabGroup";
import Slider from "./Slider";
import useGlobalStore from "../../zustand/store";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const tabs = [
  { id: "all", label: "All", isActive: true },
  { id: "videos", label: "Videos" },
  { id: "audio", label: "Audio" },
];

export default function AudioControls() {
  const { volume, setVolume, reverb, setReverb, pitch, setPitch, noise, setNoise,navPressed,videoName,audio,setAudio,video,setVideo,revertVideo } = useGlobalStore();

  const navigate = useNavigate();

  const controls = [
    { id: "volume", label: "Volume", value: volume, setValue: setVolume },
    { id: "reverb", label: "Reverb", value: reverb, setValue: setReverb },
    { id: "pitch", label: "Pitch", value: pitch, setValue: setPitch },
    { id: "noise", label: "Noise reduction", value: noise, setValue: setNoise },
  ];
  const [caLoading, setcaLoading] = useState(false);
  const [sLoading, setsLoading] = useState(false);

  //handle audio upload
  const handleUploadAudio = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.mp3, .wav'; // only accept mp3 and wav files
    input.style.display = 'none';
  
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        // setAudio(URL.createObjectURL(file));
        setAudio(file);
        console.log('Selected audio file:', file.name);
        // You can upload the file here using FormData or other methods
      }
    };
  
    document.body.appendChild(input);
    input.click();
  
    // Clean up the input after use
    input.remove();
  };


  //calling custom audio api
  const sendAudio = async () => {
    setcaLoading(true);
    const response = await fetch(video);
    const blob = await response.blob();
    const file = new File([blob], "video.mp4", { type: "video/mp4" });
    if (!file || !audio) {
      alert("Video or audio file is missing");
      return;
    }
  
    const formData = new FormData();
    formData.append("video", file);
    formData.append("audio", audio);
  
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/uploadWithAudio",
        formData,
        {
          responseType: "blob",
          headers: { "Content-Type": "multipart/form-data" }
        }
      );
  
      const videoBlob = new Blob([response.data], { type: "video/mp4" });
      const videoUrl = URL.createObjectURL(videoBlob);
  
      setVideo(videoUrl);
  
      // Reload the page after a short delay to ensure state is updated
      setTimeout(() => {
        navigate("/Editor");
      }, 500);
      setcaLoading(false);
      setAudio(null);
  
    } catch (error) {
      if (error.response?.data) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const err = JSON.parse(reader.result);
            alert(`Error: ${err.error}`);
          } catch {
            alert("Error parsing server response.");
          }
        };
        reader.readAsText(error.response.data);
        setcaLoading(false);
      } else {
        alert("Upload failed: " + error.message);
        setcaLoading(false);
      }
    }
  };  

  const Revert = () => {
    setVideo(revertVideo);
    setVolume(50);
    setReverb(50);
    setPitch(50);
    setNoise(50);
    setTimeout(() => {
      navigate("/Editor");
    }, 500);
  }
  
  //calling slider api
  const handleSubmitSliders=async () => {
    setsLoading(true);
    const response = await fetch(video);
    const blob = await response.blob();
    const file = new File([blob], "video.mp4", { type: "video/mp4" });
    if (!file) {
      alert("Video or audio file is missing");
      return;
    }
    const formData = new FormData();
    formData.append("video", file);
    formData.append("volume", volume);
    formData.append("pitch", pitch);
    formData.append("reverb", reverb);
    formData.append("noise_reduction", noise);
    try {
      const response = await axios.post("http://127.0.0.1:5000/augmentSound", formData, {
        responseType: "blob",
        headers: { "Content-Type": "multipart/form-data" }
      });

      const videoURL = URL.createObjectURL(response.data);
      setVideo(videoURL);

      setTimeout(() => {
        navigate("/Editor");
      }, 1000);
      setsLoading(false);
    } catch (error) {
      if (error.response && error.response.data) {
        const reader = new FileReader();
        reader.onload = () => {
          const err = JSON.parse(reader.result);
          alert(`Error: ${err.error}`);
        };
        reader.readAsText(error.response.data);
        setsLoading(false);
      } else {
        console.error("Unexpected error:", error);
        alert("An unexpected error occurred.");
        setsLoading(false);
      }
    }
  };

  return (
    <section className="flex flex-col p-4 bg-zinc-700 w-[300px] max-sm:hidden max-sm:absolute max-sm:w-full max-sm:z-[1]">
      {/* Show "Import Media" button when navPressed is "Media" or "Audio" */}
      {(navPressed === "Media") && (
        <div className="w-full">
        <button
          className={`w-full p-3 mb-4 text-base font-semibold text-center rounded-lg cursor-pointer 
            ${videoName ? "bg-lime-200 text-gray-500 cursor-not-allowed" : "bg-lime-300 text-black"}`}
          disabled={!!videoName}
        >
          Import Media
        </button>
        <h4 className="text-base font-semibold text-white">{videoName}</h4>
      </div>
          
      )}

      {navPressed === "Audio" && (
        <div>
          <button
            className="w-full p-3 mb-4 text-base font-semibold text-center text-black bg-lime-300 rounded-lg cursor-pointer"
            onClick={handleUploadAudio}
          >
            Import Audio
          </button>

          {audio && (
            <>
              <h4 className="text-base font-semibold text-white">{audio.name}</h4>
              <button
                className={`w-full p-3 mb-4 mt-4 text-base font-semibold text-center text-black bg-lime-300 rounded-lg cursor-pointer flex items-center justify-center space-x-2 transition-transform duration-150 ${caLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-lime-200 active:scale-95'}`}
                onClick={sendAudio}
                disabled={caLoading}
              >
                {caLoading ? (
                  <div className="flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3.536-3.536A9 9 0 0112 21a9 9 0 010-18z"></path>
                    </svg>
                    <span>Applying...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Apply</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                )}
              </button>
            </>
          )}
        </div>
      )}


      {/* Show Audio Controls when navPressed is "Transition" */}
      {navPressed === "Controls" && (
        <>
          <button className="p-3 mb-4 text-base font-semibold text-center text-black bg-lime-300 rounded-lg w-fit ml-auto" onClick={Revert}>
            Revert to Original
          </button>

          <div className="flex flex-col gap-4">
            {controls.map((control) => (
              <div key={control.id}>
                <h3 className="mb-2 text-base font-semibold text-white">
                  {control.label}
                </h3>
                <Slider value={control.value} setValue={control.setValue} />
              </div>
            ))}
          </div>

          <button
            className={`p-3 mt-8 text-base font-semibold text-center text-black bg-lime-300 rounded-lg cursor-pointer flex items-center justify-center space-x-2 transition-transform duration-150 ${sLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-lime-200 active:scale-95'}`}
            onClick={handleSubmitSliders}
            disabled={sLoading}
          >
            {sLoading ? (
              <div className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3.536-3.536A9 9 0 0112 21a9 9 0 010-18z" />
                </svg>
                <span>Applying...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>Apply</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            )}
          </button>
        </>
      )}
    </section>
  );
}
