"use client";

import { useEffect, useState } from "react";
import { usePerformance } from "./performance-provider";

export default function CustomCursor() {
  const perf = usePerformance();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Custom cursor TẮT vĩnh viễn vì là nguồn lag + khó dùng:
  // mousemove -> setState React mỗi lần hover link/button -> re-render.
  // Giữ component để không phải sửa AppProviders, nhưng không render gì.
  void perf;
  void mounted;
  return null;
}