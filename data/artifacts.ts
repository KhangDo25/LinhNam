export interface Artifact {
  id: string;
  name: string;
  realm: string;
  era: string;
  desc: string;
  image: string;
}

export const artifacts: Artifact[] = [
  {
    id: "so-phong-than",
    name: "Sổ Phong Thần",
    realm: "thien-gioi",
    era: "Thượng Cổ",
    desc: "Cuốn sổ ghi danh vị thần được phong, quyết định thiên mệnh vạn vật.",
    image: "/images/artifacts/so-phong-than.svg",
  },
  {
    id: "ha-do",
    name: "Hà Đồ",
    realm: "thien-gioi",
    era: "Hồng Hoang",
    desc: "Bảo vật huyền thoại chứa trận pháp vũ trụ, chỉ Long Mã mới khai mở.",
    image: "/images/artifacts/ha-do.svg",
  },
  {
    id: "linh-moc",
    name: "Linh Mộc Cổ",
    realm: "son-hai",
    era: "Tiền Sử",
    desc: "Cây thần ngàn năm, rễ mọc xuyên tam giới, lá chứa linh khí.",
    image: "/images/artifacts/linh-moc.svg",
  },
  {
    id: "ngoc-trai",
    name: "Ngọc Trai Thần",
    realm: "thuy-phu",
    era: "Hải Triều",
    desc: "Ngọc trai khổng lồ phát sáng dưới đáy biển, trấn giữ long mạch.",
    image: "/images/artifacts/ngoc-trai.svg",
  },
  {
    id: "den-u-minh",
    name: "Đèn U Minh",
    realm: "u-minh",
    era: "U Linh",
    desc: "Ngọn đèn dẫn đường cho vong linh, ánh sáng mờ tan trong sương đen.",
    image: "/images/artifacts/den-u-minh.svg",
  },
  {
    id: "vo-rong",
    name: "Vỏ Rồng Sơn Hải",
    realm: "son-hai",
    era: "Hồng Hoang",
    desc: "Vảy rồng rơi trong rừng cổ, dùng khắc phù thần.",
    image: "/images/artifacts/vo-rong.svg",
  },
  {
    id: "chau-sao",
    name: "Châu Sao Biển",
    realm: "thuy-phu",
    era: "Hải Triều",
    desc: "Viên châu phát sáng dưới đáy, trấn áp yêu quái thủy phủ.",
    image: "/images/artifacts/chau-sao.svg",
  },
];

export function getArtifactsByRealm(realm: string): Artifact[] {
  return artifacts.filter((a) => a.realm === realm);
}
