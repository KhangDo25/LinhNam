export interface Creature {
  id: string;
  name: string;
  realm: string;
  type: string;
  desc: string;
  image: string;
}

export const creatures: Creature[] = [
  {
    id: "kim-long",
    name: "Kim Long",
    realm: "thien-gioi",
    type: "Thần Thú",
    desc: "Rồng vàng uy nghi rạch ròi mây trời, canh giữ cửu trùng thiên môn.",
    image: "/images/creatures/kim-long.svg",
  },
  {
    id: "ha-than",
    name: "Hạc Thần",
    realm: "thien-gioi",
    type: "Thần Thú",
    desc: "Biểu tượng thanh cao thoát tục, dẫn linh hồn vượt tam giới.",
    image: "/images/creatures/ha-than.svg",
  },
  {
    id: "long-ma",
    name: "Long Mã",
    realm: "thien-gioi",
    type: "Thần Thú",
    desc: "Mang Hà Đồ trận pháp, chỉ xuất hiện khi thiên hạ thái bình.",
    image: "/images/creatures/long-ma.svg",
  },
  {
    id: "son-than",
    name: "Sơn Thần",
    realm: "son-hai",
    type: "Thủ Hộ",
    desc: "Ngự trị long mạch vạn dặm, mang định lực cho giang sơn.",
    image: "/images/creatures/son-than.svg",
  },
  {
    id: "thuy-long",
    name: "Thủy Long",
    realm: "thuy-phu",
    type: "Hải Thần",
    desc: "Long vương thâm uyên, trấn giữ long cung dưới đáy biển.",
    image: "/images/creatures/thuy-long.svg",
  },
  {
    id: "hon-ma",
    name: "Hồn Ma",
    realm: "u-minh",
    type: "U Linh",
    desc: "Thực thể lang thang trong sương đen, hút linh khí người sống.",
    image: "/images/creatures/hon-ma.svg",
  },
  {
    id: "linh-ho",
    name: "Linh Hổ",
    realm: "son-hai",
    type: "Sơn Thú",
    desc: "Hổ thần canh rừng sâu, tiếng gầm rung chuyển long mạch.",
    image: "/images/creatures/linh-ho.svg",
  },
  {
    id: "yen-ngu",
    name: "Yến Ngư",
    realm: "thuy-phu",
    type: "Hải Linh",
    desc: "Đàn cá thần tụ hội quanh ngọc trai, báo hiệu thủy triều linh.",
    image: "/images/creatures/yen-ngu.svg",
  },
  {
    id: "diem-sang",
    name: "Điểm Sáng U Linh",
    realm: "u-minh",
    type: "Ánh sáng",
    desc: "Đốm sáng lơ lửng trong sương, dẫn lối hoặc đánh lạc hồn.",
    image: "/images/creatures/diem-sang.svg",
  },
];

export function getCreaturesByRealm(realm: string): Creature[] {
  return creatures.filter((c) => c.realm === realm);
}
