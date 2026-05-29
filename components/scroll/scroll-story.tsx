"use client";

import { useEffect, useRef } from "react";
import { useAmbientAudio } from "@/components/providers/audio-context";
import { throttle } from "@/lib/performance";

interface ScrollStoryProps {
  children: React.ReactNode;
}

/** Audio fade theo scroll — story vars đã xử lý trong LenisProvider */
export default function ScrollStory({ children }: ScrollStoryProps) {
  const { setVolume, isPlaying, currentTrack } = useAmbientAudio();
  const lastVol = useRef(-1);

  useEffect(() => {
    const updateVolume = throttle(() => {
      if (!isPlaying || currentTrack !== "/audio/home-bg.mp3") return;
      const p = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--scroll-progress"
        ) || "0"
      );
      if (p <= 0.55 || p >= 0.95) return;
      const vol = Math.max(0.1, 0.35 - (p - 0.55) * 0.2);
      if (Math.abs(vol - lastVol.current) > 0.03) {
        lastVol.current = vol;
        setVolume(vol, 400);
      }
    }, 200);

    const id = setInterval(updateVolume, 250);
    return () => clearInterval(id);
  }, [isPlaying, currentTrack, setVolume]);

  return <>{children}</>;
}
