# 🐉 LinhNam

> **Trải nghiệm tương tác về huyền thoại, tín ngưỡng và văn hóa Việt Nam trên nền tảng Web**

**LinhNam** là một web application mang tính trải nghiệm, được xây dựng để đưa các nội dung về **huyền thoại, sử thi, sinh vật, thần linh và các thế giới văn hóa Việt Nam** vào một không gian tương tác hiện đại.

Thay vì chỉ trình bày nội dung dưới dạng một website thông tin truyền thống, LinhNam tập trung vào **storytelling, visual experience, animation, scrolling interaction và khám phá nội dung theo từng "realm"**.

Bên cạnh phần trải nghiệm nội dung, hệ thống còn có các chức năng ứng dụng thực tế như:

* Đăng ký / đăng nhập
* Xác thực người dùng
* Session management
* MongoDB persistence
* Cửa hàng
* Giỏ hàng
* Thanh toán
* Quản lý tài khoản
* Nội dung huyền thoại và sử thi
* Audio experience
* Responsive UI
* Performance optimization

---

# 🌏 Ý tưởng

Việt Nam sở hữu một hệ thống phong phú về:

* Huyền thoại
* Truyền thuyết
* Sử thi
* Thần linh
* Sinh vật dân gian
* Các vùng văn hóa
* Tín ngưỡng
* Những câu chuyện được truyền qua nhiều thế hệ

Tuy nhiên, phần lớn nội dung này thường được tiếp cận thông qua các trang văn bản hoặc tài liệu rời rạc.

**LinhNam** được xây dựng với ý tưởng:

> **Biến việc tìm hiểu văn hóa Việt Nam thành một trải nghiệm khám phá tương tác.**

Người dùng không chỉ đọc nội dung mà có thể di chuyển qua các khu vực, khám phá câu chuyện, xem thông tin về các nhân vật/sinh vật và tương tác với giao diện được thiết kế theo chủ đề.

---

# ✨ Các tính năng chính

## 🏯 Khám phá các Realm

Hệ thống tổ chức thế giới LinhNam thành nhiều **realm** khác nhau.

Source hiện tại có các khu vực như:

* **Sơn Hải**
* **Thủy Phủ**
* **Thiên Giới**
* **U Minh**

Mỗi realm có nội dung, narrative và visual atmosphere riêng. Cấu trúc này được phản ánh trực tiếp trong `sections`, `app` và `data` của project.

```text
                    LINHNAM
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
     Sơn Hải       Thủy Phủ       Thiên Giới
                                      │
                                      ▼
                                    U Minh
```

---

# 📖 Huyền thoại & Sử thi

LinhNam có khu vực riêng dành cho nội dung huyền thoại.

Route:

```text
/huyen-thoai
```

Trang huyền thoại lấy dữ liệu từ `data/myths.ts` và hiển thị các myth dưới dạng card có hình ảnh, thời kỳ, mô tả và liên kết tới nội dung chi tiết. Source cũng ghi rõ phần nội dung tham chiếu tới Wikipedia và sử thư.

Người dùng có thể:

* Khám phá danh sách huyền thoại
* Xem thời kỳ
* Đọc phần tóm tắt
* Mở nội dung chi tiết
* Điều hướng sang khu vực Sử Thi

---

# 📚 Codex

Hệ thống có các thành phần liên quan đến **Codex** nhằm tổ chức và điều hướng nội dung văn hóa.

Các loại dữ liệu được tách thành các module riêng:

```text
data/
├── artifacts.ts
├── creatures.ts
├── deities.ts
├── legends.ts
├── lore.ts
├── myths.ts
├── realms.ts
├── site-facts.ts
├── shop.ts
├── realm-audio.ts
└── realm-narratives.ts
```

Cách tổ chức này giúp nội dung được tách khỏi UI và có thể mở rộng độc lập với component.

---

# 🐉 Sinh vật & Thần linh

LinhNam có data model riêng cho các nhóm nội dung như:

* Creatures
* Deities
* Legends
* Myths
* Lore
* Artifacts

Thay vì hard-code toàn bộ nội dung trực tiếp vào page, dữ liệu được tổ chức thành các module riêng trong `data/`.

Điều này giúp:

* Dễ thêm nội dung mới
* Dễ tái sử dụng dữ liệu
* Tách content khỏi presentation
* Giảm sự phụ thuộc giữa UI và data

---

# 🛍️ Cửa hàng

LinhNam không chỉ là một website nội dung.

Hệ thống có khu vực:

```text
/cua-hang
```

với các thành phần phục vụ trải nghiệm cửa hàng.

Source hiện có data riêng cho shop và page cửa hàng riêng biệt.

Luồng cơ bản:

