"use client";

import { useEffect } from "react";

/**
 * Đồng bộ theme từ localStorage vào <html data-theme>.
 * Chạy sau mount nên không vi phạm quy tắc script trong React 19 / Next 16.
 * ThemeProvider đã xử lý việc này, component này chỉ là lớp
 * phòng thủ khi user có theme lưu sẵn trước khi provider mount.
 */
export default function ThemeInit() {
  useEffect(() => {
    try {
      const t = localStorage.getItem("linh-nam-theme");
      if (t === "light" || t === "dark") {
        document.documentElement.dataset.theme = t;
      }
    } catch {
      /* ignore */
    }
  }, []);

  return null;
}
