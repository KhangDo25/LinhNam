import type { Citation } from "@/components/content/verified-source";

export interface PageFactBlock {
  title: string;
  body: string;
  citations: Citation[];
}

export const homeFacts: PageFactBlock = {
  title: "Về Linh Nam",
  body:
    "Linh Nam là trải nghiệm số tái hiện không gian thần thoại — phong kiến Việt Nam theo tư tưởng Lục Giới (thiên, địa, nhân). Các truyện trong mục Sử Thi và Huyền Thoại được tóm lược từ Wikipedia tiếng Việt, sử thư và tài liệu văn hóa được Bộ Văn hóa — UNESCO công bố, kèm liên kết nguồn gốc.",
  citations: [
    {
      label: "Văn hóa Việt Nam — Wikipedia",
      url: "https://vi.wikipedia.org/wiki/V%C4%83n_h%C3%B3a_Vi%E1%BB%87t_Nam",
    },
    {
      label: "Truyện cổ tích Việt Nam — Wikipedia",
      url: "https://vi.wikipedia.org/wiki/Truy%E1%BB%87n_c%E1%BB%95_t%C3%ADch_Vi%E1%BB%87t_Nam",
    },
  ],
};

export const suThiFacts: PageFactBlock = {
  title: "Cách biên soạn Sử Thi",
  body:
    "Mỗi truyện ghi rõ thời kỳ, tóm tắt và liên kết Wikipedia tiếng Việt tương ứng. Ảnh minh họa lấy từ Wikimedia Commons (giấy phép tự do). Không tự thêm chi tiết không có trong nguồn.",
  citations: [
    {
      label: "Wikipedia tiếng Việt",
      url: "https://vi.wikipedia.org/wiki/Trang_Ch%C3%ADnh",
    },
    {
      label: "Wikimedia Commons",
      url: "https://commons.wikimedia.org/wiki/Trang_Ch%C3%ADnh",
    },
  ],
};

export const shopFacts: PageFactBlock = {
  title: "Cửa hàng (demo)",
  body:
    "Vật phẩm trong Cửa Hàng là biểu tượng văn hóa — không phải hàng hóa thật. Thanh toán dùng Linh Thạch ảo trên trình duyệt. Tài khoản yêu cầu xác thực email (mã OTP demo) trước khi mua.",
  citations: [
    {
      label: "Di sản văn hóa phi vật thể Việt Nam — UNESCO",
      url: "https://ich.unesco.org/en/state/viet-nam-VN",
    },
  ],
};

export const gioiThieuFacts: PageFactBlock = {
  title: "Cam kết nội dung",
  body:
    "Dự án ưu tiên ngôn ngữ và biểu tượng Việt Nam, tránh pha trộn thuật ngữ nước ngoài không cần thiết. Số liệu di sản (UNESCO, di tích quốc gia) chỉ ghi khi có trang tham chiếu chính thức.",
  citations: [
    {
      label: "Bảo tàng Lịch sử Quốc gia Việt Nam",
      url: "https://www.baotanglichsu.vn/",
    },
    {
      label: "UNESCO — Việt Nam",
      url: "https://www.unesco.org/vi/countries/viet-nam",
    },
  ],
};
