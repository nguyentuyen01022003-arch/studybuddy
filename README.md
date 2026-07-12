# StudyBuddy 📚

Ứng dụng tìm bạn học — Next.js 14 + Supabase + Tailwind CSS. Song ngữ Việt/Anh.

## Tính năng
- Đăng ký / đăng nhập (Supabase Auth)
- Hồ sơ: tên, trường, ngành, môn học, mục tiêu, giờ rảnh, online/offline, thành phố
- Gợi ý bạn học thông minh (chấm điểm theo môn chung, ngành, thành phố, giờ rảnh)
- Tìm kiếm & lọc theo môn, ngành, thành phố, hình thức, giờ rảnh
- Gửi / chấp nhận / từ chối lời mời kết nối
- Chat realtime sau khi kết nối
- Đặt lịch học chung
- Chuyển ngôn ngữ VI/EN ngay trên thanh điều hướng

## Cài đặt
1. Tạo project tại https://supabase.com
2. Vào **SQL Editor**, chạy toàn bộ file `supabase/schema.sql`
3. Copy **Project URL** và **anon key** (Settings → API) vào `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
4. (Khuyến nghị khi dev) Tắt xác nhận email: Authentication → Providers → Email → tắt "Confirm email"
5. Chạy:
   ```bash
   npm install
   npm run dev
   ```

## Cấu trúc
```
app/            # Các trang (App Router)
  login/ register/ dashboard/ search/ profile/
  connections/ chat/ chat/[id]/ sessions/
components/     # Navbar, PartnerCard, ScheduleModal, LanguageSwitcher
lib/
  supabase/     # Supabase client
  i18n/         # Từ điển VI/EN + LanguageContext
  matching.ts   # Bộ lọc + thuật toán gợi ý
  usePartners.ts# Hook tải profile/kết nối dùng chung
  types.ts      # Kiểu dữ liệu
supabase/
  schema.sql    # Toàn bộ schema + RLS + realtime
middleware.ts   # Bảo vệ route theo phiên đăng nhập
```

## Mở rộng sau này
- Thêm nhóm học (group study), video call, đánh giá bạn học
- Chuyển bộ lọc sang query phía server khi dữ liệu lớn
- Thông báo realtime cho lời mời kết nối
