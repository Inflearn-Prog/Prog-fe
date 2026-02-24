import { Mail, User } from "lucide-react";
import Image from "next/image";

import { STATIC_IMAGES } from "@/lib/static-image";
import { cn } from "@/lib/utils";

import { ProfIcon } from "../profile-icon/profile-icon";
import { AuthProvider } from "./types";

const CLASSES = {
  CONTAINER:
    "flex flex-col gap-5 p-6 border border-gray-100 bg-gray-0 rounded-10 shadow-md",
  AVATAR_WRAPPER: "flex-center",
  INFO_LIST: "flex flex-col gap-3",
  INFO_ITEM:
    "flex gap-2 text-gray-500 py-2 px-4 border border-gray-50 rounded-5",
  PROVIDER_BADGE: "flex-center py-[10px] px-4 gap-2 shadow-md rounded-[6px]",
  PROVIDER_TEXT: "label-medium !font-bold",
} as const;

interface userProfileProps {
  nickname: string;
  email: string;
  profileImage: string;
  provider: AuthProvider.KAKAO | AuthProvider.NAVER;
  introduction: string;
}

export default function UserProfile({
  nickname,
  profileImage,
  email,
  provider,
  introduction,
}: userProfileProps) {
  const getTheme = () => {
    switch (provider) {
      case "NAVER":
        return {
          bg: "bg-naver",
          label: "네이버",
          image: STATIC_IMAGES.naver,
        };
      case "KAKAO":
      default:
        return {
          bg: "bg-kakao",
          label: "카카오",
          image: STATIC_IMAGES.kakao,
        };
    }
  };
  const theme = getTheme();

  return (
    <div className={CLASSES.CONTAINER}>
      {/* 프로필 이미지 */}
      <div className={CLASSES.AVATAR_WRAPPER}>
        <ProfIcon
          src={profileImage}
          width={120}
          height={120}
          alt={nickname}
          fallback={nickname}
        />
      </div>

      {/* 정보 리스트 */}
      <div className={CLASSES.INFO_LIST}>
        <div className={CLASSES.INFO_ITEM}>
          <User size={20} />
          <p>{nickname}</p>
        </div>
        <div className={CLASSES.INFO_ITEM}>
          <Mail size={20} />
          <p>{email}</p>
        </div>
        <div className={cn(CLASSES.INFO_ITEM, "min-h-[94px]")}>
          <p>{introduction || "등록된 소개글이 없습니다."}</p>
        </div>
      </div>

      {/* 계정 연결 정보 배지 */}
      <div className={cn(CLASSES.PROVIDER_BADGE, theme.bg)}>
        <Image
          src={theme.image.src}
          alt={theme.label}
          width={theme.image.width}
          height={theme.image.height}
        />
        <p className={CLASSES.PROVIDER_TEXT}>{theme.label} 계정 연결됨</p>
      </div>
    </div>
  );
}
