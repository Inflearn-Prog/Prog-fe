export const NAVER_AUTH_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID as string,
  redirectUri: process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI as string,
  authUrl: (state: string): string => 
    `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI}&state=${state}`,
};

export const KAKAO_AUTH_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID as string,
  redirectUri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI as string,
  authUrl: `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`,
};