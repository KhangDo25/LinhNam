export type SourceType =
  | "primary-text"
  | "official"
  | "unesco"
  | "academic"
  | "museum"
  | "project";

export type HistoricalStatus =
  | "myth"
  | "legend"
  | "folktale"
  | "religious-tradition"
  | "historical-tradition"
  | "historical-site"
  | "project-fiction";

export type MythCategory =
  | "than-thoai"
  | "truyen-thuyet"
  | "co-tich"
  | "tin-nguong"
  | "lich-su-truyen-thuyet"
  | "di-san"
  | "worldbuilding";

export interface MythSource {
  title: string;
  type: SourceType;
  url: string;
  note?: string;
}

export interface MythStory {
  id: string;
  name: string;
  title: string;
  era: string;

  category: MythCategory;
  historicalStatus: HistoricalStatus;

  excerpt: string;
  content: string;

  sources: MythSource[];
  image: string;
  imageUrl?: string;
  realm?: string;
}

export const myths: MythStory[] = [
  {
    id: "lac-long-au-co",
    name: "Lạc Long Quân & Âu Cơ",
    title: "Tiên Rồng — Gốc Dòng Họ",
    era: "Thời đại Hùng Vương",

    category: "than-thoai",
    historicalStatus: "myth",

    excerpt:
      "Truyền thuyết kể Lạc Long Quân và Âu Cơ sinh ra một trăm người con. Năm mươi theo cha xuống vùng sông nước, năm mươi theo mẹ lên vùng núi.",

    content: `
Lạc Long Quân và Âu Cơ là truyền thuyết về nguồn gốc cộng đồng người Việt.

Theo truyền thuyết, Lạc Long Quân thuộc nòi Rồng, Âu Cơ thuộc dòng Tiên. Hai người kết duyên và Âu Cơ sinh ra một bọc trăm trứng, nở thành một trăm người con.

Sau đó, hai người chia các con: năm mươi người theo Lạc Long Quân xuống vùng sông nước và năm mươi người theo Âu Cơ lên vùng núi.

Hình tượng "trăm con cùng một bọc" thường được liên hệ với khái niệm "đồng bào", nhấn mạnh ý niệm cùng một nguồn gốc và sự cố kết cộng đồng.

Đây là truyền thuyết về nguồn gốc dân tộc, không phải một sự kiện lịch sử có thể xác minh bằng phương pháp khảo cổ học.
`,

    sources: [
      {
        title: "Di tích lịch sử Đền Hùng — Cục Di sản văn hóa",
        type: "official",
        url: "https://dsvh.gov.vn/di-tich-lich-su-den-hung-2939",
        note:
          "Nguồn chính thức về không gian thờ cúng Hùng Vương, Âu Cơ và Lạc Long Quân."
      },
      {
        title: "Bức giá tượng Lạc Long Quân — Cục Di sản văn hóa",
        type: "official",
        url: "https://dsvh.gov.vn/bao-vat-quoc-gia-1758",
        note:
          "Tư liệu chính thức về hiện vật liên quan hình tượng Lạc Long Quân."
      }
    ],

    image: "/images/realms/thuy-phu.png",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Dong_Son_drum_Heger_I_b.jpg/640px-Dong_Son_drum_Heger_I_b.jpg",
    realm: "thuy-phu"
  },

  {
    id: "son-tinh-thuy-tinh",
    name: "Sơn Tinh & Thủy Tinh",
    title: "Trận Chiến Núi — Nước",
    era: "Thời đại Hùng Vương",

    category: "truyen-thuyet",
    historicalStatus: "legend",

    excerpt:
      "Truyền thuyết kể Sơn Tinh và Thủy Tinh cùng cầu hôn Mỵ Nương. Thủy Tinh dâng nước đánh Sơn Tinh, còn Sơn Tinh nâng núi chống lại nước lũ.",

    content: `
Sơn Tinh và Thủy Tinh là một truyền thuyết nổi tiếng gắn với thời đại Hùng Vương.

Theo truyện, vua Hùng có người con gái là Mỵ Nương. Sơn Tinh, vị thần núi, và Thủy Tinh, vị thần nước, cùng đến cầu hôn.

Vua Hùng đưa ra điều kiện về sính lễ. Sơn Tinh đến trước và cưới được Mỵ Nương.

Thủy Tinh đến sau, tức giận và dâng nước đuổi đánh Sơn Tinh. Sơn Tinh nâng núi, đắp lũy chống lại nước. Năm nào Thủy Tinh cũng dâng nước, nhưng Sơn Tinh lại chống đỡ.

Câu chuyện thường được hiểu như một cách lý giải dân gian về lũ lụt và cuộc đấu tranh của cư dân đồng bằng Bắc Bộ trước thiên tai.

Các chi tiết về việc "nâng núi" thuộc phạm vi truyền thuyết, không phải mô tả địa chất thực tế.
`,

    sources: [
      {
        title: "Lĩnh Nam chích quái",
        type: "primary-text",
        url: "",
        note:
          "Văn bản truyền kỳ trung đại thường được dẫn khi nghiên cứu truyền thuyết Sơn Tinh — Thủy Tinh."
      },
      {
        title: "Tư liệu di sản văn hóa Việt Nam",
        type: "official",
        url: "https://dsvh.gov.vn/",
        note:
          "Cổng thông tin Cục Di sản văn hóa."
      }
    ],

    image: "/images/realms/son-hai.png",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Mau_Son_Mountain.jpg/640px-Mau_Son_Mountain.jpg",
    realm: "son-hai"
  },

  {
    id: "thanh-giong",
    name: "Thánh Gióng",
    title: "Người Anh Hùng Làng Phù Đổng",
    era: "Thời đại Hùng Vương",

    category: "truyen-thuyet",
    historicalStatus: "legend",

    excerpt:
      "Truyền thuyết kể một cậu bé làng Phù Đổng lớn vụt thành tráng sĩ, cưỡi ngựa sắt đánh giặc rồi bay về trời tại núi Sóc.",

    content: `
Thánh Gióng là một trong những hình tượng anh hùng nổi tiếng nhất trong truyền thuyết Việt Nam.

Theo truyền thuyết, Gióng sinh ra tại làng Phù Đổng. Khi đất nước có giặc, cậu bé bất ngờ lớn nhanh thành một tráng sĩ và yêu cầu nhà vua chuẩn bị ngựa sắt, roi sắt và áo giáp sắt.

Gióng cưỡi ngựa ra trận đánh giặc. Khi roi sắt gãy, chàng nhổ tre bên đường để tiếp tục chiến đấu.

Sau khi hoàn thành nhiệm vụ, Gióng cưỡi ngựa lên núi Sóc rồi bay về trời.

Ngày nay, hình tượng Thánh Gióng gắn với hệ thống di tích và lễ hội tại Phù Đổng và Sóc. Lễ hội Gióng tại đền Phù Đổng và đền Sóc được UNESCO ghi danh vào Danh sách Di sản văn hóa phi vật thể đại diện của nhân loại năm 2010.

UNESCO mô tả Gióng là một anh hùng, vị thần và vị thánh mang tính huyền thoại, được cộng đồng tôn kính.
`,

    sources: [
      {
        title: "Lễ hội Gióng tại đền Phù Đổng và đền Sóc — UNESCO",
        type: "unesco",
        url: "https://ich.unesco.org/en/RL/giong-festival-of-phu-djong-and-soc-temples-00443",
        note:
          "Được UNESCO ghi danh năm 2010."
      }
    ],

    image: "/images/realms/thien-gioi.png",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Den_Phu_Dong_Thang_Long.jpg/640px-Den_Phu_Dong_Thang_Long.jpg",
    realm: "thien-gioi"
  },

  {
    id: "tam-cam",
    name: "Tấm Cám",
    title: "Nhân Quả — Công Lý",
    era: "Truyện cổ tích",

    category: "co-tich",
    historicalStatus: "folktale",

    excerpt:
      "Truyện cổ tích kể về Tấm, cô gái chịu nhiều áp bức từ mẹ kế và Cám, trải qua nhiều lần biến đổi trước khi giành lại cuộc sống và địa vị của mình.",

    content: `
Tấm Cám là truyện cổ tích thần kỳ phổ biến trong kho tàng truyện dân gian Việt Nam.

Tấm sống cùng mẹ kế và Cám. Sau nhiều lần bị đối xử bất công, Tấm nhận được sự trợ giúp kỳ ảo và có cơ hội thay đổi cuộc đời.

Trong các dị bản phổ biến, Tấm trải qua nhiều lần biến hóa sau khi bị hãm hại. Cuối cùng, Tấm trở lại với thân phận của mình và câu chuyện kết thúc bằng sự trừng phạt đối với những người gây ra bất công.

Truyện thuộc phạm vi văn học dân gian. Các dị bản có thể khác nhau đáng kể về chi tiết, đặc biệt là phần kết.
`,

    sources: [
      {
        title: "Kho tàng truyện cổ tích Việt Nam — Nguyễn Đổng Chi",
        type: "academic",
        url: "",
        note:
          "Một trong những công trình sưu tầm và khảo cứu quan trọng về truyện cổ tích Việt Nam."
      }
    ],

    image: "/images/realms/thien-gioi.png",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Vietnamese_fairy_tales_book_cover.jpg/640px-Vietnamese_fairy_tales_book_cover.jpg"
  },

  {
    id: "so-dua",
    name: "Sọ Dừa",
    title: "Ở Hiền Gặp Lành",
    era: "Truyện cổ tích",

    category: "co-tich",
    historicalStatus: "folktale",

    excerpt:
      "Một chàng trai có hình dạng kỳ lạ nhưng thông minh, tài giỏi và nhân hậu; cuối cùng vượt qua định kiến về ngoại hình và có cuộc sống hạnh phúc.",

    content: `
Sọ Dừa là truyện cổ tích thần kỳ Việt Nam.

Theo truyện, một người phụ nữ nghèo sinh ra một đứa con có hình dạng giống như một chiếc sọ dừa. Tuy có vẻ ngoài kỳ dị, Sọ Dừa lại có năng lực và phẩm chất tốt.

Chàng làm thuê, chăn bò và thể hiện sự chăm chỉ, thông minh. Sau đó chàng học hành thành tài và có địa vị.

Một trong những chủ đề nổi bật của truyện là việc đánh giá con người không chỉ dựa vào vẻ bề ngoài mà còn dựa vào phẩm chất và năng lực.
`,

    sources: [
      {
        title: "Kho tàng truyện cổ tích Việt Nam — Nguyễn Đổng Chi",
        type: "academic",
        url: "",
        note:
          "Nguồn sưu tầm và khảo cứu truyện cổ tích Việt Nam."
      }
    ],

    image: "/images/realms/son-hai.png",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Coconut_face_carving.jpg/640px-Coconut_face_carving.jpg"
  },

  {
    id: "banh-chung-banh-day",
    name: "Bánh Chưng — Bánh Dày",
    title: "Vuông Đất — Tròn Trời",
    era: "Thời đại Hùng Vương",

    category: "truyen-thuyet",
    historicalStatus: "legend",

    excerpt:
      "Truyền thuyết kể Lang Liêu làm bánh chưng và bánh dày để dâng vua, từ đó trở thành câu chuyện giải thích ý nghĩa của hai loại bánh trong truyền thống Tết.",

    content: `
Truyền thuyết Bánh Chưng — Bánh Dày kể về việc vua Hùng muốn chọn người kế vị và yêu cầu các con dâng lễ vật.

Trong khi các hoàng tử tìm kiếm những sản vật quý, Lang Liêu — người con có hoàn cảnh khó khăn hơn — sử dụng những nguyên liệu quen thuộc như gạo nếp, đậu và thịt để làm bánh.

Bánh chưng có hình vuông, còn bánh dày có hình tròn. Trong cách giải thích phổ biến của truyền thuyết, hai hình dạng này gắn với quan niệm về đất và trời.

Đây là một truyền thuyết giải thích nguồn gốc và ý nghĩa văn hóa của món ăn truyền thống, không phải tài liệu lịch sử chứng minh bánh được tạo ra chính xác vào thời Hùng Vương.
`,

    sources: [
      {
        title: "Tư liệu di sản văn hóa Việt Nam",
        type: "official",
        url: "https://dsvh.gov.vn/",
        note:
          "Nguồn chính thức về di sản văn hóa Việt Nam."
      }
    ],

    image: "/images/realms/thien-gioi.png",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Banh_chung_Vietnam.jpg/640px-Banh_chung_Vietnam.jpg"
  },

  {
    id: "my-nuong",
    name: "Mỵ Nương",
    title: "Công Chúa Thời Hùng Vương",
    era: "Thời đại Hùng Vương",

    category: "truyen-thuyet",
    historicalStatus: "legend",

    excerpt:
      "Mỵ Nương là danh xưng dành cho con gái vua Hùng, nổi bật trong truyền thuyết Sơn Tinh — Thủy Tinh.",

    content: `
Mỵ Nương là danh xưng được sử dụng trong các truyền thuyết về thời Hùng Vương để chỉ con gái của vua.

Trong truyền thuyết Sơn Tinh — Thủy Tinh, Mỵ Nương là con gái vua Hùng và là nhân vật trung tâm của cuộc tranh tài giữa Sơn Tinh và Thủy Tinh.

Nhân vật Mỵ Nương vì vậy đóng vai trò kết nối giữa câu chuyện về hôn nhân, quyền lực của nhà vua và cuộc đối đầu mang tính biểu tượng giữa núi và nước.

Không có cơ sở để xác định Mỵ Nương trong truyền thuyết là một nhân vật lịch sử cụ thể.
`,

    sources: [
      {
        title: "Lĩnh Nam chích quái",
        type: "primary-text",
        url: "",
        note:
          "Văn bản trung đại có liên quan đến hệ thống truyền thuyết về thời kỳ đầu của lịch sử Việt Nam."
      }
    ],

    image: "/images/realms/thien-gioi.png",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Ha_Long_Bay_in_Vietnam.jpg/640px-Ha_Long_Bay_in_Vietnam.jpg",
    realm: "thien-gioi"
  },

  {
    id: "chu-dong-tu",
    name: "Chử Đồng Tử",
    title: "Chàng Trai Bên Sông Hồng",
    era: "Thời đại Hùng Vương",

    category: "truyen-thuyet",
    historicalStatus: "legend",

    excerpt:
      "Truyền thuyết kể về Chử Đồng Tử, chàng trai nghèo gặp công chúa Tiên Dung và sau đó trở thành một nhân vật được thờ phụng trong tín ngưỡng dân gian.",

    content: `
Chử Đồng Tử là một trong những nhân vật nổi tiếng của truyền thuyết Việt Nam, gắn với vùng sông Hồng.

Theo truyền thuyết, Chử Đồng Tử có hoàn cảnh nghèo khó và sống cùng cha. Sau khi cha mất, chàng tiếp tục cuộc sống bên sông.

Một lần công chúa Tiên Dung du ngoạn trên sông và hai người gặp nhau. Cuộc gặp gỡ dẫn đến hôn nhân dù không có sự sắp đặt trước của vua cha.

Trong những phần tiếp theo của truyền thuyết, Chử Đồng Tử và Tiên Dung tiếp xúc với việc buôn bán, tu hành và cuối cùng được thần hóa.

Câu chuyện trở thành một phần của hệ thống tín ngưỡng và di tích thờ Chử Đồng Tử ở vùng đồng bằng sông Hồng.
`,

    sources: [
      {
        title: "Tư liệu di sản văn hóa Việt Nam",
        type: "official",
        url: "https://dsvh.gov.vn/",
        note:
          "Nguồn chính thức để đối chiếu di tích và thực hành tín ngưỡng liên quan."
      }
    ],

    image: "/images/realms/thuy-phu.png",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Hoan_Kiem_Lake_Hanoi.jpg/640px-Hoan_Kiem_Lake_Hanoi.jpg",
    realm: "thuy-phu"
  },

  {
    id: "ho-guom-rua-vang",
    name: "Rùa Vàng Hồ Gươm",
    title: "Thanh Kiếm Trả Lại",
    era: "Thời Lê",

    category: "truyen-thuyet",
    historicalStatus: "historical-tradition",

    excerpt:
      "Truyền thuyết kể Lê Lợi nhận thanh gươm báu để đánh giặc Minh và sau khi chiến thắng đã trả lại gươm cho Rùa Vàng tại hồ Hoàn Kiếm.",

    content: `
Truyền thuyết Hồ Hoàn Kiếm gắn với Lê Lợi và cuộc khởi nghĩa Lam Sơn.

Theo truyền thuyết, Lê Lợi nhận được thanh gươm báu có liên hệ với Long Vương. Thanh gươm giúp ông trong cuộc chiến chống quân Minh.

Sau khi giành thắng lợi, Lê Lợi đi thuyền trên hồ. Một Rùa Vàng xuất hiện và yêu cầu nhà vua hoàn trả thanh gươm.

Lê Lợi trao lại thanh gươm cho Rùa Vàng. Từ truyền thuyết này, hồ được gọi là Hồ Hoàn Kiếm.

Truyền thuyết là một phần quan trọng của ký ức văn hóa về Lê Lợi và không nên được trình bày như bằng chứng lịch sử về sự tồn tại của thanh gươm hay Rùa Vàng.
`,

    sources: [
      {
        title: "Sở Văn hóa và Thể thao Hà Nội",
        type: "official",
        url: "https://sovhtt.hanoi.gov.vn/khai-mac-trung-bay-hoang-de-le-thai-to-nguoi-khai-sang-vuong-trieu-hau-le/",
        note:
          "Tư liệu chính thức về di tích Hồ Hoàn Kiếm và truyền thuyết trả gươm."
      }
    ],

    image: "/images/realms/thuy-phu.png",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Turtle_Tower_Hoan_Kiem_Lake.jpg/640px-Turtle_Tower_Hoan_Kiem_Lake.jpg",
    realm: "thuy-phu"
  },

  {
    id: "an-duong-co-than",
    name: "An Dương Vương & Nỏ Thần",
    title: "Cổ Loa — Nỏ Thần — Mỵ Châu",
    era: "Thế kỷ III trước Công nguyên",

    category: "lich-su-truyen-thuyet",
    historicalStatus: "historical-site",

    excerpt:
      "An Dương Vương gắn với nhà nước Âu Lạc và kinh đô Cổ Loa. Truyền thuyết về thần Kim Quy, nỏ thần và Mỵ Châu — Trọng Thủy trở thành một phần quan trọng của ký ức văn hóa về Cổ Loa.",

    content: `
An Dương Vương là nhân vật gắn với sự hình thành nhà nước Âu Lạc và kinh đô Cổ Loa.

Theo tư liệu của Cục Di sản văn hóa, khu di tích Cổ Loa có giá trị khảo cổ rất lớn, với nhiều lớp văn hóa kéo dài từ thời tiền sử đến thời kỳ Đông Sơn. Cổ Loa được xác định là kinh đô của Âu Lạc thời An Dương Vương.

Song song với lớp dữ liệu lịch sử và khảo cổ là truyền thuyết về thần Kim Quy giúp An Dương Vương xây thành và trao nỏ thần.

Truyền thuyết Mỵ Châu — Trọng Thủy kể rằng Trọng Thủy lấy bí mật về nỏ thần từ Mỵ Châu, khiến cơ chế phòng thủ của Cổ Loa bị vô hiệu hóa.

Cần phân biệt hai lớp thông tin:

- Cổ Loa là một di tích khảo cổ có thật.
- Thần Kim Quy và nỏ thần thuộc lớp truyền thuyết.

Vì vậy, Linh Nam trình bày Cổ Loa như một trường hợp kết hợp giữa lịch sử, khảo cổ học và truyền thuyết dân gian.
`,

    sources: [
      {
        title: "Di tích Cổ Loa — Cục Di sản văn hóa",
        type: "official",
        url: "https://dsvh.gov.vn/di-tich-lich-su-kien-truc-nghe-thuat-va-khao-co-co-loa-2958",
        note:
          "Nguồn chính thức về khảo cổ, lịch sử và cấu trúc thành Cổ Loa."
      },
      {
        title: "Thành Cổ Loa — Cổng thông tin đối ngoại Chính phủ",
        type: "official",
        url: "https://scov.gov.vn/dat-nuoc-con-nguoi/dat-nuoc-viet-nam/thanh-co-loa.html",
        note:
          "Tư liệu về Cổ Loa, An Dương Vương, nỏ thần và truyền thuyết Mỵ Châu — Trọng Thủy."
      }
    ],

    image: "/images/realms/son-hai.png",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Co_Loa_Citadel_gate.jpg/640px-Co_Loa_Citadel_gate.jpg",
    realm: "son-hai"
  },

  {
    id: "lieu-hanh-cong-chua",
    name: "Mẫu Liễu Hạnh",
    title: "Thánh Mẫu Trong Tín Ngưỡng Tam Phủ",
    era: "Tín ngưỡng Việt Nam",

    category: "tin-nguong",
    historicalStatus: "religious-tradition",

    excerpt:
      "Liễu Hạnh là một trong những nhân vật trung tâm của tín ngưỡng thờ Mẫu Tam phủ của người Việt.",

    content: `
Liễu Hạnh là một nhân vật quan trọng trong tín ngưỡng thờ Mẫu của người Việt.

UNESCO ghi nhận Liễu Hạnh là một trong các Mẫu được cộng đồng thờ phụng trong thực hành tín ngưỡng thờ Mẫu Tam phủ.

Theo mô tả của UNESCO, Liễu Hạnh được xem là một tiên nữ xuống trần, sống như con người và trở thành một nhân vật thiêng được cộng đồng thờ phụng.

Tín ngưỡng thờ Mẫu Tam phủ được UNESCO ghi danh vào Danh sách Di sản văn hóa phi vật thể đại diện của nhân loại năm 2016.

Trong Linh Nam, Liễu Hạnh nên được trình bày như một nhân vật tín ngưỡng và truyền thuyết, không khẳng định bà là một nhân vật lịch sử đã được xác minh.
`,

    sources: [
      {
        title: "Practices related to the Viet beliefs in the Mother Goddesses of Three Realms — UNESCO",
        type: "unesco",
        url: "https://ich.unesco.org/en/RL/practices-related-to-the-viet-beliefs-in-the-mother-goddesses-of-three-realms-01064",
        note:
          "Được UNESCO ghi danh năm 2016."
      }
    ],

    image: "/images/realms/u-minh.png",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Phu_Giay_Festival.jpg/640px-Phu_Giay_Festival.jpg",
    realm: "u-minh"
  },

  {
    id: "ba-chua-kho",
    name: "Bà Chúa Kho",
    title: "Tín Ngưỡng Bà Chúa Kho",
    era: "Thời Lý — truyền thống hậu thế",

    category: "tin-nguong",
    historicalStatus: "religious-tradition",

    excerpt:
      "Bà Chúa Kho được thờ tại đền Bà Chúa Kho ở Cô Mễ, Bắc Ninh. Theo truyền thuyết địa phương, bà có công quản lý và bảo đảm lương thực cho quân đội nhà Lý.",

    content: `
Bà Chúa Kho là nhân vật được thờ tại đền Bà Chúa Kho ở Cô Mễ, Bắc Ninh.

Theo truyền thuyết địa phương được cơ quan văn hóa Bắc Ninh giới thiệu, bà là một người phụ nữ có công giữ kho lương cho quân đội nhà Lý trên chiến tuyến sông Như Nguyệt và được nhân dân lập đền thờ.

Đền Bà Chúa Kho nằm trên núi Kho ở Cô Mễ và được công nhận là di tích lịch sử cấp quốc gia từ năm 1989.

Tín ngưỡng hiện nay gắn với việc hành hương, cầu tài lộc và các nghi lễ dân gian.

Các thông tin về thân thế và cuộc đời Bà Chúa Kho cần được hiểu là truyền thuyết và tín ngưỡng địa phương, không phải tiểu sử lịch sử đã được xác minh đầy đủ.
`,

    sources: [
      {
        title: "Lễ hội Đền Bà Chúa Kho — Cổng thông tin tỉnh Bắc Ninh",
        type: "official",
        url: "https://bacninh.gov.vn/en/news/-/details/37632/khai-mac-le-hoi-en-ba-chua-kho-93458101",
        note:
          "Nguồn chính thức của tỉnh Bắc Ninh về đền và truyền thuyết Bà Chúa Kho."
      },
      {
        title: "Lễ hội Đền Bà Chúa Kho — Thành ủy Bắc Ninh",
        type: "official",
        url: "https://thanhuy.bacninh.gov.vn/nhung-le-hoi-truyen-thong-tieu-bieu-thanh-pho-bac-ninh-le-hoi-den-ba-chua-kho-phuong-vu-ninh-a48i1693.html",
        note:
          "Tư liệu về di tích, lễ hội và truyền thuyết địa phương."
      }
    ],

    image: "/images/realms/son-hai.png",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Bac_Ninh_Province%2C_Vietnam.jpg/640px-Bac_Ninh_Province%2C_Vietnam.jpg"
  },

  {
    id: "luc-gioi",
    name: "Lục Giới Linh Nam",
    title: "Bản Đồ Thế Giới Linh Nam",
    era: "Worldbuilding của Linh Nam",

    category: "worldbuilding",
    historicalStatus: "project-fiction",

    excerpt:
      "Hệ thống sáu cõi được xây dựng riêng cho dự án Linh Nam nhằm kết nối các câu chuyện và không gian văn hóa Việt Nam.",

    content: `
Lục Giới Linh Nam là hệ thống worldbuilding do dự án Linh Nam xây dựng.

Các cõi gồm:

- Thiên Giới
- Sơn Hải
- Thủy Phủ
- U Minh
- Nhân Gian
- Không Gian Linh Nam

Đây không phải là một hệ thống vũ trụ quan lịch sử đã được xác lập trong văn hóa Việt Nam.

Dự án sử dụng các hình tượng và khái niệm quen thuộc trong văn hóa dân gian Việt Nam để tạo ra một cấu trúc thế giới thống nhất cho trải nghiệm số.

Vì vậy, nội dung của entry này thuộc về worldbuilding của Linh Nam, không phải tư liệu lịch sử hay tín ngưỡng truyền thống.
`,

    sources: [
      {
        title: "Linh Nam Project",
        type: "project",
        url: "",
        note:
          "Worldbuilding nguyên bản của dự án."
      }
    ],

    image: "/images/realms/u-minh.png",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Dong_Son_drum_Heger_I_b.jpg/640px-Dong_Son_drum_Heger_I_b.jpg",
    realm: "u-minh"
  }
];

export function getMythById(id: string): MythStory | undefined {
  return myths.find((myth) => myth.id === id);
}

export function getAllMythIds(): string[] {
  return myths.map((myth) => myth.id);
}