export const ROUTES = {
  auth: {
    SIGNIN: "/signin",
    SIGNUP: "/signup",
    SIGNUP_SELECT: "/signup?step=select",
    SIGNUP_PICK_OPTION: "/signup?step=pick-option",
    SIGNUP_DETAIL: "/signup?step=detail",
    SIGNUP_PREVIEW: "/signup?step=preview",
    SIGNUP_COMPLETE: "/signup?step=complete",
  },
  rank: {
    ROOT: "/rank",
    DEVELOPMENT: "/rank?category=development",
    MARKETING_CONTENT: "/rank?category=marketing_content",
    DESIGN: "/rank?category=design",
    SERVICE_PLANNING: "/rank?category=service_planning",
    HR: "/rank?category=hr",
    ETC: "/rank?category=etc",
    BACKEND: "/rank?category=backend",
    FRONTEND: "/rank?category=frontend",
    SERVER: "/rank?category=server",
    SNS_MARKETING: "/rank?category=sns_marketing",
  },
  /**
   * 사내 정적 FAQ 페이지 (public/terms/faq.html) — 새 탭으로 연다.
   */
  question: {
    ROOT: "/terms/faq.html",
  },
  search: {
    ROOT: "/search",
  },
  community: {
    ROOT: "/community",
    DETAIL: (id: string) => `/community/${id}`,
    DEVELOPMENT: "/community?category=development",
    MARKETING_CONTENT: "/community?category=marketing_content",
    DESIGN: "/community?category=design",
    SERVICE_PLANNING: "/community?category=service_planning",
    HR: "/community?category=hr",
    ETC: "/community?category=etc",
    BACKEND: "/community?category=backend",
    FRONTEND: "/community?category=frontend",
    SERVER: "/community?category=server",
    SNS_MARKETING: "/community?category=sns_marketing",
  },
  prompt: {
    DETAIL: (id: string) => `/prompt/${id}`,
    WRITE: "/prompt/write",
    EDIT: (id: string) => `/prompt/${id}/edit`,
  },
  mypage: {
    ROOT: "/mypage",
    PROFILE: "/mypage?tab=profile",
    ACTIVITY: "/mypage?tab=activity",
    LIKED: "/mypage?tab=activity&sub=liked",
    POSTED: "/mypage?tab=activity&sub=posted",
  },
  admin: {
    ROOT: "/admin",
    DASHBOARD: "/admin?tab=dashboard",
    PROMPTS: "/admin?tab=prompts",
    USERS: "/admin?tab=users",
    CATEGORIES: "/admin?tab=categories",
    NOTICES: "/admin?tab=notices",
  },
} as const;
