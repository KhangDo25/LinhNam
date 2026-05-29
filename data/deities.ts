export interface Deity {
  id: string;
  name: string;
  title: string;
  realm?: string;
  domain: string;
  desc: string;
  image?: string;
}

export const deities: Deity[] = [
  {
    id: "lac-long",
    name: "Lạc Long Quân",
    title: "Thần Long Tộc",
    domain: "Biển cả & Rồng thiêng",
    desc: "Cha đẻ dân tộc Việt, người mang sức mạnh của đại dương và long mạch giang sơn.",
    image: "/images/realms/thuy-phu.png",
  },
  {
    id: "au-co",
    name: "Âu Cơ",
    title: "Tiên Nữ Cõi Trời",
    domain: "Sinh mệnh & Tiên rồng",
    desc: "Mẹ hiền của trăm con, biểu tượng vẻ đẹp thanh tao và nguồn cội tiên rồng.",
    image: "/images/realms/thien-gioi.png",
  },
  {
    id: "son-tinh",
    name: "Sơn Tinh",
    title: "Chúa Tể Non Cao",
    realm: "son-hai",
    domain: "Núi non & Địa lực",
    desc: "Vị thần điều khiển long mạch vạn dặm, mang định lực cho giang sơn.",
    image: "/images/realms/son-hai.png",
  },
  {
    id: "thuy-tinh",
    name: "Thủy Tinh",
    title: "Thần Mưa Gọi Gió",
    realm: "thuy-phu",
    domain: "Đại dương & Bão táp",
    desc: "Đại diện sức mạnh dữ dội của biển cả, điều hòa mưa gió vạn vật.",
    image: "/images/realms/thuy-phu.png",
  },
  {
    id: "dia-mau",
    name: "Địa Mẫu",
    title: "Mẫu Thần Đất",
    domain: "Đất liền & Mùa màng",
    desc: "Che chở muôn dân, ban phước lành qua đất trời và linh khí địa mạch.",
    image: "/images/realms/son-hai.png",
  },
  {
    id: "u-minh-vuong",
    name: "U Minh Vương",
    title: "Chúa Cõi Âm",
    realm: "u-minh",
    domain: "Vong linh & Luân hồi",
    desc: "Trấn giữ cổng U Minh, phân định linh hồn giữa tam giới.",
    image: "/images/realms/u-minh.png",
  },
];

export function getDeitiesByRealm(realm: string): Deity[] {
  return deities.filter((d) => d.realm === realm || !d.realm);
}
