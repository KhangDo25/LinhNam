"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import Dissolve from "@/components/transition/dissolve";

type TransitionVariant = "black" | "gold" | "void";

interface NavTransitionContextValue {
  navigate: (href: string, variant?: TransitionVariant) => void;
  isTransitioning: boolean;
}

const NavTransitionCtx = createContext<NavTransitionContextValue | null>(null);

export function useNavTransition() {
  const ctx = useContext(NavTransitionCtx);
  if (!ctx)
    throw new Error("useNavTransition must be used within NavTransitionProvider");
  return ctx;
}

const realmVariants: Record<string, TransitionVariant> = {
  "u-minh": "black",
  "thien-gioi": "gold",
  "thuy-phu": "void",
  "son-hai": "void",
};

export function NavTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [variant, setVariant] = useState<TransitionVariant>("black");

  const navigate = useCallback(
    (href: string, v?: TransitionVariant) => {
      const slug = href.replace("/", "");
      setVariant(v ?? realmVariants[slug] ?? "black");
      setIsTransitioning(true);
      setTimeout(() => {
        router.push(href);
        setTimeout(() => setIsTransitioning(false), 450);
      }, 550);
    },
    [router]
  );

  return (
    <NavTransitionCtx.Provider value={{ navigate, isTransitioning }}>
      {children}
      <Dissolve active={isTransitioning} variant={variant} />
    </NavTransitionCtx.Provider>
  );
}