```text
Product
   │
   ▼
Product Detail
   │
   ▼
Add to Cart
   │
   ▼
Shopping Cart
   │
   ▼
Checkout
   │
   ▼
Payment
```

---

# 🛒 Giỏ hàng

Hệ thống có route riêng cho giỏ hàng:

```text
/gio-hang
```

cho phép người dùng quản lý các sản phẩm trước khi tiến hành thanh toán.

---

# 💳 Thanh toán

Hệ thống có route:

```text
/thanh-toan
```

được xây dựng như một bước riêng trong purchase flow.

Việc tách riêng cart và checkout giúp flow thương mại điện tử rõ ràng hơn:

```text
Cửa hàng
   ↓
Giỏ hàng
   ↓
Thanh toán
```

Route thanh toán được triển khai trực tiếp trong App Router.

---

# 🔐 Authentication

LinhNam có hệ thống authentication riêng thay vì chỉ sử dụng giao diện login giả lập.

Các route liên quan gồm:

```text
/dang-nhap
/dang-ky
/xac-thuc
/tai-khoan
```

App cũng có:

```text
components/auth/
components/providers/auth-provider.tsx
lib/auth-session.ts
lib/auth-types.ts
lib/auth-validation.ts
```

cho thấy authentication được tổ chức thành nhiều lớp thay vì nhồi toàn bộ logic vào một page.

---

# 🛡️ Authentication Validation

Hệ thống có validation cho:

### Email

* Kiểm tra email rỗng
* Kiểm tra format
* Giới hạn độ dài

### Họ tên

* Tối thiểu 2 ký tự
* Tối đa 60 ký tự
* Kiểm tra ký tự hợp lệ

### Password

Password yêu cầu:

* Ít nhất 8 ký tự
* Ít nhất một chữ thường
* Ít nhất một chữ hoa
* Ít nhất một chữ số
* Tối đa 72 ký tự

Ngoài ra hệ thống kiểm tra password confirmation.

---

# 🚫 Login Attempt Protection

Một điểm đáng chú ý trong authentication là cơ chế giới hạn đăng nhập sai.

Hệ thống hiện cấu hình:

```text
Maximum attempts: 5
Lockout duration: 15 minutes
```

Sau khi vượt quá số lần đăng nhập sai, người dùng bị khóa tạm thời trước khi có thể thử lại. Logic này được triển khai trong `auth-validation.ts`.

---

# 🔑 Password Hashing

Project có sử dụng:

```text
bcryptjs
```

trong dependencies để phục vụ xử lý password.

Điều này cho thấy project đã hướng tới authentication thực tế thay vì lưu password dạng plain text ở frontend.

---

# 🗄️ MongoDB

LinhNam sử dụng:

```text
MongoDB
    +
Mongoose
```

để lưu trữ dữ liệu.

Dependency:

```text
mongoose
```

được khai báo trong `package.json`.

Database connection được tách thành:

```text
lib/mongodb.ts
```

và sử dụng `MONGODB_URI` từ environment variables.

```text
Application
     │
     ▼
connectDB()
     │
     ▼
Mongoose
     │
     ▼
MongoDB
```

Connection được cache ở global scope để tránh tạo nhiều connection trong môi trường development/server reload.

---

# ⚡ Performance

Project có riêng:

```text
lib/performance.ts
components/providers/performance-provider.tsx
```

cho phần performance-related logic.

Ngoài ra project sử dụng **Lenis** cho smooth scrolling và có provider riêng:

```text
lenis-provider.tsx
```

Cách tiếp cận này cho thấy performance và scroll experience được xem như một phần của architecture thay vì chỉ là styling.

---

# 🎨 Interactive Experience

Một trong những điểm nổi bật của LinhNam là phần visual interaction.

Project sử dụng:

* Framer Motion
* GSAP
* Lenis
* Custom cursor
* Page transitions
* Loading screen
* Scroll storytelling
* Audio context
* Theme provider
* Mouse interaction

Các chức năng này được tổ chức thành các provider và component riêng.

---

# 🌀 Scroll Storytelling

Homepage sử dụng:

```text
ScrollStory
```

để xây dựng trải nghiệm kể chuyện theo scroll.

Homepage hiện kết hợp:

```text
Hero
  ↓
Stats
  ↓
Realms
  ↓
Footer
```

với các lớp visual như:

```text
HeroDepthLayers
HomeAudioButton
Navbar
```

Source của homepage thể hiện trực tiếp cấu trúc này.

---

# 🔊 Audio Experience

Project có:

```text
AudioContext
HomeAudioButton
realm-audio.ts
realm-audio-toggle.tsx
```

cho phép hệ thống quản lý audio experience và audio theo realm.

---

# 🎭 Visual System

Project có các nhóm component chuyên biệt:

```text
components/
├── layout/
├── visual/
├── transition/
├── scroll/
├── realm/
├── myth/
├── interaction/
└── ui/
```

