# Nhiệm vụ 17: Backend API (Express.js + SQLite + VnExpress RSS)

Dự án Backend phục vụ cho bài tập nhóm (2 bạn) - Nhiệm vụ 17.

## 🛠 Công nghệ sử dụng
- **Ngôn ngữ / Framework**: Node.js & Express.js
- **Database**: SQLite (thông qua `better-sqlite3`, lưu trữ file cục bộ, không cần cài server DB)
- **Authentication**: JWT (JSON Web Token) + Password Hashing với `bcryptjs`
- **RSS Feed**: `rss-parser` tích hợp nguồn tin tức từ [VnExpress RSS](https://vnexpress.net/rss)

---

## 👥 Phân chia công việc trong nhóm

### Thành viên 1 (Phần tô đậm - Đang thực hiện)
- [x] Chọn ngôn ngữ BE (Express.js) & Khởi tạo dự án
- [x] Tìm hiểu và xây dựng cấu trúc dự án (Layered Architecture)
- [x] Xây dựng biến môi trường, biến toàn cục & kết nối SQLite
- [x] Chuẩn hóa cấu trúc Request/Response & Xử lý lỗi toàn cục
- [x] Tạo API đăng ký / đăng nhập (Auth với JWT)
- [x] Tạo API public (Đọc tin tức + tích hợp VnExpress RSS)

### Thành viên 2 (Phần còn lại - Kế thừa Base & Auth)
- [ ] Tạo API private (Thêm, sửa, xóa, tìm kiếm, sắp xếp tin tức)
- [ ] Tạo API upload / xóa file

---

## 🌿 Chiến lược phân nhánh Git (Branching Strategy)
- `main`: Nhánh production / nộp bài cuối cùng.
- `develop`: Nhánh tích hợp chung của 2 thành viên.
- `feature/init-auth-public-news`: Nhánh của Thành viên 1 (gồm 6 commit tương ứng 6 gạch đầu dòng).
- `feature/private-news-upload`: Nhánh của Thành viên 2 (kéo từ `develop` sau khi Thành viên 1 merge).

---

## 🚀 Hướng dẫn cài đặt và khởi chạy

1. **Cài đặt thư viện**:
   ```bash
   npm install
   ```

2. **Cấu hình biến môi trường**:
   Sao chép `.env.example` thành `.env`:
   ```bash
   cp .env.example .env
   ```

3. **Chạy server**:
   - Chế độ phát triển (auto reload):
     ```bash
     npm run dev
     ```
   - Chế độ chuẩn:
     ```bash
     npm start
     ```
