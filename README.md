# Eng4IT IELTS — Hệ thống học tiếng Anh thông minh

🌐 **https://ielts.eng4it.com**

Ứng dụng học IELTS với Spaced Repetition System (SRS) — thay thế Anki, tích hợp giáo trình từ [eng4it.com](https://eng4it.com).

## Tính năng

- 📚 **Flashcard** — Lật thẻ EN ↔ VN với IPA phát âm
- 🔁 **SRS (Spaced Repetition)** — Thuật toán SM-2, tự động nhắc ôn
- 🧪 **Quiz** — Kiểm tra mỗi bài, ≥80% mới mở bài tiếp
- 🔒 **Gate System** — Pass bài trước → unlock bài sau
- 📊 **Dashboard** — Theo dõi tiến độ, streak, từ đã thuộc
- 👤 **User Management** — Đăng nhập Email/Google, dữ liệu đồng bộ

## Tech Stack

- **Frontend:** React (Vite)
- **Backend/Auth/DB:** Supabase (PostgreSQL)
- **Hosting:** Cloudflare Pages
- **SRS Algorithm:** SM-2 (SuperMemo 2)

## Setup

```bash
npm install
cp .env.example .env
# Fill in Supabase URL + anon key
npm run dev
```

## Deploy

```bash
bash deploy.sh "commit message"
```

## Database

Run `supabase-schema.sql` in Supabase SQL Editor to create tables.

## Related

- Blog: [eng4it.com](https://eng4it.com)
- Giáo trình IELTS: [eng4it.com/ielts/](https://eng4it.com/ielts/)
