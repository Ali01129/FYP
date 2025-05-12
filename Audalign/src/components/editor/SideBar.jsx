import React from "react";
import Logo from "../../assets/images/logo.png";
import useGlobalStore from "../../zustand/store";
import { useNavigate } from "react-router-dom";
import {
  MediaIcon,
  AudioIcon,
  TransitionIcon,
  LayoutIcon,
} from "./NavIcons";

const NavItem = ({ icon: Icon, label, isActive, onClick }) => (
  <nav
    className={`flex flex-col justify-center items-center px-2 py-4 text-xs cursor-pointer h-[88px] 
      ${isActive ? "text-white" : "text-neutral-400"} w-[84px]`}
    onClick={onClick}
  >
    <Icon className="w-9 h-9 mb-2" />
    <span>{label}</span>
  </nav>
);

export default function Sidebar() {
  const navigate = useNavigate();
  const { navPressed, setNavPressed } = useGlobalStore();

  return (
    <aside className="flex flex-col items-center pt-4 bg-gray-800 w-[84px]">
      <img src={Logo} alt="Logo" className="mb-4 h-[50px] w-[50px]" onClick={()=>{navigate('/')}} />
      <NavItem 
        icon={MediaIcon} 
        label="Media" 
        isActive={navPressed === "Media"} 
        onClick={() => setNavPressed("Media")} 
      />
      <NavItem 
        icon={AudioIcon} 
        label="Audio" 
        isActive={navPressed === "Audio"} 
        onClick={() => setNavPressed("Audio")} 
      />
      <NavItem 
        icon={TransitionIcon} 
        label="Controls" 
        isActive={navPressed === "Controls"} 
        onClick={() => setNavPressed("Controls")} 
      />
    </aside>
  );
}

