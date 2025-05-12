import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SocialIcon } from '../components/SocialIcon';
import { ContactInfo } from '../components/ContactInfo';
import MenuButton from '../components/MenuButton';
import useGlobalStore from "../zustand/store";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const socialIcons = [
  { src: "https://cdn.builder.io/api/v1/image/assets/5c70ca3f18714fc893785ac3990400f6/a97d3f1bb65b75eacbff767f983133cd89f72ae1e49bd7c92f2806e87c5bf810?apiKey=5c70ca3f18714fc893785ac3990400f6&", alt: "Social Media Icon 1" },
  { src: "https://cdn.builder.io/api/v1/image/assets/5c70ca3f18714fc893785ac3990400f6/649b2b96c9c75429ec1d68efd6dcb5738230456b55754df85649e2e913167529?apiKey=5c70ca3f18714fc893785ac3990400f6&", alt: "Social Media Icon 2" },
  { src: "https://cdn.builder.io/api/v1/image/assets/5c70ca3f18714fc893785ac3990400f6/d724450b7c4d427aba1e7b05443dfc7a39af9eaa0a3552e92d7855fbfb5b097e?apiKey=5c70ca3f18714fc893785ac3990400f6&", alt: "Social Media Icon 3" },
  { src: "https://cdn.builder.io/api/v1/image/assets/5c70ca3f18714fc893785ac3990400f6/d5fcefa778d0689686efa2e01fffd47fb0fae11428ff4c68ed16701201400809?apiKey=5c70ca3f18714fc893785ac3990400f6&", alt: "Social Media Icon 4" }
];

const contactInfo = [
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/5c70ca3f18714fc893785ac3990400f6/f29990710e7d63e99e998b2e264b94dd75004f6d5bee026ceb863e9052f222db?apiKey=5c70ca3f18714fc893785ac3990400f6&",
    text: "Faisal Town Fast university of computer and emerging sciences 852-B Lahore",
    className: "self-stretch"
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/5c70ca3f18714fc893785ac3990400f6/472ffd70a74bca8cd0d048ae93dcfe5e78556c59e5c4557a1c52c7cfcaefb8b9?apiKey=5c70ca3f18714fc893785ac3990400f6&",
    text: "info@audalign.com",
    className: "mt-10 whitespace-nowrap"
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/5c70ca3f18714fc893785ac3990400f6/034d1350f96efc8b62617f59fb79d9629963749788d4e3a3471236f9e202e754?apiKey=5c70ca3f18714fc893785ac3990400f6&",
    text: "+923050606075",
    className: "mt-16 text-base whitespace-nowrap max-md:mt-10"
  }
];

