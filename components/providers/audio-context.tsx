"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface AudioContextValue {
  isPlaying: boolean;
  currentTrack: string | null;
  play: (src: string, volume?: number) => void;
  stop: () => void;
  toggle: (src?: string, volume?: number) => void;
  fadeTo: (src: string, volume?: number) => void;
  setVolume: (volume: number, duration?: number) => void;
}

const AudioCtx = createContext<AudioContextValue | null>(null);

export function useAmbientAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useAmbientAudio must be used within AudioProvider");
  return ctx;
}

export function AudioProvider({
  children,
  defaultTrack = "/audio/home-bg.mp3",
}: {
  children: React.ReactNode;
  defaultTrack?: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);

  const clearFade = () => {
    if (fadeRef.current) {
      cancelAnimationFrame(fadeRef.current);
      fadeRef.current = null;
    }
  };

  const fadeVolume = (
    audio: HTMLAudioElement,
    target: number,
    duration = 800,
    onDone?: () => void
  ) => {
    clearFade();
    const start = audio.volume;
    const startTime = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const rawVolume = start + (target - start) * progress;
      
      audio.volume = Math.max(0, Math.min(1, rawVolume));

      if (progress < 1) {
        fadeRef.current = requestAnimationFrame(step);
      } else {
        audio.volume = Math.max(0, Math.min(1, target));
        // Kích hoạt callback dừng hoặc chuyển nhạc khi hoàn tất fade
        if (onDone) onDone(); 
      }
    };

    fadeRef.current = requestAnimationFrame(step);
  }; // <-- ĐÓNG NGOẶC HÀM FADEVOLUME CHUẨN XÁC Ở ĐÂY

  const play = useCallback((src: string, volume = 0.35) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioRef.current = new Audio(src);
    audioRef.current.loop = true;
    audioRef.current.volume = 0;
    
    const playPromise = audioRef.current.play();
    if (playPromise) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setCurrentTrack(src);
          if (audioRef.current) {
            fadeVolume(audioRef.current, volume);
          }
        })
        .catch(() => setIsPlaying(false));
    }
  }, []);

  const stop = useCallback(() => {
    if (!audioRef.current) return;
    fadeVolume(audioRef.current, 0, 600, () => {
      audioRef.current?.pause();
      setIsPlaying(false);
    });
  }, []);

  const toggle = useCallback(
    (src?: string, volume = 0.35) => {
      if (isPlaying) stop();
      else play(src ?? defaultTrack, volume);
    },
    [isPlaying, stop, play, defaultTrack]
  );

  const setVolume = useCallback((volume: number, duration = 400) => {
    if (audioRef.current) fadeVolume(audioRef.current, volume, duration);
  }, []);

  const fadeTo = useCallback(
    (src: string, volume = 0.35) => {
      if (!audioRef.current || currentTrack === src) {
        if (!isPlaying) play(src, volume);
        return;
      }
      fadeVolume(audioRef.current, 0, 500, () => {
        audioRef.current?.pause();
        play(src, volume);
      });
    },
    [currentTrack, isPlaying, play]
  );

  useEffect(() => {
    return () => {
      clearFade();
      audioRef.current?.pause();
    };
  }, []);

  return (
    <AudioCtx.Provider
      value={{ isPlaying, currentTrack, play, stop, toggle, fadeTo, setVolume }}
    >
      {children}
    </AudioCtx.Provider>
  );
}