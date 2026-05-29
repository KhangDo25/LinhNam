"use client";

import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-10 right-10 z-50">
      <audio ref={audioRef} src="/audio/home-bg.mp3" loop />
      
      <button
        onClick={togglePlay}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-[#C6A972]/30 bg-black/40 backdrop-blur-md transition-all hover:border-[#C6A972] hover:scale-110 active:scale-95"
      >
        {isPlaying ? (
          <Volume2 size={18} className="text-[#C6A972]" />
        ) : (
          <VolumeX size={18} className="text-[#E8E0D0]/40" />
        )}
      </button>
    </div>
  );
}