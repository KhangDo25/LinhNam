"use client";

export default function LichSuDonHangRedirect() {
  if (typeof window !== "undefined") {
    window.location.replace("/lich-su-mua-hang");
  }
  return null;
}
