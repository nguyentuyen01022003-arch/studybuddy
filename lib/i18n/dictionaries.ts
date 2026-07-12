export type Lang = "vi" | "en";

export const dictionaries = {
  vi: {
    nav: {
      dashboard: "Gợi ý",
      search: "Tìm kiếm",
      connections: "Kết nối",
      chat: "Trò chuyện",
      sessions: "Lịch học",
      profile: "Hồ sơ",
      login: "Đăng nhập",
      register: "Đăng ký",
      logout: "Đăng xuất"
    },
    landing: {
      heroTitle: "Tìm bạn học lý tưởng của bạn",
      heroSubtitle:
        "StudyBuddy kết nối bạn với những người học cùng môn, cùng mục tiêu — học online hoặc gặp trực tiếp tại thành phố của bạn.",
      ctaStart: "Bắt đầu miễn phí",
      ctaLogin: "Tôi đã có tài khoản",
      f1Title: "Ghép đôi thông minh",
      f1Desc: "Gợi ý bạn học dựa trên môn học, ngành, thành phố và giờ rảnh của bạn.",
      f2Title: "Kết nối an toàn",
      f2Desc: "Gửi lời mời kết nối, chỉ trò chuyện khi cả hai đồng ý.",
      f3Title: "Học có kế hoạch",
      f3Desc: "Chat và đặt lịch học chung ngay trong ứng dụng."
    },
    auth: {
      loginTitle: "Đăng nhập",
      registerTitle: "Tạo tài khoản",
      name: "Họ và tên",
      email: "Email",
      password: "Mật khẩu",
      loginBtn: "Đăng nhập",
      registerBtn: "Đăng ký",
      noAccount: "Chưa có tài khoản?",
      haveAccount: "Đã có tài khoản?",
      registerHere: "Đăng ký ngay",
      loginHere: "Đăng nhập",
      checkEmail: "Đăng ký thành công! Hãy kiểm tra email để xác nhận tài khoản, sau đó đăng nhập.",
      passwordHint: "Ít nhất 6 ký tự"
    },
    profile: {
      title: "Hồ sơ của tôi",
      subtitle: "Hồ sơ đầy đủ giúp gợi ý bạn học chính xác hơn.",
      name: "Họ và tên",
      school: "Trường",
      major: "Ngành học",
      subjects: "Môn học",
      subjectsHint: "Cách nhau bằng dấu phẩy, ví dụ: Toán, Tiếng Anh, Lập trình",
      goals: "Mục tiêu học tập",
      goalsPlaceholder: "Ví dụ: Ôn IELTS 7.0, qua môn Giải tích...",
      availableTime: "Thời gian rảnh",
      mode: "Hình thức học",
      online: "Online",
      offline: "Trực tiếp",
      both: "Cả hai",
      city: "Thành phố",
      save: "Lưu hồ sơ",
      saved: "Đã lưu hồ sơ!"
    },
    time: {
      morning: "Buổi sáng",
      afternoon: "Buổi chiều",
      evening: "Buổi tối",
      weekend: "Cuối tuần"
    },
    dashboard: {
      title: "Bạn học được gợi ý cho bạn",
      subtitle: "Dựa trên môn học, ngành, thành phố và giờ rảnh của bạn.",
      completeProfile: "Hãy hoàn thiện hồ sơ để nhận gợi ý chính xác hơn.",
      completeProfileBtn: "Hoàn thiện hồ sơ",
      empty: "Chưa có ai phù hợp. Hãy quay lại sau nhé!"
    },
    search: {
      title: "Tìm bạn học",
      subject: "Môn học",
      major: "Ngành",
      city: "Thành phố",
      mode: "Hình thức",
      time: "Giờ rảnh",
      any: "Tất cả",
      results: "kết quả",
      noResults: "Không tìm thấy ai phù hợp với bộ lọc."
    },
    card: {
      connect: "Kết nối",
      pending: "Đã gửi lời mời",
      respond: "Chờ bạn trả lời",
      connected: "Đã kết nối",
      chat: "Trò chuyện",
      goals: "Mục tiêu",
      subjects: "Môn học"
    },
    connections: {
      title: "Kết nối của tôi",
      incoming: "Lời mời nhận được",
      outgoing: "Lời mời đã gửi",
      accepted: "Bạn học của tôi",
      accept: "Chấp nhận",
      decline: "Từ chối",
      cancel: "Hủy lời mời",
      chat: "Trò chuyện",
      emptyIncoming: "Chưa có lời mời nào.",
      emptyOutgoing: "Bạn chưa gửi lời mời nào.",
      emptyAccepted: "Chưa có bạn học. Hãy gửi lời mời kết nối!"
    },
    chat: {
      title: "Trò chuyện",
      empty: "Chưa có cuộc trò chuyện. Kết nối với bạn học để bắt đầu!",
      placeholder: "Nhập tin nhắn...",
      send: "Gửi",
      schedule: "Đặt lịch học",
      noMessages: "Hãy gửi lời chào đầu tiên!"
    },
    sessions: {
      title: "Lịch học",
      newTitle: "Đặt lịch học mới",
      sessionName: "Tiêu đề buổi học",
      subject: "Môn học",
      dateTime: "Thời gian",
      duration: "Thời lượng (phút)",
      mode: "Hình thức",
      location: "Địa điểm / Link học online",
      notes: "Ghi chú",
      create: "Tạo lịch",
      upcoming: "Sắp diễn ra",
      past: "Đã qua",
      with: "với",
      cancel: "Hủy buổi học",
      cancelled: "Đã hủy",
      empty: "Chưa có lịch học nào."
    },
    common: {
      loading: "Đang tải...",
      close: "Đóng",
      error: "Đã có lỗi xảy ra, vui lòng thử lại."
    }
  },
  en: {
    nav: {
      dashboard: "For you",
      search: "Search",
      connections: "Connections",
      chat: "Chat",
      sessions: "Sessions",
      profile: "Profile",
      login: "Log in",
      register: "Sign up",
      logout: "Log out"
    },
    landing: {
      heroTitle: "Find your perfect study partner",
      heroSubtitle:
        "StudyBuddy connects you with people who study the same subjects and share your goals — online or in person in your city.",
      ctaStart: "Get started free",
      ctaLogin: "I already have an account",
      f1Title: "Smart matching",
      f1Desc: "Partner suggestions based on your subjects, major, city, and free time.",
      f2Title: "Safe connections",
      f2Desc: "Send a connection request — chat only when both sides agree.",
      f3Title: "Study with a plan",
      f3Desc: "Chat and schedule study sessions right inside the app."
    },
    auth: {
      loginTitle: "Log in",
      registerTitle: "Create an account",
      name: "Full name",
      email: "Email",
      password: "Password",
      loginBtn: "Log in",
      registerBtn: "Sign up",
      noAccount: "Don't have an account?",
      haveAccount: "Already have an account?",
      registerHere: "Sign up",
      loginHere: "Log in",
      checkEmail: "Success! Check your email to confirm your account, then log in.",
      passwordHint: "At least 6 characters"
    },
    profile: {
      title: "My profile",
      subtitle: "A complete profile gets you better partner suggestions.",
      name: "Full name",
      school: "School",
      major: "Major",
      subjects: "Subjects",
      subjectsHint: "Comma separated, e.g.: Math, English, Programming",
      goals: "Study goals",
      goalsPlaceholder: "E.g.: IELTS 7.0, pass Calculus...",
      availableTime: "Available time",
      mode: "Study mode",
      online: "Online",
      offline: "In person",
      both: "Both",
      city: "City",
      save: "Save profile",
      saved: "Profile saved!"
    },
    time: {
      morning: "Morning",
      afternoon: "Afternoon",
      evening: "Evening",
      weekend: "Weekend"
    },
    dashboard: {
      title: "Recommended study partners",
      subtitle: "Based on your subjects, major, city, and free time.",
      completeProfile: "Complete your profile to get better recommendations.",
      completeProfileBtn: "Complete profile",
      empty: "No matches yet. Check back soon!"
    },
    search: {
      title: "Find study partners",
      subject: "Subject",
      major: "Major",
      city: "City",
      mode: "Mode",
      time: "Available time",
      any: "Any",
      results: "results",
      noResults: "No one matches these filters."
    },
    card: {
      connect: "Connect",
      pending: "Request sent",
      respond: "Awaiting your reply",
      connected: "Connected",
      chat: "Chat",
      goals: "Goals",
      subjects: "Subjects"
    },
    connections: {
      title: "My connections",
      incoming: "Incoming requests",
      outgoing: "Sent requests",
      accepted: "My study partners",
      accept: "Accept",
      decline: "Decline",
      cancel: "Cancel request",
      chat: "Chat",
      emptyIncoming: "No incoming requests.",
      emptyOutgoing: "You haven't sent any requests.",
      emptyAccepted: "No partners yet. Send a connection request!"
    },
    chat: {
      title: "Chat",
      empty: "No conversations yet. Connect with a partner to start!",
      placeholder: "Type a message...",
      send: "Send",
      schedule: "Schedule session",
      noMessages: "Say hi first!"
    },
    sessions: {
      title: "Study sessions",
      newTitle: "Schedule a study session",
      sessionName: "Session title",
      subject: "Subject",
      dateTime: "Date & time",
      duration: "Duration (minutes)",
      mode: "Mode",
      location: "Location / online link",
      notes: "Notes",
      create: "Create session",
      upcoming: "Upcoming",
      past: "Past",
      with: "with",
      cancel: "Cancel session",
      cancelled: "Cancelled",
      empty: "No sessions yet."
    },
    common: {
      loading: "Loading...",
      close: "Close",
      error: "Something went wrong, please try again."
    }
  }
} as const;
