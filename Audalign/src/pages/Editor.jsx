import React from "react";
import Sidebar from "../components/editor/SideBar";
import AudioControls from "../components/editor/AudioControls";
import MainContent from "../components/editor/MainContent";

export default function Editor() {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <main className="flex w-full h-screen bg-zinc-900">
        <Sidebar />
        <AudioControls />
        <MainContent />
      </main>
    </>
  );
}
