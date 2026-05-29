export interface RealmAudioProfile {
  src: string;
  volume: number;
  label: string;
}

export const realmAudioProfiles: Record<string, RealmAudioProfile> = {
  home: { src: "/audio/home-bg.mp3", volume: 0.35, label: "Nhân gian" },
  "thien-gioi": {
    src: "/audio/thien-gioi.mp3",
    volume: 0.4,
    label: "Thiên âm — chim hót, gió mây",
  },
  "u-minh": {
    src: "/audio/u-minh.mp3",
    volume: 0.28,
    label: "U minh — thì thầm, gió lạnh",
  },
  "thuy-phu": {
    src: "/audio/thuy-phu.mp3",
    volume: 0.32,
    label: "Thủy phủ — sóng sâu",
  },
  "son-hai": {
    src: "/audio/son-hai.mp3",
    volume: 0.33,
    label: "Sơn hải — rừng cổ",
  },
};

export function getRealmAudio(slug: string): RealmAudioProfile {
  return realmAudioProfiles[slug] ?? realmAudioProfiles.home;
}