Điều này giúp tách:

* Layout
* Animation
* Content
* Interaction
* Realm
* Visual effect
* UI primitive

thành các phần riêng biệt.

---

# 🧱 Kiến trúc tổng quan

```text
                         LINHNAM
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
        Presentation                 Application
              │                           │
      ┌───────┼────────┐          ┌───────┼────────┐
      │       │        │          │       │        │
      ▼       ▼        ▼          ▼       ▼        ▼
     UI    Motion    Scroll      Auth    Shop    Account
      │       │        │          │       │        │
      └───────┼────────┘          └───────┼────────┘
              │                           │
              └─────────────┬─────────────┘
                            ▼
                         Next.js
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
          Server / API              MongoDB
                                        │
                                        ▼
                                     Mongoose
```

---

# 🏗️ Project Structure

```text
LinhNam/
│
├── app/
│   ├── codex/
│   ├── coi-gioi/
│   ├── cua-hang/
│   ├── dang-ky/
│   ├── dang-nhap/
│   ├── gio-hang/
│   ├── gioi-thieu/
│   ├── huyen-thoai/
│   ├── ky-thu/
│   ├── linh-thu/
│   ├── son-hai/
│   ├── su-thi/
│   ├── tai-khoan/
│   ├── thanh-toan/
│   ├── thien-gioi/
│   ├── thuy-phu/
│   ├── u-minh/
│   ├── xac-thuc/
│   │
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── template.tsx
│
├── animations/
│
├── components/
│   ├── auth/
│   ├── codex/
│   ├── content/
│   ├── interaction/
│   ├── layout/
│   ├── myth/
│   ├── pages/
│   ├── providers/
│   ├── realm/
│   ├── scroll/
│   ├── transition/
│   ├── ui/
│   └── visual/
│
├── data/
│   ├── artifacts.ts
│   ├── creatures.ts
│   ├── deities.ts
│   ├── legends.ts
│   ├── lore.ts
│   ├── myths.ts
│   ├── realm-audio.ts
│   ├── realm-narratives.ts
│   ├── realms.ts
│   ├── shop.ts
│   └── site-facts.ts
│
├── lib/
│   ├── models/
│   ├── api-response.ts
│   ├── auth-session.ts
│   ├── auth-types.ts
│   ├── auth-validation.ts
│   ├── cn.ts
│   ├── mongodb.ts
│   └── performance.ts
│
├── public/
│
├── sections/
│   ├── home/
│   ├── realm/
│   ├── son-hai/
│   ├── thien-gioi/
│   ├── thuy-phu/
│   └── u-minh/
│
├── styles/
│
├── .env.example
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

Cấu trúc thực tế của repository thể hiện rõ việc tách route, component, data, section và infrastructure utility.

---

# 🛠️ Tech Stack

## Framework

* **Next.js 16**
* **React 19**
* **TypeScript 5**

## Styling

* **Tailwind CSS 4**
* `tailwind-merge`
* `clsx`

## Animation & Interaction

* **Framer Motion**
* **GSAP**
* **Lenis**

## UI

* **Lucide React**

## Backend / Data

* **MongoDB**
* **Mongoose**

## Authentication

* **bcryptjs**
* Custom authentication/session utilities
* Client-side validation and login-attempt protection

Các dependency trên được khai báo trực tiếp trong `package.json` của project.

---

# 🔄 Luồng hệ thống

## Người dùng chưa đăng nhập

```text
User
 │
 ▼
Trang chủ
 │
 ├── Khám phá Realm
 ├── Đọc Huyền Thoại
 ├── Đọc Sử Thi
 └── Khám phá nội dung
```

## Người dùng đăng nhập

```text
User
 │
 ▼
Đăng nhập
 │
 ▼
Validation
 │
 ├── Sai → Login Attempt Protection
 │
 └── Đúng
       │
       ▼
   Auth Session
       │
       ▼
    Tài khoản
```

## Mua hàng

```text
Cửa hàng
   │
   ▼
Chọn sản phẩm
   │
   ▼
Giỏ hàng
   │
   ▼
