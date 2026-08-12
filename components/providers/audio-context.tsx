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

  if (!ctx) {
    throw new Error("useAmbientAudio must be used within AudioProvider");
  }

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

  const clearFade = useCallback(() => {
    if (fadeRef.current !== null) {
      cancelAnimationFrame(fadeRef.current);
      fadeRef.current = null;
    }
  }, []);

  const fadeVolume = useCallback(
    (
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
          fadeRef.current = null;

          if (onDone) {
            onDone();
          }
        }
      };

      fadeRef.current = requestAnimationFrame(step);
    },
    [clearFade]
  );

  const play = useCallback(
    (src: string, volume = 0.35) => {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(src);

      audioRef.current = audio;
      audio.loop = true;
      audio.volume = 0;

      const playPromise = audio.play();

      if (playPromise) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setCurrentTrack(src);

            if (audioRef.current === audio) {
              fadeVolume(audio, volume);
            }
          })
          .catch(() => {
            setIsPlaying(false);
          });
      }
    },
    [fadeVolume]
  );

  const stop = useCallback(() => {
    const audio = audioRef.current;

    if (!audio) return;

    fadeVolume(audio, 0, 600, () => {
      audio.pause();

      if (audioRef.current === audio) {
        setIsPlaying(false);
        setCurrentTrack(null);
      }
    });
  }, [fadeVolume]);

  const toggle = useCallback(
    (src?: string, volume = 0.35) => {
      if (isPlaying) {
        stop();
      } else {
        play(src ?? defaultTrack, volume);
      }
    },
    [isPlaying, stop, play, defaultTrack]
  );

  const setVolume = useCallback(
    (volume: number, duration = 400) => {
      if (audioRef.current) {
        fadeVolume(audioRef.current, volume, duration);
      }
    },
    [fadeVolume]
  );

  const fadeTo = useCallback(
    (src: string, volume = 0.35) => {
      const currentAudio = audioRef.current;

      if (!currentAudio || currentTrack === src) {
        if (!isPlaying) {
          play(src, volume);
        }

        return;
      }

      fadeVolume(currentAudio, 0, 500, () => {
        currentAudio.pause();

        if (audioRef.current === currentAudio) {
          play(src, volume);
        }
      });
    },
    [currentTrack, isPlaying, play, fadeVolume]
  );

  useEffect(() => {
    return () => {
      clearFade();
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [clearFade]);

  return (
    <AudioCtx.Provider
      value={{
        isPlaying,
        currentTrack,
        play,
        stop,
        toggle,
        fadeTo,
        setVolume,
      }}
    >
      {children}
    </AudioCtx.Provider>
  );
}