"use client";

import { useEffect } from "react";

export default function CoiGioiPage() {
  useEffect(() => {
    window.location.replace("/#luc-gioi");
  }, []);

  return (
    <p className="min-h-screen flex items-center justify-center text-bone/60 text-sm">
      Đang dẫn về Lục Giới…
    </p>
  );
}
