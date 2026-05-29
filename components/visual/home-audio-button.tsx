"use client";

import { Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAmbientAudio } from "@/components/providers/audio-context";

export default function HomeAudioButton() {
  const { isPlaying, toggle } = useAmbientAudio();

  return (
    <div className="fixed bottom-10 right-10 z-50">
      <button
        onClick={() => toggle("/audio/home-bg.mp3")}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-[#C6A972]/30 bg-black/40 backdrop-blur-md transition-all hover:border-[#C6A972] hover:scale-110 active:scale-95 cursor-hover"
        aria-label={isPlaying ? "Tắt âm thanh" : "Bật âm thanh"}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isPlaying ? "on" : "off"}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            {isPlaying ? (
              <Volume2 size={18} className="text-[#C6A972]" />
            ) : (
              <VolumeX size={18} className="text-[#E8E0D0]/40" />
            )}
          </motion.div>
        </AnimatePresence>
      </button>
    </div>
  );
}