export default function LandingPage() {
  const { logedIn } = useGlobalStore();
  const navigate = useNavigate();
  return (
    <div className="flex overflow-hidden flex-col bg-white">
      <div className="py-10 pr-20 pl-10 w-full bg-black max-md:px-5 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          <div className="flex flex-col w-[58%] max-md:ml-0 max-md:w-full">
            <div className="flex flex-col items-start w-full text-xl font-light text-black max-md:mt-10 max-md:max-w-full">
              <MenuButton />
              <div className="self-stretch mt-28 text-6xl font-extrabold text-white max-md:mt-10 max-md:max-w-full max-md:text-4xl">
                Transform Your Table Tennis Videos with Realistic Foley Sounds!
              </div>
              <button className="gap-2.5 px-5 py-5 mt-14 bg-lime-300 min-h-[61px] rounded-[30px] max-md:mt-10 active:scale-95 transition-transform duration-150" 
              onClick={()=>{
                if(logedIn){
                navigate('/Upload')
                }
                else{
                  toast.error('Login First to use this functionality!');
                }
                }}>
                Upload a Video
              </button>
              <div className="mt-20 text-6xl text-white max-md:mt-10 max-md:text-4xl">
                AUDALIGN
              </div>
            </div>
          </div>
          <div className="flex flex-col ml-5 w-[42%] max-md:ml-0 max-md:w-full">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/5c70ca3f18714fc893785ac3990400f6/e0218eed941feaf22b7e9daf23b1e3e75955c17eb12f6fa5052f05e54a21d945?apiKey=5c70ca3f18714fc893785ac3990400f6&"
              alt="Table Tennis Visualization"
              className="object-contain mt-20 w-full aspect-square max-md:mt-10 max-md:max-w-full"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col pt-16 pr-20 pb-9 pl-10 w-full bg-stone-300 max-md:px-5 max-md:max-w-full">
        <div className="w-full max-w-[1231px] max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col">
            <div className="flex flex-col w-[59%] max-md:ml-0 max-md:w-full">
              <div className="flex flex-col text-black max-md:mt-10 max-md:max-w-full">
                <div className="self-start text-6xl max-md:text-4xl">
                  Features
                </div>
                <div className="mt-12 text-xl max-md:mt-10 max-md:max-w-full">
                AudAlign enhances muted table tennis videos by detecting objects (e.g., balls, rackets) using advanced object detection and segmentation. It identifies interactions, such as ball hits or bounces, and assigns corresponding sound effects. The audio manipulation feature customizes these sounds for realism, adjusting parameters like pitch and volume. Finally, AudAlign employs precise audio synchronization to ensure that sound aligns perfectly with visual events, creating an immersive and seamless multimedia experience for viewers.
                </div>
              </div>
            </div>
            <div className="flex flex-col ml-5 w-[41%] max-md:ml-0 max-md:w-full">
              <div className="flex flex-col grow mt-16 text-4xl max-md:mt-10 max-md:max-w-full">
                <div className="self-start text-black">Object Detection </div>
                <div className="text-zinc-600 max-md:max-w-full">
                  Object segmentation<br />
                  Audio Manipulation<br />
                  Audio Syncronization<br />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="self-center ml-4 w-full max-w-[1051px] max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col">
            <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
              <img
                loading="lazy"
                src="https://miro.medium.com/v2/resize:fit:776/1*gwW4W4rKDcDF43dVsrvg_g.png"
                alt="Feature Visualization 1"
                className="object-contain grow mt-9 w-full aspect-[1.25] max-md:mt-10 max-md:max-w-full"
              />
            </div>
            <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
              <img
                loading="lazy"
                src="https://miro.medium.com/v2/resize:fit:835/1*470p88jKoredxmJBHDkVxg.png"
                alt="Feature Visualization 2"
                className="object-contain w-full aspect-[1.25] max-md:mt-10 max-md:max-w-full"
              />
            </div>
          </div>
        </div>
      </div>
      <footer className="flex flex-col px-11 pb-6 w-full bg-black max-md:px-5 max-md:max-w-full max-sm:pb-16">
        <div className="z-10 self-center mt-0 text-white text-[180px] tracking-[5px] max-md:max-w-full max-md:text-3xl transition-all duration-500 ease-in-out hover:text-[220px] hover:tracking-[33px]">
          AUDALIGN
        </div>
        <div className="flex flex-wrap gap-5 justify-between mt-20 max-md:mt-10 max-md:max-w-full">
          <div className="flex flex-col items-start self-start mt-1.5 text-xl text-white space-y-8">
            {contactInfo.map((info, index) => (
              <ContactInfo key={index} {...info} />
            ))}
          </div>
          <div className="flex flex-col max-md:max-w-full">
            <div className="flex flex-col items-start self-end max-w-full w-[472px]">
              <div className="text-3xl text-white">About the company :</div>
              <div className="self-stretch mt-5 text-l text-white max-md:max-w-full">
              AudAlign is a cutting-edge technology company specializing in automated sound synchronization for multimedia. By leveraging advanced object detection, segmentation, and audio manipulation, it enhances videos with precise, realistic sound effects. AudAlign revolutionize content creation, delivering seamless audiovisual experiences for sports, and beyond.
              </div>
              <div className="flex gap-10 mt-8 max-md:ml-2">
                {socialIcons.map((icon, index) => (
                  <SocialIcon key={index} {...icon} />
                ))}
              </div>
            </div>
            <div className="self-start mt-8 mb-12 text-xs text-white max-md:mt-10">
              2024 © All rights reserved
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}