Thanh toán
```

---

# 🚀 Cài đặt

## Yêu cầu

* Node.js
* npm
* MongoDB hoặc MongoDB Atlas

---

## 1. Clone repository

```bash
git clone https://github.com/KhangDo25/LinhNam.git
cd LinhNam
```

---

## 2. Cài dependencies

```bash
npm install
```

---

## 3. Cấu hình Environment Variables

Project cung cấp:

```text
.env.example
```

Tạo file:

```text
.env
```

và cấu hình MongoDB:

```env
MONGODB_URI=your_mongodb_connection_string
```

`lib/mongodb.ts` đọc trực tiếp `MONGODB_URI` từ environment variable và sẽ báo lỗi nếu biến này chưa được cấu hình.

---

## 4. Chạy development server

```bash
npm run dev
```

Sau đó mở:

```text
http://localhost:3000
```

---

# 📦 Build Production

Build:

```bash
npm run build
```

Chạy production server:

```bash
npm run start
```

Kiểm tra code:

```bash
npm run lint
```

Project cũng có script deploy riêng trong `package.json`.

---

# 🔐 Environment & Security

Các thông tin nhạy cảm không nên commit trực tiếp vào repository.

Project sử dụng:

```text
.env
```

để phân tách configuration khỏi source code.

MongoDB URI được lấy từ:

```text
process.env.MONGODB_URI
```

thay vì hard-code connection string trong source.

---

# 📊 Trạng thái dự án

| Thành phần                     | Trạng thái |
| ------------------------------ | ---------- |
| Next.js App Router             | ✅          |
| React + TypeScript             | ✅          |
| Responsive UI                  | ✅          |
| Interactive Landing Experience | ✅          |
| Scroll Storytelling            | ✅          |
| Animation System               | ✅          |
| Multiple Realms                | ✅          |
| Mythology / Lore System        | ✅          |
| Codex                          | ✅          |
| Audio Experience               | ✅          |
| Authentication UI              | ✅          |
| Form Validation                | ✅          |
| Login Attempt Protection       | ✅          |
| Password Hashing               | ✅          |
| MongoDB Integration            | ✅          |
| Mongoose Models / Data Layer   | 🔄         |
| Account System                 | ✅          |
| Shopping Cart                  | ✅          |
| Shop                           | ✅          |
| Checkout Flow                  | ✅          |
| Automated Testing              | ⏳          |
| Production Hardening           | 🔄         |

**Trạng thái:** `In Development`

---

# 🧠 Những gì dự án tập trung

LinhNam không chỉ tập trung vào việc xây dựng UI.

Các vấn đề kỹ thuật chính được thực hành gồm:

### Frontend Architecture

* Next.js App Router
* Component-based architecture
* Reusable UI components
* Route-based page organization
* Data-driven content rendering

### Interaction Engineering

* Scroll-driven animation
* Page transitions
* Motion effects
* Custom cursor
* Audio interaction
* Loading experience
* Theme management

### Backend Integration

* MongoDB
* Mongoose
* Authentication/session
* Environment configuration
* Data persistence

### Application Design

* Authentication flow
* Account management
* Shopping flow
* Cart
* Checkout
* Content management

---

# 🔮 Định hướng phát triển

### Content

* [ ] Mở rộng hệ thống thần thoại
* [ ] Bổ sung thêm sinh vật và thần linh
* [ ] Bổ sung thêm realm
* [ ] Timeline lịch sử
* [ ] Bản đồ văn hóa tương tác

### User

* [ ] User profile hoàn chỉnh
* [ ] Bookmark /收藏 nội dung
* [ ] Lịch sử khám phá
* [ ] Personalized content
* [ ] User achievements

### Commerce

* [ ] Order history
* [ ] Product management
* [ ] Inventory management
* [ ] Payment gateway thực tế
* [ ] Order tracking

### Engineering

* [ ] Automated testing
* [ ] API documentation
* [ ] Error monitoring
* [ ] CI/CD
* [ ] Performance benchmarking
* [ ] Production security hardening
* [ ] Accessibility audit

---

# 🎯 Điểm nổi bật kỹ thuật

Một trong những mục tiêu của LinhNam là kết hợp **experiential frontend** với các thành phần của một web application thực tế.

```text
         EXPERIENCE
             │
    ┌────────┼────────┐
    ▼        ▼        ▼
 Animation  Story    Audio
    │        │        │
    └────────┼────────┘
             │
             ▼
        APPLICATION
             │
    ┌────────┼────────┐
    ▼        ▼        ▼
   Auth     Shop     Account
    │        │        │
    └────────┼────────┘
             │
             ▼
        DATA LAYER
             │
             ▼
          MongoDB
```

Điểm quan trọng của project là không tách trải nghiệm visual khỏi application architecture: phần **content, authentication, persistence và commerce** được xây dựng cùng trong một Next.js application.

---

# 👨‍💻 Tác giả

**Khang Do**

Sinh viên Công nghệ thông tin

GitHub: [@KhangDo25](https://github.com/KhangDo25)

---

# 📄 License

<<<<<<< HEAD
Dự án được xây dựng nhằm mục đích **học tập, nghiên cứu, thực hành Web Development và xây dựng portfolio cá nhân**.
=======
Dự án được xây dựng nhằm mục đích **học tập, nghiên cứu, thực hành Web Development và xây dựng portfolio cá nhân**.
>>>>>>> a77da19 (Cập nhật dự án Linh Nam)
