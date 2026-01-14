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
    SERVICE_PLANNING: "/rank?category=service_planning",
    HR_GENERAL_AFFAIRS: "/rank?category=hr_general_affairs",
    DESIGN: "/rank?category=design",
  },
  /**
   * 외부 노션 링크 이동
   */
  question: {
    ROOT: "/",
  },
  search: {
    ROOT: "/search",
  },
  community: {
    ROOT: "/community",
    WRITE: "/community/write",
    DETAIL: (id: string) => `/community/${id}`,
    EDIT: (id: string) => `/community/${id}/edit`,
    DEVELOPMENT: "/community?category=development",
    MARKETING_CONTENT: "/community?category=marketing_content",
    SERVICE_PLANNING: "/community?category=service_planning",
    HR_GENERAL_AFFAIRS: "/community?category=hr_general_affairs",
    DESIGN: "/community?category=design",
  },
  mypage: {
    ROOT: "/mypage",
    PROFILE: "/mypage?tab=profile",
    ACTIVITY: "/mypage?tab=activity",
    LIKED: "/mypage?tab=activity&sub=liked",
    POSTED: "/mypage?tab=activity&sub=posted",
  },
} as const;
