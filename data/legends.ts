export interface Legend {
  id: string;
  name: string;
  title: string;
  era: string;
  desc: string;
  content: string;
  image?: string;
  realm: "Thiên Giới" | "Trần Gian" | "Thủy Phủ" | "U Minh" | string;
}

export const legends: Legend[] = [
  {
    id: "than-kim-quy",
    name: "Rùa Vàng Thần (Thần Kim Quy)",
    title: "Hộ Quốc Thần Linh",
    era: "An Dương Vương / Hậu Lê",
    realm: "Thủy Phủ",
    desc: "Vị thần linh thiêng trấn giữ đại dương, hiển linh trợ giúp thánh quân xây thành đắp lũy và trao bảo vật định quốc an dân.",
    content: "Thần Kim Quy là biểu tượng của trí tuệ vĩnh hằng và sự che chở cho giang sơn bờ cõi đất Việt. Thời Thục Phán, Thần rẽ nước hiện lên giúp vua xây thành Cổ Loa vững chãi trước quỷ ma quấy phá, lại tặng móng thần để chế ra Linh Quang Kim Trảo Thần Nỏ bắn một phát hạ hàng vạn quân thù. Đến thời Hậu Lê, Thần lại hiển linh tại hồ Tả Vọng để nhận lại gươm thần Thuận Thiên sau khi bờ cõi đã sạch bóng giặc ngoại xâm.",
    image: "/images/realms/son-hai.png",
  },
  {
  id: "banh-chung-banh-day",
  name: "Bánh Chưng Bánh Dày",
  title: "Vũ Trụ Hòa Hợp / Tế Lễ Cội Nguồn",
  era: "Thời Đại Hùng Vương (Đời Vua Hùng Thứ 6)",
  realm: "Trần Gian",
  desc: "Hình tượng Trời tròn Đất vuông trong tâm thức Việt cổ, kết tinh từ hạt ngọc diêu bông và lòng hiếu thảo vô bờ bến.",
  content: "Là lễ vật thần thánh do Hoàng tử Lang Liêu sáng tạo nên sau khi được thần nhân báo mộng. Bánh Dày trắng muốt, tròn trịa tượng trưng cho Trời cao vĩnh hằng; Bánh Chưng xanh vuông vức, gói ghém thịt mỡ, đậu xanh bên trong lớp lá dong đại diện cho Đất mẹ trù phú, muôn loài thảo mộc và sự sinh sôi. Không chỉ là sản vật ẩm thực, hai món báu vật này là biểu tượng tối cao cho vũ trụ quan hài hòa, lòng biết ơn sâu sắc đối với công ơn dưỡng dục của cha mẹ và tổ tiên truyền đời của dân tộc Linh Nam."
  },
  {
  id: "son-tinh-thuy-tinh",
  name: "Sơn Tinh — Thủy Tinh",
  title: "Thiên Tai Cuồng Nộ / Hào Khí Trị Thủy",
  era: "Thời Đại Hùng Vương (Đời Vua Hùng Thứ 18)",
  realm: "Trần Gian", 
  desc: "Khúc tráng ca vĩ đại về cuộc đối đầu giữa thần núi và thần biển, biểu tượng cho ý chí khuất phục thiên tai của người Việt cổ.",
  content: "Không chỉ là cuộc so tài sính lễ cưới Công chúa Mỵ Nương, truyền thuyết này là tấm gương phản chiếu cuộc chiến sinh tồn ngàn năm của cư dân đồng bằng châu thổ sông Hồng trước mùa lũ dữ. Khi Thủy Tinh dâng nước cao bao nhiêu, hô mưa gọi gió làm ngập lụt kinh thành, thì Sơn Tinh lại dùng thần thông dời non lấp bể, dựng thành lũy cao bấy nhiêu để chặn đứng dòng nước dữ. Hình tượng Sơn Tinh vĩnh viễn là biểu tượng bất tử cho tinh thần hộ quốc, ý chí kiên cường đắp đê trị thủy, định hình nên giang sơn gấm vóc Linh Nam.",
  image: "/images/realms/son-hai.png",
  },
  {
  id: "luc-gioi", 
  name: "Lục Giới Linh Nam",
  title: "Vũ Trụ Cổ Sơ / Thần Ma Biến Chuyển",
  era: "Vĩnh Hằng",
  realm: "Trần Gian", 
  desc: "Sáu cõi giới tâm linh đan xen tạo nên thế giới quan sử thi huyền bí của đất Việt.",
  content:
    "Vũ trụ quan Linh Nam được chia làm sáu cõi bao gồm: Thiên Giới tôn nghiêm, Trần Gian trù phú, Thủy Phủ sâu thẳm, U Minh cô tịch, Sơn Hải kỳ vĩ và Yêu Giới ma mị. Mỗi cõi giới sở hữu luật trị vì riêng, linh khí riêng và các bậc đại thần linh canh giữ, nhưng tất cả đều vận hành hài hòa và liên kết chặt chẽ thông qua các mạch long mạch thiêng liêng chảy dọc giang sơn gấm vóc.",
  image: "/images/realms/son-hai.png", 
  },
];
