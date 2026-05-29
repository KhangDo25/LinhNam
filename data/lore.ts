export interface LoreEntry {
  id: string;
  title: string;
  realm?: string;
  category: "mythology" | "landscape" | "history" | "ritual";
  excerpt: string;
  content: string;
  image?: string;
}

export const loreEntries: LoreEntry[] = [
  {
    id: "thien-dinh",
    title: "Thiên Đình",
    realm: "thien-gioi",
    category: "mythology",
    excerpt: "Nơi ngự trị của những vị thần tối cao.",
    content:
      "Thiên Đình là trung tâm quyền lực của Thiên Giới, nơi các vị thần thực thi thiên mệnh và duy trì cân bằng Lục Giới thông qua luật nhân quả bất biến.",
    image: "/images/realms/thien-gioi.png",
  },
  {
    id: "son-hai-rung",
    title: "Rừng Sơn Hải",
    realm: "son-hai",
    category: "landscape",
    excerpt: "Rừng cổ thần bí không lối ra.",
    content:
      "Sơn Hải là vùng đất của linh mộc ngàn năm và thú thần hộ giới. Mỗi cây cổ thụ là một mạch linh khí, mỗi con thú là một hộ vệ.",
    image: "/images/realms/son-hai.png",
  },
  {
    id: "long-cung",
    title: "Long Cung Thủy Phủ",
    realm: "thuy-phu",
    category: "mythology",
    excerpt: "Cung điện dưới đáy biển sâu.",
    content:
      "Long Cung là thành trì của Thủy Long, nơi ngọc trai thần phát sáng và dòng nước mang linh khí thanh tẩy vỗ về linh hồn.",
    image: "/images/realms/thuy-phu.png",
  },
  {
    id: "dia-nguc",
    title: "Địa Ngục U Minh",
    realm: "u-minh",
    category: "mythology",
    excerpt: "Cõi sương mờ tĩnh mịch vĩnh hằng.",
    content:
      "U Minh là ranh giới giữa sống và chết, nơi vong linh lang thang trong sương đen và đèn u minh dẫn đường.",
    image: "/images/realms/u-minh.png",
  },
  {
    id: "nhan-gian",
    title: "Nhân Gian",
    category: "history",
    excerpt: "Cõi trần nối liền lục giới.",
    content:
      "Nhân gian là điểm giao thoa của long mạch, nơi huyền sử vẫn thấp thoáng trong đời sống, đợi kẻ có duyên khai mở.",
    image: "/images/realms/thien-gioi.png",
  },
  {
    id: "phong-than",
    title: "Phong Thần Đài",
    realm: "thien-gioi",
    category: "ritual",
    excerpt: "Nghi lễ phong thần cổ xưa.",
    content:
      "Đài phong thần ghi danh vị thần được triều đình công nhận, là cầu nối giữa nhân gian và thiên đình.",
    image: "/images/realms/thien-gioi.png",
  },
];

export const codexCategories = [
  { id: "su-thi", label: "Sử Thi Đầy Đủ", href: "/su-thi" },
  { id: "archive", label: "Huyền Thoại", href: "/huyen-thoai" },
  { id: "bestiary", label: "Sách Linh Thú", href: "/linh-thu" },
  { id: "mythology", label: "Sử Thi", href: "/huyen-thoai" },
] as const;

export function getLoreByRealm(realm: string): LoreEntry[] {
  return loreEntries.filter((l) => l.realm === realm);
}
