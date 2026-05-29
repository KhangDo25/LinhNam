"use client";

import PerformanceProvider from "./performance-provider";
import LenisProvider from "./lenis-provider";
import MouseProvider from "./mouse-provider";
import LoadingScreen from "./loading-screen";
import CustomCursor from "./custom-cursor";
import { AudioProvider } from "./audio-context";
import { NavTransitionProvider } from "./nav-transition";
import { AuthProvider } from "./auth-provider";
import { ThemeProvider } from "./theme-provider";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <PerformanceProvider>
        <AuthProvider>
          <NavTransitionProvider>
            <LenisProvider>
              <MouseProvider>
                <AudioProvider>
                  <LoadingScreen />
                  <CustomCursor />
                  {children}
                </AudioProvider>
              </MouseProvider>
            </LenisProvider>
          </NavTransitionProvider>
        </AuthProvider>
      </PerformanceProvider>
    </ThemeProvider>
  );
}
