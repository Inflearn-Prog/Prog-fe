export const ROUTES = {
  auth: {
    SIGNIN: "/signin",
    SIGNUP: "/signup",
    SIGNUP_SELECT: "/signup/step=select",
    SIGNUP_PICK_OPTION: "/signup/step=pick-option",
    SIGNUP_DETAIL: "/signup/step=detail",
    SIGNUP_PREVIEW: "/signup/step=preview",
    SIGNUP_COMPLETE: "/signup/step=complete",
  },
  rank: {
    ROOT: "/rank",
  },
  search: {
    ROOT: "/search",
  },
  community: {
    ROOT: "/community",
    WRITE: "/community/write",
    DETAIL: (id: string) => `/community/${id}`,
    EDIT: (id: string) => `/community/${id}/edit`,
  },
  mypage: {
    ROOT: "/mypage",
    PROFILE: "/mypage?tap=profile",
    ACTIVITY: "/mypage?tap=activity",
    LIKED: "/mypage?tap=activity&sub=liked",
    POSTED: "/mypage?tap=activity&sub=posted",
  },
} as const;
