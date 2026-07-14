"use client";

import { useI18n } from "@/lib/i18n/LanguageContext";

const CONTENT = {
  vi: {
    title: "Điều khoản sử dụng",
    updated: "Cập nhật lần cuối: 13/07/2026",
    sections: [
      {
        h: "1. Chấp nhận điều khoản",
        p: "Khi tạo tài khoản hoặc sử dụng StudyMate, bạn đồng ý với các điều khoản này. Nếu không đồng ý, vui lòng không sử dụng dịch vụ.",
      },
      {
        h: "2. Dịch vụ",
        p: "StudyMate là nền tảng miễn phí giúp người học tìm bạn học phù hợp theo môn học, ngành, thành phố và lịch rảnh; kết nối, trò chuyện và lên lịch học cùng nhau.",
      },
      {
        h: "3. Tài khoản",
        p: "Bạn phải cung cấp thông tin chính xác và tự bảo mật tài khoản của mình. Bạn phải đủ 13 tuổi trở lên để sử dụng dịch vụ. Mỗi người chỉ nên có một tài khoản.",
      },
      {
        h: "4. Quy tắc ứng xử",
        p: "Không quấy rối, lừa đảo, mạo danh, gửi nội dung khiêu dâm, thù ghét, bạo lực hoặc spam. Không dùng StudyMate cho mục đích thương mại trái phép. Vi phạm có thể dẫn đến khoá tài khoản vĩnh viễn.",
      },
      {
        h: "5. Nội dung của bạn",
        p: "Bạn giữ quyền sở hữu nội dung mình đăng (hồ sơ, tin nhắn, ảnh đại diện) và chịu trách nhiệm về nội dung đó. Bạn cho phép StudyMate lưu trữ và hiển thị nội dung nhằm vận hành dịch vụ.",
      },
      {
        h: "6. An toàn",
        p: "Hãy dùng tính năng Báo cáo và Chặn khi gặp hành vi không phù hợp. Khi gặp gỡ trực tiếp bạn học, hãy chọn nơi công cộng và tự cân nhắc an toàn cá nhân.",
      },
      {
        h: "7. Miễn trừ trách nhiệm",
        p: "Dịch vụ được cung cấp \"nguyên trạng\". StudyMate không đảm bảo kết quả học tập và không chịu trách nhiệm cho tương tác giữa người dùng ngoài nền tảng.",
      },
      {
        h: "8. Thay đổi",
        p: "Chúng tôi có thể cập nhật điều khoản; thay đổi quan trọng sẽ được thông báo trên trang web. Tiếp tục sử dụng nghĩa là bạn chấp nhận điều khoản mới.",
      },
      {
        h: "9. Liên hệ",
        p: "Mọi thắc mắc xin gửi về: nguyentuyen01022003@gmail.com.",
      },
    ],
  },
  en: {
    title: "Terms of Service",
    updated: "Last updated: July 13, 2026",
    sections: [
      {
        h: "1. Acceptance",
        p: "By creating an account or using StudyMate, you agree to these terms. If you do not agree, please do not use the service.",
      },
      {
        h: "2. The service",
        p: "StudyMate is a free platform that helps learners find compatible study partners by subject, major, city and schedule; connect, chat and plan study sessions together.",
      },
      {
        h: "3. Accounts",
        p: "You must provide accurate information and keep your account secure. You must be at least 13 years old to use the service. One account per person.",
      },
      {
        h: "4. Code of conduct",
        p: "No harassment, scams, impersonation, sexual, hateful or violent content, or spam. No unauthorized commercial use. Violations may lead to permanent account suspension.",
      },
      {
        h: "5. Your content",
        p: "You own the content you post (profile, messages, avatar) and are responsible for it. You grant StudyMate permission to store and display it in order to operate the service.",
      },
      {
        h: "6. Safety",
        p: "Use the Report and Block features when you encounter inappropriate behavior. When meeting study partners in person, choose public places and use your own judgment.",
      },
      {
        h: "7. Disclaimer",
        p: "The service is provided \"as is\". StudyMate does not guarantee study outcomes and is not responsible for interactions between users outside the platform.",
      },
      {
        h: "8. Changes",
        p: "We may update these terms; significant changes will be announced on the site. Continued use means you accept the new terms.",
      },
      {
        h: "9. Contact",
        p: "Questions: nguyentuyen01022003@gmail.com.",
      },
    ],
  },
};

export default function TermsPage() {
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
