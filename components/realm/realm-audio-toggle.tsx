"use client";

import { Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAmbientAudio } from "@/components/providers/audio-context";
import { getRealmAudio } from "@/data/realm-audio";
import { cn } from "@/lib/cn";

interface RealmAudioToggleProps {
  slug: string;
  className?: string;
}

export default function RealmAudioToggle({
  slug,
  className,
}: RealmAudioToggleProps) {
  const audio = getRealmAudio(slug);
  const { isPlaying, toggle } = useAmbientAudio();

  return (
    <button
      onClick={() => toggle(audio.src, audio.volume)}
      className={cn(
        "fixed bottom-10 right-10 z-50 flex h-12 w-12 items-center justify-center rounded-full border backdrop-blur-md transition-all hover:scale-110 active:scale-95 cursor-hover",
        className
      )}
      aria-label={`Âm thanh: ${audio.label}`}
      title={audio.label}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isPlaying ? "on" : "off"}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          {isPlaying ? (
            <Volume2 size={18} className="animate-pulse" />
          ) : (
            <VolumeX size={18} className="opacity-50" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
