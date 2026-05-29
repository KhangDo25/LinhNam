export interface MythStory {
  id: string;
  name: string;
  title: string;
  era: string;
  excerpt: string;
  content: string;
  /** Mô tả nguồn ngắn */
  source: string;
  /** Liên kết Wikipedia tiếng Việt hoặc Commons */
  sourceUrl: string;
  /** Ảnh local fallback */
  image: string;
  /** Ảnh Wikimedia Commons (ưu tiên hiển thị) */
  imageUrl: string;
  realm?: string;
}

export const myths: MythStory[] = [
  {
    id: "lac-long-au-co",
    name: "Lạc Long Quân & Âu Cơ",
    title: "Tiên Rồng — Gốc Dòng Họ",
    era: "Hồng Hoang",
    excerpt:
      "Một trăm trứng nở trăm con; năm mươi theo cha xuống biển, năm mươi theo mẹ lên núi — nguồn gốc khái niệm «đồng bào».",
    source:
      "Đại Việt Sử Ký Toàn Thư (Lê Văn Hưu, 1479); bài viết Wikipedia tiếng Việt «Lạc Long Quân».",
    sourceUrl: "https://vi.wikipedia.org/wiki/L%E1%BA%A1c_Long_Qu%C3%A2n",
    image: "/images/realms/thuy-phu.png",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Dong_Son_drum_Heger_I_b.jpg/640px-Dong_Son_drum_Heger_I_b.jpg",
    content: `Theo Đại Việt Sử Ký Toàn Thư và truyền thuyết phổ biến, Lạc Long Quân là thần rồng cai quản vùng nước, Âu Cơ là tiên nữ vùng núi. Hai người kết duyên; Âu Cơ mang trăm trứng, nở ra trăm người con — tổ tiên của Bách Việt.

Khi chia con, Âu Cơ dẫn năm mươi người lên núi, Lạc Long Quân dẫn năm mươi người xuống biển. Đây là biểu tượng hòa hợp văn hóa thủy tạ (sông nước, lúa nước) và văn hóa miền núi trong không gian văn minh Đông Sơn — được nhiều nghiên cứu văn hóa và bài viết Wikipedia tham chiếu.`,
  },
  {
    id: "son-tinh-thuy-tinh",
    name: "Sơn Tinh & Thủy Tinh",
    title: "Trận Chiến Núi — Biển",
    era: "Văn Lang",
    excerpt:
      "Hai vị thần tranh giành Mỵ Nương; Thủy Tinh dâng nước, Sơn Tinh dâng núi — giải thích địa hình trung du Bắc Bộ.",
    source: "Lĩnh Nam chích quái (Trần Thế Pháp, 1695); Wikipedia «Sơn Tinh – Thủy Tinh».",
    sourceUrl: "https://vi.wikipedia.org/wiki/S%C6%A1n_Tinh_%E2%80%93_Th%E1%BB%A7y_Tinh",
    image: "/images/realms/son-hai.png",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Mau_Son_Mountain.jpg/640px-Mau_Son_Mountain.jpg",
    realm: "son-hai",
    content: `Mị Nương là con gái Hùng Vương. Sơn Tinh (chúa non) và Thủy Tinh (vua nước) cùng cầu hôn. Vua cha giao hẹn: ai mang lễ vật đến trước được lấy nàng.

Sơn Tinh đem cối xôi, gà chó, voi ngựa đến trước. Thủy Tinh đến sau, hô mưa gọi gió, dâng nước đánh Sơn Tinh. Sơn Tinh bốc từng dãy núi chặn nước — tạo đồi bậc thang và địa hình trung du. Truyện ghi trong Lĩnh Nam chích quái, phản ánh xung đột cư dân miền núi — đồng bằng và trí tuệ ứng phó thiên tai.`,
  },
  {
    id: "thanh-giong",
    name: "Thánh Gióng",
    title: "Anh Hùng Dã Tràng",
    era: "Văn Lang",
    excerpt:
      "Cậu bé ba tuổi lớn thành tráng sĩ, cưỡi ngựa sắt đánh giặc Ân, rồi bay về trời tại Sóc Sơn.",
    source:
      "Wikipedia «Phù Đổng Thánh Gióng»; Lễ hội Gióng (Phù Đổng) — UNESCO di sản văn hóa phi vật thể (2010).",
    sourceUrl: "https://vi.wikipedia.org/wiki/Ph%C3%B9_%C4%90%E1%BB%95ng_Th%C3%A1nh_Gi%C3%B3ng",
    image: "/images/realms/thien-gioi.png",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Den_Phu_Dong_Thang_Long.jpg/640px-Den_Phu_Dong_Thang_Long.jpg",
    realm: "thien-gioi",
    content: `Giặc Ân xâm lược, Hùng Vương kêu gọi tìm tướng. Tại làng Gióng có cậu bé ba tuổi chưa biết cười nói; nghe trống thì tỉnh, lớn vụt thành tráng sĩ khổng lồ.

Dân làng nuôi ăn, rèn ngựa sắt. Gióng xông trận, ném sắt đánh quân thù. Đuổi giặc đến núi Sóc Sơn (Hà Nội), chàng cởi giáp treo cây đa, bay lên trời. Đền Phù Đổng (Gia Lâm) và đền Sóc Sơn là di tích gắn truyền thuyết — tinh thần bất khuất chống ngoại xâm.`,
  },
  {
    id: "tam-cam",
    name: "Tấm Cám",
    title: "Nhân Quả — Công Lý",
    era: "Truyện Cổ Tích",
    excerpt:
      "Tấm hiền lành bị Cám và mẹ kế hãm hại; nhờ thần linh, cá bống, chim chào mào mà được báo thù và thành hậu.",
    source:
      "Wikipedia tiếng Việt «Tấm Cám»; Nguyễn Đổng Chi, Kho tàng truyện cổ Việt Nam.",
    sourceUrl: "https://vi.wikipedia.org/wiki/T%E1%BA%A5m_C%C3%A1m",
    image: "/images/realms/thien-gioi.png",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Vietnamese_fairy_tales_book_cover.jpg/640px-Vietnamese_fairy_tales_book_cover.jpg",
    content: `Tấm Cám là truyện cổ tích Việt Nam phổ biến nhất, thuộc thể loại thần kỳ — nhân quả. Tấm là cô gái hiền, mẹ mất sớm, sống với mẹ kế và em Cám. Bị bắt nạt, Tấm vẫn giữ lòng tốt.

Các chi tiết kinh điển (theo bản phổ biến và Wikipedia): bị Cám tráo yên ao; được Bụt giúp; hóa thành chim chào mào; hạt thóc nói «chim ăn sâu, vua ăn mật»; Tấm được vua cưới làm hoàng hậu; Cám và mẹ kế ghen, giết Tấm, lấy thịt nấu canh; Tấm hiển linh; cuối cùng nhân quả trả đũa — kẻ ác nhận hậu quả.

Truyện đề cao đức hiền, lòng kiên nhẫn và niềm tin công lý sẽ đến; là mô-típ «Cinderella» phương Đông được nghiên cứu quốc tế.`,
  },
  {
    id: "so-dua",
    name: "Sọ Dừa",
    title: "Ở Hiền Gặp Lành",
    era: "Truyện Cổ Tích",
    excerpt:
      "Chàng trai sinh ra tròn như quả dừa, đội lốt xấu xí nhưng tài giỏi — thi đỗ, cứu vợ, đoàn tụ hạnh phúc.",
    source:
      "Wikipedia tiếng Việt «Sọ Dừa»; chương trình Ngữ văn lớp 6 — Bộ GD&ĐT.",
    sourceUrl: "https://vi.wikipedia.org/wiki/S%E1%BB%8D_D%E1%BB%ABa",
    image: "/images/realms/son-hai.png",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Coconut_face_carving.jpg/640px-Coconut_face_carving.jpg",
    content: `Sọ Dừa là truyện cổ tích thần kỳ Việt Nam, cùng dòng với Tấm Cám, Thạch Sanh trong kho tàng dân gian (Wikipedia «Sọ Dừa»).

Cốt truyện chính: người mẹ nghèo uống nước trong sọ dừa rồi sinh ra đứa con tròn như quả dừa, không tay chân — khiến mọi người khiếp sợ. Sọ Dừa là nhân vật «đội lốt»: vẻ ngoài xấu xí che giấu trí tuệ và tấm lòng nhân hậu. Chàng chăn bò giỏi, học hành thi đỗ Trạng nguyên, đi sứ; vượt qua mưu hãm hại của chị dâu; cứu vợ, đoàn tụ — kẻ ác nhận kết cục xấu.

Thông điệp: «ở hiền gặp lành», đánh giá con người qua phẩm chất, không chỉ vẻ bề ngoài.`,
  },
  {
    id: "banh-chung-banh-day",
    name: "Bánh Chưng — Bánh Dày",
    title: "Vuông Đất — Tròn Trời",
    era: "Hùng Vương",
    excerpt:
      "Lang Liêu dâng bánh chưng vuông (đất) và bánh dày tròn (trời), được truyền ngôi — nguồn gốc tục Tết.",
    source:
      "Wikipedia «Bánh chưng»; UNESCO (2023) — «Tết, Vietnamese Lunar New Year» (Tết Nguyên đán Việt Nam).",
    sourceUrl: "https://vi.wikipedia.org/wiki/B%C3%A1nh_ch%C6%B0ng",
    image: "/images/realms/thien-gioi.png",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Banh_chung_Vietnam.jpg/640px-Banh_chung_Vietnam.jpg",
    content: `Theo truyền thuyết gắn với kỳ Tết (ghi trong Wikipedia «Bánh chưng» và các sách cổ tích): Hùng Vương thứ sáu muốn chọn người kế vị. Các hoàng tử dâng sản vật quý; Lang Liêu, con út nghèo, ở nhà làm bánh.

Bánh chưng vuông, lá dong, nhân gạo nếp — tượng đất vuông, lòng người «vuông vắn». Bánh dày tròn — tượng trời tròn che chở. Vua cha hiểu ý nghĩa triết lý «trời tròn — đất vuông», truyền ngôi cho Lang Liêu.

Tết Nguyên đán Việt Nam được UNESCO ghi danh di sản văn hóa phi vật thể (2023); bánh chưng là biểu tượng ẩm thực Tết trong truyền thống dân tộc (xem Wikipedia «Bánh chưng», «Tết Nguyên đán»).`,
  },
  {
    id: "my-nuong",
    name: "Mỵ Nương",
    title: "Nàng Tiên Hạ Phàm",
    era: "Văn Lang",
    excerpt: "Con gái Hùng Vương, trung tâm truyền thuyết Sơn Tinh — Thủy Tinh.",
    source: "Lĩnh Nam chích quái; Wikipedia «Sơn Tinh – Thủy Tinh».",
    sourceUrl: "https://vi.wikipedia.org/wiki/S%C6%A1n_Tinh_%E2%80%93_Th%E1%BB%A7y_Tinh",
    image: "/images/realms/thien-gioi.png",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Ha_Long_Bay_in_Vietnam.jpg/640px-Ha_Long_Bay_in_Vietnam.jpg",
    content: `Mỵ Nương là con gái Hùng Vương, được tôn là nàng tiên hạ phàm. Vẻ đẹp và ân sủng của nàng là nguyên nhân cuộc chiến giữa Sơn Tinh và Thủy Tinh — biểu tượng sức mạnh thiên nhiên.

Một số bản dân gian cho rằng sau chia tay, nàng hóa thành núi hoặc hồ — nhắc con người sống hài hòa với đất trời.`,
  },
  {
    id: "chu-dong-tu",
    name: "Chử Đồng Tử",
    title: "Hiếu Tử Hóa Tiên",
    era: "Hùng Vương",
    excerpt: "Hiếu thảo với cha, gặp công chúa Tiên Dung, cùng hóa đạo trên sông Hồng.",
    source: "Wikipedia «Chử Đồng Tử»; đền Chử Đồng Tử — di tích quốc gia.",
    sourceUrl: "https://vi.wikipedia.org/wiki/Ch%E1%BB%AD_%C4%90%E1%BB%93ng_T%E1%BB%AD",
    image: "/images/realms/thuy-phu.png",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Hoan_Kiem_Lake_Hanoi.jpg/640px-Hoan_Kiem_Lake_Hanoi.jpg",
    realm: "thuy-phu",
    content: `Chử Đồng Tử sống nghèo bên sông Hồng. Khi cha mất, không có quan tài, chàng quấn chiếu chăn cha, ôm mộ đuối sông. Công chúa Tiên Dung du ngoạn, hai người gặp nhau và nên duyên.

Sau khi vua cha mất, hai người ẩn tu, hóa tiên trên sông. Nhân dân lập đền thờ ven Hồng — đặc biệt Hà Nội. Truyện ca ngợi hiếu nghĩa, gắn tín ngưỡng thờ Mẫu và thủy thần Bắc Bộ.`,
  },
  {
    id: "ho-guom-rua-vang",
    name: "Rùa Vàng Hồ Gươm",
    title: "Thanh Kiếm Trả Lại",
    era: "Lê Lợi",
    excerpt: "Rùa vàng trồi lên hồ Đại Cảm, đòi Lê Lợi trả gươm báu cho Long Vương.",
    source: "Wikipedia «Hồ Hoàn Kiếm»; «Thuận Thiên (kiếm)».",
    sourceUrl: "https://vi.wikipedia.org/wiki/H%E1%BB%93_Ho%C3%A0n_Ki%E1%BA%BFm",
    image: "/images/realms/thuy-phu.png",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Turtle_Tower_Hoan_Kiem_Lake.jpg/640px-Turtle_Tower_Hoan_Kiem_Lake.jpg",
    content: `Sau khi đánh đuổi giặc Minh, vua Lê Lợi cưỡi thuyền trên hồ Đại Cảm (nay Hồ Hoàn Kiếm, Hà Nội). Rùa vàng khổng lồ trồi lên, hóa tiên ông, đòi trả thanh gươm báu Long Vương từng ban.

Vua rút gươm giao lại; rùa cắn gươm trôi xuống đáy — hồ đổi tên Hồ Gươm. Truyền thuyết khẳng định quyền lực phải trả lại thiên mệnh khi hoàn thành sứ mệnh; Tháp Rùa là biểu tượng Thăng Long.`,
  },
  {
    id: "an-duong-co-than",
    name: "An Dương Vương & Cỏ Thần",
    title: "Thành Cổ Loa",
    era: "Thục Phán",
    excerpt: "Thành xoắn ốc, áo giáp Cỏ Thần — mất nước vì Mỵ Châu lộ bí kế.",
    source: "Wikipedia «An Dương Vương», «Cổ Loa»; khảo cổ thành Cổ Loa.",
    sourceUrl: "https://vi.wikipedia.org/wiki/An_D%C6%B0%C6%A1ng_V%C6%B0%C6%A1ng",
    image: "/images/realms/son-hai.png",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Co_Loa_Citadel_gate.jpg/640px-Co_Loa_Citadel_gate.jpg",
    content: `An Dương Vương được thần linh giúp xây thành Cổ Loa hình xoắn ốc — kiến trúc quân sự độc đáo thời đồ đồng (di tích thực tại Hà Nội). Vua được ban Cỏ Thần (lông gà) làm áo giáp.

Mỵ Châu bị Triệu Đà dụ dỗ, lấy lông gà trốn, làm mất phép. Thành sụp; vua và Mỵ Nương nhảy giếng. Bài học về bí mật quốc gia và trung nghĩa — ghi trong sử thư và Wikipedia.`,
  },
  {
    id: "lieu-hanh-cong-chua",
    name: "Mẫu Liễu Hạnh",
    title: "Thánh Mẫu Nhân Gian",
    era: "Lê Trung Hưng",
    excerpt: "Công chúa hóa thánh, hiển linh cứu dân — trung tâm tín ngưỡng Mẫu.",
    source: "Wikipedia «Liễu Hạnh»; UNESCO (2016) — Thực hành tín ngưỡng thờ Mẫu.",
    sourceUrl: "https://vi.wikipedia.org/wiki/Li%E1%BB%85u_H%E1%BA%A1nh",
    image: "/images/realms/u-minh.png",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Phu_Giay_Festival.jpg/640px-Phu_Giay_Festival.jpg",
    content: `Liễu Hạnh công chúa thời Lê, sau mất được thờ Thánh Mẫu, hiển linh giúp dân chài, buôn bán. Tín ngưỡng thờ Mẫu lan khắp Bắc — Nam (UNESCO 2016).

Truyện nhấn giá trị nhân đạo, bình đẳng giới, sự gần gũi giữa thiêng liêng và đời sống thường nhật.`,
  },
  {
    id: "ba-chua-kho",
    name: "Bà Chúa Kho",
    title: "Thánh Mẫu Tài Lộc",
    era: "Lê — Nguyễn",
    excerpt: "Thờ tại đền Cô Mễ, Bắc Ninh — gắn kho bạc và làm ăn.",
    source: "Wikipedia «Đền Bà Chúa Kho».",
    sourceUrl: "https://vi.wikipedia.org/wiki/%C4%90%E1%BB%81n_B%C3%A0_Ch%C3%BAa_Kho",
    image: "/images/realms/son-hai.png",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Bac_Ninh_Province%2C_Vietnam.jpg/640px-Bac_Ninh_Province%2C_Vietnam.jpg",
    content: `Bà Chúa Kho được tôn thờ tại làng Cô Mễ, Bắc Ninh — vùng buôn bán, luyện đồng truyền thống. Theo truyền thuyết, Bà giúp dân giữ của, làm ăn phát đạt.

Tín ngưỡng phản ánh khát vọng thịnh vượng trong nền kinh tế nông — thủ công và vai trò phụ nữ trong đời sống tâm linh.`,
  },
  {
    id: "luc-gioi",
    name: "Lục Giới Linh Nam",
    title: "Bản Đồ Vũ Trụ",
    era: "Thần Thoại",
    excerpt: "Thiên — Sơn — Thủy — U Minh — Nhân gian: khung vũ trụ quan Việt.",
    source: "Tổng hợp truyền thuyết dân gian; Wikipedia «Văn hóa Việt Nam».",
    sourceUrl: "https://vi.wikipedia.org/wiki/V%C4%83n_h%C3%B3a_Vi%E1%BB%87t_Nam",
    image: "/images/realms/u-minh.png",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Dong_Son_drum_Heger_I_b.jpg/640px-Dong_Son_drum_Heger_I_b.jpg",
    content: `Trong huyền thoại Việt, vũ trụ chia tầng: Thiên Giới (thiên mệnh), Sơn Hải (rừng núi), Thủy Phủ (sông biển), U Minh (cõi âm), Nhân Gian (cõi người).

Các tầng liên thông qua long mạch, sông ngòi, nghi lễ — bổ trợ lẫn nhau. Dự án Linh Nam tái hiện khung văn hóa này qua trải nghiệm số.`,
  },
];

export function getMythById(id: string): MythStory | undefined {
  return myths.find((m) => m.id === id);
}

export function getAllMythIds(): string[] {
  return myths.map((m) => m.id);
}
