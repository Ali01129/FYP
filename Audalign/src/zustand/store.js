import { create } from "zustand";

// Define the store
const useGlobalStore = create((set) => ({

  //user info
  logedIn: false,
  //audio
  audio: null,
  //others
  volume:50,
  reverb:50,
  pitch:50,
  noise:50,
  navPressed:'Media',
  video:null,
  revertVideo:null,
  videoName:null,
  videoRef:null,
  loading:false,

  //user action
  setLogedIn: (logedIn) => set({ logedIn }),
  //audio actions
  setAudio: (audio) => set({ audio }),
  //other actions
  setVolume: (volume) => set({ volume }),
  setReverb: (reverb) => set({ reverb }),
  setPitch: (pitch) => set({ pitch }),
  setNoise: (noise) => set({ noise }),
  setNavPressed: (navPressed) => set({ navPressed }),
  setVideo: (video) => set({ video }),
  setRevertVideo: (revertVideo) => set({ revertVideo }),
  setVideoName: (videoName) => set({ videoName }),
  setVideoRef: (videoRef) => set({ videoRef }),
  setLoading: (loading) => set({ loading }),
}));

export default useGlobalStore;
