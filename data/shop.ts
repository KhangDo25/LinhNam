export interface ShopItem {
  id: string;
  name: string;
  type: string;
  price: string;
  priceValue: number;
  desc: string;
  rarity: "common" | "rare" | "legendary";
  image: string;
}

export const shopItems: ShopItem[] = [
  {
    id: "tui-can-khon",
    name: "Túi Càn Khôn",
    type: "Vật phẩm",
    price: "5.000 Linh Thạch",
    priceValue: 5000,
    desc: "Chứa linh khí, mở rộng kho đồ hành trình.",
    rarity: "common",
    image: "/images/artifacts/ha-do.svg",
  },
  {
    id: "ngoc-ty",
    name: "Ngọc Tỷ Truyền Quốc",
    type: "Bảo vật",
    price: "Không thể mua",
    priceValue: 0,
    desc: "Ấn tín thiên tử, chỉ xuất hiện trong sử thi.",
    rarity: "legendary",
    image: "/images/artifacts/ngoc-trai.svg",
  },
  {
    id: "dan-tranh",
    name: "Đàn Tranh Cổ",
    type: "Nhạc cụ",
    price: "1.200 Linh Thạch",
    priceValue: 1200,
    desc: "Vang lên khúc nhạc giao thoa cõi trần và tiên giới.",
    rarity: "rare",
    image: "/images/artifacts/so-phong-than.svg",
  },
  {
    id: "den-u-minh",
    name: "Đèn U Minh",
    type: "Pháp khí",
    price: "3.500 Linh Thạch",
    priceValue: 3500,
    desc: "Dẫn đường vong linh qua sương đen.",
    rarity: "rare",
    image: "/images/artifacts/den-u-minh.svg",
  },
  {
    id: "linh-moc",
    name: "Nhánh Linh Mộc",
    type: "Dược thảo",
    price: "800 Linh Thạch",
    priceValue: 800,
    desc: "Chi nhánh từ cây thần Sơn Hải, tăng linh lực.",
    rarity: "common",
    image: "/images/artifacts/linh-moc.svg",
  },
  {
    id: "vo-long",
    name: "Vảy Long Thủy Phủ",
    type: "Nguyên liệu",
    price: "2.200 Linh Thạch",
    priceValue: 2200,
    desc: "Rơi từ Thủy Long, dùng rèn pháp bảo.",
    rarity: "rare",
    image: "/images/creatures/thuy-long.svg",
  },
];
