"use client";

import Navbar from "@/components/layout/navbar";
import HeroDepthLayers from "@/components/visual/hero-depth-layers";
import HomeAudioButton from "@/components/visual/home-audio-button";
import ScrollStory from "@/components/scroll/scroll-story";
import HeroSection from "@/sections/home/hero-section";
import StatsSection from "@/sections/home/stats-section";
import RealmsSection from "@/sections/home/realms-section";
import FooterSection from "@/sections/home/footer-section";

export default function Home() {
  return (
    <ScrollStory>
      <main className="relative min-h-screen overflow-x-hidden bg-abyss text-bone selection:bg-gold/20 selection:text-gold">
        <HeroDepthLayers />
        <Navbar />
        <HomeAudioButton />

        <div className="relative z-10 w-full">
          <HeroSection />
          <StatsSection />
          <RealmsSection />
          <FooterSection />
        </div>
      </main>
    </ScrollStory>
  );
}
