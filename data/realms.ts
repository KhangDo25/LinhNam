export interface RealmTheme {
  bg: string;
  text: string;
  accent: string;
  gradient: string;
  fogColor: string;
  transition: "black" | "gold" | "void";
}

export interface RealmItem {
  name: string;
  slug: string;
  desc: string;
  direction: number;
  image: string;
  audio: string;
  eyebrow: string;
  tagline: string;
  theme: RealmTheme;
  chapter: string;
}

export const realms: RealmItem[] = [
  {
    name: "Thiên Giới",
    slug: "thien-gioi",
    desc: "Nơi khởi nguyên của ánh sáng",
    direction: -150,
    image: "/images/realms/thien-gioi.png",
    audio: "/audio/thien-gioi.mp3",
    eyebrow: "Nơi Thiên Đạo Tồn Tại",
    tagline: "Triều đình thần linh — Cân bằng vạn vật — Thiên mệnh phong thần",
    chapter: "Chương I",
    theme: {
      bg: "#FDFBF7",
      text: "#4A4238",
      accent: "#C6A972",
      gradient: "from-[#EAF4FC] via-[#FDFBF7] to-[#FDFBF7]",
      fogColor: "rgba(198, 169, 114, 0.06)",
      transition: "gold",
    },
  },
  {
    name: "Sơn Hải",
    slug: "son-hai",
    desc: "Vùng đất của kỳ hoa dị thảo",
    direction: 150,
    image: "/images/realms/son-hai.png",
    audio: "/audio/son-hai.mp3",
    eyebrow: "Rừng Cổ Thần Bí",
    tagline: "Linh mộc ngàn năm — Thú thần hộ giới — Sơn hải vô biên",
    chapter: "Chương II",
    theme: {
      bg: "#0F1410",
      text: "#C8D4BC",
      accent: "#2D4F4A",
      gradient: "from-[#1A2E1A] via-[#0F1410] to-[#050507]",
      fogColor: "rgba(45, 79, 74, 0.08)",
      transition: "void",
    },
  },
  {
    name: "Thủy Phủ",
    slug: "thuy-phu",
    desc: "Đế quốc tĩnh lặng dưới đáy sâu",
    direction: -150,
    image: "/images/realms/thuy-phu.png",
    audio: "/audio/thuy-phu.mp3",
    eyebrow: "Vương Quốc Thủy Tề",
    tagline: "Long cung thâm uyên — Ngọc trai linh khí — Thủy phủ tĩnh lặng",
    chapter: "Chương III",
    theme: {
      bg: "#060D14",
      text: "#A8C4D4",
      accent: "#4A7A9B",
      gradient: "from-[#0A1A2E] via-[#060D14] to-[#030303]",
      fogColor: "rgba(74, 122, 155, 0.08)",
      transition: "void",
    },
  },
  {
    name: "U Minh",
    slug: "u-minh",
    desc: "Cõi sương mờ tĩnh mịch",
    direction: 150,
    image: "/images/realms/u-minh.png",
    audio: "/audio/u-minh.mp3",
    eyebrow: "Cõi Bóng Tối Vĩnh Hằng",
    tagline: "Sương mù u uất — Linh hồn lang thang — U minh tĩnh lặng",
    chapter: "Chương IV",
    theme: {
      bg: "#080808",
      text: "#E8E0D0",
      accent: "#800000",
      gradient: "from-[#1A0A0A] via-[#080808] to-[#030303]",
      fogColor: "rgba(128, 0, 0, 0.06)",
      transition: "black",
    },
  },
];

export function getRealmBySlug(slug: string): RealmItem | undefined {
  return realms.find((r) => r.slug === slug);
}
