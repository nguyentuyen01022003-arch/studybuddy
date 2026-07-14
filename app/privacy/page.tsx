"use client";

import { useI18n } from "@/lib/i18n/LanguageContext";

const CONTENT = {
  vi: {
    title: "Chính sách quyền riêng tư",
    updated: "Cập nhật lần cuối: 13/07/2026",
    sections: [
      {
        h: "1. Dữ liệu chúng tôi thu thập",
        p: "Email và mật khẩu (được mã hoá) khi đăng ký; thông tin hồ sơ bạn cung cấp (tên, trường, ngành, môn học, mục tiêu, giờ rảnh, thành phố, ảnh đại diện); tin nhắn và lịch học bạn tạo; dữ liệu kỹ thuật cơ bản (thống kê truy cập ẩn danh).",
      },
      {
        h: "2. Mục đích sử dụng",
        p: "Dữ liệu chỉ dùng để vận hành StudyMate: gợi ý bạn học phù hợp, hiển thị hồ sơ với người dùng khác, gửi/nhận tin nhắn, lên lịch học và cải thiện sản phẩm. Chúng tôi không bán dữ liệu của bạn cho bên thứ ba.",
      },
      {
        h: "3. Ai nhìn thấy gì",
        p: "Hồ sơ của bạn (trừ email) hiển thị với người dùng đã đăng nhập khác để ghép cặp. Tin nhắn chỉ hiển thị giữa hai người trong cuộc trò chuyện. Email của bạn không công khai.",
      },
      {
        h: "4. Lưu trữ & bảo mật",
        p: "Dữ liệu được lưu trên Supabase (hạ tầng đám mây bảo mật) và được bảo vệ bằng các chính sách phân quyền ở tầng cơ sở dữ liệu (Row Level Security). Mật khẩu được băm, không lưu dạng văn bản thuần.",
      },
      {
        h: "5. Dịch vụ bên thứ ba",
        p: "Đăng nhập Google (Google cung cấp email và tên); lưu trữ Supabase; triển khai và thống kê Vercel. Các dịch vụ này có chính sách riêng tư riêng của họ.",
      },
      {
        h: "6. Quyền của bạn",
        p: "Bạn có thể xem, sửa hồ sơ bất cứ lúc nào trong trang Hồ sơ. Bạn có quyền yêu cầu xoá tài khoản và toàn bộ dữ liệu bằng cách liên hệ với chúng tôi.",
      },
      {
        h: "7. Trẻ em",
        p: "Dịch vụ không dành cho người dưới 13 tuổi. Nếu phát hiện tài khoản của trẻ dưới 13 tuổi, chúng tôi sẽ xoá tài khoản đó.",
      },
      {
        h: "8. Liên hệ",
        p: "Mọi yêu cầu về quyền riêng tư xin gửi về: nguyentuyen01022003@gmail.com.",
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    updated: "Last updated: July 13, 2026",
    sections: [
      {
        h: "1. Data we collect",
        p: "Email and password (encrypted) at sign-up; profile information you provide (name, school, major, subjects, goals, availability, city, avatar); messages and study sessions you create; basic technical data (anonymous usage analytics).",
      },
      {
        h: "2. How we use it",
        p: "Data is used only to run StudyMate: suggesting compatible partners, showing your profile to other users, sending/receiving messages, scheduling sessions, and improving the product. We do not sell your data to third parties.",
      },
      {
        h: "3. Who sees what",
        p: "Your profile (except your email) is visible to other signed-in users for matching. Messages are visible only to the two people in a conversation. Your email is never public.",
      },
      {
        h: "4. Storage & security",
        p: "Data is stored on Supabase (secure cloud infrastructure) and protected with database-level Row Level Security policies. Passwords are hashed, never stored in plain text.",
      },
      {
        h: "5. Third-party services",
        p: "Google Sign-In (Google provides your email and name); Supabase for storage; Vercel for hosting and analytics. These services have their own privacy policies.",
      },
      {
        h: "6. Your rights",
        p: "You can view and edit your profile at any time on the Profile page. You may request deletion of your account and all data by contacting us.",
      },
      {
        h: "7. Children",
        p: "The service is not intended for children under 13. If we discover an account belonging to a child under 13, we will delete it.",
      },
      {
        h: "8. Contact",
        p: "Privacy requests: nguyentuyen01022003@gmail.com.",
      },
    ],
  },
};

export default function PrivacyPage() {
  const { lang } = useI18n();
  const c = CONTENT[lang];
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{c.title}</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{c.updated}</p>
      <div className="card mt-6 space-y-5">
        {c.sections.map((s) => (
          <section key={s.h}>
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">{s.h}</h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{s.p}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
