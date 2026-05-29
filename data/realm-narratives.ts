export interface NarrativeBlock {
  title: string;
  body: string;
}

export const realmNarratives: Record<string, NarrativeBlock[]> = {
  "thien-gioi": [
    {
      title: "Thiên Mệnh và Nhân Gian",
      body:
        "Trong tư tưởng Việt Nam cổ, trời không xa cách con người. Vua quan được gọi là Thiên Tử, Thánh Gióng sau khi đánh giặc thì bay về trời, và các vị thần vẫn hiển linh qua đền chùa, lễ hội. Thiên Giới không phải nơi vô hình mà là tầng quyền lực đạo đức — nơi thiên mệnh được ban, và nhân quả được ghi vào sổ phong thần.",
    },
    {
      title: "Thiên Đình trong Sử Thư",
      body:
        "Đại Việt Sử Ký Toàn Thư và các truyện dân gian như Lĩnh Nam chích quái mô tả các vị thần, tiên, rồng can thiệp vào đời sống đất nước. Thiên Đình là hình ảnh tập trung quyền lực thiêng liêng, tương tự khái niệm cổ đại về trời che chở và đất nuôi dưỡng — song được Việt hóa qua nghi lễ, tục lệ địa phương.",
    },
    {
      title: "Nghi Lễ và Đền Thờ",
      body:
        "Từ đền Gióng, đền Bà Chúa Kho đến lễ hội chùa Hương, người Việt luôn duy trì cầu nối với cõi trên. Phong thần, tế lễ, và truyền thuyết anh hùng tạo nên một Thiên Giới sống động — không chỉ trong sách mà trong đời sống cộng đồng.",
    },
  ],
  "son-hai": [
    {
      title: "Sơn Tinh và Linh Sơn",
      body:
        "Miền núi Việt Bắc và Tây Bắc là nơi truyền thuyết Sơn Tinh — Thủy Tinh được lưu truyền rộng rãi. Mỗi đỉnh núi, thác nước, rừng già được gán tên thần, thánh, hoặc mẫu. Sơn Hải trong Linh Nam là không gian của linh mộc và thú thần — nơi con người đi vào rừng phải giữ lễ, giữ lời thề với đất.",
    },
    {
      title: "Rừng Cổ và Mạch Linh",
      body:
        "Theo quan niệm dân gian, cây cổ thụ có linh, không được chặt bừa. Rừng là kho tang thiêng liêng của tổ tiên và linh thú. Sách Linh Thú ghi nhận các loài như hổ, rắn, khỉ, chim — vừa là sinh vật thực, vừa là hình tượng trong mỹ thuật Đông Sơn và truyện kể.",
    },
    {
      title: "An Dương Vương và Cổ Loa",
      body:
        "Thành Cổ Loa với vòng xoắn ốc là di chỉ khảo cổ thực, gắn truyền thuyết An Dương Vương và Cỏ Thần. Sơn Hải ở đây hòa với lịch sử — rừng núi che chở kinh thành, và mất mát quốc gia khi bí kế bị lộ.",
    },
  ],
  "thuy-phu": [
    {
      title: "Long Vương và Sông Nước",
      body:
        "Sông Hồng, sông Cửu Long, và vô số sông ngòi là mạch sống của nền văn minh lúa nước. Truyền thuyết Lạc Long Quân, Chử Đồng Tử, Rùa Vàng Hồ Gươm đều đặt trung tâm vào thủy thần. Thủy Phủ là cõi của Long Vương, tiên cá, và những linh vật gắn với nước.",
    },
    {
      title: "Long Cung và Ngư Dân",
      body:
        "Ngư dân, nông dân ven sông thờ cá Ông, thờ Bà, cúng sông nước trước mùa vụ. Long Cung trong trí tưởng tượng là cung điện dưới đáy — nơi ngọc trai, san hô, và ánh sáng lờ mờ. Đó là biểu tượng của sự giàu có và cả sự uy nghiêm của thiên nhiên.",
    },
    {
      title: "Thủy Tinh và Lũ Lụt",
      body:
        "Truyện Sơn Tinh — Thủy Tinh giải thích địa hình đồi núi và lũ lụt: mỗi lần nước dâng, núi lại cao thêm. Người Việt cổ đọc thiên nhiên như cuộc đối thoại giữa các vị thần, không phải tai họa vô nghĩa.",
    },
  ],
  "u-minh": [
    {
      title: "Cõi U Minh trong Tín Ngưỡng",
      body:
        "U Minh là cõi âm, nơi vong linh sau khi mất được cúng giỗ, được đèn và hương dẫn đường. Tín ngưỡng thờ cúng tổ tiên của người Việt gắn chặt với ranh giới sống — chết: không phải kết thúc tuyệt đối mà là chuyển tầng.",
    },
    {
      title: "Đèn U Minh và Vu Lan",
      body:
        "Lễ Vu Lan, lễ Tảo mộ, và thắp hương ngày rằm là cách nhân gian gửi ân tình xuống cõi dưới. Đèn u minh trong truyện dân gian là ánh sáng duy nhất xuyên sương mù — biểu tượng hiếu đạo và nhớ nguồn.",
    },
    {
      title: "Mẫu Liễu Hạnh và Cõi Linh",
      body:
        "Tín ngưỡng Thánh Mẫu, đặc biệt Mẫu Liễu Hạnh, cho thấy cõi u minh không chỉ đen tối mà còn có mặt nhân độ, cứu độ. Phủ Mẫu, hầu đồng, và lễ hội là di sản UNESCO — chứng minh sự sống động của không gian tâm linh Việt.",
    },
  ],
};

export function getNarrativesForRealm(slug: string): NarrativeBlock[] {
  return realmNarratives[slug] ?? [];
}